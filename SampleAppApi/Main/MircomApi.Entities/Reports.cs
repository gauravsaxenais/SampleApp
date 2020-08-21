using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class Reports
    {
        public int ReportId { get; set; }
        public Guid? ReportGuid { get; set; }
        public int? UserId { get; set; }
        public byte Type { get; set; }
        public bool IsWidget { get; set; }
        public string Title { get; set; }
        public Guid? JobGuid { get; set; }
        public int EventType { get; set; }
        public Guid? PanelGuid { get; set; }
        public int? PanelItemId { get; set; }
        public byte TimeRadio { get; set; }
        public DateTime? CustomTimeBegin { get; set; }
        public DateTime? CustomTimeEnd { get; set; }
        public int Interval { get; set; }
        public byte ChartType { get; set; }
        public string SortCol1 { get; set; }
        public string SortCol2 { get; set; }
        public bool SortNormal1 { get; set; }
        public bool SortNormal2 { get; set; }
        public string FilterCol1 { get; set; }
        public string FilterCol1Value { get; set; }
        public string FilterCol2 { get; set; }
        public string FilterCol2Value { get; set; }
        public string FilterCol3 { get; set; }
        public string FilterCol3Value { get; set; }
        public string FilterCol4 { get; set; }
        public string FilterCol4Value { get; set; }
        public byte Columns { get; set; }

        public virtual Users User { get; set; }
    }
}
