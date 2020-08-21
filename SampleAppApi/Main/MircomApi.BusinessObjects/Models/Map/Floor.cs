// <copyright file="Floor.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using System;
using static MircomApi.BusinessObjects.Helpers.ActionEnums;

namespace MircomApi.BusinessObjects.Models.Map
{
  /// <summary>
  /// Floor used for Map models
  /// </summary>
  public class Floor
  {
	#region Public Properties
	
	/// <summary>
	/// Name indicating the floor name
	/// </summary>
	public string Name { get; set; }

	/// <summary>
	/// Description indicating a small description for the floor
	/// </summary>
	public string Description { get; set; }

	/// <summary>
	/// SlotNo.
	/// </summary>
	public int SlotNo { get; set; }

	/// <summary>
	/// A nullable MapGuid.
	/// </summary>
	public Guid? MapGuid { get; set; }

	/// <summary>
	/// A MapId
	/// </summary>
	public int MapId { get; set; }

	/// <summary>
	///  Field storing the image of the floor.
	/// </summary>
	public string Image { get; set; }

	/// <summary>
	/// An enum specifying what action is to be taken.
	/// This enum is being used on the EditBuilding section
	/// Action indicates if floor is being edited, added or deleted.
	/// </summary>
	public int Action { get; set; }
	#endregion
  }
}
