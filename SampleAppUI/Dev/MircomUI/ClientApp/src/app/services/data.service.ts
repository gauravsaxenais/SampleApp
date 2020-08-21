import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {

  /**
   * Behavour subject variable for hide/Show left panel of edit dashboard
   */
  private boolMessageSource = new BehaviorSubject<boolean>(false);

  /**
   * Behavour subject variable for data change in chart options on edit dashboard
   */
  private chartDataSource = new BehaviorSubject<boolean>(false);
  /**
   * Behavour subject variable for data change in access point on edit dashboard
   */
  private accessPointDataSource = new BehaviorSubject<boolean>(false);
  /**
   * Behavour subject variable for data change in site map data on edit dashboard
   */
  private siteMapDataSource = new BehaviorSubject<boolean>(false);
  /**
   * Behavour subject variable for data change in system on edit dashboard
   */
  private systemDataSource = new BehaviorSubject<boolean>(false);
  /**
   * Behavour subject variable for hide/show left panel of edit camera
   */
  private boolCameraLeftPanelSource = new BehaviorSubject<boolean>(false);
  /**
   * Behavour subject variable for disable/enable zoom on site map
   */
  private boolZoomOnsiteMapSource = new BehaviorSubject<boolean>(false);
  /**
   * Behavour subject variable for disable/enable zoom on floor map
   */
  private boolZoomOnFloorMapSource = new BehaviorSubject<boolean>(false);
  /**
   * Get the current status for hide(true)/Show(false) status of dashboard left panel
   */
  currentboolMessage = this.boolMessageSource.asObservable();
  /**
   * Get the current status for data changed on chart options
   */
  chartDataBoolMessage = this.chartDataSource.asObservable();
  /**
   * Get the current status for data changed on access point
   */
  accessPointDataBoolMessage = this.accessPointDataSource.asObservable();
  /**
   * Get the current status for data changed on site map
   */
  siteMapDataBoolMessage = this.siteMapDataSource.asObservable();
  /**
   * Get the current status for data changed on system
   */
  systemDataBoolMessage = this.systemDataSource.asObservable();
  /**
   * Get the current status for hide(true)/Show(false) status of camera left panel
   */
  cameraLeftPanelBoolMessage = this.boolCameraLeftPanelSource.asObservable();
  /**
   * Get the current status for disable/enable zoom on site map
   */
  zoomOnSiteMapboolMessage = this.boolZoomOnsiteMapSource.asObservable();
  /**
   * Get the current status for disable/enable zoom on floor map
   */
  zoomOnFloorMapboolMessage = this.boolZoomOnFloorMapSource.asObservable();

  constructor() { }

  /**
   * changeMessage - Set true to hide left panel of dashboard on edit
   * @param message
   */
  changeMessage(message: boolean) {
    this.boolMessageSource.next(message);
  }

  /**
   * changeChartData - check if data change in chart options
   * then it will refresh the chart view
   * @param chartData
   */
  changeChartData(chartData: boolean) {
    this.chartDataSource.next(chartData);
  }

  /**
   * refreshAccessPoint - Set true to refresh the access point data in dashboard
   * @param accessPointRefresh
   */
  refreshAccessPoint(accessPointRefresh: boolean) {
    this.accessPointDataSource.next(accessPointRefresh);
  }

  /**
   * refreshAccessPoint - Set true to refresh the site map data in dashboard
   * @param accessPointRefresh
   */
  refreshSiteMap(siteMapRefresh: boolean) {
    this.siteMapDataSource.next(siteMapRefresh);
  }

  /**
   * refreshAccessPoint - Set true to refresh the system data in dashboard
   * @param accessPointRefresh
   */
  refreshSystem(systemRefresh: boolean) {
    this.systemDataSource.next(systemRefresh);
  }

  /**
   * changeCameraLeftPanel - Set true to hide left panel of camera on edit
   * @param message
   */
  changeCameraLeftPanel(message: boolean) {
    this.boolCameraLeftPanelSource.next(message);
  }

  /**
   * changeMessage - Set true to hide left panel of dashboard on edit
   * @param message
   */
  disableZoomOnSiteMap(isZoom: boolean) {
    this.boolZoomOnsiteMapSource.next(isZoom);
  }

  /**
   * disableZoomOnFloorMap - Set true to zoom on dashboard
   * @param isZoom
   */
  disableZoomOnFloorMap(isZoom: boolean) {
    this.boolZoomOnFloorMapSource.next(isZoom);
  }
}
