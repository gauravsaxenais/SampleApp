// <copyright file="RefreshToken.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using System.ComponentModel;

namespace MircomApi.BusinessObjects.Models.Login.Token
{
  public class RefreshToken
  {
	#region Constructors
	/// <summary>
	/// Initialises the refresh token.
	/// This class is being used on the API side to provide fields matching the response.
	/// </summary>
	/// <param name="token"></param>
	public RefreshToken(string token)
	{
	  Token = token;
	}
	#endregion

	#region Public Properties
	/// <summary>
	/// This field contains the refresh token.
	/// </summary>
	[DisplayName("RefreshToken")]
	public string Token { get; private set; }
	#endregion
  }
}
