import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

const materialModules = [
  MatButtonModule,
  MatInputModule,
  MatDatepickerModule,
  MatSelectModule,
  MatCardModule,
  MatIconModule
];

@NgModule({
  imports: materialModules,
  exports: materialModules,
  providers: [provideNativeDateAdapter()]
})
export class MaterialModule { }
