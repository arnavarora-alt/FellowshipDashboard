// Roles, demo accounts and first-login briefings.
// NOTE: frontend-only demo. Credentials live in the bundle on purpose (requested for the demo login page).

export const ROLES = {
  admin: {
    id: 'admin',
    label: 'Under25 Team',
    short: 'Admin',
    codename: 'Command',
    tagline: 'You see everything. You run the program.',
    lead: 'Full access to the backend: database, applications, events, tasks and every view the other roles get.',
    color: 'var(--white)',
    swatch: '#ffffff',
    swatchText: '#121a17',
    sticker: 'shapes-yellow',
    abilities: [
      ['ShieldCheck', 'Full database access'],
      ['UserCheck', 'Accept or reject applications'],
      ['CalendarClock', 'Schedule team calls'],
      ['Eye', 'See every role view'],
    ],
  },
  fellow: {
    id: 'fellow',
    label: 'Fellow',
    short: 'Fellow',
    codename: 'Fellow',
    tagline: 'The OG of your campus.',
    lead: 'You run the club page, the on-ground events and the team. Everything you need to begin is queued up below.',
    swatch: '#ffd12f',
    swatchText: '#121a17',
    sticker: 'trophy-yellow',
    // what a Fellow runs (Playbook p.8 to p.13)
    abilities: [
      ['Instagram', 'Club Page', 'Tell your campus story and grow a community.'],
      ['Gamepad2', 'Sporting Leagues', 'You are the CEO. Run a tournament start to finish.'],
      ['PartyPopper', 'On-ground Events', 'Build experiences for the people you see every day.'],
      ['Mountain', 'Summit at Campus', 'Direct a real festival once a year.'],
      ['Trophy', 'Campus Awards', 'Where the whole year comes full circle.'],
    ],
  },
  hoc: {
    id: 'hoc',
    label: 'Head of Content',
    short: 'Head of Content',
    codename: 'Content',
    tagline: 'You tell the campus story.',
    lead: 'Design Lead, Content Captain, Media Chief and Tech Head report to you. Keep the page alive and the story sharp.',
    swatch: '#4d298e',
    swatchText: '#ffffff',
    sticker: 'ok-purple',
    abilities: [
      ['Clapperboard', 'Own the club page'],
      ['Lightbulb', 'Feed the ideas bank'],
      ['CalendarDays', 'Run the content calendar'],
      ['Palette', 'Guard the brand look'],
    ],
  },
  hoo: {
    id: 'hoo',
    label: 'Head of Operations',
    short: 'Head of Operations',
    codename: 'Operations',
    tagline: 'You make events actually happen.',
    lead: 'Finance, Culture, Partnerships, Marketing and Events report to you. You keep every event safe, smooth and on time.',
    swatch: '#ff5a00',
    swatchText: '#121a17',
    sticker: 'ok-orange',
    abilities: [
      ['Sparkles', 'Pitch event ideas', 'Easy to run, easy to show on camera.'],
      ['CalendarRange', 'Run the event calendar', 'Plan around festivals and milestones.'],
      ['CalendarPlus', 'List events', 'Get every event on the Under25 app.'],
      ['Users', 'Lead the ops team', 'Finance, culture, marketing, brand, events.'],
    ],
  },
  core: {
    id: 'core',
    label: 'Core team member',
    short: 'Core team',
    codename: 'Core',
    tagline: 'You are the engine of the club.',
    lead: 'You are on a lead team. Get plugged into the community, your city meetup and your first task.',
    swatch: '#085939',
    swatchText: '#ffffff',
    sticker: 'shapes-green',
    abilities: [
      ['Rocket', 'Ship your first task'],
      ['MapPin', 'Join city meetups'],
      ['Camera', 'Capture campus moments'],
      ['Handshake', 'Pitch your own events'],
    ],
  },
  community: {
    id: 'community',
    label: 'Community member',
    short: 'Community',
    codename: 'Member',
    tagline: 'Part of India’s largest youth network.',
    lead: 'See what is happening on your campus and across Under25. When you are ready, step up and join the core team.',
    swatch: '#fff5cc',
    swatchText: '#121a17',
    sticker: 'arrow-yellow',
    abilities: [
      ['Megaphone', 'Catch community updates'],
      ['Ticket', 'RSVP to events'],
      ['Mic', 'Perform on stage'],
      ['DoorOpen', 'Join the core team'],
    ],
  },
};

export const ROLE_ORDER = ['admin', 'fellow', 'hoc', 'hoo', 'core', 'community'];

export const USERS = [
  { id: 'u25-admin', password: 'Under25@Admin', name: 'Under25 Team', role: 'admin', college: 'Under25 HQ', city: 'Bengaluru', email: 'team@example.com' },
  { id: 'fellow-bnmit', password: 'Fellow@2026', name: 'Ananya Rao', role: 'fellow', college: 'BNMIT', city: 'Bengaluru', email: 'ananya.rao@example.com' },
  { id: 'hoc-bnmit', password: 'Content@2026', name: 'Kabir Shetty', role: 'hoc', college: 'BNMIT', city: 'Bengaluru', email: 'kabir.shetty@example.com' },
  { id: 'hoo-bnmit', password: 'Events@2026', name: 'Meera Iyer', role: 'hoo', college: 'BNMIT', city: 'Bengaluru', email: 'meera.iyer@example.com' },
  { id: 'core-bnmit', password: 'Core@2026', name: 'Rohan Das', role: 'core', college: 'BNMIT', city: 'Bengaluru', email: 'rohan.das@example.com' },
  { id: 'member-bnmit', password: 'Member@2026', name: 'Sana Khan', role: 'community', college: 'BNMIT', city: 'Bengaluru', email: 'sana.khan@example.com' },
];

export const initials = (name = '') =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((s) => s[0]).join('').toUpperCase();

// What each role sees first (the "mission briefing"). `to` is a route inside the app.
export const BRIEFINGS = {
  fellow: [
    { icon: 'BookOpen', title: 'Playbook', text: 'The Fellowship handbook: roadmap, rules and what you signed up for.', to: '/playbook' },
    { icon: 'Dumbbell', title: 'Drills', text: 'Eight structured resource packs to learn leadership drill by drill.', to: '/drills' },
    { icon: 'FolderOpen', title: 'Club page resources', text: 'Brand kit, stickers, templates and the credentials log in one place.', to: '/clubresources' },
    { icon: 'CalendarPlus', title: 'List your on-ground event', text: 'Plan it, list it, and Under25 can track and support it.', to: '/listevent' },
  ],
  hoc: [
    { icon: 'ClipboardCheck', title: 'Club page hygiene check', text: 'Handle, bio, logo, highlights and a first week of posts. Tick them off.', to: '/hygiene' },
    { icon: 'Lightbulb', title: 'Content ideas bank', text: 'Ready-to-shoot ideas, filtered by format and effort.', to: '/contentideas' },
    { icon: 'Megaphone', title: 'Team launch post task', text: 'A feedbreaker post plus one post for every position so each person is seen.', to: '/tasks?focus=t-launch' },
    { icon: 'ListChecks', title: 'Upcoming task: content calendar', text: 'Lay out the next four weeks before the Draft Room on Thursday.', to: '/tasks?focus=t-calendar' },
  ],
  hoo: [
    { icon: 'Sparkles', title: 'Event ideas', text: 'Formats that are easy to run on campus and easy to show on camera.', to: '/eventideas' },
    { icon: 'CalendarRange', title: 'Event calendar', text: 'Upcoming festivals and milestones, with an event to run around each one.', to: '/eventcal' },
    { icon: 'CalendarPlus', title: 'List your event', text: 'Fill the listing form so your event can go live on the Under25 app.', to: '/listevent' },
  ],
  core: [
    { icon: 'Megaphone', title: 'What’s new', text: 'Community updates from Under25 and from your campus.', to: '/updates' },
    { icon: 'MapPin', title: 'City meetup', text: 'The next Bengaluru meetup is open. Grab your spot.', to: '/events?type=City%20meetup' },
    { icon: 'Rocket', title: 'Your first task', text: 'Introduce yourself to the team and pick your first small win.', to: '/tasks?focus=t-core-first' },
  ],
  community: [
    { icon: 'Megaphone', title: 'Community updates', text: 'Everything new across Under25 and your campus club.', to: '/updates' },
    { icon: 'Ticket', title: 'Upcoming events', text: 'RSVP in a tap to the next meetups, sessions and shows.', to: '/events' },
    { icon: 'DoorOpen', title: 'Join the core team', text: 'Pick a lead role you care about and apply in two minutes.', to: '/join' },
  ],
  admin: [
    { icon: 'UserCheck', title: 'Applications to review', text: 'Fellowship applications waiting for accept, reject or an interview.', to: '/applications' },
    { icon: 'HeartPulse', title: 'Fellows needing a check-in', text: 'Quiet pages and MIA Fellows, with the warm outreach script ready.', to: '/health' },
    { icon: 'CalendarCheck', title: 'Events awaiting review', text: 'Listed on-ground events across colleges, with RSVP counts.', to: '/adminevents' },
    { icon: 'Database', title: 'Full database', text: 'Name, number, email, college and role for everyone in the program.', to: '/database' },
  ],
};
