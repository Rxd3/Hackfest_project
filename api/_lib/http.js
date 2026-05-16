export function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

export function sendError(res, status, message, details) {
  sendJson(res, status, { error: message, details });
}

export async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

export function methodNotAllowed(res, methods = ["GET"]) {
  res.setHeader("Allow", methods.join(", "));
  sendError(res, 405, "Method not allowed");
}
