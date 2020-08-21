using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class Residents
    {
        public Residents()
        {
            ResidentElevatorLinks = new HashSet<ResidentElevatorLinks>();
            ResidentsLineCorr = new HashSet<ResidentsLineCorr>();
        }

        public int JobId { get; set; }
        public int PanelId { get; set; }
        public int ResidentId { get; set; }
        public string Name { get; set; }
        public short DialCode { get; set; }
        public short AptNo { get; set; }
        public string Telephone { get; set; }
        public short RelayCode { get; set; }
        public bool HideFromDisplay { get; set; }
        public byte LineNum { get; set; }
        public byte RingPattern { get; set; }
        public byte ElevAddress { get; set; }
        public byte ElevRelayCode { get; set; }
        public int KeylessEntryCode { get; set; }
        public bool KeylessOpenMain { get; set; }
        public bool KeylessOpenAux { get; set; }
        public short Options1 { get; set; }
        public short Options2 { get; set; }
        public string AptNum { get; set; }
        public byte[] RowVersion { get; set; }
        public string SipuserId { get; set; }
        public byte CallSequence { get; set; }
        public int ElevatorGroupId { get; set; }
        public int ElevatorAddressBitMap { get; set; }

        public virtual Jobs Job { get; set; }
        public virtual ResProfileCorr ResProfileCorr { get; set; }
        public virtual ICollection<ResidentElevatorLinks> ResidentElevatorLinks { get; set; }
        public virtual ICollection<ResidentsLineCorr> ResidentsLineCorr { get; set; }
    }
}
