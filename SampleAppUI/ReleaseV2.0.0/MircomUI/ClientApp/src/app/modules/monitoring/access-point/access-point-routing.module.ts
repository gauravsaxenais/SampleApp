/**
 * Import dependencies
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccessPointComponent } from './access-point/access-point.component';

/**
 * Creates an array of access point child route
 */
const routes: Routes = [
  {
    path: '',
    component: AccessPointComponent
  }
];

/**
 * @NgModule decorator with its metadata for access point
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

/**
 * Create routing module for access point
 */
export class AccessPointRoutingModule { }
