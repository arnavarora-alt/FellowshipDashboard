// Who approves what.
//  - Community member: nobody, instant.
//  - Fellow: the Under25 admin team.
//  - Head of Content, Head of Operations: the Fellow of their college.
//  - Core team member: the Head of their team (Content or Operations) or the Fellow.
export const APPROVER_TEXT = {
  community: 'No approval needed. You get your ID and password straight away.',
  core: 'Approved by your Head of Content or Head of Operations (depending on your team), or by your Fellow.',
  hoc: 'Approved by your Fellow.',
  hoo: 'Approved by your Fellow.',
  fellow: 'Approved by the Under25 admin team.',
};

export const canApprove = (user, s) => {
  if (!user || s.status !== 'pending') return false;
  if (user.role === 'admin') return true;
  const same = (user.college || '').toLowerCase() === (s.college || '').toLowerCase();
  if (!same) return false;
  if (user.role === 'fellow') return ['hoc', 'hoo', 'core'].includes(s.role);
  if (user.role === 'hoc') return s.role === 'core' && s.team === 'Content';
  if (user.role === 'hoo') return s.role === 'core' && s.team === 'Operations';
  return false;
};
