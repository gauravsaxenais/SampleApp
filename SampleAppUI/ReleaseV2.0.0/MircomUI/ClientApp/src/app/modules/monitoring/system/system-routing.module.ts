/**
 * Import dependencies
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SystemComponent } from './system/system.component';

/**
 * Creates an array of event for child route
 */
const routes: Routes = [
  {
    path: '',
    component: SystemComponent,
    data: {
      title: 'system'
    }
  }
];


/**
 * @NgModule decorator with its metadata for system routing
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

/**
 * Create routing module for event
 */
export class SystemRoutingModule { }
