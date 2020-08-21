// <copyright file="TASConfigDBContext.cs" company="SampleApp">
// Copyright (c) SampleApp. All rights reserved.
// </copyright>

using Microsoft.EntityFrameworkCore;
using SampleAppApi.Entities;

namespace SampleAppApi.DataAccess
{
  public partial class TASConfigDBContext : DbContext
  {
	public TASConfigDBContext()
	{
	}

	public TASConfigDBContext(DbContextOptions<TASConfigDBContext> options)
		: base(options)
	{
	}

	public virtual DbSet<Reports> Reports { get; set; }
	public virtual DbSet<Users> Users { get; set; }
	protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
	{
	}

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
	  modelBuilder.HasAnnotation("ProductVersion", "2.2.6-servicing-10079");

	  modelBuilder.Entity<Reports>(entity =>
			{
			  entity.HasKey(e => e.ReportId);

			  entity.Property(e => e.ReportId)
				  .HasColumnName("ReportID")
				  .ValueGeneratedNever();

			  entity.Property(e => e.Columns).HasDefaultValueSql("((1))");

			  entity.Property(e => e.CustomTimeBegin).HasColumnType("datetime");

			  entity.Property(e => e.CustomTimeEnd).HasColumnType("datetime");

			  entity.Property(e => e.FilterCol1)
				  .IsRequired()
				  .HasMaxLength(50)
				  .HasDefaultValueSql("('')");

			  entity.Property(e => e.FilterCol1Value)
				  .IsRequired()
				  .HasMaxLength(100)
				  .HasDefaultValueSql("('')");

			  entity.Property(e => e.FilterCol2)
				  .IsRequired()
				  .HasMaxLength(50)
				  .HasDefaultValueSql("('')");

			  entity.Property(e => e.FilterCol2Value)
				  .IsRequired()
				  .HasMaxLength(100)
				  .HasDefaultValueSql("('')");

			  entity.Property(e => e.FilterCol3)
				  .IsRequired()
				  .HasMaxLength(50)
				  .HasDefaultValueSql("('')");

			  entity.Property(e => e.FilterCol3Value)
				  .IsRequired()
				  .HasMaxLength(100)
				  .HasDefaultValueSql("('')");

			  entity.Property(e => e.FilterCol4)
				  .IsRequired()
				  .HasMaxLength(50)
				  .HasDefaultValueSql("('')");

			  entity.Property(e => e.FilterCol4Value)
				  .IsRequired()
				  .HasMaxLength(100)
				  .HasDefaultValueSql("('')");

			  entity.Property(e => e.JobGuid).HasColumnName("JobGUID");

			  entity.Property(e => e.PanelGuid).HasColumnName("PanelGUID");

			  entity.Property(e => e.PanelItemId)
				  .HasColumnName("PanelItemID")
				  .HasDefaultValueSql("((0))");

			  entity.Property(e => e.ReportGuid)
				  .HasColumnName("ReportGUID")
				  .HasDefaultValueSql("(newid())");

			  entity.Property(e => e.SortCol1)
				  .IsRequired()
				  .HasMaxLength(50)
				  .HasDefaultValueSql("('')");

			  entity.Property(e => e.SortCol2)
				  .IsRequired()
				  .HasMaxLength(50)
				  .HasDefaultValueSql("('')");

			  entity.Property(e => e.Title)
				  .IsRequired()
				  .HasMaxLength(100)
				  .HasDefaultValueSql("('')");

			  entity.Property(e => e.UserId).HasColumnName("UserID");

			  entity.HasOne(d => d.User)
				  .WithMany(p => p.Reports)
				  .HasForeignKey(d => d.UserId)
				  .OnDelete(DeleteBehavior.Cascade)
				  .HasConstraintName("FK_Reports_Users");
			});

	  
	  modelBuilder.Entity<Users>(entity =>
	  {
		entity.HasKey(e => e.UserId)
				  .HasName("PK_Users_1");

		entity.Property(e => e.UserId).HasColumnName("UserID");

		entity.Property(e => e.Active).HasDefaultValueSql("((1))");

		entity.Property(e => e.Name)
				  .IsRequired()
				  .HasMaxLength(20);

		entity.Property(e => e.Password)
				  .IsRequired()
				  .HasMaxLength(20);

		entity.Property(e => e.UserGuid)
				  .HasColumnName("UserGUID")
				  .HasDefaultValueSql("(newid())");
	  });
	}
  }
}
