// <copyright file="ISiteFloorMapService.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using MircomApi.BusinessObjects.Models.Map;

namespace MircomApi.Services.Map
{
  /// <summary>
  /// Floor Map contract
  /// </summary>
  public interface ISiteFloorMapService
  {
	#region Public methods
	/// <summary>
	/// Get Site and Floor Map object
	/// </summary>
	/// <param name="siteId">Site Id</param>
	/// <param name="mapGuid">Map GUId</param>
	/// <returns></returns>
	SiteFloorMapModel GetSiteFloorMap(int siteId, System.Guid mapGuid);
	#endregion
  }
}
