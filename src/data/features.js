// One registry drives navigation, routing guards, search and the per-role experience.
// Role codes: F fellow, C head of content, O head of operations, T core team, M community member.
// Admin ("A") is always allowed everywhere.
// Options per row: hidden (reachable by link/task, not in the sidebar), groupBy (per-role sidebar group), needs ('partner').

const R = { F: 'fellow', C: 'hoc', O: 'hoo', T: 'core', M: 'community' };
const all = 'FCOTM';
const lead = 'FCOT'; // fellow + HoC + HoO + core team

export const GROUPS = [
  { id: 'start', label: 'Start here' },
  { id: 'campus', label: 'My campus' },
  { id: 'today', label: 'Today' },
  { id: 'content', label: 'Content' },
  { id: 'ops', label: 'Operations' },
  { id: 'team', label: 'Team and growth' },
  { id: 'learn', label: 'Learn' },
  { id: 'involve', label: 'Get involved' },
  { id: 'support', label: 'Support' },
  { id: 'admin', label: 'Admin tools' },
];

// [key, path, label, icon, group, roles, blurb, options]
const rows = [
  ['home', '/', 'Home', 'Home', 'start', all, 'Your dashboard'],
  ['updates', '/updates', 'What’s new', 'Megaphone', 'start', all, 'Community updates from Under25 and your campus'],

  // My campus: College status comes first
  ['collegestatus', '/collegestatus', 'College status', 'Building2', 'campus', 'FT', 'Where your campus stands, with highlights'],
  ['clubpage', '/clubpage', 'Club page', 'Instagram', 'campus', 'FCT', 'Followers, reach and posting rhythm'],
  ['hygiene', '/hygiene', 'Club page hygiene check', 'ClipboardCheck', 'campus', 'C', 'Handle, bio, logo, highlights, first week of posts'],
  ['onground', '/onground', 'On-ground events', 'PartyPopper', 'campus', 'FO', 'Your campus events, from listing to executed'],
  ['listevent', '/listevent', 'List an event', 'CalendarPlus', 'campus', 'FO', 'Event listing form'],
  ['planevent', '/planevent', 'Plan your next event', 'PencilRuler', 'campus', 'T', 'Pitch an event to your Head of Operations'],
  ['summit', '/summit', 'Summit at Campus', 'Mountain', 'campus', 'F', 'Eligibility and the slot request form'],
  ['awards', '/awards', 'Campus Awards', 'Trophy', 'campus', 'F', '6 categories, 25 awards. Nominate your club in March'],
  ['campusagreement', '/campusagreement', 'Campus Agreement', 'FileSignature', 'campus', 'F', 'Get management to sign and become a Campus Partner'],
  ['partnernext', '/partnernext', 'Campus Partner next steps', 'BadgeCheck', 'campus', 'F', 'Your college’s next steps', { needs: 'partner' }],
  ['recruitment', '/recruitment', 'Club recruitment', 'UsersRound', 'campus', 'F', 'Roles, applications and interviews'],
  ['uploadphotos', '/uploadphotos', 'Upload photos', 'Camera', 'campus', 'FT', 'Share event photos with Under25'],
  ['credform', '/clubcredentials', 'Club page login', 'KeyRound', 'campus', 'F', 'Share your club page login with Under25', { hidden: true }],

  ['events', '/events', 'Upcoming events', 'CalendarDays', 'today', all, 'Events and digital sessions'],
  ['tasks', '/tasks', 'Tasks and deadlines', 'ListChecks', 'today', lead, 'Your tasks and everything that is due'],
  ['assigntask', '/assigntask', 'Assign task', 'UserPlus', 'today', 'FCO', 'Hand a task to someone on your team'],
  ['approvals', '/approvals', 'Sign-up approvals', 'UserCheck', 'today', 'FCO', 'Approve people joining your club'],

  ['contentideas', '/contentideas', 'Content ideas bank', 'Lightbulb', 'content', 'C', 'Next content ideas, ready to shoot'],
  ['contentcal', '/contentcal', 'Content calendar', 'CalendarRange', 'content', 'C', 'Festivals, milestones and posting plan'],
  ['clubresources', '/clubresources', 'Club page resources', 'FolderOpen', 'content', 'FC', 'Brand kit, stickers and templates'],
  ['contentguide', '/contentguide', 'Content guidelines', 'ScrollText', 'content', 'C', 'How Under25 content should look and sound'],
  ['draftroom', '/draftroom', 'The Draft Room', 'Clapperboard', 'content', 'FC', 'Weekly content workshop'],

  ['eventstats', '/eventstats', 'Event statistics', 'BarChart3', 'ops', 'O', 'Attendance, events run and RSVP conversion'],
  ['eventideas', '/eventideas', 'Event ideas', 'Sparkles', 'ops', 'O', 'Next event ideas'],
  ['eventcal', '/eventcal', 'Event calendar', 'CalendarRange', 'ops', 'O', 'Festivals, milestones and event plan'],

  ['team', '/team', 'Your team', 'Users', 'team', lead, 'People, roles and who to ping'],
  ['structure', '/structure', 'Team structure', 'Network', 'team', lead, 'The club structure, with photos'],
  ['journey', '/journey', 'College journey', 'Route', 'team', lead, 'Six semesters, six unlocks'],
  ['milestones', '/milestones', 'Milestones', 'Flag', 'team', lead, 'Plaque tiers and unlocks'],
  ['challenges', '/challenges', 'Challenges', 'Swords', 'team', lead, 'Team challenges with proof'],
  ['branded', '/branded', 'Branded opportunities', 'Briefcase', 'team', lead, 'Live briefs from brands'],
  ['insight', '/insight', 'Insight form', 'FileText', 'team', 'FO', 'The monthly insight form'],
  ['nominate', '/nominate', 'Nominate your successor', 'BadgeCheck', 'team', 'FT', 'Nominate who takes your position next'],
  ['alumni', '/alumni', 'Alumni connect', 'GraduationCap', 'team', 'F', 'Ask senior Fellows from your college'],

  ['playbook', '/playbook', 'Playbook', 'BookOpen', 'learn', 'F', 'The Fellowship handbook'],
  ['drills', '/drills', 'Drills', 'Dumbbell', 'learn', 'F', 'Structured resource packs'],
  ['weeklyhang', '/weeklyhang', 'Weekly Hang Session', 'PartyPopper', 'learn', 'FCOT', 'Join the session and send shoutouts'],
  ['qna', '/qna', 'QnA', 'MessageCircleQuestion', 'learn', 'F', 'Ask and answer'],

  ['join', '/join', 'Join the core team', 'DoorOpen', 'involve', 'MT', 'Apply for a lead role'],
  ['involve', '/involve', 'Perform, volunteer, work with us', 'Handshake', 'involve', 'MT', 'Ways to take part'],
  ['talenthunt', '/talenthunt', 'Student talent hunt', 'Mic', 'involve', 'COTM', 'Live overview'],
  ['suggestions', '/suggestions', 'Suggestions', 'MessageSquarePlus', 'involve', all, 'Tell us what to build next', { groupBy: { fellow: 'support' } }],
  ['certificates', '/certificates', 'Certificates', 'Award', 'involve', 'COTM', 'Download what you have earned'],

  ['help', '/help', 'Need help?', 'LifeBuoy', 'support', lead, 'The Under25 Care team'],

  ['database', '/database', 'Full database', 'Database', 'admin', '', 'Name, number, email, college, role'],
  ['applications', '/applications', 'Fellowship applications', 'UserCheck', 'admin', '', 'Accept, reject, interview'],
  ['adminevents', '/adminevents', 'Events and RSVPs', 'CalendarCheck', 'admin', '', 'Event listings, executed reports, RSVPs, CSV'],
  ['submissions', '/submissions', 'Form submissions', 'Inbox', 'admin', '', 'Every form filled on the site, with CSV'],
  ['credentials', '/credentials', 'Credentials log', 'KeyRound', 'admin', '', 'Club page logins from every Fellow'],
  ['agreements', '/agreements', 'Campus agreements', 'FileSignature', 'admin', '', 'Approve signed agreements, grant Campus Partner'],
  ['spotlightadmin', '/spotlightadmin', 'Spotlight banners', 'Sparkles', 'admin', '', 'Manage the banners pinned on Home'],
  ['leadership', '/leadership', 'HoO, HoC, core details', 'Contact', 'admin', '', 'Everyone leading a club'],
  ['calls', '/calls', 'Team calls', 'CalendarClock', 'admin', '', 'Schedule calls with teams'],
  ['health', '/health', 'Fellow health', 'HeartPulse', 'admin', '', 'Quiet pages and MIA Fellows'],
  ['analytics', '/analytics', 'Program analytics', 'Activity', 'admin', '', 'Batch history and campus coverage'],
  ['programcal', '/programcal', 'Program calendar', 'CalendarRange', 'admin', '', 'The 12-month trajectory'],
  ['docs', '/docs', 'Important docs', 'Files', 'admin', '', 'Playbook, drills, forms and more'],
];

export const FEATURES = rows.map(([key, path, label, icon, group, codes, blurb, opts = {}]) => ({
  key,
  path,
  label,
  icon,
  group,
  blurb,
  hidden: !!opts.hidden,
  needs: opts.needs || null,
  groupBy: { admin: group === 'admin' ? 'admin' : undefined, ...(opts.groupBy || {}) },
  roles: ['admin', ...[...codes].map((c) => R[c])],
}));
// admin sees the approvals page under Admin tools
FEATURES.find((f) => f.key === 'approvals').groupBy.admin = 'admin';

export const featureByKey = Object.fromEntries(FEATURES.map((f) => [f.key, f]));
export const featureByPath = Object.fromEntries(FEATURES.map((f) => [f.path, f]));
export const canAccess = (roleId, key) => !!featureByKey[key]?.roles.includes(roleId);
export const featuresFor = (roleId) => FEATURES.filter((f) => f.roles.includes(roleId));
export const groupFor = (f, roleId) => f.groupBy?.[roleId] || f.group;
