// Dark / light toggle. Remembers the choice. The reader page has no toggle, so check first.
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

if (toggle) {
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
}

// Book rack: click a book to pull it out, click again to put it back.
function showHint(detail) {
  const p = document.createElement("p");
  p.className = "hint";
  p.textContent = "Pick a book from the shelf.";
  detail.replaceChildren(p);
}

function showBook(detail, book) {
  const title = document.createElement("h3");
  title.textContent = book.dataset.title;
  const by = document.createElement("p");
  by.className = "by";
  by.textContent = "by " + book.dataset.author;
  const note = document.createElement("p");
  note.textContent = book.dataset.note;
  detail.replaceChildren(title, by, note);
}

document.querySelectorAll(".shelf-section").forEach(function (shelf) {
  const books = shelf.querySelectorAll(".book");
  const detail = shelf.querySelector(".detail");
  books.forEach(function (book) {
    book.addEventListener("click", function () {
      const wasOpen = book.getAttribute("aria-expanded") === "true";
      books.forEach(function (b) {
        b.setAttribute("aria-expanded", "false");
      });
      if (wasOpen) {
        showHint(detail);
        return;
      }
      book.setAttribute("aria-expanded", "true");
      showBook(detail, book);
    });
  });
});
