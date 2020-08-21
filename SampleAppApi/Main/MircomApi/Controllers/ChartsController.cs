// <copyright file="ChartsController.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using System;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MircomApi.BusinessObjects.Helpers;
using MircomApi.BusinessObjects.Models.Chart;
using MircomApi.Services.Chart;

namespace MircomApi.WebApi.Controllers
{
  /// <summary>
  /// Charts Service Controller.
  /// </summary>
  [Route("api/chart")]
  [ApiController]
  public class ChartsController : ControllerBase
  {
	#region Private Member Variables

	/// <summary>
	/// ChartService Interface variable.
	/// </summary>
	private readonly IChartService _chartService;

	/// <summary>
	/// Logging Interface variable.
	/// </summary>
	private readonly ILogger<ChartsController> _logger;
	#endregion

	#region Constructors

	/// <summary>
	/// Initializes a new instance of the <see cref="ChartsController"/> class.
	/// </summary>
	/// <param name="chartService">Chart dependency.</param>
	/// <param name="logger">Logging dependency.</param>
	public ChartsController(IChartService chartService, ILogger<ChartsController> logger)
	{
	  _chartService = chartService;
	  _logger = logger;
	}
	#endregion

	#region Public Methods

	/// <summary>
	/// Gets the current live chart associated with user.
	/// </summary>
	/// <param name="reportGuid">The report unique identifier.</param>
	/// <returns>Chart Model Object.</returns>
	[Route("")]
	[HttpGet]
	[Produces("application/json")]
	[ProducesResponseType(typeof(ResponseMessage), 200)]
	[ProducesResponseType(typeof(ResponseMessage), 400)]
	[ProducesResponseType(typeof(ResponseMessage), 401)]
	public ActionResult<ChartModel> GetChartDetails(Guid reportGuid)
	{
	  ActionResult response;
	  ResponseMessage responseMessage;
	  ChartModel chartModel = null;

	  if (reportGuid == Guid.Empty)
	  {
		responseMessage = new ResponseMessage(false, null, new Message(HttpStatusCode.BadRequest));
		_logger.LogError($"The Report guid is null. {reportGuid}");
		response = BadRequest(responseMessage);
	  }
	  else
	  {
		chartModel = _chartService.GetChartDetails(reportGuid);
		if (chartModel == null)
		{
		  response = Ok(new ResponseMessage(false, null, new Message(HttpStatusCode.OK)));
		  _logger.LogWarning(message: $"There is nothing in database against Report guid : {reportGuid}.");
		}
		else
		{
		  response = Ok(new ResponseMessage(true, chartModel, new Message(HttpStatusCode.OK)));
		  _logger.LogInformation(message: $"Response generated Successfully against Report guid : {reportGuid}.");
		}
	  }

	  return response;
	}

	#endregion
  }
}