/**
 * Import dependencies
 */
import { Component, OnInit, wtfEndTimeRange, OnDestroy } from '@angular/core';
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


@Component({
  selector: 'app-map-view-popup',
  templateUrl: './map-view-popup.component.html',
  styleUrls: ['./map-view-popup.component.css']
})
export class MapViewPopupComponent implements OnInit, OnDestroy {

  /**
   * Variables declaration
   */
  eventModel: any;
  eventsData: any = [];
  floorData: any;
  floorStatusData: any;
  floorStatusList = [];
  imgAlarmStatus = '../assets/img/status/alarm.gif';
  imgNormalStatus = '../assets/img/status/normal-black.png';
  imgOfflineStatus = '../assets/img/status/offline.png';
  imgTroubleStatus = '../assets/img/status/trouble.gif';
  imgUnknownStatus = '../assets/img/status/unknown.png';
  isExpandable: boolean;
  mapGuid: string;
  siteFromDashboard = this.local.getSiteFromDashboard();
  siteId: any;
  subscription: Subscription;
  isActiveUpArrow: boolean;
  isActiveDownArrow: boolean;
  mapItemStatus = MapItemStatus;
  mapItemType = MapItemType;

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
    private utilsService: UtilsService
   ) {
    this.siteId = this.local.getSiteId();
    this.mapGuid = this.route.snapshot.paramMap.get('mapGuid');
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
    // this.activateRedirection();
    this.signalR.initializeSignalRConnect();
    this.signalR.setBroadcastFloorMapItemsStatus();
    this.getFloorData(this.siteId, this.mapGuid);
    this.subscription = this.signalR.observableFloorMapItemsStatus
      .subscribe(item => {
        this.mapSignalRMapStatusData(item);
      });
    this.signalR.setBroadcastEvent();
    this.bindEventsData();
    this.subscription = this.signalR.observableEvent
      .subscribe(item => {
        this.mapSignalREventData(item);
      });
  }

  /**
   * Bind svg view box axis for image
   */
  bindSVGData() {
    /**
     *  Get image height and width for SVG
     */
    const self = this;
    const img = new Image();
    img.onload = function() {
      /** Set SVG viewBox clientY, ClientX, Width, height */
      const element = document.querySelector('#svgBuildingName');
      element.setAttribute('viewBox', `${0} ${0} ${img.naturalWidth} ${img.naturalHeight}`);
      const svgDiv = document.querySelector('#svgZoomDiv');
      if (svgDiv) {
        svgDiv.setAttribute('style', `${'height:' + element.clientHeight + 'px;'}`);
      }

    };
    img.src = '../assets/img/blank-sitemap.png';


    const imgSite = new Image();
    imgSite.onload = function() {
      /** Set SVG viewBox clientY, ClientX, Width, height */
      const elementSite = document.querySelector('#imgBackground');
      if (elementSite) {
        elementSite.setAttribute('height', `${imgSite.naturalHeight}`);
        elementSite.setAttribute('width', `${imgSite.naturalWidth}`);
      }
    };
    imgSite.src = this.floorData.image;

  }

  /**
   * Disconnect the signalR
   */
  ngOnDestroy(): void {
    this.signalR.disconnect();
  }


  /**
   * Bind the normal alarm if floor data not found in status (SignalR or API)
   * @param siteMapObj
   */
  private mapStatusDataIfNotMatched(siteMapObj: any) {
    const buildingObj: any = {};
    buildingObj.objectId = '';
    buildingObj.mapItemId = siteMapObj.mapItemId;
    buildingObj.status = 1;
    buildingObj.siteId = siteMapObj.siteId;
    buildingObj.buildingId = siteMapObj.buildingId;
    buildingObj.x = siteMapObj.x;
    buildingObj.y = siteMapObj.y;
    buildingObj.name = siteMapObj.name;
    buildingObj.statusData1 = 0;
    buildingObj.statusData2 = 0;
    buildingObj.type = siteMapObj.type;
    this.floorStatusList.push(buildingObj);
  }

  /**
   * Bind the alarm with respective status getting from SignalR or API
   * @param data
   * @param siteMapObj
   */
  private mapStatusDataIfMatched(data: any, siteMapObj: any) {
    const buildingObj: any = {};
    buildingObj.x = siteMapObj.x;
    buildingObj.y = siteMapObj.y;
    buildingObj.objectId = data.objectId;
    buildingObj.mapItemId = parseInt(data.objectId.split('_')[2], 10);
    buildingObj.siteId = siteMapObj.siteId;
    buildingObj.buildingId = siteMapObj.buildingId;
    buildingObj.status = data.status;
    buildingObj.name = siteMapObj.name;
    buildingObj.statusData1 = data.data1;
    buildingObj.statusData2 = data.data2;
    buildingObj.type = siteMapObj.type;
    this.floorStatusList.push(buildingObj);
  }

  /**
   * Set signalR for event
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
   * Set signalR status for floor items
   * @param serverMessage
   */
  private mapSignalRMapStatusData(serverMessage: string) {
    if (serverMessage != null) {
      const isJsonValidate = this.utilsService.IsJsonString(serverMessage);
      if (isJsonValidate) {
        const responseMessage = JSON.parse(serverMessage);
        if (responseMessage.hasOwnProperty('ObjectType') && this.floorStatusList) {
          this.floorStatusList.forEach(obj => {
            if (obj.objectId === responseMessage.ObjectID) {
              obj.status = responseMessage.Status;
              obj.objectType = responseMessage.ObjectType;
              obj.statusData1 = responseMessage.Data1;
              obj.statusData2 = responseMessage.Data2;
            }
          });
        }
      }
    }
  }


  /**
   * Get floor data from the api and bind response locally
   */
  private getFloorData(siteId: number, mapGuid: string) {
    debugger;
    const url = urls.siteFloorMap + '?siteId=' + siteId + '&mapGuid=' + mapGuid;
    this.httpService.getRequest(url).subscribe(
      (res: any) => {
        if (res.success && res.message.messageCode === 200 && res.data != null) {
          this.floorData = res.data;
          /**
           * Get status data by siteId and mapGuid
           */
          const statusMapUrl = urls.statusMap + '/' + this.siteId + '?mapGuid=' + this.mapGuid;
          this.httpService.getRequest(statusMapUrl).subscribe(
            (response: any) => {
              if (response.success && response.message.messageCode === 200 && response.data != null) {
                this.floorStatusData = response.data;
                this.floorData.mapItem.forEach(siteMapObj => {
                  /**
                   * fetch data where objectId of status data equals to map item id
                   */
                  const data = this.floorStatusData.find(ob => parseInt(ob.objectId.split('_')[2], 10) === siteMapObj.mapItemId);
                  /**
                   * if data is null then it takes normal as a status of event
                   * else it takes status from the data(response from api)
                   */
                  if (data !== undefined && data !== null) {
                    this.mapStatusDataIfMatched(data, siteMapObj);
                  } else {
                    this.mapStatusDataIfNotMatched(siteMapObj);
                  }
                });
              } else {
                this.floorData.mapItem.forEach(siteMapObj => {
                  this.mapStatusDataIfNotMatched(siteMapObj);
                });
              }

              if (this.floorStatusList) {
                console.log(this.floorStatusList);
                this.bindSVGData();
              }

            });

        }
      },
      (err: any) => {
        if (err.error != null && err.error.message != null) {
        }
      }
    );
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
      console.log(error);
    });
  }

}
