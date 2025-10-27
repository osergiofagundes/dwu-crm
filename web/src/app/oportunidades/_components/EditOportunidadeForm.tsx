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
  UpdateOportunidadeDto,
  Oportunidade,
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

interface EditOportunidadeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateOportunidadeDto) => Promise<void>;
  oportunidade: Oportunidade;
  isLoading?: boolean;
}

export default function EditOportunidadeForm({
  isOpen,
  onClose,
  onSubmit,
  oportunidade,
  isLoading = false,
}: EditOportunidadeFormProps) {
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
    defaultValues: {
      titulo: oportunidade.titulo,
      clienteId: oportunidade.clienteId,
      valor: oportunidade.valor?.toString() || '',
      probabilidade: oportunidade.probabilidade.toString(),
      estagio: oportunidade.estagio.toString(),
      dataFechamentoPrevista: oportunidade.dataFechamentoPrevista || '',
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

  // Reset form when oportunidade changes
  useEffect(() => {
    reset({
      titulo: oportunidade.titulo,
      clienteId: oportunidade.clienteId,
      valor: oportunidade.valor?.toString() || '',
      probabilidade: oportunidade.probabilidade.toString(),
      estagio: oportunidade.estagio.toString(),
      dataFechamentoPrevista: oportunidade.dataFechamentoPrevista || '',
    });
  }, [oportunidade, reset]);

  // Reset clienteId after clientes are loaded
  useEffect(() => {
    if (clientes.length > 0 && oportunidade.clienteId) {
      reset({
        titulo: oportunidade.titulo,
        clienteId: oportunidade.clienteId,
        valor: oportunidade.valor?.toString() || '',
        probabilidade: oportunidade.probabilidade.toString(),
        estagio: oportunidade.estagio.toString(),
        dataFechamentoPrevista: oportunidade.dataFechamentoPrevista || '',
      });
    }
  }, [clientes, oportunidade, reset]);

  const handleFormSubmit = async (data: OportunidadeFormData) => {
    try {
      const submitData: UpdateOportunidadeDto = {
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
      console.error('Erro ao atualizar oportunidade:', error);
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
      title="Editar Oportunidade"
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
          disabled={loadingClientes || isLoading}
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
            variant="third"
            disabled={isLoading}
          >
            {isLoading ? 'Editando...' : 'Editar'}
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
