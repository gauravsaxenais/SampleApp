// <copyright file="ConnectDatabase.cs" company="SampleApp">
// Copyright (c) SampleApp. All rights reserved.
// </copyright>

using SampleAppApi.DataAccess;
using Microsoft.EntityFrameworkCore;

namespace SampleAppApi.UnitTest.Utility
{
  public static class ConnectDatabase
  {
	#region Public Methods
	public static GenericUnitOfWork<TASConfigDBContext> Connection(out TASConfigDBContext context)
	{
	   GenericUnitOfWork<TASConfigDBContext> _unitOfWork;
	   DbContextOptionsBuilder<TASConfigDBContext> builder = new DbContextOptionsBuilder<TASConfigDBContext>()
				 .EnableSensitiveDataLogging()
				 .UseSqlServer("Server=10.191.253.157\\SampleApp;Database=TASConfigDB20191205;UID=SampleApp;PWD=SampleApp;");

	    context = new TASConfigDBContext(builder.Options);
		context.Database.OpenConnection();
		context.Database.EnsureCreated();
	   _unitOfWork = new GenericUnitOfWork<TASConfigDBContext>(context);

		return _unitOfWork;
	}
	#endregion
  }
}
