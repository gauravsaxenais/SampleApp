/**
 * Import dependencies
 */
import { Component, OnInit, wtfEndTimeRange, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
  selector: 'app-floor',
  templateUrl: './floor.component.html',
  styleUrls: ['./floor.component.css']
})

/**
 * Create SiteMap component
 */
export class FloorComponent implements OnInit, OnDestroy {
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
  siteId: number;
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
    private ref: ChangeDetectorRef,
    private utilsService: UtilsService
  ) {
    this.siteId = this.route.snapshot.params.siteId;
    this.mapGuid = this.route.snapshot.params.mapGuid;
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
    this.activateRedirection();
    this.signalR.initializeSignalRConnect();
    this.signalR.setBroadcastFloorMapItemsStatus();
    this.getFloorData(this.siteId, this.mapGuid);
    this.subscription = this.signalR.observableFloorMapItemsStatus
      .subscribe(item => {
        this.mapSignalRMapStatusData(item);
      });

    this.signalR.SetBroadcastFloorConfigStatusChanged();
    this.subscription = this.signalR.observableFloorConfigStatusChanged
      .subscribe(item => {
        if (item !== '') {
          console.log('FloorConfigStatusChanged Called');
          this.floorStatusList = [];
          this.getFloorData(this.siteId, this.mapGuid);
        }
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

      // const imgBackground = document.querySelector('#imgBackground');
      // imgBackground.setAttribute('width', `${img.naturalWidth}`);
      // imgBackground.setAttribute('height', `${img.naturalHeight}`);

      // const svgDiv = document.querySelector('#svgZoomDiv');
      // svgDiv.setAttribute('style', `${'height:' + element.clientHeight + 'px;'}`);
      const svgDiv = document.querySelector('#svgZoomDiv');
      if (svgDiv) {
        // svgDiv.setAttribute('style', `${'height:' + img.naturalHeight + 'px;'}`);
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
   * If the link has been clicked, go to building
   */
  redirectToBuildingClick(events) {
    this.router.navigate(['./monitoring/site-map/building', { siteId: this.siteId, buildingId: this.floorData.buildingId }]);
  }

  /**
   * Redirect to edit mode
   * @param event
   */
  redirectToEdit(event) {
    localStorage.setItem('editRequestFrom', EditRequestedFrom.Floor.toString());
    this.router.navigate(['./monitoring/site-map/edit-map', { siteId: this.siteId, mapGuid: this.mapGuid }]);
  }

  /**
   *  On click of up arrow it will redirect to next floor.
   */
  redirectToNext() {
    this.activateRedirection();
    this.isActiveUpArrow = false;
    let nextMapGuid: any;
    const curMapGuid = this.route.snapshot.params.mapGuid;
    const curSiteId = this.siteId;
    let ids: any = [];
    ids = JSON.parse(this.local.getFloorMapGuids());
    ids.forEach(function(value, index) {
      if (curMapGuid === value.toString()) {
        const curIndex = index + 1;
        nextMapGuid = ids[curIndex];
      }
    });
    if (!this.isActiveDownArrow) {
      this.floorStatusList = [];
      this.getFloorData(curSiteId, nextMapGuid);
      this.router.navigate(['./monitoring/site-map/floor', { siteId: curSiteId, mapGuid: nextMapGuid }]);
      this.isActiveDownArrow = false;
    }
  }

  /**
   * On click of down arrow it will redirect to next floor.
   */
  redirectToPrevious() {
    this.activateRedirection();
    this.isActiveDownArrow
      = false;
    let preMapGuid: any;
    const curMapGuid = this.route.snapshot.params.mapGuid;
    const curSiteId = this.siteId;
    let ids: any = [];
    ids = JSON.parse(this.local.getFloorMapGuids());
    ids.forEach(function(value, index) {
      if (curMapGuid === value.toString()) {
        const curIndex = index - 1;
        preMapGuid = ids[curIndex];
      }
    });
    if (!this.isActiveUpArrow) {
      this.floorStatusList = [];
      this.getFloorData(curSiteId, preMapGuid);
      this.router.navigate(['./monitoring/site-map/floor', { siteId: curSiteId, mapGuid: preMapGuid }]);
      this.isActiveUpArrow = false;
    }
  }
  /**
   * This will enable/disable the redirection to next floor
   * or redirection to previous floor.
   */
  activateRedirection() {
    const curMapGuid = this.route.snapshot.params.mapGuid;
    let ids: any = [];
    ids = JSON.parse(this.local.getFloorMapGuids());
    const self = this;
    ids.forEach(function(value, index) {
      if (curMapGuid === value.toString()) {
        if (index === 0) {
          self.isActiveUpArrow = true;
        } else if (index === ids.length - 1) {
          self.isActiveDownArrow = true;
        }
      }
    });
  }

  /**
   * popUpCamera
   * @param ev
   * @param channelGuid
   */
  popUpCamera(ev, channelGuid) {
    if (channelGuid && channelGuid !== '00000000-0000-0000-0000-000000000000') {
      this.router.navigate([]).then(result => {
        window.open('#/cameraSinglePopup/' + channelGuid, '_blank',
          'fullscreen=yes;toolbar=no;resizable=yes,width=1500,height=900');
      });
    }
  }


  /**
   * Bind the normal alarm if floor data not found in status (SignalR or API)
   * @param siteMapObj
   */
  private mapStatusDataIfNotMatched(siteMapObj: any) {
    const buildingObj: any = {};
    console.log('Not matched');
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
    buildingObj.itemGuid = siteMapObj.itemGuid;
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
    buildingObj.itemGuid = siteMapObj.itemGuid;
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
                this.bindSVGData();
                this.ref.detectChanges();
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
