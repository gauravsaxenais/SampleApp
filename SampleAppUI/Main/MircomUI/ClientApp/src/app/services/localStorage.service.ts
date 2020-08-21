/**
 * Import dependencies
 */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class LocalStorageService {

  /**
   * Inject the services in the constructor
   */
  constructor(private myRoute: Router) { }

  getBuildingGuid() {
    const storedValue = localStorage.getItem('buildingGuid');
    return storedValue ? storedValue : null;
  }

  /**
   * Get localstorage for map guid
   */
  getMapGuid() {
    const storedValue = localStorage.getItem('mapGuid');
    return storedValue ? storedValue : null;
  }

  /**
   * Get localstorage for floor map id
   */
  getFloorMapId() {
    const storedValue = localStorage.getItem('floorMapId');
    return storedValue ? storedValue : null;
  }

  /**
   * Get localstorage for map id
   */
  getMapId() {
    const storedValue = localStorage.getItem('mapId');
    return storedValue ? storedValue : null;
  }

  /**
   * Get localstorage for site from dashboard status
   */
  getSiteFromDashboard() {
    const storedValue = localStorage.getItem('siteFromDashboard');
    return storedValue ? storedValue : null;
  }

  /**
   * Get localstorage for site guid
   */
  getSiteGuid() {
    const storedValue = localStorage.getItem('siteGuid');
    return storedValue ? storedValue : null;
  }

  /**
   * Get localstorage for report guid
   */
  getReportGuid() {
    const storedValue = localStorage.getItem('reportGuid');
    return storedValue ? storedValue : null;
  }

  /**
   * Get localstorage for site id
   */
  getSiteId() {
    const storedValue = localStorage.getItem('siteId');
    return storedValue ? storedValue : null;
  }

  /**
   * Get localstorage for zoom value
   */
  getZoomValue() {
    const storedValue = localStorage.getItem('zoom');
    return storedValue ? storedValue : null;
  }

  /**
   * Get localstorage for logged in user status
   */
  getToken() {
    const storedValue = localStorage.getItem('LoggedInUser');
    return storedValue ? storedValue : null;
  }

  /**
   * Get localstorage for user name
   */
  getUser() {
    const storedValue = localStorage.getItem('userName');
    return storedValue ? storedValue : null;
  }

  /**
   * Get localstorage for selected event
   */
  getSelectedEvent(): any {
    const storedValue = localStorage.getItem('selectedEvent');
    return storedValue ? storedValue : null;
  }

/**
 * Get localstorage for site map name
 */
  getSiteMapName(): any {
    const storedValue = localStorage.getItem('selectedSiteName');
    return storedValue ? storedValue : null;
  }

  /**
   * Get localstorage for building ids.
   */
  getBuildingIds(): any {
    const storedValue = localStorage.getItem('buildingIds');
    return storedValue ? storedValue : null;
  }

  /**
   * Get localstorage for building ids.
   */
  getCurrentBuildingId(): any {
    const storedValue = localStorage.getItem('buildingId');
    return storedValue ? storedValue : null;
  }

  /**
   * Get localstorage for map guid.
   */
  getFloorMapGuids(): any {
    const storedValue = localStorage.getItem('floorMapGuid');
    return storedValue ? storedValue : null;
  }
  /**
   * Get localstorage for edit building requested from.
   */
  getEditBuildingRequestedFrom(): any {
    const storedValue = localStorage.getItem('editBuildingRequestedFrom');
    return storedValue ? storedValue : null;
  }
  /**
   * Get localstorage for language.
   */
  getLanguage(): any {
    const storedValue = localStorage.getItem('localLanguage');
    return storedValue ? storedValue : null;
  }

  /**
   * Get localstorage for last selected latitude coordinates
   */
  getLastSelectedLatitude() {
    const storedValue = localStorage.getItem('lastSelectedLatitude');
    return storedValue ? storedValue : null;
  }

  /**
   * Get localstorage for last selected longitude coordinates
   */
  getLastSelectedLongitude() {
    const storedValue = localStorage.getItem('lastSelectedLongitude');
    return storedValue ? storedValue : null;
  }

  /**
   * Set localstorage for last selected latitude coordinates
   * @param _latitude
   */
  sendLastSelectedLatitude(_latitude: any): void {
    if (localStorage) {
      localStorage.setItem('lastSelectedLatitude', _latitude);
    }
  }

  /**
   * Set localstorage for last selected longitude coordinates
   * @param _longitude
   */
  sendLastSelectedLongitude(_longitude: any): void {
    if (localStorage) {
      localStorage.setItem('lastSelectedLongitude', _longitude);
    }
  }

  /**
   * Set localstorage for zoom value.
   * @param _zoom
   */
  sendZoom(_zoom: any): void {
    if (localStorage) {
      localStorage.setItem('zoom', _zoom);
    }
  }
  /**
   * Set localstorage for language.
   * @param _language
   */
  sendLanguage(_language: any): void {
    if (localStorage) {
      localStorage.setItem('localLanguage', _language);
    }
  }
  /**
   * Set localstorage for edit building requested from.
   * @param _floorMapGuid
   */
  sendEditBuildingRequestedFrom(_editBuildingRequestedFrom: any): void {
    if (localStorage) {
      localStorage.setItem('editBuildingRequestedFrom', _editBuildingRequestedFrom);
    }
  }
  /**
   * Set localstorage for  map guid.
   * @param _floorMapGuid
   */
  sendFloorMapGuids(_floorMapGuid: any): void {
    if (localStorage) {
      localStorage.setItem('floorMapGuid', JSON.stringify(_floorMapGuid));
    }
  }
  /**
   * Set localstorage for  building ids.
   * @param _buildingIds
   */
  sendBuildingIds(_buildingIds: any): void {
    if (localStorage) {
      localStorage.setItem('buildingIds', JSON.stringify(_buildingIds));
    }
  }

  /**
   * Set localstorage for  building id.
   * @param _buildingId
   */
  sendCurrentBuildingId(_buildingId: any): void {
    if (localStorage) {
      localStorage.setItem('buildingId', JSON.stringify(_buildingId));
    }
  }

  sendSelectedEvent(value: string): void {
    if (localStorage) {
      localStorage.setItem('selectedEvent', value);
    }
  }

  /**
   * Set localstorage for site from building guid
   * @param _buildingGuid
   */
  sendBuildingGuid(_buildingGuid: string): void {
    if (localStorage) {
      localStorage.setItem('buildingGuid', _buildingGuid);
    }
  }

  /**
   * Set localstorage for site from map guid
   * @param _mapGuid
   */
  sendMapGuid(_mapGuid: string): void {
    if (localStorage) {
      localStorage.setItem('mapGuid', _mapGuid);
    }
  }

  /**
   * Set localstorage for site from map id
   * @param _mapId
   */
  sendMapId(_mapId: string): void {
    if (localStorage) {
      localStorage.setItem('mapId', _mapId);
    }
  }

  /**
   * Set localstorage for site from floor map id
   * @param _mapId
   */
  sendFloorMapId(_mapId: string): void {
    if (localStorage) {
      localStorage.setItem('floorMapId', _mapId);
    }
  }

  /**
   * Set localstorage for site from dashboard status
   * @param _siteFromDashboard
   */
  sendSiteFromDashboard(_siteFromDashboard: string): void {
    if (localStorage) {
      return localStorage.setItem('siteFromDashboard', _siteFromDashboard);
    }
  }

  /**
   * Set localstorage for site guid
   */
  sendSiteGuid(siteGUID: string): void {
    if (localStorage) {
      localStorage.setItem('siteGuid', siteGUID);
    }
  }

  /**
   * Set localstorage for report guid
   */
  sendReportGuid(reportGUID: string): void {
    if (localStorage) {
      localStorage.setItem('reportGuid', reportGUID);
    }
  }

  /**
   * Set localstorage for site id
   */
  sendSiteId(siteId: string): void {
    if (localStorage) {
      localStorage.setItem('siteId', siteId);
    }
  }

  /**
   * Set localstorage for login user
   */
  sendToken(_token: string): void {
    if (localStorage) {
      localStorage.setItem('LoggedInUser', _token);
    }
  }

  /**
   * Set localstorage for user name
   */
  sendUser(_userName: string): void {
    if (localStorage) {
      localStorage.setItem('userName', _userName);
    }
  }

/**
 * Set localstorage for site map name
 */
  sendSiteMapName(_siteMapName: string): void {
    if (localStorage) {
      localStorage.setItem('selectedSiteName', _siteMapName);
    }
  }

  /**
   * Remove the localstorage
   */
  removeValues() {
    localStorage.removeItem('LoggedInUser');
    localStorage.removeItem('userName');
    localStorage.removeItem('mapGuid');
    localStorage.removeItem('mapId');
    localStorage.removeItem('buildingGuid');
    localStorage.removeItem('selectedEvent');
    localStorage.removeItem('selectedSiteName');
  }
}
