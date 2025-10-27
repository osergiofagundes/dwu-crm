'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { clienteService } from '@/lib/clienteService';
import { Cliente, CreateClienteDto, UpdateClienteDto } from '@/types';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Loading from '@/components/Loading';
import Pagination from '@/components/Pagination';
import CreateClienteForm from './_components/CreateClienteForm';
import EditClienteForm from './_components/EditClienteForm';
import DeleteClienteModal from './_components/DeleteClienteModal';
import { ApiError } from '@/lib/api';
import { CircleX, Info, Pen, Plus, Search, Trash2 } from 'lucide-react';

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination & Search
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalItens, setTotalItens] = useState(0);
  const [busca, setBusca] = useState('');
  const [buscaInput, setBuscaInput] = useState('');
  
  // Modal states
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [clienteExcluindo, setClienteExcluindo] = useState<Cliente | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch clientes
  const fetchClientes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await clienteService.listar({
        pagina,
        tamanhoPagina: 10,
        busca: busca || undefined,
      });
      
      setClientes(response.dados);
      setTotalPaginas(response.totalPaginas);
      setTotalItens(response.totalItens);
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Erro ao carregar clientes';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, [pagina, busca]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setBusca(buscaInput);
    setPagina(1);
  };

  const handleCreate = () => {
    setIsCreateFormOpen(true);
  };

  const handleEdit = (cliente: Cliente) => {
    setClienteEditando(cliente);
    setIsEditFormOpen(true);
  };

  const handleCreateSubmit = async (data: CreateClienteDto) => {
    try {
      setIsSubmitting(true);
      await clienteService.criar(data);
      await fetchClientes();
      setIsCreateFormOpen(false);
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Erro ao criar cliente';
      alert(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (data: UpdateClienteDto) => {
    if (!clienteEditando) return;
    
    try {
      setIsSubmitting(true);
      await clienteService.atualizar(clienteEditando.id, data);
      await fetchClientes();
      setIsEditFormOpen(false);
      setClienteEditando(null);
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Erro ao atualizar cliente';
      alert(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (cliente: Cliente) => {
    setClienteExcluindo(cliente);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!clienteExcluindo) return;

    try {
      setIsSubmitting(true);
      await clienteService.excluir(clienteExcluindo.id);
      await fetchClientes();
      setIsDeleteModalOpen(false);
      setClienteExcluindo(null);
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Erro ao excluir cliente';
      alert(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && clientes.length === 0) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
        </div>
        <Button onClick={handleCreate}>Novo Cliente <Plus className='w-4 h-4'/></Button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <Input
            placeholder="Buscar cliente"
            value={buscaInput}
            onChange={(e) => setBuscaInput(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" variant="primary">
            Buscar
            <Search className="w-4 h-4" />
          </Button>
          {busca && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setBusca('');
                setBuscaInput('');
                setPagina(1);
              }}
            >
              Limpar
              <CircleX className="w-4 h-4" />
            </Button>
          )}
        </div>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Results count */}
      <div className="mb-6">
        <p>
          {totalItens} {totalItens === 1 ? 'resultado' : 'resultados'}
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider bg-gray-200">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider bg-gray-200">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider bg-gray-200">
                Telefone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider bg-gray-200">
                Empresa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider bg-gray-200">
                Oportunidades
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider bg-gray-200">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clientes.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  Nenhum cliente encontrado
                </td>
              </tr>
            ) : (
              clientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {cliente.nome}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {cliente.email}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {cliente.telefone || '-'}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {cliente.empresa || '-'}
                  </td>
                  <td className="px-6 py-4">     
                    {cliente.oportunidadesCount}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium flex justify-end">
                    <Link
                      href={`/clientes/${cliente.id}`}
                      className="hover:bg-sky-700 mr-4 bg-sky-600 px-4 py-2 rounded-lg text-white cursor-pointer flex items-center gap-2"
                    >
                      Detalhes
                      <Info className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleEdit(cliente)}
                      className="hover:bg-green-700 mr-4 bg-green-600 px-4 py-2 rounded-lg text-white cursor-pointer flex items-center gap-2"
                    >
                      Editar
                      <Pen className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cliente)}
                      className="hover:bg-red-700 mr-4 bg-red-600 px-4 py-2 rounded-lg text-white cursor-pointer flex items-center gap-2"
                    >
                      Excluir
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPaginas > 1 && (
        <Pagination
          currentPage={pagina}
          totalPages={totalPaginas}
          onPageChange={setPagina}
        />
      )}

      {/* Create Form Modal */}
      <CreateClienteForm
        isOpen={isCreateFormOpen}
        onClose={() => setIsCreateFormOpen(false)}
        onSubmit={handleCreateSubmit}
        isLoading={isSubmitting}
      />

      {/* Edit Form Modal */}
      {clienteEditando && (
        <EditClienteForm
          isOpen={isEditFormOpen}
          onClose={() => {
            setIsEditFormOpen(false);
            setClienteEditando(null);
          }}
          onSubmit={handleEditSubmit}
          cliente={clienteEditando}
          isLoading={isSubmitting}
        />
      )}

      {/* Delete Modal */}
      {clienteExcluindo && (
        <DeleteClienteModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setClienteExcluindo(null);
          }}
          onConfirm={handleDeleteConfirm}
          cliente={clienteExcluindo}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
}
