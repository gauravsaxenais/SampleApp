using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class Holidays
    {
        public int JobId { get; set; }
        public int PanelId { get; set; }
        public int HolidayId { get; set; }
        public string Name { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool Annually { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public byte[] RowVersion { get; set; }

        public virtual Jobs Job { get; set; }
    }
}
