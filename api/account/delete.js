import { requireUser } from "../_shared/supabase.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { supabase, user } = await requireUser(req);
    await removeCourseMaterialFiles(supabase, user.id);

    const { error } = await supabase.auth.admin.deleteUser(user.id);
    if (error) throw error;

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message || "Account deletion failed" });
  }
}

async function removeCourseMaterialFiles(supabase, userId) {
  const bucket = supabase.storage.from("course-materials");
  const paths = await listStorageFiles(bucket, userId);
  if (!paths.length) return;

  for (let index = 0; index < paths.length; index += 100) {
    const { error } = await bucket.remove(paths.slice(index, index + 100));
    if (error) throw error;
  }
}

async function listStorageFiles(bucket, prefix) {
  const files = [];

  async function walk(folder) {
    const { data, error } = await bucket.list(folder, { limit: 1000 });
    if (error) throw error;

    for (const entry of data || []) {
      const path = `${folder}/${entry.name}`;
      if (entry.id || entry.metadata) {
        files.push(path);
      } else {
        await walk(path);
      }
    }
  }

  await walk(prefix);
  return files;
}
