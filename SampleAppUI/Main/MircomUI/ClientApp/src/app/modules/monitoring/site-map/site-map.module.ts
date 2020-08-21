/**
 * Import dependencies
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SiteMapRoutingModule } from './site-map-routing.module';
import { MatButtonModule, MatCheckboxModule, MatMenuModule, MatIconModule } from '@angular/material';
import { MatListModule } from '@angular/material/list';

import { MonitoringModule } from '../monitoring.module';
import { SiteMapComponent } from './site-map/site-map.component';
import { BuildingComponent } from './building/building.component';
import { FloorComponent } from './floor/floor.component';
import { SiteLayoutComponent } from './site-layout/site-layout.component';
import { EditBuildingComponent } from './edit-building/edit-building.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditMapComponent } from './edit-map/edit-map.component';
import { OrderModule } from 'ngx-order-pipe';
import { SiteShowcaseComponent } from './site-showcase/site-showcase.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
/**
 * @NgModule decorator with its metadata for site map
 */
@NgModule({
  declarations: [SiteMapComponent, BuildingComponent, FloorComponent, SiteLayoutComponent, EditBuildingComponent, EditMapComponent, SiteShowcaseComponent],
  imports: [
    CommonModule,
    SiteMapRoutingModule,
    MatListModule,
    MatButtonModule,
    MatCheckboxModule,
    MatMenuModule,
    MatIconModule,
    MonitoringModule,
    DragDropModule,
    FormsModule,
    NgbModule,
    OrderModule
  ]
})

/**
 * Create routing module for site map
 */
export class SiteMapModule { }
