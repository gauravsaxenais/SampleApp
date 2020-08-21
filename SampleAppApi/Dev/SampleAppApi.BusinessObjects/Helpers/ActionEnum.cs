// <copyright file="ActionEnums.cs" company="SampleApp">
// Copyright (c) SampleApp. All rights reserved.
// </copyright>

namespace SampleAppApi.BusinessObjects.Helpers
{
  /// <summary>
  /// This class provides Action enumed which can be performed on an entity.
  /// New entity can be added, existing entity can be updated
  /// and an entity can be deleted.
  /// None indicates no action to be taken.
  /// </summary>
  public class ActionEnums
  {
	// ActionType can be of 4 types
	// None = 0, Create = 1, Update = 2, Delete = 3.
	// These types help in identifying which entities are
	// to be added, updated or deleted. None indicates no action.
	public enum ActionType
	{
	  None,
	  Create,
	  Update,
	  Delete
	}

	/// <summary>
	/// Interval type can be of three types second, minutes, hours
	/// seconds = 0
	/// minutes = 1
	/// hours   =  2
	/// This will help in converting interval of any type to seconds and insert in interval column in database.
	/// </summary>
	public enum IntervalType
	{
	  Seconds,
	  Minutes,
	  Hours,
	  Day
	}

	/// <summary>
	/// It contains duration name
	/// </summary>
	public enum DurationName
	{
	  Last10minutes = 1,
	  Last1hour = 2,
	  Last24hours = 3,
	  Yesterday = 4,
	  Custom = 5,
	}

	public enum CustomInterval
	{
	  Day_1 = 86400,
	  Hours_1 = 3600,
	  Hours_2 = 7200,
	  Hours_3 = 10800,
	  Minutes_5 = 300,
	  Minutes_6 = 360,
	  Minutes_7 = 420,
	  Minutes_8 = 480,
	  Minutes_9 = 540,
	  Minutes_10 = 600,
	  Seconds_30 = 30,
	  Seconds_60 = 60,
	  Seconds_120 = 120
	}
	public enum CustomEventType
	{
	  WholePanel,
	  Input,
	  None,
	}

	public enum IOCircuitsCasInput : byte
	{

	  // Inputs items in case of "ALL" option.
	  Input1 = 0,
	  Input2 = 1,
	  Input3 = 2,
	  Input4 = 3,
	  Input5 = 4,
	  Input6 = 5,
	  Input7 = 6,
	  Input8 = 7
	}
  }
}
