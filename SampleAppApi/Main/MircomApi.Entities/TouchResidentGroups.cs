using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class TouchResidentGroups
    {
        public int JobId { get; set; }
        public int PanelId { get; set; }
        public int GroupId { get; set; }
        public string Name { get; set; }
        public short DialCodeStart { get; set; }
        public short DialCodeEnd { get; set; }
        public string Filename { get; set; }
        public short ButtonMode { get; set; }
        public int? FileId { get; set; }
        public byte[] RowVersion { get; set; }
        public byte[] Logo { get; set; }
        public bool IsDefault { get; set; }

        public virtual Panels Panels { get; set; }
    }
}
