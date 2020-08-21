using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class Schedules
    {
        public Schedules()
        {
            Periods = new HashSet<Periods>();
        }

        public int JobId { get; set; }
        public int PanelId { get; set; }
        public int ScheduleId { get; set; }
        public string Name { get; set; }
        public byte[] RowVersion { get; set; }

        public virtual Jobs Job { get; set; }
        public virtual ICollection<Periods> Periods { get; set; }
    }
}
