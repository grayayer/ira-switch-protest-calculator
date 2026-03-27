# 05 — Technical Specification

## Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Language | TypeScript | Type safety on financial calculations; catches unit errors at compile time |
| Framework | React 18 | Live-updating outputs as inputs change; component-based structure is clean for this use case |
| Styling | CSS Modules | Scoped styles, no runtime overhead, full design control for activist aesthetic |
| Build tool | Vite | Fast dev server, minimal config, modern defaults |
| Deployment | Static HTML/JS/CSS | No server required; can be hosted on GitHub Pages, Netlify, or Vercel |
| Dependencies | Zero runtime deps beyond React | Keeps the bundle small and auditable |

---

## Project Structure

```
/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── App.module.css
│   ├── components/
│   │   ├── InputForm/
│   │   │   ├── InputForm.tsx
│   │   │   └── InputForm.module.css
│   │   ├── ResultPanel/
│   │   │   ├── ResultPanel.tsx
│   │   │   └── ResultPanel.module.css
│   │   └── TaxBracketBadge/
│   │       ├── TaxBracketBadge.tsx
│   │       └── TaxBracketBadge.module.css
│   ├── lib/
│   │   ├── taxBrackets.ts
│   │   ├── calculator.ts
│   │   └── types.ts
│   └── constants/
│       └── limits.ts
```

---

## Data Types

```typescript
type FilingStatus =
  | 'single'
  | 'marriedFilingJointly'
  | 'marriedFilingSeparately'
  | 'headOfHousehold';

interface CalculatorInputs {
  recharacterizationAmount: number;
  filingStatus: FilingStatus;
  taxableIncome: number;
  withdrawalYear: number;
  annualReturnRate: number; // decimal, e.g. 0.07
}

interface CalculatorResults {
  marginalRate: number;
  taxSavingsThisYear: number;
  projectedFutureValue: number;
  estimatedFutureTaxOwed: number;
  netCostNominal: number;
  yearsToWithdrawal: number;
}
```

---

## Tax Bracket Data

Store the 2026 federal tax brackets as a static typed constant in `taxBrackets.ts`. Each filing status gets its own bracket array.

```typescript
interface TaxBracket {
  rate: number;   // decimal, e.g. 0.22
  min: number;    // lower bound of bracket
  max: number | null; // null = top bracket, no ceiling
}
```

### 2026 Federal Tax Brackets

**Single / Married Filing Separately**
| Rate | Income Range |
|------|-------------|
| 10% | $0 – $11,925 |
| 12% | $11,926 – $48,475 |
| 22% | $48,476 – $103,350 |
| 24% | $103,351 – $197,300 |
| 32% | $197,301 – $250,525 |
| 35% | $250,526 – $626,350 |
| 37% | $626,351+ |

**Married Filing Jointly**
| Rate | Income Range |
|------|-------------|
| 10% | $0 – $23,850 |
| 12% | $23,851 – $96,950 |
| 22% | $96,951 – $206,700 |
| 24% | $206,701 – $394,600 |
| 32% | $394,601 – $501,050 |
| 35% | $501,051 – $751,600 |
| 37% | $751,601+ |

**Head of Household**
| Rate | Income Range |
|------|-------------|
| 10% | $0 – $17,000 |
| 12% | $17,001 – $64,850 |
| 22% | $64,851 – $103,350 |
| 24% | $103,351 – $197,300 |
| 32% | $197,301 – $250,500 |
| 35% | $250,501 – $626,350 |
| 37% | $626,351+ |

> **Note:** Married filing separately uses the same brackets as single. Verify head of household thresholds against the IRS website before treating them as final.

---

## Core Calculation Logic (`calculator.ts`)

### Step 1 — Determine Marginal Rate
Find the bracket where `taxableIncome` falls. Return that bracket's rate. This is the marginal rate displayed to the user and used throughout.

### Step 2 — Tax Savings This Year
```
taxSavingsThisYear = recharacterizationAmount × marginalRate
```
This is the federal income tax the user avoids paying this year by shifting the contribution to a traditional IRA.

### Step 3 — Projected Future Value
```
yearsToWithdrawal = withdrawalYear − currentYear
projectedFutureValue = recharacterizationAmount × (1 + annualReturnRate) ^ yearsToWithdrawal
```

### Step 4 — Estimated Future Tax Owed
```
estimatedFutureTaxOwed = projectedFutureValue × marginalRate
```
Using the current marginal rate as a proxy for the future rate. This is a known simplification — future tax rates are unknowable. The UI should note this clearly.

### Step 5 — Net Cost of the Protest
```
netCostNominal = estimatedFutureTaxOwed − taxSavingsThisYear
```
This is the core output. A **positive number** means the protest has a long-run financial cost. A **negative number** means recharacterization actually saves money overall — which can happen for users who expect to be in a lower bracket at withdrawal.

---

## IRA Contribution Limit Constants (`limits.ts`)

```typescript
export const IRA_LIMITS = {
  2025: { under50: 7000, over50: 8000 },
  2026: { under50: 7000, over50: 8000 },
};
```

---

## Validation Rules

| Field | Rule |
|-------|------|
| `recharacterizationAmount` | Greater than 0; warn (not block) if above $8,000 |
| `taxableIncome` | Greater than 0 |
| `withdrawalYear` | Must be greater than current year |
| `annualReturnRate` | Between 0.1% and 20%; warn outside 4–12% |

---

## UI Behavior

- All outputs update **live** (via React state) as inputs change — no submit button
- Marginal rate badge appears as soon as filing status and taxable income are both entered
- Results panel is visible at all times but shows placeholder dashes until inputs are valid
- No data leaves the browser at any point — no analytics, no tracking, no API calls

---

## Accessibility

- All form inputs have associated labels
- Color is never the sole means of conveying information
- Contrast ratios meet WCAG AA minimum
- Keyboard navigable

---

## Deployment

The production build outputs a static `dist/` folder. It can be deployed to:

- **GitHub Pages** (recommended for open source transparency)
- **Netlify or Vercel** (zero-config)
- Any static web host

No environment variables, no server, no build secrets required.
