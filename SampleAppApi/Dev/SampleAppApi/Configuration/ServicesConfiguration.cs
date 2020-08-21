// <copyright file="ServicesConfiguration.cs" company="SampleApp">
// Copyright (c) SampleApp. All rights reserved.
// </copyright>

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Cors.Internal;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using SampleAppApi.DataAccess;
using SampleAppApi.DataAccess.Auth;
using SampleAppApi.Entities;
using SampleAppApi.Services.Auth;
using SampleAppApi.Util.Helpers;
using Swashbuckle.AspNetCore.Swagger;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace SampleAppApi.WebApi.Configuration
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
	  services.AddSwaggerGen(options =>
	  {
		// Add language support here.
		options.OperationFilter<SwaggerLanguageHeader>();

		options.SwaggerDoc("v1", new Info
		{
		  Version = "v1",
		  Title = "Sample App API",
		  Description = "SampleApp API",
		});

		options.AddSecurityDefinition("Bearer", new ApiKeyScheme
		{
		  Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
		  Name = "Authorization",
		  In = "header",
		  Type = "apiKey",
		});

		options.AddSecurityRequirement(new Dictionary<string, IEnumerable<string>>
		{
			{ "Bearer", Array.Empty<string>() },
		});

		// Set the comments path for the Swagger JSON and UI.
		// we use reflection here.
		var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
		var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
		options.IncludeXmlComments(xmlPath);
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
	/// Add CORS policy for the project.
	/// </summary>
	/// <param name="services">services collection.</param>
	public static void AddCorsPolicy(this IServiceCollection services)
	{
	  // Setup CORS
	  var corsBuilder = new CorsPolicyBuilder();
	  corsBuilder.AllowAnyOrigin(); // For anyone access.
	  corsBuilder.AllowAnyMethod();
	  corsBuilder.AllowAnyHeader();
	  corsBuilder.AllowCredentials();

	  services.AddCors(options =>
	  {
		options.AddPolicy("SampleAppOrigin", corsBuilder.Build());
	  });

	  // use Cors globally.
	  services.Configure<MvcOptions>(options =>
	  {
		options.Filters.Add(new CorsAuthorizationFilterFactory("SampleAppOrigin"));
	  });
	}

	/// <summary>
	/// Add language support for the SampleApp Website.
	/// Currently two languages are there - english and french.
	/// </summary>
	/// <param name="services">services collection.</param>
	public static void AddLanguageSupport(this IServiceCollection services)
	{
	  // Add list of supported cultures
	  // here. Two languages are English
	  // and french.
	  services.AddLocalization(options => options.ResourcesPath = "Resources");

	  services.Configure<RequestLocalizationOptions>(
		  options =>
		  {
			var supportedCultures = new List<CultureInfo>
						{
							new CultureInfo("en-us"),
							new CultureInfo("fr-ca"),
						};

			// States the default culture for application. This will be used if no specific culture
			// can be determined for a given request.
			options.DefaultRequestCulture = new RequestCulture(culture: "en-us", uiCulture: "en-us");

			// This explicitly states which cultures our application supports [en, fr].
			// These are the cultures the app supports for formatting numbers, dates, etc.
			options.SupportedCultures = supportedCultures;

			// These are the cultures the app supports for UI strings, i.e. we have localized resources for.
			options.SupportedUICultures = supportedCultures;

			// You can change which providers are configured to determine the culture for requests, or even add a custom
			// provider with your own logic. The providers will be asked in order to provide a culture for each request,
			// and the first to provide a non-null result that is in the configured supported cultures list will be used.
			// By default, the following built-in providers are configured:
			// - QueryStringRequestCultureProvider, sets culture via "culture" and "ui-culture" query string values, useful for testing
			// - CookieRequestCultureProvider, sets culture via "ASPNET_CULTURE" cookie
			// - AcceptLanguageHeaderRequestCultureProvider, sets culture via the "Accept-Language" request header
			options.RequestCultureProviders.Insert(0, new AcceptLanguageHeaderRequestCultureProvider());
		  });
	}

	/// <summary>
	/// Add our auto mapper here.
	/// </summary>
	/// <param name="services">services collection.</param>
	/// <param name="configuration">configuration.</param>
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
