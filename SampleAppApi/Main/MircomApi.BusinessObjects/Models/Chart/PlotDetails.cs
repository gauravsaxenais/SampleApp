// <copyright file="PlotDetails.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using System.Collections.Generic;

namespace MircomApi.BusinessObjects.Models.Chart
{
  /// <summary>
  /// Plot details class.
  /// </summary>
  public class PlotDetails
  {
	#region Public Properties
	/// <summary>
	/// It represent X-axis on chart.
	/// </summary>
	public List<string> Labels { get; set; }

	/// <summary>
	/// It contains Y-axis on chart.
	/// </summary>
	public List<List<int>> Series { get; set; }
	#endregion
  }
}
