using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class Widgets
    {
        public Guid WidgetGuid { get; set; }
        public int? JobId { get; set; }
        public int? UserId { get; set; }
        public byte? Type { get; set; }
        public string Label { get; set; }
        public byte? X { get; set; }
        public byte? Y { get; set; }
        public byte? Width { get; set; }
        public byte? Height { get; set; }
        public Guid? JobGuid { get; set; }
        public string OptionText { get; set; }
        public Guid? ComponentGuid { get; set; }

        public virtual Jobs Job { get; set; }
    }
}
