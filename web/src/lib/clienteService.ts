import {
  Cliente,
  ClienteDetail,
  CreateClienteDto,
  UpdateClienteDto,
  PaginatedResponse,
} from '@/types';
import { api } from './api';

export const clienteService = {
  // GET /clientes (Lista com paginação e busca)
  async listar(params: {
    pagina?: number;
    tamanhoPagina?: number;
    busca?: string;
  } = {}): Promise<PaginatedResponse<Cliente>> {
    const queryParams = new URLSearchParams();
    
    if (params.pagina) queryParams.append('pagina', params.pagina.toString());
    if (params.tamanhoPagina) queryParams.append('tamanhoPagina', params.tamanhoPagina.toString());
    if (params.busca) queryParams.append('busca', params.busca);

    const endpoint = `/clientes${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.fetchApi<PaginatedResponse<Cliente>>(endpoint);
  },

  // GET /clientes/{id}
  async buscarPorId(id: string): Promise<ClienteDetail> {
    return api.fetchApi<ClienteDetail>(`/clientes/${id}`);
  },

  // POST /clientes
  async criar(data: CreateClienteDto): Promise<Cliente> {
    return api.fetchApi<Cliente>('/clientes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // PUT /clientes/{id}
  async atualizar(id: string, data: UpdateClienteDto): Promise<void> {
    return api.fetchApi<void>(`/clientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // DELETE /clientes/{id}
  async excluir(id: string): Promise<void> {
    return api.fetchApi<void>(`/clientes/${id}`, {
      method: 'DELETE',
    });
  },
};
