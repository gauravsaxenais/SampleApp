// <copyright file="IJwtFactory.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using System.Threading.Tasks;
using MircomApi.BusinessObjects.Models.Login.Token;

namespace MircomApi.Services.Auth
{
  /// <summary>
  /// This interfaces exposes two methods:
  /// GenerateEncodedToken: returns an encoded jwtoken
  /// GetSubFromToken: returns sub from token.
  /// </summary>
  public interface IJwtFactory
  {
	#region Public Methods
	
	/// <summary>
	/// Returns an encoded jw token with claims
	/// </summary>
	/// <param name="userId">accepts a userid as parameter.</param>
	/// <returns></returns>
	Task<AccessToken> GenerateEncodedToken(string userId);

	/// <summary>
	/// returns subject from a jw token.
	/// </summary>
	/// <param name="token">accepts a accesstoken as parameter.</param>
	/// <returns></returns>
	string GetSubFromToken(AccessToken token);
	#endregion
  }
}
