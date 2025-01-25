import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { Employee } from '../../models/employee.model';
import { getEmployees, removeEmployee } from '../../helper/db';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent implements OnInit {
  currentEmployees: Employee[] = [];
  previousEmployees: Employee[] = [];

  constructor(private commonService: CommonService) { }

  get employeeList(): Employee[] {
    return this.commonService.employeeData();
  }

  ngOnInit(): void {
    this.getEmployeeList();
  }

  /**
   * function to get employee list and then
   * filter current and previous employees
   * @return { void }
   */
  async getEmployeeList() {
    try {
      const employeeData = await getEmployees();
      this.commonService.employeeData.set(employeeData);
      this.currentEmployees = this.employeeList.filter(emp => emp.employmentStatus);
      this.previousEmployees = this.employeeList.filter(emp => !emp.employmentStatus);

    } catch (error) {
      console.error(error);
    }
  }

  /**
   * function to delete selected employee
   * @param { number } employeeId employee id
   * @return { void }
   */
  async deleteEmployee(employeeId: number) {
    try {
      await removeEmployee(employeeId);
      const index = this.employeeList.findIndex(emp => emp.id === employeeId);
      if (index > -1) {
        this.commonService.employeeData.set(this.employeeList.filter(emp => emp.id !== employeeId));
        this.currentEmployees = this.employeeList.filter(emp => emp.employmentStatus);
        this.previousEmployees = this.employeeList.filter(emp => !emp.employmentStatus);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
