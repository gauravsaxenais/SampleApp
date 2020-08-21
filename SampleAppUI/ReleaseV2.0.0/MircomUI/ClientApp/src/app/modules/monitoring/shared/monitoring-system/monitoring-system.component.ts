import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { SignalrService } from 'src/app/services/signalR.service';
import { Subscription } from 'rxjs';
import { urls } from 'src/app/services/urls';
import { LocalStorageService } from 'src/app/services/localStorage.service';
import { UtilsService } from 'src/app/services/utility.services';
import { MapItemStatus } from 'src/app/shared/enums';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-monitoring-system',
  templateUrl: './monitoring-system.component.html',
  styleUrls: ['./monitoring-system.component.css']
})
export class MonitoringSystemComponent implements OnInit {
  subscription: Subscription;
  alarmStatus = 0;
  troubleStatus = 0;
  systemStatus: boolean;
  dataSource: any = [];
  isRefreshedOnDashboard: boolean;

  constructor(
    private local: LocalStorageService,
    private readonly signalR: SignalrService,
    private utilsService: UtilsService,
    private httpService: HttpService,
    private dataService: DataService) { }

  ngOnInit() {
    this.refreshSystem();

    this.signalR.setBroadcastPanelStatusChange();
    this.getSystemData();
    this.subscription = this.signalR.observablePanelStatusChange
      .subscribe(item => {
        this.panelStatusSignalRData(item);
      });
  }

/**
 * Get system data from api
 */
  getSystemData() {
    const url = urls.systemConfiguration + '/' + this.local.getSiteId();
    this.httpService.getRequest(url).subscribe((res: any) => {
      if (res.success && res.data != null) {
        res.data.forEach(obj => {
          if (!obj.childPanels) {
            obj.childPanels = [];
          }
        });
        this.dataSource = res.data;
        this.assignVariableForCount();
      }
    }, (err: any) => {
      if (err.error != null && err.error.message != null) {
      }
    });

  }

  refreshSystem() {
    this.dataService.systemDataBoolMessage.subscribe(message => {
      this.isRefreshedOnDashboard = message;
      if (this.isRefreshedOnDashboard) {
        this.getSystemData();
      }
    });
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
        });
        this.assignVariableForCount();
      }
    }
  }

  assignVariableForCount() {
    this.alarmStatus = 0;
    this.troubleStatus = 0;
    this.systemStatus = false;

    this.dataSource.forEach(obj => {
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
  }

}

