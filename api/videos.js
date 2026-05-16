import { readJsonBody, sendError, sendJson } from "./_lib/http.js";
import { getSupabaseAdmin, requireUser } from "./_lib/supabaseAdmin.js";

export default async function handler(req, res) {
  if (!["GET", "POST"].includes(req.method)) {
    return sendError(res, 405, "Method not allowed");
  }

  try {
    const user = await requireUser(req);
    const input = req.method === "GET" ? req.query : await readJsonBody(req);
    const moduleId = input.moduleId;

    if (!moduleId) {
      return sendError(res, 400, "Missing moduleId");
    }

    const supabase = getSupabaseAdmin();
    const { data: module, error: moduleError } = await supabase
      .from("modules")
      .select("*, courses(title)")
      .eq("user_id", user.id)
      .eq("id", moduleId)
      .single();

    if (moduleError) {
      throw moduleError;
    }

    const { data: cached } = await supabase
      .from("videos")
      .select("*")
      .eq("user_id", user.id)
      .eq("module_id", moduleId)
      .order("created_at", { ascending: true });

    if (cached?.length) {
      return sendJson(res, 200, { videos: cached, cached: true });
    }

    if (!process.env.YOUTUBE_API_KEY) {
      return sendJson(res, 200, {
        videos: [],
        cached: false,
        message: "YouTube API key is not configured yet.",
      });
    }

    const videos = await searchYouTube(`${module.courses?.title || ""} ${module.title} tutorial`);
    if (!videos.length) {
      return sendJson(res, 200, { videos: [], cached: false });
    }

    const rows = videos.map((video) => ({
      user_id: user.id,
      course_id: module.course_id,
      module_id: module.id,
      title: video.title,
      url: video.url,
      thumbnail_url: video.thumbnailUrl,
      channel_title: video.channelTitle,
      source: "youtube",
    }));

    const { data: inserted, error: insertError } = await supabase.from("videos").insert(rows).select();
    if (insertError) {
      throw insertError;
    }

    return sendJson(res, 200, { videos: inserted || [], cached: false });
  } catch (error) {
    return sendError(res, error.status || 500, error.message || "Failed to load videos");
  }
}

async function searchYouTube(query) {
  const params = new URLSearchParams({
    key: process.env.YOUTUBE_API_KEY,
    part: "snippet",
    q: query,
    maxResults: "3",
    type: "video",
    safeSearch: "strict",
    videoEmbeddable: "true",
  });

  const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${params.toString()}`);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload?.error?.message || "YouTube search failed");
  }

  return (payload.items || []).map((item) => ({
    title: item.snippet?.title || "Recommended video",
    channelTitle: item.snippet?.channelTitle || "YouTube",
    thumbnailUrl: item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || "",
    url: `https://www.youtube.com/watch?v=${item.id?.videoId}`,
  }));
}
