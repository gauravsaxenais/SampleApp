import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth.guard';
import { SignalrService } from 'src/app/services/signalR.service';
import { LocalStorageService } from 'src/app/services/localStorage.service';
import { UtilsService } from './services/utility.services';
import { ExcelService } from './services/excel.service';
import { DataService } from './services/data.service';
import { HelpComponent } from './modules/help/help.component';
import { CameraViewComponent } from './modules/monitoring/camera/camera-view/camera-view.component';
import { CameraSinglePopupComponent } from './modules/monitoring/camera/camera-single-popup/camera-single-popup.component';
import { MapViewPopupComponent } from './modules/monitoring/site-map/map-view-popup/map-view-popup.component';

/**
 * Creates an array of app route
 */
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: () => import('./modules/login/login.module').then(mod => mod.LoginModule),
      },
      {
        path: 'site',
        loadChildren: () => import('./modules/site/site.module').then(mod => mod.SiteModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'monitoring',
        loadChildren: () => import('./modules/monitoring/monitoring.module').then(mod => mod.MonitoringModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'cameraView/:viewGuid',
        component: CameraViewComponent,
      },
      {
        path: 'cameraSinglePopup/:channelGuid',
        component: CameraSinglePopupComponent,
      },
      {
        path: 'cameraSinglePopup/:channelGuid/:timeStamp',
        component: CameraSinglePopupComponent,
      },
      {
        path: 'siteMapView/:mapGuid',
        component: MapViewPopupComponent,
      },
      {
        path: '**',
        loadChildren: () => import('./modules/login/login.module').then(mod => mod.LoginModule)
      }
    ]
  }
];

/**
 * @NgModule decorator with its metadata for app
 */
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
  providers: [AuthService, AuthGuard, SignalrService, LocalStorageService, UtilsService, ExcelService, DataService],
})

/**
 * Create routing module for app
 */
export class AppRoutingModule { }
