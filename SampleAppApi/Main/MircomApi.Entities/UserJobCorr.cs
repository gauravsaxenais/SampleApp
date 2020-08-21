using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class UserJobCorr
    {
        public int UserId { get; set; }
        public int JobId { get; set; }
        public bool IsOwner { get; set; }

        public virtual Jobs Job { get; set; }
    }
}
