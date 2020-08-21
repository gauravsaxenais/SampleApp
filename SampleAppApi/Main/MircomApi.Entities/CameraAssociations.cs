using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class CameraAssociations
    {
        public int JobId { get; set; }
        public int ServerId { get; set; }
        public int ChannelId { get; set; }
        public int AssocId { get; set; }
        public int PanelId { get; set; }
        public byte PanelItemType { get; set; }
        public int PanelItemId { get; set; }
        public int EventType { get; set; }
        public byte PrePostTime { get; set; }

        public virtual CameraChannels CameraChannels { get; set; }
    }
}
