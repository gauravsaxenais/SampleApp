// <copyright file="MappingProfile.cs" company="SampleApp">
// Copyright (c) SampleApp. All rights reserved.
// </copyright>

using System;
using AutoMapper;
using Microsoft.Extensions.Configuration;
using SampleAppApi.Entities;

namespace SampleAppApi.Util.Helpers
{
  public class MappingProfile : Profile
  {
	#region Constructors
	/// <summary>
	/// Mapping Profile Constructor where we map entity classes to model classes
	/// </summary>
	public MappingProfile(IConfiguration configuration)
	{
	  var urlSection = configuration.GetSection("URLs");
	}
	#endregion
  }
}