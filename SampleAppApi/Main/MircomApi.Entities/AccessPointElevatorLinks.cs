using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class AccessPointElevatorLinks
    {
        public int JobId { get; set; }
        public int PanelId { get; set; }
        public byte AccessPointId { get; set; }
        public int LinkId { get; set; }
        public int ElevPanelId { get; set; }

        public virtual AccessPoints AccessPoints { get; set; }
    }
}
