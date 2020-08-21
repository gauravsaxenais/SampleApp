/**
 * Import dependencies
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

/**
 * Creates an array of monitoring dashboard for child route
 */
const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    data: {
      title: 'Dashboard'
    }
  }

];

/**
 * @NgModule decorator with its metadata for monitoring dashboard routing
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

/**
 * Create routing module for monitoring dashboard
 */
export class DashboardRoutingModule { }
