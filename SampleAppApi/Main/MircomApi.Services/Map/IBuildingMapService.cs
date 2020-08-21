// <copyright file="IBuildingMapService.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>
using MircomApi.BusinessObjects.Models.Map;
using System.Collections.Generic;

namespace MircomApi.Services.Map
{
  /// <summary>
  /// Building map service contract class
  /// </summary>
  public interface IBuildingMapService
  {
	#region Public Methods
	
	/// <summary>
	/// Building Map Contract
	/// </summary>
	/// <param name="siteId">Site Id</param>
	/// <param name="buildingId">Building Id</param>
	/// <returns>Building Map</returns>
	BuildingMapModel GetBuildingMap(int siteId, int buildingId);

	/// <summary>
	/// This method returns a list of buildings for
	/// a particular siteId.
	/// </summary>
	/// <param name="siteId">Site Id</param>
	/// <returns>List of buildings</returns>
	List<BuildingMapModel> GetBuildingListForSiteId(int siteId);

	bool UpdateExistingBuildings(List<BuildingMapModel> buildingList);

	void UpdateFloors(List<BuildingMapModel> buildingList);
	#endregion
  }
}
