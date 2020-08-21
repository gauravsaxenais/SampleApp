// <copyright file="MapController.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using System;
using System.Collections.Generic;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MircomApi.BusinessObjects.Helpers;
using MircomApi.BusinessObjects.Models.Map;
using MircomApi.Services.Map;
using MircomApi.Util.Helpers;
using static MircomApi.BusinessObjects.Helpers.ActionEnums;

namespace MircomApi.WebApi.Controllers
{
  /// <summary>
  /// Map Service Controller.
  /// </summary>
  [Route("api/maps")]
  [ApiController]
  public class MapController : ControllerBase
  {
	#region Private Member Variables

	/// <summary>
	/// Site Floor map Interface variable.
	/// </summary>
	private readonly ISiteFloorMapService _siteFloorMapService;

	/// <summary>
	/// Building map Interface variable.
	/// </summary>
	private readonly IBuildingMapService _buildingMapService;

	/// <summary>
	/// Logging Interface variable.
	/// </summary>
	private readonly ILogger<MapController> _logger;
	#endregion

	#region Constructors

	/// <summary>
	/// Initializes a new instance of the <see cref="MapController"/> class.
	/// </summary>
	/// <param name="siteFloorMapService">Site and Floor Map dependency.</param>
	/// <param name="buildingMapService">Building Map dependency.</param>
	/// <param name="logger">Logging dependency.</param>
	public MapController(ISiteFloorMapService siteFloorMapService, IBuildingMapService buildingMapService, ILogger<MapController> logger)
	{
	  _siteFloorMapService = siteFloorMapService;
	  _buildingMapService = buildingMapService;
	  _logger = logger;
	}
	#endregion

	#region Public Methods

	/// <summary>
	/// Returns the specific map by guid and site identifier (floor map or site map).
	/// </summary>
	/// <param name="siteId">The site identifier..</param>
	/// <param name="mapGuid">The map unique identifier.</param>
	/// <returns>Floor Map model object.</returns>
	[Route("")]
	[HttpGet]
	[Produces("application/json")]
	[ProducesResponseType(typeof(ResponseMessage), 200)]
	[ProducesResponseType(typeof(ResponseMessage), 400)]
	[ProducesResponseType(typeof(ResponseMessage), 401)]
	public ActionResult<SiteFloorMapModel> GetSiteFloorMap(int siteId, Guid mapGuid)
	{
	  ActionResult response;
	  ResponseMessage responseMessage;
	  SiteFloorMapModel siteFloorMapModel;

	  // Return bad request if siteid and mapGuid are not passed.
	  if (siteId < 0 || mapGuid == Guid.Empty)
	  {
		responseMessage = new ResponseMessage(false, null, new Message(HttpStatusCode.BadRequest));
		response = BadRequest(responseMessage);
		_logger.LogError(message: $"The SiteId {siteId} and Map Guid {mapGuid} is not valid.");
	  }
	  else
	  {
		siteFloorMapModel = _siteFloorMapService.GetSiteFloorMap(siteId, mapGuid);
		if (siteFloorMapModel == null)
		{
		  // There is nothing in database against siteId and mapGuid.
		  response = Ok(new ResponseMessage(false, null, new Message(HttpStatusCode.OK)));
		  _logger.LogWarning(message: $"There is nothing in database against siteId : {siteId} and mapGuid : {mapGuid} .");
		}
		else
		{
		  response = Ok(new ResponseMessage(true, siteFloorMapModel, new Message(HttpStatusCode.OK)));
		  _logger.LogInformation(message: $"Response generated Successfully against site id : {siteId} and map guid : {mapGuid} .");
		}
	  }

	  return response;
	}

	/// <summary>
	/// Returns Building details with the stacked floor image (already processed by the server when the building is changed).
	/// </summary>
	/// <param name="siteId">The site identifier.</param>
	/// <param name="buildingId">The building identifier.</param>
	/// <returns>Building Map model object.</returns>
	[Route("building/{siteId}")]
	[HttpGet]
	[Produces("application/json")]
	[ProducesResponseType(typeof(ResponseMessage), 200)]
	[ProducesResponseType(typeof(ResponseMessage), 400)]
	[ProducesResponseType(typeof(ResponseMessage), 401)]
	public ActionResult<BuildingMapModel> GetBuildingMap(int siteId, int buildingId)
	{
	  ActionResult response;
	  ResponseMessage tokenResponseMessage;
	  BuildingMapModel buildingMapModel;

	  // Return bad request if siteid and buildingId are not passed.
	  if (siteId < 0 || buildingId < 0)
	  {
		tokenResponseMessage = new ResponseMessage(false, null, new Message(HttpStatusCode.BadRequest));
		response = BadRequest(tokenResponseMessage);
		_logger.LogError(message: $"The SiteId {siteId} and Building id {buildingId} is not valid.");
	  }
	  else
	  {
		buildingMapModel = _buildingMapService.GetBuildingMap(siteId, buildingId);
		if (buildingMapModel == null)
		{
		  response = Ok(new ResponseMessage(false, null, new Message(HttpStatusCode.OK)));
		  _logger.LogError(message: $"There is nothing in database against siteId : {siteId} and Building id {buildingId} .");
		}
		else
		{
		  response = Ok(new ResponseMessage(true, buildingMapModel, new Message(HttpStatusCode.OK)));
		  _logger.LogError(message: $"Response generated Successfully against site id : {siteId} and Building id {buildingId} .");
		}
	  }

	  return response;
	}

	/// <summary>
	/// Returns a list of buildings with details (SiteMap, Building A - B - C etc).
	/// </summary>
	/// <param name="siteId">The site identifier.</param>
	/// <returns>List of Building Map model objects.</returns>
	[Route("buildings/{siteId}")]
	[HttpGet]
	[Produces("application/json")]
	[ProducesResponseType(typeof(ResponseMessage), 200)]
	[ProducesResponseType(typeof(ResponseMessage), 400)]
	[ProducesResponseType(typeof(ResponseMessage), 401)]
	public ActionResult<List<BuildingMapModel>> GetBuildingsList(int siteId)
	{
	  ActionResult response;
	  ResponseMessage tokenResponseMessage;

	  // Return bad request if siteid and buildingId are not passed.
	  if (siteId < 0)
	  {
		tokenResponseMessage = new ResponseMessage(false, null, new Message(HttpStatusCode.BadRequest));
		response = BadRequest(tokenResponseMessage);
		_logger.LogError(message: $"The SiteId {siteId} is not valid.");
	  }
	  else
	  {
		List<BuildingMapModel> buildingListForSiteId = _buildingMapService.GetBuildingListForSiteId(siteId);

		if (buildingListForSiteId.NotNullAndEmpty())
		{
		  response = Ok(new ResponseMessage(true, buildingListForSiteId, new Message(HttpStatusCode.OK)));
		  _logger.LogError(message: $"Response generated Successfully against site id : {siteId}.");
		}
		else
		{
		  response = Ok(new ResponseMessage(false, null, new Message(HttpStatusCode.OK)));
		  _logger.LogError(message: $"There is nothing in database against siteId : {siteId}.");
		}
	  }

	  return response;
	}

	/// <summary>
	/// Edits the building (one or more) with provided details.
	/// </summary>
	/// <param name="buildings">The list of buildings.</param>
	/// <returns>List of Building Map model objects.</returns>
	[Route("maps/building")]
	[HttpPost]
	[Produces("application/json")]
	[ProducesResponseType(typeof(ResponseMessage), 200)]
	[ProducesResponseType(typeof(ResponseMessage), 400)]
	[ProducesResponseType(typeof(ResponseMessage), 401)]
	public ActionResult<ResponseMessage> UpdateBuildingList(List<BuildingMapModel> buildings)
	{
	  ActionResult response;
	  ResponseMessage tokenResponseMessage;
	  List<Floor> floor = new List<Floor>();

	  Floor floor1 = new Floor
	  {
		Name = "Mircom Site Map",
		SlotNo = 7,
		MapGuid = Guid.Parse("7ED0E003-45EF-4C93-B89F-05BF5047F157"),
		MapId = 0,
		Image = "http://10.101.20.70:8081/stock/images/maps/Sitemap.jpg",
		Description = "descr udatef",
		Action = (int)ActionType.Update,
	  };

	  Floor floor2 = new Floor
	  {
		Name = "Mircom Site Map Updated",
		SlotNo = 4,
		MapGuid = Guid.Parse("7ED0E003-45EF-4C93-B89F-05BF5047F160"),
		MapId = 0,
		Image = "http://10.101.20.70:8081/stock/images/maps/Sitemap.jpg",
		Description = "Updated",
		Action = (int)ActionType.Update,
	  };

	  floor.Add(floor1);
	  floor.Add(floor2);

	  buildings.Add(new BuildingMapModel
	  {
		BuildingId = 4,
		BuildingGuid = Guid.Parse("7ED0E003-45EF-4C93-B89F-05BF5047F150"),
		SiteId = 5,
		Name = "Site Map21",
		Number = 4,
		Slots = 1,
		Type = "SiteMap",
		FloorStackFile = string.Empty,
		ShowcaseFile = string.Empty,
		Floors = floor,
		Action = (int)ActionType.Update,
	  });

	  // if building list is empty
	  if (!buildings.NotNullAndEmpty())
	  {
		tokenResponseMessage = new ResponseMessage(false, null, new Message(HttpStatusCode.BadRequest));
		response = BadRequest(tokenResponseMessage);

		_logger.LogError(message: $"The list of buildings sent from UI is not valid.");
	  }
	  else
	  {
		bool result = true;
		_buildingMapService.UpdateExistingBuildings(buildings);

		if (result)
		{
		  response = Ok(new ResponseMessage(true, null, new Message(HttpStatusCode.OK)));
		  _logger.LogError(message: $"Building list is successfully updated.");
		}
		else
		{
		  response = Ok(new ResponseMessage(false, null, new Message(HttpStatusCode.OK)));
		  _logger.LogError(message: $"There is an issue updating the list of buildings.");
		}
	  }

	  return response;
	}
	#endregion
  }
}