// One registry drives navigation, routing guards, search and the per-role experience.
// Role codes: F fellow, C head of content, O head of operations, T core team, M community member.
// Admin ("A") is always allowed everywhere.

const R = { F: 'fellow', C: 'hoc', O: 'hoo', T: 'core', M: 'community' };
const all = 'FCOTM';
const lead = 'FCOT'; // fellow + HoC + HoO + core team

export const GROUPS = [
  { id: 'start', label: 'Start here' },
  { id: 'today', label: 'Today' },
  { id: 'campus', label: 'My campus' },
  { id: 'content', label: 'Content' },
  { id: 'ops', label: 'Operations' },
  { id: 'team', label: 'Team and growth' },
  { id: 'learn', label: 'Learn' },
  { id: 'involve', label: 'Get involved' },
  { id: 'support', label: 'Support' },
  { id: 'admin', label: 'Admin tools' },
];

// [key, path, label, icon, group, roles, blurb]
const rows = [
  ['home', '/', 'Home', 'Home', 'start', all, 'Your dashboard'],
  ['updates', '/updates', 'What’s new', 'Megaphone', 'start', all, 'Community updates from Under25 and your campus'],
  ['events', '/events', 'Upcoming events', 'CalendarDays', 'today', all, 'RSVP to meetups, sessions and shows'],
  ['tasks', '/tasks', 'Tasks', 'ListChecks', 'today', lead, 'Upcoming tasks and deadlines'],
  ['assigntask', '/assigntask', 'Assign task', 'UserPlus', 'today', 'FCO', 'Hand a task to someone on your team'],

  ['clubpage', '/clubpage', 'Club page', 'Instagram', 'campus', 'FCT', 'Followers, reach and posting rhythm'],
  ['hygiene', '/hygiene', 'Club page hygiene check', 'ClipboardCheck', 'campus', 'FC', 'Handle, bio, logo, highlights, first week of posts'],
  ['onground', '/onground', 'On-ground events', 'PartyPopper', 'campus', 'FO', 'Your campus events, from idea to report'],
  ['listevent', '/listevent', 'List an event', 'CalendarPlus', 'campus', 'FO', 'Event listing form'],
  ['planevent', '/planevent', 'Plan your next event', 'PencilRuler', 'campus', 'T', 'Pitch an event to your Head of Operations'],
  ['summit', '/summit', 'Summit at Campus', 'Mountain', 'campus', 'F', 'Eligibility tracker for the big festival'],
  ['awards', '/awards', 'Campus Awards', 'Trophy', 'campus', lead, '6 categories, 25 awards'],
  ['collegestatus', '/collegestatus', 'College status', 'Building2', 'campus', 'FT', 'Where your campus stands right now'],
  ['recruitment', '/recruitment', 'Club recruitment', 'UsersRound', 'campus', 'F', 'Roles, applications and interviews'],
  ['credentials', '/credentials', 'Credentials log', 'KeyRound', 'campus', 'F', 'Club page logins kept safe for handover'],
  ['uploadphotos', '/uploadphotos', 'Upload photos', 'Camera', 'campus', 'FT', 'Share event photos with Under25'],

  ['contentideas', '/contentideas', 'Content ideas bank', 'Lightbulb', 'content', 'C', 'Next content ideas, ready to shoot'],
  ['contentcal', '/contentcal', 'Content calendar', 'CalendarRange', 'content', 'C', 'Festivals, milestones and posting plan'],
  ['clubresources', '/clubresources', 'Club page resources', 'FolderOpen', 'content', 'FC', 'Brand kit, stickers and templates'],
  ['contentguide', '/contentguide', 'Content guidelines', 'ScrollText', 'content', 'C', 'How Under25 content should look and sound'],
  ['draftroom', '/draftroom', 'The Draft Room', 'Clapperboard', 'content', 'FC', 'Weekly content workshop'],

  ['eventstats', '/eventstats', 'Event statistics', 'BarChart3', 'ops', 'O', 'Attendance, events run and RSVP conversion'],
  ['eventideas', '/eventideas', 'Event ideas', 'Sparkles', 'ops', 'O', 'Next event ideas'],
  ['eventcal', '/eventcal', 'Event calendar', 'CalendarRange', 'ops', 'O', 'Festivals, milestones and event plan'],
  ['checklists', '/checklists', 'Event checklists', 'ClipboardList', 'ops', 'FO', 'Before, day-of and after'],
  ['eventguide', '/eventguide', 'Event guidelines', 'ShieldCheck', 'ops', 'FO', 'Safety, conduct and promises'],

  ['team', '/team', 'Your team', 'Users', 'team', lead, 'People, roles and who to ping'],
  ['structure', '/structure', 'Team structure', 'Network', 'team', lead, 'Roles, openings and the flow chart'],
  ['journey', '/journey', 'College journey', 'Route', 'team', lead, 'Six semesters, six unlocks'],
  ['milestones', '/milestones', 'Milestones', 'Flag', 'team', lead, 'Plaque tiers and unlocks'],
  ['challenges', '/challenges', 'Challenges', 'Swords', 'team', lead, 'Team challenges with proof'],
  ['branded', '/branded', 'Branded opportunities', 'Briefcase', 'team', lead, 'Live briefs from brands'],
  ['citymeetups', '/citymeetups', 'City meetups', 'MapPin', 'team', lead, 'Monthly meetups in your city'],
  ['deadlines', '/deadlines', 'Deadlines', 'AlarmClock', 'team', 'FCO', 'Everything due, in order'],
  ['insight', '/insight', 'Insight form', 'FileText', 'team', 'F', 'The yearly insight form'],
  ['nominate', '/nominate', 'Nominate someone', 'BadgeCheck', 'team', 'FT', 'Nominate a future Fellow or lead'],
  ['alumni', '/alumni', 'Alumni connect', 'GraduationCap', 'team', 'F', 'Ask senior Fellows'],

  ['playbook', '/playbook', 'Playbook', 'BookOpen', 'learn', lead, 'The Fellowship handbook'],
  ['drills', '/drills', 'Drills', 'Dumbbell', 'learn', 'FCO', 'Structured resource packs'],
  ['sessions', '/sessions', 'Sessions', 'Video', 'learn', lead, 'Weekly Hang, Academy, Draft Room, Townhall'],
  ['qna', '/qna', 'QnA', 'MessageCircleQuestion', 'learn', 'F', 'Ask and answer'],
  ['agreement', '/agreement', 'Community agreement', 'Scale', 'learn', all, 'The 7 golden rules'],

  ['join', '/join', 'Join the core team', 'DoorOpen', 'involve', 'MT', 'Apply for a lead role'],
  ['involve', '/involve', 'Perform, volunteer, work with us', 'Handshake', 'involve', 'MT', 'Ways to take part'],
  ['talenthunt', '/talenthunt', 'Student talent hunt', 'Mic', 'involve', all, 'Live overview'],
  ['suggestions', '/suggestions', 'Suggestions', 'MessageSquarePlus', 'involve', all, 'Tell us what to build next'],
  ['certificates', '/certificates', 'Certificates', 'Award', 'involve', all, 'Download what you have earned'],

  ['help', '/help', 'Need help?', 'LifeBuoy', 'support', lead, 'The Under25 Care team'],

  ['database', '/database', 'Full database', 'Database', 'admin', '', 'Name, number, email, college, role'],
  ['applications', '/applications', 'Fellowship applications', 'UserCheck', 'admin', '', 'Accept, reject, interview'],
  ['adminevents', '/adminevents', 'Events and RSVPs', 'CalendarCheck', 'admin', '', 'List events, RSVP counts, assign events'],
  ['leadership', '/leadership', 'HoO, HoC, core details', 'Contact', 'admin', '', 'Everyone leading a club'],
  ['calls', '/calls', 'Team calls', 'CalendarClock', 'admin', '', 'Schedule calls with teams'],
  ['health', '/health', 'Fellow health', 'HeartPulse', 'admin', '', 'Quiet pages and MIA Fellows'],
  ['analytics', '/analytics', 'Program analytics', 'Activity', 'admin', '', 'Batch history and campus coverage'],
  ['programcal', '/programcal', 'Program calendar', 'CalendarRange', 'admin', '', 'The 12-month trajectory'],
  ['docs', '/docs', 'Important docs', 'Files', 'admin', '', 'Playbook, drills, forms and more'],
];

export const FEATURES = rows.map(([key, path, label, icon, group, codes, blurb]) => ({
  key,
  path,
  label,
  icon,
  group,
  blurb,
  roles: ['admin', ...[...codes].map((c) => R[c])],
}));

export const featureByKey = Object.fromEntries(FEATURES.map((f) => [f.key, f]));
export const featureByPath = Object.fromEntries(FEATURES.map((f) => [f.path, f]));
export const canAccess = (roleId, key) => !!featureByKey[key]?.roles.includes(roleId);
export const featuresFor = (roleId) => FEATURES.filter((f) => f.roles.includes(roleId));
