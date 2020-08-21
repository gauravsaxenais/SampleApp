// <copyright file="LoginControllerUnitTest.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MircomApi.BusinessObjects.Helpers;
using MircomApi.BusinessObjects.Models.Login;
using MircomApi.BusinessObjects.Models.Login.Token;
using MircomApi.Entities;
using MircomApi.Services.Auth;
using MircomApi.WebApi.Controllers;
using Moq;
using System;
using Xunit;

namespace MircomApi.Test
{
  public class LoginControllerUnitTest
  {
	#region Private variables
	private Mock<IUserService> _userService;
	private ILogger<AuthController> _logger;
	private readonly AuthController _controller;
	private LoginModel _loginModel;
	#endregion

	#region Constructor
	public LoginControllerUnitTest()
	{
	  //Arrange
	  _logger = Mock.Of<ILogger<AuthController>>();

	  // create a dummy token
	  ResponseToken responseToken = new ResponseToken(new AccessToken("testId", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbmlzdHJhdG9yIiwianRpIjoiY2QwZjc2ZjQtZjA1Ni00YzdjLWJhMjgtOTEwN2FlZWZiZWQ5IiwiaWF0IjoxNTY2Mzg3NDU0LCJuYmYiOjE1NjYzODc0NTMsImV4cCI6MTU2NjM5NDY1MywiaXNzIjoiTWlyY29tQXBpIiwiYXVkIjoibWlyY29tLmNvbSJ9.iDHfG2gFsxxYfBhjP9Z4h0FCoDX70lXAJl3wlUneA4c", 7200),
		new RefreshToken("s/p+5Dalzxf8WzjnY94kVu9Z6cJ+1DCjI2miCJeZjNg="));

	  var user = new Users
	  {
		UserId = 13,
		Name = "administrator",
		Password = "test123",
		Active = 1,
		Rights = -1,
		UserGuid = Guid.Parse("7ED0E003-45EF-4C93-B89F-05BF5047F151")
	  };

	  _loginModel = new LoginModel(user.Name, user.Password);

	  _userService = new Mock<IUserService>();

	  _userService
		  .Setup(_ => _.IsUserAuthenticatedAsync(_loginModel.UserName, _loginModel.Password))
		  .ReturnsAsync(true);

	  _userService
	   .Setup(_ => _.GetResponseToken(_loginModel.UserName))
	   .ReturnsAsync(responseToken);

	  _controller = new AuthController(_userService.Object, _logger);
	}
	#endregion

	#region Public methods
	[Fact]
	public void SampleTestForConfiguration()
	{
	  Assert.Equal(2, 2);
	}

	[Fact]
	public async void PostReturnsOkWhenLoginSucceeds()
	{
	  var correctLoginModel = new LoginModel("administrator", "test123");

	  //Act
	  var result = await _controller.Post(correctLoginModel).ConfigureAwait(false);

	  // Assert
	  Assert.IsType<OkObjectResult>(result);
	  var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
	  var post = okResult.Value.Should().BeAssignableTo<ResponseMessage>().Subject;

	  Assert.True(post.Success);
	}

	[Fact]
	public async void PostReturnsUnathorizedWhenLoginFails()
	{
	  // Arrange
	  // incorrect username and password
	  var incorrectLoginModel = new LoginModel("admin", "test123");

	  // Act
	  var result = await _controller.Post(incorrectLoginModel).ConfigureAwait(false);

	  // Assert
	  var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
	}

	[Fact]
	public async void PostReturnsBadRequestWhenModelValidationFails()
	{
	  // Arrange
	  _controller.ModelState.AddModelError("UserName", "Required");

	  // Act
	  var result = await _controller.Post(_loginModel).ConfigureAwait(false);

	  // Assert
	  var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
	}
	#endregion
  }
}
