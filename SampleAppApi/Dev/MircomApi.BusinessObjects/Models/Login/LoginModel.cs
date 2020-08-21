// <copyright file="LoginModel.cs" company="SampleApp">
// Copyright (c) SampleApp. All rights reserved.
// </copyright>

using SampleAppApi.Resources;
using System.ComponentModel.DataAnnotations;

namespace SampleAppApi.BusinessObjects.Models.Login
{
  /// <summary>
  /// LoginModel class.
  /// </summary>
  public class LoginModel
  {
	#region Constructors
	/// <summary>
	/// Initialises the model with username and password.
	/// </summary>
	/// <param name="userName"></param>
	/// <param name="password"></param>
	public LoginModel(string userName, string password = null)
	{
	  UserName = userName;
	  Password = password;
	}
	#endregion

	#region Public Properties
	/// <summary>
	/// Username being entered on the login page.
	/// </summary>
	[Required(ErrorMessageResourceName = "Login_RequiredUserName", ErrorMessageResourceType = typeof(SharedResources))]
	public string UserName { get; }

	/// <summary>
	/// Password being entered on the password page.
	/// </summary>
	[Required(ErrorMessageResourceName = "Login_RequiredPassword", ErrorMessageResourceType = typeof(SharedResources))]
	public string Password { get; }
	#endregion
  }
}
