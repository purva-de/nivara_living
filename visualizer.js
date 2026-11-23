/**
 * NIVARAA LIVING — AI ROOM VISUALIZER ("VISUALIZE IN YOUR ROOM")
 * Secure Server-Side AI Gateway Client
 * Split-Screen Comparison Slider | Consent Management | Data Deletion
 */

(function () {
    'use strict';

    const INTERIOR_STYLES = [
        { id: 'japandi', name: 'Japandi Minimalist', desc: 'Light timber, serene neutrals & balanced negative space' },
        { id: 'luxury-penthouse', name: 'Contemporary Luxury', desc: 'Honed travertine, warm architectural cove lighting & brass' },
        { id: 'warm-modern', name: 'Warm Modernist', desc: 'Deep walnut, cozy bouclé textures & organic curves' },
        { id: 'classical-villa', name: 'Classical Villa', desc: 'High ceilings, ornate mouldings & understated elegance' }
    ];

    const QUICK_COLORS = [
        { name: 'Warm Ivory', hex: '#F5F2EB', texture: 'Bouclé' },
        { name: 'Desert Camel', hex: '#C29B72', texture: 'Textured Bouclé' },
        { name: 'Lichen Sage', hex: '#7D8C7A', texture: 'Heather Weave' },
        { name: 'Imperial Emerald', hex: '#1C433C', texture: 'Royal Velvet' },
        { name: 'Cognac Saddle', hex: '#93542B', texture: 'Italian Aniline' },
        { name: 'Graphite Grey', hex: '#3C4247', texture: 'Heavy Chenille' }
    ];

    let roomBase64 = null;
    let roomFileName = '';
    let selectedProduct = null;
    let selectedColor = QUICK_COLORS[0];
    let selectedStyle = INTERIOR_STYLES[1]; // Contemporary Luxury default
    let isGenerating = false;
    let generatedImageBase64 = null;
    let hasUserConsented = localStorage.getItem('nivaraa_ai_consent') === 'true';

    document.addEventListener('DOMContentLoaded', () => {
        injectVisualizerDOM();
        bindVisualizerTriggers();
    });

    /**
     * Injects the Visualizer Studio Modal into the DOM
     */
    function injectVisualizerDOM() {
        if (document.getElementById('visualizer-studio')) return;

        const overlay = document.createElement('div');
        overlay.id = 'visualizer-studio';
        overlay.className = 'visualizer-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'AI Room Visualizer');

        overlay.innerHTML = `
            <div class="visualizer-modal">
                
                <!-- Header -->
                <header class="visualizer-header">
                    <div class="visualizer-header-title-wrap">
                        <span class="visualizer-tag">Nivaraa Atelier AI • Spatial Preview</span>
                        <h2 class="visualizer-heading">Visualize in Your Room</h2>
                    </div>
                    <button class="visualizer-close-btn" id="visualizer-close-btn" aria-label="Close Visualizer">&times;</button>
                </header>

                <!-- Workspace -->
                <div class="visualizer-body">
                    
                    <!-- Left: Interactive Comparison Stage -->
                    <div class="visualizer-viewport-col">
                        <div class="viewport-toolbar">
                            <span class="viewport-tag-badge" id="viewport-status-badge">Awaiting Room Photo</span>
                            <span class="ai-concept-pill">AI Concept Preview</span>
                        </div>

                        <div class="comparison-slider-stage" id="comparison-stage">
                            
                            <!-- Empty Initial State -->
                            <div class="comparison-empty-state" id="comparison-empty-state">
                                <div class="comparison-empty-icon">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                        <polyline points="21 15 16 10 5 21"></polyline>
                                    </svg>
                                </div>
                                <p style="font-size: 15px; margin: 0; font-family: var(--font-serif, 'Cormorant Garamond', serif); letter-spacing: 0.04em;">Upload your room photograph to place bespoke Nivaraa furniture</p>
                                <span style="font-size: 12px; color: rgba(255, 255, 255, 0.45);">Supported formats: JPG, PNG, WebP (up to 10MB)</span>
                            </div>

                            <!-- Original Image Layer -->
                            <img src="" id="comparison-original-img" class="comparison-img" style="display: none;" alt="Original room photograph">

                            <!-- AI Generated Layer (Clipped by slider handle) -->
                            <div class="comparison-generated-layer" id="comparison-generated-layer" style="display: none;">
                                <img src="" id="comparison-generated-img" class="comparison-generated-img" alt="Nivaraa living piece in room">
                            </div>

                            <!-- Slider Drag Handle -->
                            <div class="comparison-slider-handle" id="slider-handle" style="display: none;">
                                <div class="slider-handle-button">↔</div>
                            </div>

                            <span class="slider-label slider-label-before" id="slider-label-before" style="display: none;">Original Room</span>
                            <span class="slider-label slider-label-after" id="slider-label-after" style="display: none;">Nivaraa Concept</span>

                            <!-- Loading Overlay -->
                            <div class="visualizer-loading-overlay" id="visualizer-loading-overlay">
                                <div class="loading-spinner-atelier"></div>
                                <span class="loading-status-text" id="loading-step-text">Analyzing room architecture...</span>
                                <span class="loading-subtext">Calibrating spatial depth, ambient lighting & bespoke joinery</span>
                            </div>

                        </div>
                    </div>

                    <!-- Right: Controls & Parameters -->
                    <div class="visualizer-controls-col">
                        
                        <!-- 1. Room Upload -->
                        <section class="control-section">
                            <div class="control-section-header">
                                <h3 class="control-section-title">1. Your Room Photograph</h3>
                                <span class="control-section-selected" id="upload-status-label">Required</span>
                            </div>
                            
                            <div class="room-dropzone" id="room-dropzone">
                                <svg class="dropzone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="17 8 12 3 7 8"></polyline>
                                    <line x1="12" y1="3" x2="12" y2="15"></line>
                                </svg>
                                <span class="dropzone-label">Drop room photo here or click to browse</span>
                                <span class="dropzone-subtext">Living rooms, bedrooms or lounges work best</span>
                                <input type="file" id="room-file-input" class="room-file-input" accept="image/jpeg,image/png,image/webp">
                            </div>

                            <div class="room-uploaded-preview" id="room-uploaded-preview">
                                <img src="" id="room-thumb-img" class="room-preview-thumb" alt="Room preview">
                                <div class="room-preview-meta">
                                    <span class="room-preview-filename" id="room-file-name-text">room.jpg</span>
                                    <span style="font-size: 10px; color: var(--shepel-gold); font-weight: 600;">READY TO VISUALIZE</span>
                                </div>
                                <button class="btn-remove-room" id="btn-remove-room" type="button">Delete</button>
                            </div>
                        </section>

                        <!-- 2. Furniture Product Selection -->
                        <section class="control-section">
                            <div class="control-section-header">
                                <h3 class="control-section-title">2. Select Nivaraa Piece</h3>
                                <span class="control-section-selected" id="visualizer-piece-label">Select</span>
                            </div>
                            <select id="visualizer-product-select" class="product-select-dropdown">
                                <option value="">Choose a handcrafted piece...</option>
                            </select>
                        </section>

                        <!-- 3. Upholstery & Colorway -->
                        <section class="control-section">
                            <div class="control-section-header">
                                <h3 class="control-section-title">3. Fabric & Colorway</h3>
                                <span class="control-section-selected" id="visualizer-color-label">Warm Ivory</span>
                            </div>
                            <div class="swatch-grid" id="visualizer-color-swatches"></div>
                        </section>

                        <!-- 4. Interior Style -->
                        <section class="control-section">
                            <div class="control-section-header">
                                <h3 class="control-section-title">4. Interior Design Aesthetic</h3>
                                <span class="control-section-selected" id="visualizer-style-label">Contemporary Luxury</span>
                            </div>
                            <div class="style-chips-grid" id="visualizer-style-grid"></div>
                        </section>

                    </div>
                </div>

                <!-- Footer Action Bar -->
                <footer class="visualizer-footer">
                    <div class="visualizer-btn-group">
                        <button class="btn-generate-ai" id="btn-generate-ai">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                            <span>Generate AI Visualization</span>
                        </button>
                        
                        <button class="btn-visualizer-secondary" id="btn-variation-ai" style="display: none;">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M23 4v6h-6"></path>
                                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                            </svg>
                            <span>Another Variation</span>
                        </button>

                        <button class="btn-visualizer-secondary" id="btn-save-visualization" style="display: none;">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            <span>Save Image</span>
                        </button>
                    </div>

                    <a href="#" class="btn-visualizer-consult" id="btn-visualizer-consult" target="_blank" rel="noopener noreferrer">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.071.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824z"/>
                        </svg>
                        <span>Request Room Consultation</span>
                    </a>
                </footer>

                <!-- Consent Dialog Overlay -->
                <div class="visualizer-consent-dialog" id="visualizer-consent-dialog">
                    <div class="consent-card">
                        <span class="consent-badge">Privacy & Atelier Standards</span>
                        <h3 class="consent-title">Consent for AI Room Visualization</h3>
                        <p class="consent-body">
                            To generate a photorealistic placement of Nivaraa Living furniture in your space, your uploaded room photo is processed by our secure server-side AI gateway. 
                            <br><br>
                            • Your photograph is strictly used for this visualization session.<br>
                            • You can permanently delete your uploaded image anytime with the "Delete" button.<br>
                            • All renderings are labeled as AI concepts.
                        </p>
                        <div class="consent-actions">
                            <button class="btn-consent-accept" id="btn-consent-accept">I Agree & Continue</button>
                            <button class="btn-consent-decline" id="btn-consent-decline">Cancel</button>
                        </div>
                    </div>
                </div>

            </div>
        `;

        document.body.appendChild(overlay);

        // Bind internal studio events
        document.getElementById('visualizer-close-btn').addEventListener('click', closeVisualizer);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeVisualizer();
        });

        // Consent actions
        document.getElementById('btn-consent-accept').addEventListener('click', () => {
            hasUserConsented = true;
            localStorage.setItem('nivaraa_ai_consent', 'true');
            document.getElementById('visualizer-consent-dialog').classList.remove('active');
            if (roomBase64 && selectedProduct) {
                executeAIVisualization();
            }
        });

        document.getElementById('btn-consent-decline').addEventListener('click', () => {
            document.getElementById('visualizer-consent-dialog').classList.remove('active');
        });

        // Dropzone interactions
        const dropzone = document.getElementById('room-dropzone');
        const fileInput = document.getElementById('room-file-input');

        dropzone.addEventListener('click', () => fileInput.click());

        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('dragover');
        });

        dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));

        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('dragover');
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleUploadedFile(e.dataTransfer.files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                handleUploadedFile(e.target.files[0]);
            }
        });

        // Delete room image button
        document.getElementById('btn-remove-room').addEventListener('click', deleteRoomData);

        // Populate Products
        populateProductsDropdown();

        // Populate Colors & Styles
        renderVisualizerSwatches();
        renderVisualizerStyles();

        // Setup Comparison Slider Dragging
        initComparisonSliderEvents();

        // Generate Buttons
        document.getElementById('btn-generate-ai').addEventListener('click', onGenerateClick);
        document.getElementById('btn-variation-ai').addEventListener('click', onGenerateClick);
        document.getElementById('btn-save-visualization').addEventListener('click', saveVisualizationImage);

        // Escape key listener
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                closeVisualizer();
            }
        });
    }

    /**
     * Binds trigger buttons in #spec-modal
     */
    function bindVisualizerTriggers() {
        const modalContentCol = document.querySelector('.spec-modal-content-col');
        if (modalContentCol && !document.getElementById('modal-visualize-trigger-btn')) {
            const vizBtn = document.createElement('button');
            vizBtn.id = 'modal-visualize-trigger-btn';
            vizBtn.className = 'modal-visualize-btn';
            vizBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <span>Visualize in Your Room (AI)</span>
            `;
            vizBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const specModal = document.getElementById('spec-modal');
                if (specModal) specModal.classList.remove('active');
                window.openRoomVisualizer(window.currentActivePiece);
            });
            modalContentCol.appendChild(vizBtn);
        }
    }

    /**
     * Public API to open the Room Visualizer
     */
    window.openRoomVisualizer = function (item) {
        const overlay = document.getElementById('visualizer-studio');
        if (!overlay) return;

        if (item) {
            selectedProduct = item;
            const selectEl = document.getElementById('visualizer-product-select');
            if (selectEl) selectEl.value = item.id;
            document.getElementById('visualizer-piece-label').innerText = item.name;
        }

        updateConsultLink();
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    function closeVisualizer() {
        const overlay = document.getElementById('visualizer-studio');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    /**
     * Handle room file upload with validation
     */
    function handleUploadedFile(file) {
        if (!file.type.match(/^image\/(jpeg|png|webp)$/i)) {
            alert('Please select a valid image file (JPG, PNG, or WebP).');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert('The uploaded image exceeds the 10MB limit. Please choose a smaller photo.');
            return;
        }

        roomFileName = file.name;
        const reader = new FileReader();
        reader.onload = function (e) {
            roomBase64 = e.target.result;

            // Update dropzone & preview
            document.getElementById('room-dropzone').style.display = 'none';
            const previewWrap = document.getElementById('room-uploaded-preview');
            previewWrap.style.display = 'flex';
            document.getElementById('room-thumb-img').src = roomBase64;
            document.getElementById('room-file-name-text').innerText = roomFileName;
            document.getElementById('upload-status-label').innerText = 'Uploaded';

            // Show in viewport stage
            document.getElementById('comparison-empty-state').style.display = 'none';
            const origImg = document.getElementById('comparison-original-img');
            origImg.src = roomBase64;
            origImg.style.display = 'block';

            document.getElementById('viewport-status-badge').innerText = 'Room Loaded';
        };
        reader.readAsDataURL(file);
    }

    /**
     * Delete room data permanently
     */
    function deleteRoomData() {
        roomBase64 = null;
        roomFileName = '';
        generatedImageBase64 = null;

        // Reset UI
        document.getElementById('room-uploaded-preview').style.display = 'none';
        document.getElementById('room-dropzone').style.display = 'flex';
        document.getElementById('upload-status-label').innerText = 'Required';
        document.getElementById('room-file-input').value = '';

        document.getElementById('comparison-original-img').style.display = 'none';
        document.getElementById('comparison-generated-layer').style.display = 'none';
        document.getElementById('slider-handle').style.display = 'none';
        document.getElementById('slider-label-before').style.display = 'none';
        document.getElementById('slider-label-after').style.display = 'none';
        document.getElementById('comparison-empty-state').style.display = 'flex';

        document.getElementById('btn-variation-ai').style.display = 'none';
        document.getElementById('btn-save-visualization').style.display = 'none';
        document.getElementById('viewport-status-badge').innerText = 'Awaiting Room Photo';

        // Notify server-side deletion endpoint
        fetch('/api/delete-room-data', { method: 'POST' }).catch(() => {});
    }

    /**
     * Populate catalog pieces in dropdown
     */
    async function populateProductsDropdown() {
        const select = document.getElementById('visualizer-product-select');
        if (!select) return;

        let pieces = window.allFurniturePieces || [];
        if (!pieces.length) {
            try {
                const res = await fetch('curated_all_furniture.json');
                pieces = await res.json();
            } catch (e) {}
        }

        pieces.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.innerText = `${p.name} — ${p.category_label}`;
            select.appendChild(opt);
        });

        select.addEventListener('change', () => {
            const found = pieces.find(x => x.id === select.value);
            if (found) {
                selectedProduct = found;
                document.getElementById('visualizer-piece-label').innerText = found.name;
                updateConsultLink();
            }
        });
    }

    /**
     * Render quick color swatches
     */
    function renderVisualizerSwatches() {
        const container = document.getElementById('visualizer-color-swatches');
        container.innerHTML = '';

        QUICK_COLORS.forEach(c => {
            const el = document.createElement('div');
            el.className = `swatch-item ${c.name === selectedColor.name ? 'active' : ''}`;
            el.innerHTML = `
                <div class="swatch-disc" style="background-color: ${c.hex};"></div>
                <span class="swatch-name">${c.name}</span>
                <span class="swatch-texture-tag">${c.texture}</span>
            `;

            el.addEventListener('click', () => {
                selectedColor = c;
                container.querySelectorAll('.swatch-item').forEach(s => s.classList.remove('active'));
                el.classList.add('active');
                document.getElementById('visualizer-color-label').innerText = `${c.name} (${c.texture})`;
                updateConsultLink();
            });

            container.appendChild(el);
        });
    }

    /**
     * Render interior style chips
     */
    function renderVisualizerStyles() {
        const container = document.getElementById('visualizer-style-grid');
        container.innerHTML = '';

        INTERIOR_STYLES.forEach(s => {
            const el = document.createElement('div');
            el.className = `style-chip ${s.id === selectedStyle.id ? 'active' : ''}`;
            el.innerHTML = `
                <span class="style-chip-name">${s.name}</span>
                <span class="style-chip-desc">${s.desc}</span>
            `;

            el.addEventListener('click', () => {
                selectedStyle = s;
                container.querySelectorAll('.style-chip').forEach(c => c.classList.remove('active'));
                el.classList.add('active');
                document.getElementById('visualizer-style-label').innerText = s.name;
                updateConsultLink();
            });

            container.appendChild(el);
        });
    }

    /**
     * Trigger generation check
     */
    function onGenerateClick() {
        if (!roomBase64) {
            alert('Please upload a photograph of your room first.');
            return;
        }

        if (!selectedProduct) {
            alert('Please select a Nivaraa furniture piece to visualize in your room.');
            return;
        }

        if (!hasUserConsented) {
            document.getElementById('visualizer-consent-dialog').classList.add('active');
            return;
        }

        executeAIVisualization();
    }

    /**
     * Execute Server-Side AI Generation
     */
    async function executeAIVisualization() {
        if (isGenerating) return;
        isGenerating = true;

        const loadingOverlay = document.getElementById('visualizer-loading-overlay');
        const stepText = document.getElementById('loading-step-text');
        loadingOverlay.classList.add('active');

        // Progressive atelier steps
        const steps = [
            'Analyzing room architecture & perspective...',
            'Calibrating ambient lighting and floor geometry...',
            `Placing handcrafted ${selectedProduct.name} in ${selectedColor.name}...`,
            'Refining shadows, realistic reflections and fabric draping...'
        ];

        let stepIndex = 0;
        const stepInterval = setInterval(() => {
            stepIndex = (stepIndex + 1) % steps.length;
            stepText.innerText = steps[stepIndex];
        }, 1200);

        try {
            const payload = {
                roomImage: roomBase64,
                product: {
                    id: selectedProduct.id,
                    name: selectedProduct.name,
                    category: selectedProduct.category,
                    image: selectedProduct.img_normal
                },
                material: selectedColor.texture,
                color: selectedColor.name,
                style: selectedStyle.name,
                consentGiven: true
            };

            const response = await fetch('/api/visualize-room', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            clearInterval(stepInterval);

            if (!response.ok) {
                throw new Error(`Server returned HTTP ${response.status}`);
            }

            const data = await response.json();
            generatedImageBase64 = data.visualizationImage;

            // Render Comparison Slider
            renderComparisonResult(generatedImageBase64);

        } catch (err) {
            console.error('Visualization error:', err);
            clearInterval(stepInterval);
            alert('We could not complete the visualization at this moment. Please retry or adjust the room photo.');
        } finally {
            isGenerating = false;
            loadingOverlay.classList.remove('active');
        }
    }

    /**
     * Setup Comparison Viewport with slider handle
     */
    function renderComparisonResult(generatedSrc) {
        const genImg = document.getElementById('comparison-generated-img');
        const genLayer = document.getElementById('comparison-generated-layer');
        const handle = document.getElementById('slider-handle');
        const labelBefore = document.getElementById('slider-label-before');
        const labelAfter = document.getElementById('slider-label-after');

        genImg.src = generatedSrc;
        genLayer.style.display = 'block';
        handle.style.display = 'block';
        labelBefore.style.display = 'block';
        labelAfter.style.display = 'block';

        // Set slider to 50%
        setSliderPosition(50);

        document.getElementById('btn-variation-ai').style.display = 'inline-flex';
        document.getElementById('btn-save-visualization').style.display = 'inline-flex';
        document.getElementById('viewport-status-badge').innerText = 'Visualization Ready';
    }

    /**
     * Initialize Drag Handle Events for Comparison Slider
     */
    function initComparisonSliderEvents() {
        const stage = document.getElementById('comparison-stage');
        let isDragging = false;

        function updateFromEvent(e) {
            const rect = stage.getBoundingClientRect();
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            if (!clientX) return;
            const x = clientX - rect.left;
            let percent = (x / rect.width) * 100;
            percent = Math.max(0, Math.min(100, percent));
            setSliderPosition(percent);
        }

        stage.addEventListener('mousedown', (e) => {
            isDragging = true;
            updateFromEvent(e);
        });

        window.addEventListener('mousemove', (e) => {
            if (isDragging) updateFromEvent(e);
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Touch support
        stage.addEventListener('touchstart', (e) => {
            isDragging = true;
            updateFromEvent(e);
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (isDragging) updateFromEvent(e);
        }, { passive: true });

        window.addEventListener('touchend', () => {
            isDragging = false;
        });
    }

    function setSliderPosition(percent) {
        const handle = document.getElementById('slider-handle');
        const genLayer = document.getElementById('comparison-generated-layer');
        if (handle) handle.style.left = `${percent}%`;
        if (genLayer) genLayer.style.clipPath = `polygon(0 0, ${percent}% 0, ${percent}% 100%, 0 100%)`;
    }

    /**
     * Save visualization locally and trigger download
     */
    function saveVisualizationImage() {
        if (!generatedImageBase64) return;

        const link = document.createElement('a');
        link.href = generatedImageBase64;
        link.download = `Nivaraa-Living-${selectedProduct ? selectedProduct.name : 'Custom'}-Room-Concept.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Save metadata to localStorage
        const saved = JSON.parse(localStorage.getItem('nivaraa_room_visualizations') || '[]');
        saved.unshift({
            id: Date.now(),
            productName: selectedProduct.name,
            color: selectedColor.name,
            style: selectedStyle.name,
            date: new Date().toLocaleDateString()
        });
        localStorage.setItem('nivaraa_room_visualizations', JSON.stringify(saved.slice(0, 10)));
    }

    /**
     * WhatsApp consultation link with room context
     */
    function updateConsultLink() {
        const consultBtn = document.getElementById('btn-visualizer-consult');
        if (!consultBtn) return;

        const prodName = selectedProduct ? selectedProduct.name : 'Bespoke Piece';
        const msg = [
            `*NIVARAA LIVING — ROOM VISUALIZATION CONSULTATION*`,
            `----------------------------------------`,
            `*Selected Piece:* ${prodName}`,
            `*Upholstery / Color:* ${selectedColor.name} (${selectedColor.texture})`,
            `*Room Interior Style:* ${selectedStyle.name}`,
            `----------------------------------------`,
            `Hello Shrinivas, I used the Nivaraa AI Room Visualizer for my home and would like to arrange an in-person showroom consultation at Creaticity Mall with my room dimensions.`
        ].join('\n');

        consultBtn.href = `https://wa.me/919146189933?text=${encodeURIComponent(msg)}`;
    }

})();
