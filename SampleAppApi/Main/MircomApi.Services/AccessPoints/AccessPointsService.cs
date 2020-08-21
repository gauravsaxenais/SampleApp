// <copyright file="AccessPointsService.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Logging;
using MircomApi.BusinessObjects.Models.AccessPointsModel;
using MircomApi.DataAccess;
using MircomApi.Entities;
using MircomApi.Util.Helpers;

namespace MircomApi.Services.AccessPoint
{
  /// <summary>
  /// Access point Business Layer Service
  /// </summary>
  public class AccessPointsService : IAccessPointsService
  {
	#region Private Member Variables
	/// <summary>
	/// Initialise generic data context variable.
	/// </summary>
	private readonly GenericUnitOfWork<TASConfigDBContext> _unitOfWork;
	/// <summary>
	/// Initial logger variable.
	/// </summary>
	private readonly ILogger<AccessPointsService> _logger;
	#endregion

	#region Constructors

	/// <summary>
	/// Initializes the dependencies of services
	/// </summary>
	/// <param name="unitOfWork">unit of work for repository</param>
	/// <param name="logger">logger for Logging information</param>
	public AccessPointsService(GenericUnitOfWork<TASConfigDBContext> unitOfWork, ILogger<AccessPointsService> logger)
	{
	  _unitOfWork = unitOfWork;
	  _logger = logger;
	}
	#endregion

	#region Public Methods
	/// <summary>
	/// Get Access Points.
	/// </summary>
	/// <param name="siteId"></param>
	/// <param name="buildingId"></param>
	/// <returns></returns>
	public List<AccessPointsModel> GetListAccessPoints(int siteId)
	{
	  List<AccessPointsModel> accessPt = null;
	  try
	  {
		IEnumerable<AccessPointsModel> accptDetails = GetAccessPointDetails(siteId);
		if (accptDetails.NotNullAndEmpty())
		{
		  accessPt = new List<AccessPointsModel>();
		  accessPt = accptDetails.ToList();
		}
	  }
	  catch (Exception ex)
	  {
		_logger.LogError(ex, $"Exception occurs at GetAccessPoints method and exception Message is : {ex.Message}.");
	  }
	  return accessPt;
	}
	#endregion

	#region Private Methods
	/// <summary>
	/// Get details of access point on the basis of site id.
	/// </summary>
	/// <param name="siteId"></param>
	/// <returns></returns>
	private IEnumerable<AccessPointsModel> GetAccessPointDetails(int siteId)
	{
	  return from ap in _unitOfWork.Repository<AccessPoints>().Get(x => x.JobId == siteId).Result
			 join pnl in _unitOfWork.Repository<Panels>().Get(x => x.JobId == siteId).Result on ap.PanelId equals pnl.PanelId
			 join mi in _unitOfWork.Repository<MapItems>().Get(x => x.JobId == siteId && x.Type == (int)Enums.MapItemType.AccessPoint).Result on pnl.PanelGuid equals mi.PanelGuid
			 join mp in _unitOfWork.Repository<Maps>().Get(x => x.JobId == siteId).Result on mi.MapId equals mp.MapId
			 join ca in _unitOfWork.Repository<CameraAssociations>().Get(x => x.JobId == siteId).Result on new { id = (int)ap.AccessPointId, pnl.PanelId } equals new { id = ca.PanelItemId, ca.PanelId }
			 join cc in _unitOfWork.Repository<CameraChannels>().Get(x => x.JobId == siteId).Result on ca.ChannelId equals cc.ChannelId
			 group ap by new { ap.AccessPointId, ap.JobId, pnl.PanelGuid, mp.MapGuid, cc.ChannelGuid, ap.Name } into grp
			 select new AccessPointsModel
			 {
			   AccesspointId = grp.Key.AccessPointId,
			   SiteId = grp.Key.JobId,
			   PanelGuid = grp.Key.PanelGuid,
			   MapGuid = grp.Key.MapGuid,
			   ChannelGuid = grp.Key.ChannelGuid,
			   Name = grp.Key.Name
			 };
	}
  }
  #endregion
}

