import fs from "fs";
import path from "path";

const STATE_FILE = path.join("/tmp", "state.json");

function readState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  } catch {
    return { enabled: true, reason: "", updatedAt: new Date().toISOString() };
  }
}

function writeState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

export default async function handler(req, res) {
  const key = req.headers["x-api-key"];
  const OWNER_API_KEY = process.env.OWNER_API_KEY;

  if (req.method === "GET") {
    const state = readState();
    return res.status(200).json({ ok: true, ...state });
  }

  if (req.method === "POST") {
    if (!key || key !== OWNER_API_KEY)
      return res.status(401).json({ ok: false, error: "unauthorized" });

    const body = req.body || {};
    const enabled = body.enabled === true || body.enabled === "true";
    const reason = body.reason || (enabled ? "" : "disabled by owner");

    const state = { enabled, reason, updatedAt: new Date().toISOString() };
    writeState(state);
    return res.status(200).json({ ok: true, state });
  }

  return res.status(405).json({ ok: false, error: "method not allowed" });
}
