/**
 * Import dependencies
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MonitoringLayoutComponent } from './monitoring-layout/monitoring-layout.component';
import { HelpComponent } from '../help/help.component';

/**
 * Creates an array of monitoring for child route
 */
const routes: Routes = [
  {
    path: '',
    component: MonitoringLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(mod => mod.DashboardModule)
      },
      {
        path: 'camera',
        loadChildren: () => import('./camera/camera.module').then(mod => mod.CameraModule)
      },
      {
        path: 'access-point',
        loadChildren: () => import('./access-point/access-point.module').then(mod => mod.AccessPointModule)
      },
      {
        path: 'event',
        loadChildren: () => import('./event/event.module').then(mod => mod.EventModule)
      },
      {
        path: 'chart',
        loadChildren: () => import('./chart/chart.module').then(mod => mod.ChartModule)
      },
      {
        path: 'site-map',
        loadChildren: () => import('./site-map/site-map.module').then(mod => mod.SiteMapModule)
      },
      {
        path: 'system',
        loadChildren: () => import('./system/system.module').then(mod => mod.SystemModule)
      },
      {
        path: 'help',
        component: HelpComponent
      },
      {
        path: '**',
        loadChildren: () => import('../../shared/modules/page-not-found/page-not-found.module').then(mod => mod.PageNotFoundModule)
      }]
  }];

/**
 * @NgModule decorator with its metadata for monitoring
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

/**
 * Create routing module for monitoring
 */
export class MonitoringRoutingModule { }
