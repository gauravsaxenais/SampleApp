// <copyright file="AuthController.cs" company="SampleApp">
// Copyright (c) SampleApp. All rights reserved.
// </copyright>

using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SampleAppApi.BusinessObjects.Helpers;
using SampleAppApi.BusinessObjects.Models.Login;
using SampleAppApi.BusinessObjects.Models.Login.Token;
using SampleAppApi.Services.Auth;
using Microsoft.Extensions.Configuration;

namespace SampleAppApi.WebApi.Controllers
{
  /// <summary>
  /// Auth controller - This controller provides
  /// login, logout, change password functionality for a user.
  /// </summary>
  [Route("api/auth")]
  [Authorize]
  [ApiController]
  public class AuthController : ControllerBase
  {
	#region Private Member Variables
	private readonly IUserService _userService;
	private readonly ILogger<AuthController> _logger;
	private IConfiguration configuration;
	#endregion

	#region Constructors

	/// <summary>
	/// Initializes a new instance of the <see cref="AuthController"/> class.
	/// </summary>
	/// <param name="userService">userService DAL layer.</param>
	/// <param name="logger">nlog logger.</param>
	public AuthController(IUserService userService, ILogger<AuthController> logger, IConfiguration config)
	{
	  _userService = userService;
	  _logger = logger;
	  configuration = config;
	}
	#endregion

	#region Public Methods

	/// <summary>
	/// Returns true if login is successful.
	/// </summary>
	/// <remarks>
	/// Sample login:
	///
	///     POST /auth/login
	///     {
	///        "Username": "administrator",
	///        "Password": ""
	///     }.
	///
	/// </remarks>
	/// <param name="login">The username and password.</param>
	/// <returns>returns a token for validated user.</returns>
	/// <response code="200">Success: Returns a token for a validated user.</response>
	/// <response code="400">Bad request.</response>
	/// <response code="401">Unauthorized: username and password doesn't match.</response>
	[AllowAnonymous]
	[HttpPost("login")]
	[Produces("application/json")]
	[ProducesResponseType(typeof(ResponseMessage), 200)]
	[ProducesResponseType(typeof(ResponseMessage), 400)]
	[ProducesResponseType(typeof(ResponseMessage), 401)]
	public async Task<ActionResult> Post([FromBody] LoginModel login)
	{
	  HttpStatusCode statusCode;
	  ActionResult response;
	  ResponseMessage tokenResponseMessage;
	  ResponseToken responseToken;

	  if (login == null)
	  {
		tokenResponseMessage = new ResponseMessage(false, null, new Message(HttpStatusCode.BadRequest));

		_logger.LogError($"The Login model is null. {(LoginModel)null}");
		response = BadRequest(tokenResponseMessage);
	  }
	  else
	  {
		try
		{
		  if (await _userService.IsUserAuthenticatedAsync(login.UserName, login.Password))
		  {
			// _logger.LogInformation($"Returned with valid username: {login.UserName}");
			responseToken = await _userService.GetResponseToken(login.UserName);

			// _logger.LogInformation($"Response token generated for: {login.UserName}");
			statusCode = HttpStatusCode.OK;

			tokenResponseMessage = new ResponseMessage(true, responseToken, new Message(statusCode));

			// generate access token
			response = Ok(tokenResponseMessage);
		  }
		  else
		  {
			_logger.LogError($"No username for userid : {login.UserName} found");
			statusCode = HttpStatusCode.Unauthorized;
			tokenResponseMessage = new ResponseMessage(false, null, new Message(statusCode, Resources.SharedResources.Login_InCorrectUserNamePassword));

			response = Unauthorized(tokenResponseMessage);
		  }
		}
		catch (Exception ex)
		{
		  System.IO.File.AppendAllText(configuration.GetSection("LogFilePath").Value + DateTime.Now.Year + DateTime.Now.Month + DateTime.Now.Day + ".txt", DateTime.Now + " : Exception:" + ex.Message + Environment.NewLine);
		  throw;
		}
	  }

	  return response;
	}
	#endregion
  }
}
