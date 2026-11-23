import { HashRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import { AppProvider, useApp } from './store/AppState';
import Shell from './components/Shell';
import Login from './pages/Login';
import { FEATURES, canAccess } from './data/features';
import { ROLES } from './data/roles';
import { PageHead } from './components/ui';
import Home from './pages/Home';
import { Updates, UpcomingEvents, OnGround, ListEvent, PlanEvent, TalentHunt } from './pages/Events';
import { Tasks, AssignTask, Deadlines } from './pages/Tasks';
import { Agreement, Join, Involve, Suggestions, Certificates, Nominate, UploadPhotos, Insight, QnA, Alumni } from './pages/Community';
import { Team, Structure, Journey, Milestones, Challenges, Branded, CityMeetups, Help } from './pages/Leadership';
import { ClubPage, Hygiene, ContentIdeas, ContentCal, ClubResources, ContentGuide, DraftRoom } from './pages/Club';
import { EventStats, EventIdeas, EventCal, Checklists, EventGuide } from './pages/Ops';
import { Playbook, Drills, Sessions, Awards, Summit, CollegeStatus, Recruitment, Credentials } from './pages/Fellow';
import { Database, Applications, AdminEvents, Leadership, Calls, Health, Analytics, ProgramCal, Docs } from './pages/Admin';

const PAGES = {
  home: Home, updates: Updates, events: UpcomingEvents, tasks: Tasks, assigntask: AssignTask,
  clubpage: ClubPage, hygiene: Hygiene, onground: OnGround, listevent: ListEvent, planevent: PlanEvent, summit: Summit,
  awards: Awards, collegestatus: CollegeStatus, recruitment: Recruitment, credentials: Credentials, uploadphotos: UploadPhotos,
  contentideas: ContentIdeas, contentcal: ContentCal, clubresources: ClubResources, contentguide: ContentGuide, draftroom: DraftRoom,
  eventstats: EventStats, eventideas: EventIdeas, eventcal: EventCal, checklists: Checklists, eventguide: EventGuide,
  team: Team, structure: Structure, journey: Journey, milestones: Milestones, challenges: Challenges, branded: Branded,
  citymeetups: CityMeetups, deadlines: Deadlines, insight: Insight, nominate: Nominate, alumni: Alumni,
  playbook: Playbook, drills: Drills, sessions: Sessions, qna: QnA, agreement: Agreement,
  join: Join, involve: Involve, talenthunt: TalentHunt, suggestions: Suggestions, certificates: Certificates, help: Help,
  database: Database, applications: Applications, adminevents: AdminEvents, leadership: Leadership, calls: Calls,
  health: Health, analytics: Analytics, programcal: ProgramCal, docs: Docs,
};

function Guard({ k, children }) {
  const { user } = useApp();
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
