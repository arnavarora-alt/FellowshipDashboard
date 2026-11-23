// Read an image file and shrink it so it fits comfortably in localStorage.
export function readImage(file, max = 320, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) return reject(new Error('Choose an image file.'));
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * s);
      c.height = Math.round(img.height * s);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('That image could not be read.')); };
    img.src = url;
  });
}

// Read any small file (PDF, image) as a data URL. Rejects above the size limit.
export function readFileData(file, limit = 900_000) {
  return new Promise((resolve, reject) => {
    if (file.size > limit) return reject(new Error(`File is too large (${Math.round(file.size / 1024)} KB). Keep it under ${Math.round(limit / 1024)} KB.`));
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(new Error('That file could not be read.'));
    r.readAsDataURL(file);
  });
}

export const gcalLink = (e) => {
  const fmt = (d) => new Date(d).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const start = new Date(e.when);
  const end = new Date(start.getTime() + (e.minutes || 60) * 60000);
  const p = new URLSearchParams({ action: 'TEMPLATE', text: e.title, dates: `${fmt(start)}/${fmt(end)}`, details: `${e.text || ''}\n\nUnder25 Campus Fellowship`, location: e.where || 'Online' });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
};
