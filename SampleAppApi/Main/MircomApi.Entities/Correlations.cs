using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class Correlations
    {
        public int JobId { get; set; }
        public int PanelId { get; set; }
        public int CorrId { get; set; }
        public byte EventType { get; set; }
        public int EventData { get; set; }
        public int EventData2 { get; set; }
        public int EventData3 { get; set; }
        public byte ActionType { get; set; }
        public int ActionPanelId { get; set; }
        public int ActionData { get; set; }
        public int ActionData2 { get; set; }
        public short Duration { get; set; }
        public int ScheduleId { get; set; }
        public bool Enabled { get; set; }
        public byte[] RowVersion { get; set; }
        public byte? Custom485Addr { get; set; }
        public int? CustomPanelId { get; set; }
        public string CustomIpaddr { get; set; }

        public virtual Panels Panels { get; set; }
    }
}
