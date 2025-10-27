'use client';

import Modal from '@/components/Modal';
import Button from '@/components/Button';
import { Cliente } from '@/types';

interface DeleteClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  cliente: Cliente;
  isLoading?: boolean;
}

export default function DeleteClienteModal({
  isOpen,
  onClose,
  onConfirm,
  cliente,
  isLoading,
}: DeleteClienteModalProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
    }
  };

  const hasOportunidades = cliente.oportunidadesCount > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Excluir Cliente"
    >
      <div className="space-y-4">
        {hasOportunidades ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-medium mb-2">
              Não é possível excluir este cliente.
            </p>
            <p className="text-red-700">
              O cliente <strong>{cliente.nome}</strong> possui{' '}
              <strong>{cliente.oportunidadesCount}</strong>{' '}
              {cliente.oportunidadesCount === 1 ? 'oportunidade vinculada' : 'oportunidades vinculadas'}.
            </p>
          </div>
        ) : (
          <div>
            <p className="text-gray-700 mb-4">
              Tem certeza que deseja excluir o cliente{' '}
              <strong className="text-gray-900">{cliente.nome}</strong>?
            </p>
          </div>
        )}

        <div className="flex gap-3 pt-4 justify-end">
          {!hasOportunidades && (
            <Button
              type="button"
              variant="fourth"
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? 'Excluindo...' : 'Excluir'}
            </Button>
          )}
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            {hasOportunidades ? 'Fechar' : 'Cancelar'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
