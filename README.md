# Allowance Generator Toolkit

A set of standalone HR/payroll allowance-computation tools built as static HTML files, sharing a common hub and a Google Apps Script backend for PIN/email-based access and usage logging.

## Structure

```
├── index.html                     # Hub — landing page, PIN/email login, links to all three tools
├── ot_allowance_report.html       # V1 — Bracket-Based Overtime Allowance Generator
├── special_work_assignment.html  # V2 — Special Work Assignment Allowance Generator
├── daily_allowance.html           # V3 — Daily Allowance Generator
└── apps-script/
    └── Code.gs                    # Backend: PIN/email validation, Usage Log, Export Log
```

**Important:** the four HTML files must stay in the same flat folder (not moved into subfolders) — the hub links to the other three using relative paths like `href="ot_allowance_report.html"`.

## What each tool does

- **V1 (Bracket-Based Overtime Allowance)** — computes OT allowances based on rendered overtime hours against configurable brackets, per your company's policy.
- **V2 (Special Work Assignment)** — computes allowances for special work assignments based on approved OT hours and a per-hour rate, with separate weekday/weekend rate logic.
- **V3 (Daily Allowance Generator)** — computes daily Food/Transportation/Hazard Pay allowance per employee tier, cross-referencing Attendance Report, Approval Center Report, Attendance Management (biometric/COA) logs, and Employee List Report to determine Onsite/WFH/Leave/Holiday/Rest Day status per day.

All three tools:
- Gate access via a PIN (first login) or email (returning device) against a Google Sheet's `Users` tab
- Log every tool visit to `Usage Log`, and every export (Excel Summary / Adjustment Template / Payroll Instruction, depending on the tool) to `Export Log`, both in the same Sheet
- Let you configure rates/eligibility rules in the UI, with settings auto-saved to `localStorage`

## Backend setup (Apps Script)

`apps-script/Code.gs` is a reference copy of the backend code — pasting it into GitHub does **not** automatically update the live Apps Script project. To deploy changes:

1. Open the Apps Script project bound to the "Allowance Toolkit Access" Google Sheet
2. Paste in the updated `Code.gs` content
3. **Deploy → Manage deployments → Edit (pencil) → New version → Deploy** — saving alone does not update the already-published Web App URL that the HTML files call

The Sheet itself (containing real names, emails, PINs, and usage/export logs) is **not** included here and should never be committed — it's the live data store, not code.

## Local development

These are plain static files — no build step, no dependencies beyond what's loaded via CDN (`xlsx.full.min.js` for spreadsheet import/export). Open any of the four `.html` files directly in a browser to test, though note that `localStorage`-based sessions may not persist reliably when opened via `file://` in some browsers (Safari in particular) — hosting them on any static file server avoids that issue.

## What's intentionally excluded from this repo

- The Google Sheet itself (PII: names, emails, PINs, usage/export history)
- Any uploaded Attendance Report / Employee List Report / Approval Center Report test files (real employee data)
- Any real PIN values or session tokens
