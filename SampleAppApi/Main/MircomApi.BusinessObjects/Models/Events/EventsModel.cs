// <copyright file="EventsModel.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using System;

namespace MircomApi.BusinessObjects.Models.Events
{
  /// <summary>
  /// Events data model
  /// </summary>
  public class EventsModel
  {
	#region Public Properties
	
	/// <summary>
	/// Event id
	/// </summary>
	public long EventId { get; set; }

	/// <summary>
	/// Event type
	/// </summary>
	public byte EventType { get; set; }

	/// <summary>
	/// Timestamp in UTC format.
	/// </summary>
	public DateTime UTCTimeStamp { get; set; }

	/// <summary>
	/// Description
	/// </summary>
	public string Description { get; set; }

	/// <summary>
	/// Panel name.
	/// </summary>
	public string PanelName { get; set; }

	/// <summary>
	/// Sitename
	/// </summary>
	public string SiteName { get; set; }

	/// <summary>
	/// Severity
	/// </summary>
	public int Severity { get; set; }

	/// <summary>
	/// A nullable MapGuid
	/// </summary>
	public Guid? MapGuid { get; set; }

	/// <summary>
	/// A nullable ChannelGuid
	/// </summary>
	public Guid? ChannelGuid { get; set; }

	/// <summary>
	/// A panelitemtype
	/// </summary>
	public byte PanelItemType { get; set; }

	/// <summary>
	/// PanelItemId
	/// </summary>
	public int PanelItemId { get; set; }

	/// <summary>
	/// LogType
	/// </summary>
	public int LogType { get; set; }

	/// <summary>
	/// Data field 1
	/// </summary>
	public int Data1 { get; set; }

	/// <summary>
	/// Data field 2
	/// </summary>
	public int Data2 { get; set; }

	/// <summary>
	/// Data field 3
	/// </summary>
	public int Data3 { get; set; }

	/// <summary>
	/// Data field 4
	/// </summary>
	public int Data4 { get; set; }
	#endregion
  }
}
