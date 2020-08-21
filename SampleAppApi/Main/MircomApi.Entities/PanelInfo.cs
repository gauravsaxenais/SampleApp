using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class PanelInfo
    {
        public int JobId { get; set; }
        public int PanelId { get; set; }
        public byte? Type { get; set; }
        public byte? Model { get; set; }
        public string HardwareVersion { get; set; }
        public string FirmwareVersion { get; set; }
        public int? SerialNumber { get; set; }
        public DateTime? LastConfigTimeStamp { get; set; }
        public string TouchSoftwareVersion { get; set; }
        public string TouchHardwareVersion { get; set; }
        public string TouchDbversion { get; set; }
        public bool? IsCloudProxy { get; set; }
        public string Name { get; set; }
        public byte? Rs485address { get; set; }
        public string Lanipaddress { get; set; }
        public string Wanipaddress { get; set; }
        public string Urladdress { get; set; }
        public string PanelGuid { get; set; }
        public int? MasterNodeId { get; set; }
        public string Macaddress { get; set; }
        public int? NetworkId { get; set; }
        public string SendSigniture { get; set; }
        public string GetSigniture { get; set; }

        public virtual Panels Panels { get; set; }
    }
}
