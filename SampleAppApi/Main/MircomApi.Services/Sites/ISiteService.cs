// <copyright file="ISiteService.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using System;
using System.Collections.Generic;
using System.Text;
using MircomApi.BusinessObjects.Models.Site;

/// <summary>
/// Site service contract class
/// </summary>
namespace MircomApi.Services.Sites
{
  public interface ISiteService
  {
	#region Public Methods
	/// <summary>
	/// Site Contract
	/// </summary>
	/// <returns>All sites.</returns>
	List<SiteDetailsModel> GetSites();
	#endregion
  }
}
