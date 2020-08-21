using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class CameraServers
    {
        public CameraServers()
        {
            CameraChannels = new HashSet<CameraChannels>();
        }

        public int JobId { get; set; }
        public int ServerId { get; set; }
        public Guid ServerGuid { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
        public byte ServerType { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }

        public virtual Jobs Job { get; set; }
        public virtual ICollection<CameraChannels> CameraChannels { get; set; }
    }
}
