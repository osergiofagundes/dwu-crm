import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Oportunidade, EstagioOportunidade, estagioNomes } from '@/types';
import KanbanCard from './KanbanCard';

interface KanbanColumnProps {
  estagio: EstagioOportunidade;
  oportunidades: Oportunidade[];
}

export default function KanbanColumn({
  estagio,
  oportunidades,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: estagio.toString(),
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const valorTotal = oportunidades.reduce(
    (acc, oportunidade) => acc + (oportunidade.valor || 0),
    0
  );

  return (
    <div className="w-full">
      <div className='rounded-lg border-2 border-gray-300 bg-gray-50'>
        {/* Header */}
        <div className="p-4 border-b border-current flex justify-between items-center">
          <h2 className="font-bold text-gray-900">
            {estagioNomes[estagio]}
          </h2>
          <div className="flex gap-4">
            <span>{oportunidades.length} {oportunidades.length === 1 ? 'oportunidade' : 'oportunidades'}</span>
            <span className="font-semibold">{formatCurrency(valorTotal)}</span>
          </div>
        </div>

        {/* Cards Container - Horizontal */}
        <div
          ref={setNodeRef}
          className={`overflow-x-auto`}
        >
          <SortableContext
            items={oportunidades.map((o) => o.id)}
            strategy={horizontalListSortingStrategy}
          >
            {oportunidades.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                Arraste oportunidades aqui
              </div>
            ) : (
              <div className="flex gap-4 pb-2">
                {oportunidades.map((oportunidade) => (
                  <KanbanCard key={oportunidade.id} oportunidade={oportunidade} />
                ))}
              </div>
            )}
          </SortableContext>
        </div>
      </div>
    </div>
  );
}
