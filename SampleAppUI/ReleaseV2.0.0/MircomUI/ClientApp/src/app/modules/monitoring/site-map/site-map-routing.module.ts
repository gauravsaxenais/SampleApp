/**
 * Import dependencies
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SiteMapComponent } from './site-map/site-map.component';
import { FloorComponent } from './floor/floor.component';
import { SiteLayoutComponent } from './site-layout/site-layout.component';
import { BuildingComponent } from './building/building.component';
import { EditBuildingComponent } from './edit-building/edit-building.component';
import { EditMapComponent } from './edit-map/edit-map.component';
import { SiteShowcaseComponent } from './site-showcase/site-showcase.component';
/**
 * Creates an array of site map route
 */
const routes: Routes = [
  {
    path: '',
    component: SiteLayoutComponent,
    children: [
      {
        path: '',
        component: SiteMapComponent
      },
      {
        path: 'building',
        component: BuildingComponent
      },
      {
        path: 'floor',
        component: FloorComponent
      },
      {
        path: 'edit-building',
        component: EditBuildingComponent
      }
      ,
      {
        path: 'edit-map',
        component: EditMapComponent
      },
      {
        path: 'site-showcase',
        component: SiteShowcaseComponent
      },
      {
        path: '**',
        loadChildren: () => import('../../../shared/modules/page-not-found/page-not-found.module').then(mod => mod.PageNotFoundModule)
      }
    ]
  }
];

/**
 * @NgModule decorator with its metadata for site map
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

/**
 * Create routing module for site map
 */
export class SiteMapRoutingModule { }
