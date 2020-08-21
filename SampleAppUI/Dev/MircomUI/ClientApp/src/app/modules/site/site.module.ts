import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SiteRoutingModule } from './site-routing.module';
import { MatButtonModule, MatCheckboxModule, MatTableModule, MatIconModule, MatMenuModule, MatSortModule, MatSelectModule, MatRadioModule } from '@angular/material';
import {MatListModule} from '@angular/material/list';
import { SiteComponent } from './site/site.component';
import { SiteEditComponent } from './site-edit/site-edit.component';
import { MonitoringModule } from '../monitoring/monitoring.module';
import { JobLayoutComponent } from './job-layout/job-layout.component';
import { JobHeaderComponent } from './shared/job-header/job-header.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SiteMapViewComponent } from './site-map-view/site-map-view.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { HelpModule } from '../help/help.module';

@NgModule({
  declarations: [SiteComponent, SiteEditComponent, JobLayoutComponent, JobHeaderComponent, SiteMapViewComponent],
  imports: [
    CommonModule,
    SiteRoutingModule,
    MatListModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTableModule,
    MatMenuModule,
    MatIconModule,
    MonitoringModule,
    DragDropModule,
    MatSortModule,
    FormsModule,
    MatSelectModule,
    MatRadioModule,
    TranslateModule,
    HelpModule,
    AgmCoreModule.forRoot({
      apiKey: localStorage.getItem('googleApiKey')
    })
  ],
  providers: [
    GoogleMapsAPIWrapper
  ],
})
export class SiteModule { }
