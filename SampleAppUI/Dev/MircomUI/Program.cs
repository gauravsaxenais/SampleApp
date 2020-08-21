using System;
using System.IO;
using System.Linq;
using System.Diagnostics;
using System.ServiceProcess;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

namespace mircom_tx3_web
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
	  var config = new ConfigurationBuilder()
		  .SetBasePath(Directory.GetCurrentDirectory())
		  .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
		  .AddCommandLine(args)
		  .Build();

	  return WebHost.CreateDefaultBuilder(args)
		  .UseConfiguration(config)
		  .UseStartup<Startup>()
		  .Build();
	}

	/// <summary>
	/// BuildServiceWebHost.
	/// </summary>
	/// <param name="args">args from the command line.</param>
	/// <returns>Iwebhost.</returns>
	public static IWebHost BuildServiceWebHost(string[] args)
	{
	  try
	  {
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
			.Build();
	  }
	  catch (Exception)
	  {
		throw;
	  }
	  finally
	  {
	  }
	}
	#endregion

  }
}
