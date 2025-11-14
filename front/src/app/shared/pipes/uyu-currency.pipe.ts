import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uyuCurrency',
  standalone: true,
})
export class UyuCurrencyPipe implements PipeTransform {
  private readonly formatter = new Intl.NumberFormat('es-UY', {
    style: 'currency',
    currency: 'UYU',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });

  transform(value: number | string | null | undefined): string {
    if (value === null || value === undefined) {
      return this.formatter.format(0);
    }

    const numericValue = typeof value === 'string' ? Number(value) : value;
    if (Number.isFinite(numericValue)) {
      return this.formatter.format(numericValue);
    }

    return this.formatter.format(0);
  }
}
