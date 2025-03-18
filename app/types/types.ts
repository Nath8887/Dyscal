export interface Currency {
  value: number;
  type: 'note' | 'coin';
  label: string;
  count: number;
  imagePath: string;
}

export interface Transaction {
  timestamp: string;
  amountOnTill: number;
  moneyHandedByCustomer: number;
  changeDue: number;
}

export interface Preferences {
  disabledCurrency: Currency[];
  pastInteractions: Transaction[];
}

export interface MoneyCounterState {
  total: number;
  selectedCurrency: Currency[];
  history: { action: string; currency: Currency }[];
}
