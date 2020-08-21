// <copyright file="IRepository.cs" company="SampleApp">
// Copyright (c) SampleApp. All rights reserved.
// </copyright>

using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace SampleAppApi.DataAccess
{
  /// <summary>
  /// Repository contract.
  /// </summary>
  /// <typeparam name="TEntity"></typeparam>
  public interface IRepository<TEntity> where TEntity : class
  {
	#region Public Methods
	/// <summary>
	/// Get db set.
	/// </summary>
	/// <returns></returns>
	IQueryable<TEntity> GetQuery();
	/// <summary>
	/// Get all records in memory.
	/// </summary>
	/// <returns></returns>
	IEnumerable<TEntity> Get();
	/// <summary>
	/// Get record in memory with no tracking.
	/// </summary>
	/// <returns></returns>
	IEnumerable<TEntity> GetWithNoTracking();
	/// <summary>
	/// Get dbSet with no tracking.
	/// </summary>
	/// <returns></returns>
	IQueryable<TEntity> GetQueryWithNoTracking();
	/// <summary>
	/// Get filtered record.
	/// </summary>
	/// <param name="filter"></param>
	/// <param name="orderBy"></param>
	/// <param name="includeProperties"></param>
	/// <returns></returns>
	Task<IEnumerable<TEntity>> Get(Expression<Func<TEntity, bool>> filter = null, Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null, string includeProperties = "");
	/// <summary>
	/// Get record using id.
	/// </summary>
	/// <param name="id"></param>
	/// <returns></returns>
	TEntity GetById(object id);
	/// <summary>
	/// Get async record using id.
	/// </summary>
	/// <param name="id"></param>
	/// <returns></returns>
	Task<TEntity> GetByIdAsync(object id);
	/// <summary>
	/// Insert record in DB.
	/// </summary>
	/// <param name="entity"></param>
	void Insert(TEntity entity);
	/// <summary>
	/// Insert list of records in DB.
	/// </summary>
	/// <param name="entities"></param>
	void Insert(IEnumerable<TEntity> entities);
	/// <summary>
	/// Update entity.
	/// </summary>
	/// <param name="entityToUpdate"></param>
	void Update(TEntity entityToUpdate);
	/// <summary>
	/// uppdatye entities
	/// </summary>
	/// <param name="entitiesToUpdate"></param>
	void Update(IEnumerable<TEntity> entitiesToUpdate);
	/// <summary>
	/// Delete object on the basis of id.
	/// </summary>
	/// <param name="id"></param>
	void Delete(object id);
	/// <summary>
	/// Delete object on the basis of ids.
	/// </summary>
	/// <param name="ids"></param>
	void Delete(IEnumerable<TEntity> ids);
	/// <summary>
	/// Delete entity.
	/// </summary>
	/// <param name="entityToDelete"></param>
	void DeleteLogical(TEntity entityToDelete);
	/// <summary>
	/// Delete entities.
	/// </summary>
	/// <param name="entityToDelete"></param>
	void Delete(TEntity entityToDelete);
	#endregion
  }
}
