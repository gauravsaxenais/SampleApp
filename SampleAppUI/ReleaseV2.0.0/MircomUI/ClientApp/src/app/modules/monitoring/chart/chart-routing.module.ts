/**
 * Import dependencies
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChartComponent } from './chart/chart.component';
import { EditChartComponent } from './edit-chart/edit-chart.component';

/**
 * Creates an array of chart child route
 */
const routes: Routes = [
  {
    path: '',
    component: ChartComponent
  },
  {
    path: 'edit-chart',
    component: EditChartComponent
  }];

/**
 * @NgModule decorator with its metadata for chart
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

/**
 * Create routing module for chart
 */
export class ChartRoutingModule { }
