/**
 * Browser-only flags used by analytics. Every access is wrapped because storage
 * can be blocked (private mode, strict privacy settings).
 */

const ownerKey = (uid: string) => `lnk:owner:${uid}`;

/** Remembers that this browser belongs to the page owner, so their visits aren't counted. */
export function markOwnerBrowser(uid: string) {
  try {
    localStorage.setItem(ownerKey(uid), "1");
  } catch {
    // Storage blocked: the signed-in check still excludes the owner.
  }
}

export function isOwnerBrowser(uid: string) {
  try {
    return localStorage.getItem(ownerKey(uid)) === "1";
  } catch {
    return false;
  }
}

/** True the first time this browser opens the page on a given day. */
export function isFirstVisitToday(uid: string, day: string) {
  const key = `lnk:seen:${uid}:${day}`;
  try {
    if (localStorage.getItem(key)) return false;
    localStorage.setItem(key, "1");
  } catch {
    // Storage blocked: count the visit as unique.
  }
  return true;
}
