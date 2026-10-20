import {
  deleteUser,
  getRedirectResult,
  reauthenticateWithPopup,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type User,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
  type DocumentData,
  type Unsubscribe,
} from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { FirebaseError } from "firebase/app";
import {
  firebaseAuth,
  firebaseConfig,
  firebaseStorage,
  firestore,
  googleProvider,
  isFirebaseConfigured,
} from "./firebase";
import { DEFAULT_APPEARANCE } from "@/lib/themes";
import { isPlatformKey, MAX_WEBSITES, resolvePlatformUrl } from "@/lib/platforms";
import { normalizeUsername, validateUsername } from "@/lib/username";
import { dayKey, largeGooglePhoto, lastDayKeys, normalizeUrl } from "@/lib/utils";
import type {
  DayStats,
  Device,
  ProfileStats,
  ProfileUpdate,
  PublicProfile,
  SocialLink,
  UserProfile,
  Website,
} from "@/lib/types";

const USERS = "users";
const USERNAMES = "usernames";
const STATS = "stats";
const DAYS = "days";

export const BIO_LIMIT = 160;
export const NAME_LIMIT = 50;
const AVATAR_SIZE = 512;
const AVATAR_MAX_BYTES = 8 * 1024 * 1024;

/* -------------------------------------------------------------------------- */
/*                                   Errors                                   */
/* -------------------------------------------------------------------------- */

const AUTH_MESSAGES: Record<string, string> = {
  "auth/popup-closed-by-user": "Sign-in was cancelled.",
  "auth/cancelled-popup-request": "Sign-in was cancelled.",
  "auth/network-request-failed": "Network error. Check your connection and try again.",
  "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  "auth/unauthorized-domain": "This domain isn't authorised in Firebase Authentication yet.",
  "auth/requires-recent-login": "Please sign in again to confirm it's you.",
  "permission-denied": "You don't have permission to do that.",
  unavailable: "We couldn't reach the server. Try again in a moment.",
};

/** Converts any thrown value into a message that's safe to show users. */
export function getErrorMessage(error: unknown, fallback = "Something went wrong. Please try again.") {
  if (error instanceof FirebaseError) return AUTH_MESSAGES[error.code] ?? fallback;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

/* -------------------------------------------------------------------------- */
/*                                    Auth                                    */
/* -------------------------------------------------------------------------- */

export async function signInWithGoogle(): Promise<User | null> {
  const auth = firebaseAuth();
  try {
    const { user } = await signInWithPopup(auth, googleProvider());
    return user;
  } catch (error) {
    // Some mobile browsers block popups; fall back to a full-page redirect.
    if (error instanceof FirebaseError && error.code === "auth/popup-blocked") {
      await signInWithRedirect(auth, googleProvider());
      return null;
    }
    throw error;
  }
}

/** Completes a redirect sign-in started by signInWithGoogle, if there was one. */
export async function completeRedirectSignIn(): Promise<User | null> {
  const result = await getRedirectResult(firebaseAuth());
  return result?.user ?? null;
}

export const signOutUser = () => signOut(firebaseAuth());

/* -------------------------------------------------------------------------- */
/*                                  Profiles                                  */
/* -------------------------------------------------------------------------- */

function toProfile(uid: string, data: DocumentData): UserProfile {
  return {
    uid,
    username: data.username ?? "",
    displayName: data.displayName ?? "",
    bio: data.bio ?? "",
    photoURL: data.photoURL ?? null,
    googlePhotoURL: data.googlePhotoURL ?? null,
    socials: Array.isArray(data.socials) ? data.socials : [],
    websites: Array.isArray(data.websites) ? data.websites : [],
    appearance: { ...DEFAULT_APPEARANCE, ...data.appearance },
    settings: { adultWarning: true, indexable: true, ...data.settings },
  };
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(firestore(), USERS, uid));
  return snap.exists() ? toProfile(uid, snap.data()) : null;
}

export function subscribeToUserProfile(
  uid: string,
  onChange: (profile: UserProfile | null) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    doc(firestore(), USERS, uid),
    (snap) => onChange(snap.exists() ? toProfile(uid, snap.data()) : null),
    onError,
  );
}

export async function isUsernameAvailable(rawUsername: string): Promise<boolean> {
  const username = normalizeUsername(rawUsername);
  if (validateUsername(username)) return false;
  const snap = await getDoc(doc(firestore(), USERNAMES, username));
  return !snap.exists();
}

/** Claims a username and creates the user's page in a single transaction. */
export async function createUserProfile(user: User, rawUsername: string): Promise<UserProfile> {
  const username = normalizeUsername(rawUsername);
  const invalid = validateUsername(username);
  if (invalid) throw new Error(invalid);

  const db = firestore();
  const profile: UserProfile = {
    uid: user.uid,
    username,
    displayName: (user.displayName ?? username).slice(0, NAME_LIMIT),
    bio: "",
    photoURL: null,
    googlePhotoURL: largeGooglePhoto(user.photoURL),
    socials: [],
    websites: [],
    appearance: DEFAULT_APPEARANCE,
    settings: { adultWarning: true, indexable: true },
  };

  await runTransaction(db, async (tx) => {
    const nameRef = doc(db, USERNAMES, username);
    const userRef = doc(db, USERS, user.uid);
    const [nameSnap, userSnap] = await Promise.all([tx.get(nameRef), tx.get(userRef)]);
    if (userSnap.exists()) throw new Error("You already have a Lnk page.");
    if (nameSnap.exists()) throw new Error("That username was just taken. Try another one.");
    tx.set(nameRef, { uid: user.uid, createdAt: serverTimestamp() });
    tx.set(userRef, { ...profile, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    tx.set(doc(db, STATS, user.uid), { views: 0, clicks: 0 });
  });

  return profile;
}

/** Keeps the stored Google photo fresh so it can be the default avatar. */
export async function syncGooglePhoto(user: User, profile: UserProfile) {
  const latest = largeGooglePhoto(user.photoURL);
  if (latest && latest !== profile.googlePhotoURL) {
    await updateDoc(doc(firestore(), USERS, user.uid), { googlePhotoURL: latest });
  }
}

// Half-typed entries are kept (with an empty url) so editing never loses input;
// public pages only render entries whose url resolved.
function cleanSocials(socials: SocialLink[]): SocialLink[] {
  return socials
    .filter((s) => isPlatformKey(s.platform))
    .map((s) => ({
      id: s.id,
      platform: s.platform,
      value: s.value.slice(0, 200),
      url: resolvePlatformUrl(s.platform, s.value) ?? "",
      enabled: Boolean(s.enabled),
    }));
}

function cleanWebsites(websites: Website[]): Website[] {
  return websites.slice(0, MAX_WEBSITES).map((w) => ({
    id: w.id,
    title: w.title.slice(0, 60),
    url: w.url.slice(0, 500),
    enabled: Boolean(w.enabled),
  }));
}

/** Saves profile edits. Only whitelisted fields are written. */
export async function updateUserProfile(uid: string, update: ProfileUpdate) {
  const data: DocumentData = { updatedAt: serverTimestamp() };
  if (update.displayName !== undefined) data.displayName = update.displayName.trim().slice(0, NAME_LIMIT);
  if (update.bio !== undefined) data.bio = update.bio.slice(0, BIO_LIMIT);
  if (update.socials) data.socials = cleanSocials(update.socials);
  if (update.websites) data.websites = cleanWebsites(update.websites);
  if (update.appearance) data.appearance = { ...DEFAULT_APPEARANCE, ...update.appearance };
  if (update.settings) data.settings = update.settings;
  await updateDoc(doc(firestore(), USERS, uid), data);
}

export async function changeUsername(uid: string, current: string, rawNext: string) {
  const next = normalizeUsername(rawNext);
  const invalid = validateUsername(next);
  if (invalid) throw new Error(invalid);
  if (next === current) return next;

  const db = firestore();
  await runTransaction(db, async (tx) => {
    const nextRef = doc(db, USERNAMES, next);
    if ((await tx.get(nextRef)).exists()) throw new Error("That username is taken.");
    tx.set(nextRef, { uid, createdAt: serverTimestamp() });
    tx.delete(doc(db, USERNAMES, current));
    tx.update(doc(db, USERS, uid), { username: next, updatedAt: serverTimestamp() });
  });
  return next;
}

/* -------------------------------------------------------------------------- */
/*                                   Avatars                                  */
/* -------------------------------------------------------------------------- */

// JPEG rather than WebP so the photo also works in generated link-preview images.
const avatarRef = (uid: string) => ref(firebaseStorage(), `avatars/${uid}/avatar.jpg`);

/** Crops to a square and shrinks big photos before upload. */
async function prepareAvatar(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const side = Math.min(bitmap.width, bitmap.height);
  const size = Math.min(side, AVATAR_SIZE);
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser couldn't process that image.");
  // JPEG has no transparency; paint white so see-through PNGs don't turn black.
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, size, size);
  ctx.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, size, size);
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Couldn't read that image."))), "image/jpeg", 0.9),
  );
}

export async function uploadAvatar(uid: string, file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Choose an image file (JPG, PNG or WebP).");
  if (file.size > AVATAR_MAX_BYTES) throw new Error("That image is over 8 MB. Try a smaller one.");
  const blob = await prepareAvatar(file);
  const snapshot = await uploadBytes(avatarRef(uid), blob, { contentType: "image/jpeg" });
  const url = `${await getDownloadURL(snapshot.ref)}&v=${Date.now()}`;
  await updateDoc(doc(firestore(), USERS, uid), { photoURL: url, updatedAt: serverTimestamp() });
  return url;
}

/** Removes the uploaded photo so the Google photo shows again. */
export async function revertToGooglePhoto(uid: string) {
  await updateDoc(doc(firestore(), USERS, uid), { photoURL: null, updatedAt: serverTimestamp() });
  await deleteObject(avatarRef(uid)).catch(() => undefined);
}

/* -------------------------------------------------------------------------- */
/*                         Public pages (server + client)                     */
/* -------------------------------------------------------------------------- */

type RestValue = {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
  nullValue?: null;
  timestampValue?: string;
  mapValue?: { fields?: Record<string, RestValue> };
  arrayValue?: { values?: RestValue[] };
};

function decodeRest(value: RestValue): unknown {
  if (value.stringValue !== undefined) return value.stringValue;
  if (value.integerValue !== undefined) return Number(value.integerValue);
  if (value.doubleValue !== undefined) return value.doubleValue;
  if (value.booleanValue !== undefined) return value.booleanValue;
  if (value.timestampValue !== undefined) return value.timestampValue;
  if (value.mapValue) return decodeFields(value.mapValue.fields ?? {});
  if (value.arrayValue) return (value.arrayValue.values ?? []).map(decodeRest);
  return null;
}

function decodeFields(fields: Record<string, RestValue>) {
  return Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, decodeRest(v)]));
}

async function getRestDoc(path: string): Promise<DocumentData | null> {
  const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/${path}?key=${firebaseConfig.apiKey}`;
  const res = await fetch(url, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Firestore request failed (${res.status})`);
  const json = (await res.json()) as { fields?: Record<string, RestValue> };
  return decodeFields(json.fields ?? {});
}

/**
 * Loads a public page by username through Firestore's REST API, so it works in
 * server components without the client SDK. Returns null for unknown names.
 */
export async function fetchPublicProfile(rawUsername: string): Promise<PublicProfile | null> {
  if (!isFirebaseConfigured) return null;
  let decoded: string;
  try {
    decoded = decodeURIComponent(rawUsername);
  } catch {
    return null; // Malformed %-encoding: treat as not found rather than erroring.
  }
  const username = normalizeUsername(decoded);
  if (validateUsername(username)) return null;

  const claim = await getRestDoc(`${USERNAMES}/${username}`);
  const uid = claim?.uid as string | undefined;
  if (!uid) return null;

  const [user, stats] = await Promise.all([getRestDoc(`${USERS}/${uid}`), getRestDoc(`${STATS}/${uid}`)]);
  if (!user) return null;

  const profile = toProfile(uid, user);
  return {
    profile: {
      ...profile,
      socials: profile.socials.filter((s) => s.enabled && s.url),
      websites: profile.websites.filter((w) => w.enabled && normalizeUrl(w.url)),
    },
    stats: { views: Number(stats?.views ?? 0), clicks: Number(stats?.clicks ?? 0) },
  };
}

/* -------------------------------------------------------------------------- */
/*                                  Analytics                                 */
/* -------------------------------------------------------------------------- */

export function subscribeToStats(uid: string, onChange: (stats: ProfileStats) => void): Unsubscribe {
  return onSnapshot(doc(firestore(), STATS, uid), (snap) => {
    const data = snap.data();
    onChange({ views: Number(data?.views ?? 0), clicks: Number(data?.clicks ?? 0) });
  });
}

type ViewDetails = {
  referrer: string;
  device: Device;
  country?: string | null;
  isUnique: boolean;
};

/** Counts a page view on the running total and today's breakdown. */
export async function recordPageView(uid: string, details: ViewDetails) {
  const db = firestore();
  const day = dayKey();
  const batch = writeBatch(db);
  batch.update(doc(db, STATS, uid), { views: increment(1) });
  batch.set(
    doc(db, STATS, uid, DAYS, day),
    {
      date: day,
      views: increment(1),
      uniques: increment(details.isUnique ? 1 : 0),
      devices: { [details.device]: increment(1) },
      referrers: { [details.referrer]: increment(1) },
      ...(details.country ? { countries: { [details.country]: increment(1) } } : {}),
    },
    { merge: true },
  );
  await batch.commit();
}

export async function recordLinkClick(uid: string, linkId: string) {
  const db = firestore();
  const day = dayKey();
  const batch = writeBatch(db);
  batch.update(doc(db, STATS, uid), { clicks: increment(1) });
  batch.set(
    doc(db, STATS, uid, DAYS, day),
    { date: day, clicks: increment(1), links: { [linkId]: increment(1) } },
    { merge: true },
  );
  await batch.commit();
}

/** Daily stats for the last `days` days, oldest first. Missing days are omitted. */
export async function getDailyStats(uid: string, days: number): Promise<DayStats[]> {
  const [start] = lastDayKeys(days);
  const snap = await getDocs(
    query(collection(firestore(), STATS, uid, DAYS), where("date", ">=", start), orderBy("date")),
  );
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      date: data.date,
      views: data.views ?? 0,
      uniques: data.uniques ?? 0,
      clicks: data.clicks ?? 0,
      links: data.links ?? {},
      referrers: data.referrers ?? {},
      devices: data.devices ?? {},
      countries: data.countries ?? {},
    };
  });
}

/* -------------------------------------------------------------------------- */
/*                               Account deletion                             */
/* -------------------------------------------------------------------------- */

export async function deleteAccount(profile: UserProfile) {
  const auth = firebaseAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("You're signed out. Sign in again to delete your account.");

  // Firebase requires a fresh sign-in before deleting an account.
  await reauthenticateWithPopup(user, googleProvider());

  const db = firestore();
  const days = await getDocs(collection(db, STATS, profile.uid, DAYS));
  // Batches cap at 500 writes, so clear daily stats in chunks first.
  for (let i = 0; i < days.docs.length; i += 450) {
    const chunk = writeBatch(db);
    days.docs.slice(i, i + 450).forEach((d) => chunk.delete(d.ref));
    await chunk.commit();
  }
  const batch = writeBatch(db);
  batch.delete(doc(db, STATS, profile.uid));
  batch.delete(doc(db, USERNAMES, profile.username));
  batch.delete(doc(db, USERS, profile.uid));
  await batch.commit();

  await deleteObject(avatarRef(profile.uid)).catch(() => undefined);
  await deleteUser(user);
}
