// <copyright file="MapStatusService.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Logging;
using MircomApi.BusinessObjects.Models.ObjectStatus;
using MircomApi.DataAccess;
using MircomApi.Entities;
using MircomApi.Util.Helpers;

namespace MircomApi.Services.MapStatus
{
  /// <summary>
  /// Map status Service to get the status of Site, Building and floor
  /// </summary>
  public class MapStatusService : IMapStatusService
  {
	#region Private Member Variables
	private readonly GenericUnitOfWork<TASConfigDBContext> _unitOfWork;
	private readonly ILogger<MapStatusService> _logger;
	#endregion

	#region Constructors

	/// <summary>
	/// Initializes the dependencies of services
	/// </summary>
	/// <param name="unitOfWork">Unit of work for repository</param>
	/// <param name="logger">Logger for Logging information</param>
	public MapStatusService(GenericUnitOfWork<TASConfigDBContext> unitOfWork, ILogger<MapStatusService> logger)
	{
	  _unitOfWork = unitOfWork;
	  _logger = logger;
	}
	#endregion

	#region Public Methods

	/// <summary>
	/// Get Status of Building
	/// </summary>
	/// <param name="siteId">Site Id</param>
	/// <param name="buildingId">Building Id</param>
	/// <returns>List of Map object status</returns>
	public List<ObjectStatusModel> GetBuildingStatus(int siteId, int buildingId)
	{
	  var objectStatus = new List<ObjectStatusModel>();
	  string JobGUID = string.Empty;

	  try
	  {
		//Get map details using siteId and mapGuid
		JobGUID = _unitOfWork.Repository<Jobs>().Get(j => j.JobId == siteId).Result.FirstOrDefault()?.Guid.ToString();

		//Get object status record in the form of JobGUID_MapId
		var query = _unitOfWork.Repository<MapBuildingCorrs>()
				  .Get()
				  .Join(_unitOfWork.Repository<Maps>().Get(), mapCorrs => mapCorrs.MapGuid, map => map.MapGuid,
					  (mapCorrs, map) => new { mapCorrs, map })
				  .Where(@t => @t.map.JobId == siteId && @t.mapCorrs.BuildingId == buildingId)
				  .Select(@t => new string(JobGUID + '_' + @t.map.MapId)).ToList();

		if (query.NotNullAndEmpty())
		{
		  //Filter the object status table by the list prepared above and get the status object list
		  objectStatus = _unitOfWork.Repository<ObjectStatus>().Get(x => x.JobId == siteId && query.Contains(x.ObjectId, StringComparer.OrdinalIgnoreCase)).Result
					.Select(y => new ObjectStatusModel
					{
					  UTCTimeStamp = y.UtctimeStamp,
					  ObjectType = Enum.GetName(typeof(Enums.MapItemType), y.ObjectType),
					  ObjectId = y.ObjectId,
					  Status = y.Status,
					  Description = y.Description,
					  Data1 = y.StatusData1,
					  Data2 = y.StatusData2
					}).ToList();
		}
	  }
	  catch (Exception ex)
	  {
		objectStatus = null;
		_logger.LogError(ex, ex.Message);
	  }

	  return objectStatus;
	}

	/// <summary>
	/// Get Status of Site Map and Floor Map
	/// </summary>
	/// <param name="siteId">Site Id</param>
	/// <param name="mapGuid">Map Guid</param>
	/// <returns>List of Map object status</returns>
	public List<ObjectStatusModel> GetMapStatus(int siteId, Guid mapGuid)
	{
	  Maps map;
	  string JobGUID = string.Empty;
	  var mapItems = new List<string>();
	  const char delim = '_';
	  var objectStatus = new List<ObjectStatusModel>();
	  try
	  {
		//Get map details using siteId and mapGuid
		map = _unitOfWork.Repository<Maps>().Get(x => x.JobId == siteId && x.MapGuid == mapGuid).Result.FirstOrDefault();
		JobGUID = _unitOfWork.Repository<Jobs>().Get(J => J.JobId == siteId).Result.FirstOrDefault().Guid.ToString();

		if (map != null)
		{
		  //Get object status record in the form of JobGUID_MapId_MapItemId
		  mapItems = _unitOfWork.Repository<MapItems>().Get(x => x.JobId == siteId && x.MapId == map.MapId).Result
													  .Select(l => JobGUID + delim + map.MapId.ToString() + delim + l.MapItemId).ToList();

		  if (mapItems.NotNullAndEmpty())
		  {
			//Filter the object status table by the list prepared above and get the status object list
			objectStatus = _unitOfWork.Repository<ObjectStatus>().Get(x => x.JobId == siteId && mapItems.Contains(x.ObjectId, StringComparer.OrdinalIgnoreCase)).Result
					  .Select(y => new ObjectStatusModel
					  {
						UTCTimeStamp = y.UtctimeStamp,
						ObjectType = Enum.GetName(typeof(Enums.MapItemType), y.ObjectType),
						ObjectId = y.ObjectId,
						Status = y.Status,
						Description = y.Description,
						Data1 = y.StatusData1,
						Data2 = y.StatusData2 
					  }).ToList();
		  }
		}
	  }
	  catch (Exception ex)
	  {
		objectStatus = null;
		_logger.LogError(ex, ex.Message);
	  }

	  return objectStatus;
	}

	

	#endregion
  }
}
