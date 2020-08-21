using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class TouchAdvertising
    {
        public TouchAdvertising()
        {
            TouchAdvertisePlaylist = new HashSet<TouchAdvertisePlaylist>();
        }

        public int JobId { get; set; }
        public int PanelId { get; set; }
        public int VideoId { get; set; }
        public string Filename { get; set; }
        public byte DisplayWindows { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int Volume { get; set; }
        public bool ResizeOption { get; set; }
        public int? FileId { get; set; }
        public byte[] RowVersion { get; set; }

        public virtual Panels Panels { get; set; }
        public virtual ICollection<TouchAdvertisePlaylist> TouchAdvertisePlaylist { get; set; }
    }
}
