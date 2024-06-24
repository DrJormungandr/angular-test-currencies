import { SupportedCurrencies } from './../enums/supportedCurrencies';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CurrencyBlockChanges } from '../interfaces/currency-block-changes';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-currency-block',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './currency-block.component.html',
  styleUrl: './currency-block.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyBlockComponent implements OnChanges, OnInit, OnDestroy {

  @Input() currencyValue: number = 1;
  @Input() currency: SupportedCurrencies = SupportedCurrencies.RUB
  @Input() supportedCurrencies: Array<string> = [];
  @Output() currencyChanges = new EventEmitter<CurrencyBlockChanges>()

  subscriptions: Array<Subscription> = [];

  currencyForm = new FormGroup({
    currency: new FormControl<SupportedCurrencies>(this.currency, {nonNullable: true}),
    currencyValue: new FormControl<number>(this.currencyValue,{nonNullable: true, validators: Validators.pattern(/\d?/)}),
  })

  ngOnChanges(changes: SimpleChanges): void {
    this.currencyForm.controls.currencyValue.setValue(
      changes['currencyValue'].currentValue, {emitEvent: false}
    )
  }

  ngOnInit(): void {
    this.currencyForm.controls.currency.setValue(this.currency)

    this.subscriptions.push(
      this.currencyForm.controls.currency.valueChanges.pipe(distinctUntilChanged()).subscribe( (currency: SupportedCurrencies) => {
        this.currencyChanges.emit({
          value: this.currencyForm.controls.currencyValue.value,
          currency: currency
        })
      }),
      this.currencyForm.controls.currencyValue.valueChanges
        .pipe(distinctUntilChanged(), debounceTime(500))
        .subscribe( (newValue: number) => {
          this.currencyChanges.emit({
            value: newValue,
            currency: this.currencyForm.controls.currency.value
          })
        }
      )
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe()
    })
  }



}
