using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class DateTimeModel
    {
        public int JobId { get; set; }
        public int PanelId { get; set; }
        public bool? Dstenable { get; set; }
        public byte DststartMonth { get; set; }
        public byte DststartWeek { get; set; }
        public byte DststartDow { get; set; }
        public byte DststartHour { get; set; }
        public byte DststartMin { get; set; }
        public byte DstendMonth { get; set; }
        public byte DstendWeek { get; set; }
        public byte DstendDow { get; set; }
        public byte DstendHour { get; set; }
        public byte DstendMin { get; set; }
        public short ClockAdjust { get; set; }
        public byte[] RowVersion { get; set; }

        public virtual Panels Panels { get; set; }
    }
}
