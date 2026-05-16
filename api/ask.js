import { embedQuery, generateText, hasGeminiKey } from "./_lib/gemini.js";
import { readJsonBody, sendError, sendJson } from "./_lib/http.js";
import { getSupabaseAdmin, requireUser } from "./_lib/supabaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendError(res, 405, "Method not allowed");
  }

  try {
    const user = await requireUser(req);
    const body = await readJsonBody(req);
    const message = String(body.message || "").trim();
    const courseId = body.courseId || null;
    const moduleId = body.moduleId || null;

    if (!message) {
      return sendError(res, 400, "Ask a question first.");
    }

    const supabase = getSupabaseAdmin();
    const [courseResult, moduleResult, lessonResult, historyResult] = await Promise.all([
      courseId
        ? supabase.from("courses").select("*").eq("user_id", user.id).eq("id", courseId).maybeSingle()
        : Promise.resolve({ data: null }),
      moduleId
        ? supabase.from("modules").select("*").eq("user_id", user.id).eq("id", moduleId).maybeSingle()
        : Promise.resolve({ data: null }),
      moduleId
        ? supabase.from("lessons").select("*").eq("user_id", user.id).eq("module_id", moduleId).maybeSingle()
        : Promise.resolve({ data: null }),
      supabase
        .from("ai_messages")
        .select("role, content")
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .order("created_at", { ascending: false })
        .limit(6),
    ]);

    const contextChunks = await getRelevantChunks(supabase, user.id, courseId, message);
    const fallbackContext = [
      courseResult.data ? `Course: ${courseResult.data.title}\n${courseResult.data.description || ""}` : "",
      moduleResult.data ? `Module: ${moduleResult.data.title}\n${moduleResult.data.explanation || ""}` : "",
      lessonResult.data?.content || "",
    ]
      .filter(Boolean)
      .join("\n\n");

    const context = contextChunks.length ? contextChunks.map((chunk) => chunk.content).join("\n\n") : fallbackContext;
    const answer = await answerQuestion({
      message,
      context,
      history: (historyResult.data || []).reverse(),
    });

    await supabase.from("ai_messages").insert([
      {
        user_id: user.id,
        course_id: courseId,
        module_id: moduleId,
        role: "user",
        content: message,
      },
      {
        user_id: user.id,
        course_id: courseId,
        module_id: moduleId,
        role: "assistant",
        content: answer,
      },
    ]);

    return sendJson(res, 200, {
      answer,
      sources: contextChunks.map((chunk) => ({ id: chunk.id, similarity: chunk.similarity })),
    });
  } catch (error) {
    return sendError(res, error.status || 500, error.message || "Failed to answer question");
  }
}

async function getRelevantChunks(supabase, userId, courseId, message) {
  if (!courseId || !hasGeminiKey()) {
    return [];
  }

  try {
    const embedding = await embedQuery(message);
    const { data, error } = await supabase.rpc("match_material_chunks", {
      query_embedding: embedding,
      match_count: 5,
      filter_user_id: userId,
      filter_course_id: courseId,
    });

    if (error) {
      return [];
    }

    return data || [];
  } catch {
    return [];
  }
}

async function answerQuestion({ message, context, history }) {
  if (!hasGeminiKey()) {
    return `I can help with that once Gemini is configured. Based on the available lesson context: ${context.slice(0, 450) || "no course context was found yet."}`;
  }

  const prompt = `
You are CorAI, a concise study assistant.
Answer using the course context. If the answer is not in the context, say what you can infer and suggest what to review.

Recent chat:
${history.map((item) => `${item.role}: ${item.content}`).join("\n")}

Course context:
${context.slice(0, 14000)}

Student question:
${message}
`;

  return generateText(prompt, { temperature: 0.25 });
}
