document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("navLinks");
    const navItems = document.querySelectorAll(".nav-links a");
    const header = document.querySelector("header");

    // 1. Mobile Menu Open / Close Toggle Functionality
    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            hamburger.classList.toggle("active");
            
            // Icon Change: Hamburger (fa-bars) <-> Close (fa-xmark)
            const icon = hamburger.querySelector("i");
            if (icon) {
                if (navLinks.classList.contains("active")) {
                    icon.className = "fa-solid fa-xmark";
                } else {
                    icon.className = "fa-solid fa-bars";
                }
            }
        });
    }

    // 2. Navigation Link-e Click korle Smooth Scroll & Mobile Menu Close
    navItems.forEach(item => {
        item.addEventListener("click", (e) => {
            const targetId = item.getAttribute("href");

            if (targetId.startsWith("#") && targetId.length > 1) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const headerHeight = 70;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            }

            // Mobile view thakle menu auto close hobe link clicker por
            if (navLinks.classList.contains("active")) {
                closeMenu();
            }
        });
    });

    // 3. Navbar-er bahire/outside click korle Mobile Menu Close hobe
    document.addEventListener("click", (e) => {
        if (!header.contains(e.target) && navLinks.classList.contains("active")) {
            closeMenu();
        }
    });

    // 4. Scroll korle Navbar Shadow increase kora
    window.addEventListener("scroll", () => {
        if (window.scrollY > 20) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    // Helper Function: Menu Close Kora
    function closeMenu() {
        navLinks.classList.remove("active");
        hamburger.classList.remove("active");
        const icon = hamburger.querySelector("i");
        if (icon) {
            icon.className = "fa-solid fa-bars";
        }
    }
});