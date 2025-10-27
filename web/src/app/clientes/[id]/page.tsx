'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { clienteService } from '@/lib/clienteService';
import { ClienteDetail } from '@/types';
import { estagioNomes, estagioColors, EstagioOportunidade } from '@/types';
import Button from '@/components/Button';
import Loading from '@/components/Loading';
import { ApiError } from '@/lib/api';
import { ArrowLeft, Pen, Plus, Trash2 } from 'lucide-react';

export default function ClienteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clienteId = params.id as string;

  const [cliente, setCliente] = useState<ClienteDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const oportunidades = cliente?.oportunidades || [];

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await clienteService.buscarPorId(clienteId);
        setCliente(data);
      } catch (err) {
        const errorMessage = err instanceof ApiError ? err.message : 'Erro ao carregar cliente';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (clienteId) {
      fetchCliente();
    }
  }, [clienteId]);

  if (loading) {
    return <Loading />;
  }

  if (error || !cliente) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error || 'Cliente não encontrado'}
        </div>
        <Button onClick={() => router.push('/clientes')} className="mt-4">
          Voltar para Clientes
        </Button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value?: number) => {
    if (!value) return '-';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  console.log(oportunidades);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{cliente.nome}</h1>
        </div>
      </div>

      {/* Cliente Info Card */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Informações do Cliente</h2>
        <div className="grid grid-cols-1 gap-2">
          <div>
            <p className="text-gray-900">Email: {cliente.email}</p>
          </div>
          <div>
            <p className="text-gray-900">Telefone: {cliente.telefone || 'Não informado'}</p>
          </div>
          <div>
            <p className="text-gray-900">Empresa: {cliente.empresa || 'Não informada'}</p>
          </div>
          <div>
            <p className="text-gray-900">Cadastrado em: {formatDate(cliente.criadoEm)}</p>
          </div>
        </div>
      </div>

      {/* Oportunidades */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Oportunidades</h1>
          </div>
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
                      {oportunidade.estagio}
                    </td>
                    <td className="px-6 py-4">
                      {formatCurrency(oportunidade.valor)}
                    </td>
                    <td className="px-6 py-4">
                      {oportunidade.probabilidade}%
                    </td>
                    <td className="px-6 py-4">
                      {oportunidade.dataFechamentoPrevista ? formatDate(oportunidade.dataFechamentoPrevista) : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
