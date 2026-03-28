import { useState } from 'react';
import styles from './SpendingComparisons.module.css';

interface ComparisonItem {
  id: string;
  getHeadline: (amount: number) => string;
  detail: string;
  unitCost: string;
  source: string;
  sourceUrl: string;
}

const COMPARISONS: ComparisonItem[] = [
  {
    id: 'ice-detention',
    getHeadline: (amt) => {
      const days = Math.round(amt / 165);
      return `${days.toLocaleString()} day${days !== 1 ? 's' : ''} of ICE detention for one person`;
    },
    detail:
      'ICE spends $165/day to detain one adult immigrant — 36× more than the $4.20/day ankle-monitor alternative that achieves 99% compliance. Your savings alone could keep someone locked up for weeks.',
    unitCost: '$165/day per adult detainee',
    source: 'National Immigration Forum',
    sourceUrl:
      'https://forumtogether.org/article/immigration-detention-costs-in-a-time-of-mass-deportation/',
  },
  {
    id: 'deportation-seat',
    getHeadline: (amt) => {
      const seats = (amt / 1350).toFixed(1);
      return `${seats} seats on an ICE charter deportation flight`;
    },
    detail:
      'Charter deportation flights cost ~$1,350/seat. But the Trump administration routinely chose military C-17s at $4,675/person — 7× more expensive — burning through taxpayer money to make a political point.',
    unitCost: '$1,350/seat (charter) vs. $4,675/seat (military C-17)',
    source: 'Newsweek / Human Rights First',
    sourceUrl:
      'https://www.newsweek.com/trumps-reliance-military-planes-deportations-costing-taxpayers-2023882',
  },
  {
    id: 'soldier-deployed',
    getHeadline: (amt) => {
      const days = (amt / 2740).toFixed(1);
      return `${days} day${parseFloat(days) !== 1 ? 's' : ''} of deploying one U.S. soldier overseas`;
    },
    detail:
      'Deploying a single soldier overseas costs ~$1 million/year ($2,740/day). This figure covers pay, logistics, equipment, and support — costs that add up fast across hundreds of thousands of troops.',
    unitCost: '~$2,740/day per deployed soldier',
    source: 'Brookings Institution / Marketplace',
    sourceUrl:
      'https://www.marketplace.org/story/2011/02/22/cost-soldier-deployed-afghanistan',
  },
  {
    id: 'trump-mara-lago',
    getHeadline: (amt) => {
      const pct = ((amt / 250000) * 100).toFixed(1);
      return `${pct}% of Secret Service costs for one Trump Mar-a-Lago trip`;
    },
    detail:
      'The Secret Service spends an estimated $250,000 per Trump trip to Mar-a-Lago, his own for-profit resort. Trump made 21 trips there in his first 100 days of his second term — paying himself along the way.',
    unitCost: '~$250,000/trip in Secret Service costs',
    source: 'Georgetown University / Judicial Watch',
    sourceUrl:
      'https://gisme.georgetown.edu/publications/secret-service-costs-for-presidential-travel-continue-to-mount/',
  },
  {
    id: 'daytona-ss',
    getHeadline: (amt) => {
      const pct = ((amt / 561843) * 100).toFixed(2);
      return `${pct}% of what the Secret Service spent at the 2026 Daytona 500`;
    },
    detail:
      'The Secret Service spent $561,843 protecting Trump at a single NASCAR race on Feb 16, 2026. The bill included $335K in hotel rooms, $213K in event tents and heaters, and a $280 car wash.',
    unitCost: '$561,843 for one afternoon at Daytona',
    source: 'Front Office Sports',
    sourceUrl: 'https://frontofficesports.com/trump-secret-service-trump-sports/',
  },
  {
    id: 'family-detention',
    getHeadline: (amt) => {
      const days = Math.round(amt / 296);
      return `${days.toLocaleString()} day${days !== 1 ? 's' : ''} of ICE family detention (per person)`;
    },
    detail:
      'Detaining families costs $296–$319/day per person — including children. A monitored-release alternative costs just $4.20/day. The U.S. chooses the option that costs 70× more.',
    unitCost: '$296–$319/day per person in family detention',
    source: 'National Immigration Forum',
    sourceUrl:
      'https://forumtogether.org/article/immigration-detention-costs-in-a-time-of-mass-deportation/',
  },
  {
    id: 'federal-prison',
    getHeadline: (amt) => {
      const days = Math.round(amt / 121);
      return `${days.toLocaleString()} day${days !== 1 ? 's' : ''} of federal prison incarceration`;
    },
    detail:
      'The Bureau of Prisons spends $120.80–$164.87/day per federal inmate — figures published in the Federal Register (Dec 2024). The U.S. has the world\'s largest prison population.',
    unitCost: '$121/day (average) per federal prisoner',
    source: 'Federal Register, Dec 2024',
    sourceUrl:
      'https://www.federalregister.gov/documents/2024/12/06/2024-28743/annual-determination-of-average-cost-of-incarceration-fee-coif',
  },
  {
    id: 'guantanamo-flight',
    getHeadline: (amt) => {
      const pct = ((amt / 12000) * 100).toFixed(0);
      return `${pct}% of what the first Guantanamo deportation flight cost per person`;
    },
    detail:
      'The first deportation flight to Guantanamo Bay carried just 12 migrants on a C-17 military jet — costing ~$12,000 per person for that single leg. The program spent $40 million in its first month alone.',
    unitCost: '~$12,000/person on the first Guantanamo flight',
    source: 'ABC News',
    sourceUrl:
      'https://abcnews.go.com/Politics/southwest-border-mission-cost-330m-40m-guantanamo-bay/story?id=120298109',
  },
  {
    id: 'ice-trucks',
    getHeadline: (amt) => {
      const pct = ((amt / 90000) * 100).toFixed(1);
      return `${pct}% of one branded ICE SUV that agents refuse to drive`;
    },
    detail:
      'ICE bought 25 Chevrolet Tahoes at $90,000 each through a no-bid contract awarded to a GOP mega-donor. Agents refuse to drive them in the field because the large ICE logos tip off targets before arrests.',
    unitCost: '$90,000/vehicle (no-bid contract, GOP donor)',
    source: 'Zeteo / Sen. Jack Reed',
    sourceUrl:
      'https://zeteo.com/p/ice-no-bid-contract-republican-donor-fraud-history',
  },
];

interface SpendingComparisonsProps {
  amount: number;
}

export default function SpendingComparisons({ amount }: SpendingComparisonsProps) {
  const [expanded, setExpanded] = useState(false);

  if (!amount || amount <= 0) return null;

  const featured = COMPARISONS[0];
  const rest = COMPARISONS.slice(1);

  return (
    <div className={styles.container}>
      <div className={styles.featuredCallout}>
        <span className={styles.eyebrow}>YOUR TAX SAVINGS THIS YEAR EQUAL…</span>
        <span className={styles.headline}>{featured.getHeadline(amount)}</span>
        <p className={styles.detail}>{featured.detail}</p>
        <a
          href={featured.sourceUrl}
          className={styles.sourceLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          Source: {featured.source} ↗
        </a>
      </div>

      <button
        className={styles.toggleButton}
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        {expanded ? '▲ Show fewer comparisons' : `▼ See ${rest.length} more government spending comparisons`}
      </button>

      {expanded && (
        <div className={styles.expandedList}>
          {rest.map((item) => (
            <div key={item.id} className={styles.card}>
              <div className={styles.cardHeadline}>{item.getHeadline(amount)}</div>
              <p className={styles.cardDetail}>{item.detail}</p>
              <div className={styles.cardMeta}>
                <span className={styles.cardUnitCost}>{item.unitCost}</span>
                <a
                  href={item.sourceUrl}
                  className={styles.cardSource}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.source} ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
