import { getState, setState } from "./status.js";

export default function handler(req, res) {
  const apiKey = process.env.OWNER_API_KEY;

  // Validasi kunci
  const headerKey = req.headers["x-api-key"];
  if (!headerKey || headerKey !== apiKey) {
    return res.status(403).json({ error: "Forbidden: invalid API key" });
  }

  // Ambil body (JSON)
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST method" });
  }

  try {
    const { enabled, reason } = req.body || {};
    setState({ enabled, reason });
    return res.status(200).json({ success: true, newState: getState() });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
