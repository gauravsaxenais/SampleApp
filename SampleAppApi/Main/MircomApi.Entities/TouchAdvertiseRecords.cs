using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class TouchAdvertiseRecords
    {
        public long RecordId { get; set; }
        public int JobId { get; set; }
        public int PanelId { get; set; }
        public int VideoId { get; set; }
        public DateTime StartDateTime { get; set; }
        public int DurationPlayed { get; set; }
        public byte[] RowVersion { get; set; }

        public virtual Panels Panels { get; set; }
    }
}
