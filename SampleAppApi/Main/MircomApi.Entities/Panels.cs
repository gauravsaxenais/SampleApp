using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class Panels
    {
        public Panels()
        {
            AccessPoints = new HashSet<AccessPoints>();
            Correlations = new HashSet<Correlations>();
            EventLogs = new HashSet<EventLogs>();
            Files = new HashSet<Files>();
            Io = new HashSet<Io>();
            Languages = new HashSet<Languages>();
            Messages = new HashSet<Messages>();
            Modified = new HashSet<Modified>();
            Passcodes = new HashSet<Passcodes>();
            TouchAdvertiseRecords = new HashSet<TouchAdvertiseRecords>();
            TouchAdvertising = new HashSet<TouchAdvertising>();
            TouchGuiobjects = new HashSet<TouchGuiobjects>();
            TouchResidentGroups = new HashSet<TouchResidentGroups>();
            TouchThemes = new HashSet<TouchThemes>();
        }

        public int JobId { get; set; }
        public int NetworkId { get; set; }
        public int PanelId { get; set; }
        public byte Address { get; set; }
        public byte Type { get; set; }
        public string Name { get; set; }
        public byte Model { get; set; }
        public int SendSigniture { get; set; }
        public int GetSigniture { get; set; }
        public string Ipaddress { get; set; }
        public int MasterNode { get; set; }
        public byte[] RowVersion { get; set; }
        public Guid? PanelGuid { get; set; }
        public string Macaddress { get; set; }
        public bool IsCloudProxy { get; set; }

        public virtual Jobs Job { get; set; }
        public virtual Bacnet Bacnet { get; set; }
        public virtual CasreaderPanels CasreaderPanels { get; set; }
        public virtual DateTimeModel DateTime { get; set; }
        public virtual PanelInfo PanelInfo { get; set; }
        public virtual PanelStatusInfo PanelStatusInfo { get; set; }
        public virtual TasLobbyPanels TasLobbyPanels { get; set; }
        public virtual TouchConfig TouchConfig { get; set; }
        public virtual ICollection<AccessPoints> AccessPoints { get; set; }
        public virtual ICollection<Correlations> Correlations { get; set; }
        public virtual ICollection<EventLogs> EventLogs { get; set; }
        public virtual ICollection<Files> Files { get; set; }
        public virtual ICollection<Io> Io { get; set; }
        public virtual ICollection<Languages> Languages { get; set; }
        public virtual ICollection<Messages> Messages { get; set; }
        public virtual ICollection<Modified> Modified { get; set; }
        public virtual ICollection<Passcodes> Passcodes { get; set; }
        public virtual ICollection<TouchAdvertiseRecords> TouchAdvertiseRecords { get; set; }
        public virtual ICollection<TouchAdvertising> TouchAdvertising { get; set; }
        public virtual ICollection<TouchGuiobjects> TouchGuiobjects { get; set; }
        public virtual ICollection<TouchResidentGroups> TouchResidentGroups { get; set; }
        public virtual ICollection<TouchThemes> TouchThemes { get; set; }
    }
}
