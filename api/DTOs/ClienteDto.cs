// DTOs/ClienteDto.cs
namespace api.DTOs;

public class CreateClienteDto
{
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Telefone { get; set; }
    public string? Empresa { get; set; }
}

public class UpdateClienteDto
{
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Telefone { get; set; }
    public string? Empresa { get; set; }
}

public class ClienteResponseDto
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Telefone { get; set; }
    public string? Empresa { get; set; }
    public DateTime CriadoEm { get; set; }
    public int OportunidadesCount { get; set; }
}

public class ClienteDetailDto
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Telefone { get; set; }
    public string? Empresa { get; set; }
    public DateTime CriadoEm { get; set; }
    public List<OportunidadeBasicDto> Oportunidades { get; set; } = new();
}

public class OportunidadeBasicDto
{
    public Guid Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public decimal? Valor { get; set; }
    public int Probabilidade { get; set; }
    public string Estagio { get; set; } = string.Empty;
    public DateOnly? DataFechamentoPrevista { get; set; }
    public DateTime CriadoEm { get; set; }
}
