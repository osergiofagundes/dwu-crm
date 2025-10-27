// Validators/ClienteValidator.cs
using api.Data;
using api.Models;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace api.Validators;

public class ClienteValidator : AbstractValidator<Cliente>
{
    private readonly AppDbContext _db;

    public ClienteValidator(AppDbContext db)
    {
        _db = db;

        RuleFor(c => c.Nome)
            .NotEmpty().WithMessage("O nome é obrigatório.") 
            .MaximumLength(100);

        RuleFor(c => c.Email)
            .EmailAddress().WithMessage("O email deve ser válido.")
            .MustAsync(EmailUnico)
            .WithMessage("Este email já está em uso.");
    }

    private async Task<bool> EmailUnico(Cliente cliente, string email, CancellationToken token)
    {
        return await _db.Clientes
            .AllAsync(c => c.Id == cliente.Id || c.Email != email, token);
    }
}