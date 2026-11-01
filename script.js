// ---------- Audience chooser ----------
const buttons = document.querySelectorAll("[data-audience]");
const panels = document.querySelectorAll("[data-for]");
const status = document.getElementById("status");
const labels = {
  recruiter: "a recruiter",
  researcher: "a researcher",
  reader: "a reader",
};

function showFor(audience) {
  panels.forEach(function (el) {
    const list = el.dataset.for.split(" ");
    el.hidden = !(audience === "all" || list.includes(audience));
  });
  buttons.forEach(function (b) {
    b.setAttribute("aria-pressed", String(b.dataset.audience === audience));
  });
  status.textContent =
    audience === "all"
      ? "Showing everything. Pick a role to tailor this page."
      : "Showing what matters to " + labels[audience] + ".";
}

buttons.forEach(function (b) {
  b.addEventListener("click", function () {
    const choice = b.dataset.audience;
    showFor(choice);
    // Shareable link, e.g. yourpage/#recruiter
    if (choice === "all") {
      history.replaceState(null, "", location.pathname);
    } else {
      history.replaceState(null, "", "#" + choice);
    }
  });
});

// If someone opens .../#researcher, start tailored
const fromLink = location.hash.replace("#", "");
showFor(
  ["recruiter", "researcher", "reader"].includes(fromLink) ? fromLink : "all",
);

// ---------- Dark / light toggle ----------
const root = document.documentElement;
const toggle = document.getElementById("theme-toggle");

function setTheme(theme) {
  root.dataset.theme = theme;
  toggle.textContent = theme === "dark" ? "Light mode" : "Dark mode";
  try {
    localStorage.setItem("theme", theme);
  } catch (e) {
    /* storage may be blocked */
  }
}

let saved = null;
try {
  saved = localStorage.getItem("theme");
} catch (e) {
  /* ignore */
}
setTheme(
  saved ||
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"),
);

toggle.addEventListener("click", function () {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
});
