import { SupportedCurrencies } from "../enums/supportedCurrencies";

export interface CurrencyBlockChanges {
  value: number;
  currency: SupportedCurrencies;
}
