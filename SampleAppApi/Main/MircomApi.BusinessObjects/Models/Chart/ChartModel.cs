// <copyright file="ChartModel.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

namespace MircomApi.BusinessObjects.Models.Chart
{
  /// <summary>
  /// Chart data model.
  /// </summary>
  public class ChartModel
  {
	#region  Constructor
	/// <summary>
	/// ChartModel Contructor
	/// </summary>
	public ChartModel()
	{
	  PlotDetail = new PlotDetails();
	}
	#endregion

	#region Public Properties
	/// <summary>
	/// Get and Set Title of chart.
	/// </summary>
	public string Title { get; set; }

	/// <summary>
	/// It contains refresh time.
	/// </summary>
	public int RefreshInterval { get; set; }

	/// <summary>
	/// It contains X and Y axis details.
	/// </summary>
	public PlotDetails PlotDetail { get; set; }
	#endregion
  }
}
