const list = document.getElementById("paper-list");
const search = document.getElementById("search");
const filter = document.getElementById("subject-filter");
const empty = document.getElementById("empty-state");

function renderPapers() {
  const query = search.value.trim().toLowerCase();
  const subject = filter.value;
  const papers = MIYS_PAPERS.filter(p => {
    const haystack = [p.title, p.subject, p.abstract, ...(p.authors || [])].join(" ").toLowerCase();
    return haystack.includes(query) && (subject === "all" || p.subject === subject);
  });
  list.innerHTML = papers.map(p => {
    const authors = (p.authors || []).join(", ");
    const link = p.file
      ? `<a class="paper-link" href="${escapeHtml(p.file)}" target="_blank" rel="noopener">Read PDF ↗</a>`
      : `<span class="paper-link disabled">${p.status === "sample" ? "Sample entry" : "Coming soon"}</span>`;
    return `<article class="paper-card">
      <div class="paper-subject">${escapeHtml(p.subject)}</div>
      <div>
        <h3 class="paper-title">${escapeHtml(p.title)}</h3>
        <div class="paper-meta">${escapeHtml(authors)} · ${escapeHtml(String(p.year))}</div>
        <p class="paper-abstract">${escapeHtml(p.abstract)}</p>
      </div>
      ${link}
    </article>`;
  }).join("");
  empty.hidden = papers.length > 0;
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[ch]));
}
search.addEventListener("input", renderPapers);
filter.addEventListener("change", renderPapers);
document.getElementById("year").textContent = new Date().getFullYear();
const toggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});
renderPapers();
