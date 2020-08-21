/**
 * Import dependencies
 */
import { Component, OnInit, Inject, ViewEncapsulation, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { urls } from 'src/app/services/urls';
import { HttpService } from 'src/app/services/http.service';
import { CustomEventType, ProductType, PanelItemType } from 'src/app/shared/enums';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { DatePipe } from '@angular/common';
import { UtilsService } from 'src/app/services/utility.services';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from 'src/app/services/localStorage.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-chart-option',
  templateUrl: './chart-option.component.html',
  styleUrls: ['./chart-option.component.css']
})

/**
 * Create chart option component
 */
export class ChartOptionComponent implements OnInit, OnDestroy {
  /**
   * Variables declaration
   */
  form: FormGroup;
  chartTitle: string;
  chartOptionsData: any = {};
  reportGUID = this.local.getReportGuid();
  chartResponse: any;
  intervalData: any;
  showStartEndDate: boolean;
  errorMessageOnEditChartPopUp: string;
  max = new Date();
  min: any;
  settings = {
    bigBanner: true,
    timePicker: true,
    format: 'dd-MM-yyyy',
    defaultOpen: false
  };
  eventTypesList: any = [];
  panelsList: any = [];
  panelItemsList: any = [];
  showInterval: boolean;
  eventTypeLabel: string;
  panelItemTypeLocal: number;

  /**
   * Inject the services in the constructor
   * @param httpService
   * @param fb
   * @param router
   * @param dialogRef
   */
  constructor(
    private httpService: HttpService,
    private fb: FormBuilder,
    private router: Router,
    private dataService: DataService,
    private dialogRef: MatDialogRef<ChartOptionComponent>,
    private datePipe: DatePipe,
    private utilsService: UtilsService,
    private translate: TranslateService,
    private local: LocalStorageService
  ) { }

  /**
   * OnInit - Get chart options data
   */
  ngOnInit() {
    this.getOneMonthPreviousDate();
    this.getChartOptions();
    this.utilsService.getSetLanguage();
  }

  /**
   *  ngOnDestroy - On destroy, set false to changechartdata
   *  so that it will not refresh the chart data again
   *  when screen changes
   */
  ngOnDestroy() {
    this.dataService.changeChartData(false);
  }

  /**
   * getOneMonthPreviousDate - get 30 days previous date
   */
  getOneMonthPreviousDate() {
    const currentDate = new Date();
    const previousYearDate = new Date().setDate(currentDate.getDate() - 30);
    this.min = new Date(previousYearDate);
  }

  /**
   * getChartOptions - Get chart options data and bind in the form tag
   */
  getChartOptions() {
    const url = urls.chartOptions + '?reportGuid=' + this.reportGUID;
    this.httpService.getRequest(url).subscribe((response: any) => {
      if (response.success && response.data != null && response.data.title) {
        // response ok
        this.chartOptionsData = response.data;
        /**
         * bind data in form
         */
        this.form = this.fb.group({
          title: [this.chartOptionsData.title, [Validators.required]],
          siteId: [this.chartOptionsData.siteId, []],
          siteData: [this.chartOptionsData, []],
          eventTypeId: [this.chartOptionsData.eventTypeId, []],
          panelGuid: [this.chartOptionsData.panelGuid, []],
          panelItemId: [this.chartOptionsData.panelItemId, []],
          chartTypeId: [this.chartOptionsData.chartTypeId.toString(), []],
          radioTime: [Number(this.chartOptionsData.radioTime), []],
          intervalId: [Number(this.chartOptionsData.intervalId), [Validators.required]],
          panelItemType: [Number(this.chartOptionsData.panelItemType), []],
          customTimeBegin: [this.chartOptionsData.customTimeBegin, []],
          customTimeEnd: [this.chartOptionsData.customTimeEnd, []],
          reportGuid: [this.chartOptionsData.reportGuid, []],
          reportTypeId: [this.chartOptionsData.reportTypeId, []],
          intervalDetails: ['', []]
        });
        if (this.chartOptionsData.panelGuid === null) {
          this.form.controls['panelGuid'].setValue('');
        }
        if (this.chartOptionsData.radioTime) {
          this.onDurationChange(this.chartOptionsData.radioTime);
        }
        if (this.chartOptionsData.radioTime !== 5 && this.chartOptionsData.intervalId) {
          this.onIntervalChange(this.chartOptionsData.intervalId);
        }
        if (this.chartOptionsData.eventTypeId) {
          this.onEventTypeChange(this.chartOptionsData.eventTypeId);
        }
        if (this.chartOptionsData.radioTime === 5) {
          this.onDateTimeChange('');
          this.onIntervalChange(this.chartOptionsData.intervalId);
        }
      } else if (!response.success && response.message) {
        /**
         * close the popup if data not exist
         */
        this.close();
        alert(response.message.description);
      }
      console.log(this.form);
    }, (error) => {
      // error
      this.close();
    });
  }

  /**
   * chartTypeKeys - Bind chart types in the dropdown
   */
  chartTypeKeys(): Array<string> {
    if (this.chartOptionsData.chartType) {
      return Object.keys(this.chartOptionsData.chartType);
    }
  }

  /**
   * onEventTypeChange - on change of event type makes api request and fetch panels and panel items data
   * @param selectedEventTypeId
   */
  onEventTypeChange(selectedEventTypeId) {
    this.panelsList = [];
    this.panelItemsList = [];

    const selectedEvent = this.chartOptionsData.eventInfos.find(z => z.key === selectedEventTypeId);
    if (selectedEvent && selectedEvent.customEventType !== CustomEventType.WholePanel && selectedEvent.productTypeId !== 0) {
      const url = urls.chartPanelOption;
      const data = {
        whenEventKey: selectedEventTypeId,
        customEventType: selectedEvent.customEventType,
        productType: selectedEvent.productTypeId,
        siteId: this.chartOptionsData.siteId
      };
      this.httpService.postRequest(url, JSON.stringify(data)).subscribe((response: any) => {
        if (response.success && response.data != null) {
          // response ok
          this.panelsList = response.data;
          this.panelsList.forEach(obj => {
            if (!obj.panelsGuid) {
              obj.panelsGuid = '';
            }
          });
          this.panelsList.forEach(panelItem => {
            if (panelItem.panelsGuid === this.form.value.panelGuid) {
              this.panelItemsList = panelItem.items;
            }
          });
          /**
           * bind panel item type
           */
          if (selectedEvent.customEventType === CustomEventType.Input) {
            this.form.value.panelItemType = PanelItemType.Input;
            this.eventTypeLabel = 'Input';
          } else if (selectedEvent.customEventType === CustomEventType.None) {
            this.eventTypeLabel = 'AccessPoint';
            this.form.value.panelItemType = PanelItemType.AccessPoint;
          }
          const panelItemType = this.form.value.panelItemType;
          this.panelItemTypeLocal = panelItemType;
        } else if (!response.success) {
        }

      }, (error) => {
        // error
      });
    }
  }

  /**
   * onPanelChange - on change of panel, bind panel items
   * @param selectedPanelGuid
   */
  onPanelChange(selectedPanelGuid) {
    this.panelsList.forEach(panelItem => {
      if (panelItem.panelsGuid === selectedPanelGuid) {
        this.panelItemsList = panelItem.items;
      }
    });
  }

  /**
   * onDurationChange - on change of duration, bind interval data
   * @param selectedDurationId
   */
  onDurationChange(selectedDurationId) {
    this.form.value.intervalId = null;
    if (selectedDurationId !== 5) {
      this.showStartEndDate = false;
      const durationData = this.chartOptionsData.durationDetails.find((data: any) => data.id === selectedDurationId);
      if (durationData) {
        this.intervalData = durationData.intervalDetail;
      } else {
        this.intervalData = [];
      }
    } else {
      this.showStartEndDate = true;
      this.calculateMinutesInCaseOfStartEndDate();
    }
    this.showInterval = true;
  }

  /**
   * onIntervalChange - on change of interval, bind interval details
   * @param selectedIntervalId
   */
  onIntervalChange(selectedIntervalId) {
    let isFound = false;
    if (this.intervalData) {
      this.intervalData.forEach(intervalObj => {
        if (intervalObj.intervalId === selectedIntervalId && !isFound) {
          this.form.controls['intervalDetails'].setValue(intervalObj.interval + '_' + intervalObj.unitName);
          isFound = true;
        }
      });
    }
  }

  /**
   * onDateTimeChange - on change of start date and end date
   * calculate difference between both the dates in minutes
   * then display interval drop down according to minutes
   * @param ev
   */
  onDateTimeChange(ev) {
    this.calculateMinutesInCaseOfStartEndDate();
  }

  /**
   * calculateMinutesInCaseOfStartEndDate - calculation of minutes in case of start date and end date
   */
  calculateMinutesInCaseOfStartEndDate() {
    const startDateTime = this.form.value.customTimeBegin;
    const endDateTime = this.form.value.customTimeEnd;
    if (startDateTime && endDateTime) {
      const isValid = this.validateDates(startDateTime, endDateTime);
      if (isValid) {
        const minutes = (new Date(endDateTime).getTime() - new Date(startDateTime).getTime()) / (60 * 1000);
        if (minutes <= 10) {
          this.bindIntervalDropDownOnStartEndDate(5, 'Seconds');
        } else if (minutes > 10 && minutes <= 60) {
          this.bindIntervalDropDownOnStartEndDate(5, 'Minutes');
        } else if (minutes > 60 && minutes <= 1440) {
          this.bindIntervalDropDownOnStartEndDate(5, 'Hours');
        } else if (minutes > 1440 && minutes <= 43200) {
          this.bindIntervalDropDownOnStartEndDate(5, 'Day');
        }
      }
    }
  }

  /**
   * bindIntervalDropDownOnStartEndDate - bind intervals dropdown on
   * @param selectedDurationId
   */
  bindIntervalDropDownOnStartEndDate(selectedDurationId, intervalDataType) {
    this.showInterval = true;
    const durationData = this.chartOptionsData.durationDetails.find((data: any) => data.id === selectedDurationId);
    if (selectedDurationId === 5) {
      if (durationData) {
        const intervalData = durationData.intervalDetail.filter(z => z.durationId === selectedDurationId && z.unitName === intervalDataType);
        this.intervalData = intervalData;
      } else {
        this.intervalData = [];
      }
    }
  }

  /** save - save chart options
   */
  save() {
    this.form.value.panelItemType = this.panelItemTypeLocal;
    this.errorMessageOnEditChartPopUp = '';
    let isValid = true;
    if (this.form.value.radioTime !== 5) {
      this.form.value.customTimeBegin = null;
      this.form.value.customTimeEnd = null;
    } else {

      isValid = this.validate();
      if (isValid) {
        const startDate = new Date(this.form.value.customTimeBegin);
        this.form.value.customTimeBegin = startDate.toLocaleString();
        const endDate = new Date(this.form.value.customTimeEnd);
        this.form.value.customTimeEnd = endDate.toLocaleString();

      }
    }
    /**
     *  make API request to the server
     */
    if (isValid) {
      const url = urls.updateChartOptions;
      this.httpService.postRequest(url, JSON.stringify(this.form.value)).subscribe((res: any) => {
        if (res != null && res.success) {
          this.errorMessageOnEditChartPopUp = '';
          this.dialogRef.close(this.form.value);
          this.dataService.changeChartData(true);
        } else {

        }
      },
        (err: any) => {
          if (err.error != null && err.error.message != null) {
          }
        }
      );
    }
  }

  /**
   * validate - validate form fields
   * if valid then return true otherwise
   */
  validate() {
    const validDate = this.validateDates(this.form.value.customTimeBegin, this.form.value.customTimeEnd);
    const validForm = this.validateFormFields();
    if (validDate && validForm) {
      return true;
    }
    return false;
  }

  /**
   * validateFormFields - validate all form fields
   * if valid then return true otherwise
   */
  validateFormFields() {
    const chartTypeVal: any = this.translate.get('chartOption.pleaseSelectChartType');
    const intervalVal: any = this.translate.get('chartOption.pleaseSelectInterval');

    if (!this.form.value.chartTypeId) {
      this.errorMessageOnEditChartPopUp = chartTypeVal.value;
      return false;
    }
    if (!this.form.value.intervalId) {
      this.errorMessageOnEditChartPopUp = intervalVal.value;
      return false;
    }
    return true;
  }

  /**
   * validateDates - used to check validation of start date and end date
   * start and end is mandatory
   * this method will check start date should be less than end date
   * end date must be less than or equal to current date
   * start date should not be less that one month
   * @param sDate
   * @param eDate
   */
  validateDates(sDate: string, eDate: string) {
    this.errorMessageOnEditChartPopUp = '';
    const startEndDatesRequired: any = this.translate.get('chartOption.startEndDatesRequired');
    const endDateNotGreater: any = this.translate.get('chartOption.endDateNotGreater');
    const endDateShouldBeGreater: any = this.translate.get('chartOption.endDateShouldBeGreater');
    const startDateNotLess: any = this.translate.get('chartOption.startDateNotLess');
    const currentDate = new Date();
    const previousYearDate = new Date().setDate(currentDate.getDate() - 30);
    if ((sDate == null || eDate == null)) {
      this.errorMessageOnEditChartPopUp = startEndDatesRequired.value;
      return false;
    } else if ((sDate != null && eDate != null) && this.datePipe.transform(new Date(eDate), 'yyyy-MM-dd') > this.datePipe.transform(new Date(), 'yyyy-MM-dd')) {
      this.errorMessageOnEditChartPopUp = endDateNotGreater.value;
      return false;
    } else if ((sDate != null && eDate != null) && this.datePipe.transform(new Date(eDate), 'yyyy-MM-dd') <= this.datePipe.transform(new Date(sDate), 'yyyy-MM-dd')) {
      this.errorMessageOnEditChartPopUp = endDateShouldBeGreater.value;
      return false;
    } else if (sDate != null && this.datePipe.transform(new Date(sDate), 'yyyy-MM-dd') < this.datePipe.transform(new Date(previousYearDate), 'yyyy-MM-dd')) {
      this.errorMessageOnEditChartPopUp = startDateNotLess.value;
      return false;
    }
    return true;
  }

  close() {
    this.dialogRef.close();
  }

}
