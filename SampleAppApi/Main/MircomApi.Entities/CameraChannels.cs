using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class CameraChannels
    {
        public CameraChannels()
        {
            CameraAssociations = new HashSet<CameraAssociations>();
        }

        public int JobId { get; set; }
        public int ServerId { get; set; }
        public int ChannelId { get; set; }
        public string Name { get; set; }
        public byte Type { get; set; }
        public bool? Enabled { get; set; }
        public string Notes { get; set; }
        public Guid ChannelGuid { get; set; }
        public string TypeLabel { get; set; }

        public virtual CameraServers CameraServers { get; set; }
        public virtual ICollection<CameraAssociations> CameraAssociations { get; set; }
    }
}
