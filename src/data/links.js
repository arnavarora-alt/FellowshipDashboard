// Outbound links used across the dashboard. Change them here.

// Where events are listed and RSVP'd on the Under25 app. Replace with the real app / event deep link.
export const APP_EVENTS_URL = 'https://under25.club';

// Fallback when a campus has no club page handle on file yet.
export const INSTAGRAM_FALLBACK = 'https://www.instagram.com/';

export const instagramUrl = (handle) => {
  if (!handle) return INSTAGRAM_FALLBACK;
  if (/^https?:/i.test(handle)) return handle;
  return `https://www.instagram.com/${String(handle).replace(/^@/, '').replace(/\/$/, '')}/`;
};
