import { useState, useMemo, useRef } from 'react';
import { FilingStatus, CalculatorInputs, CalculatorResults } from './lib/types';
import { calculate, getMarginalRate } from './lib/calculator';
import { CURRENT_YEAR, DEFAULT_RETURN_RATE, DEFAULT_WITHDRAWAL_YEARS } from './constants/limits';
import InputForm from './components/InputForm/InputForm';
import ResultPanel from './components/ResultPanel/ResultPanel';
import trumpImg from './trump-burning-money.avif';
import styles from './App.module.css';

interface FormState {
  recharacterizationAmount: string;
  filingStatus: FilingStatus;
  taxableIncome: string;
  withdrawalYear: string;
  annualReturnRate: string;
}

function App() {
  const [form, setForm] = useState<FormState>({
    recharacterizationAmount: '7000',
    filingStatus: 'single',
    taxableIncome: '75000',
    withdrawalYear: String(CURRENT_YEAR + DEFAULT_WITHDRAWAL_YEARS),
    annualReturnRate: String(DEFAULT_RETURN_RATE),
  });

  const results = useMemo<CalculatorResults | null>(() => {
    const amount = parseFloat(form.recharacterizationAmount);
    const income = parseFloat(form.taxableIncome);
    const year = parseInt(form.withdrawalYear, 10);
    const rate = parseFloat(form.annualReturnRate);

    if (
      isNaN(amount) || amount <= 0 ||
      isNaN(income) || income <= 0 ||
      isNaN(year) || year <= CURRENT_YEAR ||
      isNaN(rate) || rate < 0.1 || rate > 20
    ) {
      return null;
    }

    const inputs: CalculatorInputs = {
      recharacterizationAmount: amount,
      filingStatus: form.filingStatus,
      taxableIncome: income,
      withdrawalYear: year,
      annualReturnRate: rate / 100,
    };

    return calculate(inputs);
  }, [form]);

  // Compute marginal rate for the badge even if other fields are incomplete
  const partialMarginalRate = useMemo<number | null>(() => {
    const income = parseFloat(form.taxableIncome);
    if (isNaN(income) || income <= 0) return null;
    return getMarginalRate(income, form.filingStatus);
  }, [form.taxableIncome, form.filingStatus]);

  const [aboutOpen, setAboutOpen] = useState(false);
  const aboutRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerText}>
            <div className={styles.privacyBanner}>
              <span className={styles.privacyIcon} aria-hidden="true">&#9679;</span>
              This calculator runs entirely in your browser. No data is collected, stored, or transmitted.
            </div>
            <h1 className={styles.headline}>WHAT DOES YOUR<br />PROTEST COST?</h1>
            <div className={styles.subheadlineRow}>
              <p className={styles.subheadline}>
                Calculate the real financial cost of recharacterizing your Roth IRA contribution
                to a traditional IRA as an act of political resistance.
              </p>
              <button
                className={styles.aboutToggle}
                aria-expanded={aboutOpen}
                aria-controls="about-panel"
                onClick={() => setAboutOpen(o => !o)}
              >
                <span>What's this about?</span>
                <span className={styles.aboutToggleIcon} aria-hidden="true">
                  {aboutOpen ? '▲' : '▼'}
                </span>
              </button>
            </div>
          </div>
          <div className={styles.headerImageCol}>
            <img
              src={trumpImg}
              alt="Illustration of money burning"
              className={styles.headerImage}
              width={300}
              height={360}
            />
          </div>
        </div>{/* end headerInner */}

        <div
          id="about-panel"
          ref={aboutRef}
          className={`${styles.aboutPanel} ${aboutOpen ? styles.aboutPanelOpen : ''}`}
          aria-hidden={!aboutOpen}
        >
          <div className={styles.aboutContent}>
            <p>
              War tax resistance is an old American tradition — from Quakers refusing to fund
              the French and Indian War to the mass withholding campaigns of the Vietnam era.
              The principle is simple: if you oppose what your government is doing with your
              money, you stop giving it.
            </p>
            <p>
              For most of us with families, jobs, and mortgages, complete tax refusal isn't
              a realistic option. The IRS has ways of collecting, and the consequences fall
              on everyone who depends on you. But that doesn't mean there's nothing to be done.
            </p>
            <p>
              IRA recharacterization is one of the few legal mechanisms available to ordinary
              taxpayers to meaningfully reduce what they send to the federal government{' '}
              <em>right now</em>. By converting a Roth IRA contribution to a traditional IRA,
              you defer taxes on that money — keeping it out of federal coffers today, in
              response to federal policies you find unconscionable.
            </p>
            <p className={styles.aboutTagline}>
              This calculator doesn't tell you what to do. It tells you what it costs.
            </p>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <InputForm form={form} setForm={setForm} marginalRate={partialMarginalRate} />
        <ResultPanel results={results} />
      </main>

      <footer className={styles.footer}>
        <p>
          This calculator is for educational and illustrative purposes only. It is not tax or
          financial advice. Consult a qualified tax professional before making financial decisions.
        </p>
        <p className={styles.footerNote}>
          Uses 2026 federal income tax brackets. Future tax rates are unknowable &mdash; this tool
          uses your current marginal rate as a conservative estimate for future tax owed.
        </p>
      </footer>
    </div>
  );
}

export default App;
