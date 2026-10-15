import { Component, model } from '@angular/core';

@Component({
  selector: 'app-calendar-input',
  imports: [],
  templateUrl: './calendar-input.html',
  styleUrl: './calendar-input.scss',
})
export class CalendarInput {
  public date = model<string>('');

  onDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.date.set(input.value);
  }
}
