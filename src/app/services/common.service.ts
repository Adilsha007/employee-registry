import { Injectable, signal, WritableSignal } from '@angular/core';
import { Employee, FormUpdate } from '../models/employee.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  employeeData: WritableSignal<Employee[]> = signal([]);
  dateUpdater = new Subject<FormUpdate>();

  constructor() { }

}
