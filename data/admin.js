export const financials = {
  noteworthy: {
    planning_fee: { amount: 500, currency: 'GBP', status: 'paid', note: 'Applied to total' },
    touring_total: { amount: 28345, currency: 'GBP', status: 'paid' },
    transport_addon: { amount: 7515, currency: 'GBP', status: 'pending_approval', original_quote: 8015, discrepancy_note: '£500 gap vs original quote — clarify with Martina' },
    total_if_approved: { amount: 35860, currency: 'GBP' }
  },
  hotels: [
    { property: 'Fraser Suites Edinburgh', booking_type: 'Chase Travel — Ultimate Rewards', cash_value: null, points: null, status: 'confirmed', note: 'Chase Travel cost/points TBD' },
    { property: 'Four Seasons Tower Bridge — Stay 1', trip_id: '1012641565', conf: '71885SF052202', booking_type: 'Chase Travel — Ultimate Rewards', cash_value: 43719.59, points: 2185979, currency: 'USD', booked: '2026-01-25', status: 'confirmed' },
    { property: 'Four Seasons Tower Bridge — Stay 2', trip_id: '1013604114', conf: '71885SF052984', booking_type: 'Chase Travel — Ultimate Rewards', cash_value: 9077.99, points: 453899, currency: 'USD', booked: '2026-02-16', status: 'confirmed' }
  ],
  hotel_totals: { london_cash_value: 52797.58, london_points: 2639878, currency: 'USD' },
  upgrade_option: { property: 'Four Seasons Tower Bridge', room: '4-Bedroom Royal Tower Bridge Hotel Residence', cash_value: 56742, points: 2844994, currency: 'USD', status: 'decision_pending' }
};

export const decisions = [
  { id: 1, title: 'Approve £7,515 transport & greeter add-on', status: 'open', options: null, resolution: null, note: 'Clarify £500 discrepancy vs original £8,015 quote — ask Martina' },
  { id: 2, title: 'Apr 28 Edinburgh free day activity', status: 'open', options: ['A: Stirling Castle', 'B: Scottish stately home + hosted lunch', 'C: Royal Yacht Britannia + leisure'], resolution: null, note: null },
  { id: 3, title: 'Book Warner Bros Harry Potter — May 3 (Allyson & Sarah)', status: 'open', options: null, resolution: null, note: 'Transport options via Golden Tours / GetYourGuide / Viator' },
  { id: 4, title: 'May 3 rest of group activity', status: 'open', options: ['A: Cotswolds day trip', 'B: Oxford + Blenheim Palace'], resolution: null, note: null },
  { id: 5, title: 'Four Seasons room upgrade decision', status: 'open', options: ['Keep current: 3BR $43,720 / 2.19M pts', 'Upgrade: 4BR Royal Tower Bridge $56,742 / 2.84M pts'], resolution: null, note: 'Free cancellation until Apr 28' }
];
