export class IndicatorValueDto {
  date: string;
  value: number;
  details: string;

  constructor(date: Date, value: number, details: string) {
    this.date = date.toISOString().split('T')[0];
    this.value = value;
    this.details = details;
  }
}
