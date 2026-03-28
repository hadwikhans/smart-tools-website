(function() {
  var endpoint = "/.netlify/functions/latest-news";
  var fallbackItems = [
    {
      title: "Oppo Find X9 Ultra Teased to Feature 10x Telephoto Camera With Advanced Stabilisation",
      link: "https://www.gadgets360.com/mobiles/news/oppo-find-x9-ultra-rear-camera-teleconverter-teasers-specifications-11275103",
      category: "Mobiles",
      date: "2026-03-27T00:00:00.000Z",
      summary: "A strong flagship-phone camera story with broad appeal for gadget-focused readers."
    },
    {
      title: "Wikipedia Says No to AI-Generated Text in Articles, but Makes Two Exceptions",
      link: "https://www.gadgets360.com/ai/news/wikipedia-bans-ai-generated-text-in-articles-makes-editing-exceptions-content-policy-11275126",
      category: "AI",
      date: "2026-03-27T00:00:00.000Z",
      summary: "A useful AI-governance update about how one of the web's biggest knowledge platforms is tightening rules."
    },
    {
      title: "Google Upgrades Gemini Live With Faster and Smarter Responses, Expands Search Live Globally",
      link: "https://www.gadgets360.com/ai/news/google-gemini-live-upgrade-search-live-expansion-rolling-out-details-11274279",
      category: "AI",
      date: "2026-03-27T00:00:00.000Z",
      summary: "A strong consumer-AI product story focused on practical rollout updates."
    },
    {
      title: "Samsung Browser for Windows Launched With Agentic AI Capabilities and Cross-Device Connectivity",
      link: "https://www.gadgets360.com/apps/news/samsung-browser-for-windows-launched-features-availability-agentic-ai-11274831",
      category: "Apps",
      date: "2026-03-27T00:00:00.000Z",
      summary: "An ecosystem update that fits well for users interested in browser workflows and device continuity."
    },
    {
      title: "Hubble Telescope Captures Comet Reversing Its Rotation for the First Time",
      link: "https://www.gadgets360.com/science/news/nasa-spots-comet-that-reversed-its-spin-for-the-first-time-11273791",
      category: "Science",
      date: "2026-03-27T00:00:00.000Z",
      summary: "A science headline that adds breadth beyond phones and apps."
    },
    {
      title: "Sony Raises PlayStation 5, PlayStation 5 Pro and PlayStation Portal Prices Globally",
      link: "https://www.gadgets360.com/games/news/sony-playstation-5-pro-portal-global-price-hike-us-uk-japan-europe-11275192",
      category: "Gaming",
      date: "2026-03-27T00:00:00.000Z",
      summary: "A hardware pricing update that broadens the page while staying inside gadget-tech coverage."
    }
  ];

  var categoryStyles = {
    mobiles: { thumb: "thumb-red", icon: "&#128241;" },
    ai: { thumb: "thumb-blue", icon: "&#129302;" },
    apps: { thumb: "thumb-orange", icon: "&#129513;" },
    science: { thumb: "thumb-blue", icon: "&#128301;" },
    gaming: { thumb: "thumb-red", icon: "&#127918;" },
    news: { thumb: "thumb-purple", icon: "&#128240;" }
  };

  var currentFilter = "all";

  function normalizeCategory(value) {
    var text = (value || "News").toLowerCase();
    if (text.indexOf("mobile") !== -1) return "mobiles";
    if (text.indexOf("ai") !== -1) return "ai";
    if (text.indexOf("app") !== -1) return "apps";
    if (text.indexOf("science") !== -1) return "science";
    if (text.indexOf("game") !== -1) return "gaming";
    return "news";
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatDate(value) {
    var date = new Date(value);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }

  function featuredMarkup(item) {
    var categoryKey = normalizeCategory(item.category);
    var style = categoryStyles[categoryKey] || categoryStyles.news;
    return (
      '<a class="news-featured" href="' + escapeHtml(item.link) + '" target="_blank" rel="noopener">' +
        '<div class="news-thumb ' + style.thumb + '">' + style.icon + "</div>" +
        "<div>" +
          '<div class="news-kicker">Featured Story</div>' +
          '<div class="news-meta">' + escapeHtml(formatDate(item.date)) + " | " + escapeHtml(item.category || "News") + "</div>" +
          "<h2>" + escapeHtml(item.title) + "</h2>" +
          "<p>" + escapeHtml(item.summary || "Open the full story for more details.") + "</p>" +
        "</div>" +
      "</a>"
    );
  }

  function cardMarkup(item) {
    var categoryKey = normalizeCategory(item.category);
    var style = categoryStyles[categoryKey] || categoryStyles.news;
    return (
      '<a class="news-card" data-category="' + categoryKey + '" href="' + escapeHtml(item.link) + '" target="_blank" rel="noopener">' +
        '<div class="news-thumb ' + style.thumb + '">' + style.icon + "</div>" +
        "<div>" +
          '<div class="news-meta">' + escapeHtml(formatDate(item.date)) + " | " + escapeHtml(item.category || "News") + "</div>" +
          "<h3>" + escapeHtml(item.title) + "</h3>" +
          "<p>" + escapeHtml(item.summary || "Open the full story for the latest details.") + "</p>" +
          '<span class="news-category">' + escapeHtml(item.category || "News") + "</span>" +
        "</div>" +
      "</a>"
    );
  }

  function briefMarkup(item) {
    return (
      '<a class="news-brief" href="' + escapeHtml(item.link) + '" target="_blank" rel="noopener">' +
        "<strong>" + escapeHtml(item.title) + "</strong>" +
        escapeHtml(item.summary || "Open the full story for more details.") +
      "</a>"
    );
  }

  function render(items, statusText) {
    var featured = document.getElementById("newsFeatured");
    var list = document.getElementById("newsList");
    var briefs = document.getElementById("newsBriefs");
    var status = document.getElementById("newsStatus");
    if (!featured || !list || !briefs || !status) return;

    if (!items.length) {
      featured.innerHTML = '<div class="news-empty">No headlines available right now.</div>';
      list.innerHTML = '<div class="news-empty">No headlines available right now.</div>';
      briefs.innerHTML = '<div class="news-empty">No quick briefs available right now.</div>';
      status.textContent = statusText || "No headlines available right now.";
      return;
    }

    featured.innerHTML = featuredMarkup(items[0]);
    list.innerHTML = items.slice(1).map(cardMarkup).join("");
    briefs.innerHTML = items.slice(1, 5).map(briefMarkup).join("");
    status.textContent = statusText;
    applyFilter(currentFilter);
  }

  function applyFilter(filter) {
    currentFilter = filter;
    document.querySelectorAll(".news-card").forEach(function(card) {
      var category = card.getAttribute("data-category");
      var show = filter === "all" || filter === category;
      card.classList.toggle("hidden", !show);
    });
  }

  document.querySelectorAll(".news-tab").forEach(function(button) {
    button.addEventListener("click", function() {
      var filter = button.getAttribute("data-filter");
      document.querySelectorAll(".news-tab").forEach(function(tab) {
        tab.classList.remove("active");
      });
      button.classList.add("active");
      applyFilter(filter);
    });
  });

  fetch(endpoint)
    .then(function(response) {
      if (!response.ok) throw new Error("Failed to load live news");
      return response.json();
    })
    .then(function(data) {
      var items = Array.isArray(data.items) ? data.items : [];
      var statusText = data.updatedAt
        ? "Live headlines refreshed on " + formatDate(data.updatedAt) + "."
        : "Live headlines loaded.";
      render(items, statusText);
    })
    .catch(function() {
      render(fallbackItems, "Live feed unavailable right now. Showing the latest saved headline set.");
    });
})();
