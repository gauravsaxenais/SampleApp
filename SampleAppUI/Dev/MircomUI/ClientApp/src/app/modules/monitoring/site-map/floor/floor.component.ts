/**
 * Import dependencies
 */
import { Component, OnInit, wtfEndTimeRange, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { urls } from 'src/app/services/urls';
import { HttpService } from 'src/app/services/http.service';
import { EventRequest } from 'src/app/shared/interfaces/eventInterfaces';
import { LocalStorageService } from 'src/app/services/localStorage.service';
import { SignalrService } from 'src/app/services/signalR.service';
import { Subscription } from 'rxjs';
import { MapItemStatus, EditRequestedFrom, MapItemType } from 'src/app/shared/enums';
import { UtilsService } from 'src/app/services/utility.services';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-floor',
  templateUrl: './floor.component.html',
  styleUrls: ['./floor.component.css']
})

/**
 * Create SiteMap component
 */
export class FloorComponent implements OnInit {
  /**
   * Variables declaration
   */
  eventModel: any;
  eventsData: any = [];
  isExpandable: boolean;
  subscription: Subscription;
  mapGuid: string;
  siteId: number;
  mapId: string;
  /**
   * Inject the services in the constructor
   */
  constructor(
    private local: LocalStorageService,
    private httpService: HttpService,
    private readonly signalR: SignalrService,
    private router: Router,
    private route: ActivatedRoute,
    private readonly httpClient: HttpClient,
    private ref: ChangeDetectorRef,
    private utilsService: UtilsService,
    private dataService: DataService
  ) {
    this.siteId = this.route.snapshot.params.siteId;
    this.mapGuid = this.route.snapshot.params.mapGuid;
    this.mapId = this.route.snapshot.params.mapId;
  }

  /**
   * Event grid expandable handler
   * @param isExpand
   */
  eventExpandableChangedHandler(isExpand: boolean) {
    this.isExpandable = isExpand;
  }

  /**
   * OnInit - Get events data and floors data
   */
  ngOnInit() {
    this.signalR.initializeSignalRConnect();
    this.signalR.setBroadcastEvent();
    this.bindEventsData();
    this.subscription = this.signalR.observableEvent
      .subscribe(item => {
        this.mapSignalREventData(item);
      });
  }


  /**
   * Set signalR for event
   * @param serverMessage
   */
   mapSignalREventData(serverMessage: string) {
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
            severity: responseMessage.Severity,
            channelGuid: responseMessage.ChannelGUID,
            mapGuid: responseMessage.MapGUID
          });
          this.ref.detectChanges();
          this.ref.markForCheck();
        }
      }
    }
  }

  /**
   * Get events data from the api and bind response locally
   */
  bindEventsData() {
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
      console.log(error);
    });
  }

  /**
   * get current mapGuid from child and set to parent for edit purpose.
   * @param mapGuid
   */
  displayGuid(mapGuid) {
    this.mapGuid = mapGuid;
  }

  /**
   * Redirect to edit mode
   * @param event
   */
  redirectToEdit(event) {
    localStorage.setItem('editRequestFrom', EditRequestedFrom.Floor.toString());
    this.router.navigate(['./monitoring/site-map/edit-map', { siteId: this.siteId, mapGuid: this.mapGuid }]);
  }

}
