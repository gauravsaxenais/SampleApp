using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class CardAccessCorr
    {
        public int JobId { get; set; }
        public int CardId { get; set; }
        public byte AccessLevelNum { get; set; }
        public int AccessLevelId { get; set; }
        public byte[] RowVersion { get; set; }

        public virtual AccessLevels AccessLevels { get; set; }
        public virtual Cards Cards { get; set; }
    }
}
