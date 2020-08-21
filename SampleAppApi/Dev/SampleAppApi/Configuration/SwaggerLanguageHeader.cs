// <copyright file="SwaggerLanguageHeader.cs" company="SampleApp">
// Copyright (c) SampleApp. All rights reserved.
// </copyright>

using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Options;
using Swashbuckle.AspNetCore.Swagger;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace SampleAppApi.WebApi.Configuration
{
  /// <summary>
  /// Language support for Swagger.
  /// </summary>
  public class SwaggerLanguageHeader : IOperationFilter
  {
	private readonly IServiceProvider _serviceProvider;

	/// <summary>
	/// Initializes a new instance of the <see cref="SwaggerLanguageHeader"/> class.
	/// </summary>
	/// <param name="serviceProvider">service provider.</param>
	public SwaggerLanguageHeader(IServiceProvider serviceProvider)
	{
	  _serviceProvider = serviceProvider;
	}

	/// <inheritdoc/>
	public void Apply(Operation operation, OperationFilterContext context)
	{
	  if (operation != null)
	  {
		if (operation.Parameters == null)
		{
		  operation.Parameters = new List<IParameter>();
		}

		operation.Parameters.Add(new NonBodyParameter
		{
		  Name = "Accept-Language",
		  In = "header",
		  Type = "string",
		  Description = "Supported languages",
		  Enum = (_serviceProvider.GetService(typeof(IOptions<RequestLocalizationOptions>)) as IOptions<RequestLocalizationOptions>)?
					.Value?.SupportedCultures?.Select(c => c.Name).ToList<object>(),
		  Required = false,
		});
	  }
	}
  }
}
