using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class ResidentElevatorLinks
    {
        public int JobId { get; set; }
        public int ResidentId { get; set; }
        public int LinkId { get; set; }
        public int PanelId { get; set; }

        public virtual Residents Residents { get; set; }
    }
}
