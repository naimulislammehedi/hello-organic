
// COUNTDOWN TIMER (3 days from now)
function startCountdown() {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3);
    targetDate.setHours(23, 59, 59, 999);
    function update() {
        const now = new Date();
        const diff = targetDate - now;
        if (diff <= 0) { document.getElementById('days').innerText = "00"; document.getElementById('hours').innerText = "00"; document.getElementById('minutes').innerText = "00"; document.getElementById('seconds').innerText = "00"; return; }
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (86400000)) / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        document.getElementById('days').innerText = days < 10 ? '0' + days : days;
        document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
        document.getElementById('minutes').innerText = mins < 10 ? '0' + mins : mins;
        document.getElementById('seconds').innerText = secs < 10 ? '0' + secs : secs;
    }
    update(); setInterval(update, 1000);
}
startCountdown();

// REVIEW SLIDER
const slides = document.getElementById('reviewSlides');
const slideItems = document.querySelectorAll('#reviewSlides > div');
const prevBtn = document.getElementById('prevSlideBtn');
const nextBtn = document.getElementById('nextSlideBtn');
const dotsContainer = document.getElementById('dotsContainer');
let currentIndex = 0;
let autoInterval;

function updateSlider() { slides.style.transform = `translateX(-${currentIndex * 100}%)`; updateDots(); }
function updateDots() { document.querySelectorAll('.dot-indicator').forEach((dot, i) => { i === currentIndex ? dot.classList.add('bg-yellow-500', 'w-8') : dot.classList.remove('bg-yellow-500', 'w-8'); dot.classList.add('bg-gray-600', 'w-3'); if (i === currentIndex) dot.classList.remove('bg-gray-600'); }); }
function createDots() { slideItems.forEach((_, idx) => { const dot = document.createElement('div'); dot.classList.add('h-2', 'w-3', 'rounded-full', 'bg-gray-600', 'cursor-pointer', 'transition-all', 'dot-indicator'); dot.addEventListener('click', () => { currentIndex = idx; updateSlider(); resetAuto(); }); dotsContainer.appendChild(dot); }); updateDots(); }
function nextSlide() { currentIndex = (currentIndex + 1) % slideItems.length; updateSlider(); resetAuto(); }
function prevSlide() { currentIndex = (currentIndex - 1 + slideItems.length) % slideItems.length; updateSlider(); resetAuto(); }
function resetAuto() { clearInterval(autoInterval); autoInterval = setInterval(() => { nextSlide(); }, 5000); }
prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);
createDots();
resetAuto();

// FORM HANDLER
const form = document.getElementById('orderForm');
const modal = document.getElementById('successModal');
window.closeModal = function () { modal.classList.add('hidden'); modal.classList.remove('flex'); };
form.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const qty = document.getElementById('quantity').value;
    if (!name || !phone || !address) { alert('দয়া করে নাম, ফোন এবং ঠিকানা পূরণ করুন'); return; }
    const orderData = { name, phone, address, quantity: qty, date: new Date().toISOString() };
    localStorage.setItem('metaBoosterOrder', JSON.stringify(orderData));
    console.log('Order saved:', orderData);
    const btn = document.getElementById('submitOrderBtn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> প্রক্রিয়াকরণ...';
    setTimeout(() => {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        form.reset();
        btn.innerHTML = 'অর্ডার কনফার্ম করুন';
    }, 600);
});

// Smooth anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === "#" || href === "") return;
        const target = document.querySelector(href);
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
});