using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class TasLobbyPanels
    {
        public TasLobbyPanels()
        {
            PhoneLines = new HashSet<PhoneLines>();
        }

        public int JobId { get; set; }
        public int PanelId { get; set; }
        public string MainDoorOpenDigit { get; set; }
        public string AuxDoorOpenDigit { get; set; }
        public byte MainDoorOpenTimer { get; set; }
        public byte AuxDoorOpenTimer { get; set; }
        public short TalkTimer { get; set; }
        public byte TonePulse { get; set; }
        public byte GuardPhone { get; set; }
        public byte CallingSchedule { get; set; }
        public byte UnlockSchedule { get; set; }
        public string CallWaitingDigit { get; set; }
        public byte Language { get; set; }
        public bool LiveKeypad { get; set; }
        public byte NumRings { get; set; }
        public byte PostalLockUsage { get; set; }
        public byte ScrollSpeed { get; set; }
        public bool DaylightSaving { get; set; }
        public short ClockAdjustment { get; set; }
        public short ElevRestrictionTimer { get; set; }
        public byte SpeakerVolume { get; set; }
        public byte MicVolume { get; set; }
        public byte EditLanguage { get; set; }
        public byte KeylessSchedule { get; set; }
        public byte FontSelect { get; set; }
        public bool? VoiceHelp { get; set; }
        public byte AutoUnlockSchedule { get; set; }
        public short? Dtmfrxgain { get; set; }
        public byte[] RowVersion { get; set; }
        public byte EchoReduction { get; set; }
        public bool HandsetConnected { get; set; }

        public virtual Panels Panels { get; set; }
        public virtual ICollection<PhoneLines> PhoneLines { get; set; }
    }
}
