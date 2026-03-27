# 02 — UX Specification

## Design Language

Activist poster aesthetic. Bold, confrontational, urgent — not sterile financial tool vibes. Think protest broadsheet meets infographic.

- **Color palette:** Red, black, stark white
- **Typography:** Heavy, bold — the UI should feel like it has a point of view
- No "tax optimization" language. No broker aesthetics.

---

## Privacy Statement

Displayed prominently, above the fold:

> "This calculator runs entirely in your browser. No data is collected, stored, or transmitted."

---

## Inputs

### Recharacterization Amount
- Number field, dollar amount
- Placeholder: `$7,000`
- Helper note: *"2025 IRA contribution limit: $7,000 ($8,000 if age 50+). 2026 limit: $7,000 ($8,000 if age 50+). Enter the total amount you are considering recharacterizing."*

### Filing Status
- Single-select dropdown
- Options: Single, Married filing jointly, Married filing separately, Head of household

### Expected Taxable Income (This Year)
- Number field, dollar amount
- Helper note: *"This is your income after deductions, not your gross income. Check last year's return for a reference point."*
- The app calculates the marginal rate from 2026 federal tax brackets automatically

### Expected Withdrawal Year
- Number field, four-digit year
- Default: current year + 20
- Helper note: *"The year you expect to start withdrawing from this account."*

### Expected Annual Rate of Return
- Number field, percentage
- Default: `7%`
- Helper note: *"The historical average annual return of a diversified US stock portfolio over a 20-year horizon is approximately 7–8% after inflation."*

---

## Outputs

All outputs display simultaneously after the form is completed, updating **live** as inputs change.

| Output | Description |
|--------|-------------|
| **Tax savings this year** | The amount your federal taxable income decreases by recharacterizing, and the estimated dollar tax savings at your marginal rate |
| **Projected future value** | The recharacterized amount compounded at the entered rate of return from now until the withdrawal year |
| **Estimated future tax owed** | The projected future value taxed at your current marginal rate (used as a conservative estimate — future rates are unknowable) |
| **Net cost of the protest** | The difference between future tax owed and the tax savings realized this year, expressed in today's dollars and future dollars. **This is the honest bottom line — the real price of the action.** |
| **Your marginal tax rate** | Displayed clearly, derived from the 2026 brackets, so users understand what rate is driving the calculation |

---

## Tone and Copy

- Do **not** use the phrase "tax optimization"
- Frame the tool around the concept of **cost and conscience**
- Footer disclaimer:

> *"This calculator is for educational and illustrative purposes only. It is not tax or financial advice. Consult a qualified tax professional before making financial decisions."*
