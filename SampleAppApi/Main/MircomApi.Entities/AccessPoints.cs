using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class AccessPoints
    {
        public AccessPoints()
        {
            AccessLevelDetails = new HashSet<AccessLevelDetails>();
            AccessPointElevatorLinks = new HashSet<AccessPointElevatorLinks>();
        }

        public int JobId { get; set; }
        public int PanelId { get; set; }
        public byte AccessPointId { get; set; }
        public string Name { get; set; }
        public byte CardFormat { get; set; }
        public int UnlockScheduleId { get; set; }
        public int CardPinScheduleId { get; set; }
        public bool BypassReader { get; set; }
        public bool? AutoRelock { get; set; }
        public bool HandicapAccess { get; set; }
        public bool TempCard { get; set; }
        public bool? DisForcedEntryAlarm { get; set; }
        public bool PcdecisionRequired { get; set; }
        public bool FirstPersonDelay { get; set; }
        public bool RtebypassDc { get; set; }
        public bool HighSecurity { get; set; }
        public bool? ReportRte { get; set; }
        public bool ReportNotOpen { get; set; }
        public bool? ReportUnknownFormat { get; set; }
        public bool FacilityCodeMode { get; set; }
        public bool InhibitId { get; set; }
        public bool TimedAntiPb { get; set; }
        public bool? IgnoreFacilityCode { get; set; }
        public short UnlockTimer { get; set; }
        public short ExtendedTimer { get; set; }
        public short HeldOpenWarn { get; set; }
        public short HeldOpenAlarm { get; set; }
        public short AntiPbtimer { get; set; }
        public byte[] RowVersion { get; set; }
        public bool ReportNotInitialized { get; set; }
        public short HiSecSwipeTimer { get; set; }
        public short LockUnlockSwipeTimer { get; set; }
        public short PinTimeout { get; set; }
        public byte LockType { get; set; }
        public byte HubAddress { get; set; }
        public byte LocksetAddress { get; set; }
        public bool AllowElevAccess { get; set; }
        public byte ElevAddress { get; set; }
        public bool MultiElev { get; set; }

        public virtual Panels Panels { get; set; }
        public virtual ICollection<AccessLevelDetails> AccessLevelDetails { get; set; }
        public virtual ICollection<AccessPointElevatorLinks> AccessPointElevatorLinks { get; set; }
    }
}
