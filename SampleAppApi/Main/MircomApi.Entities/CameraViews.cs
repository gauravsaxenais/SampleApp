using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class CameraViews
    {
        public CameraViews()
        {
            CameraViewItems = new HashSet<CameraViewItems>();
        }

        public int JobId { get; set; }
        public int ViewId { get; set; }
        public Guid ViewGuid { get; set; }
        public string Name { get; set; }
        public byte ViewNum { get; set; }
        public byte LayoutId { get; set; }
        public short PopX { get; set; }
        public short PopY { get; set; }
        public short PopWidth { get; set; }
        public short PopHeight { get; set; }

        public virtual Jobs Job { get; set; }
        public virtual ICollection<CameraViewItems> CameraViewItems { get; set; }
    }
}
