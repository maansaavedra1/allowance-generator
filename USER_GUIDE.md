# Allowance Generator Toolkit — User Guide

A guide for Customer Success Managers on how to log in and use each of the three allowance tools. No technical background needed — this covers what to upload, what the buttons do, and how to read the results.

---

## Logging In

1. Open the hub link your admin gave you.
2. **First time using the toolkit?** Type the PIN your admin sent you. The box will show plain text while you type it, and switch to a masked/spaced style once it recognizes you're entering a PIN (not letters).
3. **Used it before on this device?** Just type your email address instead — no PIN needed.
4. Once you're in, you'll see cards for whichever tools you have access to. Click a card to open that tool.

If you see "Access Restricted," it means your account isn't set up for that specific tool yet — contact your Customer Success Manager (or whoever manages the toolkit) to get added.

---

## V1 — Bracket-Based Overtime Allowance Generator

**What it's for:** Computing OT allowances based on rendered overtime hours, using your company's rate brackets.

### Steps

1. **Upload the Attendance Report.** Drag it into the upload box, or click to browse. If you upload the wrong file type, you'll get a clear message telling you what's expected instead of a confusing error.
2. **Check your Allowance Types.** These are the rate brackets (e.g., "first 3 hours at ₱X, next hours at ₱Y") — they're pre-configured, but you can adjust them if your policy changes.
3. Click **Generate Report** (or the equivalent compute button).
4. **Review the results table** — one row per employee, showing their total OT hours and total allowance.
5. **See the day-by-day detail:** click on any employee's row to expand it. You'll see:
   - Their actual attendance logs for each day (not just the scheduled shift) — this is your evidence trail if anyone questions a number
   - The specific OT hours and allowance broken down per day
   - Totals at the bottom
6. **Export.** Three options, all under the export buttons:
   - **Excel Summary** — one row per employee, for your own records
   - **Adjustment Template** — formatted for direct upload into Sprout Payroll (you'll be asked to confirm the Adjustment Type/Name/Code before it exports)
   - **Payroll Instruction** — a different formatted export for payroll processing

---

## V2 — Special Work Assignment Allowance Generator

**What it's for:** Computing allowances for special work assignments, with different rates for weekday vs. weekend OT.

### Steps

Same overall flow as V1:

1. Upload the Attendance Report.
2. Check the rate configuration — weekday OT uses a fixed rate; weekend OT is calculated from base salary with a configurable premium percentage.
3. Generate the report.
4. Click into any employee's row to see their day-by-day breakdown.
5. Export using the same three options as V1 (Excel Summary, Adjustment Template, Payroll Instruction).

---

## V3 — Daily Allowance Generator

**What it's for:** Computing daily Food, Transportation, and Hazard Pay allowance based on each employee's Job Code and their actual attendance status each day (Onsite, Work From Home, Leave, Holiday, etc.).

This one needs more input files than V1/V2 because it has to piece together attendance evidence from several different sources — and it does that piecing-together very deliberately, since getting it wrong means someone gets paid incorrectly.

### What to upload

| File | What it's for |
|---|---|
| **Employee List Report** | Employee names, IDs, **Job Code** (matches against the Tier Rate Table to determine their rate), **No. of Hours to Work** (their required shift length), **Payroll Type** (Daily/Hourly/Semi-Monthly — used to split the Adjustment Template export) |
| **Attendance Report** | Actual hours worked, late minutes, Holiday/Rest Day shift tags |
| **Approval Center Report** | Approved Work-From-Home requests (Official Business), Leave, and Schedule Adjustments |
| **Attendance Management** | Biometric clock-in logs ("auto push") and Certificate of Attendance (COA) filings — the only two things that confirm someone was physically Onsite |
| **Adjustment Template** *(optional)* | If you have your own Payrollpie template, upload it here and the tool fills it in directly instead of building a new one |

You don't need all five before you can start — upload what you have, and the tool recomputes automatically as more files come in.

### Checking your settings

Before generating the report, two things are worth a quick glance:

- **Tier Rate Table** — the Food/Transportation/Hazard rate for each Job Code. Editable if rates change.
- **Eligibility Matrix** — organized around a simple idea: **Onsite and WFH are the only two "primary" identifiers of allowance.** Every other status you see (Late, Half Day, worked Holiday, etc.) ultimately resolves down to one of these two, or to no allowance at all — the matrix groups them this way on purpose, with "Derived statuses" shown separately below the two primary rows.

### How a day gets its status, in plain terms

1. **Is there an approved Schedule Adjustment on file for this date?** If so, that's checked first — actual hours worked get compared against required hours, and if short, nothing else matters.
2. **Was it a Rest Day or Holiday, and did they work it?** If so, it still comes down to step 4 below — working a holiday doesn't automatically mean full pay anymore, it depends on how you clocked in.
3. **Did they work about half the day, with a leave record for the other half?** If so, the *worked* half still needs to be Onsite or WFH-confirmed to know which allowance applies (see step 4).
4. **How was the day actually confirmed?**
   - **COA or an auto-push biometric punch** → Onsite (full allowance: Food + Transportation + Hazard)
   - **An approved WFH request (Official Business)** → WFH (Food only)
   - **Both, on the same day (a split day)** → whichever one started earlier wins for the whole day, based on the actual punch time vs. the WFH request's start time. COA has no timestamp of its own, so it always wins over WFH regardless of time.
   - **Neither** → Unverified, no allowance
5. **Did they work enough of the shift?** Working **more than half** the shift (minus a 1-hour break) gets full allowance based on step 4 above, *even if it's still short of the complete shift*. Working **at or below half**, with nothing on file to explain it, gets no allowance ("SA < required hours").
6. **Is there a Leave record that explains an otherwise-blank day?** An approved Leave (whole day or half day) can turn what would've been "Unverified" or "Non-working Holiday" into "On Leave" instead — same zero allowance either way, just a more accurate reason on record.

### Generating and reading results

1. Click **Generate Report**.
2. The top shows summary stats: total employees, total Food/Transportation/Hazard, and grand total.
3. Use the filters to narrow down the results table — search by name, filter by Job Code, or show only employees with (or without) an allowance.
4. **Click any employee's row** to see their full day-by-day breakdown for the period. Each day shows:
   - A **status badge** — green means it resulted in an allowance, red/muted means it didn't
   - A short note underneath explaining *why* — e.g., "Confirmed via COA," "Confirmed via approved OB," "Clock-in method not recognized," "No logs/leave found on the other half"
   - The Food/Transportation/Hazard amount for that specific day

This is your audit trail. If someone asks "why didn't I get paid for August 13th," open their row and read the note — it names the exact piece of evidence (or lack of it) that drove the result.

### What the common statuses mean

| Status | What it means |
|---|---|
| **Onsite** | Confirmed present via biometric auto-push or a COA filing — full allowance |
| **Onsite (Late)** | Same as above, but they clocked in late |
| **WFH** | Confirmed via an approved Work-From-Home (Official Business) request — Food only |
| **On Leave** | Approved whole-day leave — no allowance |
| **Half day work, on leave on the other half** | An approved half-day leave with no clock-in confirmation for the worked half — no allowance, since we can't tell whether it should have been Onsite- or WFH-level pay |
| **Half-day work, unconfirmed on the other half** | Worked roughly half the day (confirmed Onsite or WFH), but nothing explains why the rest of the day is missing — no allowance |
| **Non-working Holiday** | An unworked holiday — no allowance |
| **SA < required hours** | Hours worked fell at or below half the shift, with nothing on file (leave or Schedule Adjustment) to explain it — no allowance. *Working more than half the shift no longer falls into this bucket — it gets full allowance instead, per Onsite/WFH.* |
| **Unverified** | No clock-in evidence of any kind for that date — no allowance, regardless of what hours the Detailed sheet shows |

A worked Holiday or Rest Day doesn't get its own separate status anymore — it shows as **Onsite** or **WFH** directly (with a note like "Worked during Holiday"), since its eligibility now follows the same clock-in rule as everything else.

### Exporting

- **Excel Summary** — two tabs: one aggregate row per employee, and a full "Daily Breakdown" tab with every employee's day-by-day detail (same data as the click-through view, in spreadsheet form).
- **Adjustment Template** — automatically split into **two separate files** based on each employee's Payroll Type from the Employee List Report:
  - `..._DailyPaid_[date].xlsx` — Daily and Hourly employees together
  - `..._SemiMonthly_[date].xlsx` — Semi-Monthly employees
  - Employees with a **blank or unrecognized Payroll Type are excluded from both files**, with a warning listing their names so you know who needs their record corrected before re-running.
  - If you uploaded your own Payrollpie template, both files are built by filling that template in-place rather than from scratch.

---

## Getting Help

If a report looks wrong, the fastest way to figure out why is usually: click into the specific employee's row, find the specific day, and read the note under the status badge. That note almost always tells you exactly which file or rule produced that result — which is the information you'll need if you have to escalate a question about someone's pay.
