// <copyright file="ITokenFactory.cs" company="SampleApp">
// Copyright (c) SampleApp. All rights reserved.
// </copyright>

namespace SampleAppApi.Services.Auth
{
  /// <summary>
  /// This interface exposes single method.
  /// 1. Generate token returns an encoded token from a
  /// random number generator.
  /// </summary>
  public interface ITokenFactory
  {
	#region Public Methods
	
	/// <summary>
	/// This method generates a token using 
	/// a Random number generator
	/// and encodes it into a Base64 string.
	/// </summary>
	/// <param name="size"></param>
	/// <returns></returns>
	string GenerateToken(int size = 32);
	#endregion
  }
}
