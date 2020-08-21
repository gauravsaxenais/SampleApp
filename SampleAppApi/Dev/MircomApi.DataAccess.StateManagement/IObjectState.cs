namespace SampleAppApi.DataAccess.StateManagement
{
  public interface IObjectState
  {
	/// <summary>
	/// Gets and Sets object State.
	/// </summary>
	State State { get; set; }
  }

  /// <summary>
  /// The State enum.
  /// </summary>
  public enum State
  {
	Unchanged = 1000,
	Added = 2000,
	Modified = 3000,
	Deleted = 4000
  }
}
