/**
 * Event severity status
 */
export enum EventSeverity {
  normal = 0,
  warning = 1,
  alarm = 2
}

/**
 * Map item status
 */
export enum MapItemStatus {
  offline = 0,
  normal = 1,
  trouble = 2,
  alarm = 3,
  unknown = 4
}

/**
 * Access point web command to post the data
 */
export enum AccessPointWebCmd {
  // 'No Command' = 0,
  'Grant Access' = 1,
  'UnLock Mode ON' = 2,
  'UnLock Mode OFF' = 3,
  'High Sec Mode ON' = 4,
  'High Sec Mode OFF' = 5,
  'Camera' = 6,
  'Map' = 7
}

/**
 * Event type list
 */
export enum EventType {
  AllEvents = 'All Events',
  AlarmsOnly = 'Alarms Only',
  WarningsOnly = 'Warnings Only',
  AlarmsAndWarnings = 'Alarms and Warnings'
}

/**
 * Object type of object status table
 */
export enum ObjectType {
  AccessPoint = 0,
  Map = 1,
  MapItem = 2,
  Panel = 3,
  Building = 4,  // Internal use only, not for ObjectStatus table
  SiteMap = 5,  // Internal use only, not for ObjectStatus table
}

export enum ChangeType {
  Added = 0,
  Modified = 1,
  Removed = 2
}



/**
 * CRUD Action type
 */
export enum ActionType {
  None = 0,
  Create = 1,
  Update = 2,
  Delete = 3
}

/**
 * Actions on floor
 */
export enum FloorLabelActions {
  Edit = 0,
  Copy = 1,
  Paste = 2,
  Delete = 3,
  'Insert Above' = 4,
  'Insert Below' = 5,
  Cut = 6
}


/**
 * Type of Map
 */
export enum MapTypes {
  SiteMap,
  Building
}

/**
 * Map item type used to get items on edit site map (site and floor) to display the components by map item type
 */
export enum MapItemType {
  AccessPoint,
  Input,
  Output,
  Camera,
  Building,
  Map
}

/** Type of widgets */
export enum WidgetType {
  AccessPoint,
  Camera,
  Chart,
  Map,
  System
}

export enum CameraLayoutID {
  Cam1 = 1,
  Cam4 = 4,
  Cam5 = 5,
  Cam6 = 6,
  Cam8 = 8,
  Cam9 = 9,
  Cam12 = 12,
  Cam15 = 15,
  Cam16 = 16,
}

export enum VideoServerType {
  MarchNetworksRecorder = 0,
  MarchNetworksCES = 1,
  ExecQ = 2,
}

// All the properties used for front end only

/**
 * Edit Request from for map item (map, floor or edit building)
 */
export enum EditRequestedFrom {
  Map,
  Floor,
  EditBuilding
}
/**
 * Edit Building Request from for add,edit,delete building
 */
export enum EditBuildingRequestedFrom {
  SiteMap,
  Building,
  ShowCase
}
/**
 * Chart Export Options
 */
export enum ChartExportOptions {
  XLS,
  CSV
}
/**
 * Site Export From
 */
export enum SiteExportFrom {
  Template,
  Copy
}
/**
 * ProductType
 */
export enum ProductType {
  INVALID = 0,
  LOBBY_UNIT = 1,
  CARD_ACCESS = 2,
  ELEVATOR = 3,
  ASSA_ABLOY = 4,
  BACNET = 5,
  NANO = 8,
  ALL = 255,
}
/**
 * CustomEventType
 */
export enum CustomEventType {
  WholePanel,
  Input,
  None,
}
/**
 * PanelItemType
 */
export enum PanelItemType {
  AccessPoint,
  Input,
  Output,
}
/**
 * Languages
 */
export enum Languages {
  English = 'en',
  French = 'fr-ca'
}

/** Refresh screen on language change */
export enum RefreshScreenListOnLanguage {
  System
}

export enum CameraCommand {
  'View Camera'
}
