using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class Cards
    {
        public Cards()
        {
            CardAccessCorr = new HashSet<CardAccessCorr>();
        }

        public int JobId { get; set; }
        public int CardId { get; set; }
        public string CardName { get; set; }
        public int FacilityCode { get; set; }
        public int CardNumber { get; set; }
        public bool HighSecurity { get; set; }
        public bool ExtendedLockTime { get; set; }
        public bool HandicapAccess { get; set; }
        public bool LockUnlock { get; set; }
        public bool IgnoreAntiPb { get; set; }
        public int Pin { get; set; }
        public byte Status { get; set; }
        public DateTime? ActivationDate { get; set; }
        public DateTime? DeactiviationDate { get; set; }
        public short UsageCount { get; set; }
        public bool FirstPersonIn { get; set; }
        public byte[] RowVersion { get; set; }

        public virtual Jobs Job { get; set; }
        public virtual ICollection<CardAccessCorr> CardAccessCorr { get; set; }
		public virtual ICollection<CardProfileCorr> CardProfileCorrs { get; set; }
  }
}
