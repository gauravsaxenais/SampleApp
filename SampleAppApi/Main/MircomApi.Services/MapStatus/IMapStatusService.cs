// <copyright file="IMapStatusService.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using System;
using System.Collections.Generic;
using MircomApi.BusinessObjects.Models.ObjectStatus;

namespace MircomApi.Services
{
  /// <summary>
  /// Status Service Contract
  /// </summary>
  public interface IMapStatusService
  {
	#region Public Methods
	/// <summary>
	/// Get Map Status
	/// </summary>
	/// <param name="siteId">Site/Job Id</param>
	/// <param name="mapGuid">Map GUId</param>
	/// <returns>Map Object Status</returns>
	List<ObjectStatusModel> GetMapStatus(int siteId, Guid mapGuid);
	/// <summary>
	/// Get Building Status
	/// </summary>
	/// <param name="siteId">Site/Job Id</param>
	/// <param name="buildingId">Building Id</param>
	/// <returns>Building object status</returns>
	List<ObjectStatusModel> GetBuildingStatus(int siteId, int buildingId);
	#endregion
  }
}
