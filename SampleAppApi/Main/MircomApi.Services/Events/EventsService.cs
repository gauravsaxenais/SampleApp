// <copyright file="EventsService.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Logging;
using MircomApi.BusinessObjects.Models.Events;
using MircomApi.DataAccess;
using MircomApi.Entities;

namespace MircomApi.Services.Events
{
  public class EventsService : IEventsService
  {
	#region Private Member Variables
	private readonly GenericUnitOfWork<TASConfigDBContext> _unitOfWork;
	private readonly ILogger<EventsService> _logger;
	private const int numOfItems = 1000;
	#endregion

	#region Constructors
	/// <summary>
	/// Initializes the dependencies of services
	/// </summary>
	/// <param name="unitOfWork">Unit of work for repository</param>
	/// <param name="logger">Logger for Logging information</param>
	public EventsService(GenericUnitOfWork<TASConfigDBContext> unitOfWork, ILogger<EventsService> logger)
	{
	  _unitOfWork = unitOfWork;
	  _logger = logger;
	}
	#endregion

	#region Public Methods

	/// <summary>
	/// Get Events
	/// </summary>
	/// <param name="eventRequestModel">Event Request Model</param>
	/// <returns></returns>
	public List<EventsModel> GetEvents(EventRequestModel eventRequestModel)
	{
	  List<EventsModel> eventsModelList;
	  try
	  {
		if (!string.IsNullOrWhiteSpace(eventRequestModel.Description))
		{
		  if (eventRequestModel.Severity.Count > 0)
		  {
			eventsModelList = (from job in _unitOfWork.Repository<Jobs>().Get(j => eventRequestModel.SiteIds.Contains(j.JobId.ToString())).Result
							   join ev in _unitOfWork.Repository<EventLogs>().Get(e => e.Description.Contains(eventRequestModel.Description) && eventRequestModel.Severity.Contains(e.Severity.ToString())).Result on job.JobId equals ev.JobId
							   join pnl in _unitOfWork.Repository<Panels>().Get(el => eventRequestModel.SiteIds.Contains(el.JobId.ToString())).Result on ev.PanelId equals pnl.PanelId
							   orderby ev.TimeStamp descending, ev.EventId descending
							   select new EventsModel
							   {
								 UTCTimeStamp = ev.TimeStamp,
								 EventType = ev.EventType,
								 Description = ev.Description,
								 PanelName = pnl.Name,
								 SiteName = job.Name,
								 ChannelGuid = ev.ChannelGuid,
								 MapGuid = ev.MapGuid,
								 Severity = ev.Severity,
								 LogType = ev.LogType,
								 Data1 = ev.Data1,
								 Data2 = ev.Data2,
								 Data3 = ev.Data3,
								 Data4 = ev.Data4,
								 PanelItemType = ev.PanelItemType,
								 PanelItemId = ev.PanelItemId
							   }).Take(numOfItems).ToList();
		  }
		  else
		  {
			eventsModelList = (from job in _unitOfWork.Repository<Jobs>().Get(j => eventRequestModel.SiteIds.Contains(j.JobId.ToString())).Result
							   join ev in _unitOfWork.Repository<EventLogs>().Get(e => e.Description.Contains(eventRequestModel.Description)).Result on job.JobId equals ev.JobId
							   join pnl in _unitOfWork.Repository<Panels>().Get(el => eventRequestModel.SiteIds.Contains(el.JobId.ToString())).Result on ev.PanelId equals pnl.PanelId
							   orderby ev.TimeStamp descending, ev.EventId descending
							   select new EventsModel
							   {
								 UTCTimeStamp = ev.TimeStamp,
								 EventType = ev.EventType,
								 Description = ev.Description,
								 PanelName = pnl.Name,
								 SiteName = job.Name,
								 ChannelGuid = ev.ChannelGuid,
								 MapGuid = ev.MapGuid,
								 Severity = ev.Severity,
								 LogType = ev.LogType,
								 Data1 = ev.Data1,
								 Data2 = ev.Data2,
								 Data3 = ev.Data3,
								 Data4 = ev.Data4,
								 PanelItemType = ev.PanelItemType,
								 PanelItemId = ev.PanelItemId
							   }).Take(numOfItems).ToList();
		  }
		}
		else
		{
		  if (eventRequestModel.Severity.Count > 0)
		  {
			eventsModelList = (from job in _unitOfWork.Repository<Jobs>().Get(j => eventRequestModel.SiteIds.Contains(j.JobId.ToString())).Result
							   join ev in _unitOfWork.Repository<EventLogs>().Get(e => eventRequestModel.Severity.Contains(e.Severity.ToString())).Result on job.JobId equals ev.JobId
							   join pnl in _unitOfWork.Repository<Panels>().Get(el => eventRequestModel.SiteIds.Contains(el.JobId.ToString())).Result on ev.PanelId equals pnl.PanelId
							   orderby ev.TimeStamp descending, ev.EventId descending
							   select new EventsModel
							   {
								 UTCTimeStamp = ev.TimeStamp,
								 EventType = ev.EventType,
								 Description = ev.Description,
								 PanelName = pnl.Name,
								 SiteName = job.Name,
								 ChannelGuid = ev.ChannelGuid,
								 MapGuid = ev.MapGuid,
								 Severity = ev.Severity,
								 LogType = ev.LogType,
								 Data1 = ev.Data1,
								 Data2 = ev.Data2,
								 Data3 = ev.Data3,
								 Data4 = ev.Data4,
								 PanelItemType = ev.PanelItemType,
								 PanelItemId = ev.PanelItemId
							   }).Take(numOfItems).ToList();
		  }
		  else
		  {
			eventsModelList = (from job in _unitOfWork.Repository<Jobs>().Get(j => eventRequestModel.SiteIds.Contains(j.JobId.ToString())).Result
							   join ev in _unitOfWork.Repository<EventLogs>().Get() on job.JobId equals ev.JobId
							   join pnl in _unitOfWork.Repository<Panels>().Get(el => eventRequestModel.SiteIds.Contains(el.JobId.ToString())).Result on ev.PanelId equals pnl.PanelId
							   orderby ev.TimeStamp descending, ev.EventId descending
							   select new EventsModel
							   {
								 UTCTimeStamp = ev.TimeStamp,
								 EventType = ev.EventType,
								 Description = ev.Description,
								 PanelName = pnl.Name,
								 SiteName = job.Name,
								 ChannelGuid = ev.ChannelGuid,
								 MapGuid = ev.MapGuid,
								 Severity = ev.Severity,
								 LogType = ev.LogType,
								 Data1 = ev.Data1,
								 Data2 = ev.Data2,
								 Data3 = ev.Data3,
								 Data4 = ev.Data4,
								 PanelItemType = ev.PanelItemType,
								 PanelItemId = ev.PanelItemId
							   }).Take(numOfItems).ToList();
		  }
		}
	  }
	  catch (Exception ex)
	  {
		eventsModelList = null;
		_logger.LogError(ex, ex.Message);
	  }

	  return eventsModelList;
	}
	#endregion
  }
}
