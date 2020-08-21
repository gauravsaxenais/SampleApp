import { Component, OnInit, OnDestroy, ChangeDetectorRef, Input, SimpleChanges, EventEmitter, Output, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { urls } from 'src/app/services/urls';
import { HttpService } from 'src/app/services/http.service';
import { LocalStorageService } from 'src/app/services/localStorage.service';
import { SignalrService } from 'src/app/services/signalR.service';
import { Subscription } from 'rxjs';
import { MapItemStatus, MapItemType } from 'src/app/shared/enums';
import { UtilsService } from 'src/app/services/utility.services';
import { DataService } from 'src/app/services/data.service';
import swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import Panzoom from '@panzoom/panzoom';

@Component({
  selector: 'app-monitoring-floor-map',
  templateUrl: './monitoring-floor-map.component.html',
  styleUrls: ['./monitoring-floor-map.component.css']
})

export class MonitoringFloorMapComponent implements OnInit, OnDestroy, OnChanges {
  /**
   * Variables declaration
   */
  floorData: any;
  floorStatusData: any;
  floorStatusList = [];
  imgAlarmStatus = '../assets/img/status/alarm.gif';
  imgNormalStatus = '../assets/img/status/normal-black.png';
  imgOfflineStatus = '../assets/img/status/offline.png';
  imgTroubleStatus = '../assets/img/status/trouble.gif';
  imgUnknownStatus = '../assets/img/status/unknown.png';
  mapGuid: string;
  siteFromDashboard = this.local.getSiteFromDashboard();
  siteId: number;
  subscription: Subscription;
  isActiveUpArrow: boolean;
  isActiveDownArrow: boolean;
  mapItemStatus = MapItemStatus;
  mapItemType = MapItemType;
  isRefreshedOnDashboard: boolean;
  disableZoom: boolean;
  @Input() numberOfFloorMap: number;
  floorMapNumber: any;
  @Input() componentGuid: string;
  @Input() mapId: string;
  @Input() isRefreshMap: boolean;
  @Input() editableDashboard: boolean;
  @Output() guidChange = new EventEmitter();

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
    private dataService: DataService,
    private translate: TranslateService
  ) {
    this.siteId = this.route.snapshot.params.siteId;
    this.mapGuid = this.route.snapshot.params.mapGuid;
  }

  /**
   * OnInit - Get events data and floors data
   */
  ngOnInit() {
    this.activateRedirection();
    this.signalR.setBroadcastFloorMapItemsStatus(this.mapId);
    this.floorMapNumber = JSON.stringify(this.numberOfFloorMap);
    this.floorMapNumber = Number(this.floorMapNumber);
    if (!this.floorMapNumber) {
      this.floorMapNumber = 1;
    }
    this.isZoomOnFloorMap();

    if (this.mapGuid && this.siteId) {
      this.getFloorData(this.siteId, this.mapGuid, this.floorMapNumber);
    }
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
          if (this.mapGuid && this.siteId) {
            this.getFloorData(this.siteId, this.mapGuid, this.floorMapNumber);
          }
        }
      });
  }

  ngOnChanges(changes: any) {
    if (changes) {
      if (changes.componentGuid) {
        this.floorStatusList = [];
        this.getFloorData(Number(this.local.getSiteId()), changes.componentGuid.currentValue, this.numberOfFloorMap);
      } else if (changes.editableDashboard || changes.isRefreshMap) {
        this.floorStatusList = [];
        this.getFloorData(Number(this.local.getSiteId()), this.componentGuid, this.numberOfFloorMap);
      }
    }
  }

  /**
   * Bind svg view box axis for image
   */
  bindSVGData(mapNumber: number) {
    /**
     *  Get image height and width for SVG
     */
    const self = this;
    const img = new Image();
    img.onload = function() {
      /** Set SVG viewBox clientY, ClientX, Width, height */
      const element = document.querySelector('#svgBuildingName_' + mapNumber);
      if (element) {
        element.setAttribute('viewBox', `${0} ${0} ${img.naturalWidth} ${img.naturalHeight}`);

        const svgDiv = document.querySelector('#svgZoomDiv_' + mapNumber);
        if (svgDiv) {
          // svgDiv.setAttribute('style', `${'height:' + img.naturalHeight + 'px;'}`);
          svgDiv.setAttribute('style', `${'height:' + element.clientHeight + 'px;'}`);
        }
        if (!self.disableZoom) {
          const panzoom = Panzoom(element, {
            maxScale: 5,
            minScale: 1,
            contain: 'outside'

          });
          panzoom.pan(10, 10);
          panzoom.zoom(1, { animate: true });

          // Panning and pinch zooming are bound automatically (unless disablePan is true).
          // There are several available methods for zooming
          // that can be bound on button clicks or mousewheel.
          element.parentElement.addEventListener('wheel', panzoom.zoomWithWheel);
        }
      }
    };
    img.src = '../assets/img/blank-sitemap.png';


    const imgSite = new Image();
    imgSite.onload = function() {
      /** Set SVG viewBox clientY, ClientX, Width, height */
      const elementSite = document.querySelector('#imgBackground_' + mapNumber);
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
      this.getFloorData(curSiteId, nextMapGuid, this.floorMapNumber);
      this.router.navigate(['./monitoring/site-map/floor', { siteId: curSiteId, mapGuid: nextMapGuid }]);
      this.isActiveDownArrow = false;
    }
    this.guidChange.emit(nextMapGuid);
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
      this.getFloorData(curSiteId, preMapGuid, this.floorMapNumber);
      this.router.navigate(['./monitoring/site-map/floor', { siteId: curSiteId, mapGuid: preMapGuid }]);
      this.isActiveUpArrow = false;
    }
    this.guidChange.emit(preMapGuid);
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
    if (ids) {
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
  }

  /**
   * Bind the normal alarm if floor data not found in status (SignalR or API)
   * @param siteMapObj
   */
  mapStatusDataIfNotMatched(siteMapObj: any) {
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
    buildingObj.itemGuid = siteMapObj.itemGuid;
    this.floorStatusList.push(buildingObj);
  }

  /**
   * Bind the alarm with respective status getting from SignalR or API
   * @param data
   * @param siteMapObj
   */
  mapStatusDataIfMatched(data: any, siteMapObj: any) {
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
   * Set signalR status for floor items
   * @param serverMessage
   */
  mapSignalRMapStatusData(serverMessage: string) {
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
              // this.ref.detectChanges();
            }
          });
        }
      }
    }
  }

  /**
   * Get floor data from the api and bind response locally
   */
  getFloorData(siteId: number, mapGuid: string, mapNumber: number) {
    const url = urls.siteFloorMap + '?siteId=' + siteId + '&mapGuid=' + mapGuid;
    this.httpService.getRequest(url).subscribe(
      (res: any) => {
        if (res.success && res.message.messageCode === 200 && res.data != null) {
          this.floorData = res.data;
          /**
           * Get status data by siteId and mapGuid
           */
          const statusMapUrl = urls.statusMap + '/' + siteId + '?mapGuid=' + mapGuid;
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
                this.bindSVGData(mapNumber);
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
   * To zoom the floor
   */
  isZoomOnFloorMap() {
    this.dataService.zoomOnSiteMapboolMessage.subscribe(message => {
      this.disableZoom = message;
      this.floorStatusList = [];
      // this.getFloorData();
    });
  }

  /**
   * Open current status of inputs and access points
   * @param status
   * @param componentName
   */
  on_clickInfo(status, componentName) {
    const btnConfirmVal: any = this.translate.get('floor.confirm');
    const statusName: any = this.translate.get('floor.status');
    const statusParam = 'enums.mapItemStatus.' + MapItemStatus[status];
    const statusVal: any = this.translate.get(statusParam);
    swal({
      title: '<strong>' + componentName + '</strong>',
      html: '<table style="text-align:left">' +
        '<tr><td>' + statusName.value + '</td><td>:</td><td><strong>' + statusVal.value + '</strong></td></tr>' +
        '</table>',
      confirmButtonClass: 'btn btn-success',
      confirmButtonText: btnConfirmVal.value,
      buttonsStyling: false
    });
  }

  /**
   * Open current status and redirect to camera
   * @param status
   * @param componentName
   * @param channelGuid
   */
  on_clickInfoCamera(status, componentName, channelGuid) {
    const btnViewVal: any = this.translate.get('floor.viewCamera');
    const btnCancelVal: any = this.translate.get('floor.cancel');
    const statusName: any = this.translate.get('floor.status');
    const statusParam = 'enums.mapItemStatus.' + MapItemStatus[status];
    const statusVal: any = this.translate.get(statusParam);
    swal({
      title: '<strong>' + componentName + '</strong>',
      html: '<table style="text-align:left">' +
        '<tr><td>' + statusName.value + '</td><td>:</td><td><strong>' + statusVal.value + '</strong></td></tr>' +
        '</table>',
      confirmButtonClass: 'btn btn-success',
      confirmButtonText: btnViewVal.value,
      showCancelButton: true,
      cancelButtonClass: 'btn btn-danger',
      cancelButtonText: btnCancelVal.value,
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        if (channelGuid && channelGuid !== '00000000-0000-0000-0000-000000000000') {
          this.router.navigate([]).then(r => {
            window.open('#/cameraSinglePopup/' + channelGuid, '_blank',
              'fullscreen=yes;toolbar=no;resizable=yes,width=1500,height=900');
          });
        }
      }
    });
  }

}
