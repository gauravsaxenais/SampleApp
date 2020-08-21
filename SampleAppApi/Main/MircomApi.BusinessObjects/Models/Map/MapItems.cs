// <copyright file="MapItems.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using System;

namespace MircomApi.BusinessObjects.Models.Map
{
  /// <summary>
  /// Map Items used in Map models
  /// </summary>
  public class MapItems
  {
	#region Public Properties
	
	/// <summary>
	/// SiteId.
	/// </summary>
	public int SiteId { get; set; }

	/// <summary>
	/// MapId.
	/// </summary>
	public int MapId { get; set; }

	/// <summary>
	/// MapItemId.
	/// </summary>
	public int MapItemId { get; set; }

	/// <summary>
	/// ItemId.
	/// </summary>
	public int ItemId { get; set; }

	/// <summary>
	/// A nullable ItemGuid.
	/// </summary>
	public Guid? ItemGuid { get; set; }

	/// <summary>
	/// A nullable PanelGuid.
	/// </summary>
	public Guid? PanelGuid { get; set; }

	/// <summary>
	/// Name identifier for the MapItems.
	/// </summary>
	public string Name { get; set; }
	
	/// <summary>
	/// Notes for the MapItems
	/// </summary>
	public string Notes { get; set; }

	/// <summary>
	/// Type of MapItem
	/// </summary>
	public string Type { get; set; }

	/// <summary>
	/// X coordinate of MapItem
	/// </summary>
	public int X { get; set; }

	/// <summary>
	/// YCoordinate of MapItem.
	/// </summary>
	public int Y { get; set; }

	/// <summary>
	/// A nullable buildingid.
	/// </summary>
	public int? BuildingId { get; set; }
	#endregion
  }
}
