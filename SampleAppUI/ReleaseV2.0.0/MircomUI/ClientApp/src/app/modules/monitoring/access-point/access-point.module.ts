/**
 * Import dependencies
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MonitoringModule } from '../monitoring.module';
import { AccessPointRoutingModule } from './access-point-routing.module';
import { AccessPointComponent } from './access-point/access-point.component';
import { MatButtonModule, MatCheckboxModule, MatMenuModule, MatIconModule } from '@angular/material';

/**
 * @NgModule decorator with its metadata for access point
 */
@NgModule({
  declarations: [AccessPointComponent],
  imports: [
    CommonModule,
    AccessPointRoutingModule,
    MatListModule,
    MatButtonModule,
    MatCheckboxModule,
    MatMenuModule,
    MatIconModule,
    MonitoringModule
  ]
})

/**
 * Create module for access point
 */
export class AccessPointModule { }
