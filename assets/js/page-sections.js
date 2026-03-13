(function () {
  function slugify(text, fallbackIndex) {
    var value = (text || "").trim().toLowerCase();
    if (!value) {
      return "section-" + fallbackIndex;
    }

    if (value.normalize) {
      value = value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
    }

    value = value
      .replace(/[^\w\u4e00-\u9fff-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    return value || "section-" + fallbackIndex;
  }

  function ensureUniqueId(id, usedIds) {
    var uniqueId = id;
    var counter = 2;

    while (usedIds[uniqueId] || document.getElementById(uniqueId)) {
      uniqueId = id + "-" + counter;
      counter += 1;
    }

    usedIds[uniqueId] = true;
    return uniqueId;
  }

  function buildSectionNav(container) {
    var pageContent = container.closest(".page-content");
    if (!pageContent) {
      return;
    }

    var articleWrap = pageContent.querySelector(".article-wrap");
    if (!articleWrap) {
      return;
    }

    var headings = Array.prototype.slice.call(articleWrap.querySelectorAll("h2")).filter(function (heading) {
      return heading.textContent && heading.textContent.trim();
    });

    if (headings.length < 2) {
      container.hidden = true;
      return;
    }

    var usedIds = {};
    var list = document.createElement("ul");
    list.className = "page-section-nav__list";

    headings.forEach(function (heading, index) {
      if (!heading.id) {
        heading.id = ensureUniqueId(slugify(heading.textContent, index + 1), usedIds);
      } else {
        usedIds[heading.id] = true;
      }

      var item = document.createElement("li");
      item.className = "page-section-nav__item";

      var link = document.createElement("a");
      link.className = "page-section-nav__link";
      link.href = "#" + heading.id;
      link.textContent = heading.textContent.trim();

      item.appendChild(link);
      list.appendChild(item);
    });

    container.innerHTML = "";
    container.appendChild(list);
    container.hidden = false;

    if (!("IntersectionObserver" in window)) {
      return;
    }

    var links = Array.prototype.slice.call(container.querySelectorAll(".page-section-nav__link"));
    var lookup = {};

    links.forEach(function (link) {
      lookup[link.getAttribute("href").slice(1)] = link;
    });

    if (links.length) {
      links[0].classList.add("is-active");
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = lookup[entry.target.id];
          if (!link || !entry.isIntersecting) {
            return;
          }

          links.forEach(function (navLink) {
            navLink.classList.remove("is-active");
          });
          link.classList.add("is-active");
        });
      },
      {
        rootMargin: "-25% 0px -65% 0px",
        threshold: 0
      }
    );

    headings.forEach(function (heading) {
      observer.observe(heading);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var containers = document.querySelectorAll("[data-section-nav]");
    Array.prototype.forEach.call(containers, buildSectionNav);
  });
})();
