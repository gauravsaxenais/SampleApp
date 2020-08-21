// <copyright file="ResetPasswordModel.cs" company="SampleApp">
// Copyright (c) SampleApp. All rights reserved.
// </copyright>

using System.ComponentModel.DataAnnotations;
using SampleAppApi.BusinessObjects.Helpers;

namespace SampleAppApi.BusinessObjects.Models.Login
{
  public class ResetPasswordModel
  {
	#region Public Properties
	[Required]
	[StringLength(20, ErrorMessage = "Must be between 5 and 20 characters", MinimumLength = 5)]
	[RegularExpression("^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$", ErrorMessage = "Must be a valid email")]
	public string Email { get; set; }

	[Required(ErrorMessage = "New password required", AllowEmptyStrings = false)]
	[DataType(DataType.Password)]
	public string OldPassword { get; set; }

	[DataType(DataType.Password)]
	[NotEqual("OldPassword", ErrorMessage = "New password and old password must not match")]
	public string NewPassword { get; set; }

	[Required]
	public string Token { get; set; }
	#endregion
  }
}
