'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { IMaskInput } from 'react-imask';
import Modal from '@/components/Modal';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { CreateClienteDto } from '@/types';

const clienteSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  telefone: z.string().optional(),
  empresa: z.string().optional(),
});

type ClienteFormData = z.infer<typeof clienteSchema>;

interface CreateClienteFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateClienteDto) => Promise<void>;
  isLoading?: boolean;
}

export default function CreateClienteForm({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: CreateClienteFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
  });

  const handleFormSubmit = async (data: ClienteFormData) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Novo Cliente"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="Nome *"
          {...register('nome')}
          error={errors.nome?.message}
          placeholder="Digite o nome do cliente"
          disabled={isLoading}
        />

        <Input
          label="Email *"
          type="email"
          {...register('email')}
          error={errors.email?.message}
          placeholder="email@exemplo.com"
          disabled={isLoading}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telefone
          </label>
          <Controller
            name="telefone"
            control={control}
            render={({ field }) => (
              <IMaskInput
                {...field}
                mask="(00) 00000-0000"
                placeholder="(00) 00000-0000"
                disabled={isLoading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                onAccept={(value) => field.onChange(value)}
              />
            )}
          />
          {errors.telefone && (
            <p className="mt-1 text-sm text-red-600">{errors.telefone.message}</p>
          )}
        </div>

        <Input
          label="Empresa"
          {...register('empresa')}
          error={errors.empresa?.message}
          placeholder="Nome da empresa"
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
