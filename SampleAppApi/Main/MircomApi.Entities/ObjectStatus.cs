using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class ObjectStatus
    {
        public int JobId { get; set; }
        public byte ObjectType { get; set; }
        public string ObjectId { get; set; }
        public DateTime? UtctimeStamp { get; set; }
        public byte Status { get; set; }
        public string Description { get; set; }
        public int StatusData1 { get; set; }
        public int StatusData2 { get; set; }
        public int ItemId { get; set; }
        public int ParentItem { get; set; }
        public bool Deleted { get; set; }

        public virtual Jobs Job { get; set; }
    }
}
