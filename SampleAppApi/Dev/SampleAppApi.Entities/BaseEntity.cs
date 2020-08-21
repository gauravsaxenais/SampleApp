using SampleAppApi.DataAccess.StateManagement;
using System.ComponentModel.DataAnnotations.Schema;

namespace SampleAppApi.Entities
{
  /// <summary>
  /// Base class to implement state in all child classes
  /// </summary>
  public class BaseEntity: IObjectState
  {
	/// <summary>
	/// This property is used only when this object is a child of an object collection 
	/// and you want to inform webApi to insert, update or delete this object regardless 
	/// of the action performed on the parent entity of this entity. 
	/// </summary>
	/// <remarks>State are defined in Interface IObjectState</remarks>
	[NotMapped]	
	public State State { get; set; }
  }
}
