using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class PanelStatusInfo
    {
        public int JobId { get; set; }
        public int PanelId { get; set; }
        public DateTime? UtctimeStamp { get; set; }
        public string InputStatus { get; set; }
        public string OutputStatus { get; set; }
        public string DoorStatus { get; set; }
        public string LockStatus { get; set; }
        public int? PowerTroubleStatus { get; set; }
        public int? CommonTroubleStatus { get; set; }
        public int? CommonAlarmStatus { get; set; }
        public string DoorHandleStatus { get; set; }
        public string KeyCylinderStatus { get; set; }
        public string TemperStatus { get; set; }
        public string BatteryStatus { get; set; }
        public string LinkStatus { get; set; }
        public string ForcedEntryStatus { get; set; }
        public string DhotroubleStatus { get; set; }
        public string DhoalarmStatus { get; set; }
        public string HubStatus { get; set; }

        public virtual Panels Panels { get; set; }
    }
}
