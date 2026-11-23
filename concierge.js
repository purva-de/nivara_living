/**
 * NIVARAA LIVING — AI DESIGN CONCIERGE ("DESIGN CONCIERGE")
 * Grounded in authentic Nivaraa catalog & craftsmanship data
 * In-Chat Real Product Recommendations & WhatsApp Handoff
 */

(function () {
    'use strict';

    let furnitureCatalog = [];
    let chatHistory = [];
    let isOpen = false;

    const STARTER_PROMPTS = [
        'Recommend an architectural curved sofa',
        'Show me motorized luxury recliners',
        'What fabrics are best for easy maintenance?',
        'Pair a coffee table with the Calacatta dining table',
        'Tell me about Burma Teak plinths & Sal wood',
        'Book a showroom consultation at Creaticity'
    ];

    document.addEventListener('DOMContentLoaded', async () => {
        await loadCatalog();
        injectConciergeDOM();
        bindConciergeEvents();
    });

    async function loadCatalog() {
        if (window.allFurniturePieces && window.allFurniturePieces.length) {
            furnitureCatalog = window.allFurniturePieces;
            return;
        }
        try {
            const res = await fetch('curated_all_furniture.json');
            furnitureCatalog = await res.json();
            window.allFurniturePieces = furnitureCatalog;
        } catch (e) {
            console.error('Failed to load furniture catalog in concierge:', e);
        }
    }

    function injectConciergeDOM() {
        if (document.getElementById('concierge-trigger')) return;

        // Floating Trigger
        const trigger = document.createElement('button');
        trigger.id = 'concierge-trigger';
        trigger.className = 'concierge-floating-trigger';
        trigger.setAttribute('aria-label', 'Open Nivaraa Design Concierge');
        trigger.innerHTML = `
            <div class="concierge-emblem-disc">
                <span class="concierge-pulse-ring"></span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
            </div>
            <div class="concierge-trigger-text">
                <span class="concierge-trigger-title">Design Concierge</span>
                <span class="concierge-trigger-subtitle">Atelier AI Assistant</span>
            </div>
        `;

        // Chat Panel
        const panel = document.createElement('aside');
        panel.id = 'concierge-panel';
        panel.className = 'concierge-panel';
        panel.setAttribute('role', 'complementary');
        panel.setAttribute('aria-label', 'Nivaraa Design Concierge Chat');

        panel.innerHTML = `
            <!-- Panel Header -->
            <header class="concierge-panel-header">
                <div class="concierge-header-info">
                    <div class="concierge-avatar">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                    </div>
                    <div class="concierge-header-titles">
                        <h3 class="concierge-panel-title">Nivaraa Concierge</h3>
                        <span class="concierge-panel-status">Bespoke Atelier Advisor • Pune</span>
                    </div>
                </div>
                <div class="concierge-header-actions">
                    <button class="concierge-header-btn" id="concierge-close-btn" aria-label="Minimize Concierge">&times;</button>
                </div>
            </header>

            <!-- WhatsApp Handoff Bar -->
            <a href="https://wa.me/919146189933?text=Hello%20Shrinivas,%20I%20am%20exploring%20Nivaraa%20Living%20furniture%20and%20would%20like%20expert%20assistance." target="_blank" class="concierge-wa-handoff" id="concierge-wa-handoff-bar">
                <span>Direct Showroom Handoff: Chat with Shrinivas on WhatsApp</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </a>

            <!-- Messages Area -->
            <div class="concierge-messages-area" id="concierge-messages-area">
                <div class="concierge-msg concierge-msg-assistant">
                    <div class="msg-bubble">
                        Welcome to Nivaraa Living. I am your atelier concierge, grounded in our bespoke handcrafted collections, architectural joinery, and 500+ upholstery swatches.
                        <br><br>
                        How may I assist you with your living space or custom commission today?
                    </div>
                    <span class="msg-time">Atelier AI</span>
                </div>
            </div>

            <!-- Starter Prompts Tray -->
            <div class="concierge-prompts-tray" id="concierge-prompts-tray"></div>

            <!-- Input Bar -->
            <form class="concierge-input-form" id="concierge-input-form">
                <input type="text" id="concierge-input" class="concierge-text-input" placeholder="Ask about sofas, teak framing, swatches..." autocomplete="off">
                <button type="submit" class="concierge-send-btn" aria-label="Send message">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </form>
        `;

        document.body.appendChild(trigger);
        document.body.appendChild(panel);

        renderStarterPrompts();
    }

    function renderStarterPrompts() {
        const tray = document.getElementById('concierge-prompts-tray');
        tray.innerHTML = '';
        STARTER_PROMPTS.forEach(text => {
            const chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'prompt-chip';
            chip.innerText = text;
            chip.addEventListener('click', () => {
                document.getElementById('concierge-input').value = text;
                handleUserSubmit(text);
            });
            tray.appendChild(chip);
        });
    }

    function bindConciergeEvents() {
        const trigger = document.getElementById('concierge-trigger');
        const panel = document.getElementById('concierge-panel');
        const closeBtn = document.getElementById('concierge-close-btn');
        const form = document.getElementById('concierge-input-form');

        trigger.addEventListener('click', toggleConcierge);
        closeBtn.addEventListener('click', toggleConcierge);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = document.getElementById('concierge-input');
            const val = input.value.trim();
            if (val) {
                handleUserSubmit(val);
                input.value = '';
            }
        });
    }

    function toggleConcierge() {
        isOpen = !isOpen;
        const panel = document.getElementById('concierge-panel');
        if (panel) panel.classList.toggle('active', isOpen);
    }

    function appendUserMessage(text) {
        const area = document.getElementById('concierge-messages-area');
        const msg = document.createElement('div');
        msg.className = 'concierge-msg concierge-msg-user';
        msg.innerHTML = `
            <div class="msg-bubble">${escapeHtml(text)}</div>
            <span class="msg-time">You</span>
        `;
        area.appendChild(msg);
        area.scrollTop = area.scrollHeight;
    }

    function appendAssistantMessage(html, recommendedItems = []) {
        const area = document.getElementById('concierge-messages-area');
        const msg = document.createElement('div');
        msg.className = 'concierge-msg concierge-msg-assistant';

        let cardsHtml = '';
        if (recommendedItems && recommendedItems.length) {
            recommendedItems.slice(0, 3).forEach(item => {
                cardsHtml += `
                    <div class="concierge-product-card">
                        <img src="${item.img_normal}" alt="${item.name}" class="concierge-product-img">
                        <div class="concierge-product-content">
                            <span class="concierge-product-tag">${item.category_label}</span>
                            <h4 class="concierge-product-title">${item.name}</h4>
                            <p class="concierge-product-specs">${item.specs}</p>
                            <span class="concierge-product-dim">${item.dimensions}</span>
                            <div class="concierge-product-actions">
                                <button class="btn-card-details" data-id="${item.id}" style="width: 100%; text-align: center;">View Details & Specifications</button>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        msg.innerHTML = `
            <div class="msg-bubble">
                ${html}
                ${cardsHtml}
            </div>
            <span class="msg-time">Atelier AI</span>
        `;

        area.appendChild(msg);

        // Bind card buttons
        msg.querySelectorAll('.btn-card-details').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const piece = furnitureCatalog.find(x => x.id === id);
                if (piece && window.openSpecModal) {
                    window.openSpecModal(piece);
                }
            });
        });

        area.scrollTop = area.scrollHeight;
    }

    function handleUserSubmit(query) {
        appendUserMessage(query);

        // Analyze query with intelligent catalog grounding engine
        setTimeout(() => {
            processGroundedQuery(query.toLowerCase());
        }, 350);
    }

    function processGroundedQuery(q) {
        let responseText = '';
        let matchedItems = [];

        // 1. Curved or organic sofas
        if (q.includes('curved') || q.includes('organic') || q.includes('arc') || q.includes('sculptural sofa')) {
            matchedItems = furnitureCatalog.filter(p => ['berlin-sofa', 'arturo-sofa', 'sierra-sofa', 'forte-curved'].includes(p.id));
            responseText = `For organic, architectural curves, Nivaraa crafts stunning monolithic arcs. The <strong>Berlin</strong> features a cocooning silhouette with contoured armrests, the <strong>Sierra</strong> makes a bold statement with its crescent arc and chrome sphere feet, and the <strong>Arturo</strong> offers a grand curved sectional chaise:`;
        }
        // 2. Sectional or modular
        else if (q.includes('sectional') || q.includes('modular') || q.includes('l-shape') || q.includes('corner')) {
            matchedItems = furnitureCatalog.filter(p => ['anton-sectional', 'arturo-sofa', 'taurus-modular'].includes(p.id));
            responseText = `Our modular sectionals are built on seasoned Sal wood framing and high-resilience 40-density foam with memory down toppers. Here are our flagship sectionals:`;
        }
        // 3. Sofas in general
        else if (q.includes('sofa') || q.includes('couch') || q.includes('seating') || q.includes('living room')) {
            matchedItems = furnitureCatalog.filter(p => p.category === 'sofas');
            responseText = `Nivaraa crafts each sofa to your millimeter specifications in over 500+ fabrics and Italian aniline leathers. Here are highlights from our sofa collection:`;
        }
        // 4. Dining tables
        else if (q.includes('dining') || q.includes('marble') || q.includes('calacatta') || q.includes('table')) {
            matchedItems = furnitureCatalog.filter(p => p.category === 'dining');
            responseText = `Our architectural dining tables pair bookmatched natural Italian Calacatta marble slabs with fluted Burma Teak pedestal plinths:`;
        }
        // 5. Recliners
        else if (q.includes('recliner') || q.includes('motorized') || q.includes('cinema') || q.includes('lounge chair')) {
            matchedItems = furnitureCatalog.filter(p => p.category === 'recliners');
            responseText = `Our luxury motorized recliners feature whisper-quiet German dual-motor mechanisms with independent headrest and zero-gravity footrest control:`;
        }
        // 6. Accent Chairs
        else if (q.includes('chair') || q.includes('armchair') || q.includes('wing')) {
            matchedItems = furnitureCatalog.filter(p => p.category === 'chairs');
            responseText = `Our occasional chairs combine ergonomic tailored backs with sculptural timber and swivel plinths:`;
        }
        // 7. Master Beds
        else if (q.includes('bed') || q.includes('bedroom') || q.includes('headboard')) {
            matchedItems = furnitureCatalog.filter(p => p.category === 'beds');
            responseText = `Our master beds feature architectural fluted velvet headboards, hydraulic storage lifts, and seasoned hardwood slat platforms:`;
        }
        // 8. Coffee Tables & T-Poy
        else if (q.includes('coffee') || q.includes('tpoy') || q.includes('t-poy') || q.includes('side table')) {
            matchedItems = furnitureCatalog.filter(p => p.category === 'coffee_tables' || p.category === 'tpoy');
            responseText = `Pair your seating with our honed Italian beige travertine and smoked European walnut nesting tables or solid Burma Teak sculptural T-Poys:`;
        }
        // 9. Materials & Fabrics advice
        else if (q.includes('fabric') || q.includes('material') || q.includes('leather') || q.includes('boucle') || q.includes('pet') || q.includes('wood') || q.includes('teak')) {
            responseText = `
                <strong>Artisanal Materials at Nivaraa Living:</strong><br><br>
                • <strong>Seasoned Sal Wood & Burma Teak:</strong> Kiln-dried internal timber structures prevent warping in India's changing climates.<br>
                • <strong>Heavy Textured Bouclé:</strong> Tactile, cozy, and stain-guarded with high Martindale rub counts.<br>
                • <strong>Italian Aniline Leather:</strong> Full-grain top layer that breathes naturally and develops a rich patina over decades.<br>
                • <strong>Ergonomic Core:</strong> 40-density high-resilience foam layered with genuine memory down for cloud-like sinking comfort.<br><br>
                You can explore these material specifications in our atelier gallery or visit our showroom to feel the physical swatches.
            `;
            matchedItems = furnitureCatalog.filter(p => ['anton-sectional', 'antalia-sofa'].includes(p.id));
        }
        // 10. Showroom & appointment inquiry
        else if (q.includes('showroom') || q.includes('visit') || q.includes('address') || q.includes('location') || q.includes('hours') || q.includes('pune') || q.includes('creaticity')) {
            responseText = `
                <strong>Nivaraa Living Creaticity Experience Center:</strong><br><br>
                📍 <strong>Location:</strong> Lower Ground Floor, Creaticity Mall, Airport Road, Opposite Golf Course, Shastrinagar, Yerawada, Pune 411006.<br>
                🕒 <strong>Visiting Hours:</strong> Monday – Sunday: 11:00 AM – 9:00 PM.<br>
                📞 <strong>Concierge Direct:</strong> 091461 89933 (Shrinivas)<br><br>
                Would you like me to connect you directly on WhatsApp to reserve a private design consultation?
            `;
        }
        // General fallback
        else {
            matchedItems = [furnitureCatalog[0], furnitureCatalog[1], furnitureCatalog[7]];
            responseText = `At Nivaraa Living, every piece is individually engineered to your architectural requirements. Here are a few curated masterpieces to explore:`;
        }

        appendAssistantMessage(responseText, matchedItems);

        // Update WhatsApp Handoff bar with context
        const waBar = document.getElementById('concierge-wa-handoff-bar');
        if (waBar) {
            const contextText = encodeURIComponent(`Hello Shrinivas, I was speaking with the Nivaraa AI Concierge about: "${q}". Please advise on options and consultation at Creaticity.`);
            waBar.href = `https://wa.me/919146189933?text=${contextText}`;
        }
    }

    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

})();
