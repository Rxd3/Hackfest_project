export const ACCEPTED_MATERIAL_FILE_TYPES = ".pdf,.docx,.pptx,.txt,.md,.markdown";

export const SCANNED_PDF_MESSAGE =
  "This PDF appears to be scanned. Please upload a text-based PDF or enable OCR support.";

const PDF_MAX_BYTES = 25 * 1024 * 1024;
const MATERIAL_MAX_BYTES = 40 * 1024 * 1024;
const MAX_EXTRACTED_TEXT_CHARS = 180000;
const CHUNK_CHAR_LIMIT = 6000;

const SUPPORTED_EXTENSIONS = new Set(["pdf", "docx", "pptx", "txt", "md", "markdown"]);
const MIME_EXTENSION_MAP = new Map([
  ["application/pdf", "pdf"],
  ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "docx"],
  ["application/vnd.openxmlformats-officedocument.presentationml.presentation", "pptx"],
  ["text/plain", "txt"],
  ["text/markdown", "md"],
]);

export function validateMaterialFile(file) {
  if (!file) {
    throw new Error("Choose a file to upload.");
  }

  if (!file.size) {
    throw new Error(`${file.name || "This file"} is empty. Please upload a file with readable content.`);
  }

  const extension = getMaterialFileExtension(file);
  if (!SUPPORTED_EXTENSIONS.has(extension)) {
    throw new Error(`${file.name} is not supported. Upload PDF, DOCX, PPTX, TXT, or Markdown files.`);
  }

  const maxBytes = extension === "pdf" ? PDF_MAX_BYTES : MATERIAL_MAX_BYTES;
  if (file.size > maxBytes) {
    const label = extension === "pdf" ? "PDFs" : "Uploaded files";
    throw new Error(`${file.name} is too large. ${label} must be ${formatFileSize(maxBytes)} or smaller.`);
  }

  return extension;
}

export async function extractLocalFileContext(file, { onStatus } = {}) {
  const extension = validateMaterialFile(file);
  const base = {
    name: file.name,
    size: file.size,
    type: file.type || "",
    fileType: materialTypeLabel(extension),
    extension,
  };

  if (["txt", "md", "markdown"].includes(extension)) {
    onStatus?.("Reading text material...");
    const text = cleanExtractedText(await file.text());
    ensureReadableText(text, file.name);
    return buildContext({ ...base, text });
  }

  if (extension === "docx") {
    onStatus?.("Reading DOCX material...");
    const mammoth = await loadMammoth();
    const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    const text = cleanExtractedText(result.value || "");
    ensureReadableText(text, file.name);
    return buildContext({ ...base, text });
  }

  if (extension === "pptx") {
    onStatus?.("Reading PPTX slides...");
    const text = cleanExtractedText(await extractPptxText(await file.arrayBuffer()));
    ensureReadableText(text, file.name);
    return buildContext({ ...base, text });
  }

  onStatus?.("Reading PDF pages...");
  return extractPdfContext(file, base, onStatus);
}

export function getMaterialFileExtension(file) {
  const nameExtension = String(file?.name || "").split(".").pop()?.toLowerCase() || "";
  if (SUPPORTED_EXTENSIONS.has(nameExtension)) return nameExtension;
  return MIME_EXTENSION_MAP.get(file?.type || "") || nameExtension;
}

export function materialTypeLabel(extensionOrFile) {
  const extension = typeof extensionOrFile === "string" ? extensionOrFile : getMaterialFileExtension(extensionOrFile);
  if (extension === "pdf") return "PDF";
  if (extension === "docx") return "DOCX";
  if (extension === "pptx") return "PPTX";
  if (["md", "markdown"].includes(extension)) return "Markdown";
  if (extension === "txt") return "TXT";
  return "File";
}

export function formatFileSize(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(kb >= 10 ? 0 : 1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(mb >= 10 ? 0 : 1)} MB`;
}

async function extractPdfContext(file, base, onStatus) {
  let pdf;
  try {
    const pdfjs = await loadPdfJs();
    const data = new Uint8Array(await file.arrayBuffer());
    pdf = await pdfjs.getDocument({ data, useSystemFonts: true }).promise;
  } catch (error) {
    throw new Error(pdfReadErrorMessage(error));
  }

  const pageCount = pdf.numPages;
  const pages = [];
  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
    onStatus?.(`Reading PDF page ${pageNumber} of ${pageCount}...`);
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent({ disableCombineTextItems: false });
    const pageText = cleanPdfPageText(content.items || []);
    if (pageText) {
      pages.push({ page: pageNumber, text: pageText });
    }
    page.cleanup?.();
  }
  pdf.cleanup?.();
  await pdf.destroy?.();

  const totalText = pages.map((page) => page.text).join("\n").trim();
  if (!totalText) {
    throw new Error(SCANNED_PDF_MESSAGE);
  }

  ensureReadableText(totalText, file.name);
  const pageLabeledText = pages.map((page) => `Page ${page.page}:\n${page.text}`).join("\n\n");
  onStatus?.("Extracting key topics...");

  return buildContext({
    ...base,
    pageCount,
    pages,
    text: limitText(pageLabeledText, MAX_EXTRACTED_TEXT_CHARS),
    truncated: pageLabeledText.length > MAX_EXTRACTED_TEXT_CHARS,
  });
}

async function extractPptxText(arrayBuffer) {
  const JSZip = await loadJSZip();
  const zip = await JSZip.loadAsync(arrayBuffer);
  const slideEntries = Object.keys(zip.files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const slides = [];
  for (const entry of slideEntries) {
    const slideNumber = Number(entry.match(/slide(\d+)\.xml$/)?.[1] || slides.length + 1);
    const xml = await zip.files[entry].async("text");
    const slideText = [...xml.matchAll(/<a:t>(.*?)<\/a:t>/g)].map((match) => decodeXml(match[1])).join(" ");
    if (slideText.trim()) {
      slides.push(`Slide ${slideNumber}:\n${slideText}`);
    }
  }

  return slides.join("\n\n");
}

function buildContext(context) {
  const text = limitText(cleanExtractedText(context.text), MAX_EXTRACTED_TEXT_CHARS);
  return {
    ...context,
    text,
    chunks: chunkContextText(text),
  };
}

function chunkContextText(text) {
  const chunks = [];
  const pageSections = splitPageSections(text);

  if (pageSections.length) {
    let current = "";
    let firstPage = pageSections[0].page;
    let lastPage = pageSections[0].page;

    for (const section of pageSections) {
      const next = `${section.label}\n${section.text}`.trim();
      if (current && current.length + next.length + 2 > CHUNK_CHAR_LIMIT) {
        chunks.push({ text: current.trim(), pageRange: pageRangeLabel(firstPage, lastPage) });
        current = "";
        firstPage = section.page;
      }
      current = `${current}\n\n${next}`.trim();
      lastPage = section.page;
    }

    if (current) {
      chunks.push({ text: current.trim(), pageRange: pageRangeLabel(firstPage, lastPage) });
    }

    return chunks;
  }

  const paragraphs = text.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);
  let current = "";
  for (const paragraph of paragraphs.length ? paragraphs : [text]) {
    if (current && current.length + paragraph.length + 2 > CHUNK_CHAR_LIMIT) {
      chunks.push({ text: current.trim() });
      current = "";
    }
    current = `${current}\n\n${paragraph}`.trim();
  }
  if (current) chunks.push({ text: current.trim() });
  return chunks;
}

function splitPageSections(text) {
  const matches = [...text.matchAll(/^Page\s+(\d+):\n([\s\S]*?)(?=^Page\s+\d+:\n|\s*$)/gm)];
  return matches
    .map((match) => ({
      page: Number(match[1]),
      label: `Page ${match[1]}:`,
      text: match[2].trim(),
    }))
    .filter((section) => section.text);
}

function pageRangeLabel(firstPage, lastPage) {
  return firstPage === lastPage ? `Page ${firstPage}` : `Pages ${firstPage}-${lastPage}`;
}

function cleanPdfPageText(items) {
  const lines = [];
  let currentLine = [];
  let lastY = null;

  for (const item of items) {
    const raw = String(item.str || "").replace(/\s+/g, " ").trim();
    if (!raw) continue;

    const y = Number(item.transform?.[5] || 0);
    const startsNewLine = lastY !== null && Math.abs(y - lastY) > 4;
    if (startsNewLine && currentLine.length) {
      lines.push(currentLine.join(" "));
      currentLine = [];
    }

    currentLine.push(raw);
    lastY = y;

    if (item.hasEOL && currentLine.length) {
      lines.push(currentLine.join(" "));
      currentLine = [];
      lastY = null;
    }
  }

  if (currentLine.length) lines.push(currentLine.join(" "));
  return cleanExtractedText(lines.join("\n"));
}

function cleanExtractedText(value = "") {
  return String(value)
    .replace(/\u00a0/g, " ")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/([A-Za-z\u00c0-\u024f])-\n\s*([A-Za-z\u00c0-\u024f])/g, "$1$2")
    .replace(/[ \t]*\n[ \t]*/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function ensureReadableText(text, fileName) {
  const meaningful = String(text || "").replace(/\s+/g, "");
  if (!meaningful) {
    throw new Error(`${fileName} has no extractable text.`);
  }
  if (meaningful.length < 40) {
    throw new Error(`${fileName} does not contain enough readable text to generate a course.`);
  }
}

function limitText(text, maxChars) {
  if (text.length <= maxChars) return text;
  return `${text.slice(0, maxChars).trim()}\n\n[Material truncated safely because the extracted text is very long.]`;
}

function pdfReadErrorMessage(error) {
  const message = String(error?.message || "");
  if (/password/i.test(message)) {
    return "This PDF is password-protected. Please upload an unlocked text-based PDF.";
  }
  if (/invalid|corrupt|missing pdf/i.test(message)) {
    return "This PDF cannot be read. Please upload a valid text-based PDF.";
  }
  return "The PDF could not be read. Please upload a valid text-based PDF.";
}

async function loadPdfJs() {
  const [pdfjs, worker] = await Promise.all([
    import("pdfjs-dist/legacy/build/pdf.mjs"),
    import("pdfjs-dist/legacy/build/pdf.worker.min.mjs?url"),
  ]);
  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
  }
  return pdfjs;
}

async function loadMammoth() {
  const module = await import("mammoth");
  return module.default || module;
}

async function loadJSZip() {
  const module = await import("jszip");
  return module.default || module;
}

function decodeXml(value) {
  return value.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
}
