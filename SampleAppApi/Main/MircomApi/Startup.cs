// <copyright file="Startup.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using System;
using System.IO;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Cors.Internal;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using MircomApi.BusinessObjects;
using MircomApi.DataAccess;
using MircomApi.DataAccess.Auth;
using MircomApi.Util.Helpers;
using MircomApi.WebApi.Configuration;

namespace MircomApi.WebApi
{
  /// <summary>
  /// Startup class.
  /// </summary>
  public class Startup
  {
	#region Constructors

	/// <summary>
	/// Initializes a new instance of the <see cref="Startup"/> class.
	/// </summary>
	/// <param name="config">config.</param>
	public Startup(IConfiguration config)
	{
	  Configuration = config;
	}
	#endregion

	#region Properties

	/// <summary>
	/// Gets Configuration.
	/// </summary>
	public IConfiguration Configuration { get; }
	#endregion

	#region Public Methods

	/// <summary>
	/// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
	/// </summary>
	/// <param name="app">app variable.</param>
	/// <param name="env">env variable.</param>
	public void Configure(IApplicationBuilder app, IHostingEnvironment env)
	{
	  if (env.IsDevelopment())
	  {
		app.UseDeveloperExceptionPage();
	  }
	  else
	  {
		// the default Hsts value is 30 days.
		app.UseHsts();
	  }

	  app.UseStaticFiles(new StaticFileOptions
	  {
		FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "stock")),
		RequestPath = "/stock",
	  });

	  app.UseSwagger();

	  // specifying the Swagger JSON endpoint.
	  app.UseSwaggerUI(c =>
	  {
		c.SwaggerEndpoint("/swagger/v1/swagger.json", Constants.Strings.ApplicationWideConstants.ApplicationName);
	  });

	  // use authentication
	  app.UseAuthentication();

	  // global CORS policy
	  app.UseCors("MircomOrigin");

	  app.UseHttpsRedirection();
	  app.UseMvc();
	}

	/// <summary>
	/// This method gets called by the runtime. Use this method to add services to the container.
	/// </summary>
	/// <param name="services">services collection.</param>
	/// <returns>IServiceProvider.</returns>
	public IServiceProvider ConfigureServices(IServiceCollection services)
	{
	  // Setup CORS
	  var corsBuilder = new CorsPolicyBuilder();
	  corsBuilder.AllowAnyOrigin(); // For anyone access.
	  corsBuilder.AllowAnyMethod();
	  corsBuilder.AllowAnyHeader();
	  corsBuilder.AllowCredentials();

	  services.AddCors(options =>
	  {
		options.AddPolicy("MircomOrigin", corsBuilder.Build());
	  });

	  // use Cors globally.
	  services.Configure<MvcOptions>(options =>
	  {
		options.Filters.Add(new CorsAuthorizationFilterFactory("MircomOrigin"));
	  });

	  services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1).AddControllersAsServices();

	  // get the connection string, email settings from appsettings.json
	  var connectionString = Configuration.GetConnectionString("MircomDatabaseConnection");
	  var emailSection = Configuration.GetSection("EmailSettings");
	  var jwtConfigurationSection = Configuration.GetSection(nameof(JwtIssuerOptions));

	  services.AddDbContext<TASConfigDBContext>(options =>
	  options.UseSqlServer(
	  connectionString, b => b.MigrationsAssembly(Constants.Strings.ApplicationWideConstants.ApplicationName)));

	  //// add email settings here
	  //services.AddOptions();
	  //services.Configure<EmailSettings>(emailSection);

	  // Add auto mapper here
	  services.AddAutoMapper(Configuration);

	  // Add swagger here using extension methods.
	  services.AddSwaggerService();

	  // add jwt configuration.
	  services.AddJwtConfiguration(jwtConfigurationSection);

	  // add our project related services.
	  services.AddCustomServices();

	  // Now register our services with Autofac container
	  var builder = new ContainerBuilder();

	  builder.Populate(services);
	  var container = builder.Build();

	  // Create the IServiceProvider based on the container.
	  return new AutofacServiceProvider(container);
	}

	#endregion
  }
}
