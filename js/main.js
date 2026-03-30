
// COUNTDOWN TIMER (1 day from now)
function startCountdown() {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 1);
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

// Dynamic Pricing Logic
const quantitySelect = document.getElementById('quantity');
const paymentSelect = document.getElementById('paymentMethod');
const totalPriceDisplay = document.getElementById('totalPriceDisplay');
const deliveryNote = document.getElementById('deliveryNote');
const deliveryCharge = 120;

function updatePrice() {
    const selectedOption = quantitySelect.options[quantitySelect.selectedIndex];
    const basePrice = parseInt(selectedOption.getAttribute('data-price'));
    const paymentMethod = paymentSelect.value;
    const isBkash = paymentMethod === 'bkash';
    const courier = isBkash ? 0 : deliveryCharge;
    const total = basePrice + courier;

    totalPriceDisplay.innerText = total.toLocaleString('bn-BD') + ' ৳';
    if (isBkash) {
        deliveryNote.innerText = 'ডেলিভারি চার্জ ফ্রি (বিকাশ পেমেন্টে)';
        deliveryNote.classList.add('text-green-400');
    } else {
        deliveryNote.innerText = `+ ${deliveryCharge} ৳ ডেলিভারি চার্জ`;
        deliveryNote.classList.remove('text-green-400');
    }
}

quantitySelect.addEventListener('change', updatePrice);
paymentSelect.addEventListener('change', updatePrice);
updatePrice(); // initial

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

// FORM HANDLER with WhatsApp integration
const form = document.getElementById('orderForm');
const modal = document.getElementById('successModal');
window.closeModal = function () { modal.classList.add('hidden'); modal.classList.remove('flex'); };

// Replace with your actual WhatsApp number (country code without '+')
const whatsappNumber = '8801xxxxxxxx'; // change this

form.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const quantityOption = quantitySelect.options[quantitySelect.selectedIndex];
    const quantityText = quantityOption.text;
    const basePrice = parseInt(quantityOption.getAttribute('data-price'));
    const paymentMethod = paymentSelect.value;
    const isBkash = paymentMethod === 'bkash';
    const courier = isBkash ? 0 : deliveryCharge;
    const totalPrice = basePrice + courier;

    if (!name || !phone || !address) {
        alert('দয়া করে নাম, ফোন এবং ঠিকানা পূরণ করুন');
        return;
    }

    // Prepare WhatsApp message
    const message = `📦 *নতুন অর্ডার* 📦%0A%0A👤 *নাম:* ${encodeURIComponent(name)}%0A📞 *মোবাইল:* ${encodeURIComponent(phone)}%0A🏠 *ঠিকানা:* ${encodeURIComponent(address)}%0A📦 *প্যাকেজ:* ${encodeURIComponent(quantityText)}%0A💰 *পণ্যের মূল্য:* ${basePrice} ৳%0A🚚 *ডেলিভারি চার্জ:* ${isBkash ? 'ফ্রি (বিকাশ)' : courier + ' ৳'}%0A💵 *মোট মূল্য:* ${totalPrice} ৳%0A💳 *পেমেন্ট পদ্ধতি:* ${paymentMethod === 'bkash' ? 'বিকাশ' : 'ক্যাশ অন ডেলিভারি'}%0A%0A⏰ *তারিখ:* ${new Date().toLocaleString('bn-BD')}`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

    // Store order in localStorage (optional)
    const orderData = { name, phone, address, quantity: quantityText, basePrice, courier, totalPrice, paymentMethod, date: new Date().toISOString() };
    localStorage.setItem('metaBoosterOrder', JSON.stringify(orderData));

    // Show loading on button
    const btn = document.getElementById('submitOrderBtn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> প্রক্রিয়াকরণ...';
    btn.disabled = true;

    // Open WhatsApp in a new window (or same if you prefer)
    window.open(whatsappUrl, '_blank');

    // Show modal after a short delay
    setTimeout(() => {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        form.reset();
        btn.innerHTML = 'অর্ডার কনফার্ম করুন';
        btn.disabled = false;
        // Reset to default selections
        quantitySelect.selectedIndex = 0;
        paymentSelect.selectedIndex = 0;
        updatePrice();
    }, 800);
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
