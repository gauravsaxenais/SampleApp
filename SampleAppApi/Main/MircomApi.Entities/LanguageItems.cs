using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class LanguageItems
    {
        public int LanguageId { get; set; }
        public int ItemId { get; set; }
        public string ItemText { get; set; }
        public int ItemCategory { get; set; }
        public int JobId { get; set; }
        public int PanelId { get; set; }
        public byte[] RowVersion { get; set; }

        public virtual Languages Languages { get; set; }
    }
}
