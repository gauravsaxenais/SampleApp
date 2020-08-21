// <copyright file="EventsService.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using MircomApi.BusinessObjects.Models.Events;
using System.Collections.Generic;

namespace MircomApi.Services.Events
{
  /// <summary>
  /// Events Contact
  /// </summary>
  public interface IEventsService
  {
	#region Public Methods
	/// <summary>
	/// Get All Events
	/// </summary>
	/// <returns>All events list</returns>
	List<EventsModel> GetEvents(EventRequestModel eventRequestModel);
	#endregion
  }
}
