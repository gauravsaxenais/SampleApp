// <copyright file="MappingProfile.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using System;
using AutoMapper;
using Microsoft.Extensions.Configuration;
using MircomApi.BusinessObjects.Models.Map;
using MircomApi.BusinessObjects.Models.Site;
using MircomApi.Entities;

namespace MircomApi.Util.Helpers
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

	  CreateMap<MapBuildings, BuildingMapModel>()
		.ForMember(dest => dest.SiteId, opts => opts.MapFrom(src => src.JobId))
		.ForMember(dest => dest.Number, opts => opts.MapFrom(src => src.BuildingNum))
		.ForMember(dest => dest.Type, opts => opts.MapFrom(src => Enum.GetName(typeof(Enums.MapTypes), src.Type)));

	  CreateMap<BuildingMapModel, MapBuildings>()
		.ForMember(dest => dest.JobId, opts => opts.MapFrom(src => src.SiteId))
		.ForMember(dest => dest.BuildingNum, opts => opts.MapFrom(src => src.Number))
		.ForMember(dest => dest.Type, opt => opt.MapFrom(src => (int)(Enums.MapTypes)Enum.Parse(typeof(Enums.MapTypes), src.Type)));

	  CreateMap<Maps, SiteFloorMapModel>()
		.ForMember(dest => dest.Id, opts => opts.MapFrom(src => src.MapId))
		.ForMember(dest => dest.Image, opts => opts.MapFrom(src => urlSection["BaseUrl"] + "/" +   src.ImageFile))
		.ForMember(dest => dest.SiteId, opts => opts.MapFrom(src => src.JobId));

	  CreateMap<Jobs, SiteDetailsModel>()
		.ForMember(dest => dest.ID, opts => opts.MapFrom(src => src.JobId))
		.ForMember(dest => dest.SiteGuid, opts => opts.MapFrom(src => src.Guid))
		.ForMember(dest => dest.ConfigVersion, opts => opts.MapFrom(src => src.ConfigVer));
	}
	#endregion
  }
}