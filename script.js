"use strict";

/* =====================================================================
   CONFIG — edit everything in this block. Nothing else needs changing.
   Replace the [bracketed] bits with real names and your own words.
   Messages are plain text; use "\n\n" in reply texts for a blank line.
   ===================================================================== */
const CONFIG = {
  her: "[Her name]",
  me: "[Your name]",
  title: "A Little Something for You",
  welcome: "Hey you… I made a little something for you.",
  startText: "Okay, I’m curious 👀",

  // Each item is one paragraph of the letter.
  letter: [
    "Heyyy, I wanted to tell you something, and I thought I’d do it in a slightly different way 😭",
    "It’s funny how we barely spoke back in school, but now talking to you feels so natural. I’m genuinely glad we started talking, and I wanted to make something a little special to tell you that."
  ],

  // 8 cards: icon + front title + back message. Add or remove freely (6–8 looks best).
  cards: [
    { icon: "💬", title: "The way our conversations flow.", text: "Talking with you never feels forced, and I really value that." },
    { icon: "🌿", title: "How easy it feels to talk to you.", text: "I can just be myself, and that means a lot." },
    { icon: "✨", title: "The little moments that make me smile.", text: "Some are small, but I notice them." },
    { icon: "😄", title: "Your sense of humour.", text: "[Edit me: mention a moment that made you laugh.]" },
    { icon: "🤝", title: "How glad I am that we started talking.", text: "Honestly, I’m really glad this happened." },
    { icon: "🌠", title: "The fact that this connection feels unexpected.", text: "Some good things show up when you’re not looking." },
    { icon: "📱", title: "The conversations I look forward to.", text: "I enjoy hearing from you." },
    { icon: "🔍", title: "Getting to know you a little more.", text: "I’d love to keep learning who you are, at your own pace." }
  ],

  // Star notes (up to 8).
  stars: [
    "I’m genuinely glad we started talking.",
    "It’s funny how some connections happen unexpectedly.",
    "I like getting to know you.",
    "You make ordinary conversations feel special.",
    "I appreciate the connection we’ve built.",
    "I’d like to know more about the person you are.",
    "No pressure. Just something honest from me.",
    "This little website exists because I wanted to tell you properly."
  ],

  // Tiny game
  randoms: [
    "Some people are easy to talk to. You’re one of them.",
    "No pressure, no expectations. Just honesty.",
    "I hope this made you smile, even a little.",
    "Thank you for taking the time to open this."
  ],
  compliments: [
    "You’re easy to be around.",
    "Talking with you feels natural.",
    "You’re someone worth getting to know."
  ],
  mystery: "Surprise: you’ve read this far, and that already means a lot to me.",
  extras: [
    "One more thing: you can take all the time you need.",
    "Whatever you decide, thank you for reading this with an open mind.",
    "Almost there. Take a breath, it’s just me being honest."
  ],

  // The confession (each item = one paragraph) and the question.
  confession: [
    "Honestly, I’m really glad we started talking.",
    "It’s kinda funny how we barely spoke back in school, but now talking to you feels so natural. I genuinely enjoy our conversations, and somewhere along the way, I realised that I was starting to like you as more than just a friend.",
    "I’m not telling you this because I expect anything from you or want to make things awkward. I just wanted to be honest about how I feel, because this connection genuinely means something to me.",
    "I’d love to get to know you better and see if there’s a possibility of something more between us, if you feel the same way.",
    "And if you don’t, it’s okay. I’ll respect your feelings. I just wanted to tell you honestly. ❤️"
  ],
  question: "Would you be open to seeing where this could go?",
  yesText: "I’d like that ❤️",
  noText: "I see you as a friend 🫶",
  yes: {
    title: "Okayyy, that made me smile ❤️",
    text: "I’d love for us to take things slowly, keep talking, and get to know each other better. No rush — let’s see where this goes."
  },
  no: {
    title: "Thank you for being honest with me 🫶",
    text: "I respect how you feel, and I’m glad you told me honestly. I appreciate the connection we’ve built, and there’s no pressure to feel differently."
  },

  // Optional music. Leave "" to disable. If set, a small button appears; audio never autoplays.
  musicUrl: ""
};
/* ===================== END OF CONFIG ===================== */

const $ = id => document.getElementById(id);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const wait = ms => new Promise(r => setTimeout(r, ms));
const order = ["welcome", "letter", "cards", "stars", "play", "confess"];
let typed = false, lastStar = null;
document.documentElement.classList.add("js");

function el(tag, cls, txt) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (txt !== undefined) e.textContent = txt;
  return e;
}

/* ---- scroll reveal ---- */
const io = "IntersectionObserver" in window
  ? new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { threshold: 0.15 })
  : null;
function observe(root) {
  root.querySelectorAll(".rv").forEach(n => io ? io.observe(n) : n.classList.add("in"));
}

/* ---- move to a section ---- */
function go(id) {
  const s = $(id);
  s.hidden = false;
  const i = order.indexOf(id);
  $("bar").style.width = ((i + 1) / order.length * 100) + "%";
  $("prog").setAttribute("aria-valuenow", i + 1);
  observe(s);
  s.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  const h = s.querySelector("h1,h2");
  if (h) h.focus({ preventScroll: true });
}

/* ---- typewriter ---- */
async function type(p, text) {
  if (reduce) { p.textContent = text; return; }
  for (const ch of Array.from(text)) { p.textContent += ch; await wait(22); }
}

/* ---- section 2: envelope ---- */
$("env").addEventListener("click", async () => {
  if (typed) return;
  typed = true;
  const env = $("env"), box = $("ltext");
  env.classList.add("open");
  env.setAttribute("aria-expanded", "true");
  env.setAttribute("aria-label", "Envelope opened");
  await wait(reduce ? 0 : 900);
  box.hidden = false;
  box.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  for (const line of CONFIG.letter) {
    const p = el("p");
    box.appendChild(p);
    await type(p, line);
  }
  $("toCards").hidden = false;
});

/* ---- section 3: appreciation cards ---- */
function buildCards() {
  const grid = $("grid"), opened = new Set(), total = CONFIG.cards.length;
  grid.replaceChildren();
  $("count").textContent = "0 of " + total + " opened";
  CONFIG.cards.forEach((c, i) => {
    const b = el("button", "card");
    b.type = "button";
    b.setAttribute("aria-pressed", "false");
    const flip = el("span", "flip"), f = el("span", "f"), back = el("span", "b", c.text);
    f.append(el("span", "ic", c.icon), el("span", "", c.title));
    flip.append(f, back);
    b.append(flip);
    b.addEventListener("click", () => {
      const on = b.getAttribute("aria-pressed") === "true";
      b.setAttribute("aria-pressed", String(!on));
      if (!on) opened.add(i);
      $("count").textContent = opened.size + " of " + total + " opened";
    });
    grid.appendChild(b);
  });
}

/* ---- section 4: stars ---- */
const POS = [[16, 14], [72, 10], [42, 34], [86, 42], [18, 58], [60, 64], [12, 88], [78, 86]];
function buildStars() {
  const field = $("field");
  field.replaceChildren();
  $("note").hidden = true;
  CONFIG.stars.slice(0, 8).forEach((t, i) => {
    const b = el("button", "star", "★");
    b.type = "button";
    b.setAttribute("aria-label", "Star " + (i + 1) + " of " + Math.min(8, CONFIG.stars.length));
    b.style.left = POS[i][0] + "%";
    b.style.top = POS[i][1] + "%";
    b.addEventListener("click", () => {
      field.querySelectorAll(".lit").forEach(x => x.classList.remove("lit"));
      b.classList.add("lit");
      lastStar = b;
      const n = $("note");
      $("notetxt").textContent = t;
      n.hidden = false;
      n.classList.remove("show");
      void n.offsetWidth;            // restart the fade animation
      n.classList.add("show");
    });
    field.appendChild(b);
  });
}
$("noteclose").addEventListener("click", () => {
  $("note").hidden = true;
  if (lastStar) { lastStar.classList.remove("lit"); lastStar.focus(); }
});

/* ---- section 5: tiny game ---- */
let mi = 0;
function buildPlay() {
  const picks = $("picks");
  picks.replaceChildren();
  CONFIG.compliments.forEach((c, i) => {
    const b = el("button", "", "⭐");
    b.type = "button";
    b.setAttribute("aria-label", "Pick star " + (i + 1));
    b.addEventListener("click", () => { $("out2").textContent = c; });
    picks.appendChild(b);
  });
  $("mtext").textContent = CONFIG.mystery;
  $("mystery").setAttribute("aria-pressed", "false");
  ["out1", "out2", "out3"].forEach(id => { $(id).textContent = ""; });
  mi = 0;
}
$("rnd").addEventListener("click", () => {
  const r = CONFIG.randoms;
  $("out1").textContent = r[Math.floor(Math.random() * r.length)];
});
$("mystery").addEventListener("click", e => {
  const b = e.currentTarget;
  b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true"));
});
$("more").addEventListener("click", () => {
  $("out3").textContent = CONFIG.extras[mi++ % CONFIG.extras.length];
});

/* ---- section 6: choices ---- */
function reply(kind) {
  const d = $("reply"), fx = $("fx");
  $("rt").textContent = CONFIG[kind].title;
  $("rm").textContent = CONFIG[kind].text;
  fx.replaceChildren();
  if (kind === "yes" && !reduce) {
    for (let i = 0; i < 16; i++) {
      const h = el("span", "", "♥");
      h.style.left = (4 + Math.random() * 92) + "%";
      h.style.fontSize = (0.9 + Math.random() * 1.2) + "rem";
      h.style.animationDelay = (Math.random() * 1.6) + "s";
      fx.appendChild(h);
    }
  }
  if (d.showModal) d.showModal(); else d.setAttribute("open", "");
}
$("yes").addEventListener("click", () => reply("yes"));
$("no").addEventListener("click", () => reply("no"));
$("back").addEventListener("click", () => {
  const d = $("reply");
  if (d.close) d.close(); else d.removeAttribute("open");
});

/* ---- background particles ---- */
function particles() {
  const frag = document.createDocumentFragment();
  for (let i = 0; i < 22; i++) {
    const s = el("span", "p", ["♥", "✦", "•"][i % 3]);
    s.setAttribute("aria-hidden", "true");
    s.style.cssText = "left:" + (Math.random() * 100) + "%;font-size:" + (0.6 + Math.random() * 0.9) +
      "rem;--d:" + (12 + Math.random() * 14) + "s;--dl:" + (-Math.random() * 20) + "s";
    frag.appendChild(s);
  }
  document.body.appendChild(frag);
}

/* ---- restart ---- */
function reset() {
  order.slice(1).forEach(id => { $(id).hidden = true; });
  document.querySelectorAll(".rv.in").forEach(n => n.classList.remove("in"));
  typed = false;
  const env = $("env");
  env.classList.remove("open");
  env.setAttribute("aria-expanded", "false");
  env.setAttribute("aria-label", "Open the envelope");
  $("ltext").replaceChildren();
  $("ltext").hidden = true;
  $("toCards").hidden = true;
  buildCards(); buildStars(); buildPlay();
  $("bar").style.width = (100 / order.length) + "%";
  $("prog").setAttribute("aria-valuenow", 1);
  observe($("welcome"));
  window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
}

/* ---- init ---- */
function init() {
  document.title = CONFIG.title;
  $("tag").textContent = CONFIG.title;
  $("greet").textContent = "Hi, " + CONFIG.her;
  $("sub").textContent = CONFIG.welcome;
  $("start").textContent = CONFIG.startText;
  $("ctext").replaceChildren(...CONFIG.confession.map(t => el("p", "", t)));
  $("q").textContent = CONFIG.question;
  $("yes").textContent = CONFIG.yesText;
  $("no").textContent = CONFIG.noText;

  $("start").addEventListener("click", () => go("letter"));
  $("toCards").addEventListener("click", () => go("cards"));
  $("toStars").addEventListener("click", () => go("stars"));
  $("toPlay").addEventListener("click", () => go("play"));
  $("skip").addEventListener("click", () => go("confess"));
  $("restart").addEventListener("click", reset);
  $("top").addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));
  addEventListener("scroll", () => { $("top").hidden = scrollY < 500; }, { passive: true });

  // subtle glow that follows the pointer (desktop only)
  if (matchMedia("(hover: hover) and (pointer: fine)").matches && !reduce) {
    addEventListener("pointermove", e => {
      document.body.style.setProperty("--mx", e.clientX + "px");
      document.body.style.setProperty("--my", e.clientY + "px");
    });
  }

  // optional music: never autoplays, user-controlled
  if (CONFIG.musicUrl) {
    const b = $("music");
    let a = null;
    b.hidden = false;
    b.addEventListener("click", () => {
      if (!a) { a = new Audio(CONFIG.musicUrl); a.loop = true; }
      if (a.paused) { a.play().catch(() => {}); b.textContent = "🔇 Mute"; }
      else { a.pause(); b.textContent = "🔈 Music"; }
    });
  }

  particles();
  buildCards(); buildStars(); buildPlay();
  observe($("welcome"));
}
init();