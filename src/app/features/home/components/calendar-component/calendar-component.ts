import { Component } from '@angular/core';

@Component({
  selector: 'app-calendar-component',
  imports: [],
  templateUrl: './calendar-component.html',
  styleUrl: './calendar-component.scss',
})
export class CalendarComponent {
  days = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  
  // Criando a grade de dias incluindo os 4 espaços vazios iniciais (null)
  calendarSlots: (number | null)[] = [
    null, null, null, null,
    ...Array.from({ length: 31 }, (_, i) => i + 1)
  ];
  
  bookedDays = [5, 12, 19, 26];

  isBooked(day: number | null): boolean {
    return day ? this.bookedDays.includes(day) : false;
  }
}
