// NIVARAA LIVING — Master Atelier Script
// Controls: Top Hero Slider, Category Filters, Dual-Image Hover, Spec Drawer, Carousel

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMobileMenu();
    initHeroSlider();
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

// 2. Hero Slider (5 Slides with auto-advance and circular next button)
let currentSlide = 1;
const totalSlides = 5;
let slideInterval;

function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const counterEl = document.getElementById('curr-slide-num');
    const nextBtn = document.getElementById('slider-next-btn');

    if (!slides.length) return;

    function goToSlide(n) {
        slides.forEach(s => s.classList.remove('active'));
        currentSlide = n > totalSlides ? 1 : (n < 1 ? totalSlides : n);
        const target = document.getElementById(`hero-slide-${currentSlide}`);
        if (target) target.classList.add('active');
        if (counterEl) counterEl.innerText = currentSlide;
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            clearInterval(slideInterval);
            goToSlide(currentSlide + 1);
            startAutoAdvance();
        });
    }

    function startAutoAdvance() {
        slideInterval = setInterval(() => {
            goToSlide(currentSlide + 1);
        }, 5000);
    }

    startAutoAdvance();
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
        btn.addEventListener('click', function() {
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

// 5. Selected Products Horizontal Carousel (Shepel Component-3)
let carouselIndex = 0;

function initSelectedCarousel() {
    const track = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');

    if (!track || !prevBtn || !nextBtn) return;

    function updateCarousel() {
        const item = track.querySelector('.carousel-slide-item');
        if (!item) return;
        const itemWidth = item.offsetWidth + 28; // width + gap
        const maxIndex = Math.max(0, track.children.length - 3);
        carouselIndex = Math.min(Math.max(0, carouselIndex), maxIndex);
        track.style.transform = `translateX(-${carouselIndex * itemWidth}px)`;
    }

    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        carouselIndex++;
        updateCarousel();
    });

    prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        carouselIndex--;
        updateCarousel();
    });

    window.addEventListener('resize', updateCarousel);
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
