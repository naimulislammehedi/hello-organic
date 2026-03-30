// ================= TIMER =================
function startTimer(duration) {
    let endTime = localStorage.getItem("endTime");

    // set first time
    if (!endTime) {
        endTime = new Date().getTime() + duration * 1000;
        localStorage.setItem("endTime", endTime);
    }

    function updateTimer() {
        let now = new Date().getTime();
        let remaining = Math.floor((endTime - now) / 1000);

        if (remaining <= 0) {
            clearInterval(timerInterval);
            document.getElementById('days').textContent = "00";
            document.getElementById('hours').textContent = "00";
            document.getElementById('minutes').textContent = "00";
            document.getElementById('seconds').textContent = "00";
            return;
        }

        let days = Math.floor(remaining / (60 * 60 * 24));
        let hours = Math.floor((remaining % (60 * 60 * 24)) / (60 * 60));
        let minutes = Math.floor((remaining % 3600) / 60);
        let seconds = Math.floor(remaining % 60);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    updateTimer();
    let timerInterval = setInterval(updateTimer, 1000);
}


// ================= REVIEW SLIDER =================
let currentSlide = 0;
let slides;
let autoSlide;

// show slide
function showSlide(index) {
    slides.style.transform = `translateX(-${index * 100}%)`;
}

// next
function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.children.length;
    showSlide(currentSlide);
}

// prev
function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.children.length) % slides.children.length;
    showSlide(currentSlide);
}

// auto slide (every 4 sec)
function startAutoSlide() {
    autoSlide = setInterval(nextSlide, 4000); // 3–5 sec sweet spot
}

function stopAutoSlide() {
    clearInterval(autoSlide);
}


// ================= TOUCH SWIPE (Mobile) =================
let startX = 0;

function handleTouchStart(e) {
    startX = e.touches[0].clientX;
}

function handleTouchEnd(e) {
    let endX = e.changedTouches[0].clientX;

    if (startX - endX > 50) {
        nextSlide(); // swipe left
    } else if (endX - startX > 50) {
        prevSlide(); // swipe right
    }
}


// ================= MODAL =================
function handleFormSubmit() {
    document.getElementById('successModal').style.display = 'flex';
    document.getElementById('orderForm').reset();
}

function closeModal() {
    document.getElementById('successModal').style.display = 'none';
}


// ================= INIT =================
window.onload = function () {

    // TIMER (2 days correct)
    let twoDays = 60 * 60 * 24 * 2;
    startTimer(twoDays);

    // SLIDER INIT
    slides = document.getElementById('slides');

    // AUTO SLIDE START
    startAutoSlide();

    // PAUSE ON HOVER (desktop)
    slides.addEventListener("mouseenter", stopAutoSlide);
    slides.addEventListener("mouseleave", startAutoSlide);

    // TOUCH SUPPORT (mobile)
    slides.addEventListener("touchstart", handleTouchStart);
    slides.addEventListener("touchend", handleTouchEnd);
};