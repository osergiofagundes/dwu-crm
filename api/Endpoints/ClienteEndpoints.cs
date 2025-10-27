// Endpoints/ClienteEndpoints.cs
using api.Data;
using api.Models;
using api.DTOs;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace api.Endpoints;

public static class ClienteEndpoints
{
    public static void MapClienteEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/clientes");

        // GET /clientes
        group.MapGet("/", async (
            AppDbContext db,
            ILogger<Program> logger,
            int pagina = 1,
            int tamanhoPagina = 10,
            string? busca = null) =>
        {
            try
            {
                if (pagina < 1)
                {
                    return Results.BadRequest(new { erro = "O número da página deve ser maior ou igual a 1." });
                }

                var query = db.Clientes
                    .Include(c => c.Oportunidades)
                    .AsQueryable();

                if (!string.IsNullOrWhiteSpace(busca))
                {
                    query = query.Where(c =>
                        c.Nome.Contains(busca) ||
                        c.Email.Contains(busca));
                }

                var totalItens = await query.CountAsync();
                var totalPaginas = (int)Math.Ceiling(totalItens / (double)tamanhoPagina);

                var clientes = await query
                    .OrderBy(c => c.Nome)
                    .Skip((pagina - 1) * tamanhoPagina)
                    .Take(tamanhoPagina)
                    .Select(c => new ClienteResponseDto
                    {
                        Id = c.Id,
                        Nome = c.Nome,
                        Email = c.Email,
                        Telefone = c.Telefone,
                        Empresa = c.Empresa,
                        CriadoEm = c.CriadoEm,
                        OportunidadesCount = c.Oportunidades.Count
                    })
                    .ToListAsync();

                return Results.Ok(new
                {
                    pagina,
                    tamanhoPagina,
                    totalItens,
                    totalPaginas,
                    dados = clientes
                });
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Erro ao listar clientes. Página: {Pagina}, TamanhoPagina: {TamanhoPagina}, Busca: {Busca}",
                    pagina, tamanhoPagina, busca);
                return Results.Problem(
                    detail: "Ocorreu um erro ao processar sua solicitação.",
                    statusCode: 500,
                    title: "Erro Interno do Servidor"
                );
            }
        });

        // GET /clientes/{id}
        group.MapGet("/{id:guid}", async (Guid id, AppDbContext db, ILogger<Program> logger) =>
        {
            try
            {
                if (id == Guid.Empty)
                {
                    return Results.BadRequest(new { erro = "O ID fornecido não é válido." });
                }

                var cliente = await db.Clientes
                    .Include(c => c.Oportunidades)
                    .Where(c => c.Id == id)
                    .Select(c => new ClienteDetailDto
                    {
                        Id = c.Id,
                        Nome = c.Nome,
                        Email = c.Email,
                        Telefone = c.Telefone,
                        Empresa = c.Empresa,
                        CriadoEm = c.CriadoEm,
                        Oportunidades = c.Oportunidades.Select(o => new OportunidadeBasicDto
                        {
                            Id = o.Id,
                            Titulo = o.Titulo,
                            Valor = o.Valor,
                            Probabilidade = o.Probabilidade,
                            Estagio = o.Estagio.ToString(),
                            DataFechamentoPrevista = o.DataFechamentoPrevista,
                            CriadoEm = o.CriadoEm
                        }).ToList()
                    })
                    .FirstOrDefaultAsync();

                if (cliente is null)
                {
                    return Results.NotFound(new { erro = $"Cliente com ID {id} não encontrado." });
                }

                return Results.Ok(cliente);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Erro ao buscar cliente com ID: {ClienteId}", id);
                return Results.Problem(
                    detail: "Ocorreu um erro ao processar sua solicitação.",
                    statusCode: 500,
                    title: "Erro Interno do Servidor"
                );
            }
        });

        // POST /clientes (Criar)
        group.MapPost("/", async (
            CreateClienteDto clienteDto,
            AppDbContext db,
            IValidator<Cliente> validator,
            ILogger<Program> logger) =>
        {
            try
            {
                if (clienteDto == null)
                {
                    return Results.BadRequest(new { erro = "Os dados do cliente não podem ser nulos." });
                }

                if (string.IsNullOrWhiteSpace(clienteDto.Nome))
                {
                    return Results.BadRequest(new { erro = "O nome do cliente é obrigatório." });
                }

                if (string.IsNullOrWhiteSpace(clienteDto.Email))
                {
                    return Results.BadRequest(new { erro = "O email do cliente é obrigatório." });
                }

                var cliente = new Cliente
                {
                    Id = Guid.NewGuid(),
                    Nome = clienteDto.Nome.Trim(),
                    Email = clienteDto.Email.Trim().ToLowerInvariant(),
                    Telefone = clienteDto.Telefone?.Trim(),
                    Empresa = clienteDto.Empresa?.Trim(),
                    CriadoEm = DateTime.UtcNow
                };

                // FluentValidation
                var validationResult = await validator.ValidateAsync(cliente);
                if (!validationResult.IsValid)
                {
                    var erros = validationResult.Errors.Select(e => new { campo = e.PropertyName, mensagem = e.ErrorMessage });
                    return Results.BadRequest(new { erro = "Dados inválidos.", detalhes = erros });
                }

                db.Clientes.Add(cliente);
                await db.SaveChangesAsync();

                var responseDto = new ClienteResponseDto
                {
                    Id = cliente.Id,
                    Nome = cliente.Nome,
                    Email = cliente.Email,
                    Telefone = cliente.Telefone,
                    Empresa = cliente.Empresa,
                    CriadoEm = cliente.CriadoEm,
                    OportunidadesCount = 0
                };

                logger.LogInformation("Cliente criado com sucesso. ID: {ClienteId}, Nome: {Nome}",
                    cliente.Id, cliente.Nome);

                return Results.Created($"/clientes/{cliente.Id}", responseDto);
            }
            catch (DbUpdateException ex)
            {
                logger.LogError(ex, "Erro ao salvar cliente no banco de dados. Email: {Email}", clienteDto?.Email);
                
                if (ex.InnerException?.Message.Contains("UNIQUE") == true || 
                    ex.InnerException?.Message.Contains("duplicate") == true)
                {
                    return Results.Conflict(new { erro = "Já existe um cliente com este email." });
                }
                
                return Results.Problem(
                    detail: "Erro ao salvar os dados no banco de dados.",
                    statusCode: 500,
                    title: "Erro de Banco de Dados"
                );
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Erro ao criar cliente. Email: {Email}", clienteDto?.Email);
                return Results.Problem(
                    detail: "Ocorreu um erro ao processar sua solicitação.",
                    statusCode: 500,
                    title: "Erro Interno do Servidor"
                );
            }
        });

        // PUT /clientes/{id}
        group.MapPut("/{id:guid}", async (
            Guid id,
            UpdateClienteDto clienteDto,
            AppDbContext db,
            IValidator<Cliente> validator,
            ILogger<Program> logger) =>
        {
            try
            {
                if (id == Guid.Empty)
                {
                    return Results.BadRequest(new { erro = "O ID fornecido não é válido." });
                }

                if (clienteDto == null)
                {
                    return Results.BadRequest(new { erro = "Os dados do cliente não podem ser nulos." });
                }

                if (string.IsNullOrWhiteSpace(clienteDto.Nome))
                {
                    return Results.BadRequest(new { erro = "O nome do cliente é obrigatório." });
                }

                if (string.IsNullOrWhiteSpace(clienteDto.Email))
                {
                    return Results.BadRequest(new { erro = "O email do cliente é obrigatório." });
                }

                var cliente = await db.Clientes.FindAsync(id);
                if (cliente is null)
                {
                    return Results.NotFound(new { erro = $"Cliente com ID {id} não encontrado." });
                }

                cliente.Nome = clienteDto.Nome.Trim();
                cliente.Email = clienteDto.Email.Trim().ToLowerInvariant();
                cliente.Telefone = clienteDto.Telefone?.Trim();
                cliente.Empresa = clienteDto.Empresa?.Trim();

                // FluentValidation
                var validationResult = await validator.ValidateAsync(cliente);
                if (!validationResult.IsValid)
                {
                    var erros = validationResult.Errors.Select(e => new { campo = e.PropertyName, mensagem = e.ErrorMessage });
                    return Results.BadRequest(new { erro = "Dados inválidos.", detalhes = erros });
                }

                await db.SaveChangesAsync();
                
                logger.LogInformation("Cliente atualizado com sucesso. ID: {ClienteId}, Nome: {Nome}",
                    cliente.Id, cliente.Nome);

                return Results.NoContent();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                logger.LogError(ex, "Erro de concorrência ao atualizar cliente. ID: {ClienteId}", id);
                return Results.Conflict(new { erro = "O cliente foi modificado por outro usuário. Por favor, recarregue os dados e tente novamente." });
            }
            catch (DbUpdateException ex)
            {
                logger.LogError(ex, "Erro ao atualizar cliente no banco de dados. ID: {ClienteId}", id);
                
                if (ex.InnerException?.Message.Contains("UNIQUE") == true || 
                    ex.InnerException?.Message.Contains("duplicate") == true)
                {
                    return Results.Conflict(new { erro = "Já existe um cliente com este email." });
                }
                
                return Results.Problem(
                    detail: "Erro ao salvar os dados no banco de dados.",
                    statusCode: 500,
                    title: "Erro de Banco de Dados"
                );
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Erro ao atualizar cliente. ID: {ClienteId}", id);
                return Results.Problem(
                    detail: "Ocorreu um erro ao processar sua solicitação.",
                    statusCode: 500,
                    title: "Erro Interno do Servidor"
                );
            }
        });

        // DELETE /clientes/{id}
        group.MapDelete("/{id:guid}", async (Guid id, AppDbContext db, ILogger<Program> logger) =>
        {
            try
            {
                if (id == Guid.Empty)
                {
                    return Results.BadRequest(new { erro = "O ID fornecido não é válido." });
                }

                var cliente = await db.Clientes
                    .Include(c => c.Oportunidades)
                    .FirstOrDefaultAsync(c => c.Id == id);

                if (cliente is null)
                {
                    return Results.NotFound(new { erro = $"Cliente com ID {id} não encontrado." });
                }

                if (cliente.Oportunidades.Any())
                {
                    return Results.BadRequest(new 
                    { 
                        erro = "Não é possível excluir o cliente pois existem oportunidades vinculadas a ele.",
                        oportunidadesCount = cliente.Oportunidades.Count
                    });
                }

                db.Clientes.Remove(cliente);
                await db.SaveChangesAsync();
                
                logger.LogInformation("Cliente excluído com sucesso. ID: {ClienteId}, Nome: {Nome}",
                    cliente.Id, cliente.Nome);

                return Results.Ok(new { mensagem = "Cliente excluído com sucesso." });
            }
            catch (DbUpdateException ex)
            {
                logger.LogError(ex, "Erro ao excluir cliente do banco de dados. ID: {ClienteId}", id);
                return Results.Problem(
                    detail: "Erro ao excluir o cliente. Verifique se não há dependências vinculadas.",
                    statusCode: 500,
                    title: "Erro de Banco de Dados"
                );
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Erro ao excluir cliente. ID: {ClienteId}", id);
                return Results.Problem(
                    detail: "Ocorreu um erro ao processar sua solicitação.",
                    statusCode: 500,
                    title: "Erro Interno do Servidor"
                );
            }
        });
    }
}