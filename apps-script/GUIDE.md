# Apps Script Backend Guide

This documents the Google Apps Script project bound to the **"Allowance Toolkit Access"** Google Sheet — the backend behind login, tool access, and usage/export logging for all three tools.

`apps-script/Code.gs` in this repo is a **reference copy**. Editing it here does nothing to the live tool — see [Deploying a change](#deploying-a-change) below.

## What it does

Every HTML tool (hub + V1/V2/V3) sends requests to one Apps Script Web App URL. The script reads/writes a single Google Sheet with three tabs: **Users**, **Usage Log**, and **Export Log**.

## Sheet structure

### `Users` tab

| Col | Field | Notes |
|---|---|---|
| A | Name | |
| B | Email | Matched case-insensitively |
| C | PIN | One-time; becomes unusable after first use |
| D | Status | `UNUSED` → `USED` after the PIN is redeemed. Any other value blocks login entirely ("PIN is inactive") |
| E | Date used | Auto-filled when the PIN is redeemed |
| F | Tool (at redemption) | Auto-filled — which tool card the PIN was used from |
| G | Device ID | Auto-filled on first login; email-based logins after that are locked to this device |
| H | **Access** | Comma-separated tool list, e.g. `V1,V2,V3`. Defaults to `V1,V2` if blank — **new users need this set explicitly to reach V3** |

**To onboard someone:** add a row with Name, Email, and a PIN (Status = `UNUSED`, leave D–G blank), and set column H to whichever tools they should have.

**To grant/revoke tool access for an existing user:** edit column H directly — no PIN reset needed, since access is read fresh on every login/tool-open.

### `Usage Log` tab

Columns: `Timestamp, Name, Email, Pin, Tool, Session Duration, Device ID`

One row per login and per tool visit. The `Pin` column is only populated on the row where a PIN was actually redeemed (used by `logSession` to find the right row to update with session duration).

### `Export Log` tab

Columns: `Timestamp, Name, Email, Tool, Export Type, Device ID, Config Snapshot`

One row per export click (Excel Summary / Adjustment Template / Payroll Instruction, depending on the tool). `Config Snapshot` is the full JSON of whatever rates/eligibility settings were active for that export — useful for reconstructing "what rules were in effect" if a past export is questioned later.

## Actions (`doPost`)

| Action | Called from | Does |
|---|---|---|
| `validate_pin` | Hub login (first time) | Checks the PIN, marks it `USED`, registers the device, logs to Usage Log, returns `access` |
| `validate_email` | Hub login (returning) | Checks email + device match, logs to Usage Log, returns `access` |
| `log_tool_access` | Every tool, on page load | Logs a visit to Usage Log (no side effects on Users) |
| `log_export` | Every export button | Logs to Export Log |
| `log_session` | Hub, on page unload | Backfills session duration onto the matching Usage Log row |

Anything else returns `{success: false, message: 'Unknown action'}` — this is exactly what happens if a client sends an action the backend doesn't recognize yet (this bit the export-logging feature initially, since `log_export` was added client-side before this backend case existed).

## Deploying a change

Saving the script does **not** update the live Web App URL that the HTML files call. After editing `Code.gs` in the Apps Script editor:

1. **Deploy → Manage deployments**
2. Click the pencil (edit) icon on the existing deployment
3. **Version: New version**
4. **Deploy**

Skipping this means your edits exist in the editor but the deployed endpoint keeps running the old code.

## Adding a new action

Follow the existing pattern — add a case in `doPost`, and a corresponding function:

```javascript
if (action === 'my_new_action') return respond(myNewFunction(data.some_field));
```

Client-side (in the HTML files), sends are fire-and-forget with a `try/catch` — a typo in the action name, or a backend that hasn't been redeployed with the matching case, fails **silently** with no visible error to the user. If a new logging feature seems to "not be working," check here first: confirm the exact action string matches on both sides, and confirm the deployment was actually redeployed after the backend edit.
