export const THRESHOLDS = {
  O2HAR: 9.0,
  UNSERVICEABILITY: 5.0,
};

export const COLORS = {
  SUCCESS: 'bg-success-500',
  ERROR: 'bg-error-500',
  ACCENT: 'bg-accent-500',
  DARK_CARD: 'bg-dark-card',
  DARK_BORDER: 'border-dark-border',
};

export const TEXT_COLORS = {
  WHITE: 'text-white',
  SUCCESS: 'text-success-500',
  ERROR: 'text-error-500',
  ACCENT: 'text-accent-500',
  MUTED: 'text-gray-400',
};

export const MOCK_PROMPTQL_RESPONSES = [
  "Based on the current metrics, I recommend increasing DE allocation by 20% for this pod.",
  "The O2HAR threshold breach suggests we need to implement surge pricing immediately.",
  "Consider calling additional part-time DEs to address the current shortage.",
  "Traffic conditions are affecting delivery times. Suggest alternative routes to DEs.",
  "The unserviceability rate indicates we need to optimize the delivery radius.",
]; 