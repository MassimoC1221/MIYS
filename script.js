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


/* Authentication modal (real sign-in requires Supabase configuration). */
(() => {
  const overlay = document.getElementById("auth-overlay");
  const openButton = document.getElementById("open-auth");
  const closeButton = document.getElementById("close-auth");
  const form = document.getElementById("auth-form");
  const emailInput = document.getElementById("auth-email");
  const passwordInput = document.getElementById("auth-password");
  const passwordField = passwordInput.closest(".auth-field");
  const submitButton = document.getElementById("auth-submit");
  const message = document.getElementById("auth-message");
  const title = document.getElementById("auth-title");
  const description = document.getElementById("auth-description");
  const tabs = [...document.querySelectorAll(".auth-tab")];
  let mode = "login";
  let lastFocused = null;
  let signedInUser = null;

  const config = window.MIYS_SUPABASE_CONFIG || {};
  const configured = Boolean(config.url && config.anonKey &&
    !config.url.includes("YOUR_PROJECT") && !config.anonKey.includes("YOUR_SUPABASE"));

  function setMessage(text, type = "") {
    message.textContent = text;
    message.className = `auth-message ${type}`.trim();
  }

  function setMode(nextMode) {
    mode = nextMode;
    const signup = mode === "signup";
    tabs.forEach(tab => {
      const active = tab.dataset.mode === mode;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.hidden = Boolean(signedInUser);
    });
    title.textContent = signup ? "Join MIYS." : "Welcome back.";
    description.textContent = signup
      ? "Create an account to join the mathematical community."
      : "Sign in to continue your mathematical journey.";
    submitButton.textContent = signup ? "Create account" : "Sign in";
    passwordInput.autocomplete = signup ? "new-password" : "current-password";
    passwordField.hidden = false;
    passwordInput.required = true;
    setMessage(configured ? "" : "Setup needed: connect MIYS to Supabase to enable real accounts.");
  }

  function showSignedIn(user) {
    signedInUser = user;
    openButton.textContent = "Account";
    openButton.setAttribute("aria-label", `Signed in as ${user.email || "your account"}. Open account options`);
    title.textContent = "You're signed in.";
    description.textContent = "Welcome to the MIYS community.";
    tabs.forEach(tab => { tab.hidden = true; });
    passwordField.hidden = true;
    passwordInput.required = false;
    submitButton.textContent = "Sign out";
    setMessage(`Signed in as ${user.email || "your account"}`, "success");
  }

  function resetSignedOut() {
    signedInUser = null;
    openButton.innerHTML = 'Sign in <span aria-hidden="true">↗</span>';
    openButton.setAttribute("aria-label", "Sign in");
    tabs.forEach(tab => { tab.hidden = false; });
    setMode("login");
    passwordField.hidden = false;
    passwordInput.required = true;
  }

  function openModal() {
    lastFocused = document.activeElement;
    overlay.hidden = false;
    document.body.classList.add("auth-open");
    if (signedInUser) showSignedIn(signedInUser);
    else setMode(mode);
    window.setTimeout(() => (signedInUser ? submitButton : emailInput).focus(), 0);
  }

  function closeModal() {
    overlay.hidden = true;
    document.body.classList.remove("auth-open");
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  let supabaseClient = null;
  if (configured && window.supabase?.createClient) {
    supabaseClient = window.supabase.createClient(config.url, config.anonKey);
    supabaseClient.auth.getSession().then(({ data, error }) => {
      if (!error && data.session) showSignedIn(data.session.user);
    });
    supabaseClient.auth.onAuthStateChange((_event, session) => {
      if (session) showSignedIn(session.user);
      else resetSignedOut();
    });
  }

  openButton.addEventListener("click", async () => {
    if (supabaseClient) {
      const { data } = await supabaseClient.auth.getSession();
      if (data.session) signedInUser = data.session.user;
    }
    openModal();
  });
  closeButton.addEventListener("click", closeModal);
  overlay.addEventListener("click", event => {
    if (event.target === overlay) closeModal();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !overlay.hidden) closeModal();
  });
  tabs.forEach(tab => tab.addEventListener("click", () => {
    if (signedInUser) return;
    setMode(tab.dataset.mode);
  }));

  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (!supabaseClient) {
      setMessage("Real sign-in is not connected yet. Follow SETUP.md to configure Supabase.", "error");
      return;
    }
    submitButton.disabled = true;
    try {
      if (signedInUser) {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
        resetSignedOut();
        setMessage("You've signed out.", "success");
        return;
      }

      const email = emailInput.value.trim();
      const password = passwordInput.value;
      if (mode === "signup") {
        const { data, error } = await supabaseClient.auth.signUp({ email, password });
        if (error) throw error;
        if (data.session) {
          showSignedIn(data.session.user);
        } else {
          setMessage("Account created. Check your email for a confirmation link.", "success");
        }
      } else {
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) throw error;
        showSignedIn(data.user);
      }
    } catch (error) {
      setMessage(error.message || "Something went wrong. Please try again.", "error");
    } finally {
      submitButton.disabled = false;
    }
  });

  if (!configured) {
    setMessage("Setup needed: connect MIYS to Supabase to enable real accounts.");
  }
})();
