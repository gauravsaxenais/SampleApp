// <copyright file="CustomWebHostService.cs" company="SampleApp">
// Copyright (c) SampleApp. All rights reserved.
// </copyright>

using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Hosting.WindowsServices;

namespace SampleAppApi.WebApi
{
  #region CustomWebHostService

  /// <summary>
  /// CustomWebHostService.
  /// </summary>
  public class CustomWebHostService : WebHostService
  {
	/// <summary>
	/// Initializes a new instance of the <see cref="CustomWebHostService"/> class.
	/// default constructor.
	/// </summary>
	/// <param name="host">host.</param>
	public CustomWebHostService(IWebHost host)
	  : base(host)
	{
	}

	/// <summary>
	/// Onstarting.
	/// </summary>
	/// <param name="args">args.</param>
	protected override void OnStarting(string[] args)
	{
	  base.OnStarting(args);
	}

	/// <summary>
	/// Onstarted.
	/// </summary>
	protected override void OnStarted()
	{
	  base.OnStarted();
	}

	/// <summary>
	/// OnStopping.
	/// </summary>
	protected override void OnStopping()
	{
	  base.OnStopping();
	}
  }
  #endregion
}