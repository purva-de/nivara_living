// NIVARAA LIVING — Master Atelier Script

// Controls: Top Hero Slider, Category Filters, Dual-Image Hover, Spec Drawer, Carousel

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMobileMenu();
    initHeroSlider();
    initHeroScrollParallax();
    initGallery();
    initSelectedCarousel();
    initScrollReveals();
});

// 1. Header scroll effect
function initHeaderScroll() {
    const header = document.getElementById('masthead');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });
}

// Mobile Menu Drawer & Hamburger Morph
function initMobileMenu() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const header = document.getElementById('masthead');
    if (!toggle || !header) return;

    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        header.classList.toggle('mobile-open');
        document.body.style.overflow = header.classList.contains('mobile-open') ? 'hidden' : '';
    });

    header.querySelectorAll('.header-nav a').forEach(link => {
        link.addEventListener('click', () => {
            header.classList.remove('mobile-open');
            document.body.style.overflow = '';
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && header.classList.contains('mobile-open')) {
            header.classList.remove('mobile-open');
            document.body.style.overflow = '';
        }
    });
}

// 2. Hero Slider (Architectural Curtain Wipe with 2.8s Auto-Advance & Chapter Progress)
let currentSlide = 1;
const totalSlides = 5;
const SLIDE_DURATION = 2800; // 2.8 seconds automatic slide interval
let slideInterval = null;
let isHeroHovered = false;

function initHeroSlider() {
    const heroSection = document.getElementById('hero-slider');
    const slides = document.querySelectorAll('.hero-slide');
    const navItems = document.querySelectorAll('.showcase-nav-item');

    if (!slides.length || !heroSection) return;

    function goToSlide(targetIdx) {
        let n = targetIdx;
        if (n > totalSlides) n = 1;
        if (n < 1) n = totalSlides;
        if (n === currentSlide && slides[n - 1].classList.contains('active')) return;

        const outgoing = document.getElementById(`hero-slide-${currentSlide}`);
        const incoming = document.getElementById(`hero-slide-${n}`);

        if (outgoing) {
            outgoing.classList.remove('active');
            outgoing.classList.add('was-active');
            outgoing.style.transform = '';
            setTimeout(() => {
                outgoing.classList.remove('was-active');
            }, 950);
        }

        if (incoming) {
            incoming.style.transform = '';
            incoming.classList.add('active');
        }

        currentSlide = n;

        const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Update Nav items & trigger fresh CSS animation for progress fill
        navItems.forEach(item => {
            const slideNum = parseInt(item.getAttribute('data-slide'), 10);
            const fill = item.querySelector('.showcase-nav-fill');
            if (slideNum === currentSlide) {
                item.classList.add('active');
                if (fill) {
                    fill.style.transition = 'none';
                    fill.style.width = '0%';
                    // Force reflow
                    void fill.offsetWidth;
                    if (!isReducedMotion) {
                        fill.style.transition = `width ${SLIDE_DURATION}ms linear`;
                        fill.style.width = '100%';
                    } else {
                        fill.style.width = '100%';
                    }
                }
            } else {
                item.classList.remove('active');
                if (fill) {
                    fill.style.transition = 'none';
                    fill.style.width = '0%';
                }
            }
        });

        // Update top-row hero indicators: 01 ━━━━━━━━━ 05
        slides.forEach((slide, idx) => {
            const indFill = slide.querySelector('.hero-indicator-fill');
            if (!indFill) return;
            const slideNum = idx + 1;
            if (slideNum === currentSlide) {
                indFill.style.transition = 'none';
                indFill.style.width = '0%';
                void indFill.offsetWidth; // Force reflow
                if (!isReducedMotion) {
                    indFill.style.transition = `width ${SLIDE_DURATION}ms linear`;
                    indFill.style.width = '100%';
                } else {
                    indFill.style.width = '100%';
                }
            } else {
                indFill.style.transition = 'none';
                indFill.style.width = '0%';
            }
        });

        // Update counter elements if any exist
        const counterEl = document.getElementById('curr-slide-num');
        if (counterEl) counterEl.innerText = currentSlide < 10 ? `0${currentSlide}` : currentSlide;
    }

    function resetTimer() {
        if (slideInterval) clearInterval(slideInterval);
        if (!isHeroHovered) {
            slideInterval = setInterval(() => {
                goToSlide(currentSlide + 1);
            }, SLIDE_DURATION);
        }
    }

    // Nav chapter click handlers
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const slideNum = parseInt(item.getAttribute('data-slide'), 10);
            goToSlide(slideNum);
            resetTimer();
        });
    });

    // Hover pause behavior
    heroSection.addEventListener('mouseenter', () => {
        isHeroHovered = true;
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
        const activeFill = heroSection.querySelector('.showcase-nav-item.active .showcase-nav-fill');
        if (activeFill) {
            const computedWidth = window.getComputedStyle(activeFill).width;
            activeFill.style.transition = 'none';
            activeFill.style.width = computedWidth;
        }
        const activeIndFill = heroSection.querySelector('.hero-slide.active .hero-indicator-fill');
        if (activeIndFill) {
            const computedIndWidth = window.getComputedStyle(activeIndFill).width;
            activeIndFill.style.transition = 'none';
            activeIndFill.style.width = computedIndWidth;
        }
    });

    heroSection.addEventListener('mouseleave', () => {
        isHeroHovered = false;
        const activeFill = heroSection.querySelector('.showcase-nav-item.active .showcase-nav-fill');
        if (activeFill) {
            activeFill.style.transition = `width ${SLIDE_DURATION}ms linear`;
            activeFill.style.width = '100%';
        }
        const activeIndFill = heroSection.querySelector('.hero-slide.active .hero-indicator-fill');
        if (activeIndFill) {
            activeIndFill.style.transition = `width ${SLIDE_DURATION}ms linear`;
            activeIndFill.style.width = '100%';
        }
        resetTimer();
    });

    // Touch Swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    heroSection.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroSection.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diffX = touchStartX - touchEndX;
        if (Math.abs(diffX) > 40) {
            if (diffX > 0) {
                // Swiped left -> next
                goToSlide(currentSlide + 1);
            } else {
                // Swiped right -> prev
                goToSlide(currentSlide - 1);
            }
            resetTimer();
        }
    }, { passive: true });

    // Initial trigger for slide 1 progress fill and top-row indicator
    const firstFill = document.querySelector('.showcase-nav-item[data-slide="1"] .showcase-nav-fill');
    const firstIndFill = document.querySelector('#hero-slide-1 .hero-indicator-fill');
    if (firstFill || firstIndFill) {
        setTimeout(() => {
            const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (firstFill) {
                if (!isReducedMotion) {
                    firstFill.style.transition = `width ${SLIDE_DURATION}ms linear`;
                    firstFill.style.width = '100%';
                } else {
                    firstFill.style.width = '100%';
                }
            }
            if (firstIndFill) {
                if (!isReducedMotion) {
                    firstIndFill.style.transition = `width ${SLIDE_DURATION}ms linear`;
                    firstIndFill.style.width = '100%';
                } else {
                    firstIndFill.style.width = '100%';
                }
            }
        }, 50);
    }

    resetTimer();
}

// 2b. Hero Parallax Scroll Effect on Page Scroll
function initHeroScrollParallax() {
    const hero = document.getElementById('hero-slider');
    const scrollCue = document.getElementById('hero-scroll-cue');
    if (!hero) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const heroHeight = hero.offsetHeight;

                if (scrollY <= heroHeight + 60) {
                    const activeSlide = hero.querySelector('.hero-slide.active');
                    const innerContainer = hero.querySelector('.hero-inner-container');
                    const progressNav = hero.querySelector('.hero-showcase-nav');

                    if (activeSlide) {
                        activeSlide.style.backgroundPositionY = `calc(50% + ${scrollY * 0.32}px)`;
                    }

                    if (innerContainer) {
                        innerContainer.style.transform = `translate3d(0, ${scrollY * 0.18}px, 0)`;
                        innerContainer.style.opacity = Math.max(0, 1 - (scrollY / (heroHeight * 0.72))).toString();
                    }

                    if (progressNav) {
                        progressNav.style.transform = `translate3d(0, ${scrollY * 0.12}px, 0)`;
                    }

                    if (scrollCue) {
                        scrollCue.style.opacity = scrollY > 40 ? '0' : '0.85';
                    }
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// 3. Dynamic Curated Gallery with Category Filtering
let allFurniturePieces = [];

async function initGallery() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;

    try {
        const res = await fetch('curated_all_furniture.json');
        allFurniturePieces = await res.json();
    } catch (e) {
        console.error("Failed to load furniture data, using fallback", e);
    }

    renderGallery('all');

    // Filter buttons
    document.querySelectorAll('.category-filter-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.category-filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const category = this.getAttribute('data-filter');
            renderGallery(category);
        });
    });
}

function renderGallery(filterCategory) {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;

    grid.style.opacity = '0.35';
    grid.style.transform = 'translateY(10px)';
    grid.style.transition = 'opacity 0.22s ease, transform 0.22s ease';

    setTimeout(() => {
        grid.innerHTML = '';

        const filtered = filterCategory === 'all'
            ? allFurniturePieces
            : allFurniturePieces.filter(item => item.category === filterCategory);

        const countBadge = document.getElementById('filter-results-count');
        if (countBadge) {
            countBadge.innerText = `${filtered.length} Masterpiece${filtered.length === 1 ? '' : 's'}`;
        }

        filtered.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'furniture-card col-span-4';
            card.setAttribute('data-id', item.id);

            card.innerHTML = `
                <div class="change-img-hover">
                    <div class="img-normal">
                        <img src="${item.img_normal}" alt="${item.name}" loading="lazy">
                    </div>
                    <div class="img-hover">
                        <img src="${item.img_hover}" alt="${item.name} Detail" loading="lazy">
                    </div>
                </div>
                <div class="furniture-card-info">
                    <h3 class="furniture-card-title">${item.name}</h3>
                    <span class="furniture-card-category">${item.category_label}</span>
                </div>
            `;

            // Open modal on click
            card.addEventListener('click', () => openSpecModal(item));

            grid.appendChild(card);
        });

        grid.style.opacity = '1';
        grid.style.transform = 'translateY(0)';
        observeCards();
    }, 180);
}

// 4. Product Specification Modal
function openSpecModal(item) {
    window.currentActivePiece = item;
    const modal = document.getElementById('spec-modal');
    if (!modal) return;

    document.getElementById('modal-img').src = item.img_normal;
    document.getElementById('modal-tag').innerText = item.category_label;
    document.getElementById('modal-title').innerText = item.name;
    document.getElementById('modal-specs').innerText = item.specs;
    document.getElementById('modal-dimensions').innerText = item.dimensions;

    const whatsappText = encodeURIComponent(`Hello Nivaraa Living, I am interested in customizing the ${item.name} (${item.category_label}). Please share details and showroom consultation slots.`);
    document.getElementById('modal-whatsapp-link').href = `https://wa.me/919146189933?text=${whatsappText}`;

    modal.classList.add('active');
}

function closeSpecModal() {
    const modal = document.getElementById('spec-modal');
    if (modal) modal.classList.remove('active');
}

// Modal listeners
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('spec-modal');
    const closeBtn = document.getElementById('modal-close');
    if (closeBtn) closeBtn.addEventListener('click', closeSpecModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeSpecModal();
        });
    }
});

// 5. Selected Masterpieces Carousel (Continuous Right-to-Left Sliding with Pause on Hover)
function initSelectedCarousel() {
    const track = document.getElementById('carousel-track');
    const container = document.querySelector('.carousel-track-container');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');

    if (!track) return;

    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    // Clone original children to create a seamless infinite loop
    const originalChildren = Array.from(track.children);
    if (!originalChildren.length) return;

    originalChildren.forEach(child => {
        track.appendChild(child.cloneNode(true));
    });

    let halfWidth = track.scrollWidth / 2;
    let currentPos = 0;
    const speed = 0.85; // Continuous gliding speed in pixels per frame (Right-to-Left direction)
    let isPaused = false;
    let isTransitioning = false;

    function updateHalfWidth() {
        halfWidth = track.scrollWidth / 2;
        if (halfWidth > 0 && Math.abs(currentPos) >= halfWidth) {
            currentPos = 0;
        }
    }

    track.style.transform = `translate3d(${currentPos}px, 0, 0)`;

    function tick() {
        if (!isPaused && !isTransitioning && halfWidth > 0) {
            currentPos -= speed; // Moves from right to left (negative direction)
            if (currentPos <= -halfWidth) {
                currentPos = 0;
            }
            track.style.transform = `translate3d(${currentPos}px, 0, 0)`;
        }
        requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);

    // Pause on hover
    if (container) {
        container.addEventListener('mouseenter', () => { if (!isDragging) isPaused = true; });
        container.addEventListener('mouseleave', () => { if (!isDragging) isPaused = false; });
    }

    // Touch & Mouse Drag for Mobile, Tablet & Desktop
    let isDragging = false;
    let dragStartX = 0;
    let dragStartPos = 0;

    function handleDragStart(clientX) {
        isDragging = true;
        isPaused = true;
        dragStartX = clientX;
        dragStartPos = currentPos;
        track.style.transition = 'none';
    }

    function handleDragMove(clientX) {
        if (!isDragging) return;
        const deltaX = clientX - dragStartX;
        currentPos = dragStartPos + deltaX;

        // Wrap around boundaries
        if (currentPos <= -halfWidth) {
            currentPos += halfWidth;
            dragStartPos += halfWidth;
        } else if (currentPos > 0) {
            currentPos -= halfWidth;
            dragStartPos -= halfWidth;
        }

        track.style.transform = `translate3d(${currentPos}px, 0, 0)`;
    }

    function handleDragEnd() {
        if (!isDragging) return;
        isDragging = false;
        isPaused = false;
    }

    if (container) {
        // Touch events for phones & tablets
        container.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches.length === 1) {
                handleDragStart(e.touches[0].clientX);
            }
        }, { passive: true });

        container.addEventListener('touchmove', (e) => {
            if (e.touches && e.touches.length === 1) {
                handleDragMove(e.touches[0].clientX);
            }
        }, { passive: true });

        container.addEventListener('touchend', handleDragEnd, { passive: true });
        container.addEventListener('touchcancel', handleDragEnd, { passive: true });

        // Mouse drag for desktop & laptops
        container.addEventListener('mousedown', (e) => {
            if (e.button === 0) {
                handleDragStart(e.clientX);
            }
        });

        window.addEventListener('mousemove', (e) => {
            if (isDragging) {
                handleDragMove(e.clientX);
            }
        });

        window.addEventListener('mouseup', handleDragEnd);
    }

    // Interactive button controls
    function nudge(direction) {
        if (isTransitioning) return;
        isTransitioning = true;
        const card = track.querySelector('.carousel-slide-item');
        const step = card ? (card.offsetWidth + 28) : 408;

        currentPos += (direction * step);

        if (currentPos <= -halfWidth) {
            currentPos = 0 + (currentPos + halfWidth);
        } else if (currentPos > 0) {
            currentPos = -halfWidth + currentPos;
        }

        track.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
        track.style.transform = `translate3d(${currentPos}px, 0, 0)`;

        setTimeout(() => {
            track.style.transition = 'none';
            isTransitioning = false;
        }, 460);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            nudge(-1); // Nudge forward in flow direction (towards left)
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            nudge(1); // Nudge backward (towards right)
        });
    }

    window.addEventListener('resize', () => {
        updateHalfWidth();
    });
}

// 6. Scroll Triggered Reveals for Sections
function initScrollReveals() {
    const revealEls = document.querySelectorAll('.reveal-on-scroll');
    if (!revealEls.length) return;

    if (!('IntersectionObserver' in window)) {
        revealEls.forEach(el => el.classList.add('revealed'));
        return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.12
    });

    revealEls.forEach(el => revealObserver.observe(el));
}

// Staggered reveal for gallery product cards
function observeCards() {
    const cards = document.querySelectorAll('.furniture-card:not(.revealed)');
    if (!cards.length) return;

    if (!('IntersectionObserver' in window)) {
        cards.forEach(c => c.classList.add('revealed'));
        return;
    }

    const cardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, idx) => {
            if (entry.isIntersecting) {
                const staggerDelay = (idx % 3) * 90;
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, staggerDelay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px -30px 0px',
        threshold: 0.08
    });

    cards.forEach(card => cardObserver.observe(card));
}

window.observeCards = observeCards;
