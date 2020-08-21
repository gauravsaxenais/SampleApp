using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class Maps
    {
        public Maps()
        {
            MapItems = new HashSet<MapItems>();
        }

        public int JobId { get; set; }
        public int MapId { get; set; }
        public Guid MapGuid { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string ImageFile { get; set; }

        public virtual Jobs Job { get; set; }
        public virtual ICollection<MapItems> MapItems { get; set; }
    }
}
