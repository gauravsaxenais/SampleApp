using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class TouchAdvertisePlaylist
    {
        public int JobId { get; set; }
        public int PanelId { get; set; }
        public int VideoId { get; set; }
        public int PlaylistId { get; set; }
        public byte DayofWeek { get; set; }
        public byte TimeofDay { get; set; }
        public byte[] RowVersion { get; set; }

        public virtual TouchAdvertising TouchAdvertising { get; set; }
    }
}
