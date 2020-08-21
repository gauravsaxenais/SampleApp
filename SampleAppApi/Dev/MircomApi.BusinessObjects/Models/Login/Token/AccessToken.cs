// <copyright file="AccessToken.cs" company="SampleApp">
// Copyright (c) SampleApp. All rights reserved.
// </copyright>

using System.Runtime.Serialization;

namespace SampleAppApi.BusinessObjects.Models.Login.Token
{
  /// <summary>
  /// Access token is a token which is generated on successful 
  /// login to the user. AccessToken has three fields
  /// 1. an id,
  /// 2. JWToken
  /// 3. Expiry of the token.
  /// </summary>
  public sealed class AccessToken
  {
	#region Constructors
	
	/// <summary>
	/// This class is being used to send jwtoken as per API.
	/// </summary>
	/// <param name="id">id of the token.</param>
	/// <param name="token">the jw token.</param>
	/// <param name="expiresIn">expiry of the jwtoken.</param>
	public AccessToken(string id, string token, int expiresIn)
	{
	  Id = id;
	  Token = token;
	  ExpiresIn = expiresIn;
	}
	#endregion

	#region Public Properties
	/// <summary>
	/// id of the token.
	/// </summary>
	[IgnoreDataMember]
	public string Id { get; }
	
	/// <summary>
	/// the jw token.
	/// </summary>
	public string Token { get; }
	
	/// <summary>
	/// expiry of the jw token. default is 7200.
	/// </summary>
	public int ExpiresIn { get; }
	#endregion
  }
}
