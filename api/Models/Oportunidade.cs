// Models/Oportunidade.cs
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models;

public class Oportunidade
{
    public Guid Id { get; set; } 
    public string Titulo { get; set; } = string.Empty;
    public decimal? Valor { get; set; }
    public int Probabilidade { get; set; }
    public EstagioOportunidade Estagio { get; set; }
    public DateOnly? DataFechamentoPrevista { get; set; }
    public DateTime CriadoEm { get; set; }
    public int Ordem { get; set; }

    public Guid ClienteId { get; set; }

    [ForeignKey(nameof(ClienteId))]
    public Cliente? Cliente { get; set; }
}