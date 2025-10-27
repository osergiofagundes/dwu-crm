// Data/AppDbContext.cs
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Cliente> Clientes { get; set; }
    public DbSet<Oportunidade> Oportunidades { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Cliente>()
            .HasMany(c => c.Oportunidades)
            .WithOne(o => o.Cliente)
            .HasForeignKey(o => o.ClienteId);

        modelBuilder.Entity<Cliente>()
            .HasIndex(c => c.Email)
            .IsUnique();

        modelBuilder.Entity<Oportunidade>()
            .Property(o => o.Estagio)
            .HasConversion<string>();

        // Seed Data
        DatabaseSeeder.SeedData(modelBuilder);
    }
}