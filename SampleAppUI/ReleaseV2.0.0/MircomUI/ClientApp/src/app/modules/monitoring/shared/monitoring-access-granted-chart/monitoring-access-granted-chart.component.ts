/**
 * Import dependencies
 */
import { Component, OnInit, ViewEncapsulation, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import * as Chartist from 'chartist';
import { HttpService } from 'src/app/services/http.service';
import { urls } from 'src/app/services/urls';
import ChartistTooltip from 'chartist-plugin-tooltips-updated';
import { DataService } from 'src/app/services/data.service';
import { ChangeDetectionStrategy } from '@angular/core';
import { LocalStorageService } from 'src/app/services/localStorage.service';
declare var $: any;

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-monitoring-access-granted-chart',
  templateUrl: './monitoring-access-granted-chart.component.html',
  styleUrls: ['./monitoring-access-granted-chart.component.css']
})

/**
 * Access grant chart component
 */
export class MonitoringAccessGrantedChartComponent implements OnInit, OnDestroy {

  /**
   * variables declaration
   */
  @Output() outputChartData: EventEmitter<any> = new EventEmitter();
  @Output() outputChartCaption: EventEmitter<any> = new EventEmitter();
  @Input() isDashboard: boolean;
  @Input() numberOfCharts: number;
  accessGrantedChart: any;
  accessGrantedChartData: any;
  chartHightestValue: any;
  reportGUID = this.local.getReportGuid();
  startCount = 0;
  timeInterval: number;
  intervalFunc: any;
  isChartOptionsSaved: boolean;
  chartNumber: any;
  /**
   * @param httpService
   * Inject the services in the constructor
   */
  constructor(private httpService: HttpService, private dataService: DataService, private local: LocalStorageService) {
  }

  /**
   * OnInit - Get signalR, Event
   */
  ngOnInit() {
    this.chartNumber = JSON.stringify(this.numberOfCharts);
    this.chartNumber = Number(this.chartNumber);
    if (!this.chartNumber) {
      this.chartNumber = 1;
    }
    this.dataService.chartDataBoolMessage.subscribe(message => {
      this.isChartOptionsSaved = message;
      if (this.isChartOptionsSaved) {
        this.bindAccessGrantedChartData();
      }
    });
    this.bindAccessGrantedChartData();
  }

  /**
   * Destroy the signalR connection and remove tooltip for chart
   */
  ngOnDestroy() {
    this.startCount = 0;
    clearInterval(this.intervalFunc);
    $('div').removeClass('chartist-tooltip');
    $('.chartist-tooltip-value').css('display', 'none');
  }

  /**
   * Bind access grant chart data
   */
  private bindAccessGrantedChartData() {
    this.getAccessGrantedChartData().then(res => {
      const optionsAccessGrantedChart: any = {
        lineSmooth: Chartist.Interpolation.cardinal({
          tension: 10
        }),
        plugins: [
          ChartistTooltip()
        ],
        axisY: {
          showGrid: true,
          offset: 40,
          onlyInteger: true
        },
        axisX: {
          showGrid: false,
          onlyInteger: true
        },
        low: 0,
        // high: 5,
        showPoint: true,
        chartPadding: 50
        // height: '300px',
      };
      this.accessGrantedChart = new Chartist.Line('#accessGrantedChartPreferences_' + this.chartNumber, this.accessGrantedChartData.plotDetail,
        optionsAccessGrantedChart);
    });
  }

  /**
   * Get access grant chart data from api
   */
  private getAccessGrantedChartData() {
    const promise = new Promise((resolve, reject) => {
      const url = urls.charts + '?reportGuid=' + this.reportGUID;
      this.httpService.getRequest(url)
        .toPromise()
        .then(
          (res: any) => { // Success
            if (res.success) {
              this.accessGrantedChartData = res.data;
              this.outputChartData.emit(this.accessGrantedChartData);
              this.outputChartCaption.emit(this.accessGrantedChartData.title);
              this.timeInterval = res.data.refreshInterval;
              if (this.timeInterval > 0) {
                this.startCount += 1;
                if (this.startCount === 1) {
                  const self = this;
                  this.intervalFunc = setInterval(function() {
                    self.getAccessGrantedChartData().then(resp => {
                      self.accessGrantedChart.update(self.accessGrantedChartData.plotDetail);
                    });
                  }, self.timeInterval);
                }
              }
              resolve();
            }
          }
        );
    });
    return promise;
  }

  /**
   * Animation on chart
   * @param chart
   */
  private startAnimationForLineChart(chart: any) {
    let seq: number;
    let delays: number;
    let durations: number;
    seq = 0;
    delays = 80;
    durations = 500;
    chart.on('draw', function(data: any) {

      if (data.type === 'line' || data.type === 'area') {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if (data.type === 'point') {
        seq++;
        data.element.animate({
          opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq = 0;
  }
}
