// <copyright file="NotEqualAttribute.cs" company="SampleApp">
// Copyright (c) SampleApp. All rights reserved.
// </copyright>

using System.ComponentModel.DataAnnotations;

namespace SampleAppApi.BusinessObjects.Helpers
{
  /// <summary>
  /// This validation attribute checks 
  /// if two values entered are equal or not.
  /// </summary>
  public class NotEqualAttribute : ValidationAttribute
  {
	#region Private Properties
	/// <summary>
	/// The other value being compared with.
	/// </summary>
	private string OtherProperty { get; }
	#endregion

	#region Constructors
	/// <summary>
	/// This constructor initialises the OtherProperty.
	/// </summary>
	/// <param name="otherProperty"></param>
	public NotEqualAttribute(string otherProperty)
	{
	  OtherProperty = otherProperty;
	}
	#endregion

	#region Methods	
	/// <summary>
	/// This method checks if the two values are equal.
	/// If the values are equal, then the validation fails.
	/// This validationresult is used in ChangePassword to check
	/// if the old password and new password entered are same
	/// </summary>
	/// <param name="value">the value being passed from UI.</param>
	/// <param name="validationContext"></param>
	/// <returns></returns>
	protected override ValidationResult IsValid(object value, ValidationContext validationContext)
	{
	  // get other property value
	  var otherPropertyInfo = validationContext.ObjectType.GetProperty(OtherProperty);
	  var otherValue = otherPropertyInfo.GetValue(validationContext.ObjectInstance);

	  // verify values
	  if (value.ToString().Equals(otherValue.ToString()))
		return new ValidationResult($"{validationContext.MemberName} should not be equal to {OtherProperty}.");

	  return ValidationResult.Success;
	}
	#endregion
  }
}
