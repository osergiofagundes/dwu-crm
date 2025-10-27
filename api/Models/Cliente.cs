// Models/Cliente.cs
using System.ComponentModel.DataAnnotations;

namespace api.Models;

public class Cliente
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Telefone { get; set; }
    public string? Empresa { get; set; }
    public DateTime CriadoEm { get; set; }

    public ICollection<Oportunidade> Oportunidades { get; set; } = new List<Oportunidade>();
}