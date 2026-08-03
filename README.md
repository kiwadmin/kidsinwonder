# Kids in Wonder — 키즈인원더 website

Static, Korean-first website for **키즈인원더 (Kids in Wonder)**, an English hagwon in
사천·삼천포, Gyeongnam. Built mobile-first, hosted on GitHub Pages.

> 영어는 더 넓은 세상의 문을 여는 열쇠 · *From Wondering to Wonderful*

## Pages (static — built)

| File | Page | Korean |
|---|---|---|
| `index.html`    | Home     | 홈 |
| `about.html`    | About    | 학원 소개 |
| `programs.html` | Programs | 프로그램 |
| `camp.html`     | Camp     | 캠프 |
| `policies.html` | 학원 이용 안내 (live copy · updated 2026-07) | 이용 안내 |
| `registration.html` | Contact/Register (routes to Naver 톡톡) | 문의·등록 |
| `privacy.html`  | Privacy policy (scaffold — no text yet) | 개인정보처리방침 |
| `parent.html`   | Parent photo feed (client-side code gate; not linked anywhere) | 학부모 사진첩 |

`parent-feed.json` is the monthly-regenerated manifest that `parent.html` renders (no live
Drive API in the page).

`privacy.html` and `parent.html` are scaffolds — their content/config is filled from the
"Placeholders" list below. `policies.html` now holds its live copy. `policies` + `registration`
are in the main nav; `privacy` is in the footer; `parent.html` is intentionally unlinked
(direct URL only) and `noindex`.

The public Gallery page is **cancelled** — do not build one.

## Design system

Everything inherits from `css/styles.css`. Tokens (locked):

| Role | Hex |
|---|---|
| Gold (the "K" · world)  | `#F5C000` |
| Red (the "i" · mind)    | `#E84040` |
| Teal (the "W" · child, links) | `#1D9E75` |
| Deep navy (text)        | `#1a1a2e` |
| Warm grey (body)        | `#3A3A3A` |
| Background (warm off-white) | `#FBFAF6` |

Type: **Noto Sans KR** (body/UI), **Nanum Myeongjo** (display serif — belief line & slogan),
**Poppins** (Latin / KiW lettermark / small labels). Loaded from Google Fonts.

Signature motif: the key/door. One quiet interactive moment — the hero "unlocks" with a
single key-turn on load. Fully suppressed under `prefers-reduced-motion`.

## Assets

`assets/` holds the brand logo (from `G:\내 드라이브\LOGO\투명배경`):
`logo-badge.png` (nav + favicon), `logo-horizontal.png` (footer), `logo-stacked.png` (OG image).
Swap in the designer's SVG later for crisp scaling — keep the same filenames or update refs.

## ⚠️ Placeholders to fill before launch

1. ~~**Naver 톡톡 link.**~~ ✅ **Final (2026-07).** All CTAs/footers use
   `https://talk.naver.com/WC5WLE` (confirmed by owner). No action needed.
2. **Camp page — Geneva (2026).** The official **"World Congress" event name must be copied
   verbatim from the official invitation** — do not invent or approximate it. Current text uses
   the descriptive "WFUNA 창립 80주년 기념 World Congress"; replace with the exact title.
   Accuracy guardrails are in an HTML comment in `camp.html` — keep them: *visit/참여*, never
   "delegate/대표", never "spoke at the UN", not a Model UN/WIMUN, and do not name the
   qualifying speech competition.
3. **Programs — 10 levels.** `programs.html` scaffolds all 10 levels with placeholder copy.
   Fill each level's description (and age bands if they change) when Maria provides details.
4. ~~**Teacher cards (About).**~~ ✅ Real 600×600 portraits are in; names/intros set.
5. ~~**Photos.**~~ ✅ Real images throughout; no `사진 자리` placeholder boxes remain.
6. ~~**Policies (`policies.html`).**~~ ✅ Live copy inserted (2026-07).
7. **Privacy policy (`privacy.html`).** Scaffold only — text still to be drafted (by owner).
   Note: the site collects no personal data itself (intake is via 톡톡), so the policy covers
   the 톡톡 channel + parent-feed photos. Intentionally **not** auto-written.
8. **Registration (`registration.html`).** ✅ CTA wired to Naver 톡톡. Still to fill: `상담 가능 시간` (hours).
9. ~~**Parent feed (`parent.html`).**~~ ✅ Configured (2026-07). `GATE_PASSWORD` + `DRIVE_FOLDER_ID`
   set; `localStorage` "remember me" + 로그아웃 link; `noindex`, unlinked, not in sitemap/robots.
   `parent-feed.json` holds the feed: **rolling 6-month window, all classes** (445 items across
   2026-03..07 so far), grouped 월 → 반. **Monthly regen:** re-crawl the class folders under the top
   Drive folder, keep the 6 newest months, rewrite `parent-feed.json` (newest month first; `updatedAt`
   = newest month).
   ⚠ Drive files must be shared **"anyone with the link — Viewer"** or thumbnails won't load.
   ⚠ **Not real security** — code/folder ID are visible in page source; low-sensitivity photos only.

## Deploy (GitHub Pages)

1. Create a repo (e.g. `kidsinwonder`) and push these files to the default branch.
2. Repo **Settings → Pages → Build and deployment**: Source = *Deploy from a branch*,
   Branch = `main` / `/ (root)`.
3. `CNAME` already contains `kidsinwonder.com`. In Squarespace DNS, point the domain at GitHub
   Pages: four `A` records for the apex →
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`,
   and a `CNAME` for `www` → `<username>.github.io`.
4. Back in Settings → Pages, set the custom domain to `kidsinwonder.com` and enable
   **Enforce HTTPS** once the cert provisions.

`.nojekyll` is included so GitHub Pages serves the files as-is (no Jekyll processing).

## Local preview

It's plain static HTML — open `index.html` directly, or serve the folder:

```powershell
python -m http.server 8000   # then visit http://localhost:8000
```
