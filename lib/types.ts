import type { PlatformKey } from "./platforms";
import type { ButtonStyleKey, FontKey, ThemeKey } from "./themes";

export type SocialLink = {
  id: string;
  platform: PlatformKey;
  /** What the user typed: a handle, number or full URL. */
  value: string;
  /** The resolved, clickable URL. */
  url: string;
  enabled: boolean;
};

export type Website = {
  id: string;
  title: string;
  url: string;
  enabled: boolean;
};

export type Appearance = {
  theme: ThemeKey;
  buttonStyle: ButtonStyleKey;
  font: FontKey;
  showViews: boolean;
};

export type ProfileSettings = {
  /** Show an 18+ notice before opening adult platforms such as OnlyFans. */
  adultWarning: boolean;
  /** Allow search engines to index the public page. */
  indexable: boolean;
};

export type UserProfile = {
  uid: string;
  username: string;
  displayName: string;
  bio: string;
  /** A photo the user uploaded. When null, the Google photo is shown. */
  photoURL: string | null;
  googlePhotoURL: string | null;
  socials: SocialLink[];
  websites: Website[];
  appearance: Appearance;
  settings: ProfileSettings;
};

export type ProfileUpdate = Partial<
  Pick<UserProfile, "displayName" | "bio" | "socials" | "websites" | "appearance" | "settings">
>;

export type ProfileStats = {
  views: number;
  clicks: number;
};

export type Device = "mobile" | "tablet" | "desktop";

export type DayStats = {
  date: string;
  views: number;
  uniques: number;
  clicks: number;
  links: Record<string, number>;
  referrers: Record<string, number>;
  devices: Partial<Record<Device, number>>;
  countries: Record<string, number>;
};

export type PublicProfile = {
  profile: UserProfile;
  stats: ProfileStats;
};
