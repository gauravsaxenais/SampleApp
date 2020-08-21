// <copyright file="IChartService.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>
using System;
using MircomApi.BusinessObjects.Models.Chart;

namespace MircomApi.Services.Chart
{
  /// <summary>
  /// Chart Contract.
  /// </summary>
  public interface IChartService
  {
	#region Public methods
	/// <summary>
	/// GetChartDetails Method.
	/// </summary>
	/// <param name="reportGuid">The report unique identifier.</param>
	/// <returns></returns>
	ChartModel GetChartDetails(Guid reportGuid);
	/// <summary>
	/// Get interval from Reports table.
	/// </summary>
	/// <param name="reportGuid">The report unique identifier.</param>
	/// <returns></returns>
	//RefreshInterval GetRefreshInterval(Guid reportGuid);

	#endregion
  }
}
