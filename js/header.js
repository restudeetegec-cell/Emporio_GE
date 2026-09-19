const menuButton = document.querySelector(".site-header__hamburger");
const mobileNavigation = document.querySelector("#mobile-navigation");
const closeMenuButton = document.querySelector(".mobile-nav__close");
const desktopBreakpoint = window.matchMedia("(min-width: 48.0625rem)");

function openMobileNavigation() {
    mobileNavigation.hidden = false;
    menuButton.setAttribute("aria-expanded", "true");
    document.body.classList.add("mobile-nav-open");
    closeMenuButton.focus();
}

function closeMobileNavigation({ restoreFocus = true } = {}) {
    mobileNavigation.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("mobile-nav-open");

    if (restoreFocus) {
        menuButton.focus();
    }
}

menuButton.addEventListener("click", openMobileNavigation);
closeMenuButton.addEventListener("click", () => closeMobileNavigation());

mobileNavigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeMobileNavigation({ restoreFocus: false }));
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !mobileNavigation.hidden) {
        closeMobileNavigation();
    }
});

desktopBreakpoint.addEventListener("change", (event) => {
    if (event.matches && !mobileNavigation.hidden) {
        closeMobileNavigation({ restoreFocus: false });
    }
});
