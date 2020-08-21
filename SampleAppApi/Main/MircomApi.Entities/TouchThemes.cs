using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class TouchThemes
    {
        public int JobId { get; set; }
        public int ThemeId { get; set; }
        public short PropId { get; set; }
        public byte DataType { get; set; }
        public string PropValue { get; set; }
        public byte Category { get; set; }
        public bool? Visible { get; set; }
        public int PanelId { get; set; }
        public byte[] RowVersion { get; set; }

        public virtual Panels Panels { get; set; }
    }
}
