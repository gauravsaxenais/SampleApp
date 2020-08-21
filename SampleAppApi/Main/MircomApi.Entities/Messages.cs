using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class Messages
    {
        public int JobId { get; set; }
        public int PanelId { get; set; }
        public byte Language { get; set; }
        public byte LineNum { get; set; }
        public string Message { get; set; }
        public byte[] RowVersion { get; set; }

        public virtual Panels Panels { get; set; }
    }
}
