using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class CameraViewItems
    {
        public int JobId { get; set; }
        public int ViewId { get; set; }
        public byte CamNum { get; set; }
        public Guid? ChannelGuid { get; set; }
        public string Label { get; set; }

        public virtual CameraViews CameraViews { get; set; }
    }
}
