using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class AccessLevelDetails
    {
        public int JobId { get; set; }
        public int AccessLevelId { get; set; }
        public int PanelId { get; set; }
        public byte AccessPointId { get; set; }
        public int ScheduleId { get; set; }
        public int CorrId { get; set; }
        public byte[] RowVersion { get; set; }

        public virtual AccessLevels AccessLevels { get; set; }
        public virtual AccessPoints AccessPoints { get; set; }
    }
}
