# renonesopocaj.github.io

Personal site. Vanilla HTML/CSS/JS, no build step, no framework - based on the structure of [jrosseruk/jrosseruk.github.io](https://github.com/jrosseruk/jrosseruk.github.io), with all personal content replaced by `TODO`s, the Resources/Résumé sections removed, and a Blog section added.

**Live site:** once GitHub Pages is enabled for this repo (Settings → Pages → Source: `Deploy from a branch`, branch `main`, folder `/docs`), it'll be served at `https://renonesopocaj.github.io/`. No `CNAME` file is included, so it uses the default `github.io` domain - add one only if you buy a custom domain.

## Structure

```
docs/
  index.html          Home page: About + Publications sections, header/nav/theme toggle
  about.md            About section: profile, social links, and introduction
  projects.html       Projects page with shared navigation and Markdown loading
  projects.md         Research experience and the project index
  projects/
    <repository>/
      index.html      Individual project page with shared navigation
      project.md      Project title, full description, and GitHub repository link
  music.html          Music page with shared navigation and Markdown loading
  music.md            Music section content
  publications.md     Publications section content (TODO)
  styles.css          All styling, incl. blog components and the font variables
  script.js           Site chrome (ES module) + the shared Markdown/math render pipeline
  assets/
    placeholder.svg    Generic placeholder image used by the example blog post
  blog/
    index.html         Blog index page (lists posts from posts.json)
    post.html           Single-post page, reads ?post=<slug>
    blog-index.js       Populates the index page from posts.json
    blog-post.js         Looks up the slug in posts.json, fetches and renders the post
    posts.json           Manifest: one entry per post (slug, title, date, excerpt, tags)
    posts/
      welcome-to-the-blog.md   Example post - shows image/video/math syntax, replace it
```

`docs/` is the GitHub Pages source folder (same layout as the source repo). `docs/.nojekyll` is required - without it, GitHub Pages runs Jekyll, which does not serve raw `.md` files the way this site's `fetch()`-based loader expects.

## How the markdown pipeline works

`about.md`, `projects.md`, each project's `project.md`, `music.md`, `publications.md`, and every blog post are Markdown, fetched at runtime and rendered client-side (no build step). One shared engine does this everywhere - defined once in `docs/script.js` as `renderMarkdown()`, imported by `docs/blog/blog-post.js` for posts:

- **Engine:** [markdown-it](https://github.com/markdown-it/markdown-it), loaded from jsDelivr's ESM CDN (`markdown-it@14/+esm`), with `html: true` - meaning raw HTML in your `.md` files (like the social-link `<div>` in `about.md`) passes through untouched.
- **Math:** [markdown-it-texmath](https://github.com/goessner/markdown-it-texmath) + [KaTeX](https://katex.org/), also via ESM CDN. Math is tokenized *before* markdown-it's backslash-escaping rule runs, so `\\` line breaks and `\{`/`\}` inside `$$...$$` blocks render correctly (this is why a naive "run KaTeX auto-render on the final HTML" approach isn't used - it breaks on exactly that case).
- **Styling continuity:** markdown-it's default output doesn't carry this site's `.title` / `.cactus-link` classes, so `docs/script.js` overrides the `heading_open` and `link_open` renderer rules to re-inject them. If you change the Markdown engine or its config, check `.prose h1/h2` vs `.title` still look the same (see `docs/styles.css`).

Because it's one shared engine, **images, video embeds, and LaTeX work the same way in `about.md`, `projects.md`, `music.md`, and `publications.md` as they do in blog posts.**

About, Projects, Blog, and Music are linked from every page's header. The three Markdown pages use matching `about-content`, `projects-content`, and `music-content` containers, and `MarkdownLoader` only loads content for containers present on the current page. Keep these headers in sync when updating navigation.

Navigation, scrolling, theme switches, menus, and hover states update immediately. Only the content-loading spinner animates.

## Music background photos

Music uses a fixed 2×2 photo background with proportional cropping and a bottom-anchored crowd photo. Its `srcset` entries load compressed WebP copies from `docs/assets/music_pictures/optimized/`; `sizes` accounts for both the width and height needed by each crop. Original photos stay in `docs/assets/music_pictures/`. After replacing an original, run `node scripts/optimize-music-images.mjs` (requires `cwebp`, available in Homebrew's `webp` package) and keep `music.html`'s dimensions and source widths in sync. The generator preserves ICC color profiles, keeps Studio at its native maximum width, and updates the four inline previews in `music.html`.

Measured with a fresh browser cache at desktop 1280×900 (1×), mobile 390×844 (2×), and desktop 1920×1080 (1×): responsive WebP reduces the full-resolution photo files from 23,611,444 bytes to 375,914–509,958 bytes (about 98% smaller). Keep these responsive copies rather than serving the originals as backgrounds. Music's small text stroke increase stays scoped to `#music-content`.

The inline previews contain about 12 KiB of image data (about 16 KiB after base64 encoding). They show all four photos immediately while a small inline script waits for all full-resolution photos to decode, then reveals them together without animation. A failed full-resolution photo is logged and retains its preview. The shared script warms Music's responsive image candidates on other pages during idle time or when a Music link receives pointer, touch, or keyboard focus; automatic warming respects data-saver preferences. It reads the image attributes from `music.html` and reuses the browser's normal HTTP cache. In the local 10 Mb/s, 80 ms latency cache test, navigation after warming on About downloaded zero image bytes; the previous navigation downloaded 377,114 image bytes.

## Project index and individual pages

Research experience stays on `docs/projects.md`. Selected ML projects and Other projects use clickable previews that open `projects/<repository>/`. Each project directory contains its own `index.html` and `project.md`; the shared loader renders `project.md` into `project-content`. Full descriptions and GitHub links live on those individual pages, while the index shows a short excerpt.

To add a project, copy an existing project directory, edit its page title and description metadata, and update `project.md`. Add a corresponding preview to the appropriate group in `docs/projects.md`. Keep blank lines around the preview's opening/closing `<a>` tags and its Markdown text so headings and LaTeX render correctly. Each detail page links back to `../../projects.html` and uses the same About, Projects, Blog, and Music navigation. Local images and downloads can live beside `project.md`, with paths relative to that project's page.

### Complete project reports

Bandit, Adversarial Paraphraser, MCMC, and FPGA include their complete original reports after `<!-- COMPLETE ORIGINAL REPORT -->` in each `project.md`. The reports are flowing HTML with native MathML inside Markdown, preserving the original wording, numbered equations, captions, tables, references, and appendices. Keep the report's HTML together without blank lines so the Markdown renderer passes it through unchanged.

Each project's `report/` folder contains its original figures, scoped source styling, and `source.json` with the authoritative GitHub PDF commit, source hashes, figure inventory, and imported-text hash. Original PNG/JPEG files retain their bytes; the two Adversarial diagrams are vector crops of the original PDF. The MCMC ZIP contains an earlier draft, so its complete final report is recovered from the pinned GitHub PDF. The Bandit Conclusion follows the published PDF rather than the newer draft paragraph in the ZIP.

`docs/report.css` provides the shared responsive report layout. Each report page loads it after `report/source.css`; these styles stay scoped to `.report`. Images preserve their proportions within the available width and a 300 px height limit, with a 600 px limit for VHDL. Formula scrollbars use an 8 px horizontal height in the shared stylesheet. When replacing a report, compare its full text and every figure with the authoritative PDF before updating its content hashes.

## Adding a blog post

1. Write `docs/blog/posts/<slug>.md`. Use `welcome-to-the-blog.md` as a template:
   - Images: `![alt text](../../assets/your-image.jpg)`
   - Video: a raw `<video controls><source src="..." type="video/mp4"></video>` tag, or an iframe embed wrapped in `<div class="embed-16x9">...</div>` to keep it responsive
   - Inline math: `$x_i$` - Block math: `$$ ... $$` (supports multi-line `\begin{aligned}...\end{aligned}` with `\\` line breaks)
2. Add an entry to `docs/blog/posts.json`:
   ```json
   { "slug": "<slug>", "title": "...", "date": "YYYY-MM-DD", "excerpt": "...", "tags": ["..."], "published": false }
   ```
   The manifest is the single source of truth for which posts exist - `blog/index.html` lists whatever's in it, and `blog/post.html?post=<slug>` refuses to fetch anything whose slug isn't in the manifest.
3. Leave `"published": false` while you're drafting - the post won't appear on the index page, and `post.html?post=<slug>` will 404 it even if someone has the direct link. Flip it to `true` when you're ready to publish.
4. No build step either way. Open `docs/blog/index.html` locally (see below) to check it.

## Hiding a section until it's ready

Two different mechanisms, matching how each part of the site is structured:

- **Blog posts**: set `"published": false` in the post's `docs/blog/posts.json` entry (see above). This is currently true for the example post, `welcome-to-the-blog` - it won't show up until you flip it.
- **Publications** (or any other on-page section): the section and its nav link are commented out in `docs/index.html` (and the nav link in `docs/blog/index.html` / `docs/blog/post.html`), marked with `<!-- TODO: uncomment once docs/publications.md is ready -->`. Search for that comment and uncomment both the nav link and the `<section id="publications">` block to bring it back.

## Changing the font

The font is defined in exactly two places:

1. **`docs/styles.css`**, in the `:root` block near the top - two CSS custom properties:
   ```css
   --font-body: 'JetBrains Mono', 'Courier New', monospace;
   --font-mono: 'JetBrains Mono', 'Courier New', monospace;
   ```
   `--font-body` is used by `body` (i.e. all prose text); `--font-mono` is used by `.font-mono` and by code blocks/inline code in `.prose`. They're separate on purpose - you can swap the body font to something non-monospace without also changing how code looks. Edit these two lines to change the font(s) used across the whole site.
2. **The Google Fonts `<link>`** in the `<head>` of each HTML page (`docs/index.html`, `docs/projects.html`, `docs/music.html`, `docs/blog/index.html`, `docs/blog/post.html`, and each `docs/projects/<repository>/index.html`) - currently:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet">
   ```
   Replace the `family=` value with your chosen [Google Fonts](https://fonts.google.com/) family (or point at a different font host, or a self-hosted `@font-face`). This tag has to be updated in every HTML file, since there's no shared header include in a build-free static site.

## Development

```bash
python3 -m http.server 8000 -d docs/
```

Then open `http://localhost:8000/`. Don't open the HTML files directly via `file://` - the `fetch()` calls that load Markdown content and `posts.json` require a real HTTP server (CORS blocks `file://` fetches).

## Tech stack

- Vanilla HTML, CSS, JavaScript (ES modules)
- Markdown content, rendered client-side via markdown-it + markdown-it-texmath + KaTeX (all loaded from jsDelivr's ESM CDN, no `npm install` needed)
- GitHub Pages hosting

Inspired by [astro-theme-cactus](https://astro-cactus.chriswilliams.dev/), via [jrosseruk/jrosseruk.github.io](https://github.com/jrosseruk/jrosseruk.github.io).
