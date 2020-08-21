// <copyright file="DbContextMocker.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using MircomApi.DataAccess;
using System;

namespace MircomApi.Test
{
  public static class DbContextMocker
  {
	/// <summary>
	/// Creates a mock dbcontext for inmemory database.
	/// It also populates some test values using seed method.
	/// </summary>
	/// <returns></returns>
	public static TASConfigDBContext GetMircomConfigDbContext()
	{
	  // Create options for DbContext instance
	  var options = GetDbOptionsBuilder().Options;

	  // Create instance of DbContext
	  var dbContext = new TASConfigDBContext(options);

	  // Add entities in memory
	  dbContext.Seed();

	  return dbContext;
	}

	/// <summary>
	/// This method helps create options for an inmemory database.
	/// </summary>
	/// <returns></returns>
	private static DbContextOptionsBuilder<TASConfigDBContext> GetDbOptionsBuilder()
	{
	  // The key to keeping the databases unique and not shared is 
	  // generating a unique db name for each.
	  string dbName = Guid.NewGuid().ToString();

	  // Create a fresh service provider, and therefore a fresh 
	  // InMemory database instance.
	  var serviceProvider = new ServiceCollection()
		  .AddEntityFrameworkInMemoryDatabase()
		  .BuildServiceProvider();

	  // Create a new options instance telling the context to use an
	  // InMemory database and the new service provider.
	  var builder = new DbContextOptionsBuilder<TASConfigDBContext>();
	  builder.UseInMemoryDatabase(dbName)
		  .UseInternalServiceProvider(serviceProvider);

	  return builder;
	}
  }
}
