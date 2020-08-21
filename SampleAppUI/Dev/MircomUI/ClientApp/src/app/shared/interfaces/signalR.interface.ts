export interface AlarmResponse {
  UTCTimeStamp: Date;
  EventType: number;
  Description: string;
  PanelName: string;
  SiteName: string;
  ChannelGUID: string;
  MapGUID: string;
  Severity: number;
  LogType: number;
  Data1: number;
  Data2: number;
  Data3: number;
  Data4: number;
  PanelItemType: number;
  PanelItemID: number;
}
