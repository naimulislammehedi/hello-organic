function startTimer(duration) {
    let timer = duration, days, hours, minutes, seconds;
    setInterval(function () {
        days = parseInt(timer / (60 * 60 * 24), 10);
        hours = parseInt((timer % (60 * 60 * 24)) / (60 * 60), 10);
        minutes = parseInt((timer % 3600) / 60, 10);
        seconds = parseInt(timer % 60, 10);

        document.getElementById('days').textContent = days < 10 ? "0" + days : days;
        document.getElementById('hours').textContent = hours < 10 ? "0" + hours : hours;
        document.getElementById('minutes').textContent = minutes < 10 ? "0" + minutes : minutes;
        document.getElementById('seconds').textContent = seconds < 10 ? "0" + seconds : seconds;

        if (--timer < 0) timer = duration;
    }, 1000);
}

window.onload = function () {
    let twoDays = 60 * 47 * 16 * 2;
    startTimer(twoDays);
};

function handleFormSubmit() {
    document.getElementById('successModal').style.display = 'flex';
    document.getElementById('orderForm').reset();
}

function closeModal() {
    document.getElementById('successModal').style.display = 'none';
}
