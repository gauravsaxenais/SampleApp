// <copyright file="EventRequestModel.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using System;
using System.Collections.Generic;

namespace MircomApi.BusinessObjects.Models.Events
{
  /// <summary>
  /// EventRequestModel class.
  /// </summary>
  public class EventRequestModel
  {
	#region Public Properties
	/// <summary>
	/// Starttime of an event. This field is nullable.
	/// </summary>
	public DateTime? StartTime { get; set; }
	/// <summary>
	/// End time of an event. This field is nullable.
	/// </summary>
	public DateTime? EndTime { get; set; }
	/// <summary>
	/// Description of an event.
	/// </summary>
	public string Description { get; set; }
	/// <summary>
	/// Severity of an event.
	/// </summary>
	public List<string> Severity { get; set; }
	/// <summary>
	/// A list of SiteIds.
	/// </summary>
	public List<string> SiteIds { get; set; }
	/// <summary>
	/// Indicate the event is most recent.
	/// </summary>
	public int MostRecent { get; set; }
	#endregion
  }
}
