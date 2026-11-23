
document.addEventListener("DOMContentLoaded", () => {

    const items = Array.from(
        document.querySelectorAll(".syscheck-gallery-item")
    );

    const lightbox = document.getElementById("syscheck-lightbox");
    const image = document.getElementById("syscheck-lightbox-image");
    const title = document.getElementById("syscheck-lightbox-title");
    const counter = document.getElementById("syscheck-lightbox-counter");

    const prev = document.getElementById("syscheck-lightbox-prev");
    const next = document.getElementById("syscheck-lightbox-next");
    const close = document.getElementById("syscheck-lightbox-close");

    if (!items.length || !lightbox || !image ||
        !title || !counter || !prev || !next || !close) {
        return;
    }

    let currentIndex = 0;
    let previousFocus = null;

    function showImage(index) {

        if (index < 0 || index >= items.length) {
            return;
        }

        currentIndex = index;

        const item = items[index];
        const thumbnail = item.querySelector("img");
        const heading = item.querySelector("h3");

        image.src = item.href;
        image.alt = thumbnail ? thumbnail.alt : "";

        title.textContent = heading ? heading.textContent : "";
        counter.textContent = `${index + 1} de ${items.length}`;

        prev.disabled = index === 0;
        next.disabled = index === items.length - 1;
    }

    function openLightbox(index) {
        previousFocus = document.activeElement;

        showImage(index);

        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");

        document.body.classList.add("syscheck-lightbox-open");
        close.focus();
    }

    function closeLightbox() {
        lightbox.classList.remove("is-open");
        lightbox.setAttribute("aria-hidden", "true");

        document.body.classList.remove("syscheck-lightbox-open");

        image.removeAttribute("src");

        if (previousFocus && previousFocus.focus) {
            previousFocus.focus();
        }
    }

    items.forEach((item, index) => {
        item.addEventListener("click", (event) => {
            event.preventDefault();
            openLightbox(index);
        });
    });

    prev.addEventListener("click", () => {
        showImage(currentIndex - 1);
    });

    next.addEventListener("click", () => {
        showImage(currentIndex + 1);
    });

    close.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener("keydown", (event) => {

        if (!lightbox.classList.contains("is-open")) {
            return;
        }

        if (event.key === "Escape") {
            closeLightbox();
        }

        if (event.key === "ArrowLeft") {
            showImage(currentIndex - 1);
        }

        if (event.key === "ArrowRight") {
            showImage(currentIndex + 1);
        }

        if (event.key === "Tab") {
            const controls = [close, prev, next]
                .filter(button => !button.disabled);

            const first = controls[0];
            const last = controls[controls.length - 1];

            if (event.shiftKey &&
                document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey &&
                document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });
});
