const menuButton = document.querySelector(".site-header__hamburger");
const mobileNavigation = document.querySelector("#mobile-navigation");
const mobileBackdrop   = document.querySelector(".mobile-nav__backdrop");
const closeMenuButton = document.querySelector(".mobile-nav__close");
const desktopBreakpoint = window.matchMedia("(min-width: 48.0625rem)");

function openMobileNavigation() {
    mobileNavigation.hidden = false;
    mobileBackdrop.hidden = false;
    menuButton.setAttribute("aria-expanded", "true");
    document.body.classList.add("mobile-nav-open");
    closeMenuButton.focus();
}

function closeMobileNavigation({ restoreFocus = true } = {}) {
    mobileNavigation.hidden = true;
    mobileBackdrop.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("mobile-nav-open");

    if (restoreFocus) {
        menuButton.focus();
    }
}
mobileBackdrop.addEventListener("click", () => closeMobileNavigation());

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

(function () {
    const abrirBtn = document.getElementById('abrirHorarios');
    const modal = document.getElementById('hoursmodal');
    const fechrEls = modal.querySelectorAll('[data-close]');
    if (!abrirBtn || !modal) return;

    function abrir() {
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
    }

    function fechar() {
        modal.hidden = true;
        document.body.style.overflow = '';
    }

    abrirBtn.addEventListener('click', abrir);
    fecharEls.forEach(el => el.addEventListener('click', fechar));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.hidden) fechar();
    });
})();
