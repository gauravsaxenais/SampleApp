// <copyright file="Program.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using System;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using NLog.Web;

namespace MircomApi.WebApi
{
  /// <summary>
  /// Driver class.
  /// Middleware services are integrated here.
  /// </summary>
  public static class Program
  {
	#region Public Methods

	/// <summary>
	/// Represents entry point in the application.
	/// </summary>
	/// <param name="args">args array.</param>
	public static void Main(string[] args)
	{
	  // NLog: setup the logger first to catch all errors
	  var logger = NLogBuilder.ConfigureNLog("nlog.config").GetCurrentClassLogger();
	  try
	  {
		logger.Debug("init main");
		CreateWebHostBuilder(args).Build().Run();
	  }
	  catch (Exception ex)
	  {
		// NLog: catch setup errors
		logger.Error(ex, "Stopped program because of exception");
		throw;
	  }
	  finally
	  {
		// Ensure to flush and stop internal timers/threads before application-exit (Avoid segmentation fault on Linux)
		NLog.LogManager.Shutdown();
	  }
	}

	/// <summary>
	/// CreateWebHostBuilder method.
	/// </summary>
	/// <param name="args">default.</param>
	/// <returns>null.</returns>
	public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>

		  WebHost.CreateDefaultBuilder(args)
				  .UseKestrel()
				  .UseIISIntegration()
				  .UseStartup<Startup>()
				  .ConfigureLogging(logging =>
				  {
					/* setup logging */
					logging.ClearProviders();
					logging.SetMinimumLevel(LogLevel.Trace);
				  })
				  .UseNLog();  // NLog: setup NLog for Dependency injection
  }
  #endregion
}
