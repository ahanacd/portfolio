// Dark / light toggle. Remembers the choice on every page.
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
