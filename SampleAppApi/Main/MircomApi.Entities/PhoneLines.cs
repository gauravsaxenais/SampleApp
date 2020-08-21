using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class PhoneLines
    {
        public PhoneLines()
        {
            ResidentsLineCorr = new HashSet<ResidentsLineCorr>();
        }

        public int JobId { get; set; }
        public int PanelId { get; set; }
        public int PhoneLineNo { get; set; }
        public short Type { get; set; }
        public byte[] RowVersion { get; set; }

        public virtual TasLobbyPanels TasLobbyPanels { get; set; }
        public virtual ICollection<ResidentsLineCorr> ResidentsLineCorr { get; set; }
    }
}
