using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class Elevator
    {
        public int JobId { get; set; }
        public int PanelId { get; set; }
        public int AccessLevelId { get; set; }
        public bool Enable { get; set; }
        public byte ElevAddress { get; set; }
        public int ElevTimer { get; set; }
        public int ElevRelay0 { get; set; }
        public int ElevRelay32 { get; set; }
        public int ElevRelay64 { get; set; }
        public int ElevatorGroupId { get; set; }

        public virtual AccessLevels AccessLevels { get; set; }
    }
}
