// <copyright file="AccessPointStatusService.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Logging;
using MircomApi.BusinessObjects.Models.ObjectStatus;
using MircomApi.DataAccess;
using MircomApi.Entities;
using MircomApi.Util.Helpers;

namespace MircomApi.Services.AccessPointStatus
{
  /// <summary>
  /// Access point status service class.
  /// </summary>
  public class AccessPointStatusService : IAccessPointStatusService
  {
	#region Private Member Variables
	/// <summary>
	/// Initialize databse context variable.
	/// </summary>
	private readonly GenericUnitOfWork<TASConfigDBContext> _unitOfWork;
	/// <summary>
	/// Initialize logger variable.
	/// </summary>
	private readonly ILogger<AccessPointStatusService> _logger;
	#endregion

	#region Constructors
	/// <summary>
	/// Initializes the dependencies of services
	/// </summary>
	/// <param name="unitOfWork">Unit of work for repository</param>
	/// <param name="logger">Logger for Logging information</param>
	public AccessPointStatusService(GenericUnitOfWork<TASConfigDBContext> unitOfWork, ILogger<AccessPointStatusService> logger)
	{
	  _unitOfWork = unitOfWork;
	  _logger = logger;
	}
	#endregion

	#region Public Methods
	/// <summary>
	/// Get status list of access point.
	/// </summary>
	/// <param name="siteId"></param>
	/// <returns>Return list of object status.</returns>
	public List<ObjectStatusModel> GetListAccessPointStatus(int siteId)
	{
	  var objectStatus = new List<ObjectStatusModel>();
	  try
	  {
		//Get object status records.
		objectStatus = _unitOfWork.Repository<ObjectStatus>().Get(x => x.JobId == siteId && x.Deleted == false && (x.ObjectType == (byte)Enums.MapItemType.AccessPoint)).Result
					   .Select(y => new ObjectStatusModel
					   {
						 UTCTimeStamp = y.UtctimeStamp,
						 ObjectType = Enum.GetName(typeof(Enums.MapItemType), y.ObjectType),
						 ObjectId = y.ObjectId,
						 Status = y.Status,
						 Description = y.Description,
						 Data1 = y.StatusData1,
						 Data2 = y.StatusData2
					   }).ToList(); 
	  }
	  catch (Exception ex)
	  {
		_logger.LogError(ex, $"Exception Occurs at GetListAccessPointStatus method and exception Message is : {ex.Message}.");
	  }
	  return objectStatus;
	}
	#endregion
  }
}

