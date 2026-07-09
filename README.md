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

Dynamic pages (Gallery 갤러리, Contact/Register 문의·등록, Parent Feed) come later — see
"Deferred" below.

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

1. **Naver 톡톡 link.** Every `문의하기` CTA and footer contact link points to
   `https://talk.naver.com/` as a placeholder. Replace **all** occurrences with the school's
   real Naver TalkTalk URL (`https://talk.naver.com/ct/…`). Search the repo for `talk.naver.com`.
2. **Camp page — Geneva (2026).** The official **"World Congress" event name must be copied
   verbatim from the official invitation** — do not invent or approximate it. Current text uses
   the descriptive "WFUNA 창립 80주년 기념 World Congress"; replace with the exact title.
   Accuracy guardrails are in an HTML comment in `camp.html` — keep them: *visit/참여*, never
   "delegate/대표", never "spoke at the UN", not a Model UN/WIMUN, and do not name the
   qualifying speech competition.
3. **Programs — 10 levels.** `programs.html` scaffolds all 10 levels with placeholder copy.
   Fill each level's description (and age bands if they change) when Maria provides details.
4. **Teacher cards (About).** Avatars are colored letter placeholders; swap for the illustrated
   portrait style once chosen. Replace names/blurbs.
5. **Photos.** `사진 자리 …` boxes mark where real photos go.

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
