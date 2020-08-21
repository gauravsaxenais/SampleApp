// <copyright file="ConfigureMapper.cs" company="SampleApp">
// Copyright (c) SampleApp. All rights reserved.
// </copyright>

using AutoMapper;
using Microsoft.Extensions.Configuration;
using SampleAppApi.Util.Helpers;

namespace SampleAppApi.UnitTest.Utility
{
  public static class ConfigureMapper
  {
	#region Private Member Variables
	private static MappingProfile myProfile = null;
	private static MapperConfiguration configuration = null;
	private static Mapper _mapper = null;
	#endregion

	#region Public Methods
	public static Mapper InitiliseMapper(IConfiguration configuration)
	{
	  if (configuration == null)
	  {
		throw new System.ArgumentNullException(nameof(configuration));
	  }
	  else
	  {
		 myProfile = new MappingProfile(configuration);
		 ConfigureMapper.configuration = new MapperConfiguration(cfg => cfg.AddProfile(myProfile));
		_mapper = new Mapper(ConfigureMapper.configuration);
		return _mapper;
	  }
	}
	#endregion
  }
}
