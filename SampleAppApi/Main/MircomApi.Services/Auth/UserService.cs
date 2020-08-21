// <copyright file="UserService.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MircomApi.BusinessObjects.Models.Login.Token;
using MircomApi.DataAccess;
using MircomApi.Entities;

namespace MircomApi.Services.Auth
{
  /// <summary>
  /// This services encapsulated unit of work
  /// and is responsible for validating a user.
  /// It also exposes methods for generating token.
  /// </summary>
  public class UserService : IUserService
  {
	#region Private Member Variables

	/// <summary>
	/// A generic unit of work
	/// </summary>
	private readonly GenericUnitOfWork<TASConfigDBContext> _unitOfWork;

	/// <summary>
	/// an interface for JwtFactory.
	/// </summary>
	private readonly IJwtFactory _jwFactory;

	/// <summary>
	/// an interface for ITokenfactory.
	/// </summary>
	private readonly ITokenFactory _tokenFactory;
	#endregion

	#region Private methods

	// private helper methods

	/// <summary>
	/// This method accepts a password
	/// and returns a hash of the password using a salt.
	/// </summary>
	/// <param name="password"></param>
	/// <param name="passwordHash"></param>
	/// <param name="passwordSalt"></param>
	private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
	{
	  if (password == null) throw new ArgumentNullException("password");
	  if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");

	  using (var hmac = new System.Security.Cryptography.HMACSHA512())
	  {
		passwordSalt = hmac.Key;
		passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
	  }
	}

	/// <summary>
	/// This method accepts a password as parameter
	/// and checks the storedHash with the computedHash from password.
	/// If both the hash'es match, it returns a true else false.
	/// </summary>
	/// <param name="password"></param>
	/// <param name="storedHash"></param>
	/// <param name="storedSalt"></param>
	/// <returns></returns>
	private static bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
	{
	  if (password == null) throw new ArgumentNullException("password");

	  if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");
	  if (storedHash.Length != 64) throw new ArgumentException("Invalid length of password hash (64 bytes expected).", "passwordHash");
	  if (storedSalt.Length != 128) throw new ArgumentException("Invalid length of password salt (128 bytes expected).", "passwordHash");

	  using (var hmac = new System.Security.Cryptography.HMACSHA512(storedSalt))
	  {
		var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
		for (int i = 0; i < computedHash.Length; i++)
		{
		  if (computedHash[i] != storedHash[i]) return false;
		}
	  }

	  return true;
	}
	#endregion

	#region Constructors

	/// <summary>
	/// This is a parameterised constructor which accepts
	/// unit of work, a jwtfactory, tokenfactory.
	/// </summary>
	/// <param name="unitOfWork"></param>
	/// <param name="jwtFactory"></param>
	/// <param name="tokenfactory"></param>
	public UserService(GenericUnitOfWork<TASConfigDBContext> unitOfWork, IJwtFactory jwtFactory, ITokenFactory tokenfactory)
	{
	  _unitOfWork = unitOfWork;
	  _jwFactory = jwtFactory;
	  _tokenFactory = tokenfactory;
	}
	#endregion

	#region Public methods

	/// <summary>
	/// This method accepts username and password
	/// and return true if the username and password
	/// is present in the database.
	/// </summary>
	/// <param name="userName"></param>
	/// <param name="password"></param>
	/// <returns></returns>
	public async Task<bool> IsUserAuthenticatedAsync(string userName, string password)
	{
	  var user = await _unitOfWork.Repository<Users>().GetQuery()
													  .Where(x => string.Equals(x.Name, userName.Trim(), StringComparison.CurrentCultureIgnoreCase))
													  .FirstOrDefaultAsync();

	  // ensure we have a user with the given user name
	  if (user != null && user.Password == password)
	  {
		return true;
	  }

	  return false;
	}

	/// <summary>
	/// This method generates an encoded jwtoken with Claims.
	/// </summary>
	/// <param name="userName"></param>
	/// <returns></returns>
	public async Task<ResponseToken> GetResponseToken(string userName)
	{
	  AccessToken accessToken = null;
	  string refreshToken = string.Empty;

	  // generate encoded token.
	  accessToken = await _jwFactory.GenerateEncodedToken(userName);

	  // generate refresh token
	  refreshToken = _tokenFactory.GenerateToken();

	  return new ResponseToken(accessToken, new RefreshToken(refreshToken));
	}
	#endregion
  }
}
