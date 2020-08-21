using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class ElevatorRelayLabels
    {
        public int JobId { get; set; }
        public string RelayLabel { get; set; }
        public int RelayAddress { get; set; }

        public virtual Jobs Job { get; set; }
    }
}
