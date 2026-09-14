// Inline all icon <img> tags as <svg> so CSS (fill/stroke: currentColor) can theme them.
(function () {
  function inlineIcon(img) {
    var src = img.getAttribute("src");
    return fetch(src)
      .then(function (res) {
        if (!res.ok) throw new Error(src + ": " + res.status);
        return res.text();
      })
      .then(function (text) {
        var doc = new DOMParser().parseFromString(text, "image/svg+xml");
        var svg = doc.querySelector("svg");
        if (!svg) return;
        svg.classList.add("icon");
        img.classList.forEach(function (c) {
          if (c !== "icon") svg.classList.add(c);
        });
        var label = img.getAttribute("alt");
        if (label) {
          var title = doc.createElementNS("http://www.w3.org/2000/svg", "title");
          title.textContent = label;
          svg.insertBefore(title, svg.firstChild);
          svg.setAttribute("role", "img");
        } else {
          svg.setAttribute("aria-hidden", "true");
        }
        img.replaceWith(svg);
      })
      .catch(function (err) {
        // Fetch/parse failed (e.g. opened over file://, or a renamed icon) — img.icon
        // stays in the DOM as a plain <img>, uncolored by the dark theme.
        console.error("icon inline failed:", err);
      });
  }

  document.querySelectorAll("img.icon").forEach(inlineIcon);

  var links = document.querySelectorAll("nav.main-nav a");
  var here = location.pathname.replace(/\/$/, "") || "/";
  links.forEach(function (link) {
    var href = link.getAttribute("href").replace(/\/$/, "") || "/";
    if (href === here) link.classList.add("active");
  });
})();
