/**
 * Import dependencies
 */
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { urls } from 'src/app/services/urls';
import { forkJoin } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
import { EventRequest } from 'src/app/shared/interfaces/eventInterfaces';
import { LocalStorageService } from 'src/app/services/localStorage.service';
import { SignalrService } from 'src/app/services/signalR.service';
import { Subscription } from 'rxjs';
import { MapItemStatus, EditBuildingRequestedFrom } from 'src/app/shared/enums';
import { UtilsService } from 'src/app/services/utility.services';
import { debug } from 'util';

@Component({
  selector: 'app-building',
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.css']
})

/**
 * Create building component
 */
export class BuildingComponent implements OnInit, OnDestroy {

  /**
   * Variables declaration
   */
  buildingData: any;
  buildingId: number;
  buildingTitle: string;
  eventsData: any = [];
  isExpandable: boolean;
  lefty = '-55px';
  numberOfFloors: number;
  response: any;
  siteFromDashboard = this.local.getSiteFromDashboard();
  siteId: number;
  topx = '-30px';
  mapItemStatus = MapItemStatus;
  subscription: Subscription;
  isActiveRightArrow: boolean;
  isActiveLeftArrow: boolean;
  floorMapGuids: any = [];
  callInit = true;

  /**
   * Inject the services in the constructor
   */
  constructor(
    private local: LocalStorageService,
    private readonly signalR: SignalrService,
    private router: Router,
    private httpService: HttpService,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private utilsService: UtilsService
  ) {
    this.siteId = this.route.snapshot.params.siteId;
    this.buildingId = this.route.snapshot.params.buildingId;
  }


  /**
   * OnInit - Get signalR, Event and bind building floors
   */
  ngOnInit() {
    this.callInit = !this.callInit;
    this.activateRedirection();
    this.signalR.initializeSignalRConnect();
    this.signalR.setBroadcastEvent();
    this.bindEventsData();
    this.subscription = this.signalR.observableEvent
      .subscribe(item => {
        this.mapSignalREventData(item);
      });
    this.signalR.setBroadcastBuildingStatus();
    this.getBuildingData(this.siteId, this.buildingId);
    this.subscription = this.signalR.observableBuildingStatus
      .subscribe(buildingItem => {
        this.mapSignalRBuildingData(buildingItem);
      });

    this.signalR.SetBroadcastBuildingConfigStatusChanged();
    this.subscription = this.signalR.observableBuildingConfigStatusChanged
      .subscribe(item => {
        if (item !== '') {
          this.getBuildingData(this.siteId, this.buildingId);
        }
      });

  }

  /**
   * Event grid expandable handler
   * @param isExpand
   */
  eventExpandableChangedHandler(isExpand: boolean) {
    this.isExpandable = isExpand;
  }

  /**
   * Get data for building floors
   */
  getBuildingData(siteId: number, buildingId: number) {

    const urlBuilding = urls.buildingFloor + '/' + siteId + '?buildingId=' + buildingId;
    const urlAlarm = urls.statusBuilding + '/' + this.buildingId + '?siteId=' + siteId;
    const buildingData = this.httpService.getRequest(urlBuilding);
    const buildingStatusData = this.httpService.getRequest(urlAlarm);
    this.floorMapGuids = [];

    forkJoin([buildingData, buildingStatusData]).subscribe((results: any) => {

      this.buildingData = results[0].data.floors;

      // Storing map guid for floor navigation
      this.buildingData.forEach((element, i) => {
        if (element.imageUrl !== '') {
          this.floorMapGuids.push(element.mapGuid);
        }
      });

      this.numberOfFloors = this.buildingData.length;
      this.buildingTitle = results[0].data.name;

      results[0].data.floors.forEach((element, i) => {
        if (results[1].data == null) {
          return null;
        }
        this.floorMapGuids.push(element.mapGuid);
        results[1].data.filter((data) => {
          if (element.mapId === parseInt(data.objectId.split('_')[1], 10)) {
            this.buildingData[i].statusData = data.status;
            this.buildingData[i].objectId = data.objectId;
          }
        });
      });
      this.ref.detectChanges();
    });
  }

  /**
   * Redirect to edit building mode
   * @param event
   */
  redirectToEditBuilding(event) {
    this.local.sendEditBuildingRequestedFrom(EditBuildingRequestedFrom.Building.toString());
    const curBuildingId = this.route.snapshot.params.buildingId;
    this.router.navigate(['./monitoring/site-map/edit-building', { buildingId: curBuildingId }]);
  }


  /**
   * On click of right arrow it will redirect to next building.
   */
  redirectToNext() {
    this.activateRedirection();
    this.isActiveLeftArrow = false;
    let nextBuildingId: any;
    const curBuildingId = this.route.snapshot.params.buildingId;
    const curSiteId = this.siteId;
    let ids: any = [];
    ids = JSON.parse(this.local.getBuildingIds());
    ids.forEach(function(value, index) {
      if (curBuildingId === value.toString()) {
        const curIndex = index + 1;
        nextBuildingId = ids[curIndex];
      }
    });
    if (!this.isActiveRightArrow) {
      this.getBuildingData(curSiteId, nextBuildingId);
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        this.router.navigate(['./monitoring/site-map/building', { siteId: curSiteId, buildingId: nextBuildingId }]));
      this.isActiveRightArrow = false;
    }
  }

  /**
   * On click of left arrow it will redirect to previous building.
   */
  redirectToPrevious() {
    this.activateRedirection();
    this.isActiveRightArrow = false;
    let preBuildingId: any;
    const curBuildingId = this.route.snapshot.params.buildingId;
    const curSiteId = this.siteId;
    let ids: any = [];
    ids = JSON.parse(this.local.getBuildingIds());
    ids.forEach(function(value, index) {
      if (curBuildingId === value.toString()) {
        const curIndex = index - 1;
        preBuildingId = ids[curIndex];
      }
    });
    if (!this.isActiveLeftArrow) {
      this.getBuildingData(curSiteId, preBuildingId);
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        this.router.navigate(['./monitoring/site-map/building', { siteId: curSiteId, buildingId: preBuildingId }]));
      this.isActiveLeftArrow = false;
    }
  }

  /**
   * This will enable/disable the redirection to next building
   * or redirection to previous building.
   */
  activateRedirection() {
    const curBuildingId = this.route.snapshot.params.buildingId;
    let ids: any = [];
    ids = JSON.parse(this.local.getBuildingIds());
    const self = this;
    ids.forEach(function(value, index) {
      if (value) {
        if (curBuildingId === value.toString()) {
          if (index === 0) {
            self.isActiveLeftArrow = true;
          } else if (index === ids.length - 1) {
            self.isActiveRightArrow = true;
          }
        }
      }
    });
  }

  /**
   * Destroy the signalR connection
   */
  ngOnDestroy() {
    this.signalR.disconnect();
  }

  /**
   * Event to redirect site-map page
   * @param isExpand
   * @param siteId
   * @param mapGuid
   * @param mapId
   */
  onBuildingClick(events, siteId, mapGuid, mapId) {
    this.local.sendFloorMapId(mapId);
    // Store array of map guid into local storage for navigation purpose.
    this.local.sendFloorMapGuids(this.floorMapGuids);
    this.router.navigate(['/monitoring/site-map/floor', { siteId: siteId, mapGuid: mapGuid }]);
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

  /**
   * Assign the status for floor
   * @param serverMessage
   */
  private mapSignalRBuildingData(serverMessage: string) {
    if (serverMessage != null) {
      const isJsonValidate = this.utilsService.IsJsonString(serverMessage);
      if (isJsonValidate) {
        const responseMessage = JSON.parse(serverMessage);
        if (responseMessage.hasOwnProperty('ObjectType') && this.buildingData) {
          this.buildingData.forEach(obj => {
            if (obj.objectId === responseMessage.ObjectID) {
              obj.statusData = responseMessage.Status;
            }
          });
        }
      }
    }
  }
}
