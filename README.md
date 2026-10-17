# MIYS website — founding edition

A custom-coded static website for the Mathematical Institute of Younger Students.

## Files

- `index.html` — homepage and research library
- `styles.css` — responsive design
- `papers.js` — paper catalogue data
- `script.js` — search, subject filter and mobile menu
- `submission-guide.html` — initial author guidance
- `papers/` — put reviewed PDF papers here

## Preview locally

1. Extract the ZIP.
2. Open `index.html` in a browser.
3. For a more realistic local web server, open a terminal in this folder and run:
   `python -m http.server 8000`
4. Visit `http://localhost:8000`.

No build step, paid service, API key or JavaScript framework is required.

## Add a paper

1. Add the reviewed PDF to `papers/`, e.g. `papers/prime-patterns.pdf`.
2. Open `papers.js`.
3. Add an object to `MIYS_PAPERS`, for example:

```js
{
  id: "prime-patterns",
  title: "Your paper title",
  authors: ["Author byline"],
  subject: "Number theory",
  year: 2026,
  abstract: "A concise summary of the question, method and result.",
  file: "papers/prime-patterns.pdf",
  status: "published"
}
```

Allowed subject labels in the current filter: `Number theory`, `Geometry`, `Analysis`, `Combinatorics`, `Exposition`. Add more in both `papers.js` and the `<select>` in `index.html` if needed.

**Important:** the two included catalogue entries are placeholders, not real papers. Remove or replace them before presenting the library as a live publication archive.

## Free publishing route

1. Create a GitHub repository and upload these files.
2. In Cloudflare Pages, import the repository.
3. Use the static-site settings with no build command and the project root as the output directory.
4. Deploy and test the provided `pages.dev` address.

Provider interfaces and free-plan limits can change. Never upload private data, unpublished work without permission, or contributor details that should not be public.

## Before accepting real submissions

Create a clear editorial policy, contributor consent process, correction/retraction procedure, privacy notice and safeguarding process appropriate for a project involving minors. Don't describe the process as formal peer review unless it actually meets that standard.
