// <copyright file="JwtFactory.cs" company="SampleApp">
// Copyright (c) SampleApp. All rights reserved.
// </copyright>

using System;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Options;
using SampleAppApi.BusinessObjects.Models.Login.Token;
using SampleAppApi.DataAccess.Auth;

namespace SampleAppApi.Services.Auth
{
  /// <summary>
  /// This class is responsible for generating a token
  /// using claims.
  /// </summary>
  public class JwtFactory : IJwtFactory
  {
	#region Private Member Variables
	private readonly JwtIssuerOptions _jwtOptions;
	#endregion

	#region Constructors
	public JwtFactory(IOptions<JwtIssuerOptions> jwtOptions)
	{
	  _jwtOptions = jwtOptions.Value;
	  ThrowIfInvalidOptions(_jwtOptions);
	}
	#endregion

	#region Public Methods
	
	/// <summary>
	/// This method returns a jwtoken.
	/// </summary>
	/// <param name="userId"></param>
	/// <returns></returns>
	public async Task<AccessToken> GenerateEncodedToken(string userId)
	{
	  var claims = new[]
	  {
		new Claim(JwtRegisteredClaimNames.Sub, userId),
		new Claim(JwtRegisteredClaimNames.Jti, await _jwtOptions.JtiGenerator()),
		new Claim(JwtRegisteredClaimNames.Iat, ToUnixEpochDate(_jwtOptions.IssuedAt).ToString(), ClaimValueTypes.Integer64)
	  };

	  // Create the JWT security token and encode it.
	  var jwt = new JwtSecurityToken(
		  _jwtOptions.Issuer,
		  _jwtOptions.Audience,
		  claims,
		  _jwtOptions.NotBefore,
		  _jwtOptions.Expiration,
		  _jwtOptions.SigningCredentials);

	  var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);
	  return new AccessToken(userId, encodedJwt, (int)_jwtOptions.ValidFor.TotalSeconds);
	}

	/// <summary>
	/// This method returns a subject from token.
	/// </summary>
	/// <param name="token"></param>
	/// <returns></returns>
	public string GetSubFromToken(AccessToken token)
	{
	  string sub = string.Empty;


	  if (token != null)
	  {
		JwtSecurityTokenHandler handler = new JwtSecurityTokenHandler();

		var canReadToken = handler.CanReadToken(token.Token);

		// check if its a valid token.
		if (canReadToken)
		{
		  sub = (new JwtSecurityTokenHandler().ReadToken(token.Token) as JwtSecurityToken)?.Subject;
		}
	  }

	  return sub;
	}
	#endregion

	#region Private methods

	/// <summary>
	/// This method takes a userId and generates
	/// a new claim.
	/// </summary>
	/// <param name="userId"></param>
	/// <returns></returns>
	private static ClaimsIdentity GenerateClaimsIdentity(string userId)
	{
	  return new ClaimsIdentity(new GenericIdentity(userId, "Token"), new[]
	  {
		new Claim(string.Empty, userId)
	  });
	}

	/// <returns>Date converted to seconds since Unix epoch (Jan 1, 1970, midnight UTC).</returns>
	private static long ToUnixEpochDate(DateTime date)
	  => (long)Math.Round((date.ToUniversalTime() -
						   new DateTimeOffset(1970, 1, 1, 0, 0, 0, TimeSpan.Zero))
						  .TotalSeconds);

	/// <summary>
	/// If any of the required options are empty,
	/// this method returns an exception.
	/// </summary>
	/// <param name="options"></param>
	private static void ThrowIfInvalidOptions(JwtIssuerOptions options)
	{
	  if (options == null) throw new ArgumentNullException(nameof(options));

	  if (options.ValidFor <= TimeSpan.Zero)
	  {
		throw new ArgumentException("Must be a non-zero TimeSpan.", nameof(JwtIssuerOptions.ValidFor));
	  }

	  if (options.SigningCredentials == null)
	  {
		throw new ArgumentNullException(nameof(JwtIssuerOptions.SigningCredentials));
	  }

	  if (options.JtiGenerator == null)
	  {
		throw new ArgumentNullException(nameof(JwtIssuerOptions.JtiGenerator));
	  }
	}
	#endregion
  }
}
