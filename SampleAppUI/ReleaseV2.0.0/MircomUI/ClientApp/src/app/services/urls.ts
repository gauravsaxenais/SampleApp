/**
 * Constant for core api's service path
 */
export const urls = {
  /** Used for authenticate user */
  login: 'Auth/login',
  /** Used for floor map or site map */
  buildingFloor: 'maps/building',
  /** Used for building map */
  siteFloorMap: 'maps',
  /** Used for status detail for map */
  statusMap: 'status/maps',
  /** Used for status detail for map item */
  statusBuilding: 'status/mapitems',
  /** Used for events */
  events: 'events',
  /** Used for chart */
  charts: 'chart',
  /** Used for access points */
  accessPoint: 'accesspoints',
  /** Used for status detail for access point */
  statusAccessPoint: 'status/accesspoint',
  /** Used for building detail */
  buildingsDetails: 'maps/buildings',
  /** Used for showcase file detail */
  siteshowcase: 'maps/siteshowcase',
  /**
   * Used to save or update building detail
   */
  saveOrUpdateBuildings: 'maps/building',
  /** Library of maps */
  mapComponent: 'maps/components',
  /** Used to get all sites */
  sites: 'sites',
  /** Used to update delete or add site info */
  sitesDetails: 'sites/site',
  /** Used to get chart options */
  chartOptions: 'chart/option',
  /** Used to update chart options */
  updateChartOptions: 'chart/option',
  /** Used to get all systems */
  systemConfiguration: 'system/configuration',
  /** Used to get all templates list for edit site screen */
  templates: 'sites/templates',
  /** Edit dashboard */
  dashboardwidgets: 'dashboard/widgets',
  /** Get Panel Info */
  panelInfo: 'system/panelDetails',
  /** To Import Site File */
  importSite: 'sites/import',
  /** Panels on chart options */
  chartPanelOption: 'chart/chartpaneloption',
  /** To get camera library */
  getCameraLibrary: 'cameras',
  /** To get camera data */
  getCameraData: 'cameras/views',
  /** To update camera data */
  updateCameraData: 'camera/views',
  /** To get single camera details */
  getSingleCameraData: 'cameras/cameraDetails',
};
