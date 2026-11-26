// NIVARAA LIVING — Master Atelier Script

// Controls: Top Hero Slider, Category Filters, Dual-Image Hover, Spec Drawer, Carousel

document.addEventListener('DOMContentLoaded', () => {
    initSiteIntro();
    initHeaderScroll();
    initMobileMenu();
    initHeroSlider();
    initHeroScrollParallax();
    initGallery();
    initSelectedCarousel();
    initScrollReveals();
    initAboutImage3DTilt();
    init360ReclinerViewers();
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

// Mobile Menu Drawer & Back Button Control
function initMobileMenu() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const drawer = document.getElementById('mobile-nav-drawer');
    const closeBtn = document.getElementById('mobile-nav-close');
    const header = document.getElementById('masthead');
    if (!toggle || !drawer) return;

    function openMobileMenu() {
        drawer.classList.add('open');
        drawer.setAttribute('aria-hidden', 'false');
        toggle.setAttribute('aria-expanded', 'true');
        if (header) header.classList.add('mobile-open');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        drawer.classList.remove('open');
        drawer.setAttribute('aria-hidden', 'true');
        toggle.setAttribute('aria-expanded', 'false');
        if (header) header.classList.remove('mobile-open');
        document.body.style.overflow = '';
    }

    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (drawer.classList.contains('open')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeMobileMenu();
        });
    }

    // Close when tapping any link inside mobile drawer
    drawer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // Close when tapping outside the inner drawer content
    drawer.addEventListener('click', (e) => {
        if (e.target === drawer) {
            closeMobileMenu();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('open')) {
            closeMobileMenu();
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

        // Clean up any lingering states from rapid transitions
        slides.forEach(s => {
            if (s !== outgoing && s !== incoming) {
                s.classList.remove('active', 'was-active');
            }
        });

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

// 2b. Hero Scroll Cue Fade (Hero section remains crisp, solid & unaffected)
function initHeroScrollParallax() {
    const scrollCue = document.getElementById('hero-scroll-cue');
    if (!scrollCue) return;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        // Fade out scroll cue smoothly on scroll without affecting hero elements
        scrollCue.style.opacity = scrollY > 30 ? '0' : '0.85';
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
                ${createCardMediaHTML(item)}
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
        init360ReclinerViewers();
    }, 180);
}

/**
 * Generates the media HTML for cards, injecting the 360 interactive turntable for recliners
 */
function createCardMediaHTML(item) {
    if (item.images_360 && item.images_360.length > 0) {
        const frames = item.images_360.map((src, i) => 
            `<img class="turntable-360-frame ${i === 0 ? 'active' : ''}" data-frame="${i}" src="${src}" alt="${item.name} Angle ${i * 90}°" loading="lazy">`
        ).join('');

        const badgeText = item.category === 'recliners' ? '360° SWIVEL' : '360° VIEW';

        return `
            <div class="change-img-hover recliner-360-box furniture-360-box" data-360-id="${item.id}" role="region" aria-label="${item.name} 360 degree turntable view">
                <div class="img-normal">
                    <img src="${item.img_normal}" alt="${item.name}" loading="lazy">
                </div>
                <div class="turntable-360-viewport" aria-label="360 degree turntable view">
                    ${frames}
                </div>
                <div class="recliner-360-badge furniture-360-badge" title="Hover or drag horizontally to inspect 360°">
                    <svg class="spin-360-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
                    </svg>
                    <span class="badge-360-text">${badgeText}</span>
                    <span class="badge-360-angle" style="display: none;">0°</span>
                </div>
                <div class="recliner-360-track furniture-360-track">
                    <div class="recliner-360-thumb furniture-360-thumb" style="width: 25%;"></div>
                </div>
            </div>
        `;
    }

    return `
        <div class="change-img-hover">
            <div class="img-normal">
                <img src="${item.img_normal}" alt="${item.name}" loading="lazy">
            </div>
            <div class="img-hover">
                <img src="${item.img_hover || item.img_normal}" alt="${item.name} Detail" loading="lazy">
            </div>
        </div>
    `;
}
window.createCardMediaHTML = createCardMediaHTML;

/**
 * Initializes interactive 360 hover and scrubbing across all furniture cards
 */
function init360ReclinerViewers() {
    const boxes = document.querySelectorAll('.recliner-360-box, .furniture-360-box');
    boxes.forEach(box => {
        if (box.dataset.has360Bound === 'true') return;
        box.dataset.has360Bound = 'true';

        const frames = box.querySelectorAll('.turntable-360-frame');
        const badgeAngle = box.querySelector('.badge-360-angle');
        const thumb = box.querySelector('.recliner-360-thumb');
        const numFrames = frames.length;
        if (numFrames === 0) return;

        let currentFrame = 0;
        let autoSpinInterval = null;

        function setFrame(index) {
            index = ((index % numFrames) + numFrames) % numFrames;
            if (index === currentFrame) return;
            frames[currentFrame]?.classList.remove('active');
            frames[index]?.classList.add('active');
            currentFrame = index;

            const angle = Math.round((currentFrame / numFrames) * 360);
            if (badgeAngle) {
                badgeAngle.innerText = `${angle}°`;
                badgeAngle.style.display = 'inline-block';
            }
            if (thumb) {
                const pct = ((currentFrame + 1) / numFrames) * 100;
                thumb.style.width = `${pct}%`;
            }
        }

        function startAutoSpin() {
            stopAutoSpin();
            autoSpinInterval = setInterval(() => {
                setFrame(currentFrame + 1);
            }, 380);
        }

        function stopAutoSpin() {
            if (autoSpinInterval) {
                clearInterval(autoSpinInterval);
                autoSpinInterval = null;
            }
        }

        // Mouse Enter: activate 360 viewport & start smooth swivel
        box.addEventListener('mouseenter', () => {
            box.classList.add('is-360-active');
            if (badgeAngle) badgeAngle.style.display = 'inline-block';
            startAutoSpin();
        });

        // Mouse Move: scrub 360 angle directly with cursor position
        box.addEventListener('mousemove', (e) => {
            stopAutoSpin();
            const rect = box.getBoundingClientRect();
            const relX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
            const progress = relX / rect.width;
            const targetFrame = Math.min(numFrames - 1, Math.floor(progress * numFrames));
            setFrame(targetFrame);
        });

        // Mouse Leave: reset gracefully
        box.addEventListener('mouseleave', () => {
            stopAutoSpin();
            box.classList.remove('is-360-active');
            if (badgeAngle) badgeAngle.style.display = 'none';
            setFrame(0);
        });

        // Touch support for mobile devices
        box.addEventListener('touchstart', () => {
            stopAutoSpin();
            box.classList.add('is-360-active');
            if (badgeAngle) badgeAngle.style.display = 'inline-block';
        }, { passive: true });

        box.addEventListener('touchmove', (e) => {
            if (!e.touches[0]) return;
            const rect = box.getBoundingClientRect();
            const touchX = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
            const progress = touchX / rect.width;
            const targetFrame = Math.min(numFrames - 1, Math.floor(progress * numFrames));
            setFrame(targetFrame);
        }, { passive: true });

        box.addEventListener('touchend', () => {
            setTimeout(() => {
                box.classList.remove('is-360-active');
                if (badgeAngle) badgeAngle.style.display = 'none';
            }, 1000);
        });
    });
}
window.init360ReclinerViewers = init360ReclinerViewers;
window.init360TurntableViewers = init360ReclinerViewers;

// 4. Product Specification Full-Screen Atelier Showcase
function openSpecModal(item) {
    window.currentActivePiece = item;
    const modal = document.getElementById('spec-modal');
    if (!modal) return;

    const modalImg = document.getElementById('modal-img');
    const topbarTitle = document.getElementById('modal-topbar-title');
    const normalBtn = document.getElementById('view-normal-btn');
    const detailBtn = document.getElementById('view-detail-btn');
    const btn360 = document.getElementById('view-360-btn');

    if (modalImg) modalImg.src = item.img_normal;
    if (topbarTitle) topbarTitle.innerText = item.name;
    document.getElementById('modal-tag').innerText = item.category_label;
    document.getElementById('modal-title').innerText = item.name;
    document.getElementById('modal-specs').innerText = item.specs;
    document.getElementById('modal-dimensions').innerText = item.dimensions;

    const displayWrap = modalImg ? modalImg.closest('.spec-img-display-wrap') : null;
    function resetModalScrub() {
        if (displayWrap) {
            displayWrap.style.cursor = 'default';
            displayWrap.onmousemove = null;
            displayWrap.ontouchmove = null;
        }
    }
    resetModalScrub();

    // Setup perspective toggle buttons
    if (normalBtn && detailBtn) {
        normalBtn.classList.add('active');
        detailBtn.classList.remove('active');
        if (btn360) btn360.classList.remove('active');

        normalBtn.onclick = (e) => {
            e.stopPropagation();
            resetModalScrub();
            normalBtn.classList.add('active');
            detailBtn.classList.remove('active');
            if (btn360) btn360.classList.remove('active');
            if (modalImg) {
                modalImg.style.opacity = '0.3';
                setTimeout(() => {
                    modalImg.src = item.img_normal;
                    modalImg.style.opacity = '1';
                }, 120);
            }
        };

        detailBtn.onclick = (e) => {
            e.stopPropagation();
            resetModalScrub();
            detailBtn.classList.add('active');
            normalBtn.classList.remove('active');
            if (btn360) btn360.classList.remove('active');
            if (modalImg) {
                modalImg.style.opacity = '0.3';
                setTimeout(() => {
                    modalImg.src = item.img_hover || item.img_normal;
                    modalImg.style.opacity = '1';
                }, 120);
            }
        };

        if (btn360) {
            if (item.images_360 && item.images_360.length > 0) {
                btn360.style.display = 'inline-flex';
                const labelSpan = btn360.querySelector('span:last-child');
                if (labelSpan) {
                    labelSpan.textContent = item.category === 'recliners' ? '360° Swivel' : '360° View';
                }
                btn360.onclick = (e) => {
                    e.stopPropagation();
                    normalBtn.classList.remove('active');
                    detailBtn.classList.remove('active');
                    btn360.classList.add('active');
                    if (modalImg) {
                        modalImg.src = item.images_360[0];
                    }
                    if (displayWrap) {
                        displayWrap.style.cursor = 'ew-resize';
                        displayWrap.title = 'Drag or move mouse horizontally to rotate 360°';
                        const handleScrub = (clientX) => {
                            const rect = displayWrap.getBoundingClientRect();
                            const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
                            const pct = x / rect.width;
                            const idx = Math.min(item.images_360.length - 1, Math.floor(pct * item.images_360.length));
                            if (modalImg) modalImg.src = item.images_360[idx];
                        };
                        displayWrap.onmousemove = (ev) => handleScrub(ev.clientX);
                        displayWrap.ontouchmove = (ev) => {
                            if (ev.touches[0]) handleScrub(ev.touches[0].clientX);
                        };
                    }
                };
            } else {
                btn360.style.display = 'none';
            }
        }
    }

    const whatsappText = encodeURIComponent(`Hello Nivaraa Living, I am interested in customizing the ${item.name} (${item.category_label}). Please share details and showroom consultation slots.`);
    document.getElementById('modal-whatsapp-link').href = `https://wa.me/919146189933?text=${whatsappText}`;

    // Lock page background scrolling during full-screen atelier view
    document.body.style.overflow = 'hidden';
    modal.classList.add('active');
}

function closeSpecModal() {
    const modal = document.getElementById('spec-modal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Modal listeners
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('spec-modal');
    const closeBtn = document.getElementById('modal-close');
    const backBtn = document.getElementById('modal-back-btn');

    if (closeBtn) closeBtn.addEventListener('click', closeSpecModal);
    if (backBtn) backBtn.addEventListener('click', closeSpecModal);

    // Escape key listener to close full screen
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeSpecModal();
        }
    });
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

// 7. About Atelier Interactive 3D Tilt & Video Playback
function initAboutImage3DTilt() {
    const frame = document.getElementById('about-img-frame');
    const animVideo = document.querySelector('.about-anim-video');

    if (animVideo) {
        animVideo.play().catch(() => {});
        if ('IntersectionObserver' in window) {
            const videoObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animVideo.play().catch(() => {});
                    } else {
                        animVideo.pause();
                    }
                });
            }, { threshold: 0.1 });
            videoObserver.observe(animVideo);
        }
    }

    if (!frame) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    frame.addEventListener('mousemove', (e) => {
        const rect = frame.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        frame.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    frame.addEventListener('mouseleave', () => {
        frame.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
}

// 0. Atelier Brand Opening Intro Transition (Ivory & Gold — 1.25s)
function initSiteIntro() {
    const intro = document.getElementById('site-intro');
    if (!intro) return;

    // Check if user already saw the intro in this session or prefers reduced motion
    const alreadySeen = (function() {
        try {
            return sessionStorage.getItem('nivaraa_intro_seen') === '1';
        } catch (e) {
            return false;
        }
    })();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (alreadySeen || prefersReducedMotion) {
        intro.classList.add('intro-removed');
        document.body.classList.remove('intro-active');
        return;
    }

    // Mark active for initial appearance
    document.body.classList.add('intro-active');

    let dismissed = false;

    function dismissIntro() {
        if (dismissed) return;
        dismissed = true;

        try {
            sessionStorage.setItem('nivaraa_intro_seen', '1');
        } catch (e) {}

        intro.classList.add('intro-hiding');
        document.body.classList.remove('intro-active');

        setTimeout(() => {
            intro.classList.add('intro-removed');
            intro.setAttribute('aria-hidden', 'true');
        }, 420);
    }

    // Smooth automatic transition at ~1.25s (1250ms)
    const autoTimer = setTimeout(dismissIntro, 1250);

    // Fast dismiss on click/touch
    intro.addEventListener('click', () => {
        clearTimeout(autoTimer);
        dismissIntro();
    });

    const skipBtn = document.getElementById('site-intro-skip');
    if (skipBtn) {
        skipBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            clearTimeout(autoTimer);
            dismissIntro();
        });
    }

    // Dismiss on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !dismissed) {
            clearTimeout(autoTimer);
            dismissIntro();
        }
    }, { once: true });
}

