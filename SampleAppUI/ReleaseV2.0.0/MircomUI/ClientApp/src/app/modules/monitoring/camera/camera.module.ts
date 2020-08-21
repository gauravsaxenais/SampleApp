import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CameraRoutingModule } from './camera-routing.module';
import { CameraComponent } from './camera/camera.component';
import { MatButtonModule, MatCheckboxModule, MatMenuModule, MatIconModule, MatTabsModule, MatSelectModule } from '@angular/material';

import { MatListModule } from '@angular/material/list';

import { MonitoringModule } from '../monitoring.module';
import { CameraEditComponent } from './camera-edit/camera-edit.component';
import { MatVideoModule } from 'mat-video';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { FormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

@NgModule({
  declarations: [CameraComponent, CameraEditComponent],
  imports: [
    CommonModule,
    CameraRoutingModule,
    MatListModule,
    MatButtonModule,
    MatCheckboxModule,
    MatMenuModule,
    MatIconModule,
    MonitoringModule,
    MatTabsModule,
    MatVideoModule,
    DragAndDropModule,
    FormsModule,
    MatSelectModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ]
})
export class CameraModule { }
