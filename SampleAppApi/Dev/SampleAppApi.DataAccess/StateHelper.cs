using Microsoft.EntityFrameworkCore;
using SampleAppApi.DataAccess.StateManagement;
using System;
using System.Collections.Generic;
using System.Text;

namespace SampleAppApi.DataAccess
{
  /// <summary>
  /// State changes helping functions
  /// </summary>
  class StateHelper
  {
	/// <summary>
	/// Set the state change values
	/// </summary>
	/// <param name="state">Current state value</param>
	/// <returns>Updated state values</returns>
	public static EntityState ConvertState(State state)
	{
	  switch (state)
	  {
		case State.Added:
		  return EntityState.Added;
		case State.Modified:
		  return EntityState.Modified;
		case State.Deleted:
		  return EntityState.Deleted;
		case State.Unchanged:
		  return EntityState.Unchanged;
		default:
		  return EntityState.Detached;
	  }
	}
  }
}
