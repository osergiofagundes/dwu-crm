// Endpoints/OportunidadeEndpoints.cs
using api.Data;
using api.Models;
using api.DTOs;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace api.Endpoints;

public static class OportunidadeEndpoints
{
    public static void MapOportunidadeEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/oportunidades");

        // GET /oportunidades
        group.MapGet("/", async (
            AppDbContext db,
            ILogger<Program> logger,
            int pagina = 1,
            int tamanhoPagina = 10,
            Guid? clienteId = null,
            EstagioOportunidade? estagio = null) =>
        {
            try
            {
                if (pagina < 1)
                {
                    return Results.BadRequest(new { erro = "O número da página deve ser maior ou igual a 1." });
                }

                if (clienteId.HasValue && clienteId.Value == Guid.Empty)
                {
                    return Results.BadRequest(new { erro = "O ID do cliente fornecido não é válido." });
                }

                var query = db.Oportunidades
                    .Include(o => o.Cliente)
                    .AsQueryable();

                if (clienteId.HasValue)
                {
                    query = query.Where(o => o.ClienteId == clienteId.Value);
                }

                if (estagio.HasValue)
                {
                    query = query.Where(o => o.Estagio == estagio.Value);
                }

                var totalItens = await query.CountAsync();
                var totalPaginas = (int)Math.Ceiling(totalItens / (double)tamanhoPagina);

                var oportunidades = await query
                    .OrderByDescending(o => o.CriadoEm)
                    .Skip((pagina - 1) * tamanhoPagina)
                    .Take(tamanhoPagina)
                    .Select(o => new OportunidadeResponseDto
                    {
                        Id = o.Id,
                        Titulo = o.Titulo,
                        Valor = o.Valor,
                        Probabilidade = o.Probabilidade,
                        Estagio = o.Estagio,
                        DataFechamentoPrevista = o.DataFechamentoPrevista,
                        CriadoEm = o.CriadoEm,
                        Ordem = o.Ordem,
                        ClienteId = o.ClienteId,
                        Cliente = new ClienteBasicDto
                        {
                            Id = o.Cliente!.Id,
                            Nome = o.Cliente.Nome,
                            Email = o.Cliente.Email,
                            Empresa = o.Cliente.Empresa
                        }
                    })
                    .ToListAsync();

                return Results.Ok(new
                {
                    pagina,
                    tamanhoPagina,
                    totalItens,
                    totalPaginas,
                    dados = oportunidades
                });
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Erro ao listar oportunidades. Página: {Pagina}, TamanhoPagina: {TamanhoPagina}, ClienteId: {ClienteId}, Estagio: {Estagio}",
                    pagina, tamanhoPagina, clienteId, estagio);
                return Results.Problem(
                    detail: "Ocorreu um erro ao processar sua solicitação.",
                    statusCode: 500,
                    title: "Erro Interno do Servidor"
                );
            }
        });

        // GET /oportunidades/{id}
        group.MapGet("/{id:guid}", async (Guid id, AppDbContext db, ILogger<Program> logger) =>
        {
            try
            {
                if (id == Guid.Empty)
                {
                    return Results.BadRequest(new { erro = "O ID fornecido não é válido." });
                }

                var oportunidade = await db.Oportunidades
                    .Include(o => o.Cliente)
                    .Where(o => o.Id == id)
                    .Select(o => new OportunidadeResponseDto
                    {
                        Id = o.Id,
                        Titulo = o.Titulo,
                        Valor = o.Valor,
                        Probabilidade = o.Probabilidade,
                        Estagio = o.Estagio,
                        DataFechamentoPrevista = o.DataFechamentoPrevista,
                        CriadoEm = o.CriadoEm,
                        Ordem = o.Ordem,
                        ClienteId = o.ClienteId,
                        Cliente = new ClienteBasicDto
                        {
                            Id = o.Cliente!.Id,
                            Nome = o.Cliente.Nome,
                            Email = o.Cliente.Email,
                            Empresa = o.Cliente.Empresa
                        }
                    })
                    .FirstOrDefaultAsync();

                if (oportunidade is null)
                {
                    return Results.NotFound(new { erro = $"Oportunidade com ID {id} não encontrada." });
                }

                return Results.Ok(oportunidade);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Erro ao buscar oportunidade com ID: {OportunidadeId}", id);
                return Results.Problem(
                    detail: "Ocorreu um erro ao processar sua solicitação.",
                    statusCode: 500,
                    title: "Erro Interno do Servidor"
                );
            }
        });

        // POST /oportunidades
        group.MapPost("/", async (
            CreateOportunidadeDto oportunidadeDto,
            AppDbContext db,
            IValidator<Oportunidade> validator,
            ILogger<Program> logger) =>
        {
            try
            {
                if (oportunidadeDto == null)
                {
                    return Results.BadRequest(new { erro = "Os dados da oportunidade não podem ser nulos." });
                }

                if (string.IsNullOrWhiteSpace(oportunidadeDto.Titulo))
                {
                    return Results.BadRequest(new { erro = "O título da oportunidade é obrigatório." });
                }

                if (oportunidadeDto.ClienteId == Guid.Empty)
                {
                    return Results.BadRequest(new { erro = "O ID do cliente não é válido." });
                }

                if (oportunidadeDto.Probabilidade < 0 || oportunidadeDto.Probabilidade > 100)
                {
                    return Results.BadRequest(new { erro = "A probabilidade deve estar entre 0 e 100." });
                }

                if (oportunidadeDto.Valor.HasValue && oportunidadeDto.Valor.Value < 0)
                {
                    return Results.BadRequest(new { erro = "O valor não pode ser negativo." });
                }

                var clienteExiste = await db.Clientes.AnyAsync(c => c.Id == oportunidadeDto.ClienteId);
                if (!clienteExiste)
                {
                    return Results.BadRequest(new { erro = "O cliente especificado não existe." });
                }

                var oportunidade = new Oportunidade
                {
                    Id = Guid.NewGuid(),
                    Titulo = oportunidadeDto.Titulo.Trim(),
                    Valor = oportunidadeDto.Valor,
                    Probabilidade = oportunidadeDto.Probabilidade,
                    Estagio = oportunidadeDto.Estagio,
                    DataFechamentoPrevista = oportunidadeDto.DataFechamentoPrevista,
                    ClienteId = oportunidadeDto.ClienteId,
                    CriadoEm = DateTime.UtcNow
                };

                // FluentValidation
                var validationResult = await validator.ValidateAsync(oportunidade);
                if (!validationResult.IsValid)
                {
                    var erros = validationResult.Errors.Select(e => new { campo = e.PropertyName, mensagem = e.ErrorMessage });
                    return Results.BadRequest(new { erro = "Dados inválidos.", detalhes = erros });
                }

                var ultimaOrdem = await db.Oportunidades
                    .Where(o => o.Estagio == oportunidade.Estagio)
                    .MaxAsync(o => (int?)o.Ordem) ?? -1;

                oportunidade.Ordem = ultimaOrdem + 1;

                db.Oportunidades.Add(oportunidade);
                await db.SaveChangesAsync();

                await db.Entry(oportunidade).Reference(o => o.Cliente).LoadAsync();

                var responseDto = new OportunidadeResponseDto
                {
                    Id = oportunidade.Id,
                    Titulo = oportunidade.Titulo,
                    Valor = oportunidade.Valor,
                    Probabilidade = oportunidade.Probabilidade,
                    Estagio = oportunidade.Estagio,
                    DataFechamentoPrevista = oportunidade.DataFechamentoPrevista,
                    CriadoEm = oportunidade.CriadoEm,
                    Ordem = oportunidade.Ordem,
                    ClienteId = oportunidade.ClienteId,
                    Cliente = oportunidade.Cliente != null ? new ClienteBasicDto
                    {
                        Id = oportunidade.Cliente.Id,
                        Nome = oportunidade.Cliente.Nome,
                        Email = oportunidade.Cliente.Email,
                        Empresa = oportunidade.Cliente.Empresa
                    } : null
                };

                logger.LogInformation("Oportunidade criada com sucesso. ID: {OportunidadeId}, Titulo: {Titulo}, ClienteId: {ClienteId}",
                    oportunidade.Id, oportunidade.Titulo, oportunidade.ClienteId);

                return Results.Created($"/oportunidades/{oportunidade.Id}", responseDto);
            }
            catch (DbUpdateException ex)
            {
                logger.LogError(ex, "Erro ao salvar oportunidade no banco de dados. Titulo: {Titulo}", oportunidadeDto?.Titulo);
                return Results.Problem(
                    detail: "Erro ao salvar os dados no banco de dados.",
                    statusCode: 500,
                    title: "Erro de Banco de Dados"
                );
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Erro ao criar oportunidade. Titulo: {Titulo}", oportunidadeDto?.Titulo);
                return Results.Problem(
                    detail: "Ocorreu um erro ao processar sua solicitação.",
                    statusCode: 500,
                    title: "Erro Interno do Servidor"
                );
            }
        });

        // PUT /oportunidades/{id}
        group.MapPut("/{id:guid}", async (
            Guid id,
            UpdateOportunidadeDto oportunidadeDto,
            AppDbContext db,
            IValidator<Oportunidade> validator,
            ILogger<Program> logger) =>
        {
            try
            {
                if (id == Guid.Empty)
                {
                    return Results.BadRequest(new { erro = "O ID fornecido não é válido." });
                }

                if (oportunidadeDto == null)
                {
                    return Results.BadRequest(new { erro = "Os dados da oportunidade não podem ser nulos." });
                }

                if (string.IsNullOrWhiteSpace(oportunidadeDto.Titulo))
                {
                    return Results.BadRequest(new { erro = "O título da oportunidade é obrigatório." });
                }

                if (oportunidadeDto.ClienteId == Guid.Empty)
                {
                    return Results.BadRequest(new { erro = "O ID do cliente não é válido." });
                }

                if (oportunidadeDto.Probabilidade < 0 || oportunidadeDto.Probabilidade > 100)
                {
                    return Results.BadRequest(new { erro = "A probabilidade deve estar entre 0 e 100." });
                }

                if (oportunidadeDto.Valor.HasValue && oportunidadeDto.Valor.Value < 0)
                {
                    return Results.BadRequest(new { erro = "O valor não pode ser negativo." });
                }

                var oportunidade = await db.Oportunidades.FindAsync(id);
                if (oportunidade is null)
                {
                    return Results.NotFound(new { erro = $"Oportunidade com ID {id} não encontrada." });
                }

                var clienteExiste = await db.Clientes.AnyAsync(c => c.Id == oportunidadeDto.ClienteId);
                if (!clienteExiste)
                {
                    return Results.BadRequest(new { erro = "O cliente especificado não existe." });
                }

                oportunidade.Titulo = oportunidadeDto.Titulo.Trim();
                oportunidade.Valor = oportunidadeDto.Valor;
                oportunidade.Probabilidade = oportunidadeDto.Probabilidade;
                oportunidade.Estagio = oportunidadeDto.Estagio;
                oportunidade.DataFechamentoPrevista = oportunidadeDto.DataFechamentoPrevista;
                oportunidade.ClienteId = oportunidadeDto.ClienteId;

                // FluentValidation
                var validationResult = await validator.ValidateAsync(oportunidade);
                if (!validationResult.IsValid)
                {
                    var erros = validationResult.Errors.Select(e => new { campo = e.PropertyName, mensagem = e.ErrorMessage });
                    return Results.BadRequest(new { erro = "Dados inválidos.", detalhes = erros });
                }

                await db.SaveChangesAsync();

                logger.LogInformation("Oportunidade atualizada com sucesso. ID: {OportunidadeId}, Titulo: {Titulo}",
                    oportunidade.Id, oportunidade.Titulo);

                return Results.NoContent();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                logger.LogError(ex, "Erro de concorrência ao atualizar oportunidade. ID: {OportunidadeId}", id);
                return Results.Conflict(new { erro = "A oportunidade foi modificada por outro usuário. Por favor, recarregue os dados e tente novamente." });
            }
            catch (DbUpdateException ex)
            {
                logger.LogError(ex, "Erro ao atualizar oportunidade no banco de dados. ID: {OportunidadeId}", id);
                return Results.Problem(
                    detail: "Erro ao salvar os dados no banco de dados.",
                    statusCode: 500,
                    title: "Erro de Banco de Dados"
                );
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Erro ao atualizar oportunidade. ID: {OportunidadeId}", id);
                return Results.Problem(
                    detail: "Ocorreu um erro ao processar sua solicitação.",
                    statusCode: 500,
                    title: "Erro Interno do Servidor"
                );
            }
        });

        // DELETE /oportunidades/{id}
        group.MapDelete("/{id:guid}", async (Guid id, AppDbContext db, ILogger<Program> logger) =>
        {
            try
            {
                if (id == Guid.Empty)
                {
                    return Results.BadRequest(new { erro = "O ID fornecido não é válido." });
                }

                var oportunidade = await db.Oportunidades.FindAsync(id);
                if (oportunidade is null)
                {
                    return Results.NotFound(new { erro = $"Oportunidade com ID {id} não encontrada." });
                }

                db.Oportunidades.Remove(oportunidade);
                await db.SaveChangesAsync();

                logger.LogInformation("Oportunidade excluída com sucesso. ID: {OportunidadeId}, Titulo: {Titulo}",
                    oportunidade.Id, oportunidade.Titulo);

                return Results.Ok(new { mensagem = "Oportunidade excluída com sucesso." });
            }
            catch (DbUpdateException ex)
            {
                logger.LogError(ex, "Erro ao excluir oportunidade do banco de dados. ID: {OportunidadeId}", id);
                return Results.Problem(
                    detail: "Erro ao excluir a oportunidade. Verifique se não há dependências vinculadas.",
                    statusCode: 500,
                    title: "Erro de Banco de Dados"
                );
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Erro ao excluir oportunidade. ID: {OportunidadeId}", id);
                return Results.Problem(
                    detail: "Ocorreu um erro ao processar sua solicitação.",
                    statusCode: 500,
                    title: "Erro Interno do Servidor"
                );
            }
        });

        // PATCH /oportunidades/{id}/estagio
        group.MapPatch("/{id:guid}/estagio", async (
            Guid id,
            AtualizarEstagioRequest request,
            AppDbContext db,
            ILogger<Program> logger) =>
        {
            try
            {
                if (id == Guid.Empty)
                {
                    return Results.BadRequest(new { erro = "O ID fornecido não é válido." });
                }

                if (request == null)
                {
                    return Results.BadRequest(new { erro = "Os dados da requisição não podem ser nulos." });
                }

                if (!Enum.IsDefined(typeof(EstagioOportunidade), request.Estagio))
                {
                    return Results.BadRequest(new { erro = "O estágio fornecido não é válido." });
                }

                if (request.Ordem.HasValue && request.Ordem.Value < 0)
                {
                    return Results.BadRequest(new { erro = "A ordem não pode ser negativa." });
                }

                var oportunidade = await db.Oportunidades.FindAsync(id);
                if (oportunidade is null)
                {
                    return Results.NotFound(new { erro = $"Oportunidade com ID {id} não encontrada." });
                }

                var estagioAnterior = oportunidade.Estagio;
                oportunidade.Estagio = request.Estagio;

                if (request.Ordem.HasValue)
                {
                    oportunidade.Ordem = request.Ordem.Value;
                }
                else
                {
                    var ultimaOrdem = await db.Oportunidades
                        .Where(o => o.Estagio == request.Estagio && o.Id != id)
                        .MaxAsync(o => (int?)o.Ordem) ?? -1;

                    oportunidade.Ordem = ultimaOrdem + 1;
                }

                await db.SaveChangesAsync();

                logger.LogInformation("Estágio da oportunidade atualizado. ID: {OportunidadeId}, EstagioAnterior: {EstagioAnterior}, NovoEstagio: {NovoEstagio}, Ordem: {Ordem}",
                    oportunidade.Id, estagioAnterior, oportunidade.Estagio, oportunidade.Ordem);

                return Results.Ok(oportunidade);
            }
            catch (DbUpdateConcurrencyException ex)
            {
                logger.LogError(ex, "Erro de concorrência ao atualizar estágio da oportunidade. ID: {OportunidadeId}", id);
                return Results.Conflict(new { erro = "Por favor, recarregue os dados e tente novamente." });
            }
            catch (DbUpdateException ex)
            {
                logger.LogError(ex, "Erro ao atualizar estágio da oportunidade no banco de dados. ID: {OportunidadeId}", id);
                return Results.Problem(
                    detail: "Erro ao salvar os dados no banco de dados.",
                    statusCode: 500,
                    title: "Erro de Banco de Dados"
                );
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Erro ao atualizar estágio da oportunidade. ID: {OportunidadeId}", id);
                return Results.Problem(
                    detail: "Ocorreu um erro ao processar sua solicitação.",
                    statusCode: 500,
                    title: "Erro Interno do Servidor"
                );
            }
        });
    }
}

public record AtualizarEstagioRequest(EstagioOportunidade Estagio, int? Ordem);
