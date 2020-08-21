// <copyright file="BuildingMapModel.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using System;
using System.Collections.Generic;

namespace MircomApi.BusinessObjects.Models.Map
{
  /// <summary>
  /// Building map model
  /// </summary>
  public class BuildingMapModel
  {
	#region Public Properties

	/// <summary>
	/// The buildingid of a building.
	/// </summary>
	public int BuildingId { get; set; }

	/// <summary>
	/// A nullable guid for a building.
	/// </summary>
	public Guid? BuildingGuid { get; set; }

	/// <summary>
	/// Siteid where the building is located. In database, its JobId.
	/// </summary>
	public int SiteId { get; set; }

	/// <summary>
	/// Name.
	/// </summary>
	public string Name { get; set; }

	/// <summary>
	/// The number field
	/// </summary>
	public int Number { get; set; }

	/// <summary>
	/// Slots
	/// </summary>
	public int Slots { get; set; }

	/// <summary>
	/// Type.
	/// </summary>
	public string Type { get; set; }

	/// <summary>
	/// Floor stack file.
	/// </summary>
	public string FloorStackFile { get; set; }

	/// <summary>
	/// Showcase file.
	/// </summary>
	public string ShowcaseFile { get; set; }

	/// <summary>
	/// List of floors.
	/// </summary>
	public IEnumerable<Floor> Floors { get; set; }

	public int Action { get; set; }
	#endregion
  }
}
