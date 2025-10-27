'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { oportunidadeService } from '@/lib/oportunidadeService';
import {
  Oportunidade,
  CreateOportunidadeDto,
  UpdateOportunidadeDto,
  EstagioOportunidade,
  estagioNomes,
  estagioColors,
} from '@/types';
import Button from '@/components/Button';
import Select from '@/components/Select';
import Loading from '@/components/Loading';
import Pagination from '@/components/Pagination';
import CreateOportunidadeForm from './_components/CreateOportunidadeForm';
import EditOportunidadeForm from './_components/EditOportunidadeForm';
import DeleteOportunidadeModal from './_components/DeleteOportunidadeModal';
import { ApiError } from '@/lib/api';
import { Info, Pen, Plus, Trash2 } from 'lucide-react';

export default function OportunidadesPage() {
  const searchParams = useSearchParams();
  const clienteIdParam = searchParams.get('clienteId');

  const [oportunidades, setOportunidades] = useState<Oportunidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination & Filters
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalItens, setTotalItens] = useState(0);
  const [estagioFiltro, setEstagioFiltro] = useState<string>('');

  // Modal states
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [oportunidadeEditando, setOportunidadeEditando] = useState<Oportunidade | null>(null);
  const [oportunidadeExcluindo, setOportunidadeExcluindo] = useState<Oportunidade | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch oportunidades
  const fetchOportunidades = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await oportunidadeService.listar({
        pagina,
        tamanhoPagina: 10,
        clienteId: clienteIdParam || undefined,
        estagio:
          estagioFiltro !== '' ? (parseInt(estagioFiltro) as EstagioOportunidade) : undefined,
      });

      setOportunidades(response.dados);
      setTotalPaginas(response.totalPaginas);
      setTotalItens(response.totalItens);
    } catch (err) {
      const errorMessage =
        err instanceof ApiError ? err.message : 'Erro ao carregar oportunidades';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOportunidades();
  }, [pagina, estagioFiltro, clienteIdParam]);

  const handleCreate = () => {
    setIsCreateFormOpen(true);
  };

  const handleEdit = (oportunidade: Oportunidade) => {
    setOportunidadeEditando(oportunidade);
    setIsEditFormOpen(true);
  };

  const handleCreateSubmit = async (data: CreateOportunidadeDto) => {
    try {
      setIsSubmitting(true);
      await oportunidadeService.criar(data);
      await fetchOportunidades();
      setIsCreateFormOpen(false);
    } catch (err) {
      const errorMessage =
        err instanceof ApiError ? err.message : 'Erro ao criar oportunidade';
      alert(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (data: UpdateOportunidadeDto) => {
    if (!oportunidadeEditando) return;

    try {
      setIsSubmitting(true);
      await oportunidadeService.atualizar(oportunidadeEditando.id, data);
      await fetchOportunidades();
      setIsEditFormOpen(false);
      setOportunidadeEditando(null);
    } catch (err) {
      const errorMessage =
        err instanceof ApiError ? err.message : 'Erro ao atualizar oportunidade';
      alert(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (oportunidade: Oportunidade) => {
    setOportunidadeExcluindo(oportunidade);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!oportunidadeExcluindo) return;

    try {
      setIsSubmitting(true);
      await oportunidadeService.excluir(oportunidadeExcluindo.id);
      await fetchOportunidades();
      setIsDeleteModalOpen(false);
      setOportunidadeExcluindo(null);
    } catch (err) {
      const errorMessage =
        err instanceof ApiError ? err.message : 'Erro ao excluir oportunidade';
      alert(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value?: number) => {
    if (!value) return '-';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const estagioFilterOptions = [
    { value: '', label: 'Todos os estágios' },
    ...Object.entries(EstagioOportunidade)
      .filter(([key]) => isNaN(Number(key)))
      .map(([_, value]) => ({
        value: value.toString(),
        label: estagioNomes[value as EstagioOportunidade],
      })),
  ];

  if (loading && oportunidades.length === 0) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Oportunidades</h1>
        </div>
        <Button onClick={handleCreate}>Nova Oportunidade <Plus className='w-4 h-4'/></Button>
      </div>

      {/* Filters */}
      <div className="mb-6 max-w-xs">
        <Select
          label="Filtrar por estágio"
          value={estagioFiltro}
          onChange={(e) => {
            setEstagioFiltro(e.target.value);
            setPagina(1);
          }}
          options={estagioFilterOptions}
        />
      </div>

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
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider bg-gray-200">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider bg-gray-200">
                Estágio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider bg-gray-200">
                Valor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider bg-gray-200">
                Probabilidade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider bg-gray-200">
                Data Prevista
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider bg-gray-200">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {oportunidades.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  Nenhuma oportunidade encontrada
                </td>
              </tr>
            ) : (
              oportunidades.map((oportunidade) => (
                <tr key={oportunidade.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {oportunidade.titulo}
                  </td>
                    <td className="px-6 py-4">
                      <Link 
                        href={`/clientes/${oportunidade.cliente?.id}`}
                        className="text-sky-600 hover:text-sky-700 hover:underline"
                      >
                        {oportunidade.cliente?.nome}
                      </Link>
                    </td>
                  <td className="px-6 py-4">   
                    {estagioNomes[oportunidade.estagio]}
                  </td>
                  <td className="px-6 py-4">
                    {formatCurrency(oportunidade.valor)}
                  </td>
                  <td className="px-6 py-4">
                    {oportunidade.probabilidade}%
                  </td>
                  <td className="px-6 py-4">
                    {formatDate(oportunidade.dataFechamentoPrevista)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium flex justify-end">
                    <button
                      onClick={() => handleEdit(oportunidade)}
                      className="hover:bg-green-700 mr-4 bg-green-600 px-4 py-2 rounded-lg text-white cursor-pointer flex items-center gap-2"
                    >
                      Editar
                      <Pen className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(oportunidade)}
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
      <CreateOportunidadeForm
        isOpen={isCreateFormOpen}
        onClose={() => setIsCreateFormOpen(false)}
        onSubmit={handleCreateSubmit}
        clienteIdProp={clienteIdParam || undefined}
        isLoading={isSubmitting}
      />

      {/* Edit Form Modal */}
      {oportunidadeEditando && (
        <EditOportunidadeForm
          isOpen={isEditFormOpen}
          onClose={() => {
            setIsEditFormOpen(false);
            setOportunidadeEditando(null);
          }}
          onSubmit={handleEditSubmit}
          oportunidade={oportunidadeEditando}
          isLoading={isSubmitting}
        />
      )}

      {/* Delete Modal */}
      {oportunidadeExcluindo && (
        <DeleteOportunidadeModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setOportunidadeExcluindo(null);
          }}
          onConfirm={handleDeleteConfirm}
          oportunidade={oportunidadeExcluindo}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
}
