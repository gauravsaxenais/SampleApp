import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatTable, MatSort, MatSortable, MatSortHeader, MatTableDataSource } from '@angular/material';
import { LocalStorageService } from 'src/app/services/localStorage.service';
import { HttpService } from 'src/app/services/http.service';
import { Router } from '@angular/router';
import { urls } from 'src/app/services/urls';
import { SignalrService } from 'src/app/services/signalR.service';
import { Subscription } from 'rxjs';
import { MapItemStatus } from 'src/app/shared/enums';
import { UtilsService } from 'src/app/services/utility.services';
import { EventRequest } from 'src/app/shared/interfaces/eventInterfaces';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.css']
})


export class SystemComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns: string[] = ['panel', 'status', 'model', 'version', 'actions'];
  expandedElement: any;

  dataSource: any = new MatTableDataSource([]);
  subscription: Subscription;
  alarmStatus = 0;
  troubleStatus = 0;
  systemStatus: boolean;
  eventsData: any = [];
  isExpandable: boolean;
  mapItemStatus = MapItemStatus;
  panelData: any = {};
  errroMessageOnPanelDetailPopUp: any;
  isLoading = true;
  // isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('childPanels');

  constructor(
    private local: LocalStorageService,
    private httpService: HttpService,
    private router: Router,
    private readonly signalR: SignalrService,
    private utilsService: UtilsService,
    private ref: ChangeDetectorRef) { }

  isExpansionDetailRow = (i: number, row: any) => row.hasOwnProperty('childPanels');

  ngOnInit() {
    this.signalR.initializeSignalRConnect();

    this.signalR.setBroadcastEvent();
    this.bindEventsData();
    this.subscription = this.signalR.observableEvent
      .subscribe(item => {
        this.mapSignalREventData(item);
      });

    this.signalR.setBroadcastPanelStatusChange();
    this.getSystemData();
    this.subscription = this.signalR.observablePanelStatusChange
      .subscribe(item => {
        this.panelStatusSignalRData(item);
      });
  }

  /**
   * Destroy the signalR connection
   */
  ngOnDestroy(): void {
    this.signalR.disconnect();
  }

  /**
   * SignalR to set alarm status
   * @param serverMessage
   */
  panelStatusSignalRData(serverMessage: string) {
    if (serverMessage != null) {
      const isJsonValidate = this.utilsService.IsJsonString(serverMessage);
      if (isJsonValidate) {
        const responseMessage = JSON.parse(serverMessage);
        this.dataSource.data.forEach(obj => {
          if (obj.panelGuid === responseMessage.ObjectID) {
            obj.status = responseMessage.Status;
          }
          obj.childPanels.forEach(objChild => {
            if (objChild.panelGuid === responseMessage.ObjectID) {
              objChild.status = responseMessage.Status;
            }
          });

        });
        this.assignVariableForCount();
      }
    }
  }

  assignVariableForCount() {
    this.alarmStatus = 0;
    this.troubleStatus = 0;
    this.systemStatus = false;

    this.dataSource.data.forEach(obj => {
      /**
       * Count alarm and trouble
       */
      if (obj.status === MapItemStatus.alarm || obj.status === MapItemStatus.offline) {
        this.alarmStatus += 1;
      }
      if (obj.status === MapItemStatus.trouble) {
        this.troubleStatus += 1;
      }
      if (obj.childPanels) {
        obj.childPanels.forEach(childObj => {
          if (childObj.status === MapItemStatus.alarm || childObj.status === MapItemStatus.offline) {
            this.alarmStatus += 1;
          }
          if (childObj.status === MapItemStatus.trouble) {
            this.troubleStatus += 1;
          }
        });
      }
      /**
       * Set system status
       */
      if (this.alarmStatus > 0 || this.troubleStatus > 0) {
        this.systemStatus = true;
      }
    });
    this.ref.detectChanges();
  }

  /**
   * Get system data from api
   */
  getSystemData() {
    const url = urls.systemConfiguration + '/' + this.local.getSiteId();
    this.httpService.getRequest(url).subscribe((res: any) => {
      if (res.success) {
        if (res.data != null) {
          res.data.forEach(obj => {
            if (!obj.childPanels) {
              obj.childPanels = [];
            }
          });
          /**
           * Map data into DataSource
           */
          this.dataSource = new MatTableDataSource(res.data);
          this.dataSource.sort = this.sort;
          this.assignVariableForCount();
        }
      }
      this.isLoading = false;
    }, (err: any) => {
      this.isLoading = false;
      if (err.error != null && err.error.message != null) {
      }
    });
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
        }
      }
    }
  }


  /**
   * Event grid expandable handler
   * @param isExpand
   */
  eventExpandableChangedHandler(isExpand: boolean) {
    this.isExpandable = isExpand;
  }

  onSystemRowClick(ev, selectedPanel) {
    this.panelData = {};
    this.errroMessageOnPanelDetailPopUp = '';
    const url = urls.panelInfo + '/' + selectedPanel.panelGuid;
    this.httpService.getRequest(url).subscribe((res: any) => {
      if (res.success && res.message !== null) {
        if (res.message.messageCode === 200 && res.data !== null) {
          this.bindPanelInfo(res.data);
        } else {
          this.errroMessageOnPanelDetailPopUp = res.message.description;
        }
      }
    }, (err: any) => {
      if (err.error != null && err.error.message != null) {
        this.errroMessageOnPanelDetailPopUp = err.error.message.description;
      }
    });

  }

  bindPanelInfo(panelData: any) {
    this.panelData.panelName = panelData.name;
    this.panelData.panelType = panelData.type;
    this.panelData.panelModel = panelData.model;
    this.panelData.panelFirmware = panelData.firmwareVersion;
    this.panelData.panelHardware = panelData.hardwareVersion;
    this.panelData.panelRSAddress = panelData.rs485address;
    this.panelData.panelIPAddress = panelData.lanipaddress;
    this.panelData.panelSerialNumber = panelData.serialNumber;
    this.panelData.panelLastChanged = panelData.lastConfigTimeStamp;
    this.panelData.panelTouchSoftware = panelData.touchSoftwareVersion;
    this.panelData.panelTouchHardware = panelData.touchHardwareVersion;
    this.panelData.panelTouchDatabase = panelData.touchDbversion;
    this.panelData.panelTouchGUID = panelData.touchGuid;
    this.panelData.panelWANIPAddress = panelData.wanipaddress;
  }
}


