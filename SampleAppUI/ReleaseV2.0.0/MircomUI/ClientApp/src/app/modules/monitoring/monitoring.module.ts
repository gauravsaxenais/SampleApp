/**
 * Import dependencies
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MonitoringRoutingModule } from './monitoring-routing.module';
import { MonitoringHeaderComponent } from './shared/monitoring-header/monitoring-header.component';
import { MonitoringFooterComponent } from './shared/monitoring-footer/monitoring-footer.component';
import { MonitoringLeftPanelComponent } from './shared/monitoring-left-panel/monitoring-left-panel.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModalModule } from 'src/app/shared/components/dialog-modal/dialog-modal.module';
import { MatButtonModule, MatCheckboxModule, MatMenuModule, MatIconModule, MatListModule, MatFormFieldModule, MatDialogModule, MatInputModule, MatSelectModule } from '@angular/material';
import { MonitoringAccessGrantedChartComponent } from './shared/monitoring-access-granted-chart/monitoring-access-granted-chart.component';
import { MonitoringEventComponent } from './shared/monitoring-event/monitoring-event.component';
import { MonitoringAccessPointComponent } from './shared/monitoring-access-point/monitoring-access-point.component';
import { MonitoringLayoutComponent } from './monitoring-layout/monitoring-layout.component';
import { MonitoringSiteMapComponent } from './shared/monitoring-site-map/monitoring-site-map.component';
import { ChartOptionComponent } from './shared/chart-option/chart-option.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { MonitoringSystemComponent } from './shared/monitoring-system/monitoring-system.component';
import { HelpModule } from '../help/help.module';
import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

// import { OrderModule } from 'ngx-order-pipe';

/**
 * @NgModule decorator with its metadata for monitoring
 */
@NgModule({
  declarations: [MonitoringHeaderComponent, MonitoringLeftPanelComponent,
    MonitoringAccessGrantedChartComponent, MonitoringEventComponent, MonitoringAccessPointComponent,
    MonitoringLayoutComponent, MonitoringFooterComponent, MonitoringSiteMapComponent, ChartOptionComponent, MonitoringSystemComponent],
  providers: [DatePipe],
  imports: [
    CommonModule,
    MonitoringRoutingModule,
    HttpClientModule,
    MatListModule,
    MatButtonModule,
    MatCheckboxModule,
    MatMenuModule,
    MatIconModule,
    FormsModule,
    HttpClientModule,
    DialogModalModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    HelpModule,
    TranslateModule
  ],
  exports: [
    MonitoringHeaderComponent, MonitoringLeftPanelComponent,
    MonitoringAccessGrantedChartComponent, MonitoringEventComponent, MonitoringAccessPointComponent,
    MonitoringSiteMapComponent, MonitoringSystemComponent, TranslateModule
  ]
})

/**
 * Create module for monitoring
 */
export class MonitoringModule { }
