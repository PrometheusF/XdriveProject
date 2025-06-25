// ==== 1. Mobil Menü Toggle ====
const initMobileMenu = () => {
    const menuBtn = document.getElementById("menu-btn");
    const navbar = document.getElementById("navbar");
    const closeBtn = document.getElementById('close-btn');

    if (menuBtn && navbar) {
        menuBtn.addEventListener("click", () => {
            navbar.classList.toggle("active");
        });
    }
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            navbar.classList.remove('active');
        });
    }
};

// ==== 2. Scroll-Reveal Animasyonları ====
const initScrollReveal = () => {
    const animatedElements = document.querySelectorAll("[data-anim]");
    const observerOptions = { root: null, rootMargin: "0px", threshold: 0.15 };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach((el) => {
        revealOnScroll.observe(el);
        const delay = el.getAttribute("data-delay");
        if (delay) el.style.transitionDelay = delay + "ms";
    });
};

// ==== 3. Contact + Rent Form Gönderimi ve Toast Bildirimi ====
const initContactForm = () => {
    const form = document.getElementById("contactForm");
    const successMessage = document.getElementById("success-message");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            message: formData.get("message"),
        };

        fetch("http://localhost:5000/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.success) {
                    successMessage.classList.add("show");
                    setTimeout(() => successMessage.classList.remove("show"), 3000);
                    form.reset();
                } else {
                    alert("Error: " + result.message);
                }
            })
            .catch((err) => {
                console.error("Request error:", err);
                alert("Error sending message.");
            });
    });
};

// ==== 4. Back to Top Butonu ====
const initBackToTop = () => {
    const backToTopBtn = document.getElementById("back-to-top");
    if (!backToTopBtn) return;

    window.addEventListener("scroll", () => {
        backToTopBtn.style.display = window.pageYOffset > 300 ? "block" : "none";
    });

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
};

// ==== 5. Light/Dark Mode Toggle + Tercih Kaydı ====
const initThemeToggle = () => {
    const toggleBtn = document.getElementById("theme-toggle");
    if (!toggleBtn) return;

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        toggleBtn.textContent = "☀️";
    } else {
        toggleBtn.textContent = "🌙";
    }

    toggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("theme", "dark");
            toggleBtn.textContent = "☀️";
        } else {
            localStorage.setItem("theme", "light");
            toggleBtn.textContent = "🌙";
        }
    });
};

// ==== 6. Booking Date Validation ====
const initBookingValidation = () => {
    const pickupInput = document.getElementById('pickupDate');
    const dropoffInput = document.getElementById('dropoffDate');
    const confirmBtn = document.getElementById('confirmBooking');
    const errorText = document.getElementById('dropoffError');
    if (!pickupInput || !dropoffInput || !confirmBtn) return;

    const validateDates = () => {
        const pickupVal = pickupInput.value;
        const dropoffVal = dropoffInput.value;
        let isValid = false;

        dropoffInput.min = pickupVal;
        if (pickupVal && dropoffVal) {
            const pick = new Date(pickupVal);
            const drop = new Date(dropoffVal);
            if (drop > pick) {
                isValid = true;
                dropoffInput.classList.remove('error');
                errorText.style.display = 'none';
            } else {
                dropoffInput.classList.add('error');
                errorText.style.display = 'block';
            }
        }
        confirmBtn.disabled = !isValid;
    };

    pickupInput.addEventListener('change', validateDates);
    dropoffInput.addEventListener('change', validateDates);
    confirmBtn.disabled = true;
};

// ==== Initialize All ====
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initScrollReveal();
    initContactForm();
    initBackToTop();
    initThemeToggle();
    initBookingValidation();
});
