using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class Networks
    {
        public int JobId { get; set; }
        public int NetworkId { get; set; }
        public string Name { get; set; }
        public byte PortType { get; set; }
        public short Timeout { get; set; }
        public byte Comport { get; set; }
        public string ModemName { get; set; }
        public string PhoneNum { get; set; }
        public int Passcode { get; set; }
        public string ModemInit { get; set; }
        public string NetworkMask { get; set; }
        public string GatewayIp { get; set; }
        public string StartIprange { get; set; }
        public string EndIprange { get; set; }
        public bool EnableIpssl { get; set; }
        public byte AutoSyncClockMode { get; set; }

        public virtual Jobs Job { get; set; }
    }
}
