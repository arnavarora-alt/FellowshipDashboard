# Google Sheet backend

Every form on the dashboard (Need help?, event listings, executed-event reports, summit requests, insight forms, nominations,
sign-up requests, club page logins, Campus Agreement links, admin decisions…) is appended as a row to a Google Sheet, one tab per
form type. The admin pages read the rows back, so the admin team sees what people send from **any** browser or phone.

You need: a Google account. About 10 minutes. No server and no cost.

## Set up

1. **Create the sheet.** Go to https://sheets.new and name it `Under25 Dashboard`. Leave it empty.
2. **Add the script.** In the sheet: *Extensions > Apps Script*. Delete the sample code and paste the whole of
   [`backend/Code.gs`](Code.gs). Click *Save*.
3. **Set the keys.** In Apps Script: *Project Settings (gear icon) > Script properties > Add script property*:
   - `ADMIN_KEY`: a long passphrase only admins know. Admins type it on the dashboard to read the sheet.
   - `WRITE_TOKEN` (optional): any random string. If you set it, also set the same value as `SHEET_TOKEN` (step 5).
     This only blocks casual spam; it is visible in the site's code, so it is not a secret.
4. **Deploy it.** *Deploy > New deployment > type: Web app*.
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click *Deploy*, allow the permissions, and copy the **Web app URL** (ends in `/exec`).
5. **Point the dashboard at it.**
   - On GitHub: repo *Settings > Secrets and variables > Actions > Variables*, add `SHEET_URL` (the Web app URL) and, if you
     set one, `SHEET_TOKEN`. Then re-run the *Deploy to GitHub Pages* workflow.
   - Or locally: copy `.env.example` to `.env.local`, fill the two values and run `npm run dev`.
6. **Check it.** Send a note from *Need help?*, then log in as admin, open *Care requests*, enter the admin key and press Connect.
   You should see the note, and a `help` tab should have appeared in your sheet.

If you change `Code.gs` later, use *Deploy > Manage deployments > Edit > New version* so the URL stays the same.

## What goes where

| Tab | Written when |
| --- | --- |
| `help` | Need help? note |
| `event-listing`, `event-decision` | Event listing form, admin approve or reject |
| `event-report` | Event marked executed (attendees, description, Drive link, Instagram link) |
| `summit-request` | Summit slot request |
| `insight` | Monthly insight form |
| `successor-nomination`, `club-award-nomination` | Nominations |
| `signup-request`, `signup-decision` | Sign-ups and the approvals made on them |
| `credentials` | Fellow's club page login (private: never shown outside the admin pages) |
| `campus-agreement`, `agreement-decision` | Campus Agreement Drive link and the decision |
| `application-decision` | Fellowship application decisions |
| anything else | Suggestions, perform requests, challenge proofs, and so on |

Photos are never sent. Teams share Drive links, and those links are in the rows.

## What this does not do yet

- **Approvals and accounts are still per browser.** An admin approving an event, or a Fellow approving a sign-up, is recorded in the
  sheet but does not yet change what other people see. New accounts are also created in the browser that approves them. To make those
  work across devices the app needs real accounts and shared state (a proper database or a fuller script).
- **RSVPs, tasks and spotlight banners** are per browser.
- **No real emails.** The ID and password email is still the demo mailbox. Apps Script can send mail with `MailApp`; ask if you want it.

## Security notes

- Anyone can submit a row (the site is public). Rows are capped in size and formula-looking values are stored as text.
- Reading needs `ADMIN_KEY`. Keep it out of the repo. It is only held in the admin's browser tab (`sessionStorage`).
- The `credentials` tab holds club page passwords in plain text inside your Google account. Restrict who the sheet is shared with.
- The demo logins on the login page (`u25-admin` and the rest) are still public. Replace them before real use.

## Try it without Google

```bash
npm run mock-sheet     # fake backend on http://127.0.0.1:8787 (admin key: test-admin-key, token: test-token)
```
Then in the browser console on the dashboard:
`localStorage.setItem('u25.sheetUrl','http://127.0.0.1:8787'); localStorage.setItem('u25.sheetToken','test-token')`
