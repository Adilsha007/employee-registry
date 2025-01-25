import { Component } from '@angular/core';
import { MatCalendar } from '@angular/material/datepicker';

@Component({
  selector: 'app-start-date-header',
  templateUrl: './start-date-header.component.html',
  styleUrl: './start-date-header.component.css',
})
export class StartDateHeaderComponent {

  constructor(
    private calendar: MatCalendar<Date>
  ) { }

  /**
   * function to focus today's date
   * @param { Event } event click event
   * @return { void }
   */
  setToday(event: Event) {
    const today = new Date();
    this.updateCalender(today, event);
  }

  /**
   * function to focus next monday's date
   * @param { Event } event click event
   * @return { void }
   */
  setNextMonday(event: Event) {
    const today = new Date();
    const nextMonday = new Date();
    nextMonday.setDate(today.getDate() + ((8 - today.getDay()) % 7 || 7));
    this.updateCalender(nextMonday, event);
  }

  /**
   * function to focus next tuesday's date
   * @param { Event } event click event
   * @return { void }
   */
  setNextTuesday(event: Event) {
    const today = new Date();
    const nextTuesday = new Date();
    nextTuesday.setDate(today.getDate() + ((9 - today.getDay()) % 7 || 7));
    this.updateCalender(nextTuesday, event);
  }

  /**
   * function to focus on the date after one week
   * @param { Event } event click event
   * @return { void }
   */
  setAfterOneWeek(event: Event) {
    const afterOneWeek = new Date();
    afterOneWeek.setDate(new Date().getDate() + 7);
    this.updateCalender(afterOneWeek, event);
  }

  /**
   * function to update date pick calender
   * @param { Date } date date to be focused
   * @param { Event } event click event
   * @return { void }
   */
  private updateCalender(date: Date, event: Event): void {
    this.calendar.activeDate = date;
    this.calendar.selected = date;
    this.calendar._userSelection.emit({ value: date, event });
  }
}
