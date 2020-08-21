// <copyright file="Program.cs" company="SampleApp">
// Copyright (c) SampleApp. All rights reserved.
// </copyright>

using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.ServiceProcess;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NLog.Web;

namespace SampleAppApi.WebApi
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
	  if (Debugger.IsAttached || args.Contains("--console"))
	  {
		BuildWebHost(args).Run();
	  }
	  else
	  {
		var webHost = BuildServiceWebHost(args);

		var webHostService = new CustomWebHostService(webHost);
		ServiceBase.Run(webHostService);
	  }
	}

	/// <summary>
	/// Build web host.
	/// </summary>
	/// <param name="args">args from command line.</param>
	/// <returns>iwebhost.</returns>
	public static IWebHost BuildWebHost(string[] args)
	{
	  var logger = NLogBuilder.ConfigureNLog("nlog.config").GetCurrentClassLogger();
	  try
	  {
		// logger.Debug("init main");
		var config = new ConfigurationBuilder()
		 .SetBasePath(Directory.GetCurrentDirectory())
		 .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
		 .AddCommandLine(args)
		 .Build();
		var pathToContentRoot = Directory.GetCurrentDirectory();
		JObject hosting = JsonConvert.DeserializeObject<JObject>(File.ReadAllText($"{pathToContentRoot}/appsettings.json"));
		return WebHost.CreateDefaultBuilder(args)
			.UseConfiguration(config)
			.UseContentRoot(pathToContentRoot)
			.UseStartup<Startup>()
			.ConfigureLogging(logging =>
			{
			  /* setup logging */
			  logging.ClearProviders();
			  logging.SetMinimumLevel(LogLevel.Trace);
			})
			 .UseNLog()
			.Build();
	  }
	  catch (Exception ex)
	  {
		// NLog: catch setup errors
		logger.Error(ex, "Stopped program because of exception");
		throw;
	  }
	}

	/// <summary>
	/// BuildServiceWebHost.
	/// </summary>
	/// <param name="args">args from the command line.</param>
	/// <returns>Iwebhost.</returns>
	public static IWebHost BuildServiceWebHost(string[] args)
	{
	  // NLog: setup the logger first to catch all errors
	  var logger = NLogBuilder.ConfigureNLog("nlog.config").GetCurrentClassLogger();
	  try
	  {
		// logger.Debug("init main");
		var isService = !(Debugger.IsAttached || args.Contains("--console"));
		var pathToContentRoot = Directory.GetCurrentDirectory();
		var webHostArgs = args.Where(arg => arg != "--console").ToArray();

		if (isService)
		{
		  var processModule = Process.GetCurrentProcess().MainModule;
		  if (processModule != null)
		  {
			var pathToExe = processModule.FileName;
			pathToContentRoot = Path.GetDirectoryName(pathToExe);
			Directory.SetCurrentDirectory(pathToContentRoot);
		  }
		}

		JObject hosting = JsonConvert.DeserializeObject<JObject>(File.ReadAllText($"{pathToContentRoot}/appsettings.json"));
		return WebHost.CreateDefaultBuilder(webHostArgs)
			.UseUrls(hosting.Value<string>("server.urls"))
			.UseContentRoot(pathToContentRoot)
			.UseStartup<Startup>()
			.ConfigureLogging(logging =>
			{
			  /* setup logging */
			  logging.ClearProviders();
			  logging.SetMinimumLevel(LogLevel.Trace);
			})
			.UseNLog() // NLog: setup NLog for Dependency injection
			.Build();
	  }
	  catch (Exception ex)
	  {
		// NLog: catch setup errors
		logger.Error(ex, "Stopped program because of exception");
		throw;
	  }
	}
	#endregion
  }
}
