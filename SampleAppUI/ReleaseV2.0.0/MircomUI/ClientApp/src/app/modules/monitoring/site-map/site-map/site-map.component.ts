/**
 * Import dependencies
 */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { urls } from 'src/app/services/urls';
import { EventRequest } from 'src/app/shared/interfaces/eventInterfaces';
import { LocalStorageService } from 'src/app/services/localStorage.service';
import { SignalrService } from 'src/app/services/signalR.service';
import { Subscription } from 'rxjs';
import { UtilsService } from 'src/app/services/utility.services';
import { Router } from '@angular/router';
import { EditRequestedFrom, EditBuildingRequestedFrom } from 'src/app/shared/enums';

@Component({
  selector: 'app-site-map',
  templateUrl: './site-map.component.html',
  styleUrls: ['./site-map.component.css']
})

/**
 * Create SiteMap component
 */
export class SiteMapComponent implements OnInit, OnDestroy {

  /**
   * Variables declaration
   */
  buildingStatusList = [];
  eventModel: any;
  eventsData: any = [];
  isExpandable: boolean;
  subscription: Subscription;
  siteName: string = this.local.getSiteMapName();

  /**
   * Inject the services in the constructor
   */
  constructor(
    private local: LocalStorageService,
    private readonly signalR: SignalrService,
    private httpService: HttpService,
    private utilsService: UtilsService,
    private router: Router
  ) { }

  /**
   * Event grid expandable handler
   * @param isExpand
   */
  eventExpandableChangedHandler(isExpand: boolean) {
    this.isExpandable = isExpand;
  }

  /**
   * OnInit - Get events data, site data and signalR
   */
  ngOnInit() {

    this.local.sendSiteFromDashboard('no');
    this.signalR.initializeSignalRConnect();
    this.signalR.setBroadcastEvent();
    this.bindEventsData();
    this.subscription = this.signalR.observableEvent
      .subscribe(item => {
        this.mapSignalREventData(item);
      });
  }

  /**
   * Destroy the signalR connection
   */
  ngOnDestroy(): void {
    this.signalR.disconnect();
  }

  /**
   * Redirect to edit building mode
   * @param event
   */
  redirectToEditBuilding(event) {
    this.local.sendEditBuildingRequestedFrom(EditBuildingRequestedFrom.SiteMap.toString());
    this.router.navigate(['./monitoring/site-map/edit-building']);
  }

  /**
   * Redirect to site showcase view
   * @param event
   */
  redirectToSiteShowcase(event) {
    this.router.navigate(['./monitoring/site-map/site-showcase']);
  }

  /**
   * Get events data from the api and bind response locally
   */
  private bindEventsData() {
    const reqModel: EventRequest = {
      startTime: null,
      endTime: null,
      description: '',
      severity: [],
      siteIds: [
        this.local.getSiteId()
      ],
      mostRecent: 0
    };
    const url = urls.events;
    this.httpService.postRequest(url, reqModel).subscribe((response: any) => {
      if (response.success && response.data != null) {
        // response ok
        if (response.success) {
          this.eventsData = response.data;
        }
      }
    }, (error) => {
      // error
    });
  }

  /**
   * Push the signalR data to event
   * @param serverMessage
   */
  private mapSignalREventData(serverMessage: string) {
    if (serverMessage != null) {
      const isJsonValidate = this.utilsService.IsJsonString(serverMessage);
      if (isJsonValidate) {
        const responseMessage = JSON.parse(serverMessage);
        if (responseMessage.hasOwnProperty('EventType') && this.eventsData) {
          this.eventsData.unshift({
            utcTimeStamp: responseMessage.UTCTimeStamp,
            siteName: responseMessage.SiteName,
            description: responseMessage.Description,
            panelName: responseMessage.PanelName,
            severity: responseMessage.Severity
          });
        }
      }
    }
  }

}
