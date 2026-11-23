// Task view for a user: seeded and assigned tasks, auto-completing tasks, and the monthly insight form.

export function monthlyInsight(now, user, state) {
  if (!user || !['fellow', 'hoo'].includes(user.role)) return null;
  const y = now.getFullYear();
  const m = now.getMonth();
  const key = `${y}-${String(m + 1).padStart(2, '0')}`;
  const unlock = new Date(y, m, 25, 9, 0);
  const due = new Date(y, m + 1, 0, 23, 59);
  return {
    id: `t-insight-${key}`,
    title: 'Monthly insight form',
    text: 'Mandatory for Fellows and Heads of Operations. It opens on the 25th of every month.',
    assignee: user.id,
    due: due.toISOString(),
    unlock: unlock.toISOString(),
    locked: now < unlock,
    status: state.flags[`insight:${key}:${user.id}`] ? 'done' : 'todo',
    by: 'Under25 Team',
    priority: 'High',
    to: '/insight',
    mandatory: true,
    monthKey: key,
  };
}

export function derive(task, state, user) {
  if (task.auto === 'cred' && state.credentials.some((c) => c.userId === user.id)) return { ...task, status: 'done' };
  if (task.auto === 'agreement' && state.agreements.some((a) => a.college === user.college && a.status === 'approved')) return { ...task, status: 'done' };
  return task;
}

export function userTasks(state, user, now = new Date()) {
  if (!user) return [];
  const base = state.tasks.filter((t) => user.role === 'admin' || t.assignee === user.id).map((t) => derive(t, state, user));
  const ins = monthlyInsight(now, user, state);
  return ins ? [ins, ...base] : base;
}
