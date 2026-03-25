# AGENTS.md - Purrora Pet Adoption Center

## Project Overview

**Type:** Static website (vanilla HTML/CSS/JavaScript)  
**Authors:** Amina, Yousra  
**Purpose:** Pet adoption center management interface

### Directory Structure

```
/ (root)
├── index.html        # Main landing page
├── CSS/
│   ├── style.css     # Main styles
│   └── modal.css     # Modal component styles
├── JS/
│   ├── oneko.js      # Cat sprite animation widget
│   └── model.js      # Modal functionality (incomplete)
├── Img/              # Static images (animal.png, image.png)
└── References/       # Background images, sprites (aurora.jpg, oneko.gif)
```

## Build, Lint, and Test Commands

> **Note:** This project has **no build system, no linting, and no testing framework** configured. All commands below describe the ideal target setup. Currently, there is nothing to run.

### Development

```bash
# Serve locally (any static file server works)
npx serve .
python -m http.server 8000
```

### Linting

```bash
# HTML: lint all .html files
npx htmlhint **/*.html

# CSS: lint all .css files
npx stylelint "CSS/*.css"

# JavaScript: lint all .js files
npx eslint "JS/*.js"

# Run all linters
npx htmlhint **/*.html && npx stylelint "CSS/*.css" && npx eslint "JS/*.js"
```

### Testing

> **No testing framework is currently set up.** The recommended approach is Playwright for browser-based testing.

```bash
# Install Playwright
npm install -D @playwright/test
npx playwright install

# Run all tests
npx playwright test

# Run a single test file
npx playwright test tests/<filename>.spec.js

# Run tests in headed mode (see browser)
npx playwright test tests/<filename>.spec.js --headed

# Run tests matching a name pattern
npx playwright test --grep "modal"
```

## Code Style Guidelines

### General Principles

- Keep files focused: one component/feature per file.
- No build step required — write code that runs directly in browsers.
- Always validate HTML: use `https://validator.w3.org/` before committing.

### HTML

| Rule | Convention |
|------|-----------|
| Document type | `<!DOCTYPE html>` with `lang` attribute on `<html>` |
| Encoding | `<meta charset="UTF-8">` in every file |
| Viewport | `<meta name="viewport" content="width=device-width, initial-scale=1.0">` (note: `width`, not `witdh`) |
| Indentation | **2 spaces** — match the existing files |
| Quotes | Double quotes for attribute values |
| Self-closing tags | No self-closing slashes on void elements (`<br>`, not `<br />`) |
| Accessibility | Always include `alt` on `<img>`; use `aria-*` attributes for interactive elements |
| Script placement | Place `<script>` tags at the end of `<body>` (before closing tag) |
| External scripts | Use `async` or `defer` for third-party scripts to avoid blocking rendering |

**Known HTML issues to fix:**
- `index.html:6` — `device-witdh` is a typo; must be `device-width`

### CSS

| Rule | Convention |
|------|-----------|
| Indentation | **2 spaces** — match existing files |
| Selector naming | BEM-like: `.block`, `.block__element`, `.block--modifier` (e.g., `.addpet-header`, `.addpet-body`) |
| IDs vs Classes | Prefer classes for styling; use IDs only for JS hooks (`querySelector`) |
| Units | Use `rem`/`em` for typography, `px` for borders/shadows, `%`/`vh`/`vw` for layout |
| Color values | Hexadecimal; prefer 6-digit (`#1b1b1b`) over 3-digit (`#fff`) for consistency |
| Shorthand | Use shorthand properties where appropriate (`margin: 0`, `border: 1px solid`) |
| Zero values | Always include unit: `0` not `0px` |
| Vendor prefixes | Not currently needed; avoid unless targeting very old browsers |

**CSS files:**
- `CSS/style.css` — main site styles
- `CSS/modal.css` — modal/popup styles

### JavaScript

| Rule | Convention |
|------|-----------|
| Indentation | **4 spaces** (per existing JS files) |
| Quotes | Double quotes (`"string"`) — match existing code |
| Semicolons | Use semicolons at the end of statements |
| Variables | Use `const` by default; `let` when reassignment is needed; **never use `var`** |
| Naming | camelCase for variables/functions (`openModalButtons`); PascalCase for constructors/classes |
| Globals | Avoid global variables; wrap in an IIFE if isolation is needed (see `oneko.js`) |
| DOM queries | Cache DOM elements in variables; use `const` for query results |
| Event listeners | Use `addEventListener`, not `onevent` attributes (e.g., `onclick`) |
| Error handling | Always wrap async/fetch operations in `try/catch` |
| Console | Remove `console.log` and `console.error` calls before committing |

**Known issues in existing code:**
- `JS/model.js:7` — variable `modal` is assigned but never used
- `JS/oneko.js:150` — `direction` is used as a global (implicit `window.direction`); declare it with `let direction`
- `JS/model.js` — the file is incomplete and will not function correctly

### File Path Conventions

| Context | Convention |
|---------|-----------|
| CSS background images | Relative to CSS file: `url(../References/aurora.jpg)` |
| Script sources | Relative to HTML file: `<script src="JS/oneko.js">` |
| Absolute paths | Avoid absolute paths; use relative paths that work from any subdirectory |

### Recommended Tooling (To Be Added)

If this project is modernized, the following tools should be configured:

```json
// package.json (recommended)
{
  "scripts": {
    "lint": "eslint JS/ && stylelint CSS/",
    "test": "playwright test",
    "serve": "npx serve ."
  },
  "devDependencies": {
    "@playwright/test": "^1.x",
    "eslint": "^9.x",
    "stylelint": "^16.x",
    "stylelint-config-standard": "^36.x"
  }
}
```

```js
// .eslintrc.js (recommended)
export default {
  env: { browser: true, es2022: true },
  extends: "eslint:recommended",
  rules: {
    "no-unused-vars": "warn",
    "no-console": "off" // allow in development
  }
};
```

```json
// stylelint.config.json (recommended)
{
  "extends": "stylelint-config-standard",
  "rules": {
    "indentation": 2,
    "color-hex-case": "lower"
  }
}
```

## Working in This Repository

### What to do

1. **Validate HTML** with W3C validator before any HTML change.
2. **Test in browser** — open the HTML file directly or serve with a local server.
3. **Preserve existing style** — match 2-space indentation in HTML/CSS, 4-space in JS, double quotes in JS.
4. **Fix known bugs** when you encounter them (e.g., the `device-witdh` typo, the `direction` global in `oneko.js`).
5. **Add `alt` text** to any images that lack it.
6. **Remove `console.log`** statements before committing.

### What NOT to do

1. Do **not** introduce frameworks (React, Vue, Angular) or build tools (Webpack, Vite) without discussion.
2. Do **not** rewrite existing working code (e.g., `oneko.js`) just to change style.
3. Do **not** use `innerHTML` for DOM manipulation — use `textContent` or `createElement`/`appendChild`.
4. Do **not** add third-party scripts without verifying they are trustworthy.
5. Do **not** commit files with `console.log` debugging output.
6. Do **not** use `target="_blank"` without `rel="noopener noreferrer"`.
7. Do **not** introduce `target="_blank"` links to external sites from untrusted sources.
