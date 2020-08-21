/**
 * Import dependencies
 */
import { Component, OnInit, OnDestroy, ViewChild, Input, ChangeDetectorRef } from '@angular/core';
import { urls } from 'src/app/services/urls';
import { EventRequest } from 'src/app/shared/interfaces/eventInterfaces';
import { HttpService } from 'src/app/services/http.service';
import { LocalStorageService } from 'src/app/services/localStorage.service';
import { SignalrService } from 'src/app/services/signalR.service';
import { Subscription, Observable } from 'rxjs';
import { UtilsService } from 'src/app/services/utility.services';
import { NgxWidgetGridComponent, WidgetPositionChange } from 'ngx-widget-grid';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ActionType, WidgetType } from 'src/app/shared/enums';
import { debug } from 'util';
import { DataService } from 'src/app/services/data.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ChartOptionComponent } from '../../shared/chart-option/chart-option.component';
import { GridsterConfig, GridType, CompactType, DisplayGrid, GridsterItem } from 'angular-gridster2';
import { TranslateService } from '@ngx-translate/core';
declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

/**
 * Monitoring dashboard component
 */
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild('grid', { static: false }) grid: any;
  options: GridsterConfig;
  viewOptions: GridsterConfig;
  sideWidgetList = WidgetType;
  public sideWidgets: any[];
  /**
   * Variables declaration
   */
  public widgets: any[] = [];
  widgeturl = urls.dashboardwidgets;
  eventModel: any;
  eventsData: any = [];
  isExpandable: boolean;
  selected: any;
  isDashboard = true;
  subscription: Subscription;
  chartCaption: any;
  allSiteMapsData: any;
  selectedMapId: string;
  siteId = this.local.getSiteId();
  selectedWidget: any = {};
  componentGuid: any;
  cameraData: any = [];
  cameraDproData: any[] = [];
  selectedCameraGuid: string;
  cameraDropedId: any;
  private _editable = false;
  addMenuItem: any;
  public showGrid = false;
  public highlightNextPosition = false;
  public swapWidgets = false;

  /**
   * Inject the services in the constructor
   */
  constructor(
    public dialog: MatDialog,
    private httpService: HttpService,
    private readonly signalR: SignalrService,
    private local: LocalStorageService,
    private utilsService: UtilsService,
    private dataService: DataService,
    private translate: TranslateService,
    private ref: ChangeDetectorRef,
    private router: Router) { }

  /**
   * OnInit - Get signalR, Event and bind building floors
   */
  ngOnInit() {
    this.options = {
      gridType: GridType.Fixed,
      margin: 10,
      rows: 30,
      cols: 10,
      minCols: 10,
      minRows: 30,
      draggable: {
        enabled: true,
      },
      resizable: {
        enabled: true,
      },
      swap: false,
      pushItems: false,
      disablePushOnDrag: false,
      disablePushOnResize: false,
      pushResizeItems: false,
      displayGrid: DisplayGrid.Always,
      itemResizeCallback: this.resize.bind(this),
      fixedColWidth: 100,
      fixedRowHeight: 100
    };


    this.viewOptions = {
      gridType: GridType.Fixed,
      margin: 10,
      rows: 30,
      cols: 10,
      minCols: 10,
      minRows: 30,
      draggable: {
        enabled: false,
      },
      resizable: {
        enabled: false,
      },
      swap: false,
      pushItems: false,
      disablePushOnDrag: false,
      disablePushOnResize: false,
      pushResizeItems: false,
      displayGrid: DisplayGrid.None,
      itemResizeCallback: this.resize.bind(this),
      fixedColWidth: 100,
      fixedRowHeight: 100
    };

    this.local.sendSiteFromDashboard('yes');
    this.signalR.initializeSignalRConnect();
    this.signalR.setBroadcastPanelStatusChange();
    this.signalR.setBroadcastEvent();
    this.bindEventsData();
    this.getdasboardWidgets();
    this.subscription = this.signalR.observableEvent
      .subscribe(item => {
        this.mapSignalREventData(item);
      });
    this.utilsService.getSetLanguage();
  }

  resize(item, itemComponent) {
    if (item.type === WidgetType.Chart) {
      this.dataService.changeChartData(true);
    } else {
      this.dataService.changeChartData(false);
    }
  }

  /**
   * Get the widgets to display on dashboard
   */
  getdasboardWidgets() {
    // tslint:disable-next-line:no-shadowed-variable
    const siteid = localStorage.getItem('siteId');
    this.httpService.getRequest(this.widgeturl + '/' + siteid).subscribe((response: any) => {
      if (response.success && response.data != null) {
        this.widgets = response.data;
        this.sideWidgets = JSON.parse(JSON.stringify(this.widgets));
        let i = 0;
        for (i = 0; i < this.widgets.length; i++) {
          this.widgets[i].randomNumber = this.getRandomInt(1, 100);
          this.widgets[i].cols = this.widgets[i].width;
          this.widgets[i].rows = this.widgets[i].height;
          this.widgets[i].minItemCols = this.utilsService.getDashboardMaxColItem(this.widgets[i].type);
          this.widgets[i].minItemRows = this.utilsService.getDashboardMaxRowItem(this.widgets[i].type);
          this.widgets[i].buildingId = Number(this.widgets[i].buildingId);
          // this.widgets[i].isRefresh = !this.widgets[i].isRefresh;
          // if (this.widgets[i].type === WidgetType.Map) {
          //  if (Number(this.widgets[i].buildingId) === 0) {
          //    console.log('Is Refresh exe');
          //    this.dataService.refreshSiteMap(true);
          //  }
          // }
        }

      }
    }, (error) => {
      // error
     // console.log(error);
    });
  }

  /**
   * Destroy the signalR connection
   */
  ngOnDestroy(): void {
    this.signalR.disconnect();
    this.dataService.changeMessage(false);
    this.dataService.disableZoomOnSiteMap(false);
    this.dataService.disableZoomOnFloorMap(false);
    this.dataService.changeChartData(false);
    this.clearFields();
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  /**
   * Save the widgets
   */
  public set editable(editable: boolean) {
    this.dataService.disableZoomOnSiteMap(false);
    this.dataService.disableZoomOnFloorMap(false);
    this.dataService.changeMessage(false);
    if (editable) {
      this.dataService.changeMessage(true);
      this.dataService.disableZoomOnSiteMap(true);
      this.dataService.disableZoomOnFloorMap(true);
    }

    this._editable = editable;
    this.showGrid = editable;
    if (!editable) { // 1= create, 2= update, 3=Delete
      this.widgets.map(function(widget) {
        widget.height = widget.rows;
        widget.width = widget.cols;
        widget.componentGuid = widget.componentGuid;
        if (widget.action !== ActionType.Create) {
          widget.action = ActionType.Update;
        }
        return widget;
      });
      this.httpService.postRequest(this.widgeturl, this.widgets).subscribe((response: any) => {
        if (response.success) {
          // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          //  this.router.navigate(['./monitoring/dashboard']));
        }
      }, (error) => {
        // error
       // console.log(error);
      });
    }
  }

  /**List of menu to display for widgets
   * @returns list of menu items
   */
  getSideWidgets(): Array<string> {
    const keys = Object.keys(this.sideWidgetList);
    return keys.slice(keys.length / 2);
  }

  // tslint:disable-next-line:adjacent-overload-signatures
  public get editable(): boolean {
    return this._editable;
  }

  /**
   * Drop the Component in widgets
   * @param event
   */
  drop(event) {
    if (WidgetType[event.previousIndex] === WidgetType[WidgetType.Camera]) {
      this.cameraDproData = [];
      const url = urls.getCameraLibrary + '/' + localStorage.getItem('siteId');
      this.httpService.getRequest(url).subscribe(
        (res: any) => {
          if (res.success && res.message.messageCode === 200) {
            this.cameraData = res.data;
            this.cameraData.forEach(obj => {
              obj.cameraDetails.forEach(x => {
                this.cameraDproData.push({
                  key: obj.serverName + ' : ' + x.channelName,
                  value: x.channelGuid
                });
              });
            });
            $('#cameraModal').modal('show');
          }
        });
      this.cameraDropedId = this.getRandomInt(1, 100);
      this.widgets.push(
        {
          x: 0,
          y: 0,

          cols: this.utilsService.getDashboardMaxColItem(event.previousIndex),
          width: this.utilsService.getDashboardMaxColItem(event.previousIndex),

          rows: this.utilsService.getDashboardMaxRowItem(event.previousIndex),
          height: this.utilsService.getDashboardMaxRowItem(event.previousIndex),

          minItemCols: this.utilsService.getDashboardMaxColItem(event.previousIndex),
          minItemRows: this.utilsService.getDashboardMaxRowItem(event.previousIndex),
          componentGuid: '',
          buildingId: 0,
          action: ActionType.Create,
          randomNumber: this.cameraDropedId,
          siteId: localStorage.getItem('siteId'),
          title: WidgetType[event.previousIndex],
          type: event.previousIndex
        });
    } else {
      this.widgets.push(
        {
          x: 0,
          y: 0,

          cols: this.utilsService.getDashboardMaxColItem(event.previousIndex),
          width: this.utilsService.getDashboardMaxColItem(event.previousIndex),

          rows: this.utilsService.getDashboardMaxRowItem(event.previousIndex),
          height: this.utilsService.getDashboardMaxRowItem(event.previousIndex),

          minItemCols: this.utilsService.getDashboardMaxColItem(event.previousIndex),
          minItemRows: this.utilsService.getDashboardMaxRowItem(event.previousIndex),
          componentGuid: WidgetType[event.previousIndex] === WidgetType[WidgetType.Map] ? this.local.getMapGuid() : '',
          buildingId: 0,
          action: ActionType.Create,
          randomNumber: this.getRandomInt(1, 100),
          siteId: localStorage.getItem('siteId'),
          title: WidgetType[event.previousIndex],
          type: event.previousIndex
        });
    }
  }

  addItem(event) {
    if (this.addMenuItem !== undefined) {
      if (this.addMenuItem === WidgetType[WidgetType.Camera]) {
        this.cameraDproData = [];
        const url = urls.getCameraLibrary + '/' + localStorage.getItem('siteId');
        this.httpService.getRequest(url).subscribe(
          (res: any) => {
            if (res.success && res.message.messageCode === 200) {
              this.cameraData = res.data;
              this.cameraData.forEach(obj => {
                obj.cameraDetails.forEach(x => {
                  this.cameraDproData.push({
                    key: obj.serverName + ' : ' + x.channelName,
                    value: x.channelGuid
                  });
                });
              });
              $('#cameraModal').modal('show');
            }
          });
      }
      this.widgets.push(
        {
          x: 0,
          y: 0,
          cols: this.utilsService.getDashboardMaxColItem(WidgetType[this.addMenuItem]),
          width: this.utilsService.getDashboardMaxColItem(WidgetType[this.addMenuItem]),

          rows: this.utilsService.getDashboardMaxRowItem(WidgetType[this.addMenuItem]),
          height: this.utilsService.getDashboardMaxRowItem(WidgetType[this.addMenuItem]),

          minItemCols: this.utilsService.getDashboardMaxColItem(WidgetType[this.addMenuItem]),
          minItemRows: this.utilsService.getDashboardMaxRowItem(WidgetType[this.addMenuItem]),
          componentGuid: this.addMenuItem === WidgetType[WidgetType.Map] ? this.local.getMapGuid() : this.addMenuItem === WidgetType[WidgetType.Camera] ? this.selectedCameraGuid : '',
          buildingId: 0,
          action: ActionType.Create,
          randomNumber: this.getRandomInt(1, 100),
          siteId: localStorage.getItem('siteId'),
          title: this.addMenuItem,
          type: WidgetType[this.addMenuItem]
        });
    }
  }

  data(event, menu) {
    this.addMenuItem = menu;
  }
  select(item) {
    this.selected = item;
  }
  isActive() {
    return this.selected;
  }
  editMode(editable: boolean) {
    this._editable = !editable;
  }

  toggleHighlight(doHighlight: boolean) {
    this.highlightNextPosition = !!doHighlight;
  }

  public onGridFull(e) {
  }

  /**
   * Change the position, height and width of widgets
   * @param event
   */
  onWidgetChange(event: WidgetPositionChange) {
    if (this._editable) {
      this.widgets[event.index].height = event.newPosition.height;
      this.widgets[event.index].width = event.newPosition.width;
      this.widgets[event.index].y = event.newPosition.top;
      this.widgets[event.index].x = event.newPosition.left;
    }
  }

  askEditWidget(index, widget) {
    switch (widget.type) {
      case WidgetType.Chart: {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.height = '60%';
        dialogConfig.width = '30%';
        this.dialog.open(ChartOptionComponent, dialogConfig);
        break;
      }
      case WidgetType.AccessPoint: {
        break;
      }
      case WidgetType.Map: {
        this.selectedWidget = widget;
        const url = urls.getSiteMaps;
        this.httpService.getRequest(url + '/' + this.siteId).subscribe((response: any) => {
          if (response.success && response.data != null) {
            // response ok
            if (response.success) {
              this.allSiteMapsData = response.data;
              const selectedDefaultMap = this.allSiteMapsData.find(z => z.mapGuid === widget.componentGuid);
              if (selectedDefaultMap) {
                this.selectedMapId = selectedDefaultMap.mapGuid;
              } else {
                this.selectedMapId = this.allSiteMapsData[0].mapGuid;
              }
            }
          }
        }, (error) => {
          // error
         // console.log(error);
        });
        break;
      }
      case WidgetType.Camera: {
        this.selectedWidget = widget;
        this.cameraDproData = [];
        const url = urls.getCameraLibrary + '/' + localStorage.getItem('siteId');
        this.httpService.getRequest(url).subscribe(
          (res: any) => {
            if (res.success && res.message.messageCode === 200) {
              this.cameraData = res.data;
              this.cameraData.forEach(obj => {
                obj.cameraDetails.forEach(x => {
                  this.cameraDproData.push({
                    key: obj.serverName + ' : ' + x.channelName,
                    value: x.channelGuid
                  });
                });
              });
              const selectedDefaultCamera = this.cameraDproData.find(z => z.value === widget.componentGuid);
              if (selectedDefaultCamera) {
                this.selectedCameraGuid = selectedDefaultCamera.value;
              } else {
                this.selectedCameraGuid = null;
              }
            }
          }, (error) => {
            // error
           // console.log(error);
          });
        break;
      }
      case WidgetType.System: {
        break;
      }
    }
  }

  onMapChange(mapValue) {
    this.selectedMapId = mapValue;
  }

  onCameraChange(cameraGuid) {
    this.selectedCameraGuid = cameraGuid;
  }

  /**
   * Remove the widgets
   * @param index
   * @param widget
   */
  askDeleteWidget(index, widget) {
    const deleteConfirmVal: any = this.translate.get('dashboard.areYouSureYouWantToDeleteTheItem');
    const nonRevertConfirmVal: any = this.translate.get('dashboard.youWouldNotBeAbleToRevertThis');
    const deleteVal: any = this.translate.get('dashboard.yesDeleteIt');
    const cancel: any = this.translate.get('dashboard.cancel');

    swal({
      title: deleteConfirmVal.value,
      text: nonRevertConfirmVal.value,
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      cancelButtonText: cancel.value,
      confirmButtonText: deleteVal.value,
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {

        const arr: any = [];
        widget.action = ActionType.Delete;
        arr.push(widget);
        // this.widgets.splice(index, 1);
        this.widgets.splice(this.widgets.indexOf(widget), 1);
        this.httpService.postRequest(this.widgeturl, arr).subscribe((response: any) => {
          if (response.success) {
            // response ok
            if (response.success) {

              // console.log(response);
            }
          }
        }, (error) => {
          // error
         // console.log(error);
        });
      }
    });
  }

  /** Refresh widget
   * @param index
   * @param widget
   */
  refreshWidget(index, widget) {
    this.clearFields();
    switch (widget.type) {
      case WidgetType.Chart: {
        this.dataService.changeChartData(true);
        break;
      }
      case WidgetType.AccessPoint: {
        this.dataService.refreshAccessPoint(true);
        break;
      }
      case WidgetType.Map: {
        widget.isRefresh = !widget.isRefresh;
        break;
      }
      case WidgetType.Camera: {
        if (widget.componentGuid !== '') {
          widget.isRefresh = !widget.isRefresh;
        }
        break;
      }
      case WidgetType.System: {
        this.dataService.refreshSystem(true);
        break;
      }
    }
  }

  /** Jump to respective page
   * @param index
   * @param widget
   */
  jumpToComponent(index, widget, mapId) {
    this.clearFields();
    switch (widget.type) {
      case WidgetType.Chart: {
        this.router.navigate(['./monitoring/chart']);
        break;
      }
      case WidgetType.AccessPoint: {
        this.router.navigate(['./monitoring/access-point']);
        break;
      }
      case WidgetType.Map: {
        if (Number(widget.buildingId) > 0) {
          // this.local.sendSiteFromDashboard('no');

          this.router.navigate(['/monitoring/site-map/floor', { siteId: this.siteId, mapGuid: widget.componentGuid, mapId: mapId }]);
        } else if (Number(widget.buildingId) === 0) {
          this.router.navigate(['./monitoring/site-map']);
        }
        break;
      }
      case WidgetType.System: {
        this.router.navigate(['./monitoring/system']);
        break;
      }
      case WidgetType.Camera: {
        this.router.navigate(['./monitoring/camera']);
        break;
      }
    }
  }

  /**
   * close edit map popup
   * @param e
   */
  closeEditMapPopUp(e) {
    $('#mapModal').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }

  /**
   * edit map selection submitted
   * @param e
   */
  onEditMapSelectionSubmitted(e) {
    const selectedMap = this.allSiteMapsData.find(z => z.mapGuid === this.selectedMapId);
    if (selectedMap) {
      this.selectedWidget.componentGuid = selectedMap.mapGuid;
      this.selectedWidget.mapId = selectedMap.mapId;
      this.selectedWidget.buildingId = selectedMap.buildingId;
      $('#mapModal').modal('hide');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
    }
  }

  /**
   * edit camera selection submitted
   * @param e
   */
  onEditCameraSelectionSubmitted(e) {
    const selectedCamera = this.cameraDproData.find(z => z.value === this.selectedCameraGuid);
    if (selectedCamera) {
      const otherCamerasOnWidgets = this.widgets.filter(z => z.type === WidgetType.Camera && z.componentGuid === selectedCamera.value);
      if (otherCamerasOnWidgets.length === 0) {
        this.selectedWidget.previousComponentGuid = this.selectedWidget.componentGuid;
        this.selectedWidget.componentGuid = selectedCamera.value;
        // this.parentSelectedCameraGuid = selectedCamera.value;
        $('#cameraModal').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        this.widgets.forEach(obj => {
          if (obj.type === WidgetType.Camera && obj.randomNumber === this.cameraDropedId) {
            obj.componentGuid = this.selectedCameraGuid;
          }
        });
      } else {
        alert('camera stream already placed');
      }
    }
  }

  /** Clear Fields */
  clearFields() {
    this.dataService.refreshAccessPoint(false);
    this.dataService.changeChartData(false);
    // this.dataService.refreshSystem(false);
    this.dataService.refreshSystem(false);
  }

  /**
   * Get chart caption from child
   * @param chartCaption
   */
  eventChartCaptionBindHandler(chartCaption) {
    this.chartCaption = chartCaption;
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
    // tslint:disable-next-line:no-shadowed-variable
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
   // console.log(error);
    });
  }

  /** Bind SignalR event data
   * push the signalR data to event
   * @param serverMessage
   */
  mapSignalREventData(serverMessage: string) {
    console.log(serverMessage);
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
          this.ref.detectChanges();
          this.ref.markForCheck();
        }
      }
    }
  }

  /**
   *  Maintain the click event to handle the mouse leave event of widgets
   * @param widget
   */
  onActionClick(widget) {
    widget.isClick = true;
  }

  /**
   * Docked event action for full screen (Collapse/Expand)
   * @param isExpand
   */
  eventExpandableChangedHandler(isExpand: boolean) {
    this.isExpandable = isExpand;
  }
}
