// <copyright file="CommonMethods.cs" company="SampleApp">
// Copyright (c) SampleApp. All rights reserved.
// </copyright>

using System;

namespace SampleAppApi.Util.Helpers
{
  /// <summary>
  /// This class contains all the methods
  /// which can be used in other classes.
  /// The class should not have any fields or properties. 
  /// In case, a single instance of some object needs to be 
  /// shared across the code, in which case, make a static read-only property. 
  /// </summary>
  public static class CommonMethods
  {
	/// <summary>
	/// This method checks if daylight saving is in effect for the
	/// current locale. 
	/// </summary>
	/// <returns></returns>
	public static bool IsDayLightSavingTime()
	{
	  TimeZoneInfo localZone = TimeZoneInfo.Local;
	  DateTime myTime = DateTime.Now;

	  bool isDayLight = TimeZoneInfo.Local.IsDaylightSavingTime(myTime);
	  return isDayLight;
	}
  }
}
