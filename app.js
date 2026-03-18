import { trip, travelers, flights, train, hotels, contacts, reservations } from './data/trip.js';
import { itinerary } from './data/itinerary.js';
import { recommendations, categories } from './data/discover.js';
import { financials, decisions } from './data/admin.js';

const data = { trip, travelers, flights, train, hotels, contacts, reservations, itinerary, recommendations, categories, financials, decisions };

function loadJson(key, fallback = []) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

let approvedSubmissions = loadJson('lyon80_approved', []);
let pendingSubmissions = loadJson('lyon80_pending', []);
let mergedRecommendations = [...recommendations, ...approvedSubmissions.filter(item => item.kind === 'place')];
let mergedReservations = [...reservations, ...approvedSubmissions.filter(item => item.kind === 'restaurant')];

const adminToggle = document.getElementById('admin-toggle');
const adminModal = document.getElementById('admin-modal');
const adminPassword = document.getElementById('admin-password');
const adminError = document.getElementById('admin-error');
const adminSubmit = document.getElementById('admin-submit');
const adminCancel = document.getElementById('admin-cancel');
const navTabs = document.getElementById('nav-tabs');

const ADMIN_PASSWORD = 'lyon80admin';

function fmtDate(dateStr) {
  return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function statusClass(status) {
  if (!status) return 'status';
  return `status ${String(status).toLowerCase()}`;
}

function card(title, body, subtitle = '') {
  return `<article class="card">${subtitle ? `<div class="label">${subtitle}</div>` : ''}<h3>${title}</h3>${body}</article>`;
}

function overviewHTML() {
  return `
    <div class="section-head">
      <h2>Overview</h2>
      <p>${data.trip.occasion} · ${data.trip.dates.display}</p>
    </div>
    <div class="grid two">
      ${card('Trip at a glance', `
        <div class="list">
          <div class="key-value"><div class="label">Destinations</div><div>Edinburgh · London</div></div>
          <div class="key-value"><div class="label">Travelers</div><div>${data.travelers.length} guests</div></div>
          <div class="key-value"><div class="label">Nights</div><div>${data.trip.nights.total} total · ${data.trip.nights.edinburgh} Edinburgh · ${data.trip.nights.london} London</div></div>
        </div>
        <div class="badges">${data.trip.style_tags.map(tag => `<span class="badge">${tag}</span>`).join('')}</div>
      `, 'Trip')}
      ${card('Primary contacts', `
        <div class="list">
          <div><strong>${data.trip.planner.name}</strong><div class="muted">Planner · <a href="mailto:${data.trip.planner.email}">${data.trip.planner.email}</a></div></div>
          <div><strong>${data.trip.primary_guest.name}</strong><div class="muted">Primary guest · <a href="mailto:${data.trip.primary_guest.email}">${data.trip.primary_guest.email}</a></div></div>
        </div>
      `, 'People')}
    </div>
    <div class="grid two" style="margin-top:1rem;">
      ${card('Edinburgh', `<div class="muted">4 nights · Fraser Suites Edinburgh</div><p class="small" style="margin-top:.75rem;">Castle access, Royal Mile, Glamis Castle, St Andrews, heritage and whisky energy.</p>`)}
      ${card('London', `<div class="muted">5 nights · Four Seasons Tower Bridge</div><p class="small" style="margin-top:.75rem;">VIP museum access, Tower of London, Borough Market, Windsor, Hampton Court, iconic dining.</p>`)}
    </div>
    <div class="card admin-only" style="margin-top:1rem;">
      <div class="label">Admin Snapshot</div>
      <h3>Financial Summary</h3>
      <div class="grid two" style="margin-top:0.75rem;">
        <div>NoteWorthy touring: £${data.financials.noteworthy.touring_total.amount.toLocaleString()}</div>
        <div>Transport add-on: £${data.financials.noteworthy.transport_addon.amount.toLocaleString()}</div>
        <div>London hotels cash value: $${data.financials.hotel_totals.london_cash_value.toLocaleString()}</div>
        <div>Chase points redeemed: ${data.financials.hotel_totals.london_points.toLocaleString()}</div>
      </div>
    </div>
  `;
}

function renderTimelineItem(item) {
  return `<div class="timeline-item">
    <div class="timeline-row">
      <div class="timeline-time">${item.time || 'TBD'}</div>
      <div class="timeline-dot ${item.type || ''}"></div>
      <div class="timeline-content">
        <strong>${item.name}</strong>
        ${item.desc ? `<div class="small muted">${item.desc}</div>` : ''}
      </div>
    </div>
  </div>`;
}

function itineraryHTML() {
  return `
    <div class="section-head"><h2>Itinerary</h2><p>The highest-value tab for guests: day-by-day timing, movement, and what’s still undecided.</p></div>
    <div class="grid">
      ${data.itinerary.map(day => `
        <article class="card">
          <div class="row">
            <div>
              <div class="label">${day.display_date}</div>
              <h3>${day.title}</h3>
              <div class="muted">${day.city}${day.overnight ? ` · Overnight: ${day.overnight}` : ''}</div>
            </div>
            <div class="${statusClass(day.status)}">${day.status}</div>
          </div>
          <div style="margin-top:0.85rem;" class="list">
            ${day.items.map(renderTimelineItem).join('')}
          </div>
          ${day.decision ? `
            <div class="option-list">
              ${day.decision.options.map(opt => `<div class="option-card"><strong>${opt.label}. ${opt.name}</strong><div class="small muted">${opt.desc}</div></div>`).join('')}
            </div>
          ` : ''}
        </article>
      `).join('')}
    </div>
  `;
}

function detailedFlightLine(f) {
  if (f.flight_num === 'VS142') return 'Departs LAX Fri Apr 24 · 7:35pm → Arrives LHR Sat Apr 25 · 2:00pm · Upper Class · New aircraft with new Upper Class seats · Ref FE4FE4 · Meet & Assist Gold Service confirmed';
  if (f.flight_num === 'BA1460') return 'Departs LHR T5 Sat Apr 25 · 6:20pm → Arrives EDI · 7:45pm · Ref YUE8U4';
  if (f.flight_num === 'VS7') return 'Departs LHR Mon May 4 · 10:50am → Arrives LAX · 2:05pm · Upper Class · Ref FFHY6F · VIP departure greeter included';
  return `${f.origin.code} → ${f.destination.code}`;
}

function flightsHTML() {
  const seatRows = data.travelers.map(t => `
    <tr>
      <td><strong>${t.name}</strong></td>
      <td><span class="booking-chip ${t.booking_ref === 'FE4FE4' ? '' : 'alt'}">${t.booking_ref}</span></td>
      <td>${t.seat_outbound}</td>
      <td>${t.seat_return}</td>
    </tr>
  `).join('');

  return `
    <div class="section-head"><h2>Flights & Transport</h2><p>Flights, booking references, train movement, and a clear seat view for the family.</p></div>
    <div class="flight-grid">
      <div class="grid two">
        ${data.flights.map(f => card(`${f.airline} ${f.flight_num}`, `
          <div><strong>${f.origin.code} → ${f.destination.code}</strong></div>
          <div class="small muted" style="margin-top:.55rem;">${detailedFlightLine(f)}</div>
          ${f.alt_refs?.length ? `<div class="small" style="margin-top:.65rem;"><strong>Separate refs:</strong> ${f.alt_refs.map(r => `${r.traveler} (${r.ref})`).join(' · ')}</div>` : ''}
        `, f.type)).join('')}
        ${card('LNER Train', `<div><strong>${data.train.route}</strong></div><div class="muted">${data.train.date} · ${data.train.departs} → ${data.train.arrives}</div><div class="small">Coach ${data.train.coach} · Seats ${data.train.seats.join(', ')}</div><p class="small muted" style="margin-top:.75rem;">${data.train.notes}</p>`, 'Rail')}
      </div>
      <article class="card">
        <div class="label">Seat Assignments</div>
        <h3>Outbound + Return Seating</h3>
        <p class="small muted" style="margin-top:.4rem;">Sarah and Allyson are on separate booking references from the main family booking.</p>
        <div class="seat-table-wrapper">
          <table class="seat-table">
            <thead>
              <tr><th>Traveler</th><th>Booking Ref</th><th>To London</th><th>To LAX</th></tr>
            </thead>
            <tbody>${seatRows}</tbody>
          </table>
        </div>
      </article>
    </div>
  `;
}

function hotelsHTML() {
  return `
    <div class="section-head"><h2>Hotels</h2><p>Stay details guests will need on the ground: where, when, rooms, and how to contact the properties.</p></div>
    <div class="hotel-grid">
      ${data.hotels.map(h => {
        const adminHotel = data.financials.hotels.find(item => item.property.includes(h.city) || item.property.includes(h.name.split(' ')[0]));
        return `
          <article class="card">
            <div class="label">${h.city}</div>
            <h3>${h.name}</h3>
            <div class="small inline-links" style="margin-top:.45rem;">
              <a href="${h.maps_url}" target="_blank">Map</a>
              <a href="${h.website}" target="_blank">Website</a>
              ${h.instagram ? `<a href="${h.instagram}" target="_blank">Instagram</a>` : ''}
              ${h.phone ? `<a href="tel:${(h.phone||'').replace(/\s+/g,'')}">${h.phone}</a>` : ''}
            </div>
            <div class="small muted" style="margin-top:.6rem;">Check-in ${h.check_in} · Check-out ${h.check_out} · ${h.nights} nights</div>
            ${h.free_cancellation_until ? `<div class="small" style="margin-top:.5rem;"><strong>Free cancellation until Tue Apr 28, 2026 · 12:00am property local time</strong></div>` : ''}
            <div class="hotel-room-list">
              ${h.rooms.map(r => `<div class="hotel-room"><strong>${r.type}</strong><div class="small muted">Conf ${r.conf}</div>${r.beds ? `<div class="small muted">${r.beds}</div>` : ''}${r.description ? `<div class="small muted">${r.description}</div>` : ''}${r.room_url ? `<div class="small"><a href="${r.room_url}" target="_blank">Room details</a></div>` : ''}</div>`).join('')}
            </div>
            ${h.benefits?.length ? `<div class="list" style="margin-top:.8rem;">${h.benefits.map(b => `<div class="small">• ${b}</div>`).join('')}</div>` : ''}
            <div class="card admin-only" style="margin-top:1rem; background: rgba(201,168,76,0.08); border: 1px solid rgba(201,168,76,0.2);">
              <div class="label">Admin Cost Overlay</div>
              <div class="small muted">Booked via: ${h.booked_via}</div>
              ${adminHotel ? `<div class="small" style="margin-top:.5rem;">Cash value: ${adminHotel.cash_value ? `$${adminHotel.cash_value.toLocaleString()}` : 'TBD'}</div><div class="small">Points: ${adminHotel.points ? adminHotel.points.toLocaleString() : 'TBD'}</div>` : '<div class="small">Cash value / points: TBD</div>'}
            </div>
          </article>
        `;
      }).join('')}
    </div>
  `;
}

function initials(name) {
  return name.split(' ').map(part => part[0]).slice(0, 2).join('');
}

function travelersHTML() {
  return `
    <div class="section-head"><h2>Travelers</h2><p>Who’s on the trip, who’s on which booking reference, and who matters for specific decisions.</p></div>
    <div class="traveler-grid grid three">
      ${data.travelers.map(t => card(t.name, `
        <div class="traveler-avatar">${initials(t.name)}</div>
        <div class="muted">${t.role} · ${t.relationship}</div>
        <div class="small" style="margin-top:.5rem;">Age ${t.age}</div>
        <div class="small">Booking ref <span class="booking-chip ${t.booking_ref === 'FE4FE4' ? '' : 'alt'}">${t.booking_ref}</span></div>
        <div class="small">Outbound ${t.seat_outbound} · Return ${t.seat_return}</div>
        ${t.notes ? `<p class="small muted" style="margin-top:.75rem;">${t.notes}</p>` : ''}
      `)).join('')}
    </div>
  `;
}

function groupContacts() {
  return {
    'NoteWorthy Team': data.contacts.filter(c => c.category === 'tour_operator'),
    'Guides': data.contacts.filter(c => c.category === 'guide'),
    'Emergency': data.contacts.filter(c => c.category === 'emergency'),
    'Hotels': data.hotels.map(h => ({ name: h.name, role: 'Hotel', org: h.city, phone: h.phone, email: null, website: h.website, notes: h.address }))
  };
}

function contactsHTML() {
  const groups = groupContacts();
  return `
    <div class="section-head"><h2>Contacts & Guides</h2><p>Grouped contact directory for operators, guides, hotels, and emergency support.</p></div>
    ${Object.entries(groups).map(([label, items]) => `
      <div style="margin-bottom:1.25rem;">
        <div class="label" style="margin-bottom:.65rem;">${label}</div>
        <div class="grid two">
          ${items.map(c => card(c.name, `
            <div class="muted">${c.role || ''}${c.org ? ` · ${c.org}` : ''}</div>
            <div class="small inline-links" style="margin-top:.6rem;">
              ${c.phone ? `<a href="tel:${c.phone}">${c.phone}</a>` : ''}
              ${c.email ? `<a href="mailto:${c.email}">${c.email}</a>` : ''}
              ${c.website ? `<a href="${c.website}" target="_blank">Website</a>` : ''}
            </div>
            <p class="small muted" style="margin-top:.75rem;">${c.category === 'guide' ? 'TBD — to be assigned by NoteWorthy.' : (c.notes || '')}</p>
          `)).join('')}
        </div>
      </div>
    `).join('')}
  `;
}

function reservationsHTML() {
  return `
    <div class="section-head"><h2>Reservations</h2><p>Dining tracker for the trip. Reservations are being coordinated via Four Seasons concierge.</p></div>
    <div class="grid two">
      ${mergedReservations.map(r => card(r.restaurant, `
        <div class="muted">${r.city}${r.area ? ` · ${r.area}` : ''}</div>
        <div class="${statusClass(r.status)}" style="margin-top:.5rem;">${r.status}</div>
        <div class="small" style="margin-top:.6rem;">Guests: ${r.guests}</div>
        ${r.address ? `<div class="small"><a href="${r.maps_url}" target="_blank">${r.address}</a></div>` : ''}
        ${r.phone ? `<div class="small"><a href="tel:${r.phone}">${r.phone}</a></div>` : ''}
        ${r.website ? `<div class="small"><a href="${r.website}" target="_blank">Website</a></div>` : ''}
        <p class="small muted" style="margin-top:.75rem;">${r.notes}</p>
        <div class="small" style="margin-top:.75rem;"><strong>Booking path:</strong> ${r.booked_via || 'Four Seasons concierge'}</div>
      `)).join('')}
    </div>
  `;
}

function discoverHTML() {
  const categoryOptions = data.categories.map(c => `<option value="${c.id}">${c.label}</option>`).join('');
  return `
    <div class="section-head"><h2>Discover</h2><p>The browse-heavy tab for free afternoons, dinner ideas, pubs, and day-trip inspiration.</p></div>
    <div class="filter-bar">
      <input id="discover-search" placeholder="Search recommendations" />
      <select id="discover-city"><option value="">All cities</option><option>Edinburgh</option><option>London</option><option>Day Trip</option></select>
      <select id="discover-category"><option value="">All categories</option>${categoryOptions}</select>
    </div>
    <div id="discover-list" class="grid two">
      ${mergedRecommendations.map(r => renderRecommendation(r)).join('')}
    </div>
  `;
}

function renderRecommendation(r) {
  return card(r.name, `
    <div class="muted">${r.city} · ${r.area || ''}</div>
    <div class="small" style="margin-top:.4rem;">${r.price || ''}${r.cuisine ? ` · ${r.cuisine}` : ''}</div>
    <p class="small muted" style="margin-top:.75rem;">${r.desc}</p>
    ${r.tags?.length ? `<div class="badges" style="margin-top:.75rem;">${r.tags.slice(0,4).map(tag => `<span class="badge">${tag}</span>`).join('')}</div>` : ''}
    <div class="toggle-row">
      <span class="toggle-pill">♡ Save</span>
      <span class="toggle-pill">✓ Visited</span>
    </div>
    <div class="small inline-links" style="margin-top:.8rem;">
      ${r.maps_url ? `<a href="${r.maps_url}" target="_blank">Map</a>` : ''}
      ${r.website ? `<a href="${r.website}" target="_blank">Website</a>` : ''}
      ${r.instagram ? `<a href="${r.instagram}" target="_blank">Instagram</a>` : ''}
    </div>
  `, r.category);
}

function decisionsHTML() {
  return `
    <div class="section-head"><h2>Open Decisions</h2><p>Admin-only planning questions still in motion.</p></div>
    <div class="grid">
      ${data.decisions.map(d => card(d.title, `
        <div class="${statusClass(d.status)}">${d.status}</div>
        ${d.note ? `<p class="small muted" style="margin-top:.6rem;">${d.note}</p>` : ''}
        ${d.options ? `<div class="list" style="margin-top:.75rem;">${d.options.map(o => `<div class="timeline-item small">${o}</div>`).join('')}</div>` : ''}
        <div style="margin-top:.9rem;">
          <div class="label">Resolution</div>
          <input type="text" placeholder="Mark can record the decision here" style="width:100%; margin-top:.35rem; padding:.75rem .9rem; border:1px solid rgba(26,39,68,0.12); border-radius:12px;" />
        </div>
      `, `Decision ${d.id}`)).join('')}
    </div>
  `;
}

function financialsHTML() {
  return `
    <div class="section-head"><h2>Financials</h2><p>Admin-only cost and points view for planning, savings, and decision support.</p></div>
    <div class="grid two">
      ${card('NoteWorthy', `
        <div class="list">
          <div>Touring total: £${data.financials.noteworthy.touring_total.amount.toLocaleString()} <span class="status confirmed">paid</span></div>
          <div>Transport add-on: £${data.financials.noteworthy.transport_addon.amount.toLocaleString()} <span class="status pending">pending</span></div>
          <div>Total if approved: £${data.financials.noteworthy.total_if_approved.amount.toLocaleString()}</div>
          <div class="small muted">Discrepancy flag: £${(data.financials.noteworthy.transport_addon.original_quote - data.financials.noteworthy.transport_addon.amount).toLocaleString()} gap vs original transport quote.</div>
        </div>
      `, 'NoteWorthy')}
      ${card('Hotels / Chase Travel', `
        <div class="list">
          <div>Fraser Suites Edinburgh — TBD</div>
          <div>Four Seasons Stay 1 — $43,719.59 / 2,185,979 pts</div>
          <div>Four Seasons Stay 2 — $9,077.99 / 453,899 pts</div>
          <div><strong>London total — $52,797.58 / 2,639,878 pts</strong></div>
          <div class="small muted">Booked via Chase Ultimate Rewards points. Cash value tracked for savings reference.</div>
        </div>
      `, 'Hotels')}
    </div>
    <div class="card" style="margin-top:1rem;">
      <div class="label">Upgrade Option</div>
      <h3>4BR Royal Tower Bridge Residence</h3>
      <div class="list" style="margin-top:.6rem;">
        <div>$56,742 / 2.84M pts</div>
        <div class="status pending">Decision pending</div>
      </div>
    </div>
  `;
}

function submissionsHTML() {
  return `
    <div class="section-head"><h2>Submissions</h2><p>Admin review queue for guest suggestions and a zero-redeploy approval flow.</p></div>
    <div class="card" style="margin-bottom:1rem;">
      <div class="label">Manual Entry Panel</div>
      <h3>Approved items</h3>
      <p class="small muted" style="margin-top:.4rem;">Guest submissions are also sent to Netlify Forms / email. Mark can approve and keep items live in localStorage for V1.</p>
    </div>
    <div class="grid">
      ${pendingSubmissions.length ? pendingSubmissions.map((item, idx) => card(item.name || item.restaurant || 'Untitled submission', `
        <div class="badge">${item.kind === 'restaurant' ? 'Restaurant' : 'Place'}</div>
        <div class="small muted" style="margin-top:.6rem;">${item.city || 'No city'}${item.category ? ` · ${item.category}` : ''}</div>
        <p class="small muted" style="margin-top:.75rem;">${item.desc || item.notes || item.short_description || 'No description provided.'}</p>
        <div class="toggle-row">
          <button class="primary" data-approve-index="${idx}">Add to site</button>
          <button class="secondary" data-dismiss-index="${idx}">Dismiss</button>
        </div>
      `)).join('') : card('No pending submissions', '<div class="muted">Nothing waiting for review right now.</div>')}
    </div>
  `;
}

function renderAll() {
  document.getElementById('overview').innerHTML = overviewHTML();
  document.getElementById('itinerary').innerHTML = itineraryHTML();
  document.getElementById('flights').innerHTML = flightsHTML();
  document.getElementById('hotels').innerHTML = hotelsHTML();
  document.getElementById('travelers').innerHTML = travelersHTML();
  document.getElementById('contacts').innerHTML = contactsHTML();
  document.getElementById('reservations').innerHTML = reservationsHTML();
  document.getElementById('discover').innerHTML = discoverHTML();
  document.getElementById('decisions').innerHTML = decisionsHTML();
  document.getElementById('financials').innerHTML = financialsHTML();
  document.getElementById('submissions').innerHTML = submissionsHTML();
  const openCount = data.decisions.filter(d => d.status === 'open').length;
  const badge = document.getElementById('decisions-badge');
  if (badge) badge.textContent = String(openCount);
  const submissionsBadge = document.getElementById('submissions-badge');
  if (submissionsBadge) submissionsBadge.textContent = String(pendingSubmissions.length);
  bindDiscoverFilters();
  bindSubmissionAdminActions();
}

function bindDiscoverFilters() {
  const search = document.getElementById('discover-search');
  const city = document.getElementById('discover-city');
  const category = document.getElementById('discover-category');
  const list = document.getElementById('discover-list');
  if (!search || !city || !category || !list) return;

  const rerender = () => {
    const q = search.value.trim().toLowerCase();
    const cityVal = city.value;
    const categoryVal = category.value;
    const filtered = mergedRecommendations.filter(r => {
      const qOk = !q || [r.name, r.city, r.area, r.desc, r.cuisine, ...(r.tags || [])].filter(Boolean).join(' ').toLowerCase().includes(q);
      const cityOk = !cityVal || r.city === cityVal;
      const categoryOk = !categoryVal || r.category === categoryVal;
      return qOk && cityOk && categoryOk;
    });
    list.innerHTML = filtered.map(renderRecommendation).join('');
  };

  search.addEventListener('input', rerender);
  city.addEventListener('change', rerender);
  category.addEventListener('change', rerender);
}

function refreshMergedData() {
  mergedRecommendations = [...recommendations, ...approvedSubmissions.filter(item => item.kind === 'place')];
  mergedReservations = [...reservations, ...approvedSubmissions.filter(item => item.kind === 'restaurant')];
}

function openSubmissionModal() {
  const modal = document.getElementById('submission-modal');
  const step1 = document.getElementById('submission-step-1');
  const step2 = document.getElementById('submission-step-2');
  const title = document.getElementById('submission-step-title');
  title.textContent = 'Step 1 of 2';
  step2.classList.add('hidden');
  step1.classList.remove('hidden');
  step1.innerHTML = `
    <div class="type-card-grid">
      <button class="type-card" data-submission-type="restaurant"><div style="font-size:1.6rem;">🍽</div><strong>Restaurant / Reservation</strong><div class="small muted">Add dinner ideas or reservation details</div></button>
      <button class="type-card" data-submission-type="place"><div style="font-size:1.6rem;">📍</div><strong>Place / Recommendation</strong><div class="small muted">Add a pub, sight, shop, or discover idea</div></button>
    </div>
  `;
  step1.querySelectorAll('[data-submission-type]').forEach(btn => btn.addEventListener('click', () => renderSubmissionForm(btn.dataset.submissionType)));
  modal.classList.remove('hidden');
}

function renderSubmissionForm(type) {
  const step1 = document.getElementById('submission-step-1');
  const step2 = document.getElementById('submission-step-2');
  const title = document.getElementById('submission-step-title');
  const savedName = localStorage.getItem('lyon80_user_name') || '';
  title.textContent = 'Step 2 of 2';
  step1.classList.add('hidden');
  step2.classList.remove('hidden');

  const categoryOptions = data.categories.map(c => `<option value="${c.id}">${c.label}</option>`).join('');
  const tagOptions = ['family-friendly', 'outdoor seating', 'hidden gem', 'book ahead', 'walk-in only', 'open late', 'near hotel', 'instagrammable', 'historic', 'must-do'];
  const tagCheckboxes = tagOptions.map(tag => `<label class="toggle-pill"><input type="checkbox" name="tags" value="${tag}" /> ${tag}</label>`).join('');
  const reservationFields = type === 'restaurant' ? `
    <label><span class="label">Cuisine / type of food</span><input name="cuisine" type="text" /></label>
    <label><span class="label">Do you have a reservation?</span><select id="has-reservation" name="has_reservation"><option value="no">No</option><option value="yes">Yes</option></select></label>
    <div id="reservation-details" class="hidden">
      <label><span class="label">Reservation date</span><input name="reservation_date" type="date" /></label>
      <label><span class="label">Reservation time</span><input name="reservation_time" type="time" /></label>
      <label><span class="label">Number of guests</span><input name="reservation_guests" type="number" min="1" /></label>
      <label><span class="label">Confirmation number</span><input name="confirmation_number" type="text" /></label>
    </div>
    <label><span class="label">Why do you love it?</span><textarea maxlength="200" name="notes"></textarea></label>
    <label><span class="label">Recommended by</span><input name="recommended_by" value="${savedName}" required /></label>
    <label class="toggle-pill"><input type="checkbox" name="urgent" value="yes" /> Time-sensitive — book soon</label>
  ` : `
    <label><span class="label">Category</span><select name="category" required>${categoryOptions}</select></label>
    <label><span class="label">Type of food (if food/drink)</span><input name="cuisine" type="text" /></label>
    <label><span class="label">Short description</span><textarea maxlength="200" name="desc" required></textarea></label>
    <div><div class="label" style="margin-bottom:.45rem;">Tags</div><div class="toggle-row" style="flex-wrap:wrap;">${tagCheckboxes}</div></div>
    <label><span class="label">Recommended by</span><input name="recommended_by" value="${savedName}" required /></label>
  `;

  step2.innerHTML = `
    <form id="guest-submission-form" class="form-grid">
      <input type="hidden" name="submission_type" value="${type}" />
      <label><span class="label">${type === 'restaurant' ? 'Restaurant name' : 'Place name'}</span><input name="name" required /></label>
      <label><span class="label">City</span><select name="city" required><option value="Edinburgh">Edinburgh</option><option value="London">London</option><option value="Day Trip">Day Trip</option><option value="Other">Other</option></select></label>
      <label><span class="label">Area / neighborhood</span><input name="area" /></label>
      <label><span class="label">Price range</span><select name="price"><option value="">Select</option><option>£</option><option>££</option><option>£££</option><option>££££</option><option>Free</option></select></label>
      <label><span class="label">Address</span><input name="address" /></label>
      <label><span class="label">Website</span><input name="website" type="url" /></label>
      <label><span class="label">Phone</span><input name="phone" type="tel" /></label>
      <label><span class="label">Instagram / TikTok / social</span><input name="instagram" type="url" /></label>
      ${reservationFields}
      <button class="primary" type="submit">Send to Mark →</button>
    </form>
  `;

  document.getElementById('guest-submission-form').addEventListener('submit', submitGuestSubmission);
  const reservationSelect = document.getElementById('has-reservation');
  if (reservationSelect) {
    const details = document.getElementById('reservation-details');
    reservationSelect.addEventListener('change', () => details.classList.toggle('hidden', reservationSelect.value !== 'yes'));
  }
}

async function submitGuestSubmission(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const fd = new FormData(form);
  const type = fd.get('submission_type');
  const recommendedBy = String(fd.get('recommended_by') || '').trim();
  if (recommendedBy) localStorage.setItem('lyon80_user_name', recommendedBy);
  const tags = fd.getAll('tags');

  const entry = {
    kind: type === 'restaurant' ? 'restaurant' : 'place',
    name: String(fd.get('name') || '').trim(),
    restaurant: String(fd.get('name') || '').trim(),
    city: String(fd.get('city') || '').trim(),
    area: String(fd.get('area') || '').trim(),
    category: String(fd.get('category') || '').trim() || (type === 'restaurant' ? 'casual-dining' : ''),
    price: String(fd.get('price') || '').trim(),
    address: String(fd.get('address') || '').trim() || null,
    maps_url: fd.get('address') ? `https://maps.google.com/?q=${encodeURIComponent(String(fd.get('address')) || '')}` : null,
    website: String(fd.get('website') || '').trim() || null,
    phone: String(fd.get('phone') || '').trim() || null,
    instagram: String(fd.get('instagram') || '').trim() || null,
    cuisine: String(fd.get('cuisine') || '').trim() || null,
    desc: String(fd.get('desc') || fd.get('notes') || '').trim(),
    notes: String(fd.get('notes') || '').trim(),
    recommended_by: recommendedBy,
    status: 'pending',
    guests: Number(fd.get('reservation_guests') || 7),
    booked_via: 'Four Seasons concierge',
    tags,
    urgent: fd.get('urgent') === 'yes',
    has_reservation: fd.get('has_reservation') === 'yes',
    reservation_date: String(fd.get('reservation_date') || '').trim() || null,
    reservation_time: String(fd.get('reservation_time') || '').trim() || null,
    confirmation_number: String(fd.get('confirmation_number') || '').trim() || null
  };

  pendingSubmissions = [...pendingSubmissions, entry];
  localStorage.setItem('lyon80_pending', JSON.stringify(pendingSubmissions));

  const payload = new URLSearchParams();
  payload.append('form-name', 'lyon80-submission');
  fd.forEach((value, key) => payload.append(key, value));

  try {
    await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: payload.toString() });
    document.getElementById('submission-step-2').innerHTML = `<div class="card"><h3>Thanks ${recommendedBy || 'there'}!</h3><p class="muted" style="margin-top:.5rem;">Mark will review it and it’ll appear on the site soon. 🏴🏴</p><button id="submission-success-close" class="primary" style="margin-top:1rem;">Close</button></div>`;
    document.getElementById('submission-success-close').addEventListener('click', closeSubmissionModal);
  } catch {
    document.getElementById('submission-step-2').innerHTML = `<div class="card"><h3>Something went wrong</h3><p class="muted" style="margin-top:.5rem;">Try again or text Mark at 949-416-4337.</p><button id="submission-success-close" class="primary" style="margin-top:1rem;">Close</button></div>`;
    document.getElementById('submission-success-close').addEventListener('click', closeSubmissionModal);
  }

  renderAll();
}

function closeSubmissionModal() {
  document.getElementById('submission-modal').classList.add('hidden');
}

function bindSubmissionAdminActions() {
  document.querySelectorAll('[data-approve-index]').forEach(btn => btn.addEventListener('click', () => {
    const idx = Number(btn.dataset.approveIndex);
    const item = pendingSubmissions[idx];
    if (!item) return;
    approvedSubmissions = [...approvedSubmissions, item];
    pendingSubmissions = pendingSubmissions.filter((_, i) => i !== idx);
    localStorage.setItem('lyon80_approved', JSON.stringify(approvedSubmissions));
    localStorage.setItem('lyon80_pending', JSON.stringify(pendingSubmissions));
    refreshMergedData();
    renderAll();
  }));

  document.querySelectorAll('[data-dismiss-index]').forEach(btn => btn.addEventListener('click', () => {
    const idx = Number(btn.dataset.dismissIndex);
    pendingSubmissions = pendingSubmissions.filter((_, i) => i !== idx);
    localStorage.setItem('lyon80_pending', JSON.stringify(pendingSubmissions));
    renderAll();
  }));
}

function updateCountdown() {
  const departure = new Date('2026-04-24T19:35:00-07:00');
  const now = new Date();
  const diff = departure - now;
  const el = document.getElementById('countdown');
  if (!el) return;
  if (diff <= 0) {
    el.textContent = '✈️ Trip is happening now!';
    return;
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  el.textContent = `${days} days · ${hours} hours until departure`;
}

function setAdminState(isAdmin) {
  document.body.classList.toggle('admin', isAdmin);
  adminToggle.textContent = isAdmin ? '🔓' : '🔒';
}

adminToggle.addEventListener('click', () => {
  if (localStorage.getItem('lyon80_admin') === 'true') {
    localStorage.removeItem('lyon80_admin');
    setAdminState(false);
  } else {
    adminModal.classList.remove('hidden');
    adminPassword.focus();
  }
});

adminSubmit.addEventListener('click', () => {
  const pw = adminPassword.value;
  if (pw === ADMIN_PASSWORD) {
    localStorage.setItem('lyon80_admin', 'true');
    setAdminState(true);
    adminModal.classList.add('hidden');
    adminError.classList.add('hidden');
    adminPassword.value = '';
  } else {
    adminError.classList.remove('hidden');
  }
});

adminCancel.addEventListener('click', () => adminModal.classList.add('hidden'));
document.getElementById('fab-add-place').addEventListener('click', openSubmissionModal);
document.getElementById('submission-close').addEventListener('click', closeSubmissionModal);
document.querySelector('.sheet-backdrop').addEventListener('click', closeSubmissionModal);

function activateTab(hash) {
  const id = hash.replace('#', '') || 'overview';
  document.querySelectorAll('.pane').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  const target = document.getElementById(id);
  const tab = document.querySelector(`a[href="#${id}"]`);
  if (target) target.classList.add('active');
  if (tab) tab.classList.add('active');
  navTabs.classList.remove('open');
}

window.addEventListener('hashchange', () => activateTab(location.hash));

renderAll();
setAdminState(localStorage.getItem('lyon80_admin') === 'true');
if (!location.hash) {
  history.replaceState(null, '', '#overview');
}
activateTab(location.hash || '#overview');
updateCountdown();
setInterval(updateCountdown, 60000);
