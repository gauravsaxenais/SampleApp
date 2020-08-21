// <copyright file="IAccessPointsService.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using MircomApi.BusinessObjects.Models.AccessPointsModel;
using System.Collections.Generic;

/// <summary>
/// Access point service contract class
/// </summary>
namespace MircomApi.Services.AccessPoint
{
  /// <summary>
  /// Contract for Access point sercvice
  /// </summary>
  public interface IAccessPointsService
  {
	#region Public Methods
	/// <summary>
	/// Building Map Contract
	/// </summary>
	/// <param name="siteId">Site Id</param>
	/// <returns>Building Map</returns>
	List<AccessPointsModel> GetListAccessPoints(int siteId);
	#endregion
  }
}
