using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class ElevatorGroups
    {
        public int JobId { get; set; }
        public int ElevatorGroupId { get; set; }
        public string ElevatorGroupName { get; set; }
        public int ElevTimer { get; set; }
        public int ElevRelay0 { get; set; }
        public int ElevRelay32 { get; set; }
        public int ElevRelay64 { get; set; }
        public byte[] RowVersion { get; set; }

        public virtual Jobs Job { get; set; }
    }
}
