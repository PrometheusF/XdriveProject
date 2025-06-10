// ==== 1. Mobil Menü Toggle ====
const menuBtn = document.getElementById("menu-btn");
const navbar = document.querySelector(".navbar");

if (menuBtn) {
    menuBtn.addEventListener("click", () => {
        navbar.classList.toggle("active");
    });
}

// ==== 2. Scroll-Reveal Animasyonları ====
// Herhangi bir [data-anim] nitelikli öğeyi izleyip ekrana gelince .revealed sınıfı vererek
// CSS animasyonlarını tetikliyoruz
document.addEventListener("DOMContentLoaded", () => {
    const animatedElements = document.querySelectorAll("[data-anim]");
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15,
    };
    const revealOnScroll = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                revealOnScroll.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach((el) => {
        revealOnScroll.observe(el);
        const delay = el.getAttribute("data-delay");
        if (delay) {
            el.style.transitionDelay = delay + "ms";
        }
    });
});

// ==== 3. Contact + Rent Form Gönderimi ve Toast Bildirimi ====
// Sadece contact.html ve rent.html sayfalarında “contactForm” id’li bir form varsa bu kod çalışacak
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    const successMessage = document.getElementById("success-message");

    if (!form) return; // Eğer form yoksa hiçbir şey yapma

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Form verilerini topla
        const formData = new FormData(form);
        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            message: formData.get("message"),
        };

        // `/send-email` rotasına JSON POST isteği gönder
        fetch("http://localhost:5000/send-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.success) {
                    // Başarılı bildirim göstermek için #success-message id’li div’e .show ekle
                    successMessage.classList.add("show");
                    setTimeout(() => {
                        successMessage.classList.remove("show");
                    }, 3000);
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
});

// ==== 4. Back to Top Butonu ====
// Sayfa 300px’den fazla kaydırıldığında butonu göster/gizle & tıklanınca yukarı kaydır
document.addEventListener("DOMContentLoaded", () => {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
