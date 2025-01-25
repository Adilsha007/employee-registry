import { Component } from '@angular/core';
import { MatCalendar } from '@angular/material/datepicker';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-end-date-header',
  templateUrl: './end-date-header.component.html',
  styleUrl: './end-date-header.component.css'
})
export class EndDateHeaderComponent {

  constructor(
    private calendar: MatCalendar<Date>,
    private commonService: CommonService
  ) { }

  /**
   * function to focus today's date
   * @param { Event } event click event
   * @return { void }
   */
  setToday(event: Event): void {
    const today = new Date();
    this.updateCalendar(today, event);
  }

  /**
   * function to not selecting any dates
   * @param { Event } event click event
   * @return { void }
   */
  setNodate(event: Event) {
    this.updateCalendar(null, event);
  }

  /**
   * function to update on date picker.
   * if there is no date formControl will update with null
   * @param { Date } date date to be focused on date picker
   * @param { Event } event click event
   * @return { void }
   */
  private updateCalendar(date: Date | null, event: Event): void {
    this.calendar.selected = date;
    if (date) {
      this.calendar.activeDate = date;
      this.calendar._userSelection.emit({ value: date, event });
    } else {
      this.commonService.dateUpdater.next({
        value: date,
        controlName: 'endDate'
      })
    }
  }
}
