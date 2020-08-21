/**
 * Import dependencies
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MonitoringModule } from '../monitoring.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatButtonModule, MatCheckboxModule, MatMenuModule, MatIconModule } from '@angular/material';
import { NgxWidgetGridModule } from 'ngx-widget-grid';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ChartOptionComponent } from '../shared/chart-option/chart-option.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { GridsterModule } from 'angular-gridster2';
import { MatSelectModule } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
/**
 * @NgModule decorator with its metadata for monitoring
 */
@NgModule({
  declarations: [DashboardComponent],
  entryComponents: [ChartOptionComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatListModule,
    MatButtonModule,
    MatCheckboxModule,
    MatMenuModule,
    MatIconModule,
    MonitoringModule,
    NgxWidgetGridModule,
    DragDropModule,
    MatTooltipModule,
    FormsModule,
    GridsterModule,
    MatSelectModule,
    MatSidenavModule,
    MatInputModule
  ]
})

/**
 * Create module for monitoring dashboard
 */
export class DashboardModule { }
