using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class TouchGuiobjects
    {
        public int JobId { get; set; }
        public int PanelId { get; set; }
        public int ObjectId { get; set; }
        public byte ObjectType { get; set; }
        public string Data1 { get; set; }
        public int NumData1 { get; set; }
        public int NumData2 { get; set; }
        public string ObjectName { get; set; }
        public int LangItemId { get; set; }
        public byte[] RowVersion { get; set; }

        public virtual Panels Panels { get; set; }
    }
}
