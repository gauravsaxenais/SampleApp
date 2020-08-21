using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class EventLogs
    {
        public int JobId { get; set; }
        public int PanelId { get; set; }
        public long EventId { get; set; }
        public byte LogType { get; set; }
        public byte EventType { get; set; }
        public DateTime TimeStamp { get; set; }
        public string Description { get; set; }
        public int Data1 { get; set; }
        public int Data2 { get; set; }
        public int Data3 { get; set; }
        public int Data4 { get; set; }
        public byte PanelItemType { get; set; }
        public byte PanelItemId { get; set; }
        public byte Severity { get; set; }
        public Guid? ChannelGuid { get; set; }
        public Guid? MapGuid { get; set; }

        public virtual Panels Panels { get; set; }
    }
}
