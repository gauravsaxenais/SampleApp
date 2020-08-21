/**
 * Import dependencies
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventRoutingModule } from './event-routing.module';
import { MatButtonModule, MatCheckboxModule, MatMenuModule, MatIconModule } from '@angular/material';
import { MatListModule } from '@angular/material/list';
import { EventComponent } from './event/event.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonitoringModule } from '../monitoring.module';

/**
 * @NgModule decorator with its metadata for event
 */
@NgModule({
  declarations: [EventComponent],
  imports: [
    CommonModule,
    EventRoutingModule,
    MatListModule,
    MatButtonModule,
    MatCheckboxModule,
    MatMenuModule,
    MatIconModule,
    MonitoringModule,
    FormsModule,
    ReactiveFormsModule
  ]
})

/**
 * Create module for monitoring event
 */
export class EventModule { }
