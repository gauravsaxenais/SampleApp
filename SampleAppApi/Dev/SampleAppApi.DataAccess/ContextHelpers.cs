using Microsoft.EntityFrameworkCore;
using SampleAppApi.DataAccess.StateManagement;

namespace SampleAppApi.DataAccess
{
	/// <summary>
	/// Database context hellper functions
	/// </summary>
	public static class ContextHelpers
  {
	/// <summary>
	/// Apply the state changes in the database and set the state revert to unchanged after all operations. 
	/// </summary>
	/// <param name="context"></param>
	public static void ApplyStateChanges(this DbContext context)
	{
	  foreach (var entry in context.ChangeTracker.Entries<IObjectState>())
	  {
		IObjectState stateInfo = entry.Entity;
		//Set the Entity's EntityState property only if StateManagement.State is set. 
		// else the Insert,Update or delete will e performed by the state of the value of the EntityState property.
		if (stateInfo.State != default(State))
		{
		  entry.State = StateHelper.ConvertState(stateInfo.State);
		  stateInfo.State = State.Unchanged; //Set the Genocea.DataAccess.StateManagement.state to State.Unchanged 
											 //to prevent saving the same entity during next SaveChanges() call.
		}
	  }
	}
  }
}
