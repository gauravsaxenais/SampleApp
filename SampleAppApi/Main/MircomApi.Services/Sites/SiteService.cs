// <copyright file="SiteService.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Microsoft.Extensions.Logging;
using MircomApi.BusinessObjects.Models.Site;
using MircomApi.DataAccess;
using MircomApi.Entities;

namespace MircomApi.Services.Sites
{
  /// <summary>
  ///Site Business Layer Service
  /// </summary>
  public class SiteService : ISiteService
  {
	#region Private Member Variables
	/// <summary>
	/// Initialise generic data context variable.
	/// </summary>
	private readonly GenericUnitOfWork<TASConfigDBContext> _unitOfWork;
	/// <summary>
	/// Initial logger variable.
	/// </summary>
	private readonly ILogger<SiteService> _logger;
	/// <summary>
	/// Initialise mapper variable.
	/// </summary>
	private readonly IMapper _mapper;
	#endregion

	#region Constructors

	/// <summary>
	/// Initializes the dependencies of services
	/// </summary>
	/// <param name="unitOfWork">unit of work for repository</param>
	/// <param name="logger">logger for Logging information</param>
	/// <param name="mapper">logger for Logging information</param>
	public SiteService(GenericUnitOfWork<TASConfigDBContext> unitOfWork, ILogger<SiteService> logger, IMapper mapper)
	{
	  _unitOfWork = unitOfWork;
	  _logger = logger;
	  _mapper = mapper;
	}
	#endregion

	#region Public methods
	/// <summary>
	/// Get sites details.
	/// </summary>
	/// <returns>List of all sites.</returns>
	public List<SiteDetailsModel> GetSites()
	{
	  //initialize sitedetailmodel object of list type.
	  List<SiteDetailsModel> siteDetails = null;
	 
	  try
	  {
		// Get all sites details.
		siteDetails = GetAllSites();
	  }
	  catch (Exception ex)
	  {
		//log error message in mircomlogdb.
		_logger.LogError(ex, $"Exception occurs at GetAllSites method and exception Message is : {ex.Message}.");
	  }
	  //return list of sites.
	  return siteDetails;
	}
	#endregion

	#region Private methods
	/// <summary>
	/// Get details of all sites.
	/// </summary>
	/// <returns>gives list of all sites.</returns>
	private List<SiteDetailsModel> GetAllSites()
	{
	  List<SiteDetailsModel> siteDetails;
	  List<Jobs> jobDetails = _unitOfWork.Repository<Jobs>().Get().ToList();
	  // mapping details with data transfer object.
	  siteDetails = _mapper.Map<List<Jobs>, List<SiteDetailsModel>>(jobDetails);
	  return siteDetails;
	}
	#endregion
  }
}
