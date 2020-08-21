/**
 * Import dependencies
 */
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { LocalStorageService } from 'src/app/services/localStorage.service';
import { SignalrService } from 'src/app/services/signalR.service';
import { HttpService } from 'src/app/services/http.service';
import { urls } from 'src/app/services/urls';
import { Subscription } from 'rxjs';
import { UtilsService } from 'src/app/services/utility.services';
import { MapItemStatus, AccessPointWebCmd } from 'src/app/shared/enums';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-monitoring-access-point',
  templateUrl: './monitoring-access-point.component.html',
  styleUrls: ['./monitoring-access-point.component.css']
})

/**
 * Create accesspoint component
 */
export class MonitoringAccessPointComponent implements OnInit, OnDestroy {
  /**
   * variables declaration
   */
  siteId = this.local.getSiteId();
  accessPointData: any;
  accessPointStatusData: any;
  accessPointStatusList = [];
  mapItemStatus = MapItemStatus;
  accessPointWebCommand = AccessPointWebCmd;
  subscription: Subscription;
  isRefreshedOnDashboard: boolean;

  /**
   * Inject the services in the constructor
   * @param local
   * @param signalR
   * @param httpService
   * @param utilsService
   */
  constructor(
    private local: LocalStorageService,
    private readonly signalR: SignalrService,
    private httpService: HttpService,
    private utilsService: UtilsService,
    private router: Router,
    private ref: ChangeDetectorRef,
    private dataService: DataService
  ) { }

  /**
   * OnInit - Get access point data and its signalR message
   */
  ngOnInit() {
    this.dataService.accessPointDataBoolMessage.subscribe(message => {
      this.isRefreshedOnDashboard = message;
      if (this.isRefreshedOnDashboard) {
        this.getAccessPointData();
      }
    });

    this.signalR.setBroadcastAccessPointItemsStatus();
    this.getAccessPointData();
    this.subscription = this.signalR.observableAccessPointItemsStatus
      .subscribe(item => {
        this.mapSignalRAccessPointStatusData(item);
      });
  }

  /**
   * Disconnect the signalR
   */
  ngOnDestroy(): void {
    this.signalR.disconnect();
  }

  /**List of menu to display for access points command
   * @returns list of menu items
   */
  accessPointCommandsKeys(): Array<string> {
    const keys = Object.keys(this.accessPointWebCommand);
    return keys.slice(keys.length / 2);
  }

  /**
   * Event to display list of menus on access point click
   * @param event
   * @param objectId
   * @param command
   */
  onCommandClick(event, objectId, command, mapGuid, channelGuid, mapId) {
    if (command !== 'Camera' && command !== 'Map') {
      this.signalR.sendAccessPointCommand(objectId, AccessPointWebCmd[command]);
    }

    if (command === 'Camera') {
      this.popUpCamera(channelGuid);
    }
    if (command === 'Map') {
      this.popUpMap(mapGuid, mapId);
    }
  }

  /**
   * popUpCamera - it will open the camera in popup window
   * @param channelGuid
   */
  popUpCamera(channelGuid) {
    const camPopupWinWidth = 900;
    const camPopupWinHeight = 700;
    const left = (window.screen.width - camPopupWinWidth) / 2;
    const top = (window.screen.height - camPopupWinHeight) / 4;

    if (channelGuid && channelGuid !== '00000000-0000-0000-0000-000000000000') {
      this.router.navigate([]).then(result => {
        window.open('#/cameraSinglePopup/' + channelGuid, '_blank',
          'fullscreen=yes;toolbar=no;resizable=yes,width=' + camPopupWinWidth + ',height=' + camPopupWinHeight + ',top=' + top + ',left' + left + ',screenX=' + left + ',screenY=' + top);
      });
    }
  }

  /**
   * popUpMap - it will open the map in popup window
   * @param mapGuid
   * @param mapId
   */
  popUpMap(mapGuid, mapId) {
    if (mapGuid && mapGuid !== '00000000-0000-0000-0000-000000000000') {
      this.router.navigate([]).then(result => {
        window.open('#/siteMapView/' + mapGuid, '_blank',
          'fullscreen=yes;toolbar=no;resizable=yes,width=1500,height=900');
      });
    }
  }

  /**
   * Disable right click on access point mentu
   */
  onRightClick(e) {
    return false;
  }

  /**
   * SignalR status binding to access point
   * @param serverMessage
   */
  private mapSignalRAccessPointStatusData(serverMessage: string) {
    if (serverMessage != null) {
      const isJsonValidate = this.utilsService.IsJsonString(serverMessage);
      if (isJsonValidate) {
        const responseMessage = JSON.parse(serverMessage);
        if (responseMessage.hasOwnProperty('ObjectType') && this.accessPointStatusList) {
          let isMatched = false;
          this.accessPointStatusList.forEach(obj => {
            if (obj.objectId === responseMessage.ObjectID) {
              obj.status = responseMessage.Status;
              obj.objectType = responseMessage.ObjectType;
              obj.statusData1 = responseMessage.Data1;
              obj.statusData2 = responseMessage.Data2;
              obj.description = responseMessage.Description;

              isMatched = true;
            }
            if (isMatched) {
              this.ref.detectChanges();
              this.ref.markForCheck();
            }
          });
        }
      }
    }
  }

  /**
   * Bind access point from api
   */
  private getAccessPointData() {
    this.accessPointData = [];
    this.accessPointStatusData = [];
    this.accessPointStatusList = [];
    const url = urls.accessPoint + '/' + this.siteId;
    this.httpService.getRequest(url).subscribe(
      (res: any) => {
        if (res.success && res.message.messageCode === 200 && res.data != null) {
          this.accessPointData = res.data;
          /**
           * Get status data by siteId and panelGuid
           */
          const statusAccessPointUrl = urls.statusAccessPoint + '/' + this.siteId;
          this.httpService.getRequest(statusAccessPointUrl).subscribe(
            (response: any) => {
              if (response.success && response.message.messageCode === 200 && response.data != null) {
                this.accessPointStatusData = response.data;
                this.accessPointData.forEach(accessPointObj => {
                  /**
                   * fetch data where objectId of status data equals to access point id
                   */
                  const data = this.accessPointStatusData.find(ob => parseInt(ob.objectId.split('_')[1], 10) === accessPointObj.accesspointId && ob.objectId.split('_')[0] === accessPointObj.panelGuid);
                  /**
                   * if data is null then it takes normal as a status of event
                   * else it takes status from the data(response from api)
                   */
                  if (data !== undefined && data !== null) {
                    this.accessPointStatusDataIfMatched(data, accessPointObj);
                  } else {
                    this.accessPointStatusDataIfNotMatched(accessPointObj);
                  }
                });
              } else {
                this.accessPointData.forEach(accessPointObj => {
                  this.accessPointStatusDataIfNotMatched(accessPointObj);
                });
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
   * If signalR does not find any access point then assign normal status
   * @param accessPointObj
   */
  private accessPointStatusDataIfNotMatched(accessPointObj: any) {
    const accessObj: any = {};
    accessObj.objectId = '';
    accessObj.accesspointId = accessPointObj.accesspointId;
    accessObj.status = 1;
    accessObj.siteId = accessPointObj.siteId;
    accessObj.name = accessPointObj.name;
    accessObj.statusData1 = 0;
    accessObj.statusData2 = 0;
    accessObj.description = 'Normal';
    accessObj.channelGuid = accessPointObj.channelGuid;
    accessObj.mapGuid = accessPointObj.mapGuid;
    accessObj.mapId = accessPointObj.mapId;
    accessObj.panelName = accessPointObj.panelName;
    this.accessPointStatusList.push(accessObj);
  }

  /**
   * Bind the access point with signalR response
   * @param data
   * @param accessPointObj
   */
  private accessPointStatusDataIfMatched(data: any, accessPointObj: any) {
    const accessObj: any = {};
    accessObj.objectId = data.objectId;
    accessObj.accesspointId = parseInt(data.objectId.split('_')[1], 10);
    accessObj.siteId = accessPointObj.siteId;
    accessObj.status = data.status;
    accessObj.name = accessPointObj.name;
    accessObj.statusData1 = data.data1;
    accessObj.statusData2 = data.data2;
    accessObj.description = data.description;
    accessObj.channelGuid = accessPointObj.channelGuid;
    accessObj.mapGuid = accessPointObj.mapGuid;
    accessObj.mapId = accessPointObj.mapId;
    accessObj.panelName = accessPointObj.panelName;
    this.accessPointStatusList.push(accessObj);
  }

}
