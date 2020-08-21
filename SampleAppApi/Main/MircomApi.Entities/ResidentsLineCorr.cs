using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class ResidentsLineCorr
    {
        public int JobId { get; set; }
        public int ResidentId { get; set; }
        public int PanelId { get; set; }
        public int PhoneLineNo { get; set; }
        public byte[] RowVersion { get; set; }

        public virtual PhoneLines PhoneLines { get; set; }
        public virtual Residents Residents { get; set; }
    }
}
