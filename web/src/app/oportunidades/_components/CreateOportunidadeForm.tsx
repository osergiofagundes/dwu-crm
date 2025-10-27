'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { IMaskInput } from 'react-imask';
import Modal from '@/components/Modal';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Button from '@/components/Button';
import {
  CreateOportunidadeDto,
  EstagioOportunidade,
  estagioNomes,
  Cliente,
} from '@/types';
import { clienteService } from '@/lib/clienteService';

const oportunidadeSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  clienteId: z.string().min(1, 'Cliente é obrigatório'),
  valor: z.string().optional(),
  probabilidade: z
    .string()
    .refine((val) => {
      const num = parseInt(val);
      return !isNaN(num) && num >= 0 && num <= 100;
    }, 'Probabilidade deve estar entre 0 e 100'),
  estagio: z.string(),
  dataFechamentoPrevista: z.string().optional(),
});

type OportunidadeFormData = z.infer<typeof oportunidadeSchema>;

interface CreateOportunidadeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateOportunidadeDto) => Promise<void>;
  clienteIdProp?: string;
  isLoading?: boolean;
}

export default function CreateOportunidadeForm({
  isOpen,
  onClose,
  onSubmit,
  clienteIdProp,
  isLoading = false,
}: CreateOportunidadeFormProps) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loadingClientes, setLoadingClientes] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<OportunidadeFormData>({
    resolver: zodResolver(oportunidadeSchema),
    defaultValues: clienteIdProp
      ? {
          clienteId: clienteIdProp,
          estagio: EstagioOportunidade.Prospeccao.toString(),
          probabilidade: '50',
        }
      : {
          estagio: EstagioOportunidade.Prospeccao.toString(),
          probabilidade: '50',
        },
  });

  useEffect(() => {
    if (isOpen) {
      fetchClientes();
    }
  }, [isOpen]);

  const fetchClientes = async () => {
    try {
      setLoadingClientes(true);
      const response = await clienteService.listar({ tamanhoPagina: 1000 });
      setClientes(response.dados);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setLoadingClientes(false);
    }
  };

  const handleFormSubmit = async (data: OportunidadeFormData) => {
    try {
      const submitData = {
        titulo: data.titulo,
        clienteId: data.clienteId,
        valor: data.valor ? parseFloat(data.valor.replace(/\./g, '').replace(',', '.')) : undefined,
        probabilidade: parseInt(data.probabilidade),
        estagio: parseInt(data.estagio) as EstagioOportunidade,
        dataFechamentoPrevista: data.dataFechamentoPrevista || undefined,
      };

      await onSubmit(submitData);
      reset();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar oportunidade:', error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const estagioOptions = Object.entries(EstagioOportunidade)
    .filter(([key]) => isNaN(Number(key)))
    .map(([_, value]) => ({
      value: value.toString(),
      label: estagioNomes[value as EstagioOportunidade],
    }));

  const clienteOptions = [
    { value: '', label: 'Selecione um cliente' },
    ...clientes.map((c) => ({ value: c.id, label: c.nome })),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Nova Oportunidade"
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="Título *"
          {...register('titulo')}
          error={errors.titulo?.message}
          placeholder="Digite o título da oportunidade"
          disabled={isLoading}
        />

        <Select
          label="Cliente *"
          {...register('clienteId')}
          error={errors.clienteId?.message}
          options={clienteOptions}
          disabled={loadingClientes || !!clienteIdProp || isLoading}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor (R$)
            </label>
            <Controller
              name="valor"
              control={control}
              render={({ field }) => (
                <IMaskInput
                  {...field}
                  mask={Number}
                  thousandsSeparator="."
                  radix=","
                  mapToRadix={['.']}
                  scale={2}
                  padFractionalZeros={false}
                  normalizeZeros={true}
                  min={0}
                  max={999999999}
                  placeholder="0,00"
                  disabled={isLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  onAccept={(value) => field.onChange(value)}
                />
              )}
            />
            {errors.valor && (
              <p className="mt-1 text-sm text-red-600">{errors.valor.message}</p>
            )}
          </div>

          <Input
            label="Probabilidade (%) *"
            type="number"
            {...register('probabilidade')}
            error={errors.probabilidade?.message}
            placeholder="50"
            disabled={isLoading}
          />
        </div>

        <Select
          label="Estágio *"
          {...register('estagio')}
          error={errors.estagio?.message}
          options={estagioOptions}
          disabled={isLoading}
        />

        <Input
          label="Data de Fechamento Prevista"
          type="date"
          {...register('dataFechamentoPrevista')}
          error={errors.dataFechamentoPrevista?.message}
          disabled={isLoading}
        />

        <div className="flex gap-3 pt-4 justify-end">
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
          >
            {isLoading ? 'Criando...' : 'Criar'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
