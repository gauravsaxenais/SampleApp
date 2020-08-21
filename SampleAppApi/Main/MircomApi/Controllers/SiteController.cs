// <copyright file="SiteController.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using System.Collections.Generic;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MircomApi.BusinessObjects.Helpers;
using MircomApi.BusinessObjects.Models.Site;
using MircomApi.Services.Sites;

namespace MircomApi.WebApi.Controllers
{
  /// <summary>
  /// Site Service Controller.
  /// </summary>
  [Route("api/sites")]
  [ApiController]
  public class SiteController : ControllerBase
  {
	#region Private Member Variables

	/// <summary>
	/// Site Interface variable.
	/// </summary>
	private readonly ISiteService _siteService;

	/// <summary>
	/// Logging Interface variable.
	/// </summary>
	private readonly ILogger<SiteController> _logger;
	#endregion

	#region Constructors

	/// <summary>
	/// Initializes a new instance of the <see cref="SiteController"/> class.
	/// </summary>
	/// <param name="siteService">Site dependency.</param>
	/// <param name="logger">Logging dependency.</param>
	public SiteController(ISiteService siteService, ILogger<SiteController> logger)
	{
	  _siteService = siteService;
	  _logger = logger;
	}
	#endregion

	#region Public Methods

	/// <summary>
	/// Gets all Sites.
	/// </summary>
	/// <returns>List of sites.</returns>
	[HttpGet]
	[Produces("application/json")]
	[ProducesResponseType(typeof(ResponseMessage), 200)]
	[ProducesResponseType(typeof(ResponseMessage), 400)]
	[ProducesResponseType(typeof(ResponseMessage), 401)]
	public ActionResult<SiteDetailsModel> GetSites()
	{
	  ActionResult response;
	  List<SiteDetailsModel> siteDetail = _siteService.GetSites();

	  if (siteDetail == null)
		{
		  response = Ok(new ResponseMessage(false, null, new Message(HttpStatusCode.OK)));
		  _logger.LogError(message: "There is nothing in database.");
		}
		else
		{
		  response = Ok(new ResponseMessage(true, siteDetail, new Message(HttpStatusCode.OK)));
		  _logger.LogError(message: "Response generated successfully.");
		}

	  return response;
	}
	#endregion
  }
}
