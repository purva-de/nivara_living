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

// 2. Hero Interactive Showroom (4 Scenes with Realistic Interactive Lighting)
let currentScene = 1;
const totalScenes = 4;
const SCENE_DURATION = 6500; // 6.5s generous luxury showroom pacing
let sceneInterval = null;
let isHeroInteracting = false;

// Lighting state map for all 4 scenes
const sceneLightingState = {
    1: false,
    2: false,
    3: false,
    4: false
};

// Fixture descriptions for toggling
const fixtureNames = {
    1: 'Lamp',
    2: 'Spotlight',
    3: 'Floor Lamp',
    4: 'Pendant'
};

function initHeroSlider() {
    const heroSection = document.getElementById('hero-slider');
    const scenes = document.querySelectorAll('.hero-scene');
    const navItems = document.querySelectorAll('.hero-showroom-nav .showcase-nav-item');
    const prevBtn = document.getElementById('hero-prev-btn');
    const nextBtn = document.getElementById('hero-next-btn');

    if (!scenes.length || !heroSection) return;

    /**
     * Toggles or sets the lighting state for a specific scene
     */
    function setSceneLighting(sceneIdx, state) {
        const sceneEl = document.getElementById(`hero-scene-${sceneIdx}`);
        if (!sceneEl) return;

        const isLit = typeof state === 'boolean' ? state : !sceneLightingState[sceneIdx];
        sceneLightingState[sceneIdx] = isLit;

        if (isLit) {
            sceneEl.classList.add('is-lit');
        } else {
            sceneEl.classList.remove('is-lit');
        }

        // Update toggle capsule
        const toggleBtn = sceneEl.querySelector('.hero-lighting-toggle');
        if (toggleBtn) {
            toggleBtn.setAttribute('aria-pressed', isLit ? 'true' : 'false');
            const statusEl = toggleBtn.querySelector('.toggle-status');
            if (statusEl) {
                statusEl.textContent = isLit ? 'Illuminated • 2700K' : 'Tap to Light';
            }
        }

        // Update secondary action button
        const actionBtn = sceneEl.querySelector('.btn-hero-light-action .light-action-text');
        if (actionBtn) {
            actionBtn.textContent = isLit ? 'Lights Active' : `Switch ${fixtureNames[sceneIdx] || 'Lighting'}`;
        }
    }

    /**
     * Navigates to a specific showroom scene
     */
    function goToScene(targetIdx) {
        let n = targetIdx;
        if (n > totalScenes) n = 1;
        if (n < 1) n = totalScenes;
        if (n === currentScene && scenes[n - 1].classList.contains('active')) return;

        const outgoing = document.getElementById(`hero-scene-${currentScene}`);
        const incoming = document.getElementById(`hero-scene-${n}`);

        scenes.forEach(s => {
            if (s !== outgoing && s !== incoming) {
                s.classList.remove('active', 'was-active');
            }
        });

        if (outgoing) {
            outgoing.classList.remove('active');
            outgoing.classList.add('was-active');
            setTimeout(() => {
                outgoing.classList.remove('was-active');
            }, 1000);
        }

        if (incoming) {
            incoming.classList.add('active');
        }

        currentScene = n;
        const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Update 4-chapter navigation bar
        navItems.forEach(item => {
            const slideNum = parseInt(item.getAttribute('data-slide'), 10);
            const fill = item.querySelector('.showcase-nav-fill');
            if (slideNum === currentScene) {
                item.classList.add('active');
                if (fill) {
                    fill.style.transition = 'none';
                    fill.style.width = '0%';
                    void fill.offsetWidth; // Force reflow
                    if (!isReducedMotion) {
                        fill.style.transition = `width ${SCENE_DURATION}ms linear`;
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
    }

    function resetTimer() {
        if (sceneInterval) clearInterval(sceneInterval);
        if (!isHeroInteracting) {
            sceneInterval = setInterval(() => {
                goToScene(currentScene + 1);
            }, SCENE_DURATION);
        }
    }

    // Previous / Next button listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            goToScene(currentScene - 1);
            resetTimer();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            goToScene(currentScene + 1);
            resetTimer();
        });
    }

    // Chapter progress navigation click listeners
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const slideNum = parseInt(item.getAttribute('data-slide'), 10);
            goToScene(slideNum);
            resetTimer();
        });
    });

    // Wire up interactive lighting in all scenes
    scenes.forEach((sceneEl, idx) => {
        const sceneNum = idx + 1;
        const fixture = sceneEl.querySelector('.hero-luminaire');
        const toggleBtn = sceneEl.querySelector('.hero-lighting-toggle');
        const actionBtn = sceneEl.querySelector('.btn-hero-light-action');

        let isLockedByClick = false;

        // Click / Tap on toggle capsule
        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                isLockedByClick = !sceneLightingState[sceneNum];
                setSceneLighting(sceneNum, isLockedByClick);
            });

            // Desktop Hover interaction on toggle capsule
            toggleBtn.addEventListener('mouseenter', () => {
                if (!isLockedByClick) {
                    setSceneLighting(sceneNum, true);
                }
            });

            toggleBtn.addEventListener('mouseleave', () => {
                if (!isLockedByClick) {
                    setSceneLighting(sceneNum, false);
                }
            });
        }

        // Click / Tap on action button
        if (actionBtn) {
            actionBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                isLockedByClick = !sceneLightingState[sceneNum];
                setSceneLighting(sceneNum, isLockedByClick);
            });

            // Desktop Hover interaction on action button
            actionBtn.addEventListener('mouseenter', () => {
                if (!isLockedByClick) {
                    setSceneLighting(sceneNum, true);
                }
            });

            actionBtn.addEventListener('mouseleave', () => {
                if (!isLockedByClick) {
                    setSceneLighting(sceneNum, false);
                }
            });
        }

        // Direct interaction with the fixture (Click & Hover)
        if (fixture) {
            // Click / Tap directly on fixture
            fixture.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                isLockedByClick = !sceneLightingState[sceneNum];
                setSceneLighting(sceneNum, isLockedByClick);
            });

            // Keyboard accessibility (Enter or Space)
            fixture.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    isLockedByClick = !sceneLightingState[sceneNum];
                    setSceneLighting(sceneNum, isLockedByClick);
                }
            });

            // Desktop Hover interaction: preview illumination unless locked
            fixture.addEventListener('mouseenter', () => {
                if (!isLockedByClick) {
                    setSceneLighting(sceneNum, true);
                }
            });

            fixture.addEventListener('mouseleave', () => {
                if (!isLockedByClick) {
                    setSceneLighting(sceneNum, false);
                }
            });
        }
    });

    // Pause auto-advance on mouse enter so user can explore scene lighting
    heroSection.addEventListener('mouseenter', () => {
        isHeroInteracting = true;
        if (sceneInterval) {
            clearInterval(sceneInterval);
            sceneInterval = null;
        }
        const activeFill = heroSection.querySelector('.showcase-nav-item.active .showcase-nav-fill');
        if (activeFill) {
            const computedWidth = window.getComputedStyle(activeFill).width;
            activeFill.style.transition = 'none';
            activeFill.style.width = computedWidth;
        }
    });

    // Resume auto-advance on mouse leave
    heroSection.addEventListener('mouseleave', () => {
        isHeroInteracting = false;
        const activeFill = heroSection.querySelector('.showcase-nav-item.active .showcase-nav-fill');
        if (activeFill) {
            activeFill.style.transition = `width ${SCENE_DURATION}ms linear`;
            activeFill.style.width = '100%';
        }
        resetTimer();
    });

    // Touch Swipe support for smartphones and tablets
    let touchStartX = 0;
    let touchEndX = 0;

    heroSection.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroSection.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diffX = touchStartX - touchEndX;
        if (Math.abs(diffX) > 45) {
            if (diffX > 0) {
                // Swiped left -> next
                goToScene(currentScene + 1);
            } else {
                // Swiped right -> prev
                goToScene(currentScene - 1);
            }
            resetTimer();
        }
    }, { passive: true });

    // Keyboard Arrow Left/Right Navigation
    document.addEventListener('keydown', (e) => {
        if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) return;
        if (e.key === 'ArrowLeft') {
            goToScene(currentScene - 1);
            resetTimer();
        } else if (e.key === 'ArrowRight') {
            goToScene(currentScene + 1);
            resetTimer();
        }
    });

    // Start progress bar for first scene
    const firstFill = document.querySelector('.hero-showroom-nav .showcase-nav-item[data-slide="1"] .showcase-nav-fill');
    if (firstFill) {
        setTimeout(() => {
            const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (!isReducedMotion) {
                firstFill.style.transition = `width ${SCENE_DURATION}ms linear`;
                firstFill.style.width = '100%';
            } else {
                firstFill.style.width = '100%';
            }
        }, 50);
    }

    resetTimer();
}
window.initHeroSlider = initHeroSlider;

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

