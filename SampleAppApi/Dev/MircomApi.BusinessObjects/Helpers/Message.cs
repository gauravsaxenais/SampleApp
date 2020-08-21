// <copyright file="Message.cs" company="SampleApp">
// Copyright (c) SampleApp. All rights reserved.
// </copyright>

using System.Net;
using Microsoft.AspNetCore.WebUtilities;

namespace SampleAppApi.BusinessObjects.Helpers
{
  /// <summary>
  /// This class is reponsible for getting a 
  /// message and description.
  /// </summary>
  public class Message
  {
	#region Constructors

	/// <summary>
	/// This constructor accepts a HttpStatusCode and 
	/// initialises a description from the GetReasonPhrase method.
	/// </summary>
	/// <param name="messageCode"></param>
	public Message(HttpStatusCode messageCode)
	{
	  MessageCode = messageCode;
	  Description = ReasonPhrases.GetReasonPhrase((int)MessageCode);
	}

	/// <summary>
	/// This constructor is used for passing in a message code
	/// and a custom description.
	/// </summary>
	/// <param name="messageCode"></param>
	/// <param name="description"></param>
	public Message(HttpStatusCode messageCode, string description)
	{
	  MessageCode = messageCode;
	  Description = description;
	}
	#endregion

	#region Public Properties	
	/// <summary>
	/// The Message code in order to communicate with UI
	/// </summary>
	public HttpStatusCode MessageCode { get; set; }
	
	/// <summary>
	///The description of the Message 
	/// </summary>
	public string Description { get; set; }
	#endregion
  }
}
