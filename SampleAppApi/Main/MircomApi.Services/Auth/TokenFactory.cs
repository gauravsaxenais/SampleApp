// <copyright file="TokenFactory.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using System;
using System.Security.Cryptography;

namespace MircomApi.Services.Auth
{
  /// <summary>
  /// TokenFactory is responsible for generating a new token
  /// using a random number generator and base64 string.
  /// </summary>
  public sealed class TokenFactory : ITokenFactory
  {
	#region Public Methods

	/// <summary>
	/// This method generates a token
	/// using a random number generator
	/// and encodes it into Base64 string.
	/// </summary>
	/// <param name="size"></param>
	/// <returns></returns>
	public string GenerateToken(int size = 32)
	{
	  var randomNumber = new byte[size];
	  using (var rng = RandomNumberGenerator.Create())
	  {
		rng.GetBytes(randomNumber);
		return Convert.ToBase64String(randomNumber);
	  }
	}
	#endregion
  }
}
