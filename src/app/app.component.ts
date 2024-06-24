import { CurrencyService } from './services/currency.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { CurrencyBlockComponent } from './currency-block/currency-block.component';
import { CurrencyBlockChanges } from './interfaces/currency-block-changes';
import { SupportedCurrencies } from './enums/supportedCurrencies';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule, CurrencyBlockComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  constructor(
    private currencyService: CurrencyService
  ) {
    this.supportedCurrencies = this.currencyService.getSupportedCurrencies()
  }

  supportedCurrencies: Array<SupportedCurrencies> = []

  leftCurrency = SupportedCurrencies.RUB
  leftCurrencyValue = 1
  rightCurrency = SupportedCurrencies.USD
  rightCurrencyValue = 2

  ngOnInit() {
    this.currencyService.getLatestRates(this.leftCurrency, this.rightCurrency, this.leftCurrencyValue).subscribe(
      (newValue: number) => {
        this.rightCurrencyValue = newValue
      }
    )
  }

  onLeftCurrencyChange(event: CurrencyBlockChanges) {
    this.leftCurrency = event.currency
    this.leftCurrencyValue = event.value
    this.currencyService.getLatestRates(event.currency, this.rightCurrency, event.value).subscribe(
      (newValue: number) => {
        this.rightCurrencyValue = newValue
      }
    )
  }

  onRightCurrencyChange(event: CurrencyBlockChanges) {
    this.rightCurrency = event.currency
    this.rightCurrencyValue = event.value
    this.currencyService.getLatestRates(event.currency, this.leftCurrency, event.value).subscribe(
      (newValue: number) => {
        this.leftCurrencyValue = newValue
      }
    )
  }

}
