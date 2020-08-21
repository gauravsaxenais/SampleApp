using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class Languages
    {
        public Languages()
        {
            LanguageItems = new HashSet<LanguageItems>();
        }

        public int LanguageId { get; set; }
        public string LanguageTextId { get; set; }
        public string LanguageName { get; set; }
        public bool Enable { get; set; }
        public int JobId { get; set; }
        public int PanelId { get; set; }
        public byte[] RowVersion { get; set; }

        public virtual Panels Panels { get; set; }
        public virtual ICollection<LanguageItems> LanguageItems { get; set; }
    }
}
