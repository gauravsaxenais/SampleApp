using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class CasreaderPanels
    {
        public int JobId { get; set; }
        public int PanelId { get; set; }
        public bool SyncNode { get; set; }
        public bool? SendEventsToPc { get; set; }
        public bool Interlock { get; set; }
        public int FacilityCode { get; set; }
        public long? CardFormat { get; set; }
        public byte[] RowVersion { get; set; }
        public bool InOutReader { get; set; }

        public virtual Panels Panels { get; set; }
    }
}
