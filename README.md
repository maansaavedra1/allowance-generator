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
- **V3 (Daily Allowance Generator)** — computes daily Food/Transportation/Hazard Pay allowance per employee, based on Job Code (tier) and each day's attendance status. Cross-references five Sprout exports at once (Employee List, Attendance Report, Approval Center Report, Attendance Management, and an optional uploaded Adjustment Template) to classify every employee-day as Onsite, WFH, Late, Half Day (several variants), Leave, worked/unworked Holiday or Rest Day, an unexplained shortfall, or Unverified — see the [V3 section below](#v3-daily-allowance-generator-details) for the full rule set. Adjustment Template exports are automatically split into two files by Payroll Type (Daily/Hourly vs. Semi-Monthly).

All three tools:
- Gate access via a PIN (first login) or email (returning device) against a Google Sheet's `Users` tab
- Log every tool visit to `Usage Log`, and every export (Excel Summary / Adjustment Template / Payroll Instruction, depending on the tool) to `Export Log`, both in the same Sheet
- Let you configure rates/eligibility rules in the UI, with settings auto-saved to `localStorage`

## V3 (Daily Allowance Generator) details

### Inputs (upload what you have — recomputes automatically as more arrive)

| File | Provides |
|---|---|
| Employee List Report | Employee ID, name, **Job Code** (matched against the Tier Rate Table), **No. of Hours to Work**, **Payroll Type**, Biometric ID |
| Attendance Report (Detailed sheet) | Actual hours worked, Late minutes, Holiday/Rest Day shift tags, differential-pay columns |
| Approval Center Report | Official Business (→ WFH), Leave, Schedule Adjustment sheets |
| Attendance Management | Biometric auto-push logs and Certificate of Attendance (COA) filings |
| Adjustment Template *(optional)* | If uploaded, exports fill this template in-place instead of building a fresh one |

### Classification priority (highest to lowest)

1. **Approved Schedule Adjustment on file** for that date — cross-checks actual hours vs. required hours; if short, overrides any tag-based classification.
2. **Rest Day / Holiday tags** — worked or not, and if worked, resolved to Onsite/WFH per below.
3. **Half Day (shift tagged, or a leave record ≈0.5 day matching the actual hours)** — resolved to Onsite/WFH based on clock-in evidence for the worked half.
4. **Onsite vs. WFH resolution** — COA and auto-push confirm Onsite; an approved Official Business (OB) confirms WFH. If *both* exist for the same date (a split day), whichever started earlier (by actual punch time vs. the OB's Time From) wins for the whole day. COA always wins over WFH regardless of time, since it has no timestamp of its own.
5. **Hours-vs-shift check** — hours at or below half the shift (minus a fixed 1-hour break), with nothing filed to explain it, get no allowance ("SA < required hours"). Anything **above** half the shift gets full allowance based on whichever of Onsite/WFH applies, even if still short of the complete shift.
6. **Leave** (whole-day or half-day) can override an otherwise-unconfirmed day like Non-working Holiday or Unverified.
7. **Unverified** — no clock-in evidence of any kind for that date; no allowance, regardless of what hours the Detailed sheet shows.

Onsite and WFH are the only two eligibility "primary identifiers" — every other status resolves to one of these two, or to no allowance. This is also how the Eligibility Matrix in the UI is organized.

### Exports

- **Excel Summary** — two tabs: aggregate per-employee totals, plus a full day-by-day "Daily Breakdown" tab.
- **Adjustment Template** — automatically split into **two separate files** by each employee's Payroll Type in the Employee List Report: `..._DailyPaid_[date].xlsx` (Daily + Hourly) and `..._SemiMonthly_[date].xlsx`. Employees with a blank/unrecognized Payroll Type are excluded from both, with a warning listing who was skipped.

## Backend setup (Apps Script)

`apps-script/Code.gs` is a reference copy of the backend code — pasting it into GitHub does **not** automatically update the live Apps Script project. To deploy changes:

1. Open the Apps Script project bound to the "Allowance Toolkit Access" Google Sheet
2. Paste in the updated `Code.gs` content
3. **Deploy → Manage deployments → Edit (pencil) → New version → Deploy** — saving alone does not update the already-published Web App URL that the HTML files call

The Sheet itself (containing real names, emails, PINs, and usage/export logs) is **not** included here and should never be committed — it's the live data store, not code.

**For the full picture** — Sheet column structure, supported actions, and how to onboard a user or grant tool access — see [`apps-script/GUIDE.md`](apps-script/GUIDE.md).

## Local development

These are plain static files — no build step, no dependencies beyond what's loaded via CDN (`xlsx.full.min.js` for spreadsheet import/export). Open any of the four `.html` files directly in a browser to test, though note that `localStorage`-based sessions may not persist reliably when opened via `file://` in some browsers (Safari in particular) — hosting them on any static file server avoids that issue.

## What's intentionally excluded from this repo

- The Google Sheet itself (PII: names, emails, PINs, usage/export history)
- Any uploaded Attendance Report / Employee List Report / Approval Center Report test files (real employee data)
- Any real PIN values or session tokens
