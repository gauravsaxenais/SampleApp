using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class Modified
    {
        public int JobId { get; set; }
        public int PanelId { get; set; }
        public short ConfigId { get; set; }
        public int RecordId { get; set; }
        public short? Flags { get; set; }
        public byte[] RowVersion { get; set; }

        public virtual Panels Panels { get; set; }
    }
}
