/**
 * NIVARAA LIVING — SHOWROOM EXPERIENCE & APPOINTMENT BOOKING
 * Creaticity Mall Experience Center Consultation Scheduler
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        injectBookingModalDOM();
        bindShowroomButton();
    });

    function injectBookingModalDOM() {
        if (document.getElementById('booking-modal')) return;

        const overlay = document.createElement('div');
        overlay.id = 'booking-modal';
        overlay.className = 'booking-modal-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Book a Showroom Consultation');

        overlay.innerHTML = `
            <div class="booking-modal-box">
                
                <header class="booking-header">
                    <div>
                        <span class="booking-tag">Private Atelier Appointment</span>
                        <h3 class="booking-heading">Reserve Showroom Consultation</h3>
                    </div>
                    <button class="search-close-btn" id="booking-close-btn" aria-label="Close Booking">&times;</button>
                </header>

                <form id="booking-form" class="booking-form">
                    <div class="booking-body" id="booking-form-body">
                        
                        <div class="booking-field-row">
                            <div class="booking-field-group">
                                <label for="book-name">Full Name *</label>
                                <input type="text" id="book-name" class="booking-input" placeholder="e.g. Ar. Priya Sharma" required>
                            </div>
                            <div class="booking-field-group">
                                <label for="book-phone">Phone / WhatsApp *</label>
                                <input type="tel" id="book-phone" class="booking-input" placeholder="e.g. 098765 43210" required>
                            </div>
                        </div>

                        <div class="booking-field-row">
                            <div class="booking-field-group">
                                <label for="book-date">Preferred Date *</label>
                                <input type="date" id="book-date" class="booking-input" required>
                            </div>
                            <div class="booking-field-group">
                                <label for="book-time">Visiting Hours Slot *</label>
                                <select id="book-time" class="booking-select" required>
                                    <option value="11:00 AM – 1:00 PM">11:00 AM – 1:00 PM (Morning)</option>
                                    <option value="2:00 PM – 4:00 PM">2:00 PM – 4:00 PM (Afternoon)</option>
                                    <option value="4:00 PM – 6:30 PM" selected>4:00 PM – 6:30 PM (Evening)</option>
                                    <option value="6:30 PM – 9:00 PM">6:30 PM – 9:00 PM (Late Atelier)</option>
                                </select>
                            </div>
                        </div>

                        <div class="booking-field-group">
                            <label for="book-collection">Collection of Interest</label>
                            <select id="book-collection" class="booking-select">
                                <option value="Bespoke Sofas & Sectionals">Bespoke Sofas & Sectionals</option>
                                <option value="Calacatta Marble Dining Tables">Calacatta Marble Dining Tables</option>
                                <option value="Fluted Master Beds">Fluted Master Beds</option>
                                <option value="Motorized Luxury Recliners">Motorized Luxury Recliners</option>
                                <option value="Artisanal Chairs & T-Poy">Artisanal Chairs & T-Poy</option>
                                <option value="Full Residence Architectural Curation">Full Residence Architectural Curation</option>
                            </select>
                        </div>

                        <div class="booking-checkbox-row">
                            <input type="checkbox" id="book-architect">
                            <label for="book-architect" class="booking-checkbox-label">I am an Interior Designer or Architect coordinating a client commission.</label>
                        </div>

                        <div class="booking-showroom-proof">
                            <strong>Creaticity Mall Experience Center</strong>
                            Lower Ground Floor, Creaticity Mall, Airport Road, Opposite Golf Course, Yerawada, Pune 411006.<br>
                            Visiting Hours: Monday – Sunday: 11:00 AM – 9:00 PM • Concierge: Shrinivas (091461 89933)
                        </div>

                    </div>

                    <!-- Confirmation View -->
                    <div class="booking-success-view" id="booking-success-view">
                        <div class="success-badge-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <h3 class="success-title">Consultation Reserved</h3>
                        <span class="success-ref-pill" id="booking-success-ref">REF: NIV-APT-0000</span>
                        <p class="success-desc" id="booking-success-desc">
                            Thank you. Shrinivas at our Creaticity Mall Atelier has been notified. We look forward to welcoming you for your bespoke furniture consultation.
                        </p>
                        <div class="success-actions">
                            <a href="#" class="btn-whatsapp-quote" id="booking-wa-confirm-btn" target="_blank" rel="noopener noreferrer">
                                <span>Confirm on WhatsApp</span>
                            </a>
                            <a href="https://maps.google.com/?q=Nivaraa+Living+Pune" target="_blank" class="btn-shepel-outline" style="padding: 14px 20px; font-size: 12px;">
                                <span>Get Directions</span>
                            </a>
                        </div>
                    </div>

                    <footer class="booking-footer" id="booking-form-footer">
                        <span style="font-size: 11px; color: var(--shepel-muted);">No booking fee • Personalized 1-on-1 consultation</span>
                        <button type="submit" class="btn-booking-submit">
                            <span>Confirm Reservation</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </button>
                    </footer>
                </form>

            </div>
        `;

        document.body.appendChild(overlay);

        // Min date today
        const dateInput = document.getElementById('book-date');
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        dateInput.value = today;

        document.getElementById('booking-close-btn').addEventListener('click', closeBookingModal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeBookingModal();
        });

        document.getElementById('booking-form').addEventListener('submit', handleBookingSubmit);
    }

    function bindShowroomButton() {
        const showroomActions = document.querySelector('.showroom-actions');
        if (!showroomActions || document.getElementById('btn-open-booking-modal')) return;

        const btn = document.createElement('button');
        btn.id = 'btn-open-booking-modal';
        btn.type = 'button';
        btn.className = 'btn-shepel-primary';
        btn.style.background = 'var(--shepel-gold)';
        btn.style.borderColor = 'var(--shepel-gold)';
        btn.style.color = '#FFFFFF';
        btn.innerText = 'Book Consultation';

        btn.addEventListener('click', openBookingModal);
        showroomActions.appendChild(btn);
    }

    function openBookingModal() {
        // Reset view
        document.getElementById('booking-form-body').style.display = 'flex';
        document.getElementById('booking-form-footer').style.display = 'flex';
        document.getElementById('booking-success-view').classList.remove('active');

        const overlay = document.getElementById('booking-modal');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeBookingModal() {
        const overlay = document.getElementById('booking-modal');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    async function handleBookingSubmit(e) {
        e.preventDefault();

        const name = document.getElementById('book-name').value.trim();
        const phone = document.getElementById('book-phone').value.trim();
        const date = document.getElementById('book-date').value;
        const time = document.getElementById('book-time').value;
        const collection = document.getElementById('book-collection').value;
        const isArchitect = document.getElementById('book-architect').checked;

        const refCode = `NIV-APT-${Date.now().toString(36).toUpperCase()}`;

        const appointmentData = {
            refCode,
            name,
            phone,
            date,
            time,
            collection,
            isArchitect,
            timestamp: new Date().toISOString()
        };

        // Save locally
        const existing = JSON.parse(localStorage.getItem('nivaraa_consultation_bookings') || '[]');
        existing.unshift(appointmentData);
        localStorage.setItem('nivaraa_consultation_bookings', JSON.stringify(existing.slice(0, 10)));

        // Send to server endpoint
        fetch('/api/book-appointment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appointmentData)
        }).catch(() => {});

        // Pre-fill WhatsApp confirmation message
        const waMsg = [
            `*NIVARAA LIVING — SHOWROOM CONSULTATION RESERVATION*`,
            `----------------------------------------`,
            `*Booking Reference:* ${refCode}`,
            `*Client:* ${name} ${isArchitect ? '(Architect / Designer)' : ''}`,
            `*Phone:* ${phone}`,
            `*Date:* ${date}`,
            `*Time Slot:* ${time}`,
            `*Collection of Interest:* ${collection}`,
            `----------------------------------------`,
            `Hello Shrinivas, I have booked a showroom consultation at Creaticity Mall. Please confirm slot availability.`
        ].join('\n');

        document.getElementById('booking-wa-confirm-btn').href = `https://wa.me/919146189933?text=${encodeURIComponent(waMsg)}`;
        document.getElementById('booking-success-ref').innerText = `BOOKING REF: ${refCode}`;
        document.getElementById('booking-success-desc').innerText = `Your consultation on ${date} (${time}) for "${collection}" has been reserved. Our team at Creaticity Mall will welcome you.`;

        // Switch view to confirmation
        document.getElementById('booking-form-body').style.display = 'none';
        document.getElementById('booking-form-footer').style.display = 'none';
        document.getElementById('booking-success-view').classList.add('active');
    }

    window.openAppointmentModal = openBookingModal;

})();
