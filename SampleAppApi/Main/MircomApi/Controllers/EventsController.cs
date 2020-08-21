// <copyright file="EventsController.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using System.Collections.Generic;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MircomApi.BusinessObjects.Helpers;
using MircomApi.BusinessObjects.Models.Events;
using MircomApi.Services.Events;

namespace MircomApi.WebApi.Controllers
{
  /// <summary>
  /// Status controller for maps.
  /// </summary>
  [Route("api/events")]
  [ApiController]
  public class EventsController : ControllerBase
  {
	#region Private Member Variables
	private readonly ILogger<EventsController> _logger;
	private readonly IEventsService _eventsService;
	#endregion

	#region Constructors

	/// <summary>
	/// Initializes a new instance of the <see cref="EventsController"/> class.
	/// </summary>
	/// <param name="eventsService">Event service dependency.</param>
	/// <param name="logger">Logger dependency.</param>
	public EventsController(IEventsService eventsService, ILogger<EventsController> logger)
	{
	  _logger = logger;
	  _eventsService = eventsService;
	}
	#endregion

	#region Public Methods

	/// <summary>
	/// GET: api/Status Returns the events data.
	/// </summary>
	/// <param name="eventRequestModel">Model for event request.</param>
	/// <remarks>Request body properties 1.startTime | 2.endTime | 3.description | 4.severity | 5.siteIds | 6.mostRecent.</remarks>
	/// <returns>Event Data.</returns>
	/// <response code="200">Success: Returns event data model.</response>
	/// <response code="400">Bad request.</response>
	[Produces("application/json")]
	[ProducesResponseType(typeof(ResponseMessage), 200)]
	[ProducesResponseType(typeof(ResponseMessage), 400)]
	[HttpPost("")]
	public ActionResult<EventsModel> GetEvents([FromBody]EventRequestModel eventRequestModel)
	{
	  ActionResult response;
	  List<EventsModel> eventsModel;

	  eventsModel = _eventsService.GetEvents(eventRequestModel);

	  if (eventsModel != null && eventsModel.Count > 0)
	  {
		response = Ok(new ResponseMessage(true, eventsModel, new Message(HttpStatusCode.OK)));
	  }
	  else
	  {
		response = Ok(new ResponseMessage(false, null, new Message(HttpStatusCode.OK)));
	  }

	  return response;
	}
	#endregion
  }
}