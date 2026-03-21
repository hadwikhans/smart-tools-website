document.addEventListener("DOMContentLoaded", function () {
    loadComponent("navbar", "/components/navbar.html", initNavbar);
    loadComponent("footer", "/components/footer.html", null);
});

function loadComponent(elementId, filePath, callback) {
    var el = document.getElementById(elementId);
    if (!el) return;
    fetch(filePath)
        .then(function(r) {
            if (!r.ok) throw new Error("Not found: " + filePath);
            return r.text();
        })
        .then(function(html) {
            el.innerHTML = html;
            if (callback) callback();
        })
        .catch(function(e) { console.error("Component load error:", e); });
}

// ═══════════════════════════════
// NAVBAR INIT — runs after HTML injected
// ═══════════════════════════════
function initNavbar() {
    initDropdowns();
    initSearch();
}

// ─── DROPDOWNS ───────────────────
function initDropdowns() {
    var timers = {};

    document.querySelectorAll(".dropdown").forEach(function(drop) {
        var menu = drop.querySelector(".dropdown-content");
        if (!menu) return;

        // Give each menu a unique id if missing
        if (!menu.id) menu.id = "dd-" + Math.random().toString(36).slice(2);
        var id = menu.id;

        function openMenu() {
            clearTimeout(timers[id]);
            // Close all other open menus
            document.querySelectorAll(".dropdown-content.open").forEach(function(m) {
                if (m.id !== id) m.classList.remove("open");
            });
            menu.classList.add("open");
        }

        function startClose() {
            timers[id] = setTimeout(function() {
                menu.classList.remove("open");
            }, 300);
        }

        function cancelClose() {
            clearTimeout(timers[id]);
        }

        // Hover — open immediately
        drop.addEventListener("mouseenter", openMenu);
        drop.addEventListener("mouseleave", startClose);

        // Stay open when hovering the menu itself
        menu.addEventListener("mouseenter", cancelClose);
        menu.addEventListener("mouseleave", startClose);

        // Click toggle — for slow hover / mobile
        var trigger = drop.querySelector("a");
        if (trigger) {
            trigger.addEventListener("click", function(e) {
                e.preventDefault();
                if (menu.classList.contains("open")) {
                    menu.classList.remove("open");
                } else {
                    openMenu();
                }
            });
        }
    });

    // Click outside closes all
    document.addEventListener("click", function(e) {
        if (!e.target.closest(".dropdown")) {
            document.querySelectorAll(".dropdown-content.open").forEach(function(m) {
                m.classList.remove("open");
            });
        }
    });
}

// ─── SEARCH ──────────────────────
var allTools = [
    // Calculators
    { name: "Age Calculator",         url: "/calculators/age-calculator.html",        icon: "📅", cat: "Calculator" },
    { name: "BMI Calculator",         url: "/calculators/bmi-calculator.html",        icon: "⚖️", cat: "Calculator" },
    { name: "Percentage Calculator",  url: "/calculators/percentage-calculator.html", icon: "📊", cat: "Calculator" },
    { name: "Loan EMI Calculator",    url: "/calculators/loan-emi-calculator.html",   icon: "💰", cat: "Calculator" },
    // Text Tools
    { name: "Password Generator",     url: "/text-tools/password-generator.html",    icon: "🔐", cat: "Text Tool" },
    { name: "QR Code Generator",      url: "/text-tools/qr-generator.html",          icon: "📱", cat: "Text Tool" },
    { name: "Word Counter",           url: "/text-tools/word-counter.html",          icon: "📝", cat: "Text Tool" },
    { name: "Text Repeater",          url: "/text-tools/text-repeater.html",         icon: "🔁", cat: "Text Tool" },
    // Image Tools
    { name: "Image Compressor",       url: "/image-tools.html",        icon: "🗜️", cat: "Image Tool" },
    { name: "Image Resizer",          url: "/image-tools.html",          icon: "📐", cat: "Image Tool" },
    { name: "JPG to PNG",             url: "/image-tools.html",         icon: "🔄", cat: "Image Tool" },
    { name: "PNG to JPG",             url: "/image-tools.html",         icon: "🔄", cat: "Image Tool" },
    // PDF Tools
    { name: "Merge PDF",              url: "/pdf-tools/merge-pdf.html",              icon: "📎", cat: "PDF Tool" },
    { name: "Split PDF",              url: "/pdf-tools/split-pdf.html",              icon: "✂️", cat: "PDF Tool" },
    { name: "Remove Pages",           url: "/pdf-tools/remove-pages.html",           icon: "🗑️", cat: "PDF Tool" },
    { name: "Extract Pages",          url: "/pdf-tools/extract-pages.html",          icon: "📤", cat: "PDF Tool" },
    { name: "Compress PDF",           url: "/pdf-tools/compress-pdf.html",           icon: "🗜️", cat: "PDF Tool" },
    { name: "OCR PDF",                url: "/pdf-tools/ocr-pdf.html",                icon: "🔍", cat: "PDF Tool" },
    { name: "JPG to PDF",             url: "/pdf-tools/jpg-to-pdf.html",             icon: "🖼️", cat: "PDF Tool" },
    { name: "PDF to JPG",             url: "/pdf-tools/pdf-to-jpg.html",             icon: "🖼️", cat: "PDF Tool" },
    { name: "Rotate PDF",             url: "/pdf-tools/rotate-pdf.html",             icon: "🔄", cat: "PDF Tool" },
    { name: "Add Page Numbers",       url: "/pdf-tools/page-numbers.html",           icon: "🔢", cat: "PDF Tool" },
    { name: "Add Watermark",          url: "/pdf-tools/watermark-pdf.html",          icon: "💧", cat: "PDF Tool" },
    { name: "Crop PDF",               url: "/pdf-tools/crop-pdf.html",               icon: "✂️", cat: "PDF Tool" },
    { name: "Unlock PDF",             url: "/pdf-tools/unlock-pdf.html",             icon: "🔓", cat: "PDF Tool" },
    { name: "Protect PDF",            url: "/pdf-tools/protect-pdf.html",            icon: "🔒", cat: "PDF Tool" },
    { name: "Sign PDF",               url: "/pdf-tools/sign-pdf.html",               icon: "✍️", cat: "PDF Tool" },
    // SEO Tools
    { name: "Meta Tag Generator",     url: "/seo-tools/meta-tag-generator.html",     icon: "🏷️", cat: "SEO Tool" },
    { name: "Keyword Density",        url: "/seo-tools/keyword-density.html",        icon: "🔍", cat: "SEO Tool" },
];

function initSearch() {
    var input    = document.getElementById("toolSearch");
    var dropdown = document.getElementById("searchDropdown");
    if (!input || !dropdown) return;

    input.addEventListener("input", function() {
        var q = this.value.trim().toLowerCase();
        if (!q) { dropdown.style.display = "none"; return; }

        var matches = allTools.filter(function(t) {
            return t.name.toLowerCase().includes(q) || t.cat.toLowerCase().includes(q);
        });

        if (!matches.length) {
            dropdown.innerHTML = '<div style="padding:14px 16px;font-size:13px;color:#94a3b8;">No tools found</div>';
        } else {
            dropdown.innerHTML = matches.map(function(t) {
                return '<a href="' + t.url + '" style="' +
                    'display:flex;align-items:center;gap:10px;' +
                    'padding:10px 14px;font-size:13px;color:#1e2740;' +
                    'text-decoration:none;border-bottom:1px solid #f0f2f8;' +
                    'transition:background 0.12s;"' +
                    ' onmouseover="this.style.background=\'#f4f3ff\'"' +
                    ' onmouseout="this.style.background=\'\'">' +
                    '<span style="font-size:18px;flex-shrink:0;">' + t.icon + '</span>' +
                    '<span>' +
                      '<span style="display:block;font-weight:600;">' + t.name + '</span>' +
                      '<span style="font-size:11px;color:#94a3b8;">' + t.cat + '</span>' +
                    '</span>' +
                    '</a>';
            }).join("");
        }
        dropdown.style.display = "block";
    });

    // Close on outside click
    document.addEventListener("click", function(e) {
        if (!e.target.closest(".nav-right")) {
            dropdown.style.display = "none";
        }
    });

    // Close on Escape
    input.addEventListener("keydown", function(e) {
        if (e.key === "Escape") {
            dropdown.style.display = "none";
            this.value = "";
        }
    });
}

// Kept for backward compatibility
function searchTools() {}
