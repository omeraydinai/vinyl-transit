// Scroll Expansion Hero - Vanilla JavaScript Implementation

class ScrollExpansionHero {
  constructor(options = {}) {
    this.scrollProgress = 0;
    this.showContent = false;
    this.mediaFullyExpanded = false;
    this.touchStartY = 0;
    this.isMobile = window.innerWidth < 768;
    
    this.options = {
      mediaType: options.mediaType || 'video', // 'video' or 'image'
      mediaSrc: options.mediaSrc,
      posterSrc: options.posterSrc,
      bgImageSrc: options.bgImageSrc,
      title: options.title || 'VINYL TRANSIT',
      date: options.date || '',
      scrollToExpand: options.scrollToExpand || 'Scroll to Expand',
      ...options
    };

    this.init();
  }

  init() {
    this.setupDOM();
    this.setupEventListeners();
    this.handleResize();
  }

  setupDOM() {
    const hero = document.getElementById('hero');
    if (!hero) return;

    // Update title
    const heroTitle = hero.querySelector('.hero-title');
    if (heroTitle) {
      heroTitle.innerHTML = `<span class="vinyl">VINYL</span><span class="transit">TRANSIT</span>`;
    }

    // Update subtitle
    const heroSubtitle = hero.querySelector('.hero-subtitle');
    if (heroSubtitle) {
      heroSubtitle.textContent = this.options.scrollToExpand;
    }

    // Setup media display based on mediaType
    const video = document.getElementById('expansion-video');
    const image = document.getElementById('expansion-image');

    if (this.options.mediaType === 'video' && video && image) {
      video.style.display = 'block';
      image.style.display = 'none';
    } else if (image && video) {
      image.style.display = 'block';
      video.style.display = 'none';
    }
  }

  setupEventListeners() {
    window.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });
    window.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
    window.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
    window.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
    window.addEventListener('scroll', () => this.handleScroll());
    window.addEventListener('resize', () => this.handleResize());
  }

  handleWheel(e) {
    if (this.mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
      this.mediaFullyExpanded = false;
      e.preventDefault();
    } else if (!this.mediaFullyExpanded) {
      e.preventDefault();
      const scrollDelta = e.deltaY * 0.0009;
      const newProgress = Math.min(Math.max(this.scrollProgress + scrollDelta, 0), 1);
      this.updateProgress(newProgress);
    }
  }

  handleTouchStart(e) {
    this.touchStartY = e.touches[0].clientY;
  }

  handleTouchMove(e) {
    if (!this.touchStartY || this.mediaFullyExpanded) return;

    const touchY = e.touches[0].clientY;
    const deltaY = this.touchStartY - touchY;

    if (this.mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
      this.mediaFullyExpanded = false;
      e.preventDefault();
      return;
    }

    if (!this.mediaFullyExpanded) {
      e.preventDefault();
      const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
      const scrollDelta = deltaY * scrollFactor;
      const newProgress = Math.min(Math.max(this.scrollProgress + scrollDelta, 0), 1);
      this.updateProgress(newProgress);
      this.touchStartY = touchY;
    }
  }

  handleTouchEnd() {
    this.touchStartY = 0;
  }

  handleScroll() {
    if (!this.mediaFullyExpanded) {
      window.scrollTo(0, 0);
    }
  }

  handleResize() {
    this.isMobile = window.innerWidth < 768;
  }

  updateProgress(newProgress) {
    this.scrollProgress = newProgress;

    if (newProgress >= 1) {
      this.mediaFullyExpanded = true;
      this.showContent = true;
    } else if (newProgress < 0.75) {
      this.showContent = false;
    }

    this.updateMediaSize();
    this.updateTextPosition();
    this.updateContentOpacity();
  }

  updateMediaSize() {
    const mediaContainer = document.getElementById('expansion-media-container');
    const heroBg = document.getElementById('hero-bg');
    if (!mediaContainer) return;

    const maxWidth = this.isMobile ? 650 : 1250;
    const maxHeight = this.isMobile ? 200 : 400;

    const width = 300 + this.scrollProgress * maxWidth;
    const height = 400 + this.scrollProgress * maxHeight;

    mediaContainer.style.width = Math.min(width, window.innerWidth * 0.95) + 'px';
    mediaContainer.style.height = Math.min(height, window.innerHeight * 0.85) + 'px';
    mediaContainer.style.opacity = 0.3 + this.scrollProgress * 0.7;
    mediaContainer.style.boxShadow = `0px 0px ${20 + this.scrollProgress * 30}px rgba(224, 16, 16, ${0.1 + this.scrollProgress * 0.2})`;

    if (heroBg) {
      heroBg.style.opacity = 1 - this.scrollProgress;
    }
  }

  updateTextPosition() {
    const maxTranslate = this.isMobile ? 180 : 150;
    const translateVw = this.scrollProgress * maxTranslate;

    const firstWords = document.querySelectorAll('[data-text-left]');
    const restWords = document.querySelectorAll('[data-text-right]');

    firstWords.forEach(el => {
      el.style.transform = `translateX(-${translateVw}vw)`;
      el.style.opacity = 1 - this.scrollProgress * 0.3;
    });

    restWords.forEach(el => {
      el.style.transform = `translateX(${translateVw}vw)`;
      el.style.opacity = 1 - this.scrollProgress * 0.3;
    });
  }

  updateContentOpacity() {
    const contentSection = document.getElementById('expansion-content-section');
    if (!contentSection) return;

    if (this.showContent) {
      contentSection.style.opacity = Math.min((this.scrollProgress - 0.75) / 0.25, 1);
      contentSection.style.pointerEvents = 'auto';
    } else {
      contentSection.style.opacity = 0;
      contentSection.style.pointerEvents = 'none';
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ScrollExpansionHero({
      mediaType: 'video',
      mediaSrc: 'images/hero banner/video.mp4',
      posterSrc: 'images/hero banner/foto.png',
      bgImageSrc: 'images/hero banner/foto.png',
      title: 'VINYL TRANSIT',
      date: 'DJ PORTFOLIO',
      scrollToExpand: 'Scroll to Expand'
    });
  });
} else {
  new ScrollExpansionHero({
    mediaType: 'video',
    mediaSrc: 'images/hero banner/video.mp4',
    posterSrc: 'images/hero banner/foto.png',
    bgImageSrc: 'images/hero banner/foto.png',
    title: 'VINYL TRANSIT',
    date: 'DJ PORTFOLIO',
    scrollToExpand: 'Scroll to Expand'
  });
}
