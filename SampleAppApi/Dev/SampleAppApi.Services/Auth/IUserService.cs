// <copyright file="IUserService.cs" company="SampleApp">
// Copyright (c) SampleApp. All rights reserved.
// </copyright>

using System.Threading.Tasks;
using SampleAppApi.BusinessObjects.Models.Login.Token;

namespace SampleAppApi.Services.Auth
{
  /// <summary>
  /// An interface which provides two methods:
  /// 1. IsUserAuthenticatedAsync: checks whether a user has provided incorrect username and password.
  /// 2. GetResponseToken: generates a response token from a username.
  /// </summary>
  public interface IUserService
  {
	#region Public Methods
	
	/// <summary>
	/// This method accepts a username and password
	/// and returns true or false if user is
	/// authenticated.
	/// </summary>
	/// <param name="userName">username</param>
	/// <param name="password">password</param>
	/// <returns></returns>
	Task<bool> IsUserAuthenticatedAsync(string userName, string password);

	/// <summary>
	/// This method returns a response token.
	/// </summary>
	/// <param name="userName"></param>
	/// <returns></returns>
	Task<ResponseToken> GetResponseToken(string userName);
	#endregion
  }
}
