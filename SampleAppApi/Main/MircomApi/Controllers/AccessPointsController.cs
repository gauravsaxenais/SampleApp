// <copyright file="AccessPointsController.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using System.Collections.Generic;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MircomApi.BusinessObjects.Helpers;
using MircomApi.BusinessObjects.Models.AccessPointsModel;
using MircomApi.Services.AccessPoint;

namespace MircomApi.WebApi.Controllers
{
  /// <summary>
  /// AccessPoints Service Controller.
  /// </summary>
  [ApiController]
  public class AccessPointsController : ControllerBase
  {
	#region Private Member Variables

	/// <summary>
	/// AccessPoints Interface variable.
	/// </summary>
	private readonly IAccessPointsService _accessPointsService;

	/// <summary>
	/// Logging Interface variable.
	/// </summary>
	private readonly ILogger<AccessPointsController> _logger;
	#endregion

	#region Constructors

	/// <summary>
	/// Initializes a new instance of the <see cref="AccessPointsController"/> class.
	/// </summary>
	/// <param name="accessPointService">Access point dependency.</param>
	/// <param name="logger">Logging dependency.</param>
	public AccessPointsController(IAccessPointsService accessPointService, ILogger<AccessPointsController> logger)
	{
	  _accessPointsService = accessPointService;
	  _logger = logger;
	}
	#endregion

	#region Public methods

	/// <summary>
	/// Gets all AccessPoints configuration by siteId.
	/// </summary>
	/// <param name="siteId">Site id.</param>
	/// <returns>Access point model.</returns>
	[Route("api/accesspoints/{siteId}")]
	[HttpGet]
	[Produces("application/json")]
	[ProducesResponseType(typeof(ResponseMessage), 200)]
	[ProducesResponseType(typeof(ResponseMessage), 400)]
	[ProducesResponseType(typeof(ResponseMessage), 401)]
	public ActionResult<AccessPointsModel> GetAccessPoints(int siteId)
	{
	  ActionResult response;
	  ResponseMessage responseMessage;
	  List<AccessPointsModel> accesspt = null;

	  // Return bad request if siteid and buildingId are not passed.
	  if (siteId < 0)
	  {
		responseMessage = new ResponseMessage(false, null, new Message(HttpStatusCode.BadRequest));
		response = BadRequest(responseMessage);
		_logger.LogError(message: $"The SiteId {siteId} is not valid.");
	  }
	  else
	  {
		accesspt = _accessPointsService.GetListAccessPoints(siteId);
		if (accesspt == null)
		{
		  response = Ok(new ResponseMessage(false, null, new Message(HttpStatusCode.OK)));
		  _logger.LogError(message: $"There is nothing in database against siteId : {siteId}.");
		}
		else
		{
		  response = Ok(new ResponseMessage(true, accesspt, new Message(HttpStatusCode.OK)));
		  _logger.LogError(message: $"Response generated successfully against site id : {siteId}.");
		}
	  }

	  return response;
	}
	#endregion
  }
}