// <copyright file="Startup.cs" company="SampleApp">
// Copyright (c) SampleApp. All rights reserved.
// </copyright>

using System;
using System.IO;
using System.Reflection;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Options;
using SampleAppApi.DataAccess;
using SampleAppApi.DataAccess.Auth;
using SampleAppApi.Util.Helpers;
using SampleAppApi.WebApi.Configuration;

namespace SampleAppApi.WebApi
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
	/// This is the middleware.
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

	  // Configure localization.
	  var locOptions = app?.ApplicationServices.GetService<IOptions<RequestLocalizationOptions>>();
	  app.UseRequestLocalization(locOptions.Value);

	  app.UseStaticFiles(new StaticFileOptions
	  {
		FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "stock")),
		RequestPath = "/stock",
	  });

	  app.UseSwagger();

	  // specifying the Swagger JSON endpoint.
	  app.UseSwaggerUI(c =>
	  {
		c.SwaggerEndpoint("/swagger/v1/swagger.json", "SampleApp API");
	  });

	  // use authentication
	  app.UseAuthentication();

	  // global CORS policy
	  app.UseCors("SampleAppOrigin");

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
	  // Add swagger here using extension methods.
	  services.AddSwaggerService();

	  // Add Cors policy here.
	  services.AddCorsPolicy();

	  // Add language support here.
	  // Default language is English. Supported
	  // languages are English and French.
	  services.AddLanguageSupport();

	  // Add controller
	  services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1)
						.AddDataAnnotationsLocalization(o =>
						{
						  var type = typeof(SharedResources);
						  var assemblyName = new AssemblyName(type.GetTypeInfo().Assembly.FullName);
						  var factory = services.BuildServiceProvider().GetService<IStringLocalizerFactory>();
						  var localizer = factory.Create("SharedResources", assemblyName.Name);
						  o.DataAnnotationLocalizerProvider = (t, f) => localizer;
						})
						.AddControllersAsServices();

	  // get the connection string, email settings from appsettings.json
	  var connectionString = Configuration.GetConnectionString("SampleAppDatabaseConnection");
	  var jwtConfigurationSection = Configuration.GetSection(nameof(JwtIssuerOptions));

	  services.AddDbContext<TASConfigDBContext>(options =>
	  options.UseSqlServer(
	  connectionString, b => b.MigrationsAssembly("SampleApp API")));

	  // Add auto mapper here
	  services.AddAutoMapper(Configuration);

	  // add jwt configuration.
	  services.AddJwtConfiguration(jwtConfigurationSection);

	  // add our project related services.
	  // change this method to inject more
	  // services.
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
