// <copyright file="AccessToken.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using System.Runtime.Serialization;

namespace MircomApi.BusinessObjects.Models.Login.Token
{
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
