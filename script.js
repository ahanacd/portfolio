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

// Page transitions: a coloured circle wipes across the screen, then the next page loads.
// Colours match each page's background so the join is seamless.
const pages = {
  "index.html": {
    bg: "#001845",
    fg: "#ff9f1c",
    ring: "#eff6ee",
    word: "Start",
  },
  "recruiter.html": {
    bg: "#83c5be",
    fg: "#04292e",
    ring: "#006d77",
    word: "Recruiter",
  },
  "researcher.html": {
    bg: "#FCE6C4",
    fg: "#700B15",
    ring: "#DB9577",
    word: "Researcher",
  },
  "reader.html": {
    bg: "#F3E6CE",
    fg: "#0147BA",
    ring: "#E34F33",
    word: "Reader",
  },
};

function wipe(x, y, page) {
  const curtain = document.createElement("div");
  curtain.className = "curtain";
  curtain.setAttribute("aria-hidden", "true");
  curtain.style.cssText =
    "--x:" +
    x +
    "px;--y:" +
    y +
    "px;--ring:" +
    page.ring +
    ";background:" +
    page.bg +
    ";color:" +
    page.fg;
  const ring1 = document.createElement("span");
  ring1.className = "ring";
  const ring2 = document.createElement("span");
  ring2.className = "ring r2";
  const word = document.createElement("strong");
  word.textContent = page.word;
  curtain.append(ring1, ring2, word);
  document.body.appendChild(curtain);
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      curtain.classList.add("open");
    });
  });
}

document.querySelectorAll("a[href]").forEach(function (link) {
  const page = pages[link.getAttribute("href")];
  if (!page) return;
  link.addEventListener("click", function (e) {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
      return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return; // normal, instant navigation
    e.preventDefault();
    const r = link.getBoundingClientRect();
    wipe(
      e.clientX || r.left + r.width / 2,
      e.clientY || r.top + r.height / 2,
      page,
    );
    setTimeout(function () {
      location.href = link.href;
    }, 750);
  });
});

// If the visitor presses the browser's Back button, clear any leftover wipe.
window.addEventListener("pageshow", function (e) {
  if (e.persisted)
    document.querySelectorAll(".curtain").forEach(function (c) {
      c.remove();
    });
});
