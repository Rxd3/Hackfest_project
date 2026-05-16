import fs from "node:fs/promises";
import path from "node:path";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import JSZip from "jszip";

const SUPPORTED_EXTENSIONS = new Set([".txt", ".md", ".pdf", ".docx", ".pptx"]);

export function assertSupportedFile(fileName = "") {
  const extension = path.extname(fileName).toLowerCase();

  if (!SUPPORTED_EXTENSIONS.has(extension)) {
    const error = new Error("Unsupported file type. Upload PDF, DOCX, PPTX, TXT, or Markdown.");
    error.status = 400;
    throw error;
  }

  return extension;
}

export async function extractTextFromUpload(file) {
  const originalName = file.originalFilename || file.newFilename || "material";
  const extension = assertSupportedFile(originalName);
  const buffer = await fs.readFile(file.filepath);

  if (extension === ".txt" || extension === ".md") {
    return normalizeWhitespace(buffer.toString("utf8"));
  }

  if (extension === ".pdf") {
    const parser = new PDFParse({ data: buffer });
    try {
      const result = await parser.getText();
      return normalizeWhitespace(result.text || "");
    } finally {
      await parser.destroy();
    }
  }

  if (extension === ".docx") {
    const result = await mammoth.extractRawText({ buffer });
    return normalizeWhitespace(result.value || "");
  }

  if (extension === ".pptx") {
    return extractPptxText(buffer);
  }

  return "";
}

async function extractPptxText(buffer) {
  const zip = await JSZip.loadAsync(buffer);
  const slideEntries = Object.keys(zip.files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const slideText = [];

  for (const entry of slideEntries) {
    const xml = await zip.files[entry].async("text");
    const matches = [...xml.matchAll(/<a:t>(.*?)<\/a:t>/g)].map((match) => decodeXml(match[1]));
    if (matches.length) {
      slideText.push(matches.join(" "));
    }
  }

  return normalizeWhitespace(slideText.join("\n"));
}

function decodeXml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

export function normalizeWhitespace(text) {
  return text.replace(/\s+/g, " ").trim();
}

export function chunkText(text, chunkSize = 1800, overlap = 180) {
  const clean = normalizeWhitespace(text);
  if (!clean) {
    return [];
  }

  const chunks = [];
  let start = 0;

  while (start < clean.length) {
    const end = Math.min(clean.length, start + chunkSize);
    chunks.push(clean.slice(start, end));
    if (end === clean.length) {
      break;
    }
    start = Math.max(0, end - overlap);
  }

  return chunks;
}
