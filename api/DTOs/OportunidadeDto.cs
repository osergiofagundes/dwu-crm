// DTOs/OportunidadeDto.cs
using api.Models;

namespace api.DTOs;

public class CreateOportunidadeDto
{
    public string Titulo { get; set; } = string.Empty;
    public decimal? Valor { get; set; }
    public int Probabilidade { get; set; }
    public EstagioOportunidade Estagio { get; set; }
    public DateOnly? DataFechamentoPrevista { get; set; }
    public Guid ClienteId { get; set; }
}

public class UpdateOportunidadeDto
{
    public string Titulo { get; set; } = string.Empty;
    public decimal? Valor { get; set; }
    public int Probabilidade { get; set; }
    public EstagioOportunidade Estagio { get; set; }
    public DateOnly? DataFechamentoPrevista { get; set; }
    public Guid ClienteId { get; set; }
}

public class OportunidadeResponseDto
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
    public ClienteBasicDto? Cliente { get; set; }
}

public class ClienteBasicDto
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Empresa { get; set; }
}
