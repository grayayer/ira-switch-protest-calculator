import { CalculatorResults } from '../../lib/types';
import Tooltip from '../Tooltip/Tooltip';
import styles from './ResultPanel.module.css';

const INFLATION_TOOLTIP =
  'This figure is in nominal future dollars — it is not automatically adjusted for inflation. ' +
  'However, if you use an inflation-adjusted (real) rate of return — like the default 7%, ' +
  'which reflects historical stock returns after inflation — the result approximates ' +
  'the cost in today\'s purchasing power. If you enter a higher nominal rate (e.g. 10%), ' +
  'the figure will be in inflated future dollars and will look larger.';

interface ResultPanelProps {
  results: CalculatorResults | null;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}

interface ResultRowProps {
  label: string;
  value: string;
  subLabel?: string;
  prominent?: boolean;
  positive?: boolean; // true = cost, false = savings
}

function ResultRow({ label, value, subLabel, prominent, positive }: ResultRowProps) {
  return (
    <div className={`${styles.row} ${prominent ? styles.rowProminent : ''}`}>
      <div className={styles.rowLabel}>
        <span className={styles.labelText}>{label}</span>
        {subLabel && <span className={styles.subLabel}>{subLabel}</span>}
      </div>
      <span
        className={`${styles.value} ${prominent ? styles.valueLarge : ''} ${
          positive === true ? styles.valueCost : positive === false ? styles.valueSavings : ''
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default function ResultPanel({ results }: ResultPanelProps) {
  const dash = '—';

  const isPositiveCost = results !== null && results.netCostNominal > 0;
  const isNegativeCost = results !== null && results.netCostNominal < 0;

  return (
    <section className={styles.panel} aria-label="Calculation results" aria-live="polite">
      <h2 className={styles.sectionTitle}>THE BOTTOM LINE</h2>

      {/* Featured output */}
      <div className={`${styles.featured} ${results ? (isPositiveCost ? styles.featuredCost : styles.featuredSavings) : ''}`}>
        <span className={styles.featuredLabel}>
          NET COST OF THE PROTEST
          <Tooltip
            content={INFLATION_TOOLTIP}
            label="How is this figure calculated? Does it account for inflation?"
          />
        </span>
        <span className={styles.featuredValue}>
          {results ? formatCurrency(Math.abs(results.netCostNominal)) : dash}
        </span>
        {results && (
          <span className={styles.featuredContext}>
            {isPositiveCost
              ? 'The long-run cost of your action. In today\'s dollars if you used a real (after-inflation) return rate.'
              : isNegativeCost
              ? 'Recharacterization may actually save you money overall — you may be in a lower bracket at withdrawal.'
              : 'Break even — no long-run financial cost.'}
          </span>
        )}
      </div>

      <div className={styles.rows}>
        <ResultRow
          label="Tax savings this year"
          subLabel="Federal income tax avoided by shifting to traditional IRA"
          value={results ? formatCurrency(results.taxSavingsThisYear) : dash}
          positive={false}
        />
        <ResultRow
          label="Projected future value"
          subLabel={results ? `In ${results.yearsToWithdrawal} years at your rate of return` : 'Amount compounded to withdrawal year'}
          value={results ? formatCurrency(results.projectedFutureValue) : dash}
        />
        <ResultRow
          label="Estimated future tax owed"
          subLabel="Projected value taxed at your current marginal rate"
          value={results ? formatCurrency(results.estimatedFutureTaxOwed) : dash}
          positive={true}
        />
        <ResultRow
          label="Your marginal rate"
          subLabel="2026 federal brackets — drives all estimates"
          value={results ? formatPercent(results.marginalRate) : dash}
        />
      </div>

      {!results && (
        <p className={styles.placeholder}>
          Fill in all five fields above to see your results.
        </p>
      )}
    </section>
  );
}
