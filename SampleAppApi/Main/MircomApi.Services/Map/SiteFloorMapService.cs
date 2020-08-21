// <copyright file="SiteFloorMapService.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using MircomApi.BusinessObjects.Models.Map;
using MircomApi.DataAccess;
using System.Linq;
using MircomApi.Entities;
using MircomApi.Util.Helpers;
using System;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using AutoMapper;

namespace MircomApi.Services.Map
{
  /// <summary>
  /// Floor Map Business Layer Service
  /// </summary>
  public class SiteFloorMapService : ISiteFloorMapService
  {
	#region Private Member Variables
	/// <summary>
	/// Unit of work
	/// </summary>
	private readonly GenericUnitOfWork<TASConfigDBContext> _unitOfWork;
	/// <summary>
	/// Logger
	/// </summary>
	private readonly ILogger<SiteFloorMapService> _logger;
	/// <summary>
	/// Mapper
	/// </summary>
	private readonly IMapper _mapper;
	#endregion

	#region Constructors

	/// <summary>
	/// Initializes the dependencies of services
	/// </summary>
	/// <param name="unitOfWork">unit of work for repository</param>
	/// <param name="logger">logger for Logging information</param>
	public SiteFloorMapService(GenericUnitOfWork<TASConfigDBContext> unitOfWork, ILogger<SiteFloorMapService> logger, IMapper mapper)
	{
	  _unitOfWork = unitOfWork;
	  _logger = logger;
	  _mapper = mapper;
	}

	#endregion

	#region Public Methods

	/// <summary>
	/// Get Site and Floor Map model data response.
	/// </summary>
	/// <param name="siteId">Site Id</param>
	/// <param name="mapGuid">Map GUID</param>
	/// <returns>Site and Floor Map model</returns>
	public SiteFloorMapModel GetSiteFloorMap(int siteId, Guid mapGuid)
	{
	  SiteFloorMapModel siteFloorMapModel = null;
	  try
	  {
		// get map data for site and map guid.
		Maps map = _unitOfWork.Repository<Maps>().Get().FirstOrDefault(x => x.JobId == siteId && x.MapGuid == mapGuid);
		
		if (map != null)
		{
		  // get all the map items of permicular map
		  List<MapBuildings> mapBuildings = _unitOfWork.Repository<MapBuildings>().Get(b => b.JobId == siteId).Result.ToList();
		  List<MapBuildingCorrs> mapBuildingCorrs = _unitOfWork.Repository<MapBuildingCorrs>().Get(b => b.JobId == siteId).Result.ToList();
		  
		  //Load map items 
		  List<BusinessObjects.Models.Map.MapItems> mapItems = _unitOfWork.Repository<Entities.MapItems>().Get(m => m.JobId == siteId && m.MapId == map.MapId).Result.ToList()
											.Select(t => new BusinessObjects.Models.Map.MapItems
											{
											  SiteId = t.JobId,
											  MapId = t.MapId,
											  MapItemId = t.MapItemId,
											  ItemId = t.ItemId,
											  ItemGuid = t.ItemGuid,
											  PanelGuid = t.PanelGuid,
											  Name = t.Name,
											  Notes = t.Notes,
											  Type = Enum.GetName(typeof(Enums.MonitoringObjectStatus), t.Type),
											  X = t.X,
											  Y = t.Y,
											  BuildingId = mapBuildings.FirstOrDefault(bi => bi.BuildingGuid == t.ItemGuid)?.BuildingId ?? mapBuildingCorrs.FirstOrDefault(mb => mb.MapGuid == mapGuid).BuildingId
											}).ToList();
		 
		  //Prepare the Site floor map model
		  siteFloorMapModel = _mapper.Map<Maps, SiteFloorMapModel>(map);
		  siteFloorMapModel.BuildingId = mapBuildingCorrs.Where(mb => mb.MapGuid == mapGuid).FirstOrDefault().BuildingId;
		  siteFloorMapModel.MapItem = mapItems;
		}
	  }
	  catch (Exception ex)
	  {
		_logger.LogError(ex, ex.Message);
	  }

	  return siteFloorMapModel;
	}

	#endregion
  }
}
