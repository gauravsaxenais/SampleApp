// <copyright file="TestConfiguration.cs" company="SampleApp">
// Copyright (c) SampleApp. All rights reserved.
// </copyright>

using System;
using System.IO;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace SampleAppApi.UnitTest.Utility
{
  /// <summary>
  /// This method returns an instance of IConfiguration
  /// file being used is appsettings.test.json.
  /// </summary>
 public static class TestConfiguration
  {
	#region Public Methods
	public static IConfiguration InitConfiguration()
	{
	  var filePath = "..\\..\\..\\appsettings.test.json";
	  string filepath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, filePath);
	  var config = new ConfigurationBuilder()
		  .AddJsonFile(filepath)
		  .Build();
	  return config;
	}

	/// <summary>
	/// This method returns a signing key from appsettings.test.json.
	/// </summary>
	/// <returns></returns>
	public static SymmetricSecurityKey GetSymmetricSecurityKey()
	{
	  var _configuration = InitConfiguration();
	  string secretKey = _configuration["JwtIssuerOptions:SecretKey"];
	  var signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secretKey));

	  return signingKey;
	}
	#endregion
  }
}
