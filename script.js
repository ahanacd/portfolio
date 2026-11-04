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

// Goodreads links, matched by book title. These are Goodreads searches; swap in a direct book page if you prefer.
const bookLinks = {
  "Thinking, Fast and Slow":
    "https://www.goodreads.com/search?q=Thinking%2C+Fast+and+Slow+Daniel+Kahneman",
  "How Emotions Are Made":
    "https://www.goodreads.com/search?q=How+Emotions+Are+Made+Lisa+Feldman+Barrett",
  "Emotional Intelligence":
    "https://www.goodreads.com/search?q=Emotional+Intelligence+Daniel+Goleman",
  "The Man Who Mistook His Wife for a Hat":
    "https://www.goodreads.com/search?q=The+Man+Who+Mistook+His+Wife+for+a+Hat+Oliver+Sacks",
  Othello: "https://www.goodreads.com/search?q=Othello+William+Shakespeare",
  "Chokher Bali":
    "https://www.goodreads.com/search?q=Chokher+Bali+Rabindranath+Tagore",
  "Normal People":
    "https://www.goodreads.com/search?q=Normal+People+Sally+Rooney",
  "To Live": "https://www.goodreads.com/search?q=To+Live+Yu+Hua",
  "The Design of Everyday Things":
    "https://www.goodreads.com/search?q=The+Design+of+Everyday+Things+Don+Norman",
  "How to Lie with Statistics":
    "https://www.goodreads.com/search?q=How+to+Lie+with+Statistics+Darrell+Huff",
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
    a.textContent = "Find it on Goodreads (opens in a new tab)";
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

// ---------- Site furniture: live dates, section links, footer link, extras ----------
// Edit links and wording for this part in one place.
const SITE = {
  substack: "https://substack.com/@annareverizes",
  essay:
    "https://drive.google.com/file/d/1BV6NUMgt-CB7QgDh8CYKdIqB_8qhXOUC/view?usp=drive_link",
  sections: [
    { href: "recruiter.html", label: "Recruiter" },
    { href: "researcher.html", label: "Researcher" },
    { href: "reader.html", label: "Reader" },
  ],
  substacks: [
    {
      name: "Experimental History",
      by: "Adam Mastroianni",
      url: "https://www.experimental-history.com",
      note: "An experimental psychologist thinking hard about unusual ideas.",
    },
    {
      name: "Sean Trott’s newsletter",
      by: "Sean Trott",
      url: "https://seantrott.substack.com",
      note: "Cognitive science research explained by a UC San Diego professor.",
    },
  ],
  editorsNote: [
    "Why a newspaper? When I was a child, my mother encouraged me to read one. I may have read it, and I may not have. Here I am anyway, because that folded pile of paper might be the place where I first met new ideas: a word I didn’t know, a place I had never been, an argument I had to read twice.",
    "So this site is a newspaper. Each door above is a section, the date changes every day like a real front page, and the rest is yours to read in any order.",
  ],
  staff: [
    "Editor: Ahana Chanda",
    "BA English (Honours), Visva-Bharati University, 2025–2029",
    "Minors: Statistics and Chinese",
  ],
};

const now = new Date();
const dateText = now.toLocaleDateString("en-IN", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});
const dayNumber = Math.floor(
  (now - new Date(now.getFullYear(), 0, 0)) / 86400000,
);
const here = location.pathname.split("/").pop() || "index.html";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}
function link(href, text, newTab) {
  const a = el("a", "", text);
  a.href = href;
  if (newTab) {
    a.target = "_blank";
    a.rel = "noopener";
  }
  return a;
}

// Every newspaper carries today's date
document.querySelectorAll(".door").forEach(function (door) {
  door.prepend(el("span", "paper-date", dateText + " · No. " + dayNumber));
});
document.querySelectorAll(".kicker").forEach(function (kicker) {
  const spans = kicker.querySelectorAll("span");
  if (spans.length >= 2) {
    spans[0].textContent = "Vol. 1 · No. " + dayNumber;
    spans[1].textContent = dateText;
  }
});

// Section links on the inner pages, next to "Back to start"
const back = document.querySelector("main > a.back");
if (back) {
  const nav = el("nav", "sections");
  nav.setAttribute("aria-label", "Sections");
  nav.append(link("index.html", "← Front page"));
  SITE.sections.forEach(function (sec) {
    if (sec.href !== here) nav.append(link(sec.href, sec.label));
  });
  back.replaceWith(nav);
}

// Substack link in every footer
const footerLine = document.querySelector("footer p");
if (footerLine) footerLine.append(" · ", link(SITE.substack, "Substack", true));

// Essay link on the researcher page
const project = document.querySelector(".researcher .project");
if (project) {
  const p = el("p");
  p.append(
    link(
      SITE.essay,
      "Read the essay (PDF on Google Drive, opens in a new tab)",
      true,
    ),
  );
  project.append(p);
}

// Substack recommendations on the reader page
if (document.body.classList.contains("reader")) {
  const shelves = document.querySelectorAll(".shelf-section");
  const last = shelves[shelves.length - 1];
  if (last) {
    const wrap = el("section", "subs-wrap");
    wrap.append(el("p", "label", "Substacks worth a subscription"));
    const list = el("ul", "subs");
    SITE.substacks.forEach(function (sub) {
      const li = el("li");
      li.append(
        link(sub.url, sub.name, true),
        " by " + sub.by + ". " + sub.note,
      );
      list.append(li);
    });
    wrap.append(list);
    const mine = el("p");
    mine.append(
      "My own writing lives on ",
      link(SITE.substack, "my Substack", true),
      ".",
    );
    wrap.append(mine);
    last.after(wrap);
  }
}

// Intro heading: a sand clock and "Let's get in"
const who = document.getElementById("who");
if (who) {
  who.textContent = "Let’s get in";
  who.insertAdjacentHTML(
    "afterbegin",
    '<svg class="glass" viewBox="0 0 60 90" aria-hidden="true">' +
      '<path d="M10 6H50M10 84H50" stroke="#eff6ee" stroke-width="5" stroke-linecap="round"/>' +
      '<polygon class="sand-top" points="16,12 44,12 30,40" fill="#ff9f1c"/>' +
      '<polygon class="sand-bottom" points="16,80 44,80 30,62" fill="#ff9f1c"/>' +
      '<line class="sand-line" x1="30" y1="42" x2="30" y2="78" stroke="#ff9f1c" stroke-width="2"/>' +
      '<path d="M14 8C14 28 28 38 30 45C32 52 46 62 46 82H14C14 62 28 52 30 45C32 38 46 28 46 8Z" fill="none" stroke="#eff6ee" stroke-width="3" stroke-linejoin="round"/></svg>',
  );
}

// Editor's note and staff box on the home page
if (document.body.classList.contains("home")) {
  const doors = document.getElementById("doors");
  if (doors) {
    const note = el("section", "editor-note");
    note.append(el("h2", "", "Editor’s note"));
    SITE.editorsNote.forEach(function (t) {
      note.append(el("p", "", t));
    });
    const staff = el("div", "staff");
    staff.append(el("h3", "", "The staff box"));
    SITE.staff.forEach(function (t) {
      staff.append(el("p", "", t));
    });
    note.append(staff);
    doors.after(note);
  }
}

// Page transitions: a newspaper is thrown onto the screen, then the next page loads.
// Colours match each page's background so the join is seamless.
const pages = {
  "index.html": { bg: "#001845", word: "The Front Page" },
  "recruiter.html": { bg: "#F0E6DA", word: "The Hiring Herald" },
  "researcher.html": { bg: "#FCE6C4", word: "The Research Gazette" },
  "reader.html": { bg: "#5A86CB", word: "The Reader’s Review" },
};

function throwPaper(page) {
  const layer = el("div", "throw");
  layer.setAttribute("aria-hidden", "true");
  layer.style.setProperty("--dest", page.bg);
  const sheet = el("div", "sheet");
  sheet.append(
    el("span", "s-date", dateText),
    el("strong", "s-name", page.word),
    el("span", "s-pic"),
    el("span", "s-cols"),
    el("span", "s-grid"),
  );
  layer.append(sheet);
  document.body.appendChild(layer);
}

document.querySelectorAll("a[href]").forEach(function (link) {
  const page = pages[link.getAttribute("href")];
  if (!page) return;
  link.addEventListener("click", function (e) {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
      return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return; // normal, instant navigation
    e.preventDefault();
    throwPaper(page);
    setTimeout(function () {
      location.href = link.href;
    }, 1000);
  });
});

// If the visitor presses the browser's Back button, clear any leftover wipe.
window.addEventListener("pageshow", function (e) {
  if (e.persisted)
    document.querySelectorAll(".curtain, .throw").forEach(function (c) {
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
