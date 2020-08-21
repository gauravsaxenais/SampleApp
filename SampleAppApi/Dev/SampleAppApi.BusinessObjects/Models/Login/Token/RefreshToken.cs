// <copyright file="RefreshToken.cs" company="SampleApp">
// Copyright (c) SampleApp. All rights reserved.
// </copyright>

using System.ComponentModel;

namespace SampleAppApi.BusinessObjects.Models.Login.Token
{
  /// <summary>
  /// Refresh Token : A refresh token can be used it to get a new access token. 
  /// RefreshToken has a getter and a private setter property
  /// </summary>
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
