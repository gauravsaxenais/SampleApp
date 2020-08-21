using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class MapBuildings
    {
        public MapBuildings()
        {
            MapBuildingCorrs = new HashSet<MapBuildingCorrs>();
        }

        public int JobId { get; set; }
        public int BuildingId { get; set; }
        public Guid BuildingGuid { get; set; }
        public int BuildingNum { get; set; }
        public string Name { get; set; }
        public int Slots { get; set; }
        public byte Type { get; set; }
        public string Description { get; set; }
        public string ShowcaseFile { get; set; }
        public string FloorStackFile { get; set; }

        public virtual Jobs Job { get; set; }
        public virtual ICollection<MapBuildingCorrs> MapBuildingCorrs { get; set; }
    }
}
