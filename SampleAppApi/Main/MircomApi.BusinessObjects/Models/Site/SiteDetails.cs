// <copyright file="SiteDetails.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using System;

namespace MircomApi.BusinessObjects.Models.Site
{
  /// <summary>
  /// Site details model 
  /// </summary>
  public class SiteDetailsModel
  {
	#region Public Properties
	/// <summary>
	/// It contains Id.
	/// </summary>
	public int ID { get; set; }
	/// <summary>
	/// It contains site guid.
	/// </summary>
	public Guid SiteGuid  { get; set; }
	/// <summary>
	/// It contains name.
	/// </summary>
	public string Name { get; set; }
	/// <summary>
	/// It contains version.
	/// </summary>
	public short Version { get; set; }
	/// <summary>
	/// It contains address.
	/// </summary>
	public string  Address { get; set; }
	/// <summary>
	/// It contains ma[p cordinates.
	/// </summary>
	public string MapCoordinates { get; set; }
	/// <summary>
	/// It contains city name.
	/// </summary>
	public string City { get; set; }
	/// <summary>
	/// It contains Province name.
	/// </summary>
	public string Province { get; set; }
	/// <summary>
	/// It contains country name.
	/// </summary>
	public string Country { get; set; }
	/// <summary>
	/// It contains Timezone.
	/// </summary>
	public string Timezone { get; set; }
	/// <summary>
	/// It contains createdby details.
	/// </summary>
	public string CreatedBy { get; set; }
	/// <summary>
	/// It contains ModifiedBy details.
	/// </summary>
	public string ModifiedBy { get; set; }
	/// <summary>
	/// It contains ConfigVersion details.
	/// </summary>
	public short ConfigVersion { get; set; }
	/// <summary>
	/// It contains UseLongName.
	/// </summary>
	public bool? UseLongName { get; set; }
	/// <summary>
	/// It contains LanguageTextId details.
	/// </summary>
	public string LanguageTextId { get; set; }
	/// <summary>
	/// It contains DaylightSaving details.
	/// </summary>
	public bool? DaylightSaving { get; set; }
	#endregion
  }
}



