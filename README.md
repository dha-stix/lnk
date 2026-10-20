# Lnk

One link for everything you are. A Linktree-style app built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4 and Firebase.

- **Sign in with Google**, claim a username, and get a public page at `/@username`.
- Add any of **39 platforms** (Instagram, TikTok, YouTube, Spotify, X, Facebook, LinkedIn, Bluesky, Mastodon, Discord, Telegram, WhatsApp, OnlyFans, Patreon, Substack, blogs…) plus **up to 5 personal websites**.
- Short public **bio**, profile photo (your **Google photo by default** until you upload one), and a **public view count**.
- **Customise** theme, button shape and font with a live phone preview. Edits autosave.
- **Analytics**: views, unique visitors, clicks, click-through rate, top links, referrers, devices and countries.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your Firebase keys
npm run dev
```

The site runs without keys (sign-in screens explain what's missing), but you need Firebase for accounts and pages.

## Connecting Firebase

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com) and add a **Web app**. Copy its config into `.env.local`.
2. **Authentication** → Sign-in method → enable **Google**. Under Settings → Authorised domains, add your production domain.
3. **Firestore Database** → create a database (production mode).
4. **Storage** → get started (used for uploaded profile photos).
5. Deploy the security rules in this repo:

   ```bash
   npm i -g firebase-tools
   firebase login
   firebase use --add          # pick your project
   firebase deploy --only firestore:rules,storage
   ```

6. Set `NEXT_PUBLIC_SITE_URL` to your live URL (it's used in share links and metadata).

On Vercel, add the same variables in Project → Settings → Environment Variables. Visitor countries come from Vercel's `x-vercel-ip-country` header, so that panel stays empty when running locally.

## Data model

| Collection | Document | Purpose |
| --- | --- | --- |
| `users` | `{uid}` | Public profile: username, name, bio, photos, socials, websites, appearance, settings. No email is stored. |
| `usernames` | `{username}` | `{ uid }`, guarantees each username is unique (claimed in a transaction). |
| `stats` | `{uid}` | Running `views` and `clicks`. Public, so pages can show the view count. |
| `stats/{uid}/days` | `{yyyy-mm-dd}` | Daily breakdown (views, uniques, clicks, per-link clicks, referrers, devices, countries). Owner-only reads. |

Firestore rules only let owners edit their own page, and only let visitors add exactly one to the counters. Daily breakdowns are written by visitors, so anyone determined could inflate them; add [App Check](https://firebase.google.com/docs/app-check) if that matters for you.

## Project structure

```
app/                     Routes (pages only render components)
  page.tsx               Homepage
  auth/login, register   Google sign-in and username claim
  dashboard/             Links, appearance, analytics, settings
  u/[username]/          Public page, served at /@username via a rewrite
  not-found.tsx          404
components/
  home/                  Homepage sections
  auth/                  Auth layout, Google button, username field
  dashboard/             Shell, autosave provider, editors, analytics
  profile/               ProfileView (public page and every preview) + tracking
  ui/                    Buttons, fields, modal, icons, stickers, reveal, count-up
  providers/             AuthProvider (session + live profile)
firebase/
  firebase.ts            App, Auth, Firestore and Storage setup
  firebase-actions.ts    Every read and write: auth, profiles, usernames, avatars, analytics, deletion
lib/                     Types, platforms, themes, analytics maths, hooks, helpers
images/                  Animated SVG stickers used across the site
styles/                  Shared animations and the self-hosted Isometra font
firestore.rules, storage.rules, firebase.json
```

## Scripts

- `npm run dev`: start the dev server
- `npm run build`: production build
- `npm run lint`: ESLint
