using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class ResProfileCorr
    {
        public int JobId { get; set; }
        public int ResidentId { get; set; }
        public int ProfileId { get; set; }
        public byte[] RowVersion { get; set; }

        public virtual Profiles Profiles { get; set; }
        public virtual Residents Residents { get; set; }
    }
}
