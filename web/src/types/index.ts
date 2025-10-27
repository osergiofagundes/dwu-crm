// Enums
export enum EstagioOportunidade {
  Prospeccao = 0,
  Qualificacao = 1,
  Proposta = 2,
  Negociacao = 3,
  FechadoGanho = 4,
  FechadoPerdido = 5,
}

// Cliente Types
export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  empresa?: string;
  criadoEm: string;
  oportunidadesCount: number;
}

export interface ClienteDetail {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  empresa?: string;
  criadoEm: string;
  oportunidades: OportunidadeBasic[];
}

export interface CreateClienteDto {
  nome: string;
  email: string;
  telefone?: string;
  empresa?: string;
}

export interface UpdateClienteDto {
  nome: string;
  email: string;
  telefone?: string;
  empresa?: string;
}

// Oportunidade Types
export interface Oportunidade {
  id: string;
  titulo: string;
  valor?: number;
  probabilidade: number;
  estagio: EstagioOportunidade;
  dataFechamentoPrevista?: string;
  criadoEm: string;
  ordem: number;
  clienteId: string;
  cliente?: ClienteBasic;
}

export interface OportunidadeBasic {
  id: string;
  titulo: string;
  valor?: number;
  probabilidade: number;
  estagio: string;
  dataFechamentoPrevista?: string;
  criadoEm: string;
}

export interface ClienteBasic {
  id: string;
  nome: string;
  email: string;
  empresa?: string;
}

export interface CreateOportunidadeDto {
  titulo: string;
  valor?: number;
  probabilidade: number;
  estagio: EstagioOportunidade;
  dataFechamentoPrevista?: string;
  clienteId: string;
}

export interface UpdateOportunidadeDto {
  titulo: string;
  valor?: number;
  probabilidade: number;
  estagio: EstagioOportunidade;
  dataFechamentoPrevista?: string;
  clienteId: string;
}

export interface AtualizarEstagioRequest {
  estagio: EstagioOportunidade;
  ordem?: number;
}

// Pagination Types
export interface PaginatedResponse<T> {
  pagina: number;
  tamanhoPagina: number;
  totalItens: number;
  totalPaginas: number;
  dados: T[];
}

// Utility Functions
export const estagioNomes: Record<EstagioOportunidade, string> = {
  [EstagioOportunidade.Prospeccao]: 'Prospecção',
  [EstagioOportunidade.Qualificacao]: 'Qualificação',
  [EstagioOportunidade.Proposta]: 'Proposta',
  [EstagioOportunidade.Negociacao]: 'Negociação',
  [EstagioOportunidade.FechadoGanho]: 'Fechado Ganho',
  [EstagioOportunidade.FechadoPerdido]: 'Fechado Perdido',
};

export const estagioColors: Record<EstagioOportunidade, string> = {
  [EstagioOportunidade.Prospeccao]: 'bg-gray-100 text-gray-700',
  [EstagioOportunidade.Qualificacao]: 'bg-blue-100 text-blue-700',
  [EstagioOportunidade.Proposta]: 'bg-yellow-100 text-yellow-700',
  [EstagioOportunidade.Negociacao]: 'bg-purple-100 text-purple-700',
  [EstagioOportunidade.FechadoGanho]: 'bg-green-100 text-green-700',
  [EstagioOportunidade.FechadoPerdido]: 'bg-red-100 text-red-700',
};
