// <copyright file="ResponseToken.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

namespace MircomApi.BusinessObjects.Models.Login.Token
{
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
