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

  /**
   * Inject the services in the constructor
   */
  constructor(
    private local: LocalStorageService,
    private readonly signalR: SignalrService,
    private httpService: HttpService,
    private utilsService: UtilsService,
    private router: Router
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
    const self = this;
    this.table = $('#datatables').DataTable({
      aaData: self.eventsData,
      ordering: false,
      aoColumns: [
        {
          sTitle: 'Time', mData: 'utcTimeStamp', bSearchable: false,
          mRender: function(o) {
            const date = new Date(o);
            const month: string = JSON.stringify(date.getMonth() + 1);
            return (month.length > 1 ? month : '0' + month) + '/' + date.getDate() + '/' + date.getFullYear().toString().substr(-2)
              + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
          }
        },
        { sTitle: 'Event Description', mData: 'description', bSearchable: true },
        { sTitle: 'Panel', mData: 'panelName', bSearchable: false },
        { sTitle: 'Site', mData: 'siteName', bSearchable: true, className: 'disableRowMedia' },
        {
          sTitle: 'Action',
          bSearchable: false,
          bSortable: false,
          mRender: function(o, str, data) {
            if ((data.channelGuid !== '00000000-0000-0000-0000-000000000000' || data.mapGuid !== '00000000-0000-0000-0000-000000000000')  && data.severity === EventSeverity.alarm) {
              return '<a id="' + data.channelGuid + '" class="btnCamera alarmCls btn btn-link btn-info btn-just-icon like"><i class="material-icons">videocam</i></a> <a id="' + data.mapGuid + '" class="btnMap alarmCls btn btn-link btn-info btn-just-icon like"><i class="material-icons">location_on</i></a>';
            } else if ((data.channelGuid !== '00000000-0000-0000-0000-000000000000' || data.mapGuid !== '00000000-0000-0000-0000-000000000000') && data.severity === EventSeverity.warning) {
              return '<a id="' + data.channelGuid + '" class="btnCamera warningCls btn btn-link btn-info btn-just-icon like"><i class="material-icons">videocam</i></a> <a id="' + data.mapGuid + '" class="btnMap warningCls btn btn-link btn-info btn-just-icon like"><i class="material-icons">location_on</i></a>';
            } else if (data.channelGuid !== '00000000-0000-0000-0000-000000000000' || data.mapGuid !== '00000000-0000-0000-0000-000000000000') {
              return '<a id="' + data.channelGuid + '" class="btnCamera btn btn-link btn-info btn-just-icon like"><i class="material-icons">videocam</i></a> <a id="' + data.mapGuid + '" class="btnMap btn btn-link btn-info btn-just-icon like"><i class="material-icons">location_on</i></a>';
            } else {
              return '';
            }
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
          if (this.header().innerHTML === 'Site') {
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
          } else if (this.header().innerHTML === 'Event Description') {
            $('#txtDescSearch').on('keyup', function() {
              const val = $.fn.dataTable.util.escapeRegex(
                $(this).val());
              column.search(val)
                .draw();
            });
          }
        });
      }
    });

    $('.btnCamera').on('click', function(event) {
      const getChannelGuid = this.getAttribute('id');
      if (getChannelGuid) {
        self.popUpCamera(getChannelGuid);
      }
    });
    $('.btnMap').on('click', function(event) {
      const getMapGuid = this.getAttribute('id');
      if (getMapGuid) {
        self.popUpMap(getMapGuid);
      }
    });
    $('.card .material-datatables label').addClass('form-group');
  }

  private popUpCamera(channelGuid) {
    if (channelGuid && channelGuid !== '00000000-0000-0000-0000-000000000000') {
      this.router.navigate([]).then(result => {
        window.open('#/cameraSinglePopup/' + channelGuid, '_blank',
          'fullscreen=yes;toolbar=no;resizable=yes,width=1500,height=900');
      });
    }
  }

  private popUpMap(mapGuid) {
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
        if (responseMessage.hasOwnProperty('EventType') && this.table && this.eventsData) {
          const eventData = {
            utcTimeStamp: responseMessage.UTCTimeStamp,
            siteName: responseMessage.SiteName,
            description: responseMessage.Description,
            panelName: responseMessage.PanelName,
            severity: responseMessage.Severity
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
