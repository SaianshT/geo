class PresentationApp {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 7; // Updated from 6 to 7
        this.slides = document.querySelectorAll('.slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentSlideSpan = document.getElementById('currentSlide');
        this.totalSlidesSpan = document.getElementById('totalSlides');
        this.isTransitioning = false;
        
        this.init();
    }
    
    init() {
        // Set initial state
        this.updateSlideCounter();
        this.updateNavigationButtons();
        
        // Add event listeners
        this.addEventListeners();
        
        // Initialize first slide
        this.showSlide(1);
        
        console.log('PresentationApp initialized with', this.totalSlides, 'slides');
    }
    
    addEventListeners() {
        // Navigation buttons - using arrow function to preserve 'this' context
        this.prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Previous button clicked');
            this.previousSlide();
        });
        
        this.nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Next button clicked');
            this.nextSlide();
        });
        
        // Slide indicators - fix the event listener binding
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', (e) => {
                e.preventDefault();
                const slideNumber = index + 1;
                console.log('Indicator clicked for slide', slideNumber);
                this.goToSlide(slideNumber);
            });
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Touch/swipe support for mobile
        this.addTouchSupport();
    }
    
    addTouchSupport() {
        let startX = 0;
        let endX = 0;
        const slidesContainer = document.querySelector('.slides-container');
        
        slidesContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        slidesContainer.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
        });
    }
    
    handleSwipe(startX, endX) {
        const threshold = 50; // minimum distance for a swipe
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Swipe left - next slide
                this.nextSlide();
            } else {
                // Swipe right - previous slide
                this.previousSlide();
            }
        }
    }
    
    handleKeydown(e) {
        switch(e.key) {
            case 'ArrowRight':
            case ' ': // Space bar
                e.preventDefault();
                this.nextSlide();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.previousSlide();
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(1);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.totalSlides);
                break;
            case 'Escape':
                e.preventDefault();
                this.goToSlide(1);
                break;
        }
    }
    
    nextSlide() {
        console.log('nextSlide called, current:', this.currentSlide, 'total:', this.totalSlides);
        if (this.currentSlide < this.totalSlides && !this.isTransitioning) {
            this.goToSlide(this.currentSlide + 1, 'next');
        }
    }
    
    previousSlide() {
        console.log('previousSlide called, current:', this.currentSlide);
        if (this.currentSlide > 1 && !this.isTransitioning) {
            this.goToSlide(this.currentSlide - 1, 'prev');
        }
    }
    
    goToSlide(slideNumber, direction = null) {
        console.log('goToSlide called:', slideNumber, 'from:', this.currentSlide);
        
        if (slideNumber < 1 || slideNumber > this.totalSlides || slideNumber === this.currentSlide || this.isTransitioning) {
            console.log('goToSlide blocked - invalid conditions');
            return;
        }
        
        this.isTransitioning = true;
        const oldSlide = this.currentSlide;
        this.currentSlide = slideNumber;
        
        // Determine direction if not provided
        if (!direction) {
            direction = slideNumber > oldSlide ? 'next' : 'prev';
        }
        
        this.showSlide(slideNumber, direction);
        this.updateIndicators();
        this.updateSlideCounter();
        this.updateNavigationButtons();
        
        // Reset transition flag
        setTimeout(() => {
            this.isTransitioning = false;
        }, 300);
    }
    
    showSlide(slideNumber, direction = 'next') {
        console.log('showSlide called for slide:', slideNumber);
        
        // Remove active class from all slides
        this.slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev', 'entering-right', 'entering-left');
            
            // Ensure all slides except the target are hidden
            if (index + 1 !== slideNumber) {
                slide.style.display = 'none';
            }
        });
        
        // Find and show the target slide
        const targetSlide = document.querySelector(`[data-slide="${slideNumber}"]`);
        
        if (targetSlide) {
            console.log('Target slide found:', targetSlide);
            
            // Show the slide
            targetSlide.style.display = 'flex';
            
            // Force reflow before adding classes
            targetSlide.offsetHeight;
            
            // Add animation class based on direction
            if (direction === 'next') {
                targetSlide.classList.add('entering-right');
            } else {
                targetSlide.classList.add('entering-left');
            }
            
            // Make slide active
            targetSlide.classList.add('active');
            
            // Remove animation class after transition
            setTimeout(() => {
                targetSlide.classList.remove('entering-right', 'entering-left');
            }, 250);
        } else {
            console.error('Target slide not found:', slideNumber);
        }
    }
    
    updateIndicators() {
        console.log('Updating indicators, current slide:', this.currentSlide);
        this.indicators.forEach((indicator, index) => {
            if (index + 1 === this.currentSlide) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    updateSlideCounter() {
        this.currentSlideSpan.textContent = this.currentSlide;
        this.totalSlidesSpan.textContent = this.totalSlides;
        console.log('Slide counter updated:', this.currentSlide, '/', this.totalSlides);
    }
    
    updateNavigationButtons() {
        // Update previous button
        if (this.currentSlide === 1) {
            this.prevBtn.disabled = true;
            this.prevBtn.style.opacity = '0.3';
        } else {
            this.prevBtn.disabled = false;
            this.prevBtn.style.opacity = '1';
        }
        
        // Update next button
        if (this.currentSlide === this.totalSlides) {
            this.nextBtn.disabled = true;
            this.nextBtn.style.opacity = '0.3';
        } else {
            this.nextBtn.disabled = false;
            this.nextBtn.style.opacity = '1';
        }
    }
    
    // Public method to get current slide
    getCurrentSlide() {
        return this.currentSlide;
    }
    
    // Public method to get total slides
    getTotalSlides() {
        return this.totalSlides;
    }
}

// Auto-play functionality (optional)
class AutoPlay {
    constructor(presentation, interval = 30000) { // 30 seconds default
        this.presentation = presentation;
        this.interval = interval;
        this.timer = null;
        this.isPlaying = false;
    }
    
    start() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.timer = setInterval(() => {
            if (this.presentation.getCurrentSlide() < this.presentation.getTotalSlides()) {
                this.presentation.nextSlide();
            } else {
                this.stop(); // Stop at the end
            }
        }, this.interval);
    }
    
    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.isPlaying = false;
    }
    
    toggle() {
        if (this.isPlaying) {
            this.stop();
        } else {
            this.start();
        }
    }
}

// Fullscreen API helper
class FullscreenHelper {
    constructor() {
        this.isFullscreenSupported = this.checkFullscreenSupport();
    }
    
    checkFullscreenSupport() {
        return !!(
            document.fullscreenEnabled ||
            document.webkitFullscreenEnabled ||
            document.mozFullScreenEnabled ||
            document.msFullscreenEnabled
        );
    }
    
    enterFullscreen(element = document.documentElement) {
        if (!this.isFullscreenSupported) return false;
        
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
        
        return true;
    }
    
    exitFullscreen() {
        if (!this.isFullscreenSupported) return false;
        
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        
        return true;
    }
    
    toggle() {
        if (this.isFullscreen()) {
            this.exitFullscreen();
        } else {
            this.enterFullscreen();
        }
    }
    
    isFullscreen() {
        return !!(
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        );
    }
}

// Progress tracker
class ProgressTracker {
    constructor(presentation) {
        this.presentation = presentation;
        this.createProgressBar();
    }
    
    createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.innerHTML = '<div class="progress-fill"></div>';
        
        // Add CSS for progress bar
        const style = document.createElement('style');
        style.textContent = `
            .progress-bar {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 3px;
                background: var(--color-secondary);
                z-index: 1000;
            }
            .progress-fill {
                height: 100%;
                background: var(--color-primary);
                transition: width var(--duration-normal) var(--ease-standard);
                width: 0%;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(progressBar);
        
        this.progressFill = progressBar.querySelector('.progress-fill');
        this.updateProgress();
        
        // Listen for slide changes by checking periodically
        setInterval(() => {
            this.updateProgress();
        }, 100);
    }
    
    updateProgress() {
        const progress = (this.presentation.getCurrentSlide() - 1) / (this.presentation.getTotalSlides() - 1) * 100;
        this.progressFill.style.width = `${progress}%`;
    }
}

// Performance monitor
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            slideTransitions: [],
            imageLoadTimes: [],
            interactionTimes: []
        };
    }
    
    recordSlideTransition(startTime) {
        const endTime = performance.now();
        const duration = endTime - startTime;
        this.metrics.slideTransitions.push(duration);
        
        // Log slow transitions
        if (duration > 500) {
            console.warn(`Slow slide transition: ${duration.toFixed(2)}ms`);
        }
    }
    
    recordImageLoad(src, loadTime) {
        this.metrics.imageLoadTimes.push({ src, loadTime });
        
        if (loadTime > 2000) {
            console.warn(`Slow image load: ${src} took ${loadTime}ms`);
        }
    }
    
    getAverageTransitionTime() {
        if (this.metrics.slideTransitions.length === 0) return 0;
        const sum = this.metrics.slideTransitions.reduce((a, b) => a + b, 0);
        return sum / this.metrics.slideTransitions.length;
    }
    
    getReport() {
        return {
            averageTransitionTime: this.getAverageTransitionTime(),
            totalTransitions: this.metrics.slideTransitions.length,
            slowImages: this.metrics.imageLoadTimes.filter(img => img.loadTime > 2000),
            totalImages: this.metrics.imageLoadTimes.length
        };
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing presentation...');
    
    // Initialize main presentation
    const presentation = new PresentationApp();
    
    // Initialize optional features
    const fullscreenHelper = new FullscreenHelper();
    const progressTracker = new ProgressTracker(presentation);
    const performanceMonitor = new PerformanceMonitor();
    
    // Make instances available globally for debugging
    window.presentation = presentation;
    window.fullscreenHelper = fullscreenHelper;
    window.performanceMonitor = performanceMonitor;
    
    // Add keyboard shortcut for fullscreen (F11 alternative)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'f' || e.key === 'F') {
            fullscreenHelper.toggle();
        }
    });
    
    // Track image loading performance
    const images = document.querySelectorAll('.chart-image');
    images.forEach(img => {
        const startTime = performance.now();
        
        img.addEventListener('load', () => {
            const loadTime = performance.now() - startTime;
            performanceMonitor.recordImageLoad(img.src, loadTime);
        });
        
        img.addEventListener('error', () => {
            console.warn(`Failed to load image: ${img.src}`);
        });
    });
    
    // Add citation information
    const citation = document.createElement('div');
    citation.className = 'citation-info';
    citation.innerHTML = `
        <p><small>Data sources: Beijing Statistical Yearbook, National Bureau of Statistics of China, Beijing Municipal Government Reports</small></p>
    `;
    
    // Add citation styles
    const citationStyle = document.createElement('style');
    citationStyle.textContent = `
        .citation-info {
            position: fixed;
            bottom: 60px;
            left: 16px;
            background: rgba(var(--color-surface-rgb, 255, 255, 253), 0.9);
            padding: var(--space-8) var(--space-12);
            border-radius: var(--radius-base);
            border: 1px solid var(--color-border);
            font-size: var(--font-size-xs);
            color: var(--color-text-secondary);
            max-width: 300px;
            z-index: 100;
            backdrop-filter: blur(4px);
        }
        
        @media (max-width: 768px) {
            .citation-info {
                display: none;
            }
        }
    `;
    
    document.head.appendChild(citationStyle);
    document.body.appendChild(citation);
    
    // Log initialization
    console.log('Beijing Demographics Presentation initialized');
    console.log(`Total slides: ${presentation.getTotalSlides()}`);
    console.log('Use arrow keys, click indicators, or swipe to navigate');
    console.log('Press "f" for fullscreen mode');
});
