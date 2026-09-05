# 🔥 JEE Battle Royale Tracker
### Complete JEE Preparation Suite — PDF Sync · Danger Zone · Weak Spot Radar · Streaks

A fully offline-capable, gamified JEE preparation tracker. No server, no login, no subscription.  
Everything runs in your browser. Your data stays on your device.

---

## 📁 File Structure

```
jee-tracker/
├── index.html          ← Main tracker app (open this daily)
├── test-analysis.html  ← Standalone PDF analysis lab
├── sw.js               ← Service worker (enables offline use)
├── manifest.json       ← PWA manifest (enables "Add to Home Screen")
└── README.md           ← This file
```

---

## 🚀 How to Use

### Option A — Open directly in a browser (simplest)
1. Open `index.html` in Chrome, Firefox, or Safari.
2. That's it. All data saves automatically in your browser's local storage.

### Option B — Install as an app (recommended for daily use)
1. Open `index.html` in Chrome or Edge.
2. Click the install icon in the address bar (or ⋮ → "Install app").
3. The tracker opens like a native app, works offline, and appears on your home screen.

### Option C — Serve locally (for development)
```bash
# Python 3
python -m http.server 8080
# then open http://localhost:8080

# Node.js (npx)
npx serve .
```

> **Note:** The service worker (`sw.js`) only activates when served over HTTP/HTTPS.  
> Opening `index.html` directly via `file://` still works but won't cache for offline use.

---

## 📄 File Descriptions

### `index.html` — Main Tracker
The full-featured daily tracker. Contains everything in a single self-contained file.

**Tabs / Sections:**
| Tab | What it does |
|-----|-------------|
| **Home / HUD** | Daily XP, streak, target score vs recent average |
| **Track** | Chapter tests, major tests, battle log |
| **Command Center** | Danger Zone, Weak Spot Radar, Zone Shrinking, Revision Due |
| **AI Lab** | PDF Analysis Sync (upload test PDFs), AI import paste-back |
| **Settings** | Study setup (marking scheme, target score, exam date), customization |
| **League** | Weekly leaderboard, achievements, streak calendar |

**Key Features:**
- **PDF Analysis Sync** — Upload your ALLEN / Aakash / JEE Main result PDF; the app reads chapter scores, accuracy, and mistake types without any API call and automatically updates your Danger Zone, battle log, and weak subject flags.
- **Danger Zone** — Chapters where you have scored below threshold, weighted by recency and mistake type.
- **Weak Spot Radar** — Spider chart showing your weakest chapters per subject over the last 30 days.
- **Streaks + Attendance** — Full-day and light-day attendance, streak health score, 7-day mini-calendar.
- **Onboarding Wizard** — First-run setup that personalizes exam date, target, weak subjects, and progress %.
- **Revision Due** — Spaced-repetition-style list of chapters due for review.
- **Achievements** — Unlockable badges for streaks, tests logged, danger-zone clears.

---

### `test-analysis.html` — PDF Analysis Lab
A standalone, lighter analysis tool. Upload multiple test PDFs and get a structured report.  
Use this when you want a detailed breakdown without opening the main tracker.

**Supported input formats:**
- PDF files (text-based — JEE Main portal, ALLEN, Aakash, Resonance, PW, FIITJEE)
- PNG / JPG / WEBP images (scanned sheets — OCR via Tesseract.js, local, no upload)
- JSON exports from the main tracker

**What it extracts:**
- Total score and percentage
- Subject-wise scores and accuracy (Physics / Chemistry / Mathematics)
- Chapter-wise performance — correct, wrong, skipped, accuracy, status (STRONG / AVERAGE / WEAK)
- Question-by-question table — individual results and mistake types
- Topic-level weakness breakdown
- Revision targets and action items

---

### `sw.js` — Service Worker
Enables offline functionality. On first load, both HTML files are cached.  
Subsequent loads work without internet. CDN libraries (PDF.js, Tesseract.js) are also cached on first use.

**Cache strategy:**
- App files (`index.html`, `test-analysis.html`) → Network-first, cache fallback
- CDN scripts (PDF.js, Tesseract) → Cache-first (they are versioned/immutable)

To force an update after you replace the HTML files, increment `CACHE_VERSION` in `sw.js`.

---

### `manifest.json` — Web App Manifest
Enables "Add to Home Screen" / PWA install on Android and desktop Chrome/Edge.  
Defines the app name, theme colour, start URL, and shortcuts.

---

## 📤 PDF Upload — Supported Table Formats

The PDF parser reads structured text — no AI API is called. It handles these layouts automatically:

| Format | Example line | Source |
|--------|-------------|--------|
| **Rank-first** | `1 \| Mathematics \| Relations & Functions \| 29 \| 73% \| AVERAGE` | Some ALLEN / custom reports |
| **Band-first** | `STRONG \| Physics \| Current Electricity \| 7 \| 6 \| 0 \| 1 \| 100.0% \| 24` | JEE analysis exports |
| **Subject-first** | `Mathematics \| Relations & Functions \| 11 \| 8 \| 3 \| 0 \| 73% \| AVERAGE \| 29` | JEE Main detailed reports |
| **Question-by-question** | `Q10 \| Physics \| Motion in a Plane \| Relative motion \| Moderate \| C \| B \| [WRONG] \| -1/4 \| Conceptual mistake` | Detailed question-level sheets |

If a PDF has no extractable text (scanned paper), the app automatically runs local OCR (Tesseract.js) — still no API call.

---

## 💾 Data Storage

All data is stored in **IndexedDB** (via a local key-value store) in your browser.  
Nothing is sent to any server.

| What | Storage key |
|------|------------|
| Chapter tests | `jee-chapter-tests` |
| Progress / chapters | `jee-progress` |
| Attendance | `jee-present` |
| PDF analysis history | `jee-pdf-analysis-history` |
| Exam date | `jee-exam-date` |
| Marking scheme | `jee-marking-scheme` |
| Target score | `jee-target-score` |
| Weak subjects | `jee-self-weak-subjects` |

**To back up your data:** Settings → Export in the main tracker saves a full JSON snapshot.  
**To restore:** Settings → Import reads the same JSON.

---

## ⚙️ Marking Schemes

| Exam | Correct | Wrong | Total |
|------|---------|-------|-------|
| JEE Main | +4 | −1 | 300 |
| JEE Advanced | +3 | −1 | 360 |
| Custom | Set in Settings | | |

Set your marking scheme in **Settings → Study Setup → Marking Scheme** before uploading PDFs.  
The PDF parser uses this scheme to convert chapter accuracy % into actual marks for the battle log.

---

## 🔧 Technical Notes

- **No build step.** Both files are single self-contained HTML files. Edit and open.
- **No external dependencies at rest.** PDF.js and Tesseract.js load from CDN on first use and are then cached by the service worker.
- **Browser support:** Chrome 90+, Firefox 88+, Safari 15+, Edge 90+.
- **Mobile:** Fully responsive. Tested on Android Chrome and iOS Safari.
- **Offline:** Works fully offline after the first load (with service worker active).

---

## 📝 Changelog

| Version | What changed |
|---------|-------------|
| PDF Lab Engine | Added PDF Analysis Sync — three table formats, question-by-question parsing, multi-file upload, no API |
| Settings Depth | Exam type, marking scheme, target score — now persist across reloads |
| Onboarding Wizard | 4-step setup on first run — exam date, type, weak subjects, progress % |
| Streak Overhaul | Full-day / light-day attendance, weighted health score, 7-day mini-calendar |

---

## 🐛 Known Issues / Tips

- **PDF shows "No data found":** The PDF may have a non-standard table layout. Try uploading the detailed question-by-question version of the report if your platform provides one.
- **Marking scheme shows "Not set":** Go to Settings → Study Setup → Marking Scheme and tap Mains or Advanced. It will now persist after reload.
- **Service worker not activating:** Make sure you're serving via HTTP (not `file://`). Use `python -m http.server` locally.
- **Clearing data accidentally:** Use the Export button in Settings before clearing browser data.
