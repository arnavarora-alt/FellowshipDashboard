// Form definitions. Swap or extend fields here; every form on the site reads from this file.

export const STATES = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Chandigarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];

// "List Your Event on the Under25 App". Page 1 mirrors the Google Form; the event details section is ours.
export const EVENT_FORM = [
  { name: 'name', label: 'Your name', required: true },
  { name: 'whatsapp', label: 'Your WhatsApp number', type: 'tel', required: true, placeholder: 'We’ll reach out here if anything needs sorting before your event goes live' },
  { name: 'college', label: 'Your college name', required: true },
  { name: 'city', label: 'College city', required: true },
  { name: 'state', label: 'College state', type: 'select', options: STATES, required: true },
  { name: 'title', label: 'Event name', required: true, placeholder: 'Club Orientation' },
  { name: 'kind', label: 'Type of event', type: 'select', required: true, options: ['Orientation', 'Drive or cause', 'Competition', 'Open mic', 'Workshop', 'Sporting League', 'Networking', 'Other'] },
  { name: 'date', label: 'Date', type: 'date', required: true },
  { name: 'start', label: 'Start time', type: 'time', required: true, default: '15:00' },
  { name: 'end', label: 'End time', type: 'time', default: '17:00' },
  { name: 'venue', label: 'Venue', required: true },
  { name: 'cap', label: 'Expected attendees', type: 'number', required: true },
  { name: 'ticketing', label: 'Ticketing', type: 'select', options: ['Free', 'Paid tickets'], required: true, default: 'Free' },
  { name: 'price', label: 'Ticket price in ₹ (if paid)', type: 'number' },
  { name: 'text', label: 'What is the event about?', type: 'textarea', required: true },
  { name: 'poster', label: 'Poster or banner link (Drive, Canva…)', placeholder: 'https://' },
];

export const EXECUTED_FORM = [
  { name: 'attendees', label: 'How many people attended?', type: 'number', required: true },
  { name: 'description', label: 'What happened at the event?', type: 'textarea', required: true },
  { name: 'drive', label: 'Drive link to the event photos', required: true, placeholder: 'https://drive.google.com/…' },
];

export const SUMMIT_FORM = [
  { name: 'date', label: 'Ideal summit date', type: 'date', required: true },
  { name: 'attendees', label: 'Expected number of attendees', type: 'number', required: true },
  { name: 'capacity', label: 'Auditorium capacity', type: 'number', required: true },
  { name: 'setting', label: 'Auditorium: indoor or outdoor', type: 'select', options: ['Indoor', 'Outdoor'], required: true },
  { name: 'ticketing', label: 'Ticketed or unticketed summit', type: 'select', options: ['Ticketed summit', 'Unticketed summit'], required: true },
];

export const CRED_FORM = [
  { name: 'handle', label: 'Club page handle', required: true, placeholder: '@under25.yourcampus' },
  { name: 'platform', label: 'Platform', type: 'select', options: ['Instagram'], default: 'Instagram', required: true },
  { name: 'login', label: 'Login ID (username or email)', required: true },
  { name: 'pw', label: 'Password', type: 'password', required: true },
];

// Monthly insight form. Placeholder questions until the real form is shared.
export const INSIGHT_FORM = [
  { name: 'followers', label: 'Club page followers today', type: 'number', required: true },
  { name: 'team', label: 'Active team members', type: 'number', required: true },
  { name: 'events', label: 'Events you ran this month', type: 'number', required: true },
  { name: 'mood', label: 'How supported do you feel?', type: 'select', options: ['Very supported', 'Mostly supported', 'Somewhat', 'Not really'], required: true },
  { name: 'blocker', label: 'Biggest blocker right now', type: 'select', options: ['Management buy-in', 'Team commitment', 'Content ideas', 'Exams and time', 'Money', 'Nothing'], required: true },
  { name: 'win', label: 'Your proudest win this month', type: 'textarea' },
  { name: 'ask', label: 'What do you need from Under25?', type: 'textarea' },
];

export const SUCCESSOR_FORM = [
  { name: 'name', label: 'Their name', required: true },
  { name: 'email', label: 'Their email', type: 'email', required: true },
  { name: 'phone', label: 'Their phone number', type: 'tel', required: true },
  { name: 'college', label: 'Their college', required: true },
  { name: 'reason', label: 'Why are you handing over?', type: 'select', options: ['Moving on from Under25', 'My tenure has ended'], required: true },
  { name: 'handover', label: 'Handover date', type: 'date', required: true },
  { name: 'why', label: 'Why are they the right person?', type: 'textarea', required: true },
];

export const CLUB_AWARD_FORM = [
  { name: 'club', label: 'Under25 club name', required: true },
  { name: 'category', label: 'Award category', type: 'select', options: ['Superlatives', 'Brand awards', 'Big Bang awards', 'Do it for the Gram', 'Critique awards', 'Backbone awards'], required: true },
  { name: 'proof', label: 'Link to your proof folder', required: true, placeholder: 'https://' },
  { name: 'summary', label: 'Why does your club deserve it?', type: 'textarea', required: true },
];
