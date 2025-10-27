'use client';

import Modal from '@/components/Modal';
import Button from '@/components/Button';
import { Oportunidade } from '@/types';

interface DeleteOportunidadeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  oportunidade: Oportunidade;
  isLoading?: boolean;
}

export default function DeleteOportunidadeModal({
  isOpen,
  onClose,
  onConfirm,
  oportunidade,
  isLoading,
}: DeleteOportunidadeModalProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Erro ao excluir oportunidade:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Excluir Oportunidade"
    >
      <div className="space-y-4">
        <div>
          <p className="text-gray-700 mb-4">
            Tem certeza que deseja excluir a oportunidade{' '}
            <strong className="text-gray-900">{oportunidade.titulo}</strong>?
          </p>
          {oportunidade.cliente && (
            <p className="text-sm text-gray-600">
              Cliente: {oportunidade.cliente.nome}
              {oportunidade.cliente.empresa && ` - ${oportunidade.cliente.empresa}`}
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-4 justify-end">
          <Button
            type="button"
            variant="fourth"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Excluindo...' : 'Excluir'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
