// <copyright file="GenericRepository.cs" company="SampleApp">
// Copyright (c) SampleApp. All rights reserved.
// </copyright>

using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace SampleAppApi.DataAccess
{
  /// <summary>
  /// Generic database repository
  /// </summary>
  /// <typeparam name="TEntity">Entity of database</typeparam>
  public class GenericRepository<TEntity> : IRepository<TEntity> where TEntity : class
  {
	#region Private Member Variables

	/// <summary>
	/// Db context.
	/// </summary>
	private readonly DbContext _context;

	/// <summary>
	/// Dbset.
	/// </summary>
	private DbSet<TEntity> _dbSet;
	#endregion

	#region Constructors

	/// <summary>
	/// Initialises a generic repository with a dbcontext.
	/// Instead of creating repository for getting every data,
	/// generic repository is being used.
	/// </summary>
	/// <param name="context"></param>
	public GenericRepository(DbContext context)
	{
	  _context = context;
	  _dbSet = context.Set<TEntity>();
	}
	#endregion

	#region Public Methods
	/// <summary>
	/// Get records from database using filters.
	/// </summary>
	/// <param name="filter"></param>
	/// <param name="orderBy"></param>
	/// <param name="includeProperties"></param>
	/// <returns>Return filtered records.</returns>
	public virtual async Task<IEnumerable<TEntity>> Get(Expression<Func<TEntity, bool>> filter = null, Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
	   string includeProperties = "")
	{
	  IQueryable<TEntity> query = _dbSet;

	  if (filter != null)
	  {
		query = query.Where(filter);
	  }

	  foreach (var includeProperty in includeProperties.Split
		  (new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
	  {
		query = query.Include(includeProperty);
	  }

	  if (orderBy != null)
	  {
		return await orderBy(query).ToListAsync<TEntity>();
	  }

	  return await query.ToListAsync<TEntity>();
	}
	/// <summary>
	/// Get list of records from database.
	/// </summary>
	/// <returns>Return list of records.</returns>
	public virtual IEnumerable<TEntity> Get()
	{
	  IQueryable<TEntity> query = _dbSet;
	  return query.ToList();
	}
	/// <summary>
	/// Get dbset.
	/// </summary>
	/// <returns>Return dbset.</returns>
	public virtual IQueryable<TEntity> GetQuery()
	{
	  return _dbSet;
	}
	/// <summary>
	/// Get list of records with no tracking.
	/// </summary>
	/// <returns>Return list with no tracking.</returns>
	public virtual IEnumerable<TEntity> GetWithNoTracking()
	{
	  IQueryable<TEntity> query = _dbSet;
	  return query.AsNoTracking<TEntity>().ToList();
	}

	/// <summary>
	/// Get dbset with no tracking.
	/// </summary>
	/// <returns>Return dbset with no tracking.</returns>
	public virtual IQueryable<TEntity> GetQueryWithNoTracking()
	{
	  return _dbSet.AsNoTracking<TEntity>();
	}
	/// <summary>
	/// Find record by id in DB.
	/// </summary>
	/// <param name="id"></param>
	/// <returns>Return record by id.</returns>
	public virtual TEntity GetById(object id)
	{
	  return _dbSet.Find(id);
	}
	/// <summary>
	/// Find record by id in DB asyncroniously.
	/// </summary>
	/// <param name="id"></param>
	/// <returns>Return async record by id.</returns>
	public virtual async Task<TEntity> GetByIdAsync(object id)
	{
	  return await _dbSet.FindAsync(id);
	}
	/// <summary>
	///  Generic method to insert record in DB.
	/// </summary>
	/// <param name="entity"></param>
	public virtual void Insert(TEntity entity)
	{
	  _dbSet.Add(entity);
	}
	/// <summary>
	/// Generic method to insert records in DB.
	/// </summary>
	/// <param name="entities"></param>
	public virtual void Insert(IEnumerable<TEntity> entities)
	{
	  _dbSet.AddRange(entities);
	}
	/// <summary>
	/// Update record.
	/// </summary>
	/// <param name="entityToUpdate"></param>
	public virtual void Update(TEntity entityToUpdate)
	{
	  _dbSet.Attach(entityToUpdate);
	  _context.Entry(entityToUpdate).State = EntityState.Modified;
	}
	/// <summary>
	/// update list of records.
	/// </summary>
	/// <param name="entitiesToUpdate"></param>
	public virtual void Update(IEnumerable<TEntity> entitiesToUpdate)
	{
	  foreach (TEntity entity in entitiesToUpdate)
	  {
		_dbSet.Attach(entity);
		_context.Entry(entity).State = EntityState.Modified;
	  }
	}
	/// <summary>
	/// Delete record.
	/// </summary>
	/// <param name="id"></param>
	public virtual void Delete(object id)
	{
	  TEntity entityToDelete = _dbSet.Find(id);
	  
	  Delete(entityToDelete);
	}
	/// <summary>
	/// Delete list of record.
	/// </summary>
	/// <param name="entitiesToDelete"></param>
	public virtual void Delete(IEnumerable<TEntity> entitiesToDelete)
	{
	  foreach (TEntity entity in entitiesToDelete)
	  {
		Delete(entity);
	  }
	}
	
	/// <summary>
	/// Delete entity
	/// </summary>
	/// <param name="entityToDelete"></param>
	public virtual void DeleteLogical(TEntity entityToDelete)
	{
	  PropertyInfo prop = entityToDelete.GetType().GetProperty("Deleted", BindingFlags.Public | BindingFlags.Instance);
	  if (null != prop && prop.CanWrite)
	  {
		prop.SetValue(entityToDelete, true, null);
	  }
	  Update(entityToDelete);
	}

	public virtual void Delete(TEntity entityToDelete)
	{
	  if (_context.Entry(entityToDelete).State == EntityState.Detached)
	  {
		_dbSet.Attach(entityToDelete);
	  }
	  _dbSet.Remove(entityToDelete);
	}
	#endregion
  }
}