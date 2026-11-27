// Demo data. Everything here is synthetic so the dashboard works with no backend.
const DAY = 86_400_000;
export const inDays = (n, h = 17) => {
  const d = new Date();
  d.setHours(h, 0, 0, 0);
  return new Date(d.getTime() + n * DAY).toISOString();
};

// tiny seeded RNG so the database looks the same on every load
let seed = 25;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
const pick = (a) => a[Math.floor(rnd() * a.length)];

export const CITIES = ['Bengaluru', 'Mumbai', 'Pune', 'Hyderabad', 'Jaipur'];
const COLLEGES = {
  Bengaluru: ['BNMIT', 'REVA University', 'DSCE', 'RVCE', 'PES University', 'Christ University'],
  Mumbai: ['Mithibai College', 'NMIMS', 'KC College'],
  Pune: ['Symbiosis', 'MIT-WPU', 'Fergusson College'],
  Hyderabad: ['CBIT', 'Osmania University', 'VNR VJIET'],
  Jaipur: ['JECRC', 'Manipal Jaipur', 'LNMIIT'],
};
const FIRST = ['Aarav', 'Diya', 'Vihaan', 'Isha', 'Reyansh', 'Anika', 'Kabir', 'Meera', 'Arjun', 'Saanvi', 'Rohan', 'Tara', 'Ishaan', 'Kiara', 'Dev', 'Navya', 'Aditya', 'Riya', 'Yash', 'Pooja', 'Neel', 'Zoya', 'Harsh', 'Ira', 'Samar', 'Myra', 'Karan', 'Sia', 'Veer', 'Pranavi', 'Manav', 'Lakshmi', 'Dhruv', 'Aisha', 'Tanay', 'Ritika'];
const LAST = ['Rao', 'Shetty', 'Iyer', 'Das', 'Khan', 'Menon', 'Patel', 'Nair', 'Gupta', 'Reddy', 'Kulkarni', 'Joshi', 'Sharma', 'Bose', 'Pillai', 'Verma', 'Naidu', 'Singh', 'Desai', 'Chopra'];

const ROLE_MIX = ['Community member', 'Community member', 'Community member', 'Community member', 'Core team', 'Core team', 'Core team', 'Head of Content', 'Head of Operations', 'Fellow'];
export const PEOPLE = Array.from({ length: 96 }, (_, i) => {
  const city = pick(CITIES);
  const first = FIRST[i % FIRST.length];
  const last = pick(LAST);
  return {
    id: `U25-${String(1001 + i)}`,
    name: `${first} ${last}`,
    phone: `+91 90000 ${String(10000 + i * 37).slice(-5)}`,
    email: `${first}.${last}${i}@example.com`.toLowerCase(),
    college: pick(COLLEGES[city]),
    city,
    role: i < 18 ? 'Fellow' : pick(ROLE_MIX),
    joined: new Date(Date.now() - Math.floor(rnd() * 150) * DAY).toISOString().slice(0, 10),
    followers: Math.floor(rnd() * 2600) + 60,
    lastActive: Math.floor(rnd() * 40),
  };
});
// keep the six demo logins in the database too
PEOPLE.unshift(
  { id: 'U25-0001', name: 'Ananya Rao', phone: '+91 90000 00001', email: 'ananya.rao@example.com', college: 'BNMIT', city: 'Bengaluru', role: 'Fellow', joined: '2026-08-04', followers: 1180, lastActive: 0 },
  { id: 'U25-0002', name: 'Kabir Shetty', phone: '+91 90000 00002', email: 'kabir.shetty@example.com', college: 'BNMIT', city: 'Bengaluru', role: 'Head of Content', joined: '2026-09-02', followers: 0, lastActive: 0 },
  { id: 'U25-0003', name: 'Meera Iyer', phone: '+91 90000 00003', email: 'meera.iyer@example.com', college: 'BNMIT', city: 'Bengaluru', role: 'Head of Operations', joined: '2026-09-02', followers: 0, lastActive: 1 },
  { id: 'U25-0004', name: 'Rohan Das', phone: '+91 90000 00004', email: 'rohan.das@example.com', college: 'BNMIT', city: 'Bengaluru', role: 'Core team', joined: '2026-09-14', followers: 0, lastActive: 2 },
  { id: 'U25-0005', name: 'Sana Khan', phone: '+91 90000 00005', email: 'sana.khan@example.com', college: 'BNMIT', city: 'Bengaluru', role: 'Community member', joined: '2026-10-01', followers: 0, lastActive: 3 },
);

export const EVENTS = [
  { id: 'e1', title: 'Weekly Hang Session', type: 'Session', when: inDays(2, 18), where: 'Online', city: 'All', cap: 400, going: 212, leaders: false, text: 'A weekly chill-out: games, Fellow spotlight and 5MOP.' },
  { id: 'e2', title: 'The Draft Room', type: 'Session', when: inDays(3, 19), where: 'Online', city: 'All', cap: 150, going: 64, leaders: true, text: 'Weekly content workshop. Bring a real post for feedback.' },
  { id: 'e3', title: 'Winter clothes drive', type: 'On-ground', when: inDays(4, 11), where: 'BNMIT main gate', city: 'Bengaluru', cap: 80, going: 41, leaders: false, text: 'Collect, sort and hand over winter clothes. Volunteers welcome.' },
  { id: 'e4', title: 'Club Orientation, BNMIT', type: 'On-ground', when: inDays(5, 15), where: 'BNMIT Seminar Hall', city: 'Bengaluru', cap: 150, going: 97, leaders: false, text: 'Meet the club, meet the team and get your first challenge.' },
  { id: 'e5', title: 'Bengaluru City Meetup: office edition', type: 'City meetup', when: inDays(6, 16), where: 'Under25 Office', city: 'Bengaluru', cap: 120, going: 86, leaders: false, text: 'House game, learning circle, jam session and the letters wall.' },
  { id: 'e6', title: 'Fellows-only strategy meetup', type: 'City meetup', when: inDays(8, 17), where: 'Under25 Office', city: 'Bengaluru', cap: 40, going: 22, leaders: true, text: 'Goal setting for the next semester. Fellows only.' },
  { id: 'e7', title: 'Monthly Townhall', type: 'Session', when: inDays(9, 18), where: 'Online', city: 'All', cap: 600, going: 311, leaders: false, text: 'Updates and opportunities for the wider community.' },
  { id: 'e8', title: 'Student talent hunt: round 1 auditions', type: 'Talent hunt', when: inDays(10, 14), where: 'BNMIT Auditorium', city: 'Bengaluru', cap: 200, going: 58, leaders: false, text: 'Singers, dancers, comics, bands. Audition or come cheer.' },
  { id: 'e9', title: 'Academy Session: storytelling that sticks', type: 'Session', when: inDays(12, 18), where: 'Online', city: 'All', cap: 500, going: 187, leaders: false, text: 'An industry expert on telling stories people remember.' },
  { id: 'e10', title: 'Cubbon Park meetup', type: 'City meetup', when: inDays(13, 16), where: 'Cubbon Park', city: 'Bengaluru', cap: 90, going: 33, leaders: false, text: 'Social-space meetup. Bring a friend from another college.' },
  { id: 'e11', title: 'Hyderabad City Meetup', type: 'City meetup', when: inDays(15, 16), where: 'Charminar side venue', city: 'Hyderabad', cap: 100, going: 47, leaders: false, text: 'Meet Fellows and members across Hyderabad colleges.' },
  { id: 'e12', title: 'Mumbai City Meetup', type: 'City meetup', when: inDays(18, 16), where: 'Bandra venue', city: 'Mumbai', cap: 100, going: 52, leaders: false, text: 'Monthly Mumbai meetup with a learning circle.' },
  { id: 'e13', title: 'Pune City Meetup', type: 'City meetup', when: inDays(20, 16), where: 'Shaniwar Wada lawns', city: 'Pune', cap: 100, going: 39, leaders: false, text: 'Park-style meetup in the old city.' },
  { id: 'e14', title: 'Jaipur City Meetup', type: 'City meetup', when: inDays(22, 16), where: 'Jaipur venue', city: 'Jaipur', cap: 80, going: 28, leaders: false, text: 'First Jaipur meetup of the season.' },
];

export const TASKS = [
  { id: 't-fellow-list', to: '/listevent', title: 'List your Club Orientation event', text: 'Fill the event listing form so Under25 can review it and put it on the app.', assignee: 'fellow-bnmit', due: inDays(1), status: 'todo', by: 'Under25 Team', priority: 'High' },
  { id: 't-fellow-recruit', to: '/recruitment', title: 'Interview 3 candidates for Events Lead', text: 'Every lead role gets an interview. You run it; Under25 supports on request.', assignee: 'fellow-bnmit', due: inDays(7), status: 'doing', by: 'Under25 Team', priority: 'Medium' },
  { id: 't-fellow-cred', to: '/clubcredentials', auto: 'cred', title: 'Share your club page ID and password', text: 'One of your first tasks. Fill the form on this site. Only the Under25 admin team can see it.', assignee: 'fellow-bnmit', due: inDays(3), status: 'todo', by: 'Under25 Team', priority: 'Medium' },
  { id: 't-fellow-agree', to: '/campusagreement', auto: 'agreement', title: 'Get the Campus Agreement signed', text: 'The legal agreement your college management signs to officiate the Under25 club. Upload the signed copy. This stays on your list until it is approved.', assignee: 'fellow-bnmit', due: inDays(14), status: 'todo', by: 'Under25 Team', priority: 'High' },
  { id: 't-hygiene', to: '/hygiene', title: 'Run the club page hygiene check', text: 'Handle, bio, logo, highlights and a first week of posts.', assignee: 'hoc-bnmit', due: inDays(2), status: 'todo', by: 'Ananya Rao', priority: 'High' },
  { id: 't-launch', title: 'Publish the team launch post', text: 'One feedbreaker post plus one post for each position, so each person is seen.', assignee: 'hoc-bnmit', due: inDays(3), status: 'todo', by: 'Ananya Rao', priority: 'High' },
  { id: 't-calendar', title: 'Draft the 4-week content calendar', text: 'Include the Plaque launch and the talent hunt. Share it in the Draft Room.', assignee: 'hoc-bnmit', due: inDays(6), status: 'todo', by: 'Ananya Rao', priority: 'Medium' },
  { id: 't-hoo-check', title: 'Finalise the Club Orientation checklist', text: 'Venue, sound, check-in desk, volunteers, first-aid.', assignee: 'hoo-bnmit', due: inDays(2), status: 'doing', by: 'Ananya Rao', priority: 'High' },
  { id: 't-hoo-partner', title: 'Collect 3 sponsor leads', text: 'With the Brand Lead. Keep proof for brand payouts.', assignee: 'hoo-bnmit', due: inDays(9), status: 'todo', by: 'Ananya Rao', priority: 'Low' },
  { id: 't-core-first', title: 'Introduce yourself to your lead team', text: 'Say who you are and which first small win you want to pick.', assignee: 'core-bnmit', due: inDays(2), status: 'todo', by: 'Kabir Shetty', priority: 'High' },
  { id: 't-core-photos', title: 'Shoot 5 photos at Club Orientation', text: 'Candid is better than posed. Put them in your campus Drive folder and send the link to your Fellow.', assignee: 'core-bnmit', due: inDays(6), status: 'todo', by: 'Kabir Shetty', priority: 'Medium' },
];

export const CONTENT_IDEAS = [
  { id: 'ci1', title: 'A day in the life of a Fellow', format: 'Reel', effort: 'Medium', hook: 'Follow one Fellow from first lecture to the evening event.' },
  { id: 'ci2', title: 'Meet the team: one post per position', format: 'Carousel', effort: 'Low', hook: 'Team launch posts using the Meet the Team templates.' },
  { id: 'ci3', title: '5MOP shoutout wall', format: 'Story', effort: 'Low', hook: 'Five minutes of praise turned into a story series.' },
  { id: 'ci4', title: 'Campus hidden spots', format: 'Reel', effort: 'Medium', hook: 'Five places only seniors know about.' },
  { id: 'ci5', title: 'Talent hunt teaser: who is on stage', format: 'Reel', effort: 'High', hook: 'Quick intros of auditionees with a punchy edit.' },
  { id: 'ci6', title: 'Ask me anything with the HoO', format: 'Live', effort: 'Low', hook: 'Answer how events actually get planned.' },
  { id: 'ci7', title: 'Raw footage to final cut', format: 'Reel', effort: 'Medium', hook: 'Show the edit. People love the before and after.' },
  { id: 'ci8', title: 'Winter clothes drive diary', format: 'Carousel', effort: 'Low', hook: 'Numbers, faces and where the clothes went.' },
  { id: 'ci9', title: 'Seniors’ advice, 30 seconds each', format: 'Reel', effort: 'Low', hook: 'One tip per senior, no script.' },
  { id: 'ci10', title: 'Plaque progress tracker', format: 'Story', effort: 'Low', hook: 'Weekly follower count towards Silver.' },
  { id: 'ci11', title: 'Club vs club: friendly poll', format: 'Post', effort: 'Low', hook: 'Pit two campus clubs in a fun poll.' },
  { id: 'ci12', title: 'City meetup aftermovie', format: 'Reel', effort: 'High', hook: 'Cut a 45 second recap with the letters wall as the ending.' },
];
export const EVENT_IDEAS = [
  { id: 'ei1', title: 'Middle Name Game mixer', type: 'Culture', effort: 'Low', people: '30 to 80', budget: 'Under ₹2k', hook: 'A low-pressure icebreaker for new members.' },
  { id: 'ei2', title: 'Open mic night', type: 'Talent', effort: 'Medium', people: '60 to 150', budget: '₹3k to ₹8k', hook: 'Feeds the student talent hunt.' },
  { id: 'ei3', title: 'Clothes and books drive', type: 'Cause', effort: 'Low', people: '20 to 60', budget: 'Under ₹2k', hook: 'Easy to run and easy to show on camera.' },
  { id: 'ei4', title: 'Campus quiz league', type: 'Competition', effort: 'Medium', people: '80 to 200', budget: '₹2k to ₹6k', hook: 'Team quiz with a leaderboard across departments.' },
  { id: 'ei5', title: 'Letter writing evening', type: 'Culture', effort: 'Low', people: '25 to 70', budget: 'Under ₹1k', hook: 'Appreciation letters, anonymous or signed.' },
  { id: 'ei6', title: 'Inter-college sports day', type: 'Sporting League', effort: 'High', people: '150+', budget: '₹10k+', hook: 'A stepping stone to your Sporting League.' },
  { id: 'ei7', title: 'Brand activation pop-up', type: 'Branded', effort: 'High', people: '100+', budget: 'Brand funded', hook: 'Pair with a live brief from Branded opportunities.' },
  { id: 'ei8', title: 'Alumni fireside chat', type: 'Learning', effort: 'Medium', people: '50 to 120', budget: 'Under ₹3k', hook: 'Senior Fellows tell the real story.' },
  { id: 'ei9', title: 'Silent disco walk', type: 'Culture', effort: 'Medium', people: '40 to 100', budget: '₹4k to ₹9k', hook: 'The U25 dance, with headphones.' },
  { id: 'ei10', title: 'Portfolio review day', type: 'Learning', effort: 'Low', people: '20 to 60', budget: 'Under ₹1k', hook: 'Designers and creators get feedback from seniors.' },
];

export const HYGIENE = [
  ['Handle is short, clean and matches the Under25 naming', 'A simple handle people can remember and type.'],
  ['Bio says who you are and links to the app', 'Campus name, “Under25 club” and one clear link.'],
  ['Logo is the Under25 + campus lockup', 'Use the brand kit. No stretched or recoloured logos.'],
  ['Highlights: About, Team, Events, Join', 'Four highlights new visitors tap first.'],
  ['First week of posts is scheduled', 'Templatised posts are fine at launch.'],
  ['Posting rhythm agreed and written down', 'A weekly rhythm, reviewed at mid-year.'],
  ['Credentials added to the credentials log', 'So Under25 can support and hand over.'],
  ['Team launch post planned', 'A feedbreaker plus one post per position.'],
];
export const LAUNCH_POSTS = ['Feedbreaker post', 'Design Lead post', 'Content Lead post', 'Media Lead post', 'Technical Lead post', 'Events Lead post', 'Culture Lead post', 'Marketing Lead post', 'Brand Lead post', 'Finance Lead post'];
export const EVENT_CHECKLIST = {
  Before: ['Management permission and MOU on file', 'Event listed on the Under25 app', 'Venue, date and time locked', 'Roles assigned: Events Captain, volunteers, host', 'Marketing posts scheduled (T minus 7 days)', 'Run of show written and shared', 'Sound, mics and power tested', 'First-aid and safety contact noted'],
  'Day of': ['Check-in desk opens 30 minutes early', 'ID cards or wristbands ready', 'Code of conduct visible at the entrance', 'Host briefed on the run of show', 'Photographer and videographer in place', 'A named person for “what if it falls apart”'],
  After: ['Thank-you post with names', 'Attendance and photos uploaded', 'Event report filed within 48 hours', 'Receipts and budget closed with Finance Head', 'Feedback form shared', 'Proof saved for awards and CV points'],
};

export const UPDATES = [
  { id: 'n1', title: 'The Under25 Plaque is live', text: 'Reach 3,000 followers for Silver, 10,000 for Gold and 20,000 for Purple on your club page.', tag: 'Under25', when: inDays(-1), pin: true, href: '/milestones' },
  { id: 'n2', title: 'Student talent hunt launches this month', text: 'First round in December, main stage in January. Perform, volunteer or just show up.', tag: 'Opportunity', when: inDays(-2), href: '/talenthunt' },
  { id: 'n3', title: 'Bengaluru city meetup is open', text: 'Office meetup with a learning circle, a jam session and the letters wall.', tag: 'Event', when: inDays(-3), href: '/events?type=City%20meetup' },
  { id: 'n4', title: 'Campus Awards launch in December', text: '6 categories, 25 awards. Start collecting proof now: reports, screenshots and insights.', tag: 'Under25', when: inDays(-4), href: '/awards' },
  { id: 'n5', title: 'Core team applications are open', text: 'Join the Design, Content, Media, Tech, Finance, Culture, Partnerships, Marketing or Events team.', tag: 'Opportunity', when: inDays(-6), href: '/join' },
  { id: 'n6', title: 'Fellow of the Week', text: 'Every week we feature a Fellow who went above and beyond. Nominate someone from the Nominate page.', tag: 'Under25', when: inDays(-8), href: '/weeklyhang' },
  { id: 'n7', title: 'Club Orientation next week at BNMIT', text: 'Come meet the team. First event of the semester for the newly launched club.', tag: 'Campus', when: inDays(-9), href: '/events' },
  { id: 'n8', title: 'Mid-year reviews', text: 'Fellows will get a check-in call. It is a chance to ask for help, not a test.', tag: 'Under25', when: inDays(-12), href: '/tasks' },
];

export const NOTIFICATIONS = {
  all: [
    { id: 'x1', title: 'Plaque tiers are live', text: 'Silver at 3,000 followers.', icon: 'Medal' },
    { id: 'x2', title: 'Weekly Hang Session in 2 days', text: 'RSVP so we can save you a seat.', icon: 'CalendarDays' },
  ],
  extra: {
    fellow: [{ id: 'x3', title: 'Orientation needs a listing', text: 'List your Club Orientation event today.', icon: 'CalendarPlus' }],
    hoc: [{ id: 'x3', title: 'Team launch post is due', text: 'Due in 3 days.', icon: 'Megaphone' }],
    hoo: [{ id: 'x3', title: 'Orientation checklist', text: '2 items still open.', icon: 'ClipboardCheck' }],
    core: [{ id: 'x3', title: 'Your first task', text: 'Introduce yourself to your lead team.', icon: 'Rocket' }],
    community: [{ id: 'x3', title: 'Join the core team', text: '9 lead roles are open.', icon: 'DoorOpen' }],
    admin: [{ id: 'x3', title: '6 applications waiting', text: 'Accept, reject or schedule interviews.', icon: 'UserCheck' }],
  },
};

export const BRANDED = [
  { id: 'b1', brand: 'Brew & Bloom Cafe', title: 'Campus coffee takeover', text: 'Run a two-day sampling stall and post 3 stories with the brand tag.', reward: '₹12,000 + certificate', due: inDays(12), spots: 6, taken: 4, tag: 'Activation' },
  { id: 'b2', brand: 'Northwind Sneakers', title: 'Street style reel contest', text: 'A 30-second reel of campus street style. Best 3 win merch and a feature.', reward: 'Merch + feature', due: inDays(9), spots: 30, taken: 17, tag: 'Content' },
  { id: 'b3', brand: 'Lumen Mobile', title: 'App install challenge', text: 'Get 150 genuine installs through your club with a referral code.', reward: '₹ per verified install', due: inDays(20), spots: 20, taken: 11, tag: 'Growth' },
  { id: 'b4', brand: 'Pocket Pantry', title: 'Snack box taste test', text: 'Host a 40-person taste test and share a short feedback report.', reward: '₹6,000 + CV points', due: inDays(15), spots: 10, taken: 3, tag: 'Activation' },
  { id: 'b5', brand: 'Orbit Audio', title: 'Silent disco pilot', text: 'Co-host a headphone-only dance session. Brand supplies the kit.', reward: 'Kit loan + ₹8,000', due: inDays(28), spots: 5, taken: 1, tag: 'Event' },
];
export const CHALLENGES = [
  { id: 'c1', title: 'Cause-led drive', text: 'Run a donation or awareness drive and show it on camera.', due: inDays(-20), state: 'closed', points: 100, brief: 'Daan Utsav, October' },
  { id: 'c2', title: 'Talent hunt content sprint', text: 'Post 5 pieces of content about your campus talent hunt in 10 days.', due: inDays(8), state: 'open', points: 150, brief: 'November challenge' },
  { id: 'c3', title: 'Follow-up: 1,000 follower push', text: 'Grow the club page by 250 followers in 21 days with a posting rhythm.', due: inDays(21), state: 'open', points: 200, brief: 'Plaque warm-up' },
  { id: 'c4', title: 'Second challenge', text: 'Briefed in week one of February with an example. Check back then.', due: inDays(70), state: 'soon', points: 150, brief: 'February' },
];

export const TEAM_MEMBERS = [
  { id: 'm1', name: 'Ananya Rao', role: 'Fellow', group: 'Fellow', status: 'Active' },
  { id: 'm2', name: 'Kabir Shetty', role: 'Head of Content', group: 'Content', status: 'Active' },
  { id: 'm3', name: 'Meera Iyer', role: 'Head of Operations', group: 'Operations', status: 'Active' },
  { id: 'm4', name: 'Diya Menon', role: 'Design Lead', group: 'Content', status: 'Active' },
  { id: 'm5', name: 'Vihaan Patel', role: 'Content Lead', group: 'Content', status: 'Active' },
  { id: 'm6', name: 'Isha Nair', role: 'Media Lead', group: 'Content', status: 'Active' },
  { id: 'm7', name: '', role: 'Technical Lead', group: 'Content', status: 'Open' },
  { id: 'm8', name: 'Reyansh Gupta', role: 'Finance Lead', group: 'Operations', status: 'Active' },
  { id: 'm9', name: 'Anika Joshi', role: 'Culture Lead', group: 'Operations', status: 'Active' },
  { id: 'm10', name: '', role: 'Brand Lead', group: 'Operations', status: 'Open' },
  { id: 'm11', name: 'Rohan Das', role: 'Marketing Lead', group: 'Operations', status: 'Active' },
  { id: 'm12', name: 'Saanvi Reddy', role: 'Events Lead', group: 'Operations', status: 'Active' },
];

export const FOLLOWER_SERIES = [210, 260, 330, 390, 470, 560, 650, 760, 840, 960, 1060, 1180];
export const REACH_SERIES = [3.1, 3.8, 4.2, 5.6, 5.1, 6.9, 7.4, 9.8, 8.7, 11.2, 12.4, 14.1];
export const POSTS_SERIES = [2, 3, 3, 4, 2, 5, 4, 5, 6, 4, 5, 7];
export const EVENT_SERIES = [{ m: 'Sep', held: 2, att: 140 }, { m: 'Oct', held: 4, att: 330 }, { m: 'Nov', held: 3, att: 290 }, { m: 'Dec', held: 0, att: 0, plan: 4 }];

export const TALENT = {
  stage: 'Round 1',
  stages: ['Launch (Nov)', 'Round 1 (Dec)', 'Semi-final (Jan)', 'Main stage (Jan)'],
  stats: [['Auditions open', '412'], ['Campuses', '23'], ['Performers', '188'], ['Votes cast', '5.4k']],
  board: [
    { name: 'The Last Bench', kind: 'Band', college: 'DSCE', votes: 842 },
    { name: 'Nisha & Co', kind: 'Dance', college: 'Mithibai College', votes: 791 },
    { name: 'Karthik P', kind: 'Stand-up', college: 'RVCE', votes: 703 },
    { name: 'Beatbox Bureau', kind: 'Beatbox', college: 'Symbiosis', votes: 655 },
    { name: 'Aanya Sen', kind: 'Vocals', college: 'BNMIT', votes: 612 },
  ],
};
export const TEAM_OPENINGS = ['Design Lead', 'Content Lead', 'Media Lead', 'Technical Lead', 'Events Lead', 'Culture Lead', 'Marketing Lead', 'Brand Lead', 'Finance Lead'];
export const WORK_WITH_US = [
  { t: 'Volunteer at an event', d: 'Check-in desk, crowd flow, stage help. A certificate for every shift.' },
  { t: 'Perform at an event', d: 'Music, dance, comedy, spoken word. Open mics and the talent hunt.' },
  { t: 'Work with Under25', d: 'Limited jobs and internships open to Fellows as they graduate.' },
  { t: 'Partner with us', d: 'Brands and clubs who want to run something with the community.' },
];

export const APPLICATIONS = [
  { id: 'a1', name: 'Tanvi Kulkarni', college: 'Symbiosis', city: 'Pune', year: '2nd', stage: 'Interview', score: 8.4, status: 'pending', note: 'Hosted 6 events, strong on stage.' },
  { id: 'a2', name: 'Aman Verma', college: 'CBIT', city: 'Hyderabad', year: '3rd', stage: 'GD', score: 7.1, status: 'pending', note: 'Great listener in the GD.' },
  { id: 'a3', name: 'Riya Choudhary', college: 'JECRC', city: 'Jaipur', year: '2nd', stage: 'Interview', score: 9.0, status: 'pending', note: 'Student council member, 3k followers on a personal page.' },
  { id: 'a4', name: 'Sahil Desai', college: 'KC College', city: 'Mumbai', year: '3rd', stage: 'New', score: 6.2, status: 'pending', note: 'Content portfolio is thin.' },
  { id: 'a5', name: 'Lakshmi Pillai', college: 'Christ University', city: 'Bengaluru', year: '2nd', stage: 'GD', score: 7.8, status: 'pending', note: 'Leads two clubs already.' },
  { id: 'a6', name: 'Manav Bose', college: 'LNMIIT', city: 'Jaipur', year: '4th', stage: 'Interview', score: 8.0, status: 'pending', note: 'Strong network, needs a content lead.' },
  { id: 'a7', name: 'Pooja Naidu', college: 'VNR VJIET', city: 'Hyderabad', year: '2nd', stage: 'New', score: 6.8, status: 'pending', note: 'First-time organiser.' },
  { id: 'a8', name: 'Yash Singh', college: 'Fergusson College', city: 'Pune', year: '3rd', stage: 'GD', score: 7.4, status: 'pending', note: 'Cultural fest head.' },
];
export const HEALTH = [
  { id: 'h1', name: 'Aarav Sharma', college: 'REVA University', city: 'Bengaluru', quiet: 19, followers: 640, posts30: 1, status: 'MIA' },
  { id: 'h2', name: 'Zoya Khan', college: 'MIT-WPU', city: 'Pune', quiet: 12, followers: 410, posts30: 2, status: 'Quiet page' },
  { id: 'h3', name: 'Karan Joshi', college: 'NMIMS', city: 'Mumbai', quiet: 25, followers: 220, posts30: 0, status: 'MIA' },
  { id: 'h4', name: 'Sia Patel', college: 'Osmania University', city: 'Hyderabad', quiet: 9, followers: 880, posts30: 3, status: 'Quiet page' },
  { id: 'h5', name: 'Dev Menon', college: 'PES University', city: 'Bengaluru', quiet: 6, followers: 1210, posts30: 4, status: 'Watch' },
  { id: 'h6', name: 'Navya Reddy', college: 'Manipal Jaipur', city: 'Jaipur', quiet: 15, followers: 330, posts30: 1, status: 'Quiet page' },
];

export const DOCS = [
  { t: 'Playbook', d: 'The Fellow-facing handbook. Send it first.', url: 'https://grave-legume-23c.notion.site/Under25-Campus-Fellowship-Playbook-392337192f0a803c9f01fbcb63550226' },
  { t: 'Drills', d: 'The Notion hub of structured resource packages.', url: 'https://grave-legume-23c.notion.site/Welcome-to-the-Under25-Campus-Fellowship-2026-27-38f337192f0a80488ce1f046c4ee27ee' },
  { t: 'Insight form', d: 'The yearly insight form, run each March.', url: null },
  { t: 'Page credentials', d: 'Collects club page credentials for support and handover.', url: 'https://grave-legume-23c.notion.site/Credentials-Log-392337192f0a8045964becae53046535' },
  { t: 'Event listing form', d: 'Where on-ground events are listed.', url: 'https://grave-legume-23c.notion.site/List-your-event-on-the-Under25-App-3df337192f0a800b9ba2eb095cd5b8b4' },
  { t: 'Club structure (RNR)', d: 'Roles, responsibilities and the team flow chart.', url: 'https://grave-legume-23c.notion.site/Under25-Club-Structure-3a5337192f0a80618d46c08daf02b495' },
];
export const ALUMNI = [
  { name: 'Roshni', line: 'Fellow of the Year 2024-25, Festival Director', college: 'REVA University', topics: ['Campus Awards', 'Summit at Campus', 'Leadership'] },
  { name: 'Thanmayee', line: 'Fellow, BNMIT Bengaluru', college: 'BNMIT', topics: ['Team building', 'Balancing studies'] },
  { name: 'Shubh', line: 'Fellow, DSCE Bengaluru', college: 'DSCE', topics: ['Student talent', 'Community events'] },
];
export const QNA = [
  { id: 'q1', q: 'How do I get my management to say yes to the club?', by: 'Fellow, Pune', a: 'Use the pitch deck and the Community Agreement early. If they still object, ask for a meeting with someone from Under25 present.', votes: 18 },
  { id: 'q2', q: 'How many posts a week is the right rhythm?', by: 'Fellow, Hyderabad', a: 'Agree a weekly rhythm in the first month, review it at mid-year. Three solid posts beat seven rushed ones.', votes: 14 },
  { id: 'q3', q: 'What counts as an on-ground event for the listing?', by: 'Fellow, Jaipur', a: 'Anything held on campus for students: orientation, drives, quizzes, open mics. List it on the app so we can support.', votes: 9 },
  { id: 'q4', q: 'When can I run the Summit at Campus?', by: 'Fellow, Mumbai', a: 'Once the club page has 1,000 followers and the campus has 100 community members.', votes: 22 },
];

/* ======================= v2 additions ======================= */
EVENTS.forEach((e) => {
  if (e.type === 'On-ground' || e.type === 'Talent hunt') e.college = 'BNMIT';
  e.digital = e.type === 'Session';
});
EVENTS.push(
  { id: 'e15', title: 'Campus quiz league', type: 'On-ground', when: inDays(-2, 15), where: 'BNMIT Seminar Hall', city: 'Bengaluru', college: 'BNMIT', cap: 180, going: 164, leaders: false, text: 'Department-vs-department quiz with a leaderboard.' },
  { id: 'e16', title: 'Club Orientation (first run)', type: 'On-ground', when: inDays(-9, 15), where: 'BNMIT Seminar Hall', city: 'Bengaluru', college: 'BNMIT', cap: 150, going: 142, leaders: false, text: 'Meet the club, meet the team and get your first challenge.' },
);
// a report already filed for e16; e15 is waiting for its report
export const SEED_REPORTS = {
  e16: { attendees: 142, description: 'Full house. Team introductions, a live house game and the first challenge brief. Management dropped in for ten minutes.', drive: 'https://drive.google.com/', instagram: 'https://www.instagram.com/', by: 'Ananya Rao', at: inDays(-8) },
};

export const PARTNERS = ['DSCE', 'REVA University'];
export const CAMPUS_FEED = [
  { id: 'cf1', college: 'DSCE', city: 'Bengaluru', title: 'Open mic night', kind: 'Hosting', when: inDays(3, 17), text: 'Singers and stand-ups on one stage. Walk-ins welcome.' },
  { id: 'cf2', college: 'Symbiosis', city: 'Pune', title: 'Alumni fireside chat', kind: 'Hosting', when: inDays(6, 16), text: 'Three senior Fellows on what they would do differently.' },
  { id: 'cf3', college: 'REVA University', city: 'Bengaluru', title: 'Clothes and books drive', kind: 'Hosting', when: inDays(7, 11), text: 'Collect, sort and donate. Volunteers needed.' },
  { id: 'cf4', college: 'CBIT', city: 'Hyderabad', title: 'Campus quiz league', kind: 'Hosting', when: inDays(9, 15), text: 'Eight departments, one trophy.' },
  { id: 'cf5', college: 'JECRC', city: 'Jaipur', title: 'Portfolio review day', kind: 'Hosting', when: inDays(11, 14), text: 'Designers get feedback from seniors.' },
  { id: 'cf6', college: 'Mithibai College', city: 'Mumbai', title: 'Talent hunt auditions', kind: 'Hosting', when: inDays(12, 15), text: 'Round 1 auditions open to everyone.' },
];
export const RECENT_PHOTOS = [
  { id: 'rp1', college: 'DSCE', title: 'Club Orientation', when: inDays(-4), art: 'shapes-yellow', tone: 'yellow', instagram: 'https://www.instagram.com/' },
  { id: 'rp2', college: 'Symbiosis', title: 'Letter writing evening', when: inDays(-6), art: 'ok-purple', tone: 'purple', instagram: 'https://www.instagram.com/' },
  { id: 'rp3', college: 'REVA University', title: 'Daan Utsav drive', when: inDays(-8), art: 'shapes-green', tone: 'green', instagram: 'https://www.instagram.com/' },
  { id: 'rp4', college: 'CBIT', title: 'Open mic night', when: inDays(-10), art: 'ok-orange', tone: 'orange', instagram: 'https://www.instagram.com/' },
  { id: 'rp5', college: 'JECRC', title: 'Silent disco walk', when: inDays(-12), art: 'trophy-yellow', tone: 'yellow', instagram: 'https://www.instagram.com/' },
];

// Banners pinned on top of Home. Event and session banners are built from real events at render time.
export const SPOTLIGHT_SEED = [
  { id: 'sp-mvp', kind: 'MVPs of the month', title: 'MVPs of the Month', sub: 'October edition. See who made the cut.', cta: 'See the post', href: 'https://www.instagram.com/', tone: 'purple', art: 'trophy-purple' },
  { id: 'sp-stand', kind: 'Community standouts', title: 'Community standouts', sub: 'Shoutouts for people who made the community better this week.', cta: 'Read shoutouts', href: '/weeklyhang', tone: 'yellow', art: 'ok-yellow' },
  { id: 'sp-chal', kind: 'Challenge of the month', title: 'Talent hunt content sprint', sub: 'Post 5 pieces about your campus talent hunt in 10 days.', cta: 'Take the challenge', href: '/challenges', tone: 'green', art: 'arrow-green' },
];

// Demo sign-up requests waiting for approval at BNMIT, so each approver has something to act on.
export const SEED_SIGNUPS = [
  { id: 'su1', name: 'Tara Mehta', college: 'BNMIT', email: 'tara.mehta@example.com', phone: '+91 90000 40001', role: 'hoc', team: '', status: 'pending', at: inDays(-1) },
  { id: 'su2', name: 'Neel Banerjee', college: 'BNMIT', email: 'neel.banerjee@example.com', phone: '+91 90000 40002', role: 'core', team: 'Content', status: 'pending', at: inDays(-1) },
  { id: 'su3', name: 'Ira Kapoor', college: 'BNMIT', email: 'ira.kapoor@example.com', phone: '+91 90000 40003', role: 'core', team: 'Operations', status: 'pending', at: inDays(-2) },
  { id: 'su4', name: 'Kiara Bhat', college: 'NMIMS', email: 'kiara.bhat@example.com', phone: '+91 90000 40004', role: 'fellow', team: '', status: 'pending', at: inDays(-2) },
];
export const SEED_CRED = [
  { id: 'k2', college: 'REVA University', fellow: 'Aarav Sharma', handle: '@under25.reva', platform: 'Instagram', login: 'reva.under25@example.com', pw: 'demo-pass-2', at: inDays(-20) },
  { id: 'k3', college: 'Symbiosis', fellow: 'Tanvi Kulkarni', handle: '@under25.symbi', platform: 'Instagram', login: 'symbi.under25@example.com', pw: 'demo-pass-3', at: inDays(-14) },
];
export const SEED_AGREEMENTS = [
  { id: 'ag1', college: 'NMIMS', by: 'Kiara Bhat', fileName: 'NMIMS-campus-agreement.pdf', size: 480000, status: 'pending', at: inDays(-3) },
];

// Campus Partner popups: Fellow, Head of Content and Head of Operations for the seeded partner colleges.
export const PARTNER_LEADERS = {
  DSCE: { fellow: { name: 'Shubh Rao', email: 'shubh.rao@example.com', handle: '@under25.dsce' }, hoc: { name: 'Ira Nambiar', email: 'ira.nambiar@example.com' }, hoo: { name: 'Yash Pillai', email: 'yash.pillai@example.com' } },
  'REVA University': { fellow: { name: 'Roshni Das', email: 'roshni.das@example.com', handle: '@under25.reva' }, hoc: { name: 'Karan Mehta', email: 'karan.mehta@example.com' }, hoo: { name: 'Meghna Iyer', email: 'meghna.iyer@example.com' } },
};
