(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    document.querySelectorAll("[data-site-navigation]").forEach((navigation) => {
        let revealFrame;

        const updateHeaderVisibility = () => {
            navigation.classList.toggle("is-visible", window.scrollY > 8);
            revealFrame = null;
        };

        updateHeaderVisibility();

        window.addEventListener("scroll", () => {
            if (revealFrame === null) {
                revealFrame = window.requestAnimationFrame(updateHeaderVisibility);
            }
        }, { passive: true });

        const services = navigation.querySelector("[data-services-item]");
        const trigger = navigation.querySelector("[data-services-trigger]");
        const dropdown = navigation.querySelector("[data-services-dropdown]");

        if (!services || !trigger || !dropdown) {
            return;
        }

        let closeTimer;

        const setOpen = (open, returnFocus = false) => {
            window.clearTimeout(closeTimer);
            services.classList.toggle("is-open", open);
            trigger.setAttribute("aria-expanded", String(open));
            dropdown.hidden = !open;
            dropdown.inert = !open;

            if (!open && returnFocus) {
                trigger.focus();
            }
        };

        const scheduleClose = () => {
            window.clearTimeout(closeTimer);
            closeTimer = window.setTimeout(() => setOpen(false), 140);
        };

        trigger.addEventListener("click", () => {
            setOpen(trigger.getAttribute("aria-expanded") !== "true");
        });

        trigger.addEventListener("keydown", (event) => {
            if (event.key === "ArrowDown") {
                event.preventDefault();
                setOpen(true);
                dropdown.querySelector("a")?.focus();
            }

            if (event.key === "Escape") {
                event.preventDefault();
                setOpen(false, true);
            }
        });

        dropdown.addEventListener("keydown", (event) => {
            const links = Array.from(dropdown.querySelectorAll("a"));
            const currentIndex = links.indexOf(document.activeElement);

            if (event.key === "Escape") {
                event.preventDefault();
                setOpen(false, true);
                return;
            }

            if (event.key === "ArrowDown" && links.length) {
                event.preventDefault();
                links[(currentIndex + 1 + links.length) % links.length].focus();
            }

            if (event.key === "ArrowUp" && links.length) {
                event.preventDefault();
                links[(currentIndex - 1 + links.length) % links.length].focus();
            }
        });

        services.addEventListener("pointerenter", () => {
            if (finePointer.matches) {
                setOpen(true);
            }
        });

        services.addEventListener("pointerleave", () => {
            if (finePointer.matches) {
                scheduleClose();
            }
        });

        services.addEventListener("focusout", (event) => {
            if (!services.contains(event.relatedTarget)) {
                scheduleClose();
            }
        });

        document.addEventListener("click", (event) => {
            if (!navigation.contains(event.target)) {
                setOpen(false);
            }
        });
    });
})();
