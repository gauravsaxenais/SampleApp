// <copyright file="ServicesConfiguration.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using MircomApi.DataAccess;
using MircomApi.DataAccess.Auth;
using MircomApi.Entities;
using MircomApi.Services;
using MircomApi.Services.AccessPoint;
using MircomApi.Services.AccessPointStatus;
using MircomApi.Services.Auth;
using MircomApi.Services.Chart;
using MircomApi.Services.Events;
using MircomApi.Services.Map;
using MircomApi.Services.MapStatus;
using MircomApi.Services.Sites;
using MircomApi.Util.Helpers;
using Swashbuckle.AspNetCore.Swagger;

namespace MircomApi.WebApi.Configuration
{
  /// <summary>
  /// Services configuration class.
  /// </summary>
  public static class ServicesConfiguration
  {
	#region Public methods

	/// <summary>
	/// Add swagger in pipeline using extension methods.
	/// </summary>
	/// <param name="services">services collection.</param>
	public static void AddSwaggerService(this IServiceCollection services)
	{
	  // Add swagger.
	  services.AddSwaggerGen(c =>
	  {
		c.SwaggerDoc("v1", new Info
		{
		  Version = "v1",
		  Title = Constants.Strings.ApplicationWideConstants.ApplicationName,
		  Description = "Mircom API",
		});

		c.AddSecurityDefinition("Bearer", new ApiKeyScheme
		{
		  Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
		  Name = "Authorization",
		  In = "header",
		  Type = "apiKey",
		});

		c.AddSecurityRequirement(new Dictionary<string, IEnumerable<string>>
		{
			{ "Bearer", Array.Empty<string>() },
		});

		// Set the comments path for the Swagger JSON and UI.
		// we use reflection here.
		var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
		var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
		c.IncludeXmlComments(xmlPath);
	  });
	}

	/// <summary>
	/// Add our custom services here.
	/// </summary>
	/// <param name="services">services collection.</param>
	public static void AddCustomServices(this IServiceCollection services)
	{
	  // configure DI for application services
	  services.AddScoped<IJwtFactory, JwtFactory>();
	  services.AddScoped<ITokenFactory, TokenFactory>();
	  services.AddScoped<IUserService, UserService>();
	  services.AddScoped<ISiteFloorMapService, SiteFloorMapService>();
	  services.AddScoped<IBuildingMapService, BuildingMapService>();
	  services.AddScoped<IChartService, ChartService>();
	  services.AddScoped<IMapStatusService, MapStatusService>();
	  services.AddScoped<IEventsService, EventsService>();
	  services.AddScoped<IAccessPointsService, AccessPointsService>();
	  services.AddScoped<IAccessPointStatusService, AccessPointStatusService>();
	  services.AddScoped<ISiteService, SiteService>();
	  services.AddScoped<IRepository<Users>, GenericRepository<Users>>();
	  services.AddScoped<GenericUnitOfWork<TASConfigDBContext>>();

	  services.AddSingleton<IJwtFactory, JwtFactory>();
	}

	/// <summary>
	/// Jwt Configuration to be added to the pipeline.
	/// </summary>
	/// <param name="services">services collection.</param>
	/// <param name="jwtConfiguration">configuration for jwt token.</param>
	public static void AddJwtConfiguration(this IServiceCollection services, IConfiguration jwtConfiguration)
	{
	  // jwt wire up
	  // Get options from app settings
	  var jwtAppSettingOptions = jwtConfiguration ?? throw new ArgumentNullException(nameof(jwtConfiguration));

	  string secretKey = jwtAppSettingOptions["SecretKey"];
	  var signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secretKey));

	  // Configure JwtIssuerOptions
	  services.Configure<JwtIssuerOptions>(options =>
	  {
		options.Issuer = jwtAppSettingOptions[nameof(JwtIssuerOptions.Issuer)];
		options.Audience = jwtAppSettingOptions[nameof(JwtIssuerOptions.Audience)];
		options.SigningCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);
	  });

	  var tokenValidationParameters = new TokenValidationParameters
	  {
		ValidateIssuer = true,
		ValidIssuer = jwtAppSettingOptions[nameof(JwtIssuerOptions.Issuer)],

		ValidateAudience = true,
		ValidAudience = jwtAppSettingOptions[nameof(JwtIssuerOptions.Audience)],

		ValidateIssuerSigningKey = true,
		IssuerSigningKey = signingKey,

		RequireExpirationTime = false,
		ValidateLifetime = true,
		ClockSkew = TimeSpan.Zero,
	  };

	  services.AddAuthentication(options =>
	  {
		options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
		options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
	  }).AddJwtBearer(configureOptions =>
	  {
		configureOptions.ClaimsIssuer = jwtAppSettingOptions[nameof(JwtIssuerOptions.Issuer)];
		configureOptions.TokenValidationParameters = tokenValidationParameters;
		configureOptions.SaveToken = true;
		configureOptions.RequireHttpsMetadata = false;

		configureOptions.Events = new JwtBearerEvents
		{
		  OnAuthenticationFailed = context =>
			{
			  if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
			  {
				context.Response.Headers.Add("Token-Expired", "true");
			  }

			  return Task.CompletedTask;
			},
		};
	  });
	}

	/// <summary>
	/// Add our auto mapper here.
	/// </summary>
	/// <param name="services">services collection.</param>
	/// <param name="configuration">services.</param>
	public static void AddAutoMapper(this IServiceCollection services, IConfiguration configuration)
	{
	  // Add Auto Mapper here
	  var config = new AutoMapper.MapperConfiguration(c =>
	  {
		c.AddProfile(new MappingProfile(configuration));
	  });
	  var mapper = config.CreateMapper();
	  services.AddSingleton(mapper);
	}
	#endregion
  }
}
