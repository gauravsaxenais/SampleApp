/**
 * Import dependencies
 */
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { EventRequest } from 'src/app/shared/interfaces/eventInterfaces';
import { urls } from 'src/app/services/urls';
import { HttpService } from 'src/app/services/http.service';
import { LocalStorageService } from 'src/app/services/localStorage.service';
import { SignalrService } from 'src/app/services/signalR.service';
import { Subscription } from 'rxjs';
import { EventSeverity, EventType } from 'src/app/shared/enums';
import { UtilsService } from 'src/app/services/utility.services';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
declare var $: any;

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})

/**
 * Event component
 */
export class EventComponent implements OnInit, OnDestroy {

  /**
   * Variables declaration
   */
  eventTypeModel: any;
  eventTypeValues: any;
  eventsData: any = [];
  eventsDataFromApi: any;
  eventsFilteredList = [];
  eventTypes: any;
  response: any;
  selectedEventTypeFilter: any;
  subscription: Subscription;
  table: any;
  isLoading = true;

  /**
   * Inject the services in the constructor
   */
  constructor(
    private local: LocalStorageService,
    private readonly signalR: SignalrService,
    private httpService: HttpService,
    private utilsService: UtilsService,
    private router: Router,
    private translate: TranslateService
  ) { }

  /**
   * OnInit - Get signalR, Event
   */
  ngOnInit() {
    this.signalR.initializeSignalRConnect();
    this.signalR.setBroadcastEvent();
    this.bindEventsData().then(res => {
      const self = this;
      setTimeout(function() {
        self.initTable();
      }, 10);
      this.subscription = this.signalR.observableEvent
        .subscribe(item => {
          this.mapSignalREventData(item);
        });
    });
  }

  /**
   * Destroy the signalR connection
   */
  ngOnDestroy(): void {
    this.signalR.disconnect();
  }

  /**
   *  Filter event data on event type
   * @param eventType
   */
  onEventTypeChange(eventType) {
    this.selectedEventTypeFilter = eventType;
    this.local.sendSelectedEvent(eventType);
    this.eventsFilteredList = [];
    this.getFilteredEvents(this.selectedEventTypeFilter).then(res => {
      this.eventsData = this.eventsFilteredList;
      const self = this;
      setTimeout(function() {
        if (self.table) {
          self.table.clear();
          self.table.rows.add(self.eventsData);
          self.table.draw();
        }
      }, 10);
    });

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

    const promise = new Promise((resolve, reject) => {
      const url = urls.events;
      this.httpService.postRequest(url, reqModel)
        .subscribe((response: any) => {
          // response ok
          if (response.success) {
            this.eventsDataFromApi = response.data;
            this.eventsData = response.data;
            this.bindEventTypes();
            resolve();
          }
        },
          (error) => {
            // error
            console.log(error);
          });
    });
    return promise;
  }

  /**
   * Get events type for filter
   */
  private bindEventTypes() {
    this.eventTypeValues = EventType;
    this.eventTypes = this.objectValues(EventType);
    const eventSelected = this.local.getSelectedEvent();
    if (eventSelected != null) {
      this.eventTypeModel = eventSelected;
      this.onEventTypeChange(this.eventTypeModel);
    } else {
      this.eventTypeModel = EventType.AllEvents;
    }
    this.isLoading = false;
  }

  /**
   * @param obj
   * Format the object to bind in event type
   */
  private objectValues(obj) {
    const res = [];
    for (const i in obj) {
      if (obj.hasOwnProperty(i)) {
        res.push(obj[i]);
      }
    }
    return res;
  }

  /**
   * @param eventType
   * Filter event data
   */
  private getFilteredEvents(eventType) {
    const promise = new Promise((resolve, reject) => {
      if (eventType === EventType.AlarmsOnly) {
        this.eventsDataFromApi.filter((data) => {
          if (data.severity === EventSeverity.alarm) {
            this.eventsFilteredList.push(data);
          }
        });
      } else if (eventType === EventType.WarningsOnly) {
        this.eventsDataFromApi.filter((data) => {
          if (data.severity === EventSeverity.warning) {
            this.eventsFilteredList.push(data);
          }
        });
      } else if (eventType === EventType.AlarmsAndWarnings) {
        this.eventsDataFromApi.filter((data) => {
          if (data.severity === EventSeverity.alarm || data.severity === EventSeverity.warning) {
            this.eventsFilteredList.push(data);
          }
        });
      } else {
        this.eventsDataFromApi.filter((data) => {
          this.eventsFilteredList.push(data);
        });
      }
      resolve();
    });
    return promise;
  }

  /**
   * Initilize the event data
   */
  private initTable() {
    const timeTitle: any = this.translate.get('event.time');
    const descriptionTitle: any = this.translate.get('event.eventDescription');
    const panelTitle: any = this.translate.get('event.panel');
    const siteTitle: any = this.translate.get('event.site');
    const actionTitle: any = this.translate.get('event.action');
    const showText: any = this.translate.get('event.showing');
    const toText: any = this.translate.get('event.to');
    const ofText: any = this.translate.get('event.of');
    const entriesText: any = this.translate.get('event.entries');
    const firstText: any = this.translate.get('event.first');
    const nextText: any = this.translate.get('event.next');
    const previousText: any = this.translate.get('event.previous');
    const lastText: any = this.translate.get('event.last');
    const showPageLengthText: any = this.translate.get('event.show');
    const noMatchingRecordText: any = this.translate.get('event.nomatchingrecordsfound');
    const filteredText: any = this.translate.get('event.filtered');
    const fromText: any = this.translate.get('event.from');
    const totalText: any = this.translate.get('event.total');

    const self = this;
    this.table = $('#datatables').DataTable({
      aaData: self.eventsData,
      ordering: false,
      language: {
        lengthMenu: showPageLengthText.value + ' _MENU_ ' + entriesText.value,
        zeroRecords: noMatchingRecordText.value,
        infoEmpty: showText.value + ' 0 ' + toText.value + ' _END_ ' + ofText.value + ' _TOTAL_ ' + entriesText.value,
        infoFiltered: '(' + filteredText.value + ' ' + fromText.value + ' _MAX_ ' + totalText.value + ' ' + entriesText.value + ')',
        info: showText.value + ' _START_ ' + toText.value + ' _END_ ' + ofText.value + ' _TOTAL_ ' + entriesText.value,
        paginate: {
          previous: previousText.value,
          first: firstText.value,
          next: nextText.value,
          last: lastText.value
        }
      },
      aoColumns: [
        {
          sTitle: timeTitle.value, mData: 'utcTimeStamp', bSearchable: false,
          mRender: function(o) {
            const date = new Date(o);
            const month: string = JSON.stringify(date.getMonth() + 1);
            const day = date.getDate();
            return (month.length > 1 ? month : '0' + month) + '/' + (day > 10 ? day : '0' + day) + '/' + date.getFullYear().toString().substr(-2)
              + ' ' + self.formatAMPM(date);
          }
        },
        { sTitle: descriptionTitle.value, mData: 'description', bSearchable: true },
        { sTitle: panelTitle.value, mData: 'panelName', bSearchable: false, className: 'disableRowMedia'},
        { sTitle: siteTitle.value, mData: 'siteName', bSearchable: true, className: 'disableRowMedia' },
        {
          sTitle: actionTitle.value,
          bSearchable: false,
          bSortable: false,
          mRender: function(o, str, data) {
            let responseData = '';
            if (data.severity === EventSeverity.alarm) {
              if (data.mapGuid && data.mapGuid !== '00000000-0000-0000-0000-000000000000') {
                responseData += '<a id="' + data.mapGuid + '" mapId="' + data.mapId + '" class="btnMap alarmCls btn btn-link btn-info btn-just-icon like"><i class="material-icons">location_on</i></a>';
              }
              if (data.channelGuid && data.channelGuid !== '00000000-0000-0000-0000-000000000000') {
                responseData += '<a id="' + data.channelGuid + '" timeStamp="' + data.utcTimeStamp + '" class="btnCamera alarmCls btn btn-link btn-info btn-just-icon like"><i class="material-icons">videocam</i></a>';
              }
            } else if (data.severity === EventSeverity.warning) {
              if (data.mapGuid && data.mapGuid !== '00000000-0000-0000-0000-000000000000') {
                responseData += '<a id="' + data.mapGuid + '" class="btnMap warningCls btn btn-link btn-info btn-just-icon like"><i class="material-icons">location_on</i></a>';
              }
              if (data.channelGuid && data.channelGuid !== '00000000-0000-0000-0000-000000000000') {
                responseData += '<a id="' + data.channelGuid + '" timeStamp="' + data.utcTimeStamp + '" class="btnCamera warningCls btn btn-link btn-info btn-just-icon like"><i class="material-icons">videocam</i></a>';
              }
            } else {
              if (data.mapGuid && data.mapGuid !== '00000000-0000-0000-0000-000000000000') {
                responseData += '<a id="' + data.mapGuid + '" mapId="' + data.mapId + '" class="btnMap normalCls btn btn-link btn-info btn-just-icon like"><i class="material-icons">location_on</i></a>';
              }
              if (data.channelGuid && data.channelGuid !== '00000000-0000-0000-0000-000000000000') {
                responseData += '<a id="' + data.channelGuid + '" timeStamp="' + data.utcTimeStamp + '" class="btnCamera normalCls btn btn-link btn-info btn-just-icon like"><i class="material-icons">videocam</i></a>';
              }
            }
            return responseData;
          }
        },
        { sTitle: 'Severity', mData: 'severity', bSearchable: true, visible: false },
      ],

      createdRow: function(row, data, dataIndex) {
        if (Number(data.severity) === EventSeverity.alarm) {
          $(row).addClass('alarmCls');
        } else if (Number(data.severity) === EventSeverity.warning) {
          $(row).addClass('warningCls');
        }
      },
      pagingType: 'full_numbers',
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, 'All']
      ],
      responsive: true,
      initComplete: function() {
        this.api().columns().every(function() {
          const column = this;
          if (this.header().innerHTML === siteTitle.value) {
            const select = $('#drpSiteSearch')
              .appendTo($('#siteChangeDiv'))
              .on('change', function() {
                const val = $.fn.dataTable.util.escapeRegex(
                  $(this).val());
                column.search(val ? '^' + val + '$' : '', true, false)
                  .draw();
              });
            column.data().unique().sort().each(function(d, j) {
              select.append('<option value="' + d + '">' + d + '</option>');
            });
          } else if (this.header().innerHTML === descriptionTitle.value) {
            $('#txtDescSearch').on('keyup', function() {
              const val = $.fn.dataTable.util.escapeRegex(
                $(this).val());
              column.search(val, true, false)
                .draw();
            });
          }
        });
      }
    });

    $('#datatables').on('click', '.btnCamera', function() {
      const getChannelGuid = this.getAttribute('id');
      const timeStamp = this.getAttribute('timeStamp');
      if (getChannelGuid) {
        self.popUpCamera(getChannelGuid, timeStamp);
      }
    });

    $('#datatables').on('click', '.btnMap', function() {
      const getMapGuid = this.getAttribute('id');
      const mapId = this.getAttribute('mapId');
      if (getMapGuid) {
        self.popUpMap(getMapGuid, mapId);
      }
    });
    $('.card .material-datatables label').addClass('form-group');
  }

  /**
   * formatAMPM - format event time in 12 hours format
   * @param date
   */
  private formatAMPM(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    hours = hours < 10 ? '0' + hours : hours;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    const strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
    return strTime;
  }

  /**
   * popUpCamera - it will open the camera in popup window
   * @param channelGuid
   * @param timeStamp
   */
  private popUpCamera(channelGuid, timeStamp) {
    const camPopupWinWidth = 800;
    const camPopupWinHeight = 600;
    const left = (window.screen.width - camPopupWinWidth) / 2;
    const top = (window.screen.height - camPopupWinHeight) / 4;

    if (channelGuid && channelGuid !== '00000000-0000-0000-0000-000000000000') {
      this.router.navigate([]).then(result => {
        window.open('#/cameraSinglePopup/' + channelGuid + '/' + timeStamp, '_blank',
          'fullscreen=yes;toolbar=no;resizable=yes,width=' + camPopupWinWidth + ',height=' + camPopupWinHeight + ',top=' + top + ',left' + left + ',screenX=' + left + ',screenY=' + top);
      });
    }
  }

  /**
   * popUpMap - it will open the map in popup window
   * @param mapGuid
   * @param mapId
   */
  private popUpMap(mapGuid, mapId) {
    if (mapGuid && mapGuid !== '00000000-0000-0000-0000-000000000000') {
      this.router.navigate([]).then(result => {
        window.open('#/siteMapView/' + mapGuid, '_blank',
          'fullscreen=yes;toolbar=no;resizable=yes,width=1500,height=900');
      });
    }
  }
  /**
   * Push the signalR data to event
   * @param serverMessage
   */
  private mapSignalREventData(serverMessage: string) {
    if (serverMessage != null) {
      const isJsonValidate = this.utilsService.IsJsonString(serverMessage);
      if (isJsonValidate) {
        const responseMessage = JSON.parse(serverMessage);
        console.log('events');
        console.log(responseMessage);
        if (responseMessage.hasOwnProperty('EventType') && this.table && this.eventsData) {
          const eventData = {
            utcTimeStamp: responseMessage.UTCTimeStamp,
            siteName: responseMessage.SiteName,
            description: responseMessage.Description,
            panelName: responseMessage.PanelName,
            severity: responseMessage.Severity,
            channelGuid: responseMessage.ChannelGUID,
            mapGuid: responseMessage.MapGUID
          };
          let eventsFiltered: any = [];
          if (this.selectedEventTypeFilter === EventType.AlarmsOnly && responseMessage.Severity === EventSeverity.alarm) {
            eventsFiltered = this.filteredDataAddOnSignalR(eventsFiltered, eventData);
          } else if (this.selectedEventTypeFilter === EventType.WarningsOnly && responseMessage.Severity === EventSeverity.warning) {
            eventsFiltered = this.filteredDataAddOnSignalR(eventsFiltered, eventData);
          } else if (this.selectedEventTypeFilter === EventType.AlarmsAndWarnings) {
            if (responseMessage.Severity === EventSeverity.alarm || responseMessage.Severity === EventSeverity.warning) {
              eventsFiltered = this.filteredDataAddOnSignalR(eventsFiltered, eventData);
            }
          } else if (this.selectedEventTypeFilter === EventType.AllEvents || !this.selectedEventTypeFilter) {
            this.eventsDataFromApi.unshift(eventData);
            this.table.clear();
            this.table.rows.add(this.eventsDataFromApi);
            this.table.draw();
          } else {
            this.eventsDataFromApi.unshift(eventData);
          }
        }
      }
    }
  }

  /**
   * Apply filter in pushed data by signalR
   * @param eventsFiltered
   * @param eventData
   */
  private filteredDataAddOnSignalR(eventsFiltered: any, eventData: { utcTimeStamp: any; siteName: any; description: any; panelName: any; severity: any; }) {
    eventsFiltered = this.eventsFilteredList;
    eventsFiltered.unshift(eventData);
    this.table.clear();
    this.table.rows.add(eventsFiltered);
    this.table.draw();
    this.eventsDataFromApi.unshift(eventData);
    return eventsFiltered;
  }
}
