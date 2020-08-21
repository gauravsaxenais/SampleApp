// <copyright file="MapObjectStatusModel.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using System;

namespace MircomApi.BusinessObjects.Models.ObjectStatus
{
  /// <summary>
  /// Object Status Model
  /// </summary>
  public class ObjectStatusModel
  {
	/// <summary>
	/// Timestamp of the event in UTC
	/// </summary>
	public DateTime? UTCTimeStamp { get; set; }

	/// <summary>
	/// One of access point, map, mapItem, panel
	/// enum [AccessPoint, Input, Output, Camera, Building, Map]
	/// </summary>
	public string ObjectType { get; set; }

	/// <summary>
	///  ID of the object that its status has changed. For access point, it is {Panel GUID}{AccessPointID}.
	/// For map, it is the MapGUID. For mapItem, it is the {MapGUID}{MapItemID}. For panel, it is the PanelGUID
	/// </summary>
	public string ObjectId { get; set; }

	/// <summary>
	/// For AccessPoint: { offline/online/trouble/alarm, description, IsOpen, IsLocked }
	/// For Map: { offline/online/trouble/alarm, description, StatusData }
	/// For MapItem: { offline/online/trouble/alarm, description, StatusData }
	/// For Panel : { offline/online/trouble/alarm, description, StatusData }
	/// </summary>
	public int Status { get; set; }

	/// <summary>
	/// Description of object status.
	/// </summary>
	public string Description { get; set; }

	/// <summary>
	/// Data1 variable.
	/// </summary>
	public int Data1 { get; set; }

	/// <summary>
	/// Data2 variable.
	/// </summary>
	public int Data2 { get; set; }
  } 
}
