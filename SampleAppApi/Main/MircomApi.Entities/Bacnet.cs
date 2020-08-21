using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class Bacnet
    {
        public int JobId { get; set; }
        public int PanelId { get; set; }
        public long BaseInstanceIdentifier { get; set; }
        public long DeviceInstanceIdentifier { get; set; }
        public string VendorName { get; set; }
        public int VendorIdentifier { get; set; }
        public string AppSoftwareVer { get; set; }
        public string Location { get; set; }
        public string DeviceDescription { get; set; }
        public string DeviceName { get; set; }
        public string ModelName { get; set; }
        public int BacnetPort { get; set; }

        public virtual Panels Panels { get; set; }
    }
}
