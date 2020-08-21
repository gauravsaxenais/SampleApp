// <copyright file="AuthUnitTest.cs" company="SampleApp">
// Copyright (c) SampleApp. All rights reserved.
// </copyright>

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using NUnit.Framework;
using SampleAppApi.BusinessObjects.Models.Login;
using SampleAppApi.DataAccess;
using SampleAppApi.DataAccess.Auth;
using SampleAppApi.Services.Auth;
using SampleAppApi.UnitTest.Utility;
using SampleAppApi.WebApi.Controllers;
using System;

namespace SampleAppApi.UnitTest
{
	[TestFixture]
  public class AuthUnitTest : IDisposable
  {
	#region Private Member Variables
	private readonly ILogger<UserService> loggerService = null;
	private readonly ILogger<AuthController> loggerController = null;
	private readonly NullLoggerFactory nullLoggerFactory = null;
	private readonly TASConfigDBContext context;
	private readonly GenericUnitOfWork<TASConfigDBContext> _unitOfWork = null;
	private readonly UserService userService = null;
	private AuthController authController = null;
	private IConfiguration configuration;
	private bool disposed;
	#endregion

	#region Constructors
	public AuthUnitTest()
	{
	  nullLoggerFactory = new NullLoggerFactory();
	  var options = new JwtIssuerOptions();

	  // get signing key from appsetting.test.json.
	  var signingKey = TestConfiguration.GetSymmetricSecurityKey();
	  options.SigningCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

	  var jwtOptions = Options.Create(options);
	  var _jwFactory = new JwtFactory(jwtOptions);
	  var _tokenFactory = new TokenFactory();

	  _unitOfWork = ConnectDatabase.Connection(out context);
	  loggerService = new Logger<UserService>(nullLoggerFactory);
	  loggerController = new Logger<AuthController>(nullLoggerFactory);
	  userService = new UserService(_unitOfWork, _jwFactory, _tokenFactory);
	  authController = new AuthController(userService, loggerController, configuration);
	}
	#endregion

	#region Public Methods
	[TestCase("administrator", "test123")]
	public void TaskPostByIdPwdReturnOkResult(string userName, string password)
	{
	  LoginModel login = new LoginModel(userName, password);

	  // Act
	  var result = authController.Post(login);
	  var response = ((BusinessObjects.Helpers.ResponseMessage)((ObjectResult)result.Result).Value).Message.Description;

	  // Assert
	  Assert.AreEqual("OK", response);
	}

	// Arrange
	[TestCase("administrator", "test")]
	[TestCase("administrator", "test1")]
	[TestCase("administrator", "Test123")]
	[TestCase("Administrator", "Test123")]
	public void TaskPostByIdPwdReturnUnauthorizedResult(string userName, string password)
	{
	  LoginModel login = new LoginModel(userName, password);

	  // Act
	  var result = authController.Post(login);
	  var response = ((BusinessObjects.Helpers.ResponseMessage)((ObjectResult)result.Result).Value).Message.Description;

	  // Assert
	  Assert.AreEqual(Resources.SharedResources.Login_InCorrectUserNamePassword, response);
	}

	public void Dispose()
	{
	  Dispose(true);
	  GC.SuppressFinalize(this);
	}
	#endregion

	#region Protected Methods
	protected virtual void Dispose(bool disposing)
	{
	  if (!disposed)
	  {
		if (disposing)
		{
		  //dispose managed resources
		  nullLoggerFactory.Dispose();
		  context.Dispose();
		  _unitOfWork.Dispose();
		}
	  }
	  //dispose unmanaged resources
	  disposed = true;
	}
	#endregion
  }
}
