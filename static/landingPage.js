const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("login-btn");
const dropdown = document.querySelector(".dropdown");

loginBtn.addEventListener("click", () => {
    window.location.href = "/accounts/login/";
});

registerBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("active");
});

// Close when clicking outside
document.addEventListener("click", () => {
    dropdown.classList.remove("active");
});

// Prevent closing when clicking inside menu
document.querySelector(".dropdown-menu").addEventListener("click", (e) => {
    e.stopPropagation();
});

// Background slider (3 images, 10s each)
const slides = document.querySelectorAll(".bg-slide");
if (slides.length > 0) {
    let currentSlide = 0;
    slides[currentSlide].classList.add("active");

    setInterval(() => {
        slides[currentSlide].classList.remove("active");
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add("active");
    }, 10000);
}
