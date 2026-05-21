function initSticky() {
    var navbar     = document.getElementById("navbar");
    var hero       = document.querySelector(".page-hero");
    var breadcrumb = document.querySelector(".sticky-breadcrumb");
    if (!navbar) return;
    function update() {
        var navH  = navbar.offsetHeight  || 0;
        var heroH = hero ? hero.offsetHeight : 0;
        if (hero)       hero.style.top       = navH + "px";
        if (breadcrumb) breadcrumb.style.top = (navH + heroH) + "px";
    }
    update();
    window.addEventListener("resize", update);
    setTimeout(update, 300);
    setTimeout(update, 700);
}
document.addEventListener("DOMContentLoaded", initSticky);
