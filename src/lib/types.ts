export type FilingStatus =
  | 'single'
  | 'marriedFilingJointly'
  | 'marriedFilingSeparately'
  | 'headOfHousehold';

export interface CalculatorInputs {
  recharacterizationAmount: number;
  filingStatus: FilingStatus;
  taxableIncome: number;
  withdrawalYear: number;
  annualReturnRate: number; // decimal, e.g. 0.07
}

export interface CalculatorResults {
  marginalRate: number;
  taxSavingsThisYear: number;
  projectedFutureValue: number;
  estimatedFutureTaxOwed: number;
  netCostNominal: number;
  yearsToWithdrawal: number;
}
