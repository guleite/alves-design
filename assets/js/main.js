/* =========================================================
   ESCRITÓRIO ALVESDESIGN — scripts
   - abertura, cursor, topo, menu, rolagem suave e revelações
   - slider de serviços inspirado no vídeo de referência:
     painel colorido à direita que se expande em detalhes
   - galeria com filtro e ampliação, processo, bastidores
   - formulário qualificador que termina no WhatsApp
   ========================================================= */

// WhatsApp do escritório: formato internacional, só dígitos
const ALVES_WHATSAPP = "5561992786345";
// Endereço opcional para receber o lead (CRM, planilha, e-mail). Vazio = não envia.
const ALVES_LEAD_ENDPOINT = "";

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const hasGsap = !!(window.gsap && window.ScrollTrigger);
const isMobile = () => window.matchMedia("(max-width: 1100px)").matches;
const track = (event, data = {}) => { (window.dataLayer = window.dataLayer || []).push({ event, ...data }); };

document.body.classList.toggle("js", hasGsap);
$$(".js-year").forEach((el) => (el.textContent = new Date().getFullYear()));

/* ---------- Rolagem suave ---------- */
let lenis = null;
if (hasGsap) gsap.registerPlugin(ScrollTrigger);
if (window.Lenis && !reduced) {
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
  window.lenis = lenis;
  if (hasGsap) {
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
}
const lockScroll = (on) => {
  document.body.classList.toggle("is-locked", on);
  if (lenis) on ? lenis.stop() : lenis.start();
};
const scrollToEl = (target) => {
  if (!target) return;
  if (lenis) lenis.scrollTo(target, { duration: 1.4, offset: 0 });
  else target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
};
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute("href");
  if (id.length < 2) return;
  const t = document.querySelector(id);
  if (!t) return;
  e.preventDefault();
  if (document.documentElement.classList.contains("menu-open")) closeMenu();
  scrollToEl(t);
});

/* ---------- Quebra de texto em palavras ---------- */
$$(".split").forEach((el) => {
  const walk = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) return frag.appendChild(document.createTextNode(" "));
          const w = document.createElement("span");
          w.className = "w";
          w.innerHTML = `<span>${part}</span>`;
          frag.appendChild(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && !n.classList.contains("w")) walk(n);
    });
  };
  walk(el);
});
$$("[data-words]").forEach((el) => {
  el.innerHTML = el.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(" ");
});

/* ---------- Abertura + entrada do hero ---------- */
const showChrome = () => {
  $(".side-tab")?.classList.add("is-in");
  $(".wa-float")?.classList.add("is-in");
};
function heroIntro(tl) {
  tl.from(".panel__media", { clipPath: "inset(100% 0 0 0)", duration: 1.3, stagger: 0.12, ease: "expo.inOut" }, 0)
    .from(".panel__media img", { scale: 1.45, duration: 2, stagger: 0.12, ease: "expo.out" }, 0.1)
    .fromTo(".panel__rule", { scaleY: 0 }, { scaleY: 1, duration: 1, stagger: 0.12, ease: "expo.out" }, 0.8)
    .from(".panel__info small, .panel__info h2", { y: 30, opacity: 0, duration: 1, stagger: 0.06, ease: "expo.out" }, 0.9)
    .from(".hero__title .line > span", { yPercent: 110, duration: 1.3, stagger: 0.1, ease: "expo.out" }, 0.45)
    .from(".hero__eyebrow, .hero__lead, .hero__cta, .hero__scroll", { y: 24, opacity: 0, duration: 1, stagger: 0.08, ease: "expo.out" }, 0.9)
    .from(".nav", { y: -30, opacity: 0, duration: 1, ease: "expo.out" }, 0.8)
    .add(showChrome, 1.2);
}
if (hasGsap && !reduced) {
  const tl = gsap.timeline({ onComplete: () => { $(".loader")?.remove(); document.body.classList.remove("is-loading"); } });
  tl.to(".loader__word span", { y: 0, duration: 1, stagger: 0.06, ease: "expo.out" })
    .to(".loader__line i", { scaleX: 1, duration: 1.1, ease: "expo.inOut" }, 0.2)
    .to(".loader__tag", { opacity: 0.7, duration: 0.6 }, 0.6)
    .to(".loader__inner", { y: -50, opacity: 0, duration: 0.7, ease: "expo.in" }, 1.45)
    .to(".loader__panel", { yPercent: -100, duration: 1.1, stagger: 0.08, ease: "expo.inOut" }, 1.75);
  const intro = gsap.timeline();
  heroIntro(intro);
  tl.add(intro, 2.0);
} else {
  $(".loader")?.remove();
  document.body.classList.remove("is-loading");
  showChrome();
}

/* ---------- Cursor ---------- */
if (finePointer && !reduced) {
  const cur = $(".cursor"), label = $(".cursor__label");
  document.documentElement.classList.add("has-cursor");
  let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
  addEventListener("pointermove", (e) => { x = e.clientX; y = e.clientY; cur.classList.add("is-on"); }, { passive: true });
  document.addEventListener("pointerleave", () => cur.classList.remove("is-on"));
  addEventListener("pointerdown", () => cur.classList.add("is-down"));
  addEventListener("pointerup", () => cur.classList.remove("is-down"));
  const loop = () => {
    cx += (x - cx) * 0.2; cy += (y - cy) * 0.2;
    cur.style.translate = `${cx}px ${cy}px`;
    requestAnimationFrame(loop);
  };
  loop();
  document.addEventListener("pointerover", (e) => {
    const t = e.target.closest("[data-cursor], .g-item");
    if (t) { label.textContent = t.dataset.cursor || "Ampliar"; cur.classList.add("is-big"); }
  });
  document.addEventListener("pointerout", (e) => {
    const t = e.target.closest("[data-cursor], .g-item");
    if (t && !t.contains(e.relatedTarget)) cur.classList.remove("is-big");
  });
}

/* ---------- Topo ---------- */
const nav = $(".nav");
let lastY = 0;
const onScroll = () => {
  const y = window.scrollY;
  nav.classList.toggle("is-scrolled", y > 40);
  const goingDown = y > lastY && y > window.innerHeight * 0.9;
  nav.classList.toggle("is-hidden", goingDown && !document.documentElement.classList.contains("menu-open"));
  lastY = y;
};
addEventListener("scroll", onScroll, { passive: true });
const sections = $$("main section[id]");
const links = $$(".nav__links a");
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + en.target.id));
  });
}, { rootMargin: "-45% 0px -50% 0px" });
sections.forEach((s) => io.observe(s));

/* ---------- Menu em tela cheia ---------- */
const burger = $(".nav__burger"), menu = $("#menu");
let menuTl = null;
function openMenu() {
  document.documentElement.classList.add("menu-open");
  burger.setAttribute("aria-expanded", "true");
  menu.setAttribute("aria-hidden", "false");
  lockScroll(true);
  if (!hasGsap) { menu.style.visibility = "visible"; $(".menu__bg").style.clipPath = "none"; $$(".menu__list a, .menu__foot").forEach((a) => { a.style.transform = "none"; a.style.opacity = 1; }); $(".menu__preview").style.clipPath = "none"; return; }
  menuTl?.kill();
  menuTl = gsap.timeline()
    .set(menu, { visibility: "visible" })
    .to(".menu__bg", { clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: "expo.inOut" })
    .to(".menu__list a", { y: 0, duration: 1, stagger: 0.06, ease: "expo.out" }, 0.45)
    .to(".menu__preview", { clipPath: "inset(0% 0 0 0)", duration: 1.1, ease: "expo.inOut" }, 0.4)
    .to(".menu__foot", { opacity: 1, duration: 0.6 }, 0.8);
}
function closeMenu() {
  document.documentElement.classList.remove("menu-open");
  burger.setAttribute("aria-expanded", "false");
  menu.setAttribute("aria-hidden", "true");
  lockScroll(false);
  if (!hasGsap) { menu.style.visibility = "hidden"; return; }
  menuTl?.kill();
  menuTl = gsap.timeline()
    .to(".menu__list a", { y: "-105%", duration: 0.5, stagger: 0.03, ease: "expo.in" })
    .to(".menu__foot", { opacity: 0, duration: 0.3 }, 0)
    .to(".menu__preview", { clipPath: "inset(0 0 100% 0)", duration: 0.6, ease: "expo.in" }, 0)
    .to(".menu__bg", { clipPath: "inset(0 0 100% 0)", duration: 0.8, ease: "expo.inOut" }, 0.3)
    .set(menu, { visibility: "hidden" })
    .set(".menu__list a", { y: "105%" })
    .set(".menu__preview", { clipPath: "inset(100% 0 0 0)" });
}
burger.addEventListener("click", () => (document.documentElement.classList.contains("menu-open") ? closeMenu() : openMenu()));
$$(".menu__list a").forEach((a) => a.addEventListener("pointerenter", () => {
  const img = $(".menu__preview img");
  if (img.getAttribute("src") === a.dataset.img) return;
  img.src = a.dataset.img;
  if (hasGsap) gsap.fromTo(img, { scale: 1.2, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 0.9, ease: "expo.out" });
}));

/* ---------- Revelações na rolagem ---------- */
if (hasGsap && !reduced) {
  $$(".split").forEach((el) => {
    if (el.closest(".hero")) return;
    gsap.from($$(".w > span", el), {
      yPercent: 110, duration: 1.1, stagger: 0.035, ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 85%" },
    });
  });
  $$(".fade-up").forEach((el) => gsap.from(el, { y: 36, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%" } }));
  $$(".reveal-img").forEach((el) => {
    gsap.to(el, { clipPath: "inset(0% 0 0 0)", duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: el, start: "top 82%" } });
    gsap.from($("img", el), { scale: 1.3, duration: 1.8, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 82%" } });
  });
  $$("[data-parallax]").forEach((el) => {
    gsap.to(el, { yPercent: +el.dataset.parallax, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
  });
  gsap.to(".about__main img", { yPercent: -12, ease: "none", scrollTrigger: { trigger: ".about", start: "top bottom", end: "bottom top", scrub: true } });
  // hero: imagens descem mais devagar que a página
  gsap.to(".panel__media img", { yPercent: 10, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".hero__title", { yPercent: -40, opacity: 0.2, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  // manifesto: palavras acendem conforme a leitura
  gsap.to(".manifesto__quote .w", {
    opacity: 1, stagger: 0.08, ease: "none",
    scrollTrigger: { trigger: ".manifesto__quote", start: "top 80%", end: "bottom 45%", scrub: true },
  });
  gsap.from(".manifesto__sign", { y: 20, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".manifesto__sign", start: "top 92%" } });
  // CTA final: foto se aproxima
  gsap.to(".final__media img", { scale: 1, ease: "none", scrollTrigger: { trigger: ".final", start: "top bottom", end: "center center", scrub: true } });
  // galeria entra em cascata
  ScrollTrigger.batch(".g-item", {
    start: "top 92%",
    onEnter: (els) => gsap.from(els, { y: 60, opacity: 0, duration: 1.1, stagger: 0.08, ease: "expo.out", overwrite: true }),
  });
  gsap.from(".presence__list li", { y: 30, opacity: 0, duration: 0.9, stagger: 0.07, ease: "expo.out", scrollTrigger: { trigger: ".presence", start: "top 85%" } });
  gsap.from(".insta__rail img", { x: 120, opacity: 0, duration: 1.2, stagger: 0.07, ease: "expo.out", scrollTrigger: { trigger: ".insta__rail", start: "top 88%" } });
  gsap.from(".faq details", { y: 24, opacity: 0, duration: 0.9, stagger: 0.07, ease: "expo.out", scrollTrigger: { trigger: ".faq__list", start: "top 85%" } });
  addEventListener("load", () => ScrollTrigger.refresh());
}

/* =========================================================
   SERVIÇOS — slider do vídeo de referência
   ========================================================= */
const stage = $(".stage");
const slides = $$(".slide", stage);
const data = slides.map((s) => ({
  color: s.dataset.color,
  key: s.dataset.key,
  alt: s.dataset.alt,
  title: $$("h3 span", s).map((x) => x.textContent),
  kicker: $(".slide__kicker", s).textContent,
  desc: $$(".slide__text > p:not(.slide__kicker)", s)[0].textContent,
  list: $$(".slide__list li", s).map((li) => li.textContent),
  img: $(".slide__media img", s),
}));
let cur = 0, busy = false, detailOpen = false;
const titleEl = $(".stage__title"), kickerEl = $(".stage__kicker"), descEl = $(".stage__desc");
const peekImg = $(".stage__peek-img img");
const dotsWrap = $(".stage__dots");
$(".js-total").textContent = String(data.length).padStart(2, "0");
data.forEach((d, i) => {
  const b = document.createElement("button");
  b.setAttribute("role", "tab");
  b.setAttribute("aria-label", d.key);
  b.addEventListener("click", () => go(i));
  dotsWrap.appendChild(b);
});
const writeCopy = (i) => {
  const d = data[i];
  titleEl.innerHTML = d.title.map((t) => `<span class="ln"><span>${t}</span></span>`).join("");
  kickerEl.textContent = d.kicker;
  descEl.textContent = d.desc;
  $(".js-cur").textContent = String(i + 1).padStart(2, "0");
  $$("button", dotsWrap).forEach((b, k) => { b.classList.toggle("is-on", k === i); b.setAttribute("aria-selected", k === i); });
};
const writePeek = (i) => { peekImg.src = data[i].alt; peekImg.alt = ""; };
stage.style.setProperty("--peek", data[0].color);
writeCopy(0);
writePeek(0);

function go(to, dir) {
  if (busy || detailOpen) return;
  const next = (to + data.length) % data.length;
  if (next === cur) return;
  dir = dir || (next > cur ? 1 : -1);
  const prev = cur;
  cur = next;
  track("service_view", { service: data[cur].key });
  if (!hasGsap || reduced) {
    slides[prev].classList.remove("is-active");
    slides[cur].classList.add("is-active");
    stage.style.setProperty("--peek", data[cur].color);
    writeCopy(cur); writePeek(cur);
    return;
  }
  busy = true;
  const inMedia = $(".slide__media", slides[cur]);
  const outMedia = $(".slide__media", slides[prev]);
  gsap.set(slides[cur], { zIndex: 2 });
  gsap.set(slides[prev], { zIndex: 1 });
  slides[cur].classList.add("is-active");
  const tl = gsap.timeline({
    defaults: { ease: "expo.inOut" },
    onComplete: () => {
      slides[prev].classList.remove("is-active");
      gsap.set([inMedia, outMedia, slides[cur], slides[prev], $("img", inMedia), $("img", outMedia)], { clearProps: "all" });
      busy = false;
    },
  });
  tl.fromTo(inMedia, { clipPath: dir > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0%)", duration: 1.15 }, 0)
    .fromTo($("img", inMedia), { scale: 1.3, xPercent: 10 * dir }, { scale: 1, xPercent: 0, duration: 1.4, ease: "expo.out" }, 0.1)
    .to($("img", outMedia), { xPercent: -14 * dir, duration: 1.15 }, 0)
    .to(stage, { "--peek": data[cur].color, duration: 1 }, 0.1)
    // texto sai e entra
    .to(".stage__title .ln > span", { yPercent: -110, duration: 0.55, stagger: 0.05, ease: "expo.in" }, 0)
    .to(".stage__play, .stage__label, .stage__desc, .stage__more", { opacity: 0, y: -10, duration: 0.4, ease: "power2.in" }, 0)
    .add(() => writeCopy(cur), 0.6)
    .fromTo(".stage__title .ln > span", { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.07, ease: "expo.out", immediateRender: false }, 0.62)
    .to(".stage__play, .stage__label, .stage__desc, .stage__more", { opacity: 1, y: 0, duration: 0.8, stagger: 0.05, ease: "expo.out" }, 0.75)
    // painel lateral troca a foto deslizando
    .to(".stage__peek-img", { xPercent: 40, opacity: 0, duration: 0.5, ease: "expo.in" }, 0)
    .add(() => writePeek(cur), 0.55)
    .fromTo(".stage__peek-img", { xPercent: 60, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 1, ease: "expo.out", immediateRender: false }, 0.6);
}
$$(".js-next", stage).forEach((b) => b.addEventListener("click", () => go(cur + 1, 1)));
$$(".js-prev", stage).forEach((b) => b.addEventListener("click", () => go(cur - 1, -1)));

// arrastar / deslizar
(() => {
  let sx = 0, sy = 0, down = false;
  const area = $(".stage__slides");
  area.addEventListener("pointerdown", (e) => { down = true; sx = e.clientX; sy = e.clientY; });
  addEventListener("pointerup", (e) => {
    if (!down) return;
    down = false;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(cur + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  });
  area.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  area.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(cur + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  }, { passive: true });
})();

// teclado quando o slider está na tela
let stageVisible = false;
new IntersectionObserver(([en]) => (stageVisible = en.isIntersecting), { threshold: 0.5 }).observe(stage);
addEventListener("keydown", (e) => {
  if (!stageVisible || $("#lead").classList.contains("is-open")) return;
  if (e.key === "ArrowRight") go(cur + 1, 1);
  if (e.key === "ArrowLeft") go(cur - 1, -1);
});

// painéis do hero levam ao serviço correspondente
$$(".panel[data-slide]").forEach((p) => p.addEventListener("click", () => {
  const i = +p.dataset.slide;
  setTimeout(() => go(i), 500);
}));

/* ---------- Detalhes: painel colorido expande + gaveta ---------- */
const flood = $(".stage__flood"), drawer = $(".drawer");
function openDetail() {
  if (busy || detailOpen) return;
  detailOpen = true;
  const d = data[cur];
  track("service_detail", { service: d.key });
  $(".drawer__img img").src = d.alt;
  $(".drawer__img img").alt = d.key;
  $(".drawer__title").textContent = d.title.join(" ");
  $(".drawer__kicker").textContent = d.kicker;
  $(".drawer__list").innerHTML = d.list.map((t) => `<li>${t}</li>`).join("");
  $(".drawer__fav").classList.remove("is-on");
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  const mobile = isMobile();
  if (!hasGsap || reduced) {
    flood.style.visibility = "visible"; flood.style.clipPath = "inset(0 0 0 0)";
    $(".drawer__body").style.transform = "none"; $(".drawer__back").style.opacity = 1;
    (isMobile() ? $(".drawer__x") : $(".drawer__back")).focus({ preventScroll: true });
    return;
  }
  busy = true;
  gsap.timeline({ onComplete: () => { busy = false; (isMobile() ? $(".drawer__x") : $(".drawer__back")).focus({ preventScroll: true }); } })
    .set(flood, { visibility: "visible", clipPath: mobile ? "inset(0 0 45% 82%)" : "inset(0 0 0 85%)" })
    .to(flood, { clipPath: "inset(0 0 0% 0%)", duration: 1, ease: "expo.inOut" })
    .fromTo(".drawer__img", { clipPath: "inset(0 0 0 100%)" }, { clipPath: "inset(0 0 0 0%)", duration: 1.1, ease: "expo.inOut" }, 0.55)
    .fromTo(".drawer__img img", { scale: 1.3 }, { scale: 1, duration: 1.5, ease: "expo.out" }, 0.6)
    .fromTo(".drawer__body", { x: 0, y: 0, xPercent: mobile ? 0 : 100, yPercent: mobile ? 100 : 0 }, { xPercent: 0, yPercent: 0, duration: 1, ease: "expo.out" }, 0.75)
    .fromTo(".drawer__body > *", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: "expo.out" }, 0.95)
    .to(".drawer__back", { opacity: 1, duration: 0.5 }, 1);
}
function closeDetail() {
  if (!detailOpen || busy) return;
  const done = () => {
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    if (hasGsap) gsap.set([flood, ".drawer__body", ".drawer__img", ".drawer__back", ".drawer__body > *"], { clearProps: "all" });
    flood.removeAttribute("style"); $(".drawer__body").removeAttribute("style"); $(".drawer__back").removeAttribute("style");
    detailOpen = false; busy = false;
  };
  if (!hasGsap || reduced) return done();
  busy = true;
  const mobile = isMobile();
  gsap.timeline({ onComplete: done })
    .to(".drawer__back", { opacity: 0, duration: 0.3 })
    .to(".drawer__body", mobile ? { yPercent: 100, duration: 0.8, ease: "expo.in" } : { xPercent: 100, duration: 0.8, ease: "expo.in" }, 0)
    .to(".drawer__img", { clipPath: "inset(0 100% 0 0)", duration: 0.8, ease: "expo.inOut" }, 0.1)
    .to(flood, { clipPath: mobile ? "inset(0 0 45% 82%)" : "inset(0 0 0 85%)", duration: 0.9, ease: "expo.inOut" }, 0.55);
}
$$(".js-detail").forEach((b) => b.addEventListener("click", openDetail));
$$(".js-close-detail").forEach((b) => b.addEventListener("click", closeDetail));
$(".drawer__fav").addEventListener("click", (e) => e.currentTarget.classList.toggle("is-on"));
$$(".js-lead-service").forEach((b) => b.addEventListener("click", () => openLead(data[cur].key, b)));

/* ---------- Galeria: filtro + ampliação ---------- */
const items = $$(".g-item");
$$(".filters button").forEach((btn) => btn.addEventListener("click", () => {
  $$(".filters button").forEach((b) => b.classList.toggle("is-on", b === btn));
  const f = btn.dataset.filter;
  const show = items.filter((it) => f === "all" || it.dataset.cat === f);
  const apply = () => {
    items.forEach((it) => it.classList.toggle("is-out", !show.includes(it)));
    if (hasGsap) {
      gsap.fromTo(show, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.05, ease: "expo.out" });
      ScrollTrigger.refresh();
    }
  };
  if (hasGsap) gsap.to(items.filter((it) => !it.classList.contains("is-out")), { opacity: 0, y: -20, duration: 0.3, stagger: 0.015, ease: "power2.in", onComplete: apply });
  else apply();
}));

const lb = $(".lightbox"), lbImg = $(".lightbox__fig img"), lbCap = $(".lightbox__fig figcaption");
let lbList = [], lbIdx = 0, lbTrigger = null;
const lbShow = (i, dir = 0) => {
  lbIdx = (i + lbList.length) % lbList.length;
  const it = lbList[lbIdx];
  lbImg.src = $("img", it).src;
  lbImg.alt = $("img", it).alt;
  lbCap.innerHTML = $("figcaption", it).innerHTML;
  if (hasGsap) gsap.fromTo(".lightbox__fig", { x: 60 * dir, opacity: 0, scale: dir ? 1 : 0.94 }, { x: 0, opacity: 1, scale: 1, duration: 0.8, ease: "expo.out" });
};
items.forEach((it) => {
  it.tabIndex = 0;
  it.setAttribute("role", "button");
  const open = () => {
    lbTrigger = it;
    lbList = items.filter((x) => !x.classList.contains("is-out"));
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
    lockScroll(true);
    lbShow(lbList.indexOf(it));
    $(".lightbox__close").focus();
  };
  it.addEventListener("click", open);
  it.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
});
const lbClose = () => { lb.classList.remove("is-open"); lb.setAttribute("aria-hidden", "true"); lockScroll(false); lbTrigger?.focus({ preventScroll: true }); };
$(".lightbox__close").addEventListener("click", lbClose);
$(".lightbox__prev").addEventListener("click", () => lbShow(lbIdx - 1, -1));
$(".lightbox__next").addEventListener("click", () => lbShow(lbIdx + 1, 1));
lb.addEventListener("click", (e) => { if (e.target === lb) lbClose(); });

/* ---------- Processo ---------- */
const steps = $$(".step"), frames = $$(".process__frame img"), num = $(".process__num");
const stepIO = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    const i = steps.indexOf(en.target);
    steps.forEach((s, k) => s.classList.toggle("is-on", k === i));
    frames.forEach((f, k) => f.classList.toggle("is-on", k === i));
    num.textContent = String(i + 1).padStart(2, "0");
    if (hasGsap && !reduced) gsap.fromTo(num, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.7, ease: "expo.out" });
  });
}, { rootMargin: "-48% 0px -48% 0px" });
steps.forEach((s) => stepIO.observe(s));

/* ---------- Bastidores: arrastar ---------- */
(() => {
  const rail = $(".insta__rail");
  let down = false, sx = 0, sl = 0, v = 0, lx = 0;
  rail.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") return; down = true; sx = lx = e.clientX; sl = rail.scrollLeft; rail.classList.add("is-drag"); });
  addEventListener("pointermove", (e) => { if (!down) return; rail.scrollLeft = sl - (e.clientX - sx); v = e.clientX - lx; lx = e.clientX; });
  addEventListener("pointerup", () => {
    if (!down) return;
    down = false; rail.classList.remove("is-drag");
    const glide = () => { if (Math.abs(v) < 0.5) return; rail.scrollLeft -= v; v *= 0.93; requestAnimationFrame(glide); };
    glide();
  });
})();

/* =========================================================
   FORMULÁRIO QUALIFICADOR → WhatsApp
   ========================================================= */
const lead = $("#lead"), form = $(".lead__form", lead);
const qs = $$(".q:not(.q--done)", form);
const nextBtn = $(".lead__next", lead), backBtn = $(".lead__back", lead);
let step = 0, leadTrigger = null;

const answered = (i) => {
  const q = qs[i];
  if (q.classList.contains("q--form")) return true;
  return !!$("input:checked", q);
};
function showStep(i) {
  step = i;
  qs.forEach((q, k) => q.classList.toggle("is-on", k === i));
  $(".q--done", form).classList.remove("is-on");
  $(".lead__progress i").style.width = `${((i + 1) / (qs.length + 1)) * 100}%`;
  $(".js-step").textContent = i + 1;
  backBtn.classList.toggle("is-on", i > 0);
  nextBtn.disabled = !answered(i);
  $("span", nextBtn).textContent = i === qs.length - 1 ? "Ir para o WhatsApp" : "Continuar";
  track("lead_step", { step: i + 1 });
}
function openLead(service, trigger) {
  leadTrigger = trigger || document.activeElement;
  form.reset();
  $(".err", form).textContent = "";
  $$(".is-bad", form).forEach((x) => x.classList.remove("is-bad"));
  lead.classList.remove("is-done");
  let start = 0;
  if (service) {
    const r = $$('input[name="projeto"]', form).find((x) => x.value === service);
    if (r) { r.checked = true; start = 1; }
  }
  showStep(start);
  lead.classList.add("is-open");
  lead.setAttribute("aria-hidden", "false");
  lockScroll(true);
  track("lead_open", { service: service || "" });
  setTimeout(() => $("input", qs[start])?.focus({ preventScroll: true }), 450);
}
function closeLead() {
  lead.classList.remove("is-open");
  lead.setAttribute("aria-hidden", "true");
  lockScroll(false);
  leadTrigger?.focus?.({ preventScroll: true });
}
$$("[data-open-lead]").forEach((b) => b.addEventListener("click", (e) => {
  e.preventDefault();
  if (document.documentElement.classList.contains("menu-open")) closeMenu();
  openLead(null, b);
}));
$$("[data-close-lead]", lead).forEach((b) => b.addEventListener("click", closeLead));

form.addEventListener("change", (e) => {
  if (e.target.type !== "radio") return;
  nextBtn.disabled = false;
  const at = step;
  setTimeout(() => { if (step === at && lead.classList.contains("is-open")) showStep(at + 1); }, 380);
});
backBtn.addEventListener("click", () => step > 0 && showStep(step - 1));
nextBtn.addEventListener("click", () => {
  if (step < qs.length - 1) { if (answered(step)) showStep(step + 1); return; }
  submitLead();
});
form.addEventListener("submit", (e) => { e.preventDefault(); if (step === qs.length - 1) submitLead(); });
$$(".q--form input", form).forEach((inp) => inp.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); submitLead(); } }));

// máscara do telefone
const tel = $('input[name="whatsapp"]', form);
tel.addEventListener("input", () => {
  const d = tel.value.replace(/\D/g, "").slice(0, 11);
  let out = d;
  if (d.length > 2) out = `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length > 7) out = `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
  tel.value = out;
});

function submitLead() {
  const fd = new FormData(form);
  const nome = (fd.get("nome") || "").trim();
  const fone = (fd.get("whatsapp") || "").replace(/\D/g, "");
  const err = $(".err", form);
  $$(".is-bad", form).forEach((x) => x.classList.remove("is-bad"));
  if (nome.length < 2) { $('input[name="nome"]', form).classList.add("is-bad"); err.textContent = "Conta pra gente o seu nome."; return; }
  if (fone.length < 10) { tel.classList.add("is-bad"); err.textContent = "Confira o seu WhatsApp com DDD."; return; }
  if (!fd.get("lgpd")) { err.textContent = "Precisamos do seu ok para entrar em contato."; return; }
  err.textContent = "";

  const payload = {
    nome, whatsapp: fone, local: (fd.get("local") || "").trim(),
    projeto: fd.get("projeto") || "", momento: fd.get("momento") || "",
    metragem: fd.get("metragem") || "", prazo: fd.get("prazo") || "",
    origem: "LP AlvesDesign", pagina: location.href, data: new Date().toISOString(),
  };
  const linhas = [
    `Olá, July! Vim pelo site do AlvesDesign e quero conversar sobre um projeto.`,
    ``,
    `• Projeto: ${payload.projeto || "-"}`,
    `• Momento do imóvel: ${payload.momento || "-"}`,
    `• Metragem: ${payload.metragem || "-"}`,
    `• Quando quero começar: ${payload.prazo || "-"}`,
    ``,
    `Nome: ${nome}`,
    payload.local ? `Local: ${payload.local}` : null,
  ].filter((l) => l !== null);
  const url = `https://wa.me/${ALVES_WHATSAPP}?text=${encodeURIComponent(linhas.join("\n"))}`;
  $(".js-wa", form).href = url;
  $(".js-name", form).textContent = nome.split(" ")[0];

  if (ALVES_LEAD_ENDPOINT) {
    fetch(ALVES_LEAD_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), keepalive: true }).catch(() => {});
  } else {
    console.info("[lead]", payload);
  }
  track("lead_submit", { service: payload.projeto, momento: payload.momento, metragem: payload.metragem, prazo: payload.prazo });

  qs.forEach((q) => q.classList.remove("is-on"));
  $(".q--done", form).classList.add("is-on");
  $(".lead__progress i").style.width = "100%";
  lead.classList.add("is-done");
  window.open(url, "_blank", "noopener");
}

/* ---------- Esc fecha o que estiver aberto ---------- */
addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (lead.classList.contains("is-open")) return closeLead();
  if (lb.classList.contains("is-open")) return lbClose();
  if (detailOpen) return closeDetail();
  if (document.documentElement.classList.contains("menu-open")) closeMenu();
});
if (lb) addEventListener("keydown", (e) => {
  if (!lb.classList.contains("is-open")) return;
  if (e.key === "ArrowRight") lbShow(lbIdx + 1, 1);
  if (e.key === "ArrowLeft") lbShow(lbIdx - 1, -1);
});
