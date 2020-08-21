/**
 * Import dependencies
 */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { urls } from 'src/app/services/urls';
import { EventRequest } from 'src/app/shared/interfaces/eventInterfaces';
import { HttpService } from 'src/app/services/http.service';
import { LocalStorageService } from 'src/app/services/localStorage.service';
import { SignalrService } from 'src/app/services/signalR.service';
import { Subscription } from 'rxjs';
import { UtilsService } from 'src/app/services/utility.services';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ChartOptionComponent } from '../../shared/chart-option/chart-option.component';
import { ChartExportOptions } from 'src/app/shared/enums';
import { ExportToCsv } from 'export-to-csv';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})


export class ChartComponent implements OnInit, OnDestroy {

  /**
   * Variables declaration
   */
  eventModel: any;
  eventsData: any = [];
  isExpandable: boolean;
  isDashboard = false;
  subscription: Subscription;
  chartExportOptions = ChartExportOptions;
  chartsList: any = [];
  chartData: any;
  chartCaption: string;

  /**
   * Inject the services in the constructor
   */
  constructor(
    public dialog: MatDialog,
    private excelService: ExcelService,
    private httpService: HttpService,
    private readonly signalR: SignalrService,
    private local: LocalStorageService,
    private utilsService: UtilsService) { }

  /**
   * Event grid expandable handler
   * @param isExpand
   */
  eventExpandableChangedHandler(isExpand: boolean) {
    this.isExpandable = isExpand;
  }

  /**List of menu to display for chart export options
   * @returns list of menu items
   */
  chartExportOptionsKeys(): Array<string> {
    const keys = Object.keys(this.chartExportOptions);
    return keys.slice(keys.length / 2);
  }

  /**
   * OnInit - Get signalR, Event and bind building floors
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

  eventChartDataBindHandler(chartsData) {
    this.chartData = chartsData.plotDetail;
    this.chartCaption = chartsData.title;
  }

  /**
   * Destroy the signalR connection
   */
  ngOnDestroy(): void {
    this.signalR.disconnect();
  }

  onExportOptionClick(ev, selectedExportOption) {
    this.bindChartData();
    switch (selectedExportOption) {
      /**
       * Action Item - CSV
       */
      case ChartExportOptions[ChartExportOptions.CSV]: {
        const options = {
          fieldSeparator: ',',
          quoteStrings: '"',
          decimalSeparator: '.',
          showLabels: true,
          showTitle: true,
          title: 'Chart Data',
          useTextFile: false,
          useBom: true,
          useKeysAsHeaders: true
        };
        const csvExporter = new ExportToCsv(options);
        csvExporter.generateCsv(this.chartsList);
        break;
      }
      /**
       * Action Item - XLS
       */
      case ChartExportOptions[ChartExportOptions.XLS]: {
        this.excelService.exportAsExcelFile(this.chartsList, 'chart');
        break;
      }
      default: {
        break;
      }
    }
  }

  bindChartData() {
    this.chartsList = [];
    for (let i = 0; i < this.chartData.labels.length; i++) {
      const obj: any = {};
      obj.Label = this.chartData.labels[i];
      for (let j = 0; j < this.chartData.series.length; j++) {
        eval('obj.Value' + (j + 1) + ' = ' + this.chartData.series[j][i]);
      }
      this.chartsList.push(obj);
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
   * Push the signalR data to event
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
            severity: responseMessage.Severity
          });
        }
      }
    }
  }

  /** Open edit dialog */
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = '60%';
    dialogConfig.width = '30%';
    this.dialog.open(ChartOptionComponent, dialogConfig);
  }
}
