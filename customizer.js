/**
 * NIVARAA LIVING — BESPOKE FURNITURE CUSTOMIZATION STUDIO
 * Design Your Own Furniture Engine
 * Grounded in authentic Nivaraa craftsmanship and materials.
 */

(function () {
    'use strict';

    // 1. Authentic Nivaraa Material & Swatch Library
    const SWATCH_LIBRARY = {
        boucle: [
            { id: 'ivory-boucle', name: 'Warm Ivory', texture: 'Bouclé Weave', hex: '#F5F2EB', tint: 'rgba(245, 242, 235, 0.28)', blend: 'multiply' },
            { id: 'camel-boucle', name: 'Desert Camel', texture: 'Textured Bouclé', hex: '#C29B72', tint: 'rgba(194, 155, 114, 0.40)', blend: 'multiply' },
            { id: 'sage-boucle', name: 'Lichen Sage', texture: 'Heather Bouclé', hex: '#7D8C7A', tint: 'rgba(125, 140, 122, 0.45)', blend: 'multiply' },
            { id: 'charcoal-boucle', name: 'Graphite Grey', texture: 'Heavy Bouclé', hex: '#3C4247', tint: 'rgba(60, 66, 71, 0.50)', blend: 'multiply' },
            { id: 'oatmeal-boucle', name: 'Oatmeal Melange', texture: 'Cozy Bouclé', hex: '#E2DBD0', tint: 'rgba(226, 219, 208, 0.30)', blend: 'multiply' }
        ],
        velvet: [
            { id: 'emerald-velvet', name: 'Imperial Emerald', texture: 'Royal Velvet', hex: '#1C433C', tint: 'rgba(28, 67, 60, 0.50)', blend: 'multiply' },
            { id: 'caramel-velvet', name: 'Golden Caramel', texture: 'Plush Velvet', hex: '#9E6738', tint: 'rgba(158, 103, 56, 0.45)', blend: 'multiply' },
            { id: 'blush-velvet', name: 'Blush Terracotta', texture: 'Soft Velvet', hex: '#B57E72', tint: 'rgba(181, 126, 114, 0.42)', blend: 'multiply' },
            { id: 'midnight-velvet', name: 'Midnight Navy', texture: 'Deep Velvet', hex: '#1E2B38', tint: 'rgba(30, 43, 56, 0.55)', blend: 'multiply' }
        ],
        leather: [
            { id: 'cognac-leather', name: 'Cognac Saddle', texture: 'Italian Aniline', hex: '#93542B', tint: 'rgba(147, 84, 43, 0.45)', blend: 'multiply' },
            { id: 'espresso-leather', name: 'Cigar Espresso', texture: 'Full-Grain Leather', hex: '#3E291F', tint: 'rgba(62, 41, 31, 0.55)', blend: 'multiply' },
            { id: 'nero-leather', name: 'Nero Black', texture: 'Top-Grain Aniline', hex: '#1A1A1A', tint: 'rgba(26, 26, 26, 0.60)', blend: 'multiply' },
            { id: 'honey-leather', name: 'Warm Honey', texture: 'Supple Nappa', hex: '#B37841', tint: 'rgba(179, 120, 65, 0.40)', blend: 'multiply' }
        ],
        chenille: [
            { id: 'sand-chenille', name: 'Pebble Sand', texture: 'Linen Chenille', hex: '#D8D1C5', tint: 'rgba(216, 209, 197, 0.28)', blend: 'multiply' },
            { id: 'taupe-chenille', name: 'Milano Taupe', texture: 'Soft Chenille', hex: '#8C7E72', tint: 'rgba(140, 126, 114, 0.40)', blend: 'multiply' },
            { id: 'moss-chenille', name: 'Nordic Moss', texture: 'Durable Weave', hex: '#63725F', tint: 'rgba(99, 114, 95, 0.45)', blend: 'multiply' }
        ]
    };

    // 2. Wood & Plinth Finishes
    const WOOD_FINISHES = [
        { id: 'burma-teak', title: 'Burma Teak', desc: 'Seasoned golden honey natural grain plinth' },
        { id: 'smoked-walnut', title: 'Smoked Walnut', desc: 'Deep rich mocha European walnut stain' },
        { id: 'ebonized-ash', title: 'Ebonized Ash', desc: 'Architectural matte noir timber profile' },
        { id: 'brushed-brass', title: 'Brushed Brass', desc: 'Warm metallic accent plinth / ferrules' }
    ];

    // 3. Category-Specific Configurations
    const CONFIGURATIONS_BY_CATEGORY = {
        sofas: [
            { id: '3-seater', title: '3-Seater Classic', desc: 'Standard 230cm luxury length' },
            { id: '2-seater', title: '2-Seater Loveseat', desc: 'Compact 175cm intimate format' },
            { id: 'l-shape-left', title: 'L-Shape (Left Chaise)', desc: 'Extended 330cm left lounging chaise' },
            { id: 'l-shape-right', title: 'L-Shape (Right Chaise)', desc: 'Extended 330cm right lounging chaise' },
            { id: 'curved-arc', title: '4-Seater Curved Arc', desc: 'Sculptural continuous organic arc' }
        ],
        beds: [
            { id: 'king-master', title: 'King Master', desc: '78" x 72" mattress with fluted grand headboard' },
            { id: 'queen-master', title: 'Queen Master', desc: '78" x 60" mattress compact master size' },
            { id: 'custom-bed', title: 'Custom Architectural', desc: 'Floor-to-ceiling extended headboard sizing' }
        ],
        dining: [
            { id: '6-seater', title: '6-Seater Monolith', desc: '200cm x 100cm architectural table' },
            { id: '8-seater', title: '8-Seater Grand', desc: '260cm x 115cm formal banquet layout' },
            { id: '10-seater', title: '10-Seater Atelier', desc: '320cm x 120cm boardroom / estate length' }
        ],
        recliners: [
            { id: 'single-motor', title: 'Motorized Single', desc: 'Smooth whisper-quiet German motor' },
            { id: 'dual-motor', title: 'Dual-Motor Zero-G', desc: 'Independent headrest & footrest reclining' }
        ],
        chairs: [
            { id: 'accent-lounge', title: 'Standard Lounge', desc: 'Low-profile ergonomic occasional chair' },
            { id: 'swivel-base', title: '360° Hidden Swivel', desc: 'Smooth concealed bearing swivel plinth' }
        ],
        coffee_tables: [
            { id: 'nested-pair', title: 'Dual Nesting Set', desc: 'Honed travertine + smoked walnut accent' },
            { id: 'single-table', title: 'Solo Centerpiece', desc: 'Single monolithic cocktail table' }
        ],
        tpoy: [
            { id: 'teak-accent', title: 'Solid Burma Teak', desc: 'Sculptural turned solid wood plinth' },
            { id: 'dual-tpoy', title: 'Pair of T-Poys', desc: 'Asymmetric heights for sofa flanking' }
        ]
    };

    // 4. Ergonomics & Cushion Firmness
    const FIRMNESS_OPTIONS = [
        { id: 'plush-feather', title: 'Plush Feather Down', desc: 'Sink-in cloud topper with memory core' },
        { id: 'medium-balance', title: 'Medium Balanced (40D)', desc: 'High-resilience 40-density orthopedic support' },
        { id: 'firm-architectural', title: 'Firm Architectural', desc: 'Crisp structured tailoring for upright posture' }
    ];

    // Current State
    let currentPiece = null;
    let selectedMaterialGroup = 'boucle';
    let selectedSwatch = SWATCH_LIBRARY.boucle[0];
    let selectedWood = WOOD_FINISHES[0];
    let selectedConfig = null;
    let selectedFirmness = FIRMNESS_OPTIONS[1];
    let customDimensions = { length: '', depth: '', height: '' };
    let currentViewMode = 'normal'; // 'normal' | 'hover'

    // Initialize Studio on DOM Ready
    document.addEventListener('DOMContentLoaded', () => {
        injectStudioDOM();
        bindGlobalTriggers();
    });

    /**
     * Injects the Studio Modal HTML directly into the DOM
     */
    function injectStudioDOM() {
        if (document.getElementById('customizer-studio')) return;

        const overlay = document.createElement('div');
        overlay.id = 'customizer-studio';
        overlay.className = 'customizer-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Bespoke Furniture Customization Studio');

        overlay.innerHTML = `
            <div class="customizer-modal">
                
                <!-- Studio Header -->
                <header class="customizer-header">
                    <div class="customizer-header-title-wrap">
                        <span class="customizer-tag">Bespoke Atelier • Design Your Own</span>
                        <h2 class="customizer-heading" id="studio-product-title">Customize Furniture</h2>
                    </div>
                    <button class="customizer-close-btn" id="studio-close-btn" aria-label="Close Customization Studio">&times;</button>
                </header>

                <!-- Studio Workspace -->
                <div class="customizer-body">
                    
                    <!-- Left Column: Visual Stage -->
                    <div class="customizer-stage-col">
                        <div class="stage-badge-strip">
                            <span class="stage-status-pill">
                                <span class="stage-status-dot"></span>
                                Live Atelier Rendering
                            </span>
                            <div class="stage-view-toggles">
                                <button class="stage-toggle-btn active" id="view-normal-btn">Studio Angle</button>
                                <button class="stage-toggle-btn" id="view-hover-btn">Detail Texture</button>
                            </div>
                        </div>

                        <div class="customizer-preview-container" id="studio-preview-box">
                            <img src="" id="studio-preview-img" class="customizer-preview-img" alt="Bespoke furniture preview">
                            <div class="preview-color-overlay" id="preview-color-overlay"></div>
                        </div>

                        <div class="customizer-preview-legend">
                            <span class="preview-legend-piece" id="legend-piece-name">Piece</span>
                            <span class="preview-legend-swatch" id="legend-swatch-display">
                                <span class="legend-swatch-dot" id="legend-swatch-dot"></span>
                                <span id="legend-swatch-label">Ivory Bouclé</span>
                            </span>
                        </div>
                    </div>

                    <!-- Right Column: Customization Controls -->
                    <div class="customizer-controls-col">
                        
                        <!-- 1. Upholstery & Material Selection -->
                        <section class="control-section">
                            <div class="control-section-header">
                                <h3 class="control-section-title">1. Upholstery & Swatches</h3>
                                <span class="control-section-selected" id="selected-material-text">Bouclé</span>
                            </div>
                            
                            <div class="material-filter-tabs">
                                <button class="material-tab-btn active" data-group="boucle">Bouclé & Weaves</button>
                                <button class="material-tab-btn" data-group="velvet">Royal Velvet</button>
                                <button class="material-tab-btn" data-group="leather">Italian Aniline Leather</button>
                                <button class="material-tab-btn" data-group="chenille">Linen & Chenille</button>
                            </div>

                            <div class="swatch-grid" id="swatch-grid-container"></div>
                        </section>

                        <!-- 2. Wood & Plinth Finish -->
                        <section class="control-section">
                            <div class="control-section-header">
                                <h3 class="control-section-title">2. Wood & Plinth Finish</h3>
                                <span class="control-section-selected" id="selected-wood-text">Burma Teak</span>
                            </div>
                            <div class="option-chips-grid" id="wood-chips-container"></div>
                        </section>

                        <!-- 3. Configuration & Sizing -->
                        <section class="control-section">
                            <div class="control-section-header">
                                <h3 class="control-section-title">3. Configuration & Layout</h3>
                                <span class="control-section-selected" id="selected-config-text">Standard</span>
                            </div>
                            <div class="option-chips-grid" id="config-chips-container"></div>
                        </section>

                        <!-- 4. Ergonomics & Cushion Firmness -->
                        <section class="control-section">
                            <div class="control-section-header">
                                <h3 class="control-section-title">4. Seat Ergonomics & Core</h3>
                                <span class="control-section-selected" id="selected-firmness-text">Medium Balanced</span>
                            </div>
                            <div class="option-chips-grid" id="firmness-chips-container"></div>
                        </section>

                        <!-- 5. Bespoke Millimeter Dimensions -->
                        <section class="control-section">
                            <div class="control-section-header">
                                <h3 class="control-section-title">5. Custom Dimensions (Optional)</h3>
                                <span class="control-section-selected">Millimeter Tailored</span>
                            </div>
                            <div class="dimensions-input-grid">
                                <div class="dim-input-group">
                                    <label for="dim-length">Length (cm)</label>
                                    <input type="text" id="dim-length" class="dim-input-field" placeholder="e.g. 235">
                                </div>
                                <div class="dim-input-group">
                                    <label for="dim-depth">Depth (cm)</label>
                                    <input type="text" id="dim-depth" class="dim-input-field" placeholder="e.g. 98">
                                </div>
                                <div class="dim-input-group">
                                    <label for="dim-height">Height (cm)</label>
                                    <input type="text" id="dim-height" class="dim-input-field" placeholder="e.g. 86">
                                </div>
                            </div>
                        </section>

                    </div>
                </div>

                <!-- Studio Footer & Action Bar -->
                <footer class="customizer-footer">
                    <div class="customizer-summary-block">
                        <span class="summary-reference-tag" id="studio-reference-tag">REF: NIV-STD-0000</span>
                        <span class="summary-spec-line" id="studio-summary-line">Loading configuration summary...</span>
                    </div>
                    <div class="customizer-actions-group">
                        <button class="btn-save-design" id="studio-save-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                <polyline points="7 3 7 8 15 8"></polyline>
                            </svg>
                            <span>Save Design</span>
                        </button>
                        <a href="#" class="btn-whatsapp-quote" id="studio-whatsapp-quote" target="_blank" rel="noopener noreferrer">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.071.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824z"/>
                            </svg>
                            <span>Request Bespoke Quote</span>
                        </a>
                    </div>
                </footer>

            </div>
        `;

        document.body.appendChild(overlay);

        // Bind events inside the injected studio
        document.getElementById('studio-close-btn').addEventListener('click', closeStudio);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeStudio();
        });

        // View mode toggles
        const viewNormalBtn = document.getElementById('view-normal-btn');
        const viewHoverBtn = document.getElementById('view-hover-btn');

        viewNormalBtn.addEventListener('click', () => {
            currentViewMode = 'normal';
            viewNormalBtn.classList.add('active');
            viewHoverBtn.classList.remove('active');
            updateStudioImage();
        });

        viewHoverBtn.addEventListener('click', () => {
            currentViewMode = 'hover';
            viewHoverBtn.classList.add('active');
            viewNormalBtn.classList.remove('active');
            updateStudioImage();
        });

        // Material tab toggles
        overlay.querySelectorAll('.material-tab-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                overlay.querySelectorAll('.material-tab-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                selectedMaterialGroup = this.getAttribute('data-group');
                renderSwatches();
            });
        });

        // Dimension input handlers
        ['dim-length', 'dim-depth', 'dim-height'].forEach(id => {
            const input = document.getElementById(id);
            input.addEventListener('input', () => {
                customDimensions.length = document.getElementById('dim-length').value.trim();
                customDimensions.depth = document.getElementById('dim-depth').value.trim();
                customDimensions.height = document.getElementById('dim-height').value.trim();
                updateSummaryAndQuote();
            });
        });

        // Save design button
        document.getElementById('studio-save-btn').addEventListener('click', saveCurrentDesign);

        // Keyboard Escape listener
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                closeStudio();
            }
        });
    }

    /**
     * Binds trigger buttons in #spec-modal and gallery cards
     */
    function bindGlobalTriggers() {
        // Add "Customize in Studio" button to #spec-modal if not already present
        const modalContentCol = document.querySelector('.spec-modal-content-col');
        if (modalContentCol && !document.getElementById('modal-open-studio-btn')) {
            const studioBtn = document.createElement('button');
            studioBtn.id = 'modal-open-studio-btn';
            studioBtn.className = 'modal-customize-btn';
            studioBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                <span>Design Your Own Furniture</span>
            `;
            studioBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // Close spec modal and open studio with current item
                const specModal = document.getElementById('spec-modal');
                if (specModal) specModal.classList.remove('active');
                if (window.currentActivePiece) {
                    window.openFurnitureStudio(window.currentActivePiece);
                }
            });
            modalContentCol.appendChild(studioBtn);
        }
    }

    /**
     * Opens the Customization Studio for a specific furniture piece
     */
    window.openFurnitureStudio = function (item) {
        if (!item) return;
        currentPiece = item;
        window.currentActivePiece = item;

        // Reset state
        selectedMaterialGroup = 'boucle';
        selectedSwatch = SWATCH_LIBRARY.boucle[0];
        selectedWood = WOOD_FINISHES[0];
        selectedFirmness = FIRMNESS_OPTIONS[1];
        currentViewMode = 'normal';

        const configs = CONFIGURATIONS_BY_CATEGORY[item.category] || CONFIGURATIONS_BY_CATEGORY.sofas;
        selectedConfig = configs[0];

        // Parse default dimensions if available
        parseDimensions(item.dimensions);

        // Update UI
        document.getElementById('studio-product-title').innerText = `${item.name} Atelier Studio`;
        document.getElementById('legend-piece-name').innerText = `${item.name} (${item.category_label})`;

        // Reset tab active state
        document.querySelectorAll('.material-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-group') === 'boucle');
        });

        // Render sections
        renderSwatches();
        renderWoodFinishes();
        renderConfigurations();
        renderFirmnessOptions();
        updateStudioImage();
        updateSummaryAndQuote();

        // Show overlay
        const studio = document.getElementById('customizer-studio');
        studio.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    function closeStudio() {
        const studio = document.getElementById('customizer-studio');
        if (studio) studio.classList.remove('active');
        document.body.style.overflow = '';
    }

    /**
     * Parse dimensions string for starter input fields
     */
    function parseDimensions(dimStr) {
        customDimensions = { length: '', depth: '', height: '' };
        if (!dimStr) return;

        const cmMatches = dimStr.match(/(\d{2,3})\s*cm/g);
        if (cmMatches && cmMatches.length >= 2) {
            customDimensions.length = cmMatches[0].replace(/\D/g, '');
            customDimensions.depth = cmMatches[1].replace(/\D/g, '');
            if (cmMatches[2]) customDimensions.height = cmMatches[2].replace(/\D/g, '');
        }

        document.getElementById('dim-length').value = customDimensions.length;
        document.getElementById('dim-depth').value = customDimensions.depth;
        document.getElementById('dim-height').value = customDimensions.height;
    }

    /**
     * Render Swatch Grid for active group
     */
    function renderSwatches() {
        const container = document.getElementById('swatch-grid-container');
        container.innerHTML = '';
        const list = SWATCH_LIBRARY[selectedMaterialGroup] || [];

        list.forEach(swatch => {
            const el = document.createElement('div');
            el.className = `swatch-item ${swatch.id === selectedSwatch.id ? 'active' : ''}`;
            el.innerHTML = `
                <div class="swatch-disc" style="background-color: ${swatch.hex};"></div>
                <span class="swatch-name">${swatch.name}</span>
                <span class="swatch-texture-tag">${swatch.texture}</span>
            `;

            el.addEventListener('click', () => {
                selectedSwatch = swatch;
                container.querySelectorAll('.swatch-item').forEach(s => s.classList.remove('active'));
                el.classList.add('active');
                document.getElementById('selected-material-text').innerText = `${swatch.name} (${swatch.texture})`;
                updateSwatchPreview();
                updateSummaryAndQuote();
            });

            container.appendChild(el);
        });

        document.getElementById('selected-material-text').innerText = `${selectedSwatch.name} (${selectedSwatch.texture})`;
        updateSwatchPreview();
    }

    /**
     * Render Wood Finish Chips
     */
    function renderWoodFinishes() {
        const container = document.getElementById('wood-chips-container');
        container.innerHTML = '';

        WOOD_FINISHES.forEach(wood => {
            const el = document.createElement('div');
            el.className = `option-chip ${wood.id === selectedWood.id ? 'active' : ''}`;
            el.innerHTML = `
                <span class="option-chip-title">${wood.title}</span>
                <span class="option-chip-desc">${wood.desc}</span>
            `;

            el.addEventListener('click', () => {
                selectedWood = wood;
                container.querySelectorAll('.option-chip').forEach(c => c.classList.remove('active'));
                el.classList.add('active');
                document.getElementById('selected-wood-text').innerText = wood.title;
                updateSummaryAndQuote();
            });

            container.appendChild(el);
        });

        document.getElementById('selected-wood-text').innerText = selectedWood.title;
    }

    /**
     * Render Configurations by piece category
     */
    function renderConfigurations() {
        const container = document.getElementById('config-chips-container');
        container.innerHTML = '';
        const configs = CONFIGURATIONS_BY_CATEGORY[currentPiece.category] || CONFIGURATIONS_BY_CATEGORY.sofas;

        configs.forEach(cfg => {
            const el = document.createElement('div');
            el.className = `option-chip ${cfg.id === selectedConfig.id ? 'active' : ''}`;
            el.innerHTML = `
                <span class="option-chip-title">${cfg.title}</span>
                <span class="option-chip-desc">${cfg.desc}</span>
            `;

            el.addEventListener('click', () => {
                selectedConfig = cfg;
                container.querySelectorAll('.option-chip').forEach(c => c.classList.remove('active'));
                el.classList.add('active');
                document.getElementById('selected-config-text').innerText = cfg.title;
                updateSummaryAndQuote();
            });

            container.appendChild(el);
        });

        document.getElementById('selected-config-text').innerText = selectedConfig.title;
    }

    /**
     * Render Firmness Options
     */
    function renderFirmnessOptions() {
        const container = document.getElementById('firmness-chips-container');
        container.innerHTML = '';

        FIRMNESS_OPTIONS.forEach(opt => {
            const el = document.createElement('div');
            el.className = `option-chip ${opt.id === selectedFirmness.id ? 'active' : ''}`;
            el.innerHTML = `
                <span class="option-chip-title">${opt.title}</span>
                <span class="option-chip-desc">${opt.desc}</span>
            `;

            el.addEventListener('click', () => {
                selectedFirmness = opt;
                container.querySelectorAll('.option-chip').forEach(c => c.classList.remove('active'));
                el.classList.add('active');
                document.getElementById('selected-firmness-text').innerText = opt.title;
                updateSummaryAndQuote();
            });

            container.appendChild(el);
        });

        document.getElementById('selected-firmness-text').innerText = selectedFirmness.title;
    }

    /**
     * Update Studio Image source based on view mode
     */
    function updateStudioImage() {
        if (!currentPiece) return;
        const img = document.getElementById('studio-preview-img');
        const targetSrc = currentViewMode === 'hover' ? currentPiece.img_hover : currentPiece.img_normal;
        img.src = targetSrc;
        img.alt = `${currentPiece.name} - ${selectedSwatch.name}`;
    }

    /**
     * Apply subtle realistic colorway tint overlay matching the benchmark image
     */
    function updateSwatchPreview() {
        const overlay = document.getElementById('preview-color-overlay');
        const legendDot = document.getElementById('legend-swatch-dot');
        const legendLabel = document.getElementById('legend-swatch-label');

        if (overlay && selectedSwatch) {
            overlay.style.backgroundColor = selectedSwatch.hex;
            overlay.style.mixBlendMode = selectedSwatch.blend || 'multiply';
            overlay.style.opacity = selectedSwatch.id.includes('ivory') || selectedSwatch.id.includes('oatmeal') ? '0.08' : '0.22';
        }

        if (legendDot && selectedSwatch) {
            legendDot.style.backgroundColor = selectedSwatch.hex;
        }

        if (legendLabel && selectedSwatch) {
            legendLabel.innerText = `${selectedSwatch.name} (${selectedSwatch.texture})`;
        }
    }

    /**
     * Generate unique reference and update WhatsApp link
     */
    function updateSummaryAndQuote() {
        if (!currentPiece) return;

        // Generate unique reference e.g., NIV-ANT-842B
        const nameCode = currentPiece.name.replace(/[^A-Za-z]/g, '').substring(0, 3).toUpperCase();
        const swatchCode = selectedSwatch.id.substring(0, 2).toUpperCase();
        const randHash = Math.random().toString(36).substring(2, 6).toUpperCase();
        const refCode = `NIV-${nameCode}-${swatchCode}-${randHash}`;

        document.getElementById('studio-reference-tag').innerText = `DESIGN REF: ${refCode}`;

        // Build readable summary line
        const dimStr = customDimensions.length ? `${customDimensions.length}L × ${customDimensions.depth || '95'}D × ${customDimensions.height || '85'}H cm` : 'Standard Specifications';
        const summaryText = `${currentPiece.name} | ${selectedConfig.title} | ${selectedSwatch.name} (${selectedSwatch.texture}) | ${selectedWood.title} | ${selectedFirmness.title} | ${dimStr}`;
        document.getElementById('studio-summary-line').innerText = summaryText;

        // Pre-fill WhatsApp message
        const waMsg = [
            `*NIVARAA LIVING — BESPOKE COMMISSION INQUIRY*`,
            `----------------------------------------`,
            `*Product:* ${currentPiece.name} (${currentPiece.category_label})`,
            `*Design Reference:* ${refCode}`,
            `*Configuration:* ${selectedConfig.title}`,
            `*Upholstery:* ${selectedSwatch.name} [${selectedSwatch.texture}]`,
            `*Wood / Plinth:* ${selectedWood.title}`,
            `*Seat Cushion:* ${selectedFirmness.title}`,
            `*Dimensions:* ${dimStr}`,
            `----------------------------------------`,
            `Hello Shrinivas, I have configured this bespoke design in the Nivaraa Atelier Studio. Please provide a formal quotation and advise on showroom appointment slots.`
        ].join('\n');

        const waUrl = `https://wa.me/919146189933?text=${encodeURIComponent(waMsg)}`;
        document.getElementById('studio-whatsapp-quote').href = waUrl;
    }

    /**
     * Save Current Design to LocalStorage
     */
    function saveCurrentDesign() {
        if (!currentPiece) return;

        const designData = {
            id: Date.now(),
            productId: currentPiece.id,
            productName: currentPiece.name,
            category: currentPiece.category,
            image: currentPiece.img_normal,
            swatch: selectedSwatch,
            wood: selectedWood,
            config: selectedConfig,
            firmness: selectedFirmness,
            dimensions: customDimensions,
            timestamp: new Date().toISOString()
        };

        const existing = JSON.parse(localStorage.getItem('nivaraa_custom_designs') || '[]');
        existing.unshift(designData);
        localStorage.setItem('nivaraa_custom_designs', JSON.stringify(existing.slice(0, 20)));

        const saveBtn = document.getElementById('studio-save-btn');
        const origHTML = saveBtn.innerHTML;
        saveBtn.innerHTML = `<span>✓ Design Saved</span>`;
        saveBtn.style.borderColor = 'var(--shepel-gold)';
        saveBtn.style.color = 'var(--shepel-gold)';

        setTimeout(() => {
            saveBtn.innerHTML = origHTML;
            saveBtn.style.borderColor = '';
            saveBtn.style.color = '';
        }, 2200);
    }

})();
