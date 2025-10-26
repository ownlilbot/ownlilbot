let botState = { enabled: true, reason: null };

export default function handler(req, res) {
  return res.status(200).json(botState);
}

export function getState() {
  return botState;
}

export function setState(newState) {
  botState = { ...botState, ...newState };
}
