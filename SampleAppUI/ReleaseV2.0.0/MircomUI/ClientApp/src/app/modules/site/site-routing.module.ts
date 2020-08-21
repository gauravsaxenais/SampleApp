/**
 * Import dependencies
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SiteComponent } from './site/site.component';
import { JobLayoutComponent } from './job-layout/job-layout.component';
import { SiteEditComponent } from './site-edit/site-edit.component';
import { SiteMapViewComponent } from './site-map-view/site-map-view.component';
import { HelpComponent } from '../help/help.component';

/**
 * Creates an array of site for child route
 */
const routes: Routes = [
  {
    path: '',
    component: JobLayoutComponent,
    children: [
      {
        path: '',
        component: SiteComponent
      },
      {
        path: 'site-edit',
        component: SiteEditComponent
      },
      {
        path: 'site-map-view',
        component: SiteMapViewComponent
      },
      {
        path: 'help',
        component: HelpComponent
      },
      {
        path: '**',
        loadChildren: () => import('../../shared/modules/page-not-found/page-not-found.module').then(mod => mod.PageNotFoundModule)
      }
    ]
  }
];

/**
 * @NgModule decorator with its metadata for site
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

/**
 * Create routing module for site
 */
export class SiteRoutingModule { }
