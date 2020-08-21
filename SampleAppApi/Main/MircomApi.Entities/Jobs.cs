using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class Jobs
    {
        public Jobs()
        {
            AccessLevels = new HashSet<AccessLevels>();
            AlertConfig = new HashSet<AlertConfig>();
            CameraServers = new HashSet<CameraServers>();
            CameraViews = new HashSet<CameraViews>();
            CardFormats = new HashSet<CardFormats>();
            Cards = new HashSet<Cards>();
            ElevatorGroups = new HashSet<ElevatorGroups>();
            ElevatorRelayLabels = new HashSet<ElevatorRelayLabels>();
            Holidays = new HashSet<Holidays>();
            JobTrees = new HashSet<JobTrees>();
            MapBuildings = new HashSet<MapBuildings>();
            Maps = new HashSet<Maps>();
            Networks = new HashSet<Networks>();
            ObjectStatus = new HashSet<ObjectStatus>();
            Panels = new HashSet<Panels>();
            Profiles = new HashSet<Profiles>();
            Residents = new HashSet<Residents>();
            Schedules = new HashSet<Schedules>();
            UserJobCorr = new HashSet<UserJobCorr>();
            Widgets = new HashSet<Widgets>();
        }

        public int JobId { get; set; }
        public string Name { get; set; }
        public short Version { get; set; }
        public Guid Guid { get; set; }
        public string Description { get; set; }
        public string CreatedBy { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? Modified { get; set; }
        public short ConfigVer { get; set; }
        public bool? UseLongName { get; set; }
        public string LanguageTextId { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string Province { get; set; }
        public string Country { get; set; }
        public string TimezoneId { get; set; }
        public bool? DaylightSaving { get; set; }
        public string MapCoordinates { get; set; }

        public virtual AlertEmailConfig AlertEmailConfig { get; set; }
        public virtual ICollection<AccessLevels> AccessLevels { get; set; }
        public virtual ICollection<AlertConfig> AlertConfig { get; set; }
        public virtual ICollection<CameraServers> CameraServers { get; set; }
        public virtual ICollection<CameraViews> CameraViews { get; set; }
        public virtual ICollection<CardFormats> CardFormats { get; set; }
        public virtual ICollection<Cards> Cards { get; set; }
        public virtual ICollection<ElevatorGroups> ElevatorGroups { get; set; }
        public virtual ICollection<ElevatorRelayLabels> ElevatorRelayLabels { get; set; }
        public virtual ICollection<Holidays> Holidays { get; set; }
        public virtual ICollection<JobTrees> JobTrees { get; set; }
        public virtual ICollection<MapBuildings> MapBuildings { get; set; }
        public virtual ICollection<Maps> Maps { get; set; }
        public virtual ICollection<Networks> Networks { get; set; }
        public virtual ICollection<ObjectStatus> ObjectStatus { get; set; }
        public virtual ICollection<Panels> Panels { get; set; }
        public virtual ICollection<Profiles> Profiles { get; set; }
        public virtual ICollection<Residents> Residents { get; set; }
        public virtual ICollection<Schedules> Schedules { get; set; }
        public virtual ICollection<UserJobCorr> UserJobCorr { get; set; }
        public virtual ICollection<Widgets> Widgets { get; set; }
    }
}
