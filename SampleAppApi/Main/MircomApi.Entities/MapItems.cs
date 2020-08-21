using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class MapItems
    {
        public int JobId { get; set; }
        public int MapId { get; set; }
        public int MapItemId { get; set; }
        public string Name { get; set; }
        public byte Type { get; set; }
        public string Notes { get; set; }
        public Guid? PanelGuid { get; set; }
        public int ItemId { get; set; }
        public Guid? ItemGuid { get; set; }
        public int X { get; set; }
        public int Y { get; set; }

        public virtual Maps Maps { get; set; }
    }
}
