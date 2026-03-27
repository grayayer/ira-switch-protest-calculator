import { FilingStatus } from '../../lib/types';
import { CURRENT_YEAR } from '../../constants/limits';
import TaxBracketBadge from '../TaxBracketBadge/TaxBracketBadge';
import styles from './InputForm.module.css';

interface FormState {
  recharacterizationAmount: string;
  filingStatus: FilingStatus;
  taxableIncome: string;
  withdrawalYear: string;
  annualReturnRate: string;
}

interface InputFormProps {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  marginalRate: number | null;
}

export default function InputForm({ form, setForm, marginalRate }: InputFormProps) {
  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // Validation
  const amountNum = parseFloat(form.recharacterizationAmount);
  const incomeNum = parseFloat(form.taxableIncome);
  const yearNum = parseInt(form.withdrawalYear, 10);
  const rateNum = parseFloat(form.annualReturnRate);

  const amountError =
    form.recharacterizationAmount !== '' && (isNaN(amountNum) || amountNum <= 0)
      ? 'Enter an amount greater than $0.'
      : null;
  const amountWarning =
    !amountError && !isNaN(amountNum) && amountNum > 8600
      ? 'Amount exceeds the 2026 IRA contribution limit of $8,600 (age 50+).'
      : null;

  const incomeError =
    form.taxableIncome !== '' && (isNaN(incomeNum) || incomeNum <= 0)
      ? 'Enter a taxable income greater than $0.'
      : null;

  const yearError =
    form.withdrawalYear !== '' && (!isNaN(yearNum) && yearNum <= CURRENT_YEAR)
      ? `Withdrawal year must be after ${CURRENT_YEAR}.`
      : null;

  const rateError =
    form.annualReturnRate !== '' && (isNaN(rateNum) || rateNum < 0.1 || rateNum > 20)
      ? 'Rate must be between 0.1% and 20%.'
      : null;
  const rateWarning =
    !rateError && !isNaN(rateNum) && (rateNum < 4 || rateNum > 12)
      ? 'Outside the typical 4–12% historical range for diversified portfolios.'
      : null;

  return (
    <section className={styles.form} aria-label="Calculator inputs">
      <h2 className={styles.sectionTitle}>YOUR NUMBERS</h2>

      {/* Recharacterization Amount */}
      <div className={styles.field}>
        <label htmlFor="recharacterizationAmount" className={styles.label}>
          RECHARACTERIZATION AMOUNT
        </label>
        <div className={styles.inputWrapper}>
          <span className={styles.prefix}>$</span>
          <input
            id="recharacterizationAmount"
            type="number"
            className={`${styles.input} ${amountError ? styles.inputError : ''}`}
            placeholder="7000"
            value={form.recharacterizationAmount}
            min={1}
            onChange={(e) => handleChange('recharacterizationAmount', e.target.value)}
            aria-describedby="amount-help amount-error amount-warning"
          />
        </div>
        <p id="amount-help" className={styles.helper}>
          2025 limit: $7,000 ($8,000 if age 50+). 2026 limit: $7,500 ($8,600 if age 50+).
          Enter the total amount you are considering recharacterizing.
        </p>
        {amountError && (
          <p id="amount-error" className={styles.error} role="alert">{amountError}</p>
        )}
        {amountWarning && (
          <p id="amount-warning" className={styles.warning} role="alert">{amountWarning}</p>
        )}
      </div>

      {/* Filing Status */}
      <div className={styles.field}>
        <label htmlFor="filingStatus" className={styles.label}>
          FILING STATUS
        </label>
        <select
          id="filingStatus"
          className={styles.select}
          value={form.filingStatus}
          onChange={(e) => handleChange('filingStatus', e.target.value as FilingStatus)}
        >
          <option value="single">Single</option>
          <option value="marriedFilingJointly">Married filing jointly</option>
          <option value="marriedFilingSeparately">Married filing separately</option>
          <option value="headOfHousehold">Head of household</option>
        </select>
      </div>

      {/* Taxable Income */}
      <div className={styles.field}>
        <label htmlFor="taxableIncome" className={styles.label}>
          EXPECTED TAXABLE INCOME (THIS YEAR)
        </label>
        <div className={styles.inputWrapper}>
          <span className={styles.prefix}>$</span>
          <input
            id="taxableIncome"
            type="number"
            className={`${styles.input} ${incomeError ? styles.inputError : ''}`}
            placeholder="75000"
            value={form.taxableIncome}
            min={1}
            onChange={(e) => handleChange('taxableIncome', e.target.value)}
            aria-describedby="income-help income-error"
          />
        </div>
        <p id="income-help" className={styles.helper}>
          This is your income after deductions, not your gross income. Check last year&rsquo;s
          return for a reference point.
        </p>
        {incomeError && (
          <p id="income-error" className={styles.error} role="alert">{incomeError}</p>
        )}
        {marginalRate !== null && <TaxBracketBadge rate={marginalRate} />}
      </div>

      {/* Withdrawal Year */}
      <div className={styles.field}>
        <label htmlFor="withdrawalYear" className={styles.label}>
          EXPECTED WITHDRAWAL YEAR
        </label>
        <input
          id="withdrawalYear"
          type="number"
          className={`${styles.input} ${yearError ? styles.inputError : ''}`}
          placeholder={String(CURRENT_YEAR + 20)}
          value={form.withdrawalYear}
          min={CURRENT_YEAR + 1}
          onChange={(e) => handleChange('withdrawalYear', e.target.value)}
          aria-describedby="year-help year-error"
        />
        <p id="year-help" className={styles.helper}>
          The year you expect to start withdrawing from this account.
        </p>
        {yearError && (
          <p id="year-error" className={styles.error} role="alert">{yearError}</p>
        )}
      </div>

      {/* Annual Return Rate */}
      <div className={styles.field}>
        <label htmlFor="annualReturnRate" className={styles.label}>
          EXPECTED ANNUAL RATE OF RETURN
        </label>
        <div className={styles.inputWrapper}>
          <input
            id="annualReturnRate"
            type="number"
            className={`${styles.input} ${rateError ? styles.inputError : ''}`}
            placeholder="7"
            value={form.annualReturnRate}
            min={0.1}
            max={20}
            step={0.1}
            onChange={(e) => handleChange('annualReturnRate', e.target.value)}
            aria-describedby="rate-help rate-error rate-warning"
          />
          <span className={styles.suffix}>%</span>
        </div>
        <p id="rate-help" className={styles.helper}>
          The historical average annual return of a diversified US stock portfolio over a 20-year
          horizon is approximately 7–8% after inflation.
        </p>
        {rateError && (
          <p id="rate-error" className={styles.error} role="alert">{rateError}</p>
        )}
        {rateWarning && (
          <p id="rate-warning" className={styles.warning} role="alert">{rateWarning}</p>
        )}
      </div>
    </section>
  );
}
