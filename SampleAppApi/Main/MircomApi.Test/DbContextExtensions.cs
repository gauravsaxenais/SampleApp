// <copyright file="DbContextExtensions.cs" company="Mircom">
// Copyright (c) Mircom. All rights reserved.
// </copyright>

using MircomApi.DataAccess;
using MircomApi.Entities;

namespace MircomApi.Test
{
  public static class DbContextExtensions
  {
	/// <summary>
	/// Extension method for seeding data with some mock values.
	/// </summary>
	/// <param name="dbContext"></param>
	public static void Seed(this TASConfigDBContext dbContext)
	{
	  // Add entities for DbContext instance

	  dbContext.Users.Add(new Users
	  {
		UserId = 13,
		Name = "administrator",
		Password = "test123",
		Active = 1,
		Rights = -1
	  });

	  dbContext.Users.Add(new Users
	  {
		UserId = 17,
		Name = "user1",
		Password = "test12345",
		Active = 1,
		Rights = 1099645845760
	  });
	}
  }
}