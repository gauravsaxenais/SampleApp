using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class MapBuildingCorrs
    {
        public int JobId { get; set; }
        public int BuildingId { get; set; }
        public int SlotNum { get; set; }
        public Guid? MapGuid { get; set; }

        public virtual MapBuildings MapBuildings { get; set; }
    }
}
