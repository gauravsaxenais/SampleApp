using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class Preferences
    {
        public Guid PrefGuid { get; set; }
        public string LanguageTextId { get; set; }
        public int? UserId { get; set; }
        public string MainThemeColor { get; set; }
    }
}
