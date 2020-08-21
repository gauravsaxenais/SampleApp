using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class Files
    {
        public int JobId { get; set; }
        public int PanelId { get; set; }
        public int FileId { get; set; }
        public string Filename { get; set; }
        public int? Size { get; set; }
        public DateTime? LastModified { get; set; }
        public byte[] RowVersion { get; set; }

        public virtual Panels Panels { get; set; }
    }
}
