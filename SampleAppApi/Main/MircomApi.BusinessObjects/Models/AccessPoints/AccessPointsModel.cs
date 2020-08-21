// <copyright file="AccessPoints.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using System;

namespace MircomApi.BusinessObjects.Models.AccessPointsModel
{
  /// <summary>
  /// Access point model 
  /// </summary>
  public class AccessPointsModel
  {
	#region Public Properties
	/// <summary>
	/// It contains access point Id.
	/// </summary>
	public int AccesspointId { get; set; }
	/// <summary>
	///It contains siteId.
	/// </summary>
	public int SiteId { get; set; }
	/// <summary>
	/// It contains panel guid.
	/// </summary>
	public Guid? PanelGuid { get; set; }
	/// <summary>
	/// It contains map guid.
	/// </summary>
	public Guid MapGuid { get; set; }
	/// <summary>
	/// It contains channel guid.
	/// </summary>
	public Guid ChannelGuid { get; set; }
	/// <summary>
	/// It contains name.
	/// </summary>
	public string Name { get; set; }
	#endregion
  }
}
