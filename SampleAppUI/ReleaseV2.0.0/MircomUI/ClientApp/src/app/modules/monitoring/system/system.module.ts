/**
 * Import dependencies
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule, MatCheckboxModule, MatMenuModule, MatIconModule, MatTableModule } from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import { SystemRoutingModule } from './system-routing.module';
import { SystemComponent } from './system/system.component';
import { MonitoringModule } from '../monitoring.module';

@NgModule({
  declarations: [SystemComponent],
  imports: [
    CommonModule,
    SystemRoutingModule,
    MatTableModule,
    MatSortModule,
    MatListModule,
    MatButtonModule,
    MatCheckboxModule,
    MatMenuModule,
    MatIconModule,
    MonitoringModule
  ]
})
export class SystemModule { }

