using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AdicionarSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Clientes",
                columns: new[] { "Id", "CriadoEm", "Email", "Empresa", "Nome", "Telefone" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111111"), new DateTime(2024, 9, 27, 0, 0, 0, 0, DateTimeKind.Utc), "joao.silva@email.com", "Tech Solutions Ltda", "João Silva", "(11) 98765-4321" },
                    { new Guid("22222222-2222-2222-2222-222222222222"), new DateTime(2024, 10, 2, 0, 0, 0, 0, DateTimeKind.Utc), "maria.santos@email.com", "Inovação Digital SA", "Maria Santos", "(21) 97654-3210" },
                    { new Guid("33333333-3333-3333-3333-333333333333"), new DateTime(2024, 10, 7, 0, 0, 0, 0, DateTimeKind.Utc), "pedro.oliveira@email.com", "Consultoria Empresarial", "Pedro Oliveira", "(31) 96543-2109" },
                    { new Guid("44444444-4444-4444-4444-444444444444"), new DateTime(2024, 10, 12, 0, 0, 0, 0, DateTimeKind.Utc), "ana.costa@email.com", "StartUp Ventures", "Ana Costa", "(41) 95432-1098" },
                    { new Guid("55555555-5555-5555-5555-555555555555"), new DateTime(2024, 10, 17, 0, 0, 0, 0, DateTimeKind.Utc), "carlos.mendes@email.com", "Global Trading Corp", "Carlos Mendes", "(51) 94321-0987" }
                });

            migrationBuilder.InsertData(
                table: "Oportunidades",
                columns: new[] { "Id", "ClienteId", "CriadoEm", "DataFechamentoPrevista", "Estagio", "Ordem", "Probabilidade", "Titulo", "Valor" },
                values: new object[,]
                {
                    { new Guid("a1111111-1111-1111-1111-111111111111"), new Guid("11111111-1111-1111-1111-111111111111"), new DateTime(2024, 10, 7, 0, 0, 0, 0, DateTimeKind.Utc), new DateOnly(2025, 11, 26), "Negociacao", 1, 80, "Implementação de Sistema ERP", 150000m },
                    { new Guid("a1111111-1111-1111-1111-111111111112"), new Guid("11111111-1111-1111-1111-111111111111"), new DateTime(2024, 10, 12, 0, 0, 0, 0, DateTimeKind.Utc), new DateOnly(2025, 12, 11), "Proposta", 2, 60, "Consultoria de TI", 50000m },
                    { new Guid("a2222222-2222-2222-2222-222222222221"), new Guid("22222222-2222-2222-2222-222222222222"), new DateTime(2024, 10, 9, 0, 0, 0, 0, DateTimeKind.Utc), new DateOnly(2025, 12, 26), "Qualificacao", 1, 70, "Desenvolvimento de App Mobile", 200000m },
                    { new Guid("a2222222-2222-2222-2222-222222222222"), new Guid("22222222-2222-2222-2222-222222222222"), new DateTime(2024, 10, 2, 0, 0, 0, 0, DateTimeKind.Utc), new DateOnly(2025, 10, 22), "FechadoGanho", 2, 90, "Suporte Técnico Anual", 30000m },
                    { new Guid("a3333333-3333-3333-3333-333333333331"), new Guid("33333333-3333-3333-3333-333333333333"), new DateTime(2024, 10, 17, 0, 0, 0, 0, DateTimeKind.Utc), new DateOnly(2026, 1, 25), "Prospeccao", 1, 50, "Migração para Cloud", 100000m },
                    { new Guid("a3333333-3333-3333-3333-333333333332"), new Guid("33333333-3333-3333-3333-333333333333"), new DateTime(2024, 10, 19, 0, 0, 0, 0, DateTimeKind.Utc), new DateOnly(2025, 12, 16), "Qualificacao", 2, 40, "Treinamento em Segurança", 25000m },
                    { new Guid("a4444444-4444-4444-4444-444444444441"), new Guid("44444444-4444-4444-4444-444444444444"), new DateTime(2024, 10, 15, 0, 0, 0, 0, DateTimeKind.Utc), new DateOnly(2025, 11, 21), "Proposta", 1, 85, "Website Corporativo", 45000m },
                    { new Guid("a4444444-4444-4444-4444-444444444442"), new Guid("44444444-4444-4444-4444-444444444444"), new DateTime(2024, 10, 7, 0, 0, 0, 0, DateTimeKind.Utc), new DateOnly(2025, 10, 17), "FechadoPerdido", 2, 20, "Integração de APIs", 35000m },
                    { new Guid("a5555555-5555-5555-5555-555555555551"), new Guid("55555555-5555-5555-5555-555555555555"), new DateTime(2024, 10, 20, 0, 0, 0, 0, DateTimeKind.Utc), new DateOnly(2025, 12, 6), "Negociacao", 1, 65, "Sistema de BI", 180000m },
                    { new Guid("a5555555-5555-5555-5555-555555555552"), new Guid("55555555-5555-5555-5555-555555555555"), new DateTime(2024, 10, 22, 0, 0, 0, 0, DateTimeKind.Utc), new DateOnly(2025, 11, 16), "Proposta", 2, 75, "Licenças de Software", 20000m }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Oportunidades",
                keyColumn: "Id",
                keyValue: new Guid("a1111111-1111-1111-1111-111111111111"));

            migrationBuilder.DeleteData(
                table: "Oportunidades",
                keyColumn: "Id",
                keyValue: new Guid("a1111111-1111-1111-1111-111111111112"));

            migrationBuilder.DeleteData(
                table: "Oportunidades",
                keyColumn: "Id",
                keyValue: new Guid("a2222222-2222-2222-2222-222222222221"));

            migrationBuilder.DeleteData(
                table: "Oportunidades",
                keyColumn: "Id",
                keyValue: new Guid("a2222222-2222-2222-2222-222222222222"));

            migrationBuilder.DeleteData(
                table: "Oportunidades",
                keyColumn: "Id",
                keyValue: new Guid("a3333333-3333-3333-3333-333333333331"));

            migrationBuilder.DeleteData(
                table: "Oportunidades",
                keyColumn: "Id",
                keyValue: new Guid("a3333333-3333-3333-3333-333333333332"));

            migrationBuilder.DeleteData(
                table: "Oportunidades",
                keyColumn: "Id",
                keyValue: new Guid("a4444444-4444-4444-4444-444444444441"));

            migrationBuilder.DeleteData(
                table: "Oportunidades",
                keyColumn: "Id",
                keyValue: new Guid("a4444444-4444-4444-4444-444444444442"));

            migrationBuilder.DeleteData(
                table: "Oportunidades",
                keyColumn: "Id",
                keyValue: new Guid("a5555555-5555-5555-5555-555555555551"));

            migrationBuilder.DeleteData(
                table: "Oportunidades",
                keyColumn: "Id",
                keyValue: new Guid("a5555555-5555-5555-5555-555555555552"));

            migrationBuilder.DeleteData(
                table: "Clientes",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"));

            migrationBuilder.DeleteData(
                table: "Clientes",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"));

            migrationBuilder.DeleteData(
                table: "Clientes",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"));

            migrationBuilder.DeleteData(
                table: "Clientes",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444444"));

            migrationBuilder.DeleteData(
                table: "Clientes",
                keyColumn: "Id",
                keyValue: new Guid("55555555-5555-5555-5555-555555555555"));
        }
    }
}
