/**
 * NIVARAA LIVING — DISCOVERY, SEARCH, WISHLIST & PRODUCT COMPARISON
 * Search Engine | Wishlist Drawer | Comparison Matrix | Advanced Filters
 */

(function () {
    'use strict';

    let wishlist = JSON.parse(localStorage.getItem('nivaraa_wishlist') || '[]');
    let compareList = [];
    let currentCatalog = [];

    document.addEventListener('DOMContentLoaded', async () => {
        await initCatalog();
        injectHeaderTools();
        injectSearchModalDOM();
        injectWishlistDrawerDOM();
        injectCompareModalDOM();
        injectAdvancedFilterBar();
        bindCardActions();
        bindKeyboardShortcuts();
        updateWishlistBadge();
    });

    async function initCatalog() {
        if (window.allFurniturePieces && window.allFurniturePieces.length) {
            currentCatalog = window.allFurniturePieces;
            return;
        }
        try {
            const res = await fetch('curated_all_furniture.json');
            currentCatalog = await res.json();
            window.allFurniturePieces = currentCatalog;
        } catch (e) {
            console.error('Failed to load furniture catalog in discovery:', e);
        }
    }

    /**
     * 1. Inject Search & Wishlist icons into Masthead Header
     */
    function injectHeaderTools() {
        const headerRightNav = document.querySelector('.header-right .header-menu');
        if (!headerRightNav || document.getElementById('btn-header-search')) return;

        const li = document.createElement('li');
        li.className = 'header-discovery-tools';
        li.innerHTML = `
            <button class="discovery-tool-btn" id="btn-header-search" aria-label="Search Catalog" title="Search Pieces (Press /)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
            </button>
            <button class="discovery-tool-btn" id="btn-header-wishlist" aria-label="View Wishlist" title="Your Curated Wishlist">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <span class="tool-badge-count" id="wishlist-badge" style="display: none;">0</span>
            </button>
        `;

        headerRightNav.prepend(li);

        document.getElementById('btn-header-search').addEventListener('click', openSearchModal);
        document.getElementById('btn-header-wishlist').addEventListener('click', openWishlistDrawer);
    }

    /**
     * 2. Search Modal Overlay
     */
    function injectSearchModalDOM() {
        if (document.getElementById('search-modal')) return;

        const overlay = document.createElement('div');
        overlay.id = 'search-modal';
        overlay.className = 'search-modal-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Search Atelier Catalog');

        overlay.innerHTML = `
            <div class="search-modal-container">
                <div class="search-input-header">
                    <svg class="search-input-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input type="text" id="search-input-field" class="search-master-input" placeholder="Search bespoke sofas, dining tables, teak, bouclé..." autocomplete="off">
                    <button class="search-close-btn" id="search-close-btn" aria-label="Close Search">&times;</button>
                </div>
                <div class="search-results-tray" id="search-results-tray">
                    <p style="text-align: center; color: var(--shepel-muted); font-size: 13px; margin: 24px 0;">Start typing to search all 30 handcrafted masterpieces...</p>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        document.getElementById('search-close-btn').addEventListener('click', closeSearchModal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeSearchModal();
        });

        const input = document.getElementById('search-input-field');
        input.addEventListener('input', () => {
            performLiveSearch(input.value.trim().toLowerCase());
        });
    }

    function openSearchModal() {
        const overlay = document.getElementById('search-modal');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            document.getElementById('search-input-field').focus();
        }, 100);
    }

    function closeSearchModal() {
        const overlay = document.getElementById('search-modal');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function performLiveSearch(term) {
        const tray = document.getElementById('search-results-tray');
        if (!term) {
            tray.innerHTML = `<p style="text-align: center; color: var(--shepel-muted); font-size: 13px; margin: 24px 0;">Start typing to search all 30 handcrafted masterpieces...</p>`;
            return;
        }

        const matches = currentCatalog.filter(p => {
            return p.name.toLowerCase().includes(term) ||
                p.category_label.toLowerCase().includes(term) ||
                p.specs.toLowerCase().includes(term) ||
                p.dimensions.toLowerCase().includes(term);
        });

        if (!matches.length) {
            tray.innerHTML = `<p style="text-align: center; color: var(--shepel-muted); font-size: 13px; margin: 24px 0;">No bespoke pieces matching "${escapeHtml(term)}". Try searching for "Bouclé", "Teak", "Sofa", or "Recliner".</p>`;
            return;
        }

        tray.innerHTML = '';
        matches.forEach(item => {
            const el = document.createElement('div');
            el.className = 'search-result-item';
            el.innerHTML = `
                <img src="${item.img_normal}" alt="${item.name}" class="search-result-thumb">
                <div class="search-result-meta">
                    <span class="search-result-category">${item.category_label}</span>
                    <h4 class="search-result-name">${item.name}</h4>
                    <span class="search-result-specs">${item.specs}</span>
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--shepel-gold); flex-shrink: 0;">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            `;

            el.addEventListener('click', () => {
                closeSearchModal();
                if (window.openSpecModal) {
                    window.openSpecModal(item);
                }
            });

            tray.appendChild(el);
        });
    }

    /**
     * 3. Wishlist Slide-Out Drawer
     */
    function injectWishlistDrawerDOM() {
        if (document.getElementById('wishlist-drawer')) return;

        const backdrop = document.createElement('div');
        backdrop.id = 'wishlist-backdrop';
        backdrop.className = 'wishlist-drawer-backdrop';

        const drawer = document.createElement('aside');
        drawer.id = 'wishlist-drawer';
        drawer.className = 'wishlist-drawer';
        drawer.setAttribute('role', 'dialog');
        drawer.setAttribute('aria-label', 'Your Saved Wishlist');

        drawer.innerHTML = `
            <div class="wishlist-header">
                <h3 class="wishlist-title">Curated Wishlist</h3>
                <button class="search-close-btn" id="wishlist-close-btn" aria-label="Close Wishlist">&times;</button>
            </div>
            <div class="wishlist-body" id="wishlist-body"></div>
            <div class="wishlist-footer">
                <a href="#" class="btn-wishlist-whatsapp" id="btn-wishlist-wa" target="_blank" rel="noopener noreferrer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.071.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824z"/>
                    </svg>
                    <span>Inquire Wishlist on WhatsApp</span>
                </a>
            </div>
        `;

        document.body.appendChild(backdrop);
        document.body.appendChild(drawer);

        document.getElementById('wishlist-close-btn').addEventListener('click', closeWishlistDrawer);
        backdrop.addEventListener('click', closeWishlistDrawer);
    }

    function openWishlistDrawer() {
        renderWishlistItems();
        document.getElementById('wishlist-drawer').classList.add('active');
        document.getElementById('wishlist-backdrop').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeWishlistDrawer() {
        document.getElementById('wishlist-drawer').classList.remove('active');
        document.getElementById('wishlist-backdrop').classList.remove('active');
        document.body.style.overflow = '';
    }

    function toggleWishlist(itemId) {
        const idx = wishlist.indexOf(itemId);
        if (idx >= 0) {
            wishlist.splice(idx, 1);
        } else {
            wishlist.push(itemId);
        }
        localStorage.setItem('nivaraa_wishlist', JSON.stringify(wishlist));
        updateWishlistBadge();
        updateCardWishlistButtons();
    }

    function updateWishlistBadge() {
        const badge = document.getElementById('wishlist-badge');
        if (!badge) return;
        badge.innerText = wishlist.length;
        badge.style.display = wishlist.length > 0 ? 'flex' : 'none';
    }

    function renderWishlistItems() {
        const body = document.getElementById('wishlist-body');
        if (!body) return;

        if (!wishlist.length) {
            body.innerHTML = `
                <div class="wishlist-empty-state">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <p style="font-family: var(--font-serif, 'Cormorant Garamond', serif); font-size: 18px; margin: 0; color: var(--shepel-dark);">Your wishlist is empty</p>
                    <span style="font-size: 12px;">Click the heart icon on any piece in the gallery to curate your personalized selection.</span>
                </div>
            `;
            document.getElementById('btn-wishlist-wa').style.display = 'none';
            return;
        }

        document.getElementById('btn-wishlist-wa').style.display = 'flex';
        body.innerHTML = '';

        const wishItems = currentCatalog.filter(p => wishlist.includes(p.id));

        wishItems.forEach(item => {
            const el = document.createElement('div');
            el.className = 'wishlist-item-card';
            el.innerHTML = `
                <img src="${item.img_normal}" alt="${item.name}" class="wishlist-item-img">
                <div class="wishlist-item-info">
                    <span class="wishlist-item-cat">${item.category_label}</span>
                    <h4 class="wishlist-item-name">${item.name}</h4>
                </div>
                <button class="btn-remove-wishlist" data-id="${item.id}" title="Remove">&times;</button>
            `;

            el.querySelector('.wishlist-item-info').addEventListener('click', () => {
                closeWishlistDrawer();
                if (window.openSpecModal) window.openSpecModal(item);
            });

            el.querySelector('.btn-remove-wishlist').addEventListener('click', (e) => {
                e.stopPropagation();
                toggleWishlist(item.id);
                renderWishlistItems();
            });

            body.appendChild(el);
        });

        // WhatsApp wishlist message
        const names = wishItems.map(x => `• ${x.name} (${x.category_label})`).join('\n');
        const waMsg = [
            `*NIVARAA LIVING — CURATED WISHLIST INQUIRY*`,
            `----------------------------------------`,
            `Hello Shrinivas, I have curated these bespoke pieces on the Nivaraa website and would like a consultation on specifications and swatches:`,
            names,
            `----------------------------------------`,
            `Please let me know showroom availability at Creaticity Mall.`
        ].join('\n');

        document.getElementById('btn-wishlist-wa').href = `https://wa.me/919146189933?text=${encodeURIComponent(waMsg)}`;
    }

    /**
     * 4. Product Comparison Matrix
     */
    function injectCompareModalDOM() {
        if (document.getElementById('compare-modal')) return;

        // Floating Compare Pill
        const pill = document.createElement('div');
        pill.id = 'floating-compare-pill';
        pill.className = 'floating-compare-pill';
        pill.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="16 3 21 3 21 8"></polyline>
                <line x1="4" y1="20" x2="21" y2="3"></line>
                <polyline points="21 16 21 21 16 21"></polyline>
                <line x1="15" y1="15" x2="21" y2="21"></line>
                <line x1="4" y1="4" x2="9" y2="9"></line>
            </svg>
            <span id="compare-pill-text">Compare (0)</span>
        `;
        document.body.appendChild(pill);
        pill.addEventListener('click', openCompareModal);

        // Comparison Modal
        const overlay = document.createElement('div');
        overlay.id = 'compare-modal';
        overlay.className = 'compare-modal-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Compare Nivaraa Masterpieces');

        overlay.innerHTML = `
            <div class="compare-modal-box">
                <header class="compare-header">
                    <div>
                        <span class="customizer-tag">Bespoke Atelier Matrix</span>
                        <h3 class="customizer-heading">Product Comparison</h3>
                    </div>
                    <button class="search-close-btn" id="compare-close-btn" aria-label="Close Comparison">&times;</button>
                </header>
                <div class="compare-body" id="compare-body"></div>
            </div>
        `;

        document.body.appendChild(overlay);

        document.getElementById('compare-close-btn').addEventListener('click', closeCompareModal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeCompareModal();
        });
    }

    function toggleCompare(itemId) {
        const idx = compareList.indexOf(itemId);
        if (idx >= 0) {
            compareList.splice(idx, 1);
        } else {
            if (compareList.length >= 3) {
                alert('You can compare up to 3 masterpieces at a time.');
                return;
            }
            compareList.push(itemId);
        }

        updateComparePill();
        updateCardCompareButtons();
    }

    function updateComparePill() {
        const pill = document.getElementById('floating-compare-pill');
        const text = document.getElementById('compare-pill-text');
        if (!pill || !text) return;

        text.innerText = `Compare (${compareList.length})`;
        pill.classList.toggle('active', compareList.length >= 2);
    }

    function openCompareModal() {
        renderCompareTable();
        document.getElementById('compare-modal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCompareModal() {
        document.getElementById('compare-modal').classList.remove('active');
        document.body.style.overflow = '';
    }

    function renderCompareTable() {
        const body = document.getElementById('compare-body');
        if (!body) return;

        const items = currentCatalog.filter(p => compareList.includes(p.id));

        if (!items.length) {
            body.innerHTML = `<p style="text-align: center; padding: 40px; color: var(--shepel-muted);">Select at least 2 pieces from the gallery to compare side-by-side.</p>`;
            return;
        }

        let thCols = items.map(p => `
            <th>
                <img src="${p.img_normal}" alt="${p.name}" class="compare-prod-thumb">
                <div style="font-family: var(--font-serif); font-size: 17px; margin-bottom: 2px;">${p.name}</div>
                <div style="font-size: 10px; color: var(--shepel-gold);">${p.category_label}</div>
            </th>
        `).join('');

        let framingRows = items.map(p => `<td>${p.specs}</td>`).join('');
        let dimRows = items.map(p => `<td>${p.dimensions}</td>`).join('');
        let actionRows = items.map(p => `
            <td>
                <button class="btn-shepel-primary" style="padding: 8px 16px; font-size: 11px; width: 100%; margin-bottom: 6px;" onclick="window.openFurnitureStudio && window.openFurnitureStudio(window.allFurniturePieces.find(x => x.id === '${p.id}'))">Customize Studio</button>
                <button class="btn-shepel-outline" style="padding: 8px 16px; font-size: 11px; width: 100%;" onclick="window.openSpecModal && window.openSpecModal(window.allFurniturePieces.find(x => x.id === '${p.id}'))">View Details</button>
            </td>
        `).join('');

        body.innerHTML = `
            <table class="compare-table">
                <thead>
                    <tr>
                        <th style="width: 160px;">Attribute</th>
                        ${thCols}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>Craftsmanship & Materials</th>
                        ${framingRows}
                    </tr>
                    <tr>
                        <th>Bespoke Dimensions</th>
                        ${dimRows}
                    </tr>
                    <tr>
                        <th>Upholstery Support</th>
                        ${items.map(() => `<td>500+ Bouclé, Royal Velvet & Italian Aniline Leathers</td>`).join('')}
                    </tr>
                    <tr>
                        <th>Atelier Actions</th>
                        ${actionRows}
                    </tr>
                </tbody>
            </table>
        `;
    }

    /**
     * 5. Bind Card Actions (Wishlist heart & Compare button on every gallery card)
     */
    function bindCardActions() {
        // Observe gallery changes or hook into card creation
        const observer = new MutationObserver(() => {
            attachCardOverlayButtons();
        });

        const grid = document.getElementById('gallery-grid');
        if (grid) {
            observer.observe(grid, { childList: true });
            attachCardOverlayButtons();
        }
    }

    function attachCardOverlayButtons() {
        document.querySelectorAll('.furniture-card').forEach(card => {
            if (card.querySelector('.card-action-overlay')) return;

            const id = card.getAttribute('data-id');
            const overlay = document.createElement('div');
            overlay.className = 'card-action-overlay';

            const isWish = wishlist.includes(id);
            const isComp = compareList.includes(id);

            overlay.innerHTML = `
                <button class="card-action-icon-btn ${isWish ? 'active' : ''}" data-wish-id="${id}" title="Save to Wishlist" aria-label="Save to Wishlist">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="${isWish ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
                <button class="card-action-icon-btn ${isComp ? 'active' : ''}" data-comp-id="${id}" title="Add to Compare" aria-label="Add to Compare">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="16 3 21 3 21 8"></polyline>
                        <line x1="4" y1="20" x2="21" y2="3"></line>
                        <polyline points="21 16 21 21 16 21"></polyline>
                        <line x1="15" y1="15" x2="21" y2="21"></line>
                        <line x1="4" y1="4" x2="9" y2="9"></line>
                    </svg>
                </button>
            `;

            overlay.querySelector('[data-wish-id]').addEventListener('click', (e) => {
                e.stopPropagation();
                toggleWishlist(id);
            });

            overlay.querySelector('[data-comp-id]').addEventListener('click', (e) => {
                e.stopPropagation();
                toggleCompare(id);
            });

            card.style.position = 'relative';
            card.appendChild(overlay);
        });
    }

    function updateCardWishlistButtons() {
        document.querySelectorAll('[data-wish-id]').forEach(btn => {
            const id = btn.getAttribute('data-wish-id');
            const isWish = wishlist.includes(id);
            btn.classList.toggle('active', isWish);
            const svg = btn.querySelector('svg');
            if (svg) svg.setAttribute('fill', isWish ? 'currentColor' : 'none');
        });
    }

    function updateCardCompareButtons() {
        document.querySelectorAll('[data-comp-id]').forEach(btn => {
            const id = btn.getAttribute('data-comp-id');
            const isComp = compareList.includes(id);
            btn.classList.toggle('active', isComp);
        });
    }

    /**
     * 6. Advanced Filter Bar (Material & Room Filters)
     */
    function injectAdvancedFilterBar() {
        const collectionsSec = document.getElementById('collections');
        if (!collectionsSec || document.getElementById('advanced-filter-bar')) return;

        const container = collectionsSec.querySelector('.container-xxl');
        if (!container) return;

        const filterBar = document.createElement('div');
        filterBar.id = 'advanced-filter-bar';
        filterBar.className = 'advanced-filter-bar';

        filterBar.innerHTML = `
            <div class="filter-select-group">
                <select id="filter-material" class="filter-select-dropdown" aria-label="Filter by Material">
                    <option value="all">All Material Finishes</option>
                    <option value="boucle">Textured Bouclé</option>
                    <option value="velvet">Royal Velvet</option>
                    <option value="leather">Italian Aniline Leather</option>
                    <option value="teak">Burma Teak / Sal Wood</option>
                    <option value="marble">Italian Calacatta Marble</option>
                </select>

                <select id="filter-room" class="filter-select-dropdown" aria-label="Filter by Room Type">
                    <option value="all">All Living Spaces</option>
                    <option value="living">Living Room Lounge</option>
                    <option value="dining">Dining & Banquets</option>
                    <option value="bedroom">Master Bedroom Suite</option>
                </select>

                <select id="filter-sort" class="filter-select-dropdown" aria-label="Sort Collection">
                    <option value="curated">Sort: Atelier Curated</option>
                    <option value="name-asc">Name (A — Z)</option>
                </select>
            </div>
            <span class="filter-count-badge" id="filter-results-count">30 Masterpieces</span>
        `;

        container.appendChild(filterBar);

        ['filter-material', 'filter-room', 'filter-sort'].forEach(id => {
            document.getElementById(id).addEventListener('change', applyAdvancedFilters);
        });
    }

    function applyAdvancedFilters() {
        const mat = document.getElementById('filter-material').value;
        const room = document.getElementById('filter-room').value;
        const sort = document.getElementById('filter-sort').value;

        // Get currently active category filter
        const activeCatBtn = document.querySelector('.category-filter-btn.active');
        const activeCat = activeCatBtn ? activeCatBtn.getAttribute('data-filter') : 'all';

        let filtered = activeCat === 'all' ? currentCatalog : currentCatalog.filter(p => p.category === activeCat);

        if (mat !== 'all') {
            filtered = filtered.filter(p => {
                const text = (p.specs + ' ' + p.category_label).toLowerCase();
                return text.includes(mat);
            });
        }

        if (room !== 'all') {
            filtered = filtered.filter(p => {
                if (room === 'living') return ['sofas', 'coffee_tables', 'tpoy', 'recliners', 'chairs'].includes(p.category);
                if (room === 'dining') return p.category === 'dining' || p.category === 'chairs';
                if (room === 'bedroom') return p.category === 'beds';
                return true;
            });
        }

        if (sort === 'name-asc') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        }

        document.getElementById('filter-results-count').innerText = `${filtered.length} Masterpieces`;

        // Render in gallery grid
        const grid = document.getElementById('gallery-grid');
        if (!grid) return;
        grid.innerHTML = '';

        filtered.forEach((item, index) => {
            const card = document.createElement('div');
            const isOffset = index % 3 === 1;
            card.className = `furniture-card col-span-6 ${isOffset ? 'offset-bottom' : ''}`;
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

            card.addEventListener('click', () => {
                if (window.openSpecModal) window.openSpecModal(item);
            });

            grid.appendChild(card);
        });

        attachCardOverlayButtons();
    }

    /**
     * 7. Keyboard Shortcuts (/ or Cmd+K for search, Escape to close)
     */
    function bindKeyboardShortcuts() {
        window.addEventListener('keydown', (e) => {
            if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                e.preventDefault();
                openSearchModal();
            }
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                openSearchModal();
            }
            if (e.key === 'Escape') {
                closeSearchModal();
                closeWishlistDrawer();
                closeCompareModal();
            }
        });
    }

    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

})();
