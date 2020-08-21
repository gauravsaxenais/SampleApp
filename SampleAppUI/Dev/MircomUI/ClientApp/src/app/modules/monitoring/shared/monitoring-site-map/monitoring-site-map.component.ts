/**
 * Import dependencies
 */
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, ChangeDetectorRef } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { urls } from 'src/app/services/urls';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/localStorage.service';
import { SignalrService } from 'src/app/services/signalR.service';
import { Subscription } from 'rxjs';
import { MapItemStatus } from 'src/app/shared/enums';
import { UtilsService } from 'src/app/services/utility.services';
import { DataService } from 'src/app/services/data.service';
import swal from 'sweetalert2';
import Panzoom from '@panzoom/panzoom';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-monitoring-site-map',
  templateUrl: './monitoring-site-map.component.html',
  styleUrls: ['./monitoring-site-map.component.css']
})
export class MonitoringSiteMapComponent implements OnInit, AfterViewInit {
  /**
   * variables declaration
   */
  buildingStatusList = [];

  @ViewChild('svgName', { static: false }) svgName: ElementRef;

  mapGuid = this.local.getMapGuid();
  siteFromDashboard = this.local.getSiteFromDashboard();
  siteId = this.local.getSiteId();
  siteMapData: any;
  statusMapData: any;
  buildingIds: any = [];

  mapItemStatus = MapItemStatus;
  isRefreshedOnDashboard: boolean;
  disableZoom: boolean;
  @Input() numberOfSiteMap: number;
  siteMapNumber: any;

  /**
   * Initialization of objects in the constructor
   * @param httpService
   * @param router
   */
  constructor(
    private local: LocalStorageService,
    private readonly signalR: SignalrService,
    private httpService: HttpService,
    private router: Router,
    private utilsService: UtilsService,
    private translate: TranslateService,
    private ref: ChangeDetectorRef,
    private dataService: DataService
  ) { }

  private subscription: Subscription;

  /**
   * OnInit - Get events data and site data
   */
  ngOnInit() {
    this.siteMapNumber = JSON.stringify(this.numberOfSiteMap);
    this.siteMapNumber = Number(this.siteMapNumber);
    if (!this.siteMapNumber) {
      this.siteMapNumber = 1;
    }
    this.isZoomOnSiteMap();
    this.refreshSiteMap();

    this.signalR.setBroadcastMapItemsStatus();
    this.getSiteMapData();
    this.subscription = this.signalR.observableMapItemsStatus
      .subscribe(item => {
        this.mapSignalRMapItemsStatusData(item);
      });

    this.signalR.SetBroadcastMapConfigStatusChanged();
    this.subscription = this.signalR.observableMapConfigStatusChanged
      .subscribe(item => {
        if (item !== '') {
          this.buildingStatusList = [];
          this.getSiteMapData();
        }
    });


  }

  refreshSiteMap() {
    this.dataService.siteMapDataBoolMessage.subscribe(message => {
      this.isRefreshedOnDashboard = message;
      if (this.isRefreshedOnDashboard) {
        this.mapGuid = this.local.getMapGuid();
        this.buildingStatusList = [];
        this.getSiteMapData();
      }
    });
  }

  isZoomOnSiteMap() {
    this.dataService.zoomOnSiteMapboolMessage.subscribe(message => {
      this.disableZoom = message;
      this.buildingStatusList = [];
      this.getSiteMapData();
    });
  }

  ngAfterViewInit() {

  }

  /**
   * Get site map data from the api and bind response locally
   */
  getSiteMapData() {
    const url = urls.siteFloorMap + '?siteId=' + this.siteId + '&mapGuid=' + this.mapGuid;
    this.httpService.getRequest(url).subscribe((res: any) => {
      if (res.success && res.data != null) {
        this.siteMapData = res.data;
        this.local.sendSiteMapName(this.siteMapData.title);
        /**
         * Get status data by siteId and mapGuid
         */
        const statusMapUrl = urls.statusMap + '/' + this.siteId + '?mapGuid=' + this.mapGuid;
        this.httpService.getRequest(statusMapUrl).subscribe(
          (response: any) => {
            if (response.success && response.message.messageCode === 200 && response.data != null) {
              this.statusMapData = response.data;
              this.siteMapData.mapItem.forEach(siteMapObj => {
                if (siteMapObj.buildingId) {
                  this.buildingIds.push(siteMapObj.buildingId);
                }
                /**
                 * fetch data where objectId of status data equals to map item id
                 */
                const data = this.statusMapData.find(ob => parseInt(ob.objectId.split('_')[2], 10) === siteMapObj.mapItemId);
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
              this.siteMapData.mapItem.forEach(siteMapObj => {
                this.mapStatusDataIfNotMatched(siteMapObj);
              });
            }
            if (this.buildingStatusList) {
              this.bindSVGData();
              this.ref.detectChanges();
            }
          });

      }
    }, (err: any) => {
      if (err.error != null && err.error.message != null) {
      }
    });

  }

  /**
   * Bind svg view box axis
   */
  bindSVGData() {
    /**
     *  Get image height and width for SVG
     */
    const self = this;
    const img = new Image();
    img.onload = function() {
      /** Set SVG viewBox clientY, ClientX, Width, height */
      const element = document.querySelector('#svgName_' + self.siteMapNumber);
      if (element) {
        element.setAttribute('viewBox', `${0} ${0} ${img.naturalWidth} ${img.naturalHeight}`);

        const svgDiv = document.querySelector('#svgZoomDiv_' + self.siteMapNumber);
        if (svgDiv) {
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
      const elementSite = document.querySelector('#imgBackground_' + self.siteMapNumber);
      if (elementSite) {
        elementSite.setAttribute('height', `${imgSite.naturalHeight}`);
        elementSite.setAttribute('width', `${imgSite.naturalWidth}`);
      }
    };
    imgSite.src = this.siteMapData.image;
  }

  /**
   * SignalR to set for map item
   * @param serverMessage
   */
  mapSignalRMapItemsStatusData(serverMessage: string) {
    if (serverMessage != null) {
      const isJsonValidate = this.utilsService.IsJsonString(serverMessage);
      if (isJsonValidate) {
        const responseMessage = JSON.parse(serverMessage);
        if (responseMessage.hasOwnProperty('ObjectType') && this.buildingStatusList) {
          this.buildingStatusList.forEach(obj => {
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
    buildingObj.itemGuid = siteMapObj.itemGuid;
    this.buildingStatusList.push(buildingObj);
  }

  /**
   * Bind the alarm with respective status getting from SignalR or API
   * @param data
   * @param siteMapObj
   */
  mapStatusDataIfMatched(data: any, siteMapObj: any) {
    const buildingObj: any = {};
    buildingObj.objectId = data.objectId;
    buildingObj.mapItemId = parseInt(data.objectId.split('_')[2], 10);
    buildingObj.siteId = siteMapObj.siteId;
    buildingObj.buildingId = siteMapObj.buildingId;
    buildingObj.status = data.status;
    buildingObj.x = siteMapObj.x;
    buildingObj.y = siteMapObj.y;
    buildingObj.name = siteMapObj.name;
    buildingObj.statusData1 = data.data1;
    buildingObj.statusData2 = data.data2;
    buildingObj.itemGuid = siteMapObj.itemGuid;
    this.buildingStatusList.push(buildingObj);
  }

  /**
   * If the link has been clicked, go to building
   */
  on_click(siteId, buildingId, buildingGuid) {
    this.buildingIds = [];
    // SendBuildingIds store array of building ids in local storage.
    this.siteMapData.mapItem.forEach(siteMapObj => {
      if (siteMapObj.buildingId) {
        this.buildingIds.push(siteMapObj.buildingId);
      }
    });
    this.local.sendBuildingIds(this.buildingIds);
    this.local.sendBuildingGuid(buildingGuid);
    this.local.sendCurrentBuildingId(buildingId);
    this.router.navigate(['./monitoring/site-map/building', { siteId: siteId, buildingId: buildingId }]);
  }

  on_clickInfo(buildingName, status, siteId, buildingId, buildingGuid) {
    const btnCancelVal: any = this.translate.get('monitoringSiteMap.cancel');
    const btnConfirmVal: any = this.translate.get('monitoringSiteMap.confirm');
    const statusName: any = this.translate.get('monitoringSiteMap.status');
    const statusParam = 'enums.mapItemStatus.' + MapItemStatus[status];
    const statusVal: any = this.translate.get(statusParam);
    swal({
      title: '<strong>' + buildingName + '</strong>',
      html: '<table style="text-align:left">' +
        '<tr><td>' + statusName.value + '</td><td>:</td><td><strong>' + statusVal.value + '</strong></td></tr>' +
        '</table>',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      confirmButtonText: btnConfirmVal.value,
      cancelButtonClass: 'btn btn-danger',
      cancelButtonText: btnCancelVal.value,
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {


        this.buildingIds = [];
        // SendBuildingIds store array of building ids in local storage.
        this.siteMapData.mapItem.forEach(siteMapObj => {
          if (siteMapObj.buildingId) {
            this.buildingIds.push(siteMapObj.buildingId);
          }
        });
        this.local.sendBuildingIds(this.buildingIds);
        this.local.sendBuildingGuid(buildingGuid);
        this.local.sendCurrentBuildingId(buildingId);
        this.router.navigate(['./monitoring/site-map/building', { siteId: siteId, buildingId: buildingId }]);

      }
    });
  }
}
