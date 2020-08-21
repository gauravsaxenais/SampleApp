// <copyright file="LoginModel.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using System.ComponentModel.DataAnnotations;

namespace MircomApi.BusinessObjects.Models.Login
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
	[Required]
	public string UserName { get; }

	/// <summary>
	/// Password being entered on the password page.
	/// </summary>
	[Required, DataType(DataType.Password)]
	public string Password { get; }
	#endregion
  }
}
