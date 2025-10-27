import {
  Oportunidade,
  CreateOportunidadeDto,
  UpdateOportunidadeDto,
  AtualizarEstagioRequest,
  PaginatedResponse,
  EstagioOportunidade,
} from '@/types';
import { api } from './api';

export const oportunidadeService = {
  // GET /oportunidades (Lista com paginação e filtros)
  async listar(params: {
    pagina?: number;
    tamanhoPagina?: number;
    clienteId?: string;
    estagio?: EstagioOportunidade;
  } = {}): Promise<PaginatedResponse<Oportunidade>> {
    const queryParams = new URLSearchParams();
    
    if (params.pagina) queryParams.append('pagina', params.pagina.toString());
    if (params.tamanhoPagina) queryParams.append('tamanhoPagina', params.tamanhoPagina.toString());
    if (params.clienteId) queryParams.append('clienteId', params.clienteId);
    if (params.estagio !== undefined) queryParams.append('estagio', params.estagio.toString());

    const endpoint = `/oportunidades${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.fetchApi<PaginatedResponse<Oportunidade>>(endpoint);
  },

  // GET /oportunidades (Lista todas sem paginação - para Kanban)
  async listarTodas(): Promise<Oportunidade[]> {
    const response = await api.fetchApi<PaginatedResponse<Oportunidade>>(
      '/oportunidades?tamanhoPagina=1000'
    );
    return response.dados;
  },

  // GET /oportunidades/{id}
  async buscarPorId(id: string): Promise<Oportunidade> {
    return api.fetchApi<Oportunidade>(`/oportunidades/${id}`);
  },

  // POST /oportunidades
  async criar(data: CreateOportunidadeDto): Promise<Oportunidade> {
    return api.fetchApi<Oportunidade>('/oportunidades', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // PUT /oportunidades/{id}
  async atualizar(id: string, data: UpdateOportunidadeDto): Promise<void> {
    return api.fetchApi<void>(`/oportunidades/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // DELETE /oportunidades/{id}
  async excluir(id: string): Promise<void> {
    return api.fetchApi<void>(`/oportunidades/${id}`, {
      method: 'DELETE',
    });
  },

  // PATCH /oportunidades/{id}/estagio (Atualizar estágio - drag & drop)
  async atualizarEstagio(
    id: string,
    data: AtualizarEstagioRequest
  ): Promise<Oportunidade> {
    return api.fetchApi<Oportunidade>(`/oportunidades/${id}/estagio`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};
