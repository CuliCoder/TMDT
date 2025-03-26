document.addEventListener('DOMContentLoaded', function() {
    // Slider buttons functionality
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    const sliderContent = document.querySelector('.slider-content');
    
    const sliderMessages = [
        'Thu cũ đổi mới toàn bộ sản phẩm',
        'Giảm thêm 500K khi thanh toán qua VNPay',
        'Mua online giảm thêm 5% tất cả sản phẩm'
    ];
    
    let currentSlide = 0;
    
    function updateSlide() {
        sliderContent.innerHTML = `<p>${sliderMessages[currentSlide]}</p>`;
    }
    
    prevBtn.addEventListener('click', function() {
        currentSlide = (currentSlide - 1 + sliderMessages.length) % sliderMessages.length;
        updateSlide();
    });
    
    nextBtn.addEventListener('click', function() {
        currentSlide = (currentSlide + 1) % sliderMessages.length;
        updateSlide();
    });
    
    // Auto rotate slides
    setInterval(function() {
        currentSlide = (currentSlide + 1) % sliderMessages.length;
        updateSlide();
    }, 5000);
    
    // Day selection buttons
    const dayButtons = document.querySelectorAll('.day-buttons button');
    
    dayButtons.forEach(button => {
        button.addEventListener('click', function() {
            dayButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
});
