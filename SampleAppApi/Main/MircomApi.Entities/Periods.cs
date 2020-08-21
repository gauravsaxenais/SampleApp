using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class Periods
    {
        public int JobId { get; set; }
        public int PanelId { get; set; }
        public int ScheduleId { get; set; }
        public int PeriodId { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public bool Sun { get; set; }
        public bool Mon { get; set; }
        public bool Tue { get; set; }
        public bool Wed { get; set; }
        public bool Thur { get; set; }
        public bool Fri { get; set; }
        public bool Sat { get; set; }
        public bool Hol { get; set; }
        public byte[] RowVersion { get; set; }

        public virtual Schedules Schedules { get; set; }
    }
}
