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

// Amazon India links, matched by book title (so your edited notes stay untouched)
const bookLinks = {
  "Thinking, Fast and Slow":
    "https://www.amazon.in/Thinking-Fast-Slow-Daniel-Kahneman/dp/B0HLQ5XCFH",
  "How Emotions Are Made":
    "https://www.amazon.in/How-Emotions-Are-Made-Secret/dp/0544133315",
  "Emotional Intelligence":
    "https://www.amazon.in/Emotional-Intelligence-Daniel-Goleman/dp/9382563792",
  "The Man Who Mistook His Wife for a Hat":
    "https://www.amazon.in/Man-Who-Mistook-His-Wife/dp/0684853949",
  Othello: "https://www.amazon.in/Othello-William-Shakespeare/dp/150848046X",
  "Chokher Bali": "https://www.amazon.in/dp/B0GPQ3KNPL",
  "Normal People":
    "https://www.amazon.in/Normal-People-Sally-Rooney-Paperback/dp/B0HKCP2JGM",
  "To Live": "https://www.amazon.in/Live-Novel-Yu-Hua/dp/1400031869",
  "The Design of Everyday Things":
    "https://www.amazon.in/Design-Everyday-Things-Don-Norman/dp/0465050654",
  "How to Lie with Statistics":
    "https://www.amazon.in/How-Lie-Statistics-Darrell-Huff/dp/0393310728",
};

function showBook(detail, book) {
  const title = document.createElement("h3");
  title.textContent = book.dataset.title;
  const by = document.createElement("p");
  by.className = "by";
  by.textContent = "by " + book.dataset.author;
  const note = document.createElement("p");
  note.textContent = book.dataset.note;
  const parts = [title, by, note];
  const url = bookLinks[book.dataset.title];
  if (url) {
    const p = document.createElement("p");
    const a = document.createElement("a");
    a.className = "buy";
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = "View on Amazon India (opens in a new tab)";
    p.append(a);
    parts.push(p);
  }
  detail.replaceChildren(...parts);
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
    bg: "#5A86CB",
    fg: "#6C0820",
    ring: "#F2AEBC",
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

// Shelf props (a plant, a clock, a cactus) are added to the end of each shelf.
const props = {
  minds: `<svg viewBox="0 0 60 100"><g class="sway"><path d="M30 72L22 14L34 72M30 72L38 6L42 72M30 72L10 32L24 72M30 72L52 28L38 72" fill="#3D5D91" stroke="#6C0820" stroke-width="2" stroke-linejoin="round"/></g><path d="M14 70h32l-5 28H19z" fill="#F2AEBC" stroke="#6C0820" stroke-width="2.5" stroke-linejoin="round"/></svg>`,
  lit: `<svg viewBox="0 0 80 96"><rect x="6" y="56" width="68" height="38" rx="3" fill="#F2AEBC" stroke="#6C0820" stroke-width="2.5"/><rect x="26" y="18" width="30" height="36" rx="8" fill="#F2DCDB" stroke="#6C0820" stroke-width="2.5"/><circle cx="41" cy="36" r="11" fill="none" stroke="#6C0820" stroke-width="2"/><path d="M41 36V28" stroke="#6C0820" stroke-width="2" stroke-linecap="round"/><path class="hand" d="M41 36L47 40" stroke="#6C0820" stroke-width="2" stroke-linecap="round"/></svg>`,
  makers: `<svg viewBox="0 0 60 96"><path d="M22 70V24a8 8 0 0 1 16 0V70z" fill="#3D5D91" stroke="#6C0820" stroke-width="2"/><path d="M22 54H14a5 5 0 0 1-5-5V40M38 48h8a5 5 0 0 0 5-5V34" fill="none" stroke="#3D5D91" stroke-width="7" stroke-linecap="round"/><path d="M16 68h28l-4 26H20z" fill="#F2AEBC" stroke="#6C0820" stroke-width="2.5" stroke-linejoin="round"/></svg>`,
};
document.querySelectorAll(".shelf-section").forEach(function (shelf) {
  const key = ["minds", "lit", "makers"].find(function (k) {
    return shelf.classList.contains("shelf-" + k);
  });
  const rack = shelf.querySelector(".rack");
  if (!key || !rack) return;
  const li = document.createElement("li");
  li.className = "prop";
  li.setAttribute("aria-hidden", "true");
  li.innerHTML = props[key];
  rack.appendChild(li);
});
