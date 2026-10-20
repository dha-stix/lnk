export const USERNAME_PATTERN = /^[a-z0-9._]{3,20}$/;

const RESERVED = new Set([
  "admin", "api", "app", "auth", "dashboard", "help", "login", "logout", "lnk", "register",
  "settings", "signin", "signup", "support", "terms", "privacy", "about", "u", "www",
]);

export function normalizeUsername(input: string) {
  return input.trim().replace(/^@/, "").toLowerCase();
}

/** Strips characters that can never appear in a username, for live input. */
export function sanitizeUsernameInput(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9._]/g, "").slice(0, 20);
}

/** Returns an error message, or null when the username is valid. */
export function validateUsername(username: string): string | null {
  if (username.length < 3) return "Use at least 3 characters.";
  if (username.length > 20) return "Use 20 characters or fewer.";
  if (!USERNAME_PATTERN.test(username)) return "Only letters, numbers, dots and underscores.";
  if (/^[._]|[._]$/.test(username)) return "Can't start or end with a dot or underscore.";
  if (/[._]{2}/.test(username)) return "Avoid two dots or underscores in a row.";
  if (RESERVED.has(username)) return "That username is reserved.";
  return null;
}
