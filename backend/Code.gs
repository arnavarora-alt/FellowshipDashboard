/**
 * Under25 Community Dashboard: Google Sheet backend (Google Apps Script).
 *
 * Every form on the dashboard is appended as a row to a tab of this spreadsheet (one tab per form type).
 * The admin pages read the rows back with the ADMIN_KEY. Setup steps are in backend/README.md.
 *
 * Script properties (Project Settings > Script properties):
 *   ADMIN_KEY    required. The passphrase admins type in the dashboard to read the sheet.
 *   WRITE_TOKEN  optional. If set, it must match SHEET_TOKEN in the dashboard (a light spam guard, not a secret).
 */

var MAX_CELL = 45000; // Google Sheets allows 50,000 characters per cell
var MAX_COLS = 60;
var MAX_ROWS_READ = 3000;

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return json_({ ok: true, service: 'under25-dashboard-sheet' });
}

function doPost(e) {
  var body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ ok: false, error: 'Bad request' });
  }
  var props = PropertiesService.getScriptProperties();
  try {
    if (body.action === 'append') {
      var token = props.getProperty('WRITE_TOKEN');
      if (token && body.token !== token) return json_({ ok: false, error: 'Forbidden' });
      appendRow_(body.type, body.row || {});
      return json_({ ok: true });
    }
    if (body.action === 'read') {
      var key = props.getProperty('ADMIN_KEY');
      if (!key || body.key !== key) return json_({ ok: false, error: 'Wrong admin key' });
      return json_({ ok: true, sheetUrl: SpreadsheetApp.getActive().getUrl(), tabs: readTabs_(body.types) });
    }
    return json_({ ok: false, error: 'Unknown action' });
  } catch (err2) {
    return json_({ ok: false, error: String(err2 && err2.message ? err2.message : err2) });
  }
}

// Values that start with = + - @ would be run as formulas by Sheets. Force them to plain text.
function safe_(v) {
  var s = String(v);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s.length > MAX_CELL ? s.slice(0, MAX_CELL) : s;
}

function cleanTab_(name) {
  var t = String(name || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 40);
  if (!t) throw new Error('Missing type');
  return t;
}

function appendRow_(type, row) {
  var tab = cleanTab_(type);
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var ss = SpreadsheetApp.getActive();
    var sheet = ss.getSheetByName(tab) || ss.insertSheet(tab);
    var clean = {};
    Object.keys(row).slice(0, MAX_COLS).forEach(function (k) {
      var v = row[k];
      if (v === null || v === undefined) v = '';
      if (typeof v === 'object') v = JSON.stringify(v);
      clean[String(k).slice(0, 40)] = safe_(v);
    });
    var header = sheet.getLastColumn() ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0] : [];
    var missing = Object.keys(clean).filter(function (k) { return header.indexOf(k) < 0; });
    if (missing.length) {
      header = header.concat(missing);
      sheet.getRange(1, 1, 1, header.length).setValues([header]).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
    sheet.appendRow(header.map(function (h) { return clean[h] !== undefined ? clean[h] : ''; }));
  } finally {
    lock.releaseLock();
  }
}

function readTabs_(types) {
  var ss = SpreadsheetApp.getActive();
  var out = {};
  var wanted = types && types.length ? types.map(cleanTab_) : ss.getSheets().map(function (s) { return s.getName(); });
  wanted.forEach(function (name) {
    var sheet = ss.getSheetByName(name);
    if (!sheet || sheet.getLastRow() < 2) { out[name] = []; return; }
    var values = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues();
    var header = values[0];
    var rows = values.slice(1).slice(-MAX_ROWS_READ).map(function (r) {
      var o = {};
      header.forEach(function (h, i) { o[h] = r[i] instanceof Date ? r[i].toISOString() : r[i]; });
      return o;
    });
    out[name] = rows;
  });
  return out;
}
