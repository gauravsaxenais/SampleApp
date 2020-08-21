// <copyright file="BuildingMapService.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MircomApi.BusinessObjects.Models.Map;
using MircomApi.DataAccess;
using MircomApi.Entities;
using MircomApi.Util.Helpers;
using static MircomApi.BusinessObjects.Helpers.ActionEnums;

namespace MircomApi.Services.Map
{
  /// <summary>
  /// Building Map Business Layer Service
  /// </summary>
  public class BuildingMapService : IBuildingMapService
  {
	#region Private Member Variables
	private readonly GenericUnitOfWork<TASConfigDBContext> _unitOfWork;
	private readonly ILogger<BuildingMapService> _logger;
	private readonly IMapper _mapper;
	private readonly IConfiguration _configuration;
	#endregion

	#region Constructors

	/// <summary>
	/// Initializes the dependencies of services
	/// </summary>
	/// <param name="unitOfWork">unit of work for repository</param>
	/// <param name="logger">logger for Logging information</param>
	/// <param name="mapper">auto mapper for mapping entities and business objects.</param>
	public BuildingMapService(GenericUnitOfWork<TASConfigDBContext> unitOfWork, ILogger<BuildingMapService> logger, IMapper mapper, IConfiguration configuration)
	{
	  _unitOfWork = unitOfWork;
	  _logger = logger;
	  _mapper = mapper;
	  _configuration = configuration;
	}
	#endregion

	#region Public Methods
	/// <summary>
	/// Get Building Map.
	/// </summary>
	/// <param name="siteId"></param>
	/// <param name="buildingId"></param>
	/// <returns></returns>
	public BuildingMapModel GetBuildingMap(int siteId, int buildingId)
	{
	  BuildingMapModel buildingMapModel = new BuildingMapModel();
	  List<Floor> buildingFloors;
	  MapBuildings mapBuilding;
	  var URLSection = _configuration.GetSection("URLs");
	  
	  //Get Building details using siteId and buildingId
	  mapBuilding = _unitOfWork.Repository<MapBuildings>().Get(x => x.JobId == siteId && x.BuildingId == buildingId).Result.FirstOrDefault();

	  if (mapBuilding != null)
	  {
		//Get Building floor details and name of floor using siteId,buildingId,MapGuid
		buildingFloors = (from mpbd in _unitOfWork.Repository<MapBuildingCorrs>().Get(x => x.JobId == mapBuilding.JobId && x.BuildingId == mapBuilding.BuildingId).Result
						  join mp in _unitOfWork.Repository<Maps>().Get() on mpbd.MapGuid equals mp.MapGuid
						  orderby mpbd.SlotNum
						  select new Floor
						  {
							Name = mp.Title,
							SlotNo = mpbd.SlotNum,
							MapGuid = mpbd.MapGuid,
							MapId = mp.MapId,
							Image = URLSection["BaseUrl"] + "/" + mp.ImageFile
						  }).ToList();

		// Set the building floor model
		if (buildingFloors.NotNullAndEmpty())
		{
		  buildingMapModel = _mapper.Map<MapBuildings, BuildingMapModel>(mapBuilding);
		  buildingMapModel.Floors = buildingFloors;
		}
	  }

	  return buildingMapModel;
	}

	/// <summary>
	/// Get list of buildings for a particular siteId.
	/// </summary>
	/// <param name="siteId">site id or job id</param>
	/// <returns>list of buildings for a siteId</returns>
	public List<BuildingMapModel> GetBuildingListForSiteId(int siteId)
	{
	  BuildingMapModel buildingMapModel = new BuildingMapModel();

	  List<MapBuildings> mapBuildingList;
	  var URLSection = _configuration.GetSection("URLs");
	  List<BuildingMapModel> buildingMapModels = new List<BuildingMapModel>();

	  //Get Building details using siteId and buildingId
	  mapBuildingList = _unitOfWork.Repository<MapBuildings>().Get(x => x.JobId == siteId).Result.ToList();

	  // check if list is not null or empty
	  if (mapBuildingList.NotNullAndEmpty())
	  {
		foreach (var mapBuilding in mapBuildingList)
		{
		  //Get Building floor details and name of floor using siteId,buildingId,MapGuid
		  List<Floor> buildingFloors = (from mpbd in _unitOfWork.Repository<MapBuildingCorrs>().Get(x => x.JobId == mapBuilding.JobId && x.BuildingId == mapBuilding.BuildingId).Result
										join mp in _unitOfWork.Repository<Maps>().Get() on mpbd.MapGuid equals mp.MapGuid
										orderby mpbd.SlotNum
										select new Floor
										{
										  Name = mp.Title,
										  SlotNo = mpbd.SlotNum,
										  MapGuid = mpbd.MapGuid,
										  MapId = mp.MapId,
										  Image = URLSection["BaseUrl"] + "/" + mp.ImageFile
										}).ToList();

		  //Set the building floor model
		  if (buildingFloors.NotNullAndEmpty())
		  {
			buildingMapModel = _mapper.Map<MapBuildings, BuildingMapModel>(mapBuilding);
			buildingMapModel.Floors = buildingFloors;
		  }

		  buildingMapModels.Add(buildingMapModel);
		}
	  }

	  return buildingMapModels;
	}

	/// <summary>
	/// Edits one or more building with provided details.
	/// </summary>
	/// <param name="siteId">Site Id</param>
	/// <param name="mapGuid">Map Guid</param>
	/// <returns>List of Map object status</returns>
	public bool UpdateExistingBuildings(List<BuildingMapModel> buildingList)
	{
	  List<MapBuildings> mapBuildingList = new List<MapBuildings>();

	  MapBuildings mapBuilding = new MapBuildings();
	  int jobId;

	  // if the list is empty or null
	  // we return.
	  // avoids unnecessary processing.
	  if (!buildingList.NotNullAndEmpty())
		return false;

	  else
	  {
		jobId = buildingList.FirstOrDefault().SiteId;

		if (jobId < 0)
		  return false;

		else
		{
		  foreach (var building in buildingList)
		  {
			mapBuilding = _mapper.Map<BuildingMapModel, MapBuildings>(building);

			if (building.Action == (int)ActionType.Create)
			  mapBuilding.BuildingGuid = Guid.NewGuid();

			mapBuildingList.Add(mapBuilding);
		  }

		  _unitOfWork.Repository<MapBuildings>().Insert(
			mapBuildingList.Where(x => buildingList.Any(s3 => s3.Action == (int)ActionType.Create && s3.SiteId == x.JobId)).ToList());

		  _unitOfWork.Repository<MapBuildings>().Update(
			mapBuildingList.Where(x => buildingList.Any(s3 => s3.Action == (int)ActionType.Update && s3.SiteId == x.JobId)).ToList());

		  UpdateFloors(buildingList);

		  var list = mapBuildingList.Select(i => new { i.JobId, i.BuildingId }).Where(x => buildingList.Any(s3 => s3.Action == (int)ActionType.Delete && s3.SiteId == x.JobId)).ToList();
		  //_unitOfWork.Repository<MapBuildings>().DeleteByCompositeKey(list);

		  _unitOfWork.Context.SaveChanges();
		}
	  }

	  return true;
	}

	public void UpdateFloors(List<BuildingMapModel> buildingModelList)
	{
	  List<MapBuildings> mapBuildingList = new List<MapBuildings>();

	  MapBuildings mapBuilding = new MapBuildings();
	  List<MapBuildingCorrs> existingFloors = new List<MapBuildingCorrs>();
	  List<MapBuildingCorrs> deletedFloors = new List<MapBuildingCorrs>();
	  List<Maps> maps = new List<Maps>();
	  List<Maps> newMaps = new List<Maps>();

	  foreach (var building in buildingModelList)
	  {
		// first we map the entity with the business model.
		mapBuilding = _mapper.Map<BuildingMapModel, MapBuildings>(building);

		var mapCorrsRepository = _unitOfWork.Repository<MapBuildingCorrs>().Get(x => x.JobId == mapBuilding.JobId).Result;

		foreach (var buildingBusinessModelFloor in building.Floors)
		{
		  if (building.Action == (int)ActionType.Delete)
			buildingBusinessModelFloor.Action = (int)ActionType.Delete;

		  maps.Add(_unitOfWork.Repository<Maps>().Get(x => x.JobId == building.SiteId && x.MapGuid == buildingBusinessModelFloor.MapGuid).Result.FirstOrDefault());

		  // Check to see if this is a new floor item
		  if (mapCorrsRepository
			  .All(x => x.MapGuid != buildingBusinessModelFloor.MapGuid))
		  {
			// Add it to the collection
			mapBuilding.MapBuildingCorrs.Add(new MapBuildingCorrs
			{
			  JobId = building.SiteId,
			  BuildingId = building.BuildingId,
			  SlotNum = buildingBusinessModelFloor.SlotNo,
			  MapGuid = buildingBusinessModelFloor.MapGuid,
			}
			);

			newMaps.Add(new Maps
			{
			  JobId = building.SiteId,
			  MapGuid = Guid.NewGuid(),
			  Title = buildingBusinessModelFloor.Name,
			  Description = buildingBusinessModelFloor.Description,
			  ImageFile = buildingBusinessModelFloor.Image
			});

			continue;
		  }

		  // Check to see if this is an existing floor item
		  var existingFloor = mapCorrsRepository.FirstOrDefault(x => x.MapGuid == buildingBusinessModelFloor.MapGuid && x.BuildingId == building.BuildingId
		  && x.JobId == mapBuilding.JobId);

		  if (existingFloor == null)
		  {
			continue;
		  }

		  // Check to see if any associated information was changed
		  if (existingFloor.SlotNum != buildingBusinessModelFloor.SlotNo
			  && buildingBusinessModelFloor.Action == (int)ActionType.Update)
		  {
			existingFloors.Add(new MapBuildingCorrs
			{
			  JobId = building.SiteId,
			  BuildingId = building.BuildingId,
			  SlotNum = buildingBusinessModelFloor.SlotNo,
			  MapGuid = buildingBusinessModelFloor.MapGuid,
			});

			continue;
		  }

		  else if (buildingBusinessModelFloor.Action == (int)ActionType.Delete)
		  {
			deletedFloors.Add(new MapBuildingCorrs
			{
			  JobId = building.SiteId,
			  BuildingId = building.BuildingId,
			  SlotNum = buildingBusinessModelFloor.SlotNo,
			  MapGuid = buildingBusinessModelFloor.MapGuid,
			});

			continue;
		  }
		}

		mapBuildingList.Add(mapBuilding);
	  }

	  // update existing floors.
	  foreach (var floor in existingFloors)
	  {
		// delete the existing floor
		var mapCorrsUnique = _unitOfWork.Repository<MapBuildingCorrs>().Get(x => x.JobId == floor.JobId && x.MapGuid == floor.MapGuid).Result.Select(i => new { i.JobId, i.BuildingId, i.SlotNum });
		var mapUnique = _unitOfWork.Repository<Maps>().Get(x => x.JobId == floor.JobId && x.MapGuid == floor.MapGuid).Result.Select(i => new { i.JobId, i.MapId });

		//_unitOfWork.Repository<MapBuildingCorrs>().DeleteByCompositeKey(mapCorrsUnique);
		//_unitOfWork.Repository<Maps>().DeleteByCompositeKey(mapUnique);

		var userData = buildingModelList.Where(x => x.SiteId == floor.JobId)
				  .SelectMany(c => c.Floors).Where(p => p.MapGuid == floor.MapGuid).FirstOrDefault();

		// Add a floor.
		_unitOfWork.Repository<MapBuildingCorrs>().Update(floor);

		_unitOfWork.Repository<Maps>().Update(new Maps
		{
		  JobId = floor.JobId,
		  MapGuid = (Guid)floor.MapGuid,
		  Title = userData.Name,
		  Description = userData.Description,
		  ImageFile = userData.Image,
		}
		);
	  }

	  // Add a new floor
	  foreach (var entityBuilding in mapBuildingList)
	  {
		var mapCorrs = entityBuilding.MapBuildingCorrs;

		_unitOfWork.Repository<MapBuildingCorrs>().Insert(mapCorrs);
	  }

	  foreach(var map in newMaps)
	  {
		_unitOfWork.Repository<Maps>().Insert(map);
	  }

	  // delete existing floors.
	  foreach (var floor in deletedFloors)
	  {
		// delete the existing floor
		var mapCorrsUnique = _unitOfWork.Repository<MapBuildingCorrs>().Get(x => x.JobId == floor.JobId && x.MapGuid == floor.MapGuid).Result.Select(i => new { i.JobId, i.BuildingId, i.SlotNum });
		var mapsUnique = _unitOfWork.Repository<Maps>().Get(x => x.JobId == floor.JobId && x.MapGuid == floor.MapGuid).Result.Select(i => new { i.JobId, i.MapId });

		//_unitOfWork.Repository<MapBuildingCorrs>().DeleteByCompositeKey(mapCorrsUnique);
		//_unitOfWork.Repository<Maps>().DeleteByCompositeKey(mapsUnique);
	  }
	}
  }
  #endregion
}
