(function() {
    const track = document.getElementById('sliderTrack');
    const slides = Array.from(document.querySelectorAll('.slide'));
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const dotsContainer = document.getElementById('dotsContainer');
    
    let currentIndex = 0;
    const totalSlides = slides.length;

    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.dataset.index = i;
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
    const dots = document.querySelectorAll('.dot');

    function updateSlider() {
        const slideWidth = slides[0].offsetWidth;
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        
        dots.forEach((dot, idx) => {
            if (idx === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function goToSlide(index) {
        if (index < 0) index = 0;
        if (index >= totalSlides) index = totalSlides - 1;
        currentIndex = index;
        updateSlider();
    }

    function nextSlide() {
        if (currentIndex < totalSlides - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateSlider();
    }

    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = totalSlides - 1;
        }
        updateSlider();
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;

    track.addEventListener('mousedown', dragStart);
    track.addEventListener('touchstart', dragStart);
    track.addEventListener('mouseup', dragEnd);
    track.addEventListener('touchend', dragEnd);
    track.addEventListener('mousemove', dragMove);
    track.addEventListener('touchmove', dragMove);
    track.addEventListener('mouseleave', dragEnd);

    function dragStart(e) {
        isDragging = true;
        startPos = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        animationID = requestAnimationFrame(animation);
        track.style.cursor = 'grabbing';
        track.style.transition = 'none';
    }

    function dragMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        const currentPos = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        const diff = currentPos - startPos;
        const slideWidth = slides[0].offsetWidth;
        currentTranslate = prevTranslate + diff;
        
        const maxTranslate = 0;
        const minTranslate = - (totalSlides - 1) * slideWidth;
        if (currentTranslate > maxTranslate) currentTranslate = maxTranslate;
        if (currentTranslate < minTranslate) currentTranslate = minTranslate;
        
        track.style.transform = `translateX(${currentTranslate}px)`;
    }

    function dragEnd(e) {
        if (!isDragging) return;
        isDragging = false;
        cancelAnimationFrame(animationID);
        track.style.cursor = 'grab';
        
        const slideWidth = slides[0].offsetWidth;
        const movedBy = currentTranslate - prevTranslate;
        
        if (Math.abs(movedBy) > slideWidth * 0.2) {
            if (movedBy < 0 && currentIndex < totalSlides - 1) {
                currentIndex++;
            } else if (movedBy > 0 && currentIndex > 0) {
                currentIndex--;
            } else if (movedBy < 0 && currentIndex === totalSlides - 1) {
                currentIndex = 0;
            } else if (movedBy > 0 && currentIndex === 0) {
                currentIndex = totalSlides - 1;
            }
        }
        
        track.style.transition = 'transform 0.4s ease';
        updateSlider();
        prevTranslate = - (currentIndex * slideWidth);
    }

    function animation() {
        if (isDragging) requestAnimationFrame(animation);
    }

    window.addEventListener('resize', () => {
        track.style.transition = 'none';
        updateSlider();
        track.style.transition = 'transform 0.4s ease';
        const slideWidth = slides[0].offsetWidth;
        prevTranslate = - (currentIndex * slideWidth);
    });

    setTimeout(() => {
        updateSlider();
        const slideWidth = slides[0].offsetWidth;
        prevTranslate = - (currentIndex * slideWidth);
    }, 100);
})();