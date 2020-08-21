// <copyright file="ResponseToken.cs" company="SampleApp">
// Copyright (c) SampleApp. All rights reserved.
// </copyright>

namespace SampleAppApi.BusinessObjects.Models.Login.Token
{
  /// <summary>
  /// A Response token class provides data for both refresh token
  /// and access token.
  /// </summary>
  public class ResponseToken
  {
	#region Public Properties
	/// <summary>
	/// The access token.
	/// </summary>
	public AccessToken AccessToken { get; private set; }

	/// <summary>
	/// The refresh token.
	/// </summary>
	public RefreshToken RefreshToken { get; private set; }
	#endregion

	#region Constructors
	/// <summary>
	/// Initialises a access token and refresh token.
	/// </summary>
	/// <param name="accessToken">access token.</param>
	/// <param name="refreshToken">refresh token.</param>
	public ResponseToken(AccessToken accessToken, RefreshToken refreshToken)
	{
	  AccessToken = accessToken;
	  RefreshToken = refreshToken;
	}
	#endregion
  }
}
