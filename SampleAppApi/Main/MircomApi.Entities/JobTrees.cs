using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class JobTrees
    {
        public int JobId { get; set; }
        public byte TreeType { get; set; }
        public int NodeId { get; set; }
        public byte Type { get; set; }
        public byte Position { get; set; }
        public int? ParentNodeId { get; set; }
        public int Data { get; set; }
        public int? Data1 { get; set; }

        public virtual Jobs Job { get; set; }
    }
}
