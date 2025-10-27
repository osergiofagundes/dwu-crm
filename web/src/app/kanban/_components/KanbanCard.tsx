import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Link from 'next/link';
import { Oportunidade } from '@/types';

interface KanbanCardProps {
  oportunidade: Oportunidade;
  isDragging?: boolean;
}

export default function KanbanCard({
  oportunidade,
  isDragging = false,
}: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isBeingDragged,
  } = useSortable({ id: oportunidade.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isBeingDragged ? 0.5 : 1,
    width: '320px',
  };

  const formatCurrency = (value?: number) => {
    if (!value) return '-';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing shrink-0 ${
        isDragging ? 'shadow-xl' : ''
      }`}
    >
      <h3 className="mb-2 font-semibold">
        {oportunidade.titulo}
      </h3>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Cliente:</span>
          <span>
            {oportunidade.cliente?.nome}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Valor:</span>
          <span>
            {formatCurrency(oportunidade.valor)}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Probabilidade:</span>
          <span>
            {oportunidade.probabilidade}%
          </span>
        </div>

        {oportunidade.dataFechamentoPrevista && (
          <div className="flex justify-between">
            <span className="text-gray-600">Previsão:</span>
            <span className="font-semibold text-gray-900">
              {formatDate(oportunidade.dataFechamentoPrevista)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
