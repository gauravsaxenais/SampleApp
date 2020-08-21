namespace SampleAppApi.DataAccess
{
	/// <summary>
	/// Perform Database context operations
	/// </summary>
	public partial class TASConfigDBContext
  {
	/// <summary>
	/// Save the changes in the database
	/// </summary>
	/// <returns></returns>
	public override int SaveChanges()
	{	  
	  this.ApplyStateChanges();
	  return base.SaveChanges();
	}
  }
}
