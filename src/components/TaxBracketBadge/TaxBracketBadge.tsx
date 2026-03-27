import styles from './TaxBracketBadge.module.css';

interface TaxBracketBadgeProps {
  rate: number; // decimal, e.g. 0.22
}

export default function TaxBracketBadge({ rate }: TaxBracketBadgeProps) {
  const percent = Math.round(rate * 100);
  return (
    <div className={styles.badge} role="status" aria-live="polite">
      <span className={styles.label}>YOUR MARGINAL RATE</span>
      <span className={styles.rate}>{percent}%</span>
    </div>
  );
}
