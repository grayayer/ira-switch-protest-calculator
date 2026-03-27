import { FilingStatus, CalculatorInputs, CalculatorResults } from './types';
import { TAX_BRACKETS_2026 } from './taxBrackets';
import { CURRENT_YEAR } from '../constants/limits';

export function getMarginalRate(taxableIncome: number, filingStatus: FilingStatus): number {
  const brackets = TAX_BRACKETS_2026[filingStatus];
  for (const bracket of brackets) {
    if (bracket.max === null || taxableIncome <= bracket.max) {
      return bracket.rate;
    }
  }
  // Fallback to top bracket rate (should not reach here)
  return brackets[brackets.length - 1].rate;
}

export function calculate(inputs: CalculatorInputs): CalculatorResults {
  const {
    recharacterizationAmount,
    filingStatus,
    taxableIncome,
    withdrawalYear,
    annualReturnRate,
  } = inputs;

  // Step 1: Marginal rate
  const marginalRate = getMarginalRate(taxableIncome, filingStatus);

  // Step 2: Tax savings this year
  const taxSavingsThisYear = recharacterizationAmount * marginalRate;

  // Step 3: Projected future value
  const yearsToWithdrawal = withdrawalYear - CURRENT_YEAR;
  const projectedFutureValue =
    recharacterizationAmount * Math.pow(1 + annualReturnRate, yearsToWithdrawal);

  // Step 4: Estimated future tax owed
  const estimatedFutureTaxOwed = projectedFutureValue * marginalRate;

  // Step 5: Net cost of the protest
  const netCostNominal = estimatedFutureTaxOwed - taxSavingsThisYear;

  return {
    marginalRate,
    taxSavingsThisYear,
    projectedFutureValue,
    estimatedFutureTaxOwed,
    netCostNominal,
    yearsToWithdrawal,
  };
}
