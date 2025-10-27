using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Data;

public static class DatabaseSeeder
{
    public static void SeedData(ModelBuilder modelBuilder)
    {
        SeedClientes(modelBuilder);
        SeedOportunidades(modelBuilder);
    }

    private static void SeedClientes(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Cliente>().HasData(
            new Cliente
            {
                Id = new Guid("11111111-1111-1111-1111-111111111111"),
                Nome = "João Silva",
                Email = "joao.silva@email.com",
                Telefone = "(11) 98765-4321",
                Empresa = "Tech Solutions Ltda",
                CriadoEm = new DateTime(2024, 9, 27, 0, 0, 0, DateTimeKind.Utc)
            },
            new Cliente
            {
                Id = new Guid("22222222-2222-2222-2222-222222222222"),
                Nome = "Maria Santos",
                Email = "maria.santos@email.com",
                Telefone = "(21) 97654-3210",
                Empresa = "Inovação Digital SA",
                CriadoEm = new DateTime(2024, 10, 2, 0, 0, 0, DateTimeKind.Utc)
            },
            new Cliente
            {
                Id = new Guid("33333333-3333-3333-3333-333333333333"),
                Nome = "Pedro Oliveira",
                Email = "pedro.oliveira@email.com",
                Telefone = "(31) 96543-2109",
                Empresa = "Consultoria Empresarial",
                CriadoEm = new DateTime(2024, 10, 7, 0, 0, 0, DateTimeKind.Utc)
            },
            new Cliente
            {
                Id = new Guid("44444444-4444-4444-4444-444444444444"),
                Nome = "Ana Costa",
                Email = "ana.costa@email.com",
                Telefone = "(41) 95432-1098",
                Empresa = "StartUp Ventures",
                CriadoEm = new DateTime(2024, 10, 12, 0, 0, 0, DateTimeKind.Utc)
            },
            new Cliente
            {
                Id = new Guid("55555555-5555-5555-5555-555555555555"),
                Nome = "Carlos Mendes",
                Email = "carlos.mendes@email.com",
                Telefone = "(51) 94321-0987",
                Empresa = "Global Trading Corp",
                CriadoEm = new DateTime(2024, 10, 17, 0, 0, 0, DateTimeKind.Utc)
            }
        );
    }

    private static void SeedOportunidades(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Oportunidade>().HasData(
            // Oportunidades para Cliente 1 (João Silva)
            new Oportunidade
            {
                Id = new Guid("a1111111-1111-1111-1111-111111111111"),
                Titulo = "Implementação de Sistema ERP",
                Valor = 150000m,
                Probabilidade = 80,
                Estagio = EstagioOportunidade.Negociacao,
                DataFechamentoPrevista = new DateOnly(2025, 11, 26),
                CriadoEm = new DateTime(2024, 10, 7, 0, 0, 0, DateTimeKind.Utc),
                ClienteId = new Guid("11111111-1111-1111-1111-111111111111"),
                Ordem = 1
            },
            new Oportunidade
            {
                Id = new Guid("a1111111-1111-1111-1111-111111111112"),
                Titulo = "Consultoria de TI",
                Valor = 50000m,
                Probabilidade = 60,
                Estagio = EstagioOportunidade.Proposta,
                DataFechamentoPrevista = new DateOnly(2025, 12, 11),
                CriadoEm = new DateTime(2024, 10, 12, 0, 0, 0, DateTimeKind.Utc),
                ClienteId = new Guid("11111111-1111-1111-1111-111111111111"),
                Ordem = 2
            },
            // Oportunidades para Cliente 2 (Maria Santos)
            new Oportunidade
            {
                Id = new Guid("a2222222-2222-2222-2222-222222222221"),
                Titulo = "Desenvolvimento de App Mobile",
                Valor = 200000m,
                Probabilidade = 70,
                Estagio = EstagioOportunidade.Qualificacao,
                DataFechamentoPrevista = new DateOnly(2025, 12, 26),
                CriadoEm = new DateTime(2024, 10, 9, 0, 0, 0, DateTimeKind.Utc),
                ClienteId = new Guid("22222222-2222-2222-2222-222222222222"),
                Ordem = 1
            },
            new Oportunidade
            {
                Id = new Guid("a2222222-2222-2222-2222-222222222222"),
                Titulo = "Suporte Técnico Anual",
                Valor = 30000m,
                Probabilidade = 90,
                Estagio = EstagioOportunidade.FechadoGanho,
                DataFechamentoPrevista = new DateOnly(2025, 10, 22),
                CriadoEm = new DateTime(2024, 10, 2, 0, 0, 0, DateTimeKind.Utc),
                ClienteId = new Guid("22222222-2222-2222-2222-222222222222"),
                Ordem = 2
            },
            // Oportunidades para Cliente 3 (Pedro Oliveira)
            new Oportunidade
            {
                Id = new Guid("a3333333-3333-3333-3333-333333333331"),
                Titulo = "Migração para Cloud",
                Valor = 100000m,
                Probabilidade = 50,
                Estagio = EstagioOportunidade.Prospeccao,
                DataFechamentoPrevista = new DateOnly(2026, 1, 25),
                CriadoEm = new DateTime(2024, 10, 17, 0, 0, 0, DateTimeKind.Utc),
                ClienteId = new Guid("33333333-3333-3333-3333-333333333333"),
                Ordem = 1
            },
            new Oportunidade
            {
                Id = new Guid("a3333333-3333-3333-3333-333333333332"),
                Titulo = "Treinamento em Segurança",
                Valor = 25000m,
                Probabilidade = 40,
                Estagio = EstagioOportunidade.Qualificacao,
                DataFechamentoPrevista = new DateOnly(2025, 12, 16),
                CriadoEm = new DateTime(2024, 10, 19, 0, 0, 0, DateTimeKind.Utc),
                ClienteId = new Guid("33333333-3333-3333-3333-333333333333"),
                Ordem = 2
            },
            // Oportunidades para Cliente 4 (Ana Costa)
            new Oportunidade
            {
                Id = new Guid("a4444444-4444-4444-4444-444444444441"),
                Titulo = "Website Corporativo",
                Valor = 45000m,
                Probabilidade = 85,
                Estagio = EstagioOportunidade.Proposta,
                DataFechamentoPrevista = new DateOnly(2025, 11, 21),
                CriadoEm = new DateTime(2024, 10, 15, 0, 0, 0, DateTimeKind.Utc),
                ClienteId = new Guid("44444444-4444-4444-4444-444444444444"),
                Ordem = 1
            },
            new Oportunidade
            {
                Id = new Guid("a4444444-4444-4444-4444-444444444442"),
                Titulo = "Integração de APIs",
                Valor = 35000m,
                Probabilidade = 20,
                Estagio = EstagioOportunidade.FechadoPerdido,
                DataFechamentoPrevista = new DateOnly(2025, 10, 17),
                CriadoEm = new DateTime(2024, 10, 7, 0, 0, 0, DateTimeKind.Utc),
                ClienteId = new Guid("44444444-4444-4444-4444-444444444444"),
                Ordem = 2
            },
            // Oportunidades para Cliente 5 (Carlos Mendes)
            new Oportunidade
            {
                Id = new Guid("a5555555-5555-5555-5555-555555555551"),
                Titulo = "Sistema de BI",
                Valor = 180000m,
                Probabilidade = 65,
                Estagio = EstagioOportunidade.Negociacao,
                DataFechamentoPrevista = new DateOnly(2025, 12, 6),
                CriadoEm = new DateTime(2024, 10, 20, 0, 0, 0, DateTimeKind.Utc),
                ClienteId = new Guid("55555555-5555-5555-5555-555555555555"),
                Ordem = 1
            },
            new Oportunidade
            {
                Id = new Guid("a5555555-5555-5555-5555-555555555552"),
                Titulo = "Licenças de Software",
                Valor = 20000m,
                Probabilidade = 75,
                Estagio = EstagioOportunidade.Proposta,
                DataFechamentoPrevista = new DateOnly(2025, 11, 16),
                CriadoEm = new DateTime(2024, 10, 22, 0, 0, 0, DateTimeKind.Utc),
                ClienteId = new Guid("55555555-5555-5555-5555-555555555555"),
                Ordem = 2
            }
        );
    }
}
