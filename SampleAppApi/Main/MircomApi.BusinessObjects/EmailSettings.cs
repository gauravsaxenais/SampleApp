// <copyright file="EmailSettings.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

namespace MircomApi.BusinessObjects
{
  public class EmailSettings
  {
	#region Public Properties

	/// <summary>
	/// Field indicating MailServer
	/// </summary>
	public string MailServer { get; set; }

	/// <summary>
	/// The port where to connect to the mail server
	/// </summary>
	public int MailPort { get; set; }

	/// <summary>
	/// The name of the sender.
	/// </summary>
	public string SenderName { get; set; }

	/// <summary>
	/// email address of the sender.
	/// </summary>
	public string Sender { get; set; }

	/// <summary>
	/// Password of the sender.
	/// </summary>
	public string Password { get; set; }
	#endregion
  }
}
