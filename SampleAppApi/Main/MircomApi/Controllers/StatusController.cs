// <copyright file="StatusController.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using System;
using System.Collections.Generic;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MircomApi.BusinessObjects.Helpers;
using MircomApi.BusinessObjects.Models.ObjectStatus;
using MircomApi.Services;
using MircomApi.Services.AccessPointStatus;

namespace MircomApi.WebApi.Controllers
{
  /// <summary>
  /// Status controller for maps.
  /// </summary>
  [Route("api/status")]
  [ApiController]
  public class StatusController : ControllerBase
  {
	#region Private Member Variables
	private readonly IMapStatusService _mapStatusService;
	private readonly IAccessPointStatusService _accessPointStatusService;
	private readonly ILogger<StatusController> _logger;
	#endregion

	#region Constructors

	/// <summary>
	/// Initializes a new instance of the <see cref="StatusController"/> class.
	/// </summary>
	/// <param name="mapStatusService">Map status service.</param>
	/// <param name="accessPointStatusService">Access point status service.</param>
	/// <param name="logger">logger.</param>
	public StatusController(IMapStatusService mapStatusService, IAccessPointStatusService accessPointStatusService, ILogger<StatusController> logger)
	{
	  _mapStatusService = mapStatusService;
	  _accessPointStatusService = accessPointStatusService;
	  _logger = logger;
	}
	#endregion

	#region Public Methods

	/// <summary>
	/// GET: api/Status Returns the status details for the Map.
	/// </summary>
	/// <param name="siteId">The site identifier.</param>
	/// <param name="buildingId">The building Id identifier.</param>
	/// <returns>returns a token for validated user.</returns>
	/// <response code="200">Success: Returns status data for a mapGuid.</response>
	/// <response code="400">Bad request.</response>
	[Produces("application/json")]
	[ProducesResponseType(typeof(ResponseMessage), 200)]
	[ProducesResponseType(typeof(ResponseMessage), 400)]
	[HttpGet("mapitems/{buildingId}")]
	public ActionResult<ObjectStatusModel> GetBuildingStatus(int siteId, int buildingId)
	{
	  ResponseMessage responseMessage;
	  List<ObjectStatusModel> objectStatusModel;
	  ActionResult response;
	  if (siteId < 0 || buildingId < 0)
	  {
		responseMessage = new ResponseMessage(false, null, new Message(HttpStatusCode.BadRequest));
		response = BadRequest(responseMessage);
		_logger.LogError(message: $"The SiteId {siteId} and Building Id {buildingId} is not valid.");
	  }
	  else
	  {
		_logger.LogInformation(message: $"Getting data against site id : {siteId} and Building Id : {buildingId} ...");
		objectStatusModel = _mapStatusService.GetBuildingStatus(siteId, buildingId);

		if (objectStatusModel != null && objectStatusModel.Count > 0)
		{
		  response = Ok(new ResponseMessage(true, objectStatusModel, new Message(HttpStatusCode.OK)));
		  _logger.LogInformation(message: $"Response generated successfully against site id : {siteId} and Building Id : {buildingId} .");
		}
		else
		{
		  response = Ok(new ResponseMessage(false, null, new Message(HttpStatusCode.OK)));
		  _logger.LogWarning(message: $"There is nothing in database against siteId : {siteId} and Building Id : {buildingId} .");
		}
	  }

	  return response;
	}

	/// <summary>
	/// GET: api/Status Returns the status details for the Map.
	/// </summary>
	/// <param name="siteId">The site identifier.</param>
	/// <param name="mapGuid">The map unique identifier.</param>
	/// <returns>returns a token for validated user.</returns>
	/// <response code="200">Success: Returns status data for a mapGuid.</response>
	/// <response code="400">Bad request.</response>
	[Produces("application/json")]
	[ProducesResponseType(typeof(ResponseMessage), 200)]
	[ProducesResponseType(typeof(ResponseMessage), 400)]
	[HttpGet("maps/{siteId}")]
	public ActionResult<ObjectStatusModel> GetMapStatus(int siteId, Guid mapGuid)
	{
	  ResponseMessage responseMessage;
	  List<ObjectStatusModel> objectStatusModel;
	  ActionResult response;

	  // Return bad request if siteid and mapGuid are not passed.
	  if (siteId < 0 || mapGuid == Guid.Empty)
	  {
		responseMessage = new ResponseMessage(false, null, new Message(HttpStatusCode.BadRequest));
		response = BadRequest(responseMessage);
		_logger.LogError(message: $"The SiteId {siteId} and Map Guid {mapGuid} is not valid.");
	  }
	  else
	  {
		_logger.LogInformation(message: $"Getting data against site id : {siteId} and map guid : {mapGuid} ...");
		objectStatusModel = _mapStatusService.GetMapStatus(siteId, mapGuid);

		if (objectStatusModel != null && objectStatusModel.Count > 0)
		{
		  response = Ok(new ResponseMessage(true, objectStatusModel, new Message(HttpStatusCode.OK)));
		  _logger.LogInformation(message: $"Response generated successfully against site id : {siteId} and map guid : {mapGuid} .");
		}
		else
		{
		  response = Ok(new ResponseMessage(false, "{}", new Message(HttpStatusCode.OK)));
		  _logger.LogWarning(
			  message: $"There is nothing in database against siteId : {siteId} and mapGuid : {mapGuid} .");
		}
	  }

	  return response;
	}

	/// <summary>
	/// Returns the status details for the Access Point.
	/// </summary>
	/// <param name="siteId">The site identifier.</param>
	/// <returns>returns the status details for the access point.</returns>
	/// <response code="200">Success: Returns status data for a panelGuid.</response>
	/// <response code="400">Bad request.</response>
	[HttpGet("accesspoint/{siteId}")]
	[Produces("application/json")]
	[ProducesResponseType(typeof(ResponseMessage), 200)]
	[ProducesResponseType(typeof(ResponseMessage), 400)]
	[ProducesResponseType(typeof(ResponseMessage), 401)]
	public ActionResult<ObjectStatusModel> GetAccessPoint(int siteId)
	{
	  ResponseMessage responseMessage;
	  List<ObjectStatusModel> objectStatusModel;
	  ActionResult response;

	  // Return bad request if siteid and mapGuid are not passed.
	  if (siteId < 0)
	  {
		responseMessage = new ResponseMessage(false, null, new Message(HttpStatusCode.BadRequest));
		response = BadRequest(responseMessage);
		_logger.LogError(message: $"The SiteId {siteId} is not valid.");
	  }
	  else
	  {
		_logger.LogInformation(message: $"Getting data against site id : {siteId}.");
		objectStatusModel = _accessPointStatusService.GetListAccessPointStatus(siteId);

		if (objectStatusModel != null && objectStatusModel.Count > 0)
		{
		  response = Ok(new ResponseMessage(true, objectStatusModel, new Message(HttpStatusCode.OK)));
		  _logger.LogInformation(message: $"Response generated successfully against site id : {siteId}.");
		}
		else
		{
		  response = Ok(new ResponseMessage(false, "{}", new Message(HttpStatusCode.OK)));
		  _logger.LogWarning(message: $"There is nothing in database against siteId : {siteId}.");
		}
	  }

	  return response;
	}
	#endregion
  }
}
