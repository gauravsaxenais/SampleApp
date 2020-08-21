// <copyright file="ChartService.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>
using AutoMapper;
using Microsoft.Extensions.Logging;
using MircomApi.BusinessObjects.Models.Chart;
using MircomApi.DataAccess;
using MircomApi.Entities;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MircomApi.Services.Chart
{
  /// <summary>
  /// Charts Business Layer Service
  /// </summary>
  public class ChartService : IChartService
  {
	#region Private Member Variables
	private readonly GenericUnitOfWork<TASConfigDBContext> _UnitOfWork;
	private readonly ILogger<ChartService> _logger;
	private readonly IMapper _mapper;
	#endregion

	#region Constructors
	/// <summary>
	/// Initializes the dependencies of services.
	/// </summary>
	/// <param name="unitOfWork"></param>
	/// <param name="logger"></param>
	/// <param name="mapper"></param>
	public ChartService(GenericUnitOfWork<TASConfigDBContext> unitOfWork, ILogger<ChartService> logger, IMapper mapper)
	{
	  _UnitOfWork = unitOfWork;
	  _logger = logger;
	  _mapper = mapper;
	}
	#endregion

	#region Public Methods
	/// <summary>
	/// Get chart model.
	/// </summary>
	/// <param name="reportGuid"></param>
	/// <returns>Chart object</returns>
	public ChartModel GetChartDetails(Guid reportGuid)
	{
	  ChartModel chartDetails = new ChartModel();
	  int counter = 0;
	  try
	  {

		var evntLogs = from repo in _UnitOfWork.Repository<Reports>().Get(x => x.ReportGuid == reportGuid).Result
					   join evnt in _UnitOfWork.Repository<EventLogs>().Get().Where(x => x.TimeStamp <= DateTime.Now && x.TimeStamp >= DateTime.Now.AddDays(-30)) on repo.EventType equals evnt.EventType
					   orderby evnt.TimeStamp
					   group evnt by new { evnt.TimeStamp.Date, repo.Title, repo.Interval } into grp
					   select new
					   {
						 ReportTitle = grp.Key.Title,
						 RefreshInterval = grp.Key.Interval,
						 Label = grp.Key.Date.ToString("dd"),
						 Series = grp.Count()
					   };

		chartDetails.Title = evntLogs.Select(x => x.ReportTitle).FirstOrDefault().ToString();
		chartDetails.RefreshInterval = evntLogs.Select(x => x.RefreshInterval).FirstOrDefault();

		List<List<int>> lstSeries = new List<List<int>>() { evntLogs.Select(x => x.Series).ToList() };
		List<string> lstLabels = evntLogs.Select(x => x.Label).ToList();
		chartDetails.PlotDetail.Series = new List<List<int>>();
		chartDetails.PlotDetail.Series.Add(new List<int>());
		chartDetails.PlotDetail.Labels = new List<string>();

		if (lstLabels.Count >= 10)
		{
		  counter = lstLabels.Count - 10;
		}

		for (int temp = counter; temp < lstLabels.Count; temp++)
		{
		  chartDetails.PlotDetail.Series[0].Add(lstSeries[0][temp]);
		  chartDetails.PlotDetail.Labels.Add(lstLabels[temp].ToString());
		}
	  }
	  catch (Exception ex)
	  {
		_logger.LogError(ex, $"Exception occurs at GetChartDetails method and exception Message is : {ex.Message}.");
	  }
	  return chartDetails;
	}

	#endregion
  }
}
