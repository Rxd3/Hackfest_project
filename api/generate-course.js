import fs from "node:fs/promises";
import formidable from "formidable";
import { buildCoursePrompt, cardColorFor, fallbackCourse, normalizeCourse } from "./_lib/courseGenerator.js";
import { chunkText, extractTextFromUpload } from "./_lib/fileParsing.js";
import { embedText, generateJson, hasGeminiKey } from "./_lib/gemini.js";
import { sendError, sendJson } from "./_lib/http.js";
import { getSupabaseAdmin, requireUser } from "./_lib/supabaseAdmin.js";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendError(res, 405, "Method not allowed");
  }

  try {
    const user = await requireUser(req);
    const { fields, files } = await parseMultipart(req);
    const topic = readField(fields.topic);
    const level = readField(fields.level) || "Beginner";
    const duration = readField(fields.duration) || "1 Month";
    const goal = readField(fields.goal) || "Full Course";
    const uploads = normalizeFiles(files.materials);

    if (!topic && uploads.length === 0) {
      return sendError(res, 400, "Add a topic or upload at least one material.");
    }

    const extractedFiles = [];

    for (const file of uploads) {
      const text = await extractTextFromUpload(file);
      if (!text) {
        return sendError(res, 400, `Could not extract readable text from ${file.originalFilename || "one upload"}.`);
      }
      extractedFiles.push({ file, text });
    }

    const materialText = extractedFiles
      .map((item) => `File: ${item.file.originalFilename}\n${item.text}`)
      .join("\n\n")
      .slice(0, 50000);

    let generated;
    let usedFallback = false;

    if (hasGeminiKey()) {
      try {
        generated = normalizeCourse(await generateJson(buildCoursePrompt({ topic, materialText, level, duration, goal })));
      } catch (error) {
        usedFallback = true;
        generated = fallbackCourse({ topic, materialText, level, duration, goal });
      }
    } else {
      usedFallback = true;
      generated = fallbackCourse({ topic, materialText, level, duration, goal });
    }

    const supabase = getSupabaseAdmin();
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .insert({
        user_id: user.id,
        title: generated.title,
        description: generated.description,
        level,
        duration,
        goal,
        source_type: uploads.length ? "file" : "topic",
        source_label: topic || uploads.map((file) => file.originalFilename).join(", "),
        source_file: uploads[0]?.originalFilename || null,
        estimated_time: generated.estimatedTime,
        learning_outcomes: generated.learningOutcomes,
        card_color: cardColorFor(Date.now()),
      })
      .select()
      .single();

    if (courseError) {
      throw courseError;
    }

    const sourceRows = [];

    if (topic) {
      sourceRows.push({
        user_id: user.id,
        course_id: course.id,
        kind: "topic",
        text_excerpt: topic,
      });
    }

    for (const item of extractedFiles) {
      const fileName = sanitizeFileName(item.file.originalFilename || "material.txt");
      const storagePath = `${user.id}/${course.id}/${Date.now()}-${fileName}`;
      const buffer = await fs.readFile(item.file.filepath);
      const { error: uploadError } = await supabase.storage.from("materials").upload(storagePath, buffer, {
        contentType: item.file.mimetype || "application/octet-stream",
        upsert: true,
      });

      if (uploadError) {
        throw uploadError;
      }

      sourceRows.push({
        user_id: user.id,
        course_id: course.id,
        kind: "file",
        file_path: storagePath,
        file_name: item.file.originalFilename,
        mime_type: item.file.mimetype,
        text_excerpt: item.text.slice(0, 2000),
      });
    }

    const insertedSources = [];
    if (sourceRows.length) {
      const { data, error } = await supabase.from("course_sources").insert(sourceRows).select();
      if (error) {
        throw error;
      }
      insertedSources.push(...data);
    }

    await saveModulesAndQuizzes(supabase, user.id, course.id, generated.modules);
    await saveMaterialChunks(supabase, user.id, course.id, insertedSources, topic, extractedFiles);

    return sendJson(res, 200, {
      courseId: course.id,
      fallback: usedFallback,
      message: usedFallback
        ? "Course created with local fallback content because Gemini was unavailable or not configured."
        : "Course generated successfully.",
    });
  } catch (error) {
    return sendError(res, error.status || 500, error.message || "Failed to generate course");
  }
}

async function parseMultipart(req) {
  const form = formidable({
    multiples: true,
    maxFileSize: 12 * 1024 * 1024,
    maxTotalFileSize: 28 * 1024 * 1024,
  });

  const [fields, files] = await form.parse(req);
  return { fields, files };
}

function readField(value) {
  if (Array.isArray(value)) {
    return String(value[0] || "").trim();
  }

  return String(value || "").trim();
}

function normalizeFiles(value) {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function sanitizeFileName(fileName) {
  return fileName.replace(/[^A-Za-z0-9._-]/g, "-");
}

async function saveModulesAndQuizzes(supabase, userId, courseId, modules) {
  const today = new Date();

  for (const [index, module] of modules.entries()) {
    const { data: savedModule, error: moduleError } = await supabase
      .from("modules")
      .insert({
        user_id: userId,
        course_id: courseId,
        position: index + 1,
        title: module.title,
        summary: module.summary,
        explanation: module.explanation,
        key_concepts: module.keyConcepts,
        examples: module.examples,
        practice_tasks: module.practiceTasks,
        estimated_minutes: module.estimatedMinutes,
      })
      .select()
      .single();

    if (moduleError) {
      throw moduleError;
    }

    const { error: lessonError } = await supabase.from("lessons").insert({
      user_id: userId,
      course_id: courseId,
      module_id: savedModule.id,
      content: module.explanation,
    });

    if (lessonError) {
      throw lessonError;
    }

    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .insert({
        user_id: userId,
        course_id: courseId,
        module_id: savedModule.id,
        title: module.quiz.title,
      })
      .select()
      .single();

    if (quizError) {
      throw quizError;
    }

    const questionRows = module.quiz.questions.map((question, questionIndex) => ({
      user_id: userId,
      course_id: courseId,
      module_id: savedModule.id,
      quiz_id: quiz.id,
      position: questionIndex + 1,
      prompt: question.prompt,
      options: question.options,
      correct_option_index: question.correctOptionIndex,
      explanation: question.explanation,
      topic: question.topic,
    }));

    const { error: questionsError } = await supabase.from("quiz_questions").insert(questionRows);
    if (questionsError) {
      throw questionsError;
    }

    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + index);

    const { error: planError } = await supabase.from("study_plan_items").insert({
      user_id: userId,
      course_id: courseId,
      module_id: savedModule.id,
      title: `Module ${index + 1}: ${module.title}`,
      meta: `${module.estimatedMinutes} min lesson + quiz`,
      kind: "lesson",
      due_date: dueDate.toISOString().slice(0, 10),
    });

    if (planError) {
      throw planError;
    }
  }
}

async function saveMaterialChunks(supabase, userId, courseId, insertedSources, topic, extractedFiles) {
  const sourceByName = new Map(insertedSources.map((source) => [source.file_name || source.kind, source]));
  const inputs = [];

  if (topic) {
    inputs.push({ source: sourceByName.get("topic"), text: topic });
  }

  for (const item of extractedFiles) {
    inputs.push({ source: sourceByName.get(item.file.originalFilename), text: item.text });
  }

  for (const input of inputs) {
    const chunks = chunkText(input.text).slice(0, 24);
    const rows = [];

    for (const [index, chunk] of chunks.entries()) {
      let embedding = null;
      if (hasGeminiKey()) {
        try {
          embedding = await embedText(chunk);
        } catch {
          embedding = null;
        }
      }

      rows.push({
        user_id: userId,
        course_id: courseId,
        source_id: input.source?.id || null,
        chunk_index: index,
        content: chunk,
        embedding,
      });
    }

    if (rows.length) {
      const { error } = await supabase.from("material_chunks").insert(rows);
      if (error) {
        throw error;
      }
    }
  }
}
