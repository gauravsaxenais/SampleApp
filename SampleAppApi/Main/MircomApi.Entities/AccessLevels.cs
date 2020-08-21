using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class AccessLevels
    {
        public AccessLevels()
        {
            AccessLevelDetails = new HashSet<AccessLevelDetails>();
            CardAccessCorr = new HashSet<CardAccessCorr>();
        }

        public int JobId { get; set; }
        public int AccessLevelId { get; set; }
        public string AccessLevel { get; set; }
        public byte[] RowVersion { get; set; }

        public virtual Jobs Job { get; set; }
        public virtual Elevator Elevator { get; set; }
        public virtual ICollection<AccessLevelDetails> AccessLevelDetails { get; set; }
        public virtual ICollection<CardAccessCorr> CardAccessCorr { get; set; }
    }
}
