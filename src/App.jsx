import { HashRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import { AppProvider, useApp } from './store/AppState';
import Shell from './components/Shell';
import Login from './pages/Login';
import { FEATURES, canAccess, featureByKey } from './data/features';
import { ROLES } from './data/roles';
import { PageHead } from './components/ui';
import Home from './pages/Home';
import { Updates, UpcomingEvents, OnGround, ListEvent, PlanEvent, TalentHunt } from './pages/Events';
import { Tasks, AssignTask } from './pages/Tasks';
import { Join, Involve, Suggestions, Certificates, Nominate, Insight, QnA, Alumni } from './pages/Community';
import { Team, Structure, Journey, Milestones, Challenges, Branded, Help } from './pages/Leadership';
import { ClubPage, Hygiene, ContentIdeas, ContentCal, ClubResources, ContentGuide, DraftRoom, WeeklyHang } from './pages/Club';
import { EventStats, EventIdeas, EventCal } from './pages/Ops';
import { Playbook, Drills, Awards, Summit, CollegeStatus, Recruitment, CredForm, CampusAgreement, PartnerNext } from './pages/Fellow';
import { Approvals, SubmissionsAdmin, DriveLinks, Credentials, Agreements, SpotlightAdmin } from './pages/AdminMore';
import Signup, { Mailbox } from './pages/Signup';
import { Database, Applications, AdminEvents, Leadership, Calls, Health, Analytics, ProgramCal, Docs } from './pages/Admin';

const PAGES = {
  home: Home, updates: Updates, events: UpcomingEvents, tasks: Tasks, assigntask: AssignTask, approvals: Approvals,
  collegestatus: CollegeStatus, clubpage: ClubPage, hygiene: Hygiene, onground: OnGround, listevent: ListEvent, planevent: PlanEvent, summit: Summit,
  awards: Awards, campusagreement: CampusAgreement, partnernext: PartnerNext, recruitment: Recruitment, credform: CredForm,
  contentideas: ContentIdeas, contentcal: ContentCal, clubresources: ClubResources, contentguide: ContentGuide, draftroom: DraftRoom,
  eventstats: EventStats, eventideas: EventIdeas, eventcal: EventCal,
  team: Team, structure: Structure, journey: Journey, milestones: Milestones, challenges: Challenges, branded: Branded,
  insight: Insight, nominate: Nominate, alumni: Alumni,
  playbook: Playbook, drills: Drills, weeklyhang: WeeklyHang, qna: QnA,
  join: Join, involve: Involve, talenthunt: TalentHunt, suggestions: Suggestions, certificates: Certificates, help: Help,
  database: Database, applications: Applications, adminevents: AdminEvents, submissions: SubmissionsAdmin, drivelinks: DriveLinks, credentials: Credentials,
  agreements: Agreements, spotlightadmin: SpotlightAdmin, leadership: Leadership, calls: Calls,
  health: Health, analytics: Analytics, programcal: ProgramCal, docs: Docs,
};

function Guard({ k, children }) {
  const { user, isPartner } = useApp();
  if (canAccess(user.role, k) && featureByKey[k]?.needs === 'partner' && user.role !== 'admin' && !isPartner(user.college)) {
    return (
      <>
        <PageHead title="Locked" sub="Campus Partner next steps unlock once your college management signs the Campus Agreement and Under25 approves it." />
        <Link className="btn" to="/campusagreement">Go to Campus Agreement</Link>
      </>
    );
  }
  if (!canAccess(user.role, k)) {
    return (
      <>
        <PageHead title="Not for your role" sub={`This page is available to other roles. You are signed in as ${ROLES[user.role].label}.`} />
        <Link className="btn" to="/">Back to home</Link>
      </>
    );
  }
  return children;
}

function Protected() {
  const { user } = useApp();
  return user ? <Shell /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/mailbox" element={<Mailbox />} />
          <Route element={<Protected />}>
            {FEATURES.map((f) => {
              const C = PAGES[f.key];
              return <Route key={f.key} path={f.path} element={<Guard k={f.key}><C /></Guard>} />;
            })}
            <Route path="*" element={<><PageHead title="Page not found" sub="That page does not exist." /><Link className="btn" to="/">Back to home</Link></>} />
          </Route>
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}
