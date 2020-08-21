// <copyright file="TASConfigDBContext.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using Microsoft.EntityFrameworkCore;
using MircomApi.Entities;

namespace MircomApi.DataAccess
{
  public partial class TASConfigDBContext : DbContext
  {
	public TASConfigDBContext()
	{
	}

	public TASConfigDBContext(DbContextOptions<TASConfigDBContext> options)
		: base(options)
	{
	}

	public virtual DbSet<AccessLevelDetails> AccessLevelDetails { get; set; }
	public virtual DbSet<AccessLevels> AccessLevels { get; set; }
	public virtual DbSet<AccessPointElevatorLinks> AccessPointElevatorLinks { get; set; }
	public virtual DbSet<AccessPoints> AccessPoints { get; set; }
	public virtual DbSet<AlertConfig> AlertConfig { get; set; }
	public virtual DbSet<AlertEmailConfig> AlertEmailConfig { get; set; }
	public virtual DbSet<Bacnet> Bacnet { get; set; }
	public virtual DbSet<CameraAssociations> CameraAssociations { get; set; }
	public virtual DbSet<CameraChannels> CameraChannels { get; set; }
	public virtual DbSet<CameraServers> CameraServers { get; set; }
	public virtual DbSet<CameraViewItems> CameraViewItems { get; set; }
	public virtual DbSet<CameraViews> CameraViews { get; set; }
	public virtual DbSet<CardAccessCorr> CardAccessCorr { get; set; }
	public virtual DbSet<CardFormats> CardFormats { get; set; }
	public virtual DbSet<Cards> Cards { get; set; }
	public virtual DbSet<CasreaderPanels> CasreaderPanels { get; set; }
	public virtual DbSet<Correlations> Correlations { get; set; }
	public virtual DbSet<DateTimeModel> DateTime { get; set; }
	public virtual DbSet<Dbversion> Dbversion { get; set; }
	public virtual DbSet<Elevator> Elevator { get; set; }
	public virtual DbSet<ElevatorGroups> ElevatorGroups { get; set; }
	public virtual DbSet<ElevatorRelayLabels> ElevatorRelayLabels { get; set; }
	public virtual DbSet<EventLogs> EventLogs { get; set; }
	public virtual DbSet<Files> Files { get; set; }
	public virtual DbSet<Holidays> Holidays { get; set; }
	public virtual DbSet<Io> Io { get; set; }
	public virtual DbSet<Iocorr> Iocorr { get; set; }
	public virtual DbSet<JobTrees> JobTrees { get; set; }
	public virtual DbSet<Jobs> Jobs { get; set; }
	public virtual DbSet<LanguageItems> LanguageItems { get; set; }
	public virtual DbSet<Languages> Languages { get; set; }
	public virtual DbSet<MapBuildingCorrs> MapBuildingCorrs { get; set; }
	public virtual DbSet<MapBuildings> MapBuildings { get; set; }
	public virtual DbSet<MapItems> MapItems { get; set; }
	public virtual DbSet<Maps> Maps { get; set; }
	public virtual DbSet<Messages> Messages { get; set; }
	public virtual DbSet<Modified> Modified { get; set; }
	public virtual DbSet<Networks> Networks { get; set; }
	public virtual DbSet<ObjectStatus> ObjectStatus { get; set; }
	public virtual DbSet<PanelInfo> PanelInfo { get; set; }
	public virtual DbSet<PanelStatusInfo> PanelStatusInfo { get; set; }
	public virtual DbSet<Panels> Panels { get; set; }
	public virtual DbSet<Passcodes> Passcodes { get; set; }
	public virtual DbSet<Periods> Periods { get; set; }
	public virtual DbSet<PhoneLines> PhoneLines { get; set; }
	public virtual DbSet<Preferences> Preferences { get; set; }
	public virtual DbSet<Profiles> Profiles { get; set; }
	public virtual DbSet<Reports> Reports { get; set; }
	public virtual DbSet<ResProfileCorr> ResProfileCorr { get; set; }
	public virtual DbSet<ResidentElevatorLinks> ResidentElevatorLinks { get; set; }
	public virtual DbSet<Residents> Residents { get; set; }
	public virtual DbSet<ResidentsLineCorr> ResidentsLineCorr { get; set; }
	public virtual DbSet<Schedules> Schedules { get; set; }
	public virtual DbSet<Sipadmin> Sipadmin { get; set; }
	public virtual DbSet<TasLobbyPanels> TasLobbyPanels { get; set; }
	public virtual DbSet<TouchAdvertisePlaylist> TouchAdvertisePlaylist { get; set; }
	public virtual DbSet<TouchAdvertiseRecords> TouchAdvertiseRecords { get; set; }
	public virtual DbSet<TouchAdvertising> TouchAdvertising { get; set; }
	public virtual DbSet<TouchConfig> TouchConfig { get; set; }
	public virtual DbSet<TouchGuiobjects> TouchGuiobjects { get; set; }
	public virtual DbSet<TouchResidentGroups> TouchResidentGroups { get; set; }
	public virtual DbSet<TouchThemes> TouchThemes { get; set; }
	public virtual DbSet<UserJobCorr> UserJobCorr { get; set; }
	public virtual DbSet<Users> Users { get; set; }
	public virtual DbSet<Widgets> Widgets { get; set; }
	public virtual DbSet<EnumModel> Enums { get; set; }
	public virtual DbSet<CardProfileCorr> CardProfileCorrs { get; set; }

	// Unable to generate entity type for table 'dbo.TouchConfigBlob'. Please see the warning messages.
	protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
	{
	}

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
	  modelBuilder.HasAnnotation("ProductVersion", "2.2.6-servicing-10079");

	  modelBuilder.Entity<AccessLevelDetails>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.CorrId });

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.CorrId).HasColumnName("CorrID");

		entity.Property(e => e.AccessLevelId).HasColumnName("AccessLevelID");

		entity.Property(e => e.AccessPointId).HasColumnName("AccessPointID");

		entity.Property(e => e.PanelId).HasColumnName("PanelID");

		entity.Property(e => e.RowVersion).IsRowVersion();

		entity.Property(e => e.ScheduleId).HasColumnName("ScheduleID");

		entity.HasOne(d => d.AccessLevels)
				  .WithMany(p => p.AccessLevelDetails)
				  .HasForeignKey(d => new { d.JobId, d.AccessLevelId })
				  .HasConstraintName("FK_AccessLevelDetails_AccessLevels");

		entity.HasOne(d => d.AccessPoints)
				  .WithMany(p => p.AccessLevelDetails)
				  .HasForeignKey(d => new { d.JobId, d.PanelId, d.AccessPointId })
				  .HasConstraintName("FK_AccessLevelDetails_AccessPoints");
	  });

	  modelBuilder.Entity<AccessLevels>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.AccessLevelId });

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.AccessLevelId).HasColumnName("AccessLevelID");

		entity.Property(e => e.AccessLevel)
				  .IsRequired()
				  .HasMaxLength(50);

		entity.Property(e => e.RowVersion).IsRowVersion();

		entity.HasOne(d => d.Job)
				  .WithMany(p => p.AccessLevels)
				  .HasForeignKey(d => d.JobId)
				  .HasConstraintName("FK_AccessLevels_Jobs");
	  });

	  modelBuilder.Entity<AccessPointElevatorLinks>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.PanelId, e.AccessPointId, e.LinkId });

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.PanelId).HasColumnName("PanelID");

		entity.Property(e => e.AccessPointId).HasColumnName("AccessPointID");

		entity.Property(e => e.LinkId).HasColumnName("LinkID");

		entity.Property(e => e.ElevPanelId).HasColumnName("ElevPanelID");

		entity.HasOne(d => d.AccessPoints)
				  .WithMany(p => p.AccessPointElevatorLinks)
				  .HasForeignKey(d => new { d.JobId, d.PanelId, d.AccessPointId })
				  .HasConstraintName("FK_AccessPointElevatorLinks_AccessPoints");
	  });

	  modelBuilder.Entity<AccessPoints>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.PanelId, e.AccessPointId });

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.PanelId).HasColumnName("PanelID");

		entity.Property(e => e.AccessPointId).HasColumnName("AccessPointID");

		entity.Property(e => e.AntiPbtimer).HasColumnName("AntiPBTimer");

		entity.Property(e => e.AutoRelock)
				  .IsRequired()
				  .HasDefaultValueSql("((1))");

		entity.Property(e => e.CardPinScheduleId).HasColumnName("CardPinScheduleID");

		entity.Property(e => e.DisForcedEntryAlarm)
				  .IsRequired()
				  .HasDefaultValueSql("((1))");

		entity.Property(e => e.HiSecSwipeTimer).HasDefaultValueSql("((10))");

		entity.Property(e => e.HubAddress).HasDefaultValueSql("((1))");

		entity.Property(e => e.IgnoreFacilityCode)
				  .IsRequired()
				  .HasDefaultValueSql("((1))");

		entity.Property(e => e.InhibitId).HasColumnName("InhibitID");

		entity.Property(e => e.LockType).HasDefaultValueSql("((1))");

		entity.Property(e => e.LockUnlockSwipeTimer).HasDefaultValueSql("((10))");

		entity.Property(e => e.Name)
				  .IsRequired()
				  .HasMaxLength(50);

		entity.Property(e => e.PcdecisionRequired).HasColumnName("PCDecisionRequired");

		entity.Property(e => e.PinTimeout).HasDefaultValueSql("((20))");

		entity.Property(e => e.ReportRte)
				  .IsRequired()
				  .HasColumnName("ReportRTE")
				  .HasDefaultValueSql("((1))");

		entity.Property(e => e.ReportUnknownFormat)
				  .IsRequired()
				  .HasDefaultValueSql("((1))");

		entity.Property(e => e.RowVersion).IsRowVersion();

		entity.Property(e => e.RtebypassDc).HasColumnName("RTEBypassDC");

		entity.Property(e => e.TimedAntiPb).HasColumnName("TimedAntiPB");

		entity.Property(e => e.UnlockScheduleId).HasColumnName("UnlockScheduleID");

		entity.HasOne(d => d.Panels)
				  .WithMany(p => p.AccessPoints)
				  .HasForeignKey(d => new { d.JobId, d.PanelId })
				  .HasConstraintName("FK_AccessPoints_Panels");
	  });

	  modelBuilder.Entity<AlertConfig>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.AlertId });

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.AlertId).HasColumnName("AlertID");

		entity.Property(e => e.EmailReceiverAddresses)
				  .IsRequired()
				  .HasMaxLength(500)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.PanelId).HasColumnName("PanelID");

		entity.Property(e => e.RowVersion).IsRowVersion();

		entity.HasOne(d => d.Job)
				  .WithMany(p => p.AlertConfig)
				  .HasForeignKey(d => d.JobId)
				  .HasConstraintName("FK_AlertConfig_Jobs");
	  });

	  modelBuilder.Entity<AlertEmailConfig>(entity =>
	  {
		entity.HasKey(e => e.JobId);

		entity.Property(e => e.JobId)
				  .HasColumnName("JobID")
				  .ValueGeneratedNever();

		entity.Property(e => e.EmailDisplayName)
				  .IsRequired()
				  .HasMaxLength(30)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.EmailSenderAddress)
				  .IsRequired()
				  .HasMaxLength(100)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.EmailSmtpserver)
				  .IsRequired()
				  .HasColumnName("EmailSMTPServer")
				  .HasMaxLength(100)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.EmailUserName)
				  .IsRequired()
				  .HasMaxLength(30)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.EmailUserPassword)
				  .IsRequired()
				  .HasMaxLength(40)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.RowVersion).IsRowVersion();

		entity.HasOne(d => d.Job)
				  .WithOne(p => p.AlertEmailConfig)
				  .HasForeignKey<AlertEmailConfig>(d => d.JobId)
				  .HasConstraintName("FK_AlertEmailConfig_Jobs");
	  });

	  modelBuilder.Entity<Bacnet>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.PanelId });

		entity.ToTable("BACnet");

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.PanelId).HasColumnName("PanelID");

		entity.Property(e => e.AppSoftwareVer)
				  .IsRequired()
				  .HasMaxLength(15)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.DeviceDescription)
				  .IsRequired()
				  .HasMaxLength(25)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.DeviceName)
				  .IsRequired()
				  .HasMaxLength(20)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.Location)
				  .IsRequired()
				  .HasMaxLength(25)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.ModelName)
				  .IsRequired()
				  .HasMaxLength(15)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.VendorName)
				  .IsRequired()
				  .HasMaxLength(25)
				  .HasDefaultValueSql("('')");

		entity.HasOne(d => d.Panels)
				  .WithOne(p => p.Bacnet)
				  .HasForeignKey<Bacnet>(d => new { d.JobId, d.PanelId })
				  .HasConstraintName("FK_BACnet_Panels");
	  });

	  modelBuilder.Entity<CameraAssociations>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.ServerId, e.ChannelId, e.AssocId });

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.ServerId).HasColumnName("ServerID");

		entity.Property(e => e.ChannelId).HasColumnName("ChannelID");

		entity.Property(e => e.AssocId).HasColumnName("AssocID");

		entity.Property(e => e.PanelId).HasColumnName("PanelID");

		entity.Property(e => e.PanelItemId).HasColumnName("PanelItemID");

		entity.HasOne(d => d.CameraChannels)
				  .WithMany(p => p.CameraAssociations)
				  .HasForeignKey(d => new { d.JobId, d.ServerId, d.ChannelId })
				  .HasConstraintName("FK_CameraAssociations_CameraChannels");
	  });

	  modelBuilder.Entity<CameraChannels>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.ServerId, e.ChannelId })
				  .HasName("PK_Cameras");

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.ServerId).HasColumnName("ServerID");

		entity.Property(e => e.ChannelId).HasColumnName("ChannelID");

		entity.Property(e => e.ChannelGuid)
				  .HasColumnName("ChannelGUID")
				  .HasDefaultValueSql("(newid())");

		entity.Property(e => e.Enabled)
				  .IsRequired()
				  .HasDefaultValueSql("((1))");

		entity.Property(e => e.Name)
				  .IsRequired()
				  .HasMaxLength(50)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.Notes)
				  .IsRequired()
				  .HasMaxLength(200)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.TypeLabel)
				  .IsRequired()
				  .HasMaxLength(50)
				  .HasDefaultValueSql("('')");

		entity.HasOne(d => d.CameraServers)
				  .WithMany(p => p.CameraChannels)
				  .HasForeignKey(d => new { d.JobId, d.ServerId })
				  .HasConstraintName("FK_CameraChannels_CameraServers");
	  });

	  modelBuilder.Entity<CameraServers>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.ServerId });

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.ServerId).HasColumnName("ServerID");

		entity.Property(e => e.Name)
				  .IsRequired()
				  .HasMaxLength(50)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.Password)
				  .IsRequired()
				  .HasMaxLength(50)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.ServerGuid)
				  .HasColumnName("ServerGUID")
				  .HasDefaultValueSql("(newid())");

		entity.Property(e => e.Url)
				  .IsRequired()
				  .HasColumnName("URL")
				  .HasMaxLength(100)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.Username)
				  .IsRequired()
				  .HasMaxLength(50)
				  .HasDefaultValueSql("('')");

		entity.HasOne(d => d.Job)
				  .WithMany(p => p.CameraServers)
				  .HasForeignKey(d => d.JobId)
				  .HasConstraintName("FK_CameraServers_Jobs");
	  });

	  modelBuilder.Entity<CameraViewItems>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.ViewId, e.CamNum });

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.ViewId).HasColumnName("ViewID");

		entity.Property(e => e.ChannelGuid).HasColumnName("ChannelGUID");

		entity.Property(e => e.Label)
				  .IsRequired()
				  .HasMaxLength(50)
				  .HasDefaultValueSql("('')");

		entity.HasOne(d => d.CameraViews)
				  .WithMany(p => p.CameraViewItems)
				  .HasForeignKey(d => new { d.JobId, d.ViewId })
				  .HasConstraintName("FK_CameraViewItems_CameraViews");
	  });

	  modelBuilder.Entity<CameraViews>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.ViewId });

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.ViewId).HasColumnName("ViewID");

		entity.Property(e => e.LayoutId).HasColumnName("LayoutID");

		entity.Property(e => e.Name)
				  .IsRequired()
				  .HasMaxLength(50)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.ViewGuid)
				  .HasColumnName("ViewGUID")
				  .HasDefaultValueSql("(newid())");

		entity.HasOne(d => d.Job)
				  .WithMany(p => p.CameraViews)
				  .HasForeignKey(d => d.JobId)
				  .HasConstraintName("FK_CameraViews_Jobs");
	  });

	  modelBuilder.Entity<CardAccessCorr>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.CardId, e.AccessLevelNum, e.AccessLevelId })
				  .HasName("PK_CardAccessCorr_1");

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.CardId).HasColumnName("CardID");

		entity.Property(e => e.AccessLevelNum).HasDefaultValueSql("((1))");

		entity.Property(e => e.AccessLevelId).HasColumnName("AccessLevelID");

		entity.Property(e => e.RowVersion).IsRowVersion();

		entity.HasOne(d => d.AccessLevels)
				  .WithMany(p => p.CardAccessCorr)
				  .HasForeignKey(d => new { d.JobId, d.AccessLevelId })
				  .OnDelete(DeleteBehavior.ClientSetNull)
				  .HasConstraintName("FK_CardAccessCorr_AccessLevels");

		entity.HasOne(d => d.Cards)
				  .WithMany(p => p.CardAccessCorr)
				  .HasForeignKey(d => new { d.JobId, d.CardId })
				  .HasConstraintName("FK_CardAccessCorr_Cards");
	  });

	  modelBuilder.Entity<CardFormats>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.CardFormatId });

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.CardFormatId).HasColumnName("CardFormatID");

		entity.Property(e => e.Name)
				  .HasMaxLength(30)
				  .IsUnicode(false);

		entity.HasOne(d => d.Job)
				  .WithMany(p => p.CardFormats)
				  .HasForeignKey(d => d.JobId)
				  .HasConstraintName("FK_CardFormats_Jobs");
	  });

	  modelBuilder.Entity<Cards>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.CardId });

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.CardId).HasColumnName("CardID");

		entity.Property(e => e.ActivationDate).HasColumnType("smalldatetime");

		entity.Property(e => e.CardName)
				  .IsRequired()
				  .HasMaxLength(50);

		entity.Property(e => e.DeactiviationDate).HasColumnType("smalldatetime");

		entity.Property(e => e.IgnoreAntiPb).HasColumnName("IgnoreAntiPB");

		entity.Property(e => e.Pin).HasColumnName("PIN");

		entity.Property(e => e.RowVersion).IsRowVersion();

		entity.HasOne(d => d.Job)
				  .WithMany(p => p.Cards)
				  .HasForeignKey(d => d.JobId)
				  .HasConstraintName("FK_Cards_Jobs");
	  });

	  modelBuilder.Entity<Cards>()
		  .HasMany(e => e.CardProfileCorrs)
		  .WithOne(e => e.Card)
		  .IsRequired()
		  .HasForeignKey(e => new { e.JobID, e.CardID });
	  modelBuilder.Entity<CardProfileCorr>()
		  .HasKey(e => new { e.JobID, e.CardID, e.ProfileID });
	  modelBuilder.Entity<CardProfileCorr>()
		  .Property(e => e.RowVersion)
		  .IsFixedLength();

	  modelBuilder.Entity<CasreaderPanels>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.PanelId })
				  .HasName("PK_CAS Panels");

		entity.ToTable("CASReaderPanels");

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.PanelId).HasColumnName("PanelID");

		entity.Property(e => e.RowVersion).IsRowVersion();

		entity.Property(e => e.SendEventsToPc).HasColumnName("SendEventsToPC");

		entity.HasOne(d => d.Panels)
				  .WithOne(p => p.CasreaderPanels)
				  .HasForeignKey<CasreaderPanels>(d => new { d.JobId, d.PanelId })
				  .HasConstraintName("FK_CASReaderPanels_Panels");
	  });

	  modelBuilder.Entity<Correlations>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.PanelId, e.CorrId });

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.PanelId).HasColumnName("PanelID");

		entity.Property(e => e.CorrId).HasColumnName("CorrID");

		entity.Property(e => e.ActionPanelId).HasColumnName("ActionPanelID");

		entity.Property(e => e.Custom485Addr).HasDefaultValueSql("((0))");

		entity.Property(e => e.CustomIpaddr)
				  .IsRequired()
				  .HasColumnName("CustomIPAddr")
				  .HasMaxLength(20)
				  .IsUnicode(false)
				  .HasDefaultValueSql("('(\"\")')");

		entity.Property(e => e.CustomPanelId)
				  .HasColumnName("CustomPanelID")
				  .HasDefaultValueSql("((0))");

		entity.Property(e => e.Duration).HasDefaultValueSql("((-1))");

		entity.Property(e => e.RowVersion).IsRowVersion();

		entity.Property(e => e.ScheduleId).HasColumnName("ScheduleID");

		entity.HasOne(d => d.Panels)
				  .WithMany(p => p.Correlations)
				  .HasForeignKey(d => new { d.JobId, d.PanelId })
				  .HasConstraintName("FK_Correlations_Panels");
	  });

	  modelBuilder.Entity<DateTimeModel>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.PanelId });

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.PanelId)
				  .HasColumnName("PanelID")
				  .HasDefaultValueSql("((1))");

		entity.Property(e => e.Dstenable)
				  .IsRequired()
				  .HasColumnName("DSTEnable")
				  .HasDefaultValueSql("((1))");

		entity.Property(e => e.DstendDow).HasColumnName("DSTEndDOW");

		entity.Property(e => e.DstendHour)
				  .HasColumnName("DSTEndHour")
				  .HasDefaultValueSql("((2))");

		entity.Property(e => e.DstendMin).HasColumnName("DSTEndMin");

		entity.Property(e => e.DstendMonth)
				  .HasColumnName("DSTEndMonth")
				  .HasDefaultValueSql("((11))");

		entity.Property(e => e.DstendWeek).HasColumnName("DSTEndWeek");

		entity.Property(e => e.DststartDow).HasColumnName("DSTStartDOW");

		entity.Property(e => e.DststartHour)
				  .HasColumnName("DSTStartHour")
				  .HasDefaultValueSql("((2))");

		entity.Property(e => e.DststartMin).HasColumnName("DSTStartMin");

		entity.Property(e => e.DststartMonth)
				  .HasColumnName("DSTStartMonth")
				  .HasDefaultValueSql("((3))");

		entity.Property(e => e.DststartWeek)
				  .HasColumnName("DSTStartWeek")
				  .HasDefaultValueSql("((1))");

		entity.Property(e => e.RowVersion).IsRowVersion();

		entity.HasOne(d => d.Panels)
				  .WithOne(p => p.DateTime)
				  .HasForeignKey<DateTimeModel>(d => new { d.JobId, d.PanelId })
				  .HasConstraintName("FK_DateTime_Panels");
	  });

	  modelBuilder.Entity<Dbversion>(entity =>
	  {
		entity.HasKey(e => new { e.MajorVersion, e.MinorVersion });

		entity.ToTable("DBVersion");

		entity.Property(e => e.Changes).HasMaxLength(200);

		entity.Property(e => e.ModifiedBy).HasMaxLength(20);
	  });

	  modelBuilder.Entity<Elevator>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.AccessLevelId })
				  .HasName("PK_Elevator_1");

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.AccessLevelId).HasColumnName("AccessLevelID");

		entity.Property(e => e.ElevAddress).HasDefaultValueSql("((10))");

		entity.Property(e => e.ElevTimer).HasDefaultValueSql("((60))");

		entity.Property(e => e.ElevatorGroupId)
				  .HasColumnName("ElevatorGroupID")
				  .HasDefaultValueSql("((-1))");

		entity.Property(e => e.PanelId).HasColumnName("PanelID");

		entity.HasOne(d => d.AccessLevels)
				  .WithOne(p => p.Elevator)
				  .HasForeignKey<Elevator>(d => new { d.JobId, d.AccessLevelId })
				  .HasConstraintName("FK_Elevator_AccessLevels");
	  });

	  modelBuilder.Entity<ElevatorGroups>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.ElevatorGroupId });

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.ElevatorGroupId).HasColumnName("ElevatorGroupID");

		entity.Property(e => e.ElevTimer).HasDefaultValueSql("((60))");

		entity.Property(e => e.ElevatorGroupName)
				  .IsRequired()
				  .HasMaxLength(20)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.RowVersion).IsRowVersion();

		entity.HasOne(d => d.Job)
				  .WithMany(p => p.ElevatorGroups)
				  .HasForeignKey(d => d.JobId)
				  .HasConstraintName("FK_ElevatorGroups_Jobs");
	  });

	  modelBuilder.Entity<ElevatorRelayLabels>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.RelayAddress });

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.RelayLabel)
				  .IsRequired()
				  .HasMaxLength(20);

		entity.HasOne(d => d.Job)
				  .WithMany(p => p.ElevatorRelayLabels)
				  .HasForeignKey(d => d.JobId)
				  .HasConstraintName("FK_ElevatorRelayLabels_Jobs");
	  });

	  modelBuilder.Entity<EnumModel>()
		  .HasKey(e => new { e.Language, e.EnumID, e.Value, e.Text });

	  modelBuilder.Entity<EventLogs>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.EventId })
				  .HasName("PK_EventLogs_1");

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.EventId)
				  .HasColumnName("EventID")
				  .ValueGeneratedOnAdd();

		entity.Property(e => e.ChannelGuid).HasColumnName("ChannelGUID");

		entity.Property(e => e.Description)
				  .IsRequired()
				  .HasMaxLength(100);

		entity.Property(e => e.MapGuid).HasColumnName("MapGUID");

		entity.Property(e => e.PanelId).HasColumnName("PanelID");

		entity.Property(e => e.PanelItemId).HasColumnName("PanelItemID");

		entity.Property(e => e.TimeStamp).HasColumnType("datetime");

		entity.HasOne(d => d.Panels)
				  .WithMany(p => p.EventLogs)
				  .HasForeignKey(d => new { d.JobId, d.PanelId })
				  .HasConstraintName("FK_Events_Panels");
	  });

	  modelBuilder.Entity<Files>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.PanelId, e.FileId });

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.PanelId).HasColumnName("PanelID");

		entity.Property(e => e.FileId).HasColumnName("FileID");

		entity.Property(e => e.Filename).HasMaxLength(300);

		entity.Property(e => e.LastModified).HasColumnType("datetime");

		entity.Property(e => e.RowVersion).IsRowVersion();

		entity.Property(e => e.Size).HasDefaultValueSql("((0))");

		entity.HasOne(d => d.Panels)
				  .WithMany(p => p.Files)
				  .HasForeignKey(d => new { d.JobId, d.PanelId })
				  .HasConstraintName("FK_Files_Panels");
	  });

	  modelBuilder.Entity<Holidays>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.PanelId, e.HolidayId });

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.PanelId).HasColumnName("PanelID");

		entity.Property(e => e.HolidayId).HasColumnName("HolidayID");

		entity.Property(e => e.EndDate).HasColumnType("smalldatetime");

		entity.Property(e => e.EndTime).HasColumnType("smalldatetime");

		entity.Property(e => e.Name)
				  .IsRequired()
				  .HasMaxLength(40);

		entity.Property(e => e.RowVersion).IsRowVersion();

		entity.Property(e => e.StartDate).HasColumnType("smalldatetime");

		entity.Property(e => e.StartTime).HasColumnType("smalldatetime");

		entity.HasOne(d => d.Job)
				  .WithMany(p => p.Holidays)
				  .HasForeignKey(d => d.JobId)
				  .HasConstraintName("FK_Holidays_Jobs");
	  });

	  modelBuilder.Entity<Io>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.PanelId, e.ItemId });

		entity.ToTable("IO");

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.PanelId).HasColumnName("PanelID");

		entity.Property(e => e.ItemId).HasColumnName("ItemID");

		entity.Property(e => e.ActiveState).HasDefaultValueSql("((1))");

		entity.Property(e => e.Label)
				  .IsRequired()
				  .HasMaxLength(20);

		entity.Property(e => e.RowVersion).IsRowVersion();

		entity.HasOne(d => d.Panels)
				  .WithMany(p => p.Io)
				  .HasForeignKey(d => new { d.JobId, d.PanelId })
				  .HasConstraintName("FK_IO_Panels");
	  });

	  modelBuilder.Entity<Iocorr>(entity =>
	  {
		entity.HasKey(e => new { e.CorrId, e.JobId });

		entity.ToTable("IOCorr");

		entity.Property(e => e.CorrId).HasColumnName("CorrID");

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.InputId).HasColumnName("InputID");

		entity.Property(e => e.OutputId).HasColumnName("OutputID");

		entity.Property(e => e.OutputPanelId).HasColumnName("OutputPanelID");

		entity.Property(e => e.PanelId).HasColumnName("PanelID");

		entity.Property(e => e.ScheduleId).HasColumnName("ScheduleID");

		entity.HasOne(d => d.Io)
				  .WithMany(p => p.Iocorr)
				  .HasForeignKey(d => new { d.JobId, d.PanelId, d.InputId })
				  .HasConstraintName("FK_IOCorr_IO");
	  });

	  modelBuilder.Entity<JobTrees>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.TreeType, e.NodeId });

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.NodeId).HasColumnName("NodeID");

		entity.Property(e => e.Data1).HasDefaultValueSql("((0))");

		entity.Property(e => e.ParentNodeId).HasColumnName("ParentNodeID");

		entity.HasOne(d => d.Job)
				  .WithMany(p => p.JobTrees)
				  .HasForeignKey(d => d.JobId)
				  .HasConstraintName("FK_JobTrees_Jobs");
	  });

	  modelBuilder.Entity<Jobs>(entity =>
	  {
		entity.HasKey(e => e.JobId)
				  .HasName("PK_Jobs_1");

		entity.Property(e => e.JobId)
				  .HasColumnName("JobID")
				  .ValueGeneratedNever();

		entity.Property(e => e.Address)
				  .HasMaxLength(100)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.City)
				  .HasMaxLength(50)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.Country)
				  .HasMaxLength(50)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.CreatedBy)
				  .IsRequired()
				  .HasMaxLength(20);

		entity.Property(e => e.DaylightSaving).HasDefaultValueSql("((1))");

		entity.Property(e => e.Description)
				  .IsRequired()
				  .HasMaxLength(1000);

		entity.Property(e => e.Guid)
				  .HasColumnName("GUID")
				  .HasDefaultValueSql("(newid())");

		entity.Property(e => e.LanguageTextId)
				  .IsRequired()
				  .HasColumnName("LanguageTextID")
				  .HasMaxLength(10)
				  .HasDefaultValueSql("('en-US')");

		entity.Property(e => e.MapCoordinates)
				  .HasMaxLength(100)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.Modified).HasColumnType("smalldatetime");

		entity.Property(e => e.ModifiedBy)
				  .IsRequired()
				  .HasMaxLength(20);

		entity.Property(e => e.Name)
				  .IsRequired()
				  .HasMaxLength(50);

		entity.Property(e => e.Province)
				  .HasMaxLength(50)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.TimezoneId)
				  .HasColumnName("TimezoneID")
				  .HasMaxLength(50)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.UseLongName).HasDefaultValueSql("((0))");
	  });

	  modelBuilder.Entity<LanguageItems>(entity =>
	  {
		entity.HasKey(e => new { e.LanguageId, e.ItemId, e.JobId, e.PanelId })
				  .HasName("PK_LanguageItems_1");

		entity.Property(e => e.LanguageId).HasColumnName("LanguageID");

		entity.Property(e => e.ItemId).HasColumnName("ItemID");

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.PanelId)
				  .HasColumnName("PanelID")
				  .HasDefaultValueSql("((1))");

		entity.Property(e => e.ItemText)
				  .HasMaxLength(70)
				  .HasDefaultValueSql("(N'not assigned')");

		entity.Property(e => e.RowVersion).IsRowVersion();

		entity.HasOne(d => d.Languages)
				  .WithMany(p => p.LanguageItems)
				  .HasForeignKey(d => new { d.LanguageId, d.JobId, d.PanelId })
				  .HasConstraintName("FK_LanguageItems_Languages");
	  });

	  modelBuilder.Entity<Languages>(entity =>
	  {
		entity.HasKey(e => new { e.LanguageId, e.JobId, e.PanelId })
				  .HasName("PK_Languages_1");

		entity.Property(e => e.LanguageId).HasColumnName("LanguageID");

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.PanelId)
				  .HasColumnName("PanelID")
				  .HasDefaultValueSql("((1))");

		entity.Property(e => e.LanguageName)
				  .IsRequired()
				  .HasMaxLength(20)
				  .HasDefaultValueSql("(N'English')");

		entity.Property(e => e.LanguageTextId)
				  .IsRequired()
				  .HasColumnName("LanguageTextID")
				  .HasMaxLength(50)
				  .HasDefaultValueSql("('en')");

		entity.Property(e => e.RowVersion).IsRowVersion();

		entity.HasOne(d => d.Panels)
				  .WithMany(p => p.Languages)
				  .HasForeignKey(d => new { d.JobId, d.PanelId })
				  .HasConstraintName("FK_Languages_Panels");
	  });

	  modelBuilder.Entity<MapBuildingCorrs>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.BuildingId, e.SlotNum });

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.BuildingId).HasColumnName("BuildingID");

		entity.Property(e => e.MapGuid).HasColumnName("MapGUID");

		entity.HasOne(d => d.MapBuildings)
				  .WithMany(p => p.MapBuildingCorrs)
				  .HasForeignKey(d => new { d.JobId, d.BuildingId })
				  .HasConstraintName("FK_MapBuildingCorrs_MapBuildings");
	  });

	  modelBuilder.Entity<MapBuildings>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.BuildingId });

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.BuildingId).HasColumnName("BuildingID");

		entity.Property(e => e.BuildingGuid)
				  .HasColumnName("BuildingGUID")
				  .HasDefaultValueSql("(newid())");

		entity.Property(e => e.Description)
				  .IsRequired()
				  .HasMaxLength(200)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.FloorStackFile)
				  .IsRequired()
				  .HasMaxLength(200)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.Name)
				  .IsRequired()
				  .HasMaxLength(50)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.ShowcaseFile)
				  .IsRequired()
				  .HasMaxLength(200)
				  .HasDefaultValueSql("('')");

		entity.HasOne(d => d.Job)
				  .WithMany(p => p.MapBuildings)
				  .HasForeignKey(d => d.JobId)
				  .HasConstraintName("FK_MapBuildings_Jobs");
	  });

	  modelBuilder.Entity<MapItems>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.MapId, e.MapItemId });

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.MapId).HasColumnName("MapID");

		entity.Property(e => e.MapItemId).HasColumnName("MapItemID");

		entity.Property(e => e.ItemGuid).HasColumnName("ItemGUID");

		entity.Property(e => e.ItemId).HasColumnName("ItemID");

		entity.Property(e => e.Name)
				  .IsRequired()
				  .HasMaxLength(50)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.Notes)
				  .IsRequired()
				  .HasMaxLength(200)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.PanelGuid).HasColumnName("PanelGUID");

		entity.HasOne(d => d.Maps)
				  .WithMany(p => p.MapItems)
				  .HasForeignKey(d => new { d.JobId, d.MapId })
				  .HasConstraintName("FK_MapItems_Maps");
	  });

	  modelBuilder.Entity<Maps>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.MapId });

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.MapId)
					.HasColumnName("MapID")
					.ValueGeneratedOnAdd();

		entity.Property(e => e.Description)
				  .IsRequired()
				  .HasMaxLength(200)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.ImageFile)
				  .IsRequired()
				  .HasMaxLength(200)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.MapGuid)
				  .HasColumnName("MapGUID")
				  .HasDefaultValueSql("(newid())");

		entity.Property(e => e.Title)
				  .IsRequired()
				  .HasMaxLength(100)
				  .HasDefaultValueSql("('')");

		entity.HasOne(d => d.Job)
				  .WithMany(p => p.Maps)
				  .HasForeignKey(d => d.JobId)
				  .HasConstraintName("FK_Maps_Jobs");
	  });

	  modelBuilder.Entity<Messages>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.PanelId, e.Language, e.LineNum });

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.PanelId).HasColumnName("PanelID");

		entity.Property(e => e.Message)
				  .IsRequired()
				  .HasMaxLength(60);

		entity.Property(e => e.RowVersion).IsRowVersion();

		entity.HasOne(d => d.Panels)
				  .WithMany(p => p.Messages)
				  .HasForeignKey(d => new { d.JobId, d.PanelId })
				  .HasConstraintName("FK_Messages_Panels");
	  });

	  modelBuilder.Entity<Modified>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.PanelId, e.ConfigId, e.RecordId });

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.PanelId).HasColumnName("PanelID");

		entity.Property(e => e.ConfigId).HasColumnName("ConfigID");

		entity.Property(e => e.RecordId).HasColumnName("RecordID");

		entity.Property(e => e.RowVersion).IsRowVersion();

		entity.HasOne(d => d.Panels)
				  .WithMany(p => p.Modified)
				  .HasForeignKey(d => new { d.JobId, d.PanelId })
				  .HasConstraintName("FK_Modified_Panels");
	  });

	  modelBuilder.Entity<Networks>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.NetworkId });

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.NetworkId).HasColumnName("NetworkID");

		entity.Property(e => e.AutoSyncClockMode).HasDefaultValueSql("((1))");

		entity.Property(e => e.Comport).HasColumnName("COMPort");

		entity.Property(e => e.EnableIpssl).HasColumnName("EnableIPSSL");

		entity.Property(e => e.EndIprange)
				  .IsRequired()
				  .HasColumnName("EndIPRange")
				  .HasMaxLength(40)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.GatewayIp)
				  .IsRequired()
				  .HasColumnName("GatewayIP")
				  .HasMaxLength(40)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.ModemInit).HasMaxLength(50);

		entity.Property(e => e.ModemName)
				  .IsRequired()
				  .HasMaxLength(80);

		entity.Property(e => e.Name)
				  .IsRequired()
				  .HasMaxLength(20);

		entity.Property(e => e.NetworkMask)
				  .IsRequired()
				  .HasMaxLength(40)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.PhoneNum)
				  .IsRequired()
				  .HasMaxLength(40);

		entity.Property(e => e.StartIprange)
				  .IsRequired()
				  .HasColumnName("StartIPRange")
				  .HasMaxLength(40)
				  .HasDefaultValueSql("('')");

		entity.HasOne(d => d.Job)
				  .WithMany(p => p.Networks)
				  .HasForeignKey(d => d.JobId)
				  .HasConstraintName("FK_Networks_Jobs");
	  });

	  modelBuilder.Entity<ObjectStatus>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.ObjectId });

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.ObjectId)
				  .HasColumnName("ObjectID")
				  .HasMaxLength(50);

		entity.Property(e => e.Description)
				  .IsRequired()
				  .HasMaxLength(50)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.ItemId)
				  .HasColumnName("ItemID")
				  .HasDefaultValueSql("((-1))");

		entity.Property(e => e.ParentItem).HasDefaultValueSql("((-1))");

		entity.Property(e => e.UtctimeStamp)
				  .HasColumnName("UTCTimeStamp")
				  .HasColumnType("datetime");

		entity.HasOne(d => d.Job)
				  .WithMany(p => p.ObjectStatus)
				  .HasForeignKey(d => d.JobId)
				  .HasConstraintName("FK_ObjectStatus_Jobs");
	  });

	  modelBuilder.Entity<PanelInfo>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.PanelId });

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.PanelId).HasColumnName("PanelID");

		entity.Property(e => e.FirmwareVersion).HasMaxLength(20);

		entity.Property(e => e.GetSigniture).HasMaxLength(50);

		entity.Property(e => e.HardwareVersion).HasMaxLength(20);

		entity.Property(e => e.Lanipaddress)
				  .HasColumnName("LANIPAddress")
				  .HasMaxLength(50);

		entity.Property(e => e.LastConfigTimeStamp).HasColumnType("datetime");

		entity.Property(e => e.Macaddress)
				  .HasColumnName("MACAddress")
				  .HasMaxLength(50);

		entity.Property(e => e.MasterNodeId).HasColumnName("MasterNodeID");

		entity.Property(e => e.Name).HasMaxLength(20);

		entity.Property(e => e.NetworkId).HasColumnName("NetworkID");

		entity.Property(e => e.PanelGuid)
				  .HasColumnName("PanelGUID")
				  .HasMaxLength(50);

		entity.Property(e => e.Rs485address).HasColumnName("RS485Address");

		entity.Property(e => e.SendSigniture).HasMaxLength(50);

		entity.Property(e => e.TouchDbversion)
				  .HasColumnName("TouchDBVersion")
				  .HasMaxLength(20);

		entity.Property(e => e.TouchHardwareVersion).HasMaxLength(20);

		entity.Property(e => e.TouchSoftwareVersion).HasMaxLength(20);

		entity.Property(e => e.Urladdress)
				  .HasColumnName("URLAddress")
				  .HasMaxLength(100);

		entity.Property(e => e.Wanipaddress)
				  .HasColumnName("WANIPAddress")
				  .HasMaxLength(50);

		entity.HasOne(d => d.Panels)
				  .WithOne(p => p.PanelInfo)
				  .HasForeignKey<PanelInfo>(d => new { d.JobId, d.PanelId })
				  .HasConstraintName("FK_PanelInfo_Panels");
	  });

	  modelBuilder.Entity<PanelStatusInfo>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.PanelId });

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.PanelId).HasColumnName("PanelID");

		entity.Property(e => e.BatteryStatus).HasMaxLength(100);

		entity.Property(e => e.DhoalarmStatus)
				  .HasColumnName("DHOAlarmStatus")
				  .HasMaxLength(100);

		entity.Property(e => e.DhotroubleStatus)
				  .HasColumnName("DHOTroubleStatus")
				  .HasMaxLength(100);

		entity.Property(e => e.DoorHandleStatus).HasMaxLength(100);

		entity.Property(e => e.DoorStatus).HasMaxLength(100);

		entity.Property(e => e.ForcedEntryStatus).HasMaxLength(100);

		entity.Property(e => e.HubStatus).HasMaxLength(100);

		entity.Property(e => e.InputStatus).HasMaxLength(100);

		entity.Property(e => e.KeyCylinderStatus).HasMaxLength(100);

		entity.Property(e => e.LinkStatus).HasMaxLength(100);

		entity.Property(e => e.LockStatus).HasMaxLength(100);

		entity.Property(e => e.OutputStatus).HasMaxLength(100);

		entity.Property(e => e.TemperStatus).HasMaxLength(100);

		entity.Property(e => e.UtctimeStamp)
				  .HasColumnName("UTCTimeStamp")
				  .HasColumnType("datetime");

		entity.HasOne(d => d.Panels)
				  .WithOne(p => p.PanelStatusInfo)
				  .HasForeignKey<PanelStatusInfo>(d => new { d.JobId, d.PanelId })
				  .HasConstraintName("FK_PanelStatusInfo_Panels");
	  });

	  modelBuilder.Entity<Panels>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.PanelId });

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.PanelId).HasColumnName("PanelID");

		entity.Property(e => e.Ipaddress)
				  .IsRequired()
				  .HasColumnName("IPAddress")
				  .HasMaxLength(40)
				  .IsUnicode(false)
				  .HasDefaultValueSql("('0.0.0.0')");

		entity.Property(e => e.Macaddress)
				  .IsRequired()
				  .HasColumnName("MACAddress")
				  .HasMaxLength(40)
				  .IsUnicode(false)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.MasterNode).HasDefaultValueSql("((-1))");

		entity.Property(e => e.Name)
				  .IsRequired()
				  .HasMaxLength(20);

		entity.Property(e => e.NetworkId).HasColumnName("NetworkID");

		entity.Property(e => e.PanelGuid)
				  .HasColumnName("PanelGUID")
				  .HasDefaultValueSql("(newid())");

		entity.Property(e => e.RowVersion).IsRowVersion();

		entity.HasOne(d => d.Job)
				  .WithMany(p => p.Panels)
				  .HasForeignKey(d => d.JobId)
				  .OnDelete(DeleteBehavior.ClientSetNull)
				  .HasConstraintName("FK_Panels_Jobs");
	  });

	  modelBuilder.Entity<Passcodes>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.PanelId, e.PasscodeLevel });

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.PanelId).HasColumnName("PanelID");

		entity.Property(e => e.RowVersion).IsRowVersion();

		entity.HasOne(d => d.Panels)
				  .WithMany(p => p.Passcodes)
				  .HasForeignKey(d => new { d.JobId, d.PanelId })
				  .HasConstraintName("FK_Passcodes_Panels");
	  });

	  modelBuilder.Entity<Periods>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.PanelId, e.ScheduleId, e.PeriodId });

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.PanelId).HasColumnName("PanelID");

		entity.Property(e => e.ScheduleId).HasColumnName("ScheduleID");

		entity.Property(e => e.PeriodId).HasColumnName("PeriodID");

		entity.Property(e => e.EndTime).HasColumnType("smalldatetime");

		entity.Property(e => e.RowVersion).IsRowVersion();

		entity.Property(e => e.StartTime).HasColumnType("smalldatetime");

		entity.HasOne(d => d.Schedules)
				  .WithMany(p => p.Periods)
				  .HasForeignKey(d => new { d.JobId, d.PanelId, d.ScheduleId })
				  .HasConstraintName("FK_Periods_Schedules");
	  });

	  modelBuilder.Entity<PhoneLines>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.PanelId, e.PhoneLineNo })
				  .HasName("PK_PhoneLines_1");

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.PanelId).HasColumnName("PanelID");

		entity.Property(e => e.RowVersion).IsRowVersion();

		entity.HasOne(d => d.TasLobbyPanels)
				  .WithMany(p => p.PhoneLines)
				  .HasForeignKey(d => new { d.JobId, d.PanelId })
				  .HasConstraintName("FK_PhoneLines_TAS Lobby Panels");
	  });

	  modelBuilder.Entity<Preferences>(entity =>
	  {
		entity.HasKey(e => e.PrefGuid);

		entity.Property(e => e.PrefGuid)
				  .HasColumnName("PrefGUID")
				  .HasDefaultValueSql("(newid())");

		entity.Property(e => e.LanguageTextId)
				  .HasColumnName("LanguageTextID")
				  .HasMaxLength(10);

		entity.Property(e => e.MainThemeColor).HasMaxLength(50);

		entity.Property(e => e.UserId).HasColumnName("UserID");
	  });

	  modelBuilder.Entity<Profiles>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.ProfileId })
				  .HasName("PK_CardHolders");

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.ProfileId).HasColumnName("ProfileID");

		entity.Property(e => e.Address).HasMaxLength(100);

		entity.Property(e => e.AptNo).HasMaxLength(10);

		entity.Property(e => e.CellPhone).HasMaxLength(20);

		entity.Property(e => e.City).HasMaxLength(50);

		entity.Property(e => e.Country).HasMaxLength(50);

		entity.Property(e => e.Department).HasMaxLength(50);

		entity.Property(e => e.Email).HasMaxLength(50);

		entity.Property(e => e.FirstName).HasMaxLength(50);

		entity.Property(e => e.HomePhone).HasMaxLength(20);

		entity.Property(e => e.LastName).HasMaxLength(50);

		entity.Property(e => e.Notes).HasMaxLength(400);

		entity.Property(e => e.Photo).HasColumnType("image");

		entity.Property(e => e.RowVersion).IsRowVersion();

		entity.Property(e => e.StateProvince).HasMaxLength(50);

		entity.Property(e => e.WorkPhone).HasMaxLength(20);

		entity.Property(e => e.ZipPostal).HasMaxLength(10);

		entity.HasOne(d => d.Job)
				  .WithMany(p => p.Profiles)
				  .HasForeignKey(d => d.JobId)
				  .HasConstraintName("FK_CardHolders_Jobs");
	  });

	  modelBuilder.Entity<Profiles>()
		  .HasMany(e => e.CardProfileCorrs)
		  .WithOne(e => e.Profile)
		  .IsRequired()
		  .HasForeignKey(e => new { e.JobID, e.ProfileID })
		  .OnDelete(DeleteBehavior.Cascade);

	  modelBuilder.Entity<Reports>(entity =>
	  {
		entity.HasKey(e => e.ReportId);

		entity.Property(e => e.ReportId)
				  .HasColumnName("ReportID")
				  .ValueGeneratedNever();

		entity.Property(e => e.Columns).HasDefaultValueSql("((1))");

		entity.Property(e => e.CustomTimeBegin).HasColumnType("datetime");

		entity.Property(e => e.CustomTimeEnd).HasColumnType("datetime");

		entity.Property(e => e.FilterCol1)
				  .IsRequired()
				  .HasMaxLength(50)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.FilterCol1Value)
				  .IsRequired()
				  .HasMaxLength(100)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.FilterCol2)
				  .IsRequired()
				  .HasMaxLength(50)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.FilterCol2Value)
				  .IsRequired()
				  .HasMaxLength(100)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.FilterCol3)
				  .IsRequired()
				  .HasMaxLength(50)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.FilterCol3Value)
				  .IsRequired()
				  .HasMaxLength(100)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.FilterCol4)
				  .IsRequired()
				  .HasMaxLength(50)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.FilterCol4Value)
				  .IsRequired()
				  .HasMaxLength(100)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.JobGuid).HasColumnName("JobGUID");

		entity.Property(e => e.PanelGuid).HasColumnName("PanelGUID");

		entity.Property(e => e.PanelItemId)
				  .HasColumnName("PanelItemID")
				  .HasDefaultValueSql("((0))");

		entity.Property(e => e.ReportGuid)
				  .HasColumnName("ReportGUID")
				  .HasDefaultValueSql("(newid())");

		entity.Property(e => e.SortCol1)
				  .IsRequired()
				  .HasMaxLength(50)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.SortCol2)
				  .IsRequired()
				  .HasMaxLength(50)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.Title)
				  .IsRequired()
				  .HasMaxLength(100)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.UserId).HasColumnName("UserID");

		entity.HasOne(d => d.User)
				  .WithMany(p => p.Reports)
				  .HasForeignKey(d => d.UserId)
				  .OnDelete(DeleteBehavior.Cascade)
				  .HasConstraintName("FK_Reports_Users");
	  });

	  modelBuilder.Entity<ResProfileCorr>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.ResidentId })
				  .HasName("PK_ResProfileCorr_1");

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.ResidentId).HasColumnName("ResidentID");

		entity.Property(e => e.ProfileId).HasColumnName("ProfileID");

		entity.Property(e => e.RowVersion).IsRowVersion();

		entity.HasOne(d => d.Profiles)
				  .WithMany(p => p.ResProfileCorr)
				  .HasForeignKey(d => new { d.JobId, d.ProfileId })
				  .OnDelete(DeleteBehavior.ClientSetNull)
				  .HasConstraintName("FK_ResProfileCorr_Profiles");

		entity.HasOne(d => d.Residents)
				  .WithOne(p => p.ResProfileCorr)
				  .HasForeignKey<ResProfileCorr>(d => new { d.JobId, d.ResidentId })
				  .HasConstraintName("FK_ResProfileCorr_Residents");
	  });

	  modelBuilder.Entity<ResidentElevatorLinks>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.ResidentId, e.LinkId });

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.ResidentId).HasColumnName("ResidentID");

		entity.Property(e => e.LinkId).HasColumnName("LinkID");

		entity.Property(e => e.PanelId).HasColumnName("PanelID");

		entity.HasOne(d => d.Residents)
				  .WithMany(p => p.ResidentElevatorLinks)
				  .HasForeignKey(d => new { d.JobId, d.ResidentId })
				  .HasConstraintName("FK_ResidentElevatorLinks_Residents");
	  });

	  modelBuilder.Entity<Residents>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.ResidentId });

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.ResidentId).HasColumnName("ResidentID");

		entity.Property(e => e.AptNum)
				  .IsRequired()
				  .HasMaxLength(8);

		entity.Property(e => e.ElevatorGroupId)
				  .HasColumnName("ElevatorGroupID")
				  .HasDefaultValueSql("((-1))");

		entity.Property(e => e.Name)
				  .IsRequired()
				  .HasMaxLength(60);

		entity.Property(e => e.PanelId).HasColumnName("PanelID");

		entity.Property(e => e.RowVersion).IsRowVersion();

		entity.Property(e => e.SipuserId)
				  .IsRequired()
				  .HasColumnName("SIPUserID")
				  .HasMaxLength(30)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.Telephone)
				  .IsRequired()
				  .HasMaxLength(20);

		entity.HasOne(d => d.Job)
				  .WithMany(p => p.Residents)
				  .HasForeignKey(d => d.JobId)
				  .HasConstraintName("FK_Residents_Jobs");
	  });

	  modelBuilder.Entity<ResidentsLineCorr>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.ResidentId, e.PanelId, e.PhoneLineNo });

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.ResidentId).HasColumnName("ResidentID");

		entity.Property(e => e.PanelId).HasColumnName("PanelID");

		entity.Property(e => e.RowVersion).IsRowVersion();

		entity.HasOne(d => d.Residents)
				  .WithMany(p => p.ResidentsLineCorr)
				  .HasForeignKey(d => new { d.JobId, d.ResidentId })
				  .HasConstraintName("FK_ResidentsLineCorr_Residents");

		entity.HasOne(d => d.PhoneLines)
				  .WithMany(p => p.ResidentsLineCorr)
				  .HasForeignKey(d => new { d.JobId, d.PanelId, d.PhoneLineNo })
				  .HasConstraintName("FK_ResidentsLineCorr_PhoneLines");
	  });

	  modelBuilder.Entity<Schedules>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.PanelId, e.ScheduleId });

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.PanelId).HasColumnName("PanelID");

		entity.Property(e => e.ScheduleId).HasColumnName("ScheduleID");

		entity.Property(e => e.Name)
				  .IsRequired()
				  .HasMaxLength(40);

		entity.Property(e => e.RowVersion).IsRowVersion();

		entity.HasOne(d => d.Job)
				  .WithMany(p => p.Schedules)
				  .HasForeignKey(d => d.JobId)
				  .HasConstraintName("FK_Schedules_Jobs");
	  });

	  modelBuilder.Entity<Sipadmin>(entity =>
	  {
		entity.HasKey(e => e.JobId)
				  .HasName("PK__SIPAdmin__5808BFC4");

		entity.ToTable("SIPAdmin");

		entity.Property(e => e.JobId)
				  .HasColumnName("JobID")
				  .ValueGeneratedNever();

		entity.Property(e => e.AdminUserName)
				  .IsRequired()
				  .HasMaxLength(50)
				  .IsUnicode(false);

		entity.Property(e => e.Apiendpoint)
				  .IsRequired()
				  .HasColumnName("APIEndpoint")
				  .HasMaxLength(100)
				  .IsUnicode(false);

		entity.Property(e => e.Password)
				  .IsRequired()
				  .HasMaxLength(50)
				  .IsUnicode(false);
	  });

	  modelBuilder.Entity<TasLobbyPanels>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.PanelId });

		entity.ToTable("TAS Lobby Panels");

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.PanelId).HasColumnName("PanelID");

		entity.Property(e => e.AutoUnlockSchedule).HasDefaultValueSql("((1))");

		entity.Property(e => e.AuxDoorOpenDigit)
				  .IsRequired()
				  .HasMaxLength(1)
				  .HasDefaultValueSql("((0))");

		entity.Property(e => e.CallWaitingDigit)
				  .IsRequired()
				  .HasMaxLength(1);

		entity.Property(e => e.Dtmfrxgain)
				  .HasColumnName("DTMFRXGain")
				  .HasDefaultValueSql("((2048))");

		entity.Property(e => e.ElevRestrictionTimer).HasDefaultValueSql("((60))");

		entity.Property(e => e.MainDoorOpenDigit)
				  .IsRequired()
				  .HasMaxLength(1)
				  .HasDefaultValueSql("((0))");

		entity.Property(e => e.MicVolume).HasDefaultValueSql("((5))");

		entity.Property(e => e.PostalLockUsage).HasDefaultValueSql("((255))");

		entity.Property(e => e.RowVersion).IsRowVersion();

		entity.Property(e => e.SpeakerVolume).HasDefaultValueSql("((11))");

		entity.Property(e => e.VoiceHelp)
				  .IsRequired()
				  .HasDefaultValueSql("((1))");

		entity.HasOne(d => d.Panels)
				  .WithOne(p => p.TasLobbyPanels)
				  .HasForeignKey<TasLobbyPanels>(d => new { d.JobId, d.PanelId })
				  .HasConstraintName("FK_TAS Lobby Panels_Panels");
	  });

	  modelBuilder.Entity<TouchAdvertisePlaylist>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.PanelId, e.VideoId, e.PlaylistId, e.DayofWeek, e.TimeofDay });

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.PanelId).HasColumnName("PanelID");

		entity.Property(e => e.VideoId).HasColumnName("VideoID");

		entity.Property(e => e.PlaylistId).HasColumnName("PlaylistID");

		entity.Property(e => e.RowVersion).IsRowVersion();

		entity.HasOne(d => d.TouchAdvertising)
				  .WithMany(p => p.TouchAdvertisePlaylist)
				  .HasForeignKey(d => new { d.JobId, d.PanelId, d.VideoId })
				  .HasConstraintName("FK_TouchAdvertisePlaylist_TouchAdvertising");
	  });

	  modelBuilder.Entity<TouchAdvertiseRecords>(entity =>
	  {
		entity.HasKey(e => new { e.RecordId, e.JobId });

		entity.Property(e => e.RecordId).HasColumnName("RecordID");

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.PanelId)
				  .HasColumnName("PanelID")
				  .HasDefaultValueSql("((1))");

		entity.Property(e => e.RowVersion).IsRowVersion();

		entity.Property(e => e.StartDateTime).HasColumnType("smalldatetime");

		entity.Property(e => e.VideoId).HasColumnName("VideoID");

		entity.HasOne(d => d.Panels)
				  .WithMany(p => p.TouchAdvertiseRecords)
				  .HasForeignKey(d => new { d.JobId, d.PanelId })
				  .HasConstraintName("FK_TouchAdvertiseRecords_Panels");
	  });

	  modelBuilder.Entity<TouchAdvertising>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.PanelId, e.VideoId });

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.PanelId).HasColumnName("PanelID");

		entity.Property(e => e.VideoId).HasColumnName("VideoID");

		entity.Property(e => e.EndDate).HasColumnType("smalldatetime");

		entity.Property(e => e.FileId).HasColumnName("FileID");

		entity.Property(e => e.Filename)
				  .IsRequired()
				  .HasMaxLength(500);

		entity.Property(e => e.RowVersion).IsRowVersion();

		entity.Property(e => e.StartDate).HasColumnType("smalldatetime");

		entity.Property(e => e.Volume).HasDefaultValueSql("((50))");

		entity.HasOne(d => d.Panels)
				  .WithMany(p => p.TouchAdvertising)
				  .HasForeignKey(d => new { d.JobId, d.PanelId })
				  .HasConstraintName("FK_TouchAdvertising_Panels");
	  });

	  modelBuilder.Entity<TouchConfig>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.PanelId });

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.PanelId).HasColumnName("PanelID");

		entity.Property(e => e.AdminPassword)
				  .HasMaxLength(20)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.AutoHalfDuplex)
				  .IsRequired()
				  .HasDefaultValueSql("((1))");

		entity.Property(e => e.BackgroundMusicVolume).HasDefaultValueSql("((100))");

		entity.Property(e => e.BottomFlashFileId).HasColumnName("BottomFlashFileID");

		entity.Property(e => e.BottomFlashUrl)
				  .HasColumnName("BottomFlashURL")
				  .HasMaxLength(300);

		entity.Property(e => e.BottomVideoVolume).HasDefaultValueSql("((50))");

		entity.Property(e => e.ButtonPressVolume).HasDefaultValueSql("((100))");

		entity.Property(e => e.CloudDisplayName)
				  .IsRequired()
				  .HasMaxLength(20)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.CloudJobGuid).HasColumnName("CloudJobGUID");

		entity.Property(e => e.CloudKeepSignIn)
				  .IsRequired()
				  .HasDefaultValueSql("((1))");

		entity.Property(e => e.CloudPassword)
				  .IsRequired()
				  .HasMaxLength(20)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.CloudServer1)
				  .IsRequired()
				  .HasMaxLength(50)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.CloudServer2)
				  .IsRequired()
				  .HasMaxLength(50)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.CloudUsername)
				  .IsRequired()
				  .HasMaxLength(20)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.Contrast).HasDefaultValueSql("((50))");

		entity.Property(e => e.EmailMaxVoiceTime).HasDefaultValueSql("((15))");

		entity.Property(e => e.EmailSenderAddress)
				  .IsRequired()
				  .HasMaxLength(100);

		entity.Property(e => e.EmailSmtpserver)
				  .IsRequired()
				  .HasColumnName("EmailSMTPServer")
				  .HasMaxLength(100);

		entity.Property(e => e.EmailUserName)
				  .IsRequired()
				  .HasMaxLength(30);

		entity.Property(e => e.EmailUserPassword)
				  .IsRequired()
				  .HasMaxLength(20);

		entity.Property(e => e.EventVolume).HasDefaultValueSql("((50))");

		entity.Property(e => e.HelpVideoFileId).HasColumnName("HelpVideoFileID");

		entity.Property(e => e.HelpVideoUrl)
				  .HasColumnName("HelpVideoURL")
				  .HasMaxLength(300);

		entity.Property(e => e.HelpVideoVolume).HasDefaultValueSql("((50))");

		entity.Property(e => e.Ipcorrelations).HasColumnName("IPCorrelations");

		entity.Property(e => e.LayoutId)
				  .HasColumnName("LayoutID")
				  .HasDefaultValueSql("((1))");

		entity.Property(e => e.LogoUrl)
				  .HasColumnName("LogoURL")
				  .HasMaxLength(300);

		entity.Property(e => e.MainVideoFileId).HasColumnName("MainVideoFileID");

		entity.Property(e => e.MainVideoUrl)
				  .HasColumnName("MainVideoURL")
				  .HasMaxLength(300);

		entity.Property(e => e.MainVideoVolume).HasDefaultValueSql("((50))");

		entity.Property(e => e.MediaVolume).HasDefaultValueSql("((50))");

		entity.Property(e => e.PanelAddress).HasDefaultValueSql("((1))");

		entity.Property(e => e.RowVersion).IsRowVersion();

		entity.Property(e => e.SaverVideoVolume).HasDefaultValueSql("((50))");

		entity.Property(e => e.ScreenSaverFileId).HasColumnName("ScreenSaverFileID");

		entity.Property(e => e.ScreenSaverTimeout).HasDefaultValueSql("((60))");

		entity.Property(e => e.ScreenSaverUrl)
				  .HasColumnName("ScreenSaverURL")
				  .HasMaxLength(300);

		entity.Property(e => e.ShowBottomFlash)
				  .IsRequired()
				  .HasDefaultValueSql("((1))");

		entity.Property(e => e.ShowClock)
				  .IsRequired()
				  .HasDefaultValueSql("((1))");

		entity.Property(e => e.ShowDate)
				  .IsRequired()
				  .HasDefaultValueSql("((1))");

		entity.Property(e => e.ShowHelpVideo)
				  .IsRequired()
				  .HasDefaultValueSql("((1))");

		entity.Property(e => e.ShowMainVideo)
				  .IsRequired()
				  .HasDefaultValueSql("((1))");

		entity.Property(e => e.ShowTopFlash)
				  .IsRequired()
				  .HasDefaultValueSql("((1))");

		entity.Property(e => e.SipauthId)
				  .IsRequired()
				  .HasColumnName("SIPAuthID")
				  .HasMaxLength(20)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.Sipcompatability)
				  .HasColumnName("SIPCompatability")
				  .HasDefaultValueSql("((3))");

		entity.Property(e => e.Sipdisplayname)
				  .IsRequired()
				  .HasColumnName("SIPDisplayname")
				  .HasMaxLength(20)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.Sippassword)
				  .IsRequired()
				  .HasColumnName("SIPPassword")
				  .HasMaxLength(50)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.SipproxyServer)
				  .IsRequired()
				  .HasColumnName("SIPProxyServer")
				  .HasMaxLength(50)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.Sipserver)
				  .IsRequired()
				  .HasColumnName("SIPServer")
				  .HasMaxLength(50)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.SipuserId)
				  .IsRequired()
				  .HasColumnName("SIPUserID")
				  .HasMaxLength(20)
				  .HasDefaultValueSql("('')");

		entity.Property(e => e.SpeakerVolume).HasDefaultValueSql("((50))");

		entity.Property(e => e.ThemeId)
				  .HasColumnName("ThemeID")
				  .HasDefaultValueSql("((1))");

		entity.Property(e => e.TopBannerTitle).HasMaxLength(100);

		entity.Property(e => e.TopFlashFileId).HasColumnName("TopFlashFileID");

		entity.Property(e => e.TopFlashUrl)
				  .HasColumnName("TopFlashURL")
				  .HasMaxLength(300);

		entity.Property(e => e.VoicePrompt)
				  .IsRequired()
				  .HasDefaultValueSql("((1))");

		entity.HasOne(d => d.Panels)
				  .WithOne(p => p.TouchConfig)
				  .HasForeignKey<TouchConfig>(d => new { d.JobId, d.PanelId })
				  .HasConstraintName("FK_TouchConfig_Panels");
	  });

	  modelBuilder.Entity<TouchGuiobjects>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.PanelId, e.ObjectId });

		entity.ToTable("TouchGUIObjects");

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.PanelId).HasColumnName("PanelID");

		entity.Property(e => e.ObjectId).HasColumnName("ObjectID");

		entity.Property(e => e.Data1)
				  .IsRequired()
				  .HasMaxLength(50)
				  .IsUnicode(false)
				  .HasDefaultValueSql("('(\"\")')");

		entity.Property(e => e.LangItemId).HasColumnName("LangItemID");

		entity.Property(e => e.ObjectName)
				  .IsRequired()
				  .HasMaxLength(50)
				  .IsUnicode(false)
				  .HasDefaultValueSql("('(\"\")')");

		entity.Property(e => e.RowVersion).IsRowVersion();

		entity.HasOne(d => d.Panels)
				  .WithMany(p => p.TouchGuiobjects)
				  .HasForeignKey(d => new { d.JobId, d.PanelId })
				  .HasConstraintName("FK_TouchGUIObjects_Panels");
	  });

	  modelBuilder.Entity<TouchResidentGroups>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.PanelId, e.GroupId });

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.PanelId).HasColumnName("PanelID");

		entity.Property(e => e.GroupId).HasColumnName("GroupID");

		entity.Property(e => e.FileId).HasColumnName("FileID");

		entity.Property(e => e.Filename).HasMaxLength(255);

		entity.Property(e => e.Name).HasMaxLength(50);

		entity.Property(e => e.RowVersion).IsRowVersion();

		entity.HasOne(d => d.Panels)
				  .WithMany(p => p.TouchResidentGroups)
				  .HasForeignKey(d => new { d.JobId, d.PanelId })
				  .HasConstraintName("FK_TouchResidentGroups_Panels");
	  });

	  modelBuilder.Entity<TouchThemes>(entity =>
	  {
		entity.HasKey(e => new { e.JobId, e.ThemeId, e.PropId, e.PanelId });

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.ThemeId).HasColumnName("ThemeID");

		entity.Property(e => e.PropId).HasColumnName("PropID");

		entity.Property(e => e.PanelId)
				  .HasColumnName("PanelID")
				  .HasDefaultValueSql("((1))");

		entity.Property(e => e.PropValue)
				  .HasMaxLength(80)
				  .IsUnicode(false);

		entity.Property(e => e.RowVersion).IsRowVersion();

		entity.Property(e => e.Visible)
				  .IsRequired()
				  .HasDefaultValueSql("((1))");

		entity.HasOne(d => d.Panels)
				  .WithMany(p => p.TouchThemes)
				  .HasForeignKey(d => new { d.JobId, d.PanelId })
				  .HasConstraintName("FK_TouchThemes_Panels");
	  });

	  modelBuilder.Entity<UserJobCorr>(entity =>
	  {
		entity.HasKey(e => new { e.UserId, e.JobId });

		entity.Property(e => e.UserId).HasColumnName("UserID");

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.HasOne(d => d.Job)
				  .WithMany(p => p.UserJobCorr)
				  .HasForeignKey(d => d.JobId)
				  .HasConstraintName("FK_UserJobCorr_Jobs");
	  });

	  modelBuilder.Entity<Users>(entity =>
	  {
		entity.HasKey(e => e.UserId)
				  .HasName("PK_Users_1");

		entity.Property(e => e.UserId).HasColumnName("UserID");

		entity.Property(e => e.Active).HasDefaultValueSql("((1))");

		entity.Property(e => e.Name)
				  .IsRequired()
				  .HasMaxLength(20);

		entity.Property(e => e.Password)
				  .IsRequired()
				  .HasMaxLength(20);

		entity.Property(e => e.UserGuid)
				  .HasColumnName("UserGUID")
				  .HasDefaultValueSql("(newid())");
	  });

	  modelBuilder.Entity<Widgets>(entity =>
	  {
		entity.HasKey(e => e.WidgetGuid);

		entity.Property(e => e.WidgetGuid)
				  .HasColumnName("WidgetGUID")
				  .HasDefaultValueSql("(newid())");

		entity.Property(e => e.ComponentGuid).HasColumnName("ComponentGUID");

		entity.Property(e => e.JobGuid).HasColumnName("JobGUID");

		entity.Property(e => e.JobId).HasColumnName("JobID");

		entity.Property(e => e.Label).HasMaxLength(100);

		entity.Property(e => e.OptionText).HasMaxLength(200);

		entity.Property(e => e.UserId).HasColumnName("UserID");

		entity.HasOne(d => d.Job)
				  .WithMany(p => p.Widgets)
				  .HasForeignKey(d => d.JobId)
				  .OnDelete(DeleteBehavior.Cascade)
				  .HasConstraintName("FK_Widgets_Jobs");
	  });
	}
  }
}
