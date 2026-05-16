import { createClient } from "@supabase/supabase-js";

let adminClient;

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export function getSupabaseAdmin() {
  if (!adminClient) {
    adminClient = createClient(getRequiredEnv("VITE_SUPABASE_URL"), getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY"), {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return adminClient;
}

export async function requireUser(req) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : "";

  if (!token) {
    const error = new Error("Missing bearer token");
    error.status = 401;
    throw error;
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    const authError = new Error("Invalid or expired session");
    authError.status = 401;
    throw authError;
  }

  return data.user;
}
