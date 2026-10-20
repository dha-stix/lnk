export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/** The host people see in their link, e.g. "lnk.to". */
export const siteHost = new URL(siteUrl).host;

export const profilePath = (username: string) => `/@${username}`;
export const profileUrl = (username: string) => `${siteUrl}${profilePath(username)}`;
