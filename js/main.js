(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Dil ---------------------------------------------------------------- */

  var titles = {
    tr: "Mert Tereci, Bilgisayar Mühendisi",
    en: "Mert Tereci, Computer Engineer"
  };

  function setLang(lang, save) {
    root.setAttribute("data-lang", lang);
    root.setAttribute("lang", lang);
    document.title = titles[lang];

    // alt, aria-label gibi öznitelikler data-tr-* ve data-en-* üzerinden değişir
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(" ").forEach(function (attr) {
        var value = el.getAttribute("data-" + lang + "-" + attr);
        if (value !== null) el.setAttribute(attr, value);
      });
    });

    document.querySelectorAll(".lang-switch button").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-lang") === lang));
    });

    syncVideoButtons();

    if (save) {
      try { localStorage.setItem("lang", lang); } catch (e) { /* depolama kapalı olabilir */ }
    }
  }

  document.querySelectorAll(".lang-switch button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setLang(btn.getAttribute("data-lang"), true);
    });
  });

  /* E-posta, botlar toplamasın diye HTML'de açık yazılmıyor ------------- */

  var EMAIL_PARTS = ["merttereci4", "gmail.com"];
  var email = EMAIL_PARTS.join("@");
  document.querySelectorAll("[data-email]").forEach(function (el) {
    el.setAttribute("href", "mailto:" + email);
    var slot = el.querySelector("[data-email-text]");
    if (slot) slot.textContent = email;
  });

  /* Menü kenarlığı ------------------------------------------------------ */

  var header = document.querySelector(".site-header");
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Demo videoları ------------------------------------------------------
     JavaScript kapalıyken videolar kontrollerle görünür. Açıkken kontroller
     kaldırılır, video görünür olduğunda oynar, ekrandan çıkınca durur.
     "Hareketi azalt" açıksa kendiliğinden oynamaz.                        */

  var videos = Array.prototype.slice.call(document.querySelectorAll("video[data-demo]"));
  var userPaused = new WeakMap();

  function syncVideoButtons() {
    var lang = root.getAttribute("data-lang") || "tr";
    var labels = {
      tr: { play: "Oynat", pause: "Durdur" },
      en: { play: "Play", pause: "Pause" }
    };
    videos.forEach(function (v) {
      var btn = v.parentNode.querySelector(".media__toggle");
      if (btn) btn.textContent = v.paused ? labels[lang].play : labels[lang].pause;
    });
  }

  videos.forEach(function (v) {
    v.removeAttribute("controls");
    v.muted = true;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "media__toggle";
    btn.addEventListener("click", function () {
      if (v.paused) {
        userPaused.set(v, false);
        v.play().catch(function () {});
      } else {
        userPaused.set(v, true);
        v.pause();
      }
    });
    v.parentNode.appendChild(btn);
    v.addEventListener("play", syncVideoButtons);
    v.addEventListener("pause", syncVideoButtons);
    if (reduceMotion) userPaused.set(v, true);
  });

  if ("IntersectionObserver" in window && videos.length) {
    var videoObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var v = entry.target;
        if (entry.isIntersecting) {
          if (!userPaused.get(v)) v.play().catch(function () {});
        } else if (!v.paused) {
          v.pause();
        }
      });
    }, { threshold: 0.4 });
    videos.forEach(function (v) { videoObserver.observe(v); });
  }

  /* Proje dizini, görünen projeyi işaretler ----------------------------- */

  var indexLinks = Array.prototype.slice.call(document.querySelectorAll(".project-index a"));
  if ("IntersectionObserver" in window && indexLinks.length) {
    var current = null;
    var projectObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) current = entry.target.id;
      });
      indexLinks.forEach(function (a) {
        a.classList.toggle("is-active", a.getAttribute("href") === "#" + current);
      });
    }, { rootMargin: "-35% 0px -60% 0px" });
    document.querySelectorAll(".project").forEach(function (p) { projectObserver.observe(p); });
  }

  /* Tam boyut görsel ---------------------------------------------------- */

  var lightbox = document.querySelector(".lightbox");
  if (lightbox && typeof lightbox.showModal === "function") {
    var lbImg = lightbox.querySelector("img");
    document.querySelectorAll("[data-zoom]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var img = btn.querySelector("img");
        lbImg.src = btn.getAttribute("href");
        lbImg.alt = img.alt;
        lightbox.showModal();
      });
    });
    lightbox.querySelector(".lightbox__close").addEventListener("click", function () {
      lightbox.close();
    });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) lightbox.close();
    });
  }

  /* Başlangıç dili ------------------------------------------------------ */

  setLang(root.getAttribute("data-lang") || "tr", false);
})();
