// Tests the Google Sheet backend protocol against the in-memory mock. Part of `npm test`.
import { createSheetMock } from './sheet-mock.mjs';

let failed = 0;
const ok = (cond, msg) => { if (!cond) { failed++; console.error(`FAIL  ${msg}`); } else console.log(`ok    ${msg}`); };
const m = createSheetMock();
const T = 'test-token';
const K = 'test-admin-key';

ok(m.post({ action: 'append', token: 'nope', type: 'help', row: { a: 1 } }).ok === false, 'append without the write token is refused');
ok(m.post('not json').ok === false, 'malformed requests are refused');
ok(m.post({ action: 'append', token: T, type: 'help', row: { id: 's1', topic: 'Event planning', text: 'How do I get a venue approved?', name: 'Ananya Rao' } }).ok, 'append creates the tab and a row');
ok(m.tabs.get('help')[0].join() === 'id,topic,text,name' && m.tabs.get('help')[1].join('|') === 's1|Event planning|How do I get a venue approved?|Ananya Rao', 'header row and data row are written');
m.post({ action: 'append', token: T, type: 'help', row: { id: 's2', topic: 'Other', email: 'a@b.co' } });
ok(m.tabs.get('help')[0].includes('email') && m.tabs.get('help')[2][m.tabs.get('help')[0].indexOf('email')] === 'a@b.co', 'new fields add new columns');
ok(m.tabs.get('help')[2][m.tabs.get('help')[0].indexOf('text')] === '', 'missing fields stay blank');
m.post({ action: 'append', token: T, type: 'insight', row: { note: '=HYPERLINK("http://evil","x")', other: '+1', plain: 'fine', obj: { a: 1 } } });
const ins = m.tabs.get('insight');
ok(ins[1][0].startsWith("'=") && ins[1][1].startsWith("'+") && ins[1][2] === 'fine' && ins[1][3] === '{"a":1}', 'formula-looking values are forced to text and objects are stringified');
m.post({ action: 'append', token: T, type: 'big', row: { v: 'x'.repeat(60000) } });
ok(m.tabs.get('big')[1][0].length <= 45000, 'oversized values are trimmed to fit a cell');
ok(m.post({ action: 'append', token: T, type: '../..', row: { a: 1 } }).ok === false && ![...m.tabs.keys()].some((k) => k.includes('.') || k.includes('/')), 'tab names are sanitised');

ok(m.post({ action: 'read', key: 'wrong' }).ok === false, 'read with the wrong admin key is refused');
const r = m.post({ action: 'read', key: K, types: ['help', 'nothing'] });
ok(r.ok && r.tabs.help.length === 2 && r.tabs.help[0].topic === 'Event planning' && Array.isArray(r.tabs.nothing) && r.tabs.nothing.length === 0 && r.sheetUrl.includes('spreadsheets'), 'admin read returns rows as objects, empty tabs as [], and the sheet link');
const all = m.post({ action: 'read', key: K });
ok(Object.keys(all.tabs).includes('insight') && Object.keys(all.tabs).includes('help'), 'reading with no list returns every tab');

const open = createSheetMock({ ADMIN_KEY: 'k' });
ok(open.post({ action: 'append', type: 'x', row: { a: 1 } }).ok, 'with no WRITE_TOKEN configured, appends are accepted');
ok(createSheetMock({}).post({ action: 'read', key: '' }).ok === false, 'with no ADMIN_KEY configured, nothing can be read');

console.log(failed ? `\n${failed} sheet check(s) failed` : '\nSheet backend checks passed');
process.exit(failed ? 1 : 0);
