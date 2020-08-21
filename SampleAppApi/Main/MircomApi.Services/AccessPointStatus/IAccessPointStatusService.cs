// <copyright file="IAccessPointStatusService.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using System.Collections.Generic;
using MircomApi.BusinessObjects.Models.ObjectStatus;

namespace MircomApi.Services.AccessPointStatus
{
  /// <summary>
  /// Access point status service contract.
  /// </summary>
  public interface IAccessPointStatusService
  {
	/// <summary>
	/// Get access point status.
	/// </summary>
	/// <param name="siteId"></param>
	/// <returns></returns>
    List<ObjectStatusModel> GetListAccessPointStatus(int siteId);
  }
}
