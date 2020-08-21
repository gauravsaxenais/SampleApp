using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class Io
    {
        public Io()
        {
            Iocorr = new HashSet<Iocorr>();
        }

        public int JobId { get; set; }
        public int PanelId { get; set; }
        public int ItemId { get; set; }
        public bool IsInput { get; set; }
        public byte Type { get; set; }
        public string Label { get; set; }
        public byte ActiveState { get; set; }
        public byte Supervised { get; set; }
        public byte Delay { get; set; }
        public byte[] RowVersion { get; set; }

        public virtual Panels Panels { get; set; }
        public virtual ICollection<Iocorr> Iocorr { get; set; }
    }
}
