/**
 * Import dependencies
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MonitoringModule } from '../monitoring.module';
import { ChartComponent } from './chart/chart.component';
import { ChartRoutingModule } from './chart-routing.module';
import { MatButtonModule, MatCheckboxModule, MatMenuModule, MatIconModule } from '@angular/material';
import { EditChartComponent } from './edit-chart/edit-chart.component';
import { ChartOptionComponent } from '../shared/chart-option/chart-option.component';
import { MatFormFieldModule } from '@angular/material/form-field';

/**
 * @NgModule decorator with its metadata for chart
 */
@NgModule({
  declarations: [ChartComponent, EditChartComponent],
  entryComponents: [ChartOptionComponent],
  imports: [
    CommonModule,
    ChartRoutingModule,
    MatListModule,
    MatButtonModule,
    MatCheckboxModule,
    MatMenuModule,
    MatIconModule,
    MonitoringModule, MatFormFieldModule
  ]
})

/**
 * Create module for Chart
 */
export class ChartModule { }
