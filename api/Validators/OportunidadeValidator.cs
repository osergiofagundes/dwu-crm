// Validators/OportunidadeValidator.cs
using api.Data;
using api.Models;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace api.Validators;

public class OportunidadeValidator : AbstractValidator<Oportunidade>
{
    private readonly AppDbContext _db;

    public OportunidadeValidator(AppDbContext db)
    {
        _db = db;

        RuleFor(o => o.Titulo)
            .NotEmpty().WithMessage("O título é obrigatório.")
            .MaximumLength(200);

        RuleFor(o => o.Valor)
            .GreaterThanOrEqualTo(0).When(o => o.Valor.HasValue)
            .WithMessage("O valor deve ser maior ou igual a zero.");

        RuleFor(o => o.Probabilidade)
            .InclusiveBetween(0, 100)
            .WithMessage("A probabilidade deve estar entre 0 e 100.");

        RuleFor(o => o.Estagio)
            .IsInEnum()
            .WithMessage("Estágio inválido.");

        RuleFor(o => o.ClienteId)
            .NotEmpty().WithMessage("O ClienteId é obrigatório.")
            .MustAsync(ClienteExiste)
            .WithMessage("O cliente especificado não existe.");
    }

    private async Task<bool> ClienteExiste(Guid clienteId, CancellationToken token)
    {
        return await _db.Clientes.AnyAsync(c => c.Id == clienteId, token);
    }
}
