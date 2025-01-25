import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { Employee, Employee_Roles } from '../../models/employee.model';
import { addEmployee, getEmployees, updateEmployee } from '../../helper/db';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { StartDateHeaderComponent } from '../start-date-header/start-date-header.component';
import { EndDateHeaderComponent } from '../end-date-header/end-date-header.component';
import { MatDatepicker } from '@angular/material/datepicker';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css',
  providers: [DatePipe]
})
export class AddEmployeeComponent implements OnInit, OnDestroy {
  employeeForm!: FormGroup;
  selectedEmployee: Employee | undefined;
  employeeRoles = Employee_Roles;
  minEndDate: Date | undefined;
  noDateSelected = false;
  subscription!: Subscription;

  // custom header for date pickers to select date from predefined buttons
  customStartHeader = StartDateHeaderComponent;
  customEndHeader = EndDateHeaderComponent;

  constructor(
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initForm();
    this.onLoad();
  }

  get employeeList(): Employee[] {
    return this.commonService.employeeData();
  }

  /**
   * Patching formgroup with dates selected by predefined buttons
   * on the date picker headers
   * @return { void }
   */
  ngOnInit(): void {
    this.subscription = this.commonService.dateUpdater
      .subscribe({
        next: data => {
          this.noDateSelected = true;
          this.employeeForm.patchValue({
            [data.controlName]: data.value
          })
          this.employeeForm.markAsDirty();
          this.dateSelectionChange();
        },
        error: (err) => console.error(err)
      })
  }

  onLoad() {
    const employeeId = Number(this.route.snapshot.params['id']);
    if (employeeId) {
      if (this.employeeList.length === 0) {
        getEmployees()
          .then((employeeData) => {
            if (employeeData && employeeData.length > 0) {
              this.commonService.employeeData.set(employeeData);
              this.selectedEmployee = this.employeeList.find(emp => emp.id === employeeId);
              this.patchForm();
            }
          })
      } else {
        this.selectedEmployee = this.employeeList.find(emp => emp.id === employeeId);
        this.patchForm();
      }
    }
  }

  /**
   * Initializing formgroup
   * @return { void }
   */
  initForm(): void {
    this.employeeForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
      startDate: new FormControl(null, [Validators.required]),
      endDate: new FormControl({ value: null, disabled: true })
    });
  }

  /**
   * Patching formgroup with matched employee data
   * @return { void }
   */
  patchForm() {
    this.employeeForm.patchValue({
      name: this.selectedEmployee?.name,
      role: this.selectedEmployee?.role,
      startDate: this.selectedEmployee?.startDate,
      endDate: this.selectedEmployee?.endDate
    })

    this.minEndDate = this.selectedEmployee?.startDate;
    this.employeeForm.get('endDate')?.enable();
  }

  /**
   * function to create or update employee data
   * @return { void }
   */
  async addEmployee() {
    const employeeData = this.createEmployeeData();
    try {
      if (this.selectedEmployee) {
        const updatedEmployee = { ...employeeData, id: this.selectedEmployee.id };
        await updateEmployee(updatedEmployee);
        const updatedList = this.commonService.employeeData().map(
          emp => emp.id === updatedEmployee.id ? updatedEmployee : emp
        );
        this.commonService.employeeData.set(updatedList);
      } else {
        await addEmployee(employeeData);
        this.commonService.employeeData.update(currentList => [...currentList, employeeData]);
      }
      this.router.navigateByUrl('/');
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * function to create employee data from formvalues
   * and setting employementstatus of the employee based on selected dates
   * @return { Employee } updated employee data
   */
  createEmployeeData(): Employee {
    const employee = this.employeeForm.value as Employee;
    const currentDate = new Date()

    const isSameDay = (dateOne: Date, dateTwo: Date): boolean => {
      return dateOne.toLocaleDateString() === dateTwo.toLocaleDateString()
    }

    if (employee.endDate) {
      if (currentDate > employee.startDate || isSameDay(currentDate, employee.startDate)) {
        employee.employmentStatus = currentDate < employee.endDate || isSameDay(currentDate, employee.endDate);
      } else {
        employee.employmentStatus = employee.startDate < employee.endDate || isSameDay(employee.startDate, employee.endDate);
      }
    } else {
      employee.employmentStatus = true;
    }

    return employee;
  }

  /**
   * Handling minimum range of end date for validation purpose.
   * user can only select valid end dates from the date picker
   * @return { void }
   */
  dateSelectionChange() {
    const startDate = this.employeeForm.get('startDate')?.value;
    if (startDate) {
      this.minEndDate = startDate;
      this.employeeForm.get('endDate')?.enable();
      const endDate = this.employeeForm.get('endDate')?.value;
      if (endDate && endDate < startDate) {
        this.employeeForm.patchValue({
          endDate: endDate
        })
      }
    }
  }

  /**
   * function to close date picker overlay
   * @param { MatDatepicker<Date> } datePicker date picker reference
   * @return { void }
   */
  closeDatePicker(datePicker: MatDatepicker<Date>) {
    datePicker.close();
    this.noDateSelected = false;
  }

  /**
   * validation function for selecting end date.
   * filter out dates within the datepicker based on the condition
   * @param { Date } date dates from current view of the date picker
   * @return { void }
   */
  endDateFilter = (date: Date | null): boolean => {
    if (!this.minEndDate || !date) {
      return true;
    }
    return date > this.minEndDate;
  };

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
