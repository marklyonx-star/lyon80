export const trip = {
  title: 'Lyon Family — UK Trip 2026',
  occasion: "John Lyon's 80th Birthday Celebration",
  dates: { start: '2026-04-24', end: '2026-05-04', display: 'April 24 – May 4, 2026' },
  destinations: ['Edinburgh', 'London'],
  nights: { edinburgh: 4, london: 5, total: 10 },
  style_tags: ['VIP Access', 'Private Tours', 'Heritage Focus', 'Foodie'],
  planner: { name: 'Mark Lyon', email: 'mark@beachmedia.io', phone: '949-416-4337' },
  primary_guest: { name: 'Katie Lyon', email: 'katie@beachmedia.io', phone: '949-355-4275' }
};

export const travelers = [
  { id: 'john-lyon', name: 'John Lyon', age: 80, role: 'Birthday Honoree', relationship: 'Father', booking_ref: 'FE4FE4', seat_outbound: '1K', seat_return: '1A', notes: 'The man of the hour' },
  { id: 'mark-lyon', name: 'Mark Lyon', age: 57, role: 'Trip Planner', relationship: 'Self', booking_ref: 'FE4FE4', seat_outbound: '1A', seat_return: '1K', notes: '' },
  { id: 'katie-lyon', name: 'Katie Lyon', age: 45, role: 'Primary Hotel Guest', relationship: 'Wife', booking_ref: 'FE4FE4', seat_outbound: '2A', seat_return: '1D', notes: '' },
  { id: 'susan-schaar', name: 'Susan Schaar', age: 75, role: 'Guest', relationship: 'Mother-in-law', booking_ref: 'FE4FE4', seat_outbound: '1D', seat_return: '3K', notes: '' },
  { id: 'bert-schaar', name: 'Bert Schaar', age: 79, role: 'Guest', relationship: 'Father-in-law', booking_ref: 'FE4FE4', seat_outbound: '1G', seat_return: '1G', notes: '' },
  { id: 'sarah-lyon', name: 'Sarah Lyon', age: 36, role: 'Guest', relationship: 'Daughter', booking_ref: 'CJ7WN8', seat_outbound: '2K', seat_return: '4K', notes: 'Harry Potter Studios — May 3' },
  { id: 'allyson-deol', name: 'Allyson Deol', age: 32, role: 'Guest', relationship: 'Daughter', booking_ref: 'C5HVWN', seat_outbound: '3K', seat_return: '5K', notes: 'Harry Potter Studios — May 3' }
];

export const flights = [
  { id: 'vs142', type: 'international', airline: 'Virgin Atlantic', flight_num: 'VS142', booking_ref: 'FE4FE4', origin: { code: 'LAX', city: 'Los Angeles', terminal: null }, destination: { code: 'LHR', city: 'London Heathrow', terminal: '3' }, departs: '2026-04-24T19:35', arrives: '2026-04-25T14:00', cabin: 'Upper Class', aircraft_note: 'New aircraft with new Upper Class seats', special: 'Meet & Assist Gold Service confirmed at LHR', alt_refs: [{ traveler: 'Sarah Lyon', ref: 'CJ7WN8' }, { traveler: 'Allyson Deol', ref: 'C5HVWN' }] },
  { id: 'ba1460', type: 'domestic', airline: 'British Airways', flight_num: 'BA1460', booking_ref: 'YUE8U4', origin: { code: 'LHR', city: 'London Heathrow', terminal: '5' }, destination: { code: 'EDI', city: 'Edinburgh', terminal: null }, departs: '2026-04-25T18:20', arrives: '2026-04-25T19:45', cabin: 'Economy', aircraft_note: null, special: null, alt_refs: [] },
  { id: 'vs7', type: 'international', airline: 'Virgin Atlantic', flight_num: 'VS7', booking_ref: 'FFHY6F', origin: { code: 'LHR', city: 'London Heathrow', terminal: null }, destination: { code: 'LAX', city: 'Los Angeles', terminal: null }, departs: '2026-05-04T10:50', arrives: '2026-05-04T14:05', cabin: 'Upper Class', aircraft_note: null, special: 'VIP departure greeter — check-in, security, lounge escort', alt_refs: [] }
];

export const train = {
  operator: 'LNER',
  route: 'Edinburgh Waverley → London King\'s Cross',
  date: '2026-04-29',
  departs: '09:00',
  arrives: '13:30',
  coach: 'L',
  seats: ['26', '20', '21', '22', '23', '24', '27'],
  notes: '2x Mercedes V-Classes from Fraser Suites to Waverley. NoteWorthy Sprinter from King\'s Cross to Four Seasons.'
};

export const hotels = [
  {
    id: 'fraser-suites',
    name: 'Fraser Suites Edinburgh',
    city: 'Edinburgh',
    address: '12-26 St Giles Street, Edinburgh EH1 1PT',
    maps_url: 'https://maps.google.com/?q=Fraser+Suites+Edinburgh',
    website: 'https://www.frasershospitality.com/en/united-kingdom/edinburgh/fraser-suites-edinburgh/',
    instagram: 'https://www.instagram.com/frasersuitesedinburgh/',
    phone: '+44 131 221 7200',
    check_in: '2026-04-25',
    check_out: '2026-04-29',
    nights: 4,
    rooms: [
      { conf: '52611SF099762', type: 'Courant Suite', category: 'Bespoke Suite', room_url: 'https://www.frasershospitality.com/en/united-kingdom/edinburgh/fraser-suites-edinburgh/accommodation/courant-suite/', description: 'Bespoke suite in the Edinburgh hotel collection.' },
      { conf: '52611SF099763', type: 'Observatory Suite', category: 'Bespoke Suite', room_url: 'https://www.frasershospitality.com/en/united-kingdom/edinburgh/fraser-suites-edinburgh/accommodation/observatory-suite/', description: '42 sqm suite with exclusive balcony views over Calton Hill and the Old Town.' },
      { conf: '52611SF099764', type: 'Princes Suite', category: 'Bespoke Suite', room_url: 'https://www.frasershospitality.com/en/united-kingdom/edinburgh/fraser-suites-edinburgh/accommodation/princes-suite/', description: 'Bespoke suite in the Edinburgh hotel collection.' },
      { conf: '52611SF099765', type: 'One Bedroom Apartment with City Views', category: 'One Bedroom Premier City View', room_url: 'https://www.frasershospitality.com/en/united-kingdom/edinburgh/fraser-suites-edinburgh/accommodation/', description: 'One-bedroom apartment with city views.' }
    ],
    benefits: [],
    booked_via: 'Chase Travel — Ultimate Rewards Points'
  },
  {
    id: 'four-seasons-london',
    name: 'Four Seasons Hotel London at Tower Bridge',
    city: 'London',
    address: '10 Trinity Square, London, EC3N 4AJ',
    maps_url: 'https://maps.google.com/?q=Four+Seasons+Hotel+London+Tower+Bridge',
    website: 'https://www.fourseasons.com/towerbridge/',
    instagram: 'https://www.instagram.com/fstowerbridge/',
    phone: '+44 20 3011 2121',
    check_in: '2026-04-29T15:00',
    check_out: '2026-05-04T12:00',
    nights: 5,
    free_cancellation_until: '2026-04-28',
    rooms: [
      { stay_id: 1, trip_id: '1012641565', conf: '71885SF052202', type: 'Three-Bedroom Tower-View Residence', size_sqft: 3618, beds: 'Three king beds, one rollaway bed', primary_guest: 'Mark Joseph Lyon', booked: '2026-01-25', room_url: 'https://www.fourseasons.com/towerbridge/accommodations/residences/three-bedroom-tower-view-hotel-residence/', description: 'Two-storey VIP residence with private terrace and views of the Tower of London and Tower Bridge.' },
      { stay_id: 2, trip_id: '1013604114', conf: '71885SF052984', type: 'Tower Bridge Executive Hotel Room', size_sqft: 573, beds: 'One king or two twin beds, sofabed', primary_guest: 'Katie Schaar Lyon', booked: '2026-02-16', room_url: 'https://www.fourseasons.com/towerbridge/accommodations/specialty-rooms/executive-room/', description: 'Executive room with separate living area and contemporary honey-oak finishes.' }
    ],
    benefits: ['Daily breakfast for 2', '$100 property credit per room', 'Room upgrade at check-in, if available', 'Early check-in / late check-out, if available', 'WiFi included', 'Welcome amenity'],
    booked_via: 'Chase Travel — Ultimate Rewards Points'
  }
];

export const contacts = [
  { id: 'martina-durando', name: 'Martina Durando', role: 'Senior Experience Designer', org: 'NoteWorthy', category: 'tour_operator', phone: '+44 203 051 5165', email: 'martina@noteworthy.co.uk', website: 'https://www.noteworthy.co.uk', instagram: 'https://www.instagram.com/noteworthy.experiences', notes: 'Primary NoteWorthy contact — all tour logistics' },
  { id: 'amanda-pettersson', name: 'Amanda Pettersson', role: 'Experience Designer', org: 'NoteWorthy', category: 'tour_operator', phone: null, email: 'amanda@noteworthy.co.uk', website: 'https://www.noteworthy.co.uk', instagram: null, notes: 'Secondary NoteWorthy contact' },
  { id: 'edinburgh-guide-tbd', name: 'TBD — Edinburgh Blue Badge Guide', role: 'Blue Badge Guide', org: 'NoteWorthy', category: 'guide', phone: null, email: null, website: null, instagram: null, notes: 'Assigned days: Apr 26 and Apr 27' },
  { id: 'london-guide-tbd', name: 'TBD — London Blue Badge Guide', role: 'Blue Badge Guide', org: 'NoteWorthy', category: 'guide', phone: null, email: null, website: null, instagram: null, notes: 'Assigned days: Apr 30, May 1, May 2' },
  { id: 'uk-emergency', name: 'UK Emergency Services', role: null, org: null, category: 'emergency', phone: '999', email: null, website: null, notes: 'Police, Fire, Ambulance' },
  { id: 'nhs-111', name: 'NHS 111', role: null, org: null, category: 'emergency', phone: '111', email: null, website: 'https://111.nhs.uk', notes: 'Medical advice — non-emergency' },
  { id: 'us-embassy-london', name: 'US Embassy London', role: null, org: 'US Department of State', category: 'emergency', phone: '+44 20 7499 9000', email: null, website: 'https://uk.usembassy.gov', notes: 'Emergency passport / citizen services' }
];

export const reservations = [
  { id: 'rock-sole', restaurant: 'Rock & Sole Plaice', city: 'London', area: 'Covent Garden', date: null, time: null, guests: 7, conf_num: null, address: '47 Endell Street, London WC2H 9AJ', maps_url: 'https://maps.google.com/?q=Rock+and+Sole+Plaice+London', phone: '+44 20 7836 3785', website: 'https://www.rockandsoleplaice.com', instagram: null, status: 'pending', notes: 'TikTok-famous fish & chips — best as lunch during Covent Garden day (Apr 30)', booked_via: null },
  { id: 'beigel-bake', restaurant: 'Beigel Bake', city: 'London', area: 'Brick Lane', date: null, time: null, guests: 7, conf_num: null, address: '159 Brick Lane, London E1 6SB', maps_url: 'https://maps.google.com/?q=Beigel+Bake+Brick+Lane', phone: '+44 20 7729 0616', website: 'https://www.beigelbake.co.uk', instagram: null, status: 'pending', notes: 'Iconic 24/7 bagels. Walk-in only — no reservation needed.', booked_via: null },
  { id: 'indian-tbd', restaurant: 'Indian Restaurant — TBD', city: 'London', area: 'TBD', date: null, time: null, guests: 7, conf_num: null, address: null, maps_url: null, phone: null, website: null, status: 'pending', notes: 'Group request — one evening in London. Book via Four Seasons concierge. Dishoom recommended.', booked_via: 'Four Seasons concierge' }
];
