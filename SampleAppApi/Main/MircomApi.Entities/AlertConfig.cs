using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class AlertConfig
    {
        public int JobId { get; set; }
        public short EventType { get; set; }
        public int PanelId { get; set; }
        public int AlertId { get; set; }
        public int EventData { get; set; }
        public bool Enabled { get; set; }
        public string EmailReceiverAddresses { get; set; }
        public int EventData2 { get; set; }
        public int EventData3 { get; set; }
        public byte[] RowVersion { get; set; }

        public virtual Jobs Job { get; set; }
    }
}
