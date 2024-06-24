import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SupportedCurrencies } from '../enums/supportedCurrencies';
import { Observable, map } from 'rxjs';
import { RatesResponse } from '../interfaces/rates-response';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  constructor(
    private http: HttpClient,
  ) { }

  private readonly supportedCurrencies = Object.values(SupportedCurrencies)
  private readonly url = 'https://open.er-api.com/v6/latest/'

  public getSupportedCurrencies() {
    return this.supportedCurrencies
  }


  public getLatestRates(from: SupportedCurrencies, to: SupportedCurrencies, amount: number): Observable<number> {
    return this.http.get<RatesResponse>(`${this.url}${from}`).pipe(
      map((res: RatesResponse) => {
        const updatedCurrency = amount * res.rates[to]
        return updatedCurrency
      })
    )
  }

}
