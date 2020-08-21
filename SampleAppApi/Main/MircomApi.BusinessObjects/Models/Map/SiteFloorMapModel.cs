// <copyright file="SiteFloorMapModel.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using System;
using System.Collections.Generic;

namespace MircomApi.BusinessObjects.Models.Map
{
  /// <summary>
  /// Site and Floor Map Model
  /// </summary>
  public class SiteFloorMapModel
  {
	#region Public Properties

	/// <summary>
	/// Id of the SiteFloorMapModel
	/// </summary>
	public int Id { get; set; }

	/// <summary>
	/// SiteId of the SiteFloorMapModel.
	/// </summary>
	public int SiteId { get; set; }

	/// <summary>
	/// MapGuid of the SiteFloorMapModel.
	/// </summary>
	public Guid MapGuid { get; set; }

	/// <summary>
	/// Title of the SiteFloorMapModel.
	/// </summary>
	public string Title { get; set; }

	/// <summary>
	/// Description of the SiteFloorMap.
	/// </summary>
	public string Description { get; set; }

	/// <summary>
	/// Field storing the image map.
	/// </summary>
	public string Image { get; set; }

	/// <summary>
	/// BuildingId of the SiteFloorMap.
	/// </summary>
	public int BuildingId { get; set; }

	/// <summary>
	/// MapItem field.
	/// </summary>
	public IEnumerable<MapItems> MapItem { get; set; }
	#endregion
  } 
}
