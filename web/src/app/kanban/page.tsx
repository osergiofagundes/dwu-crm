'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { oportunidadeService } from '@/lib/oportunidadeService';
import {
  Oportunidade,
  EstagioOportunidade,
  estagioNomes,
  estagioColors,
} from '@/types';
import Loading from '@/components/Loading';
import { ApiError } from '@/lib/api';
import KanbanColumn from './_components/KanbanColumn';
import KanbanCard from './_components/KanbanCard';

export default function KanbanPage() {
  const [oportunidades, setOportunidades] = useState<Oportunidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    fetchOportunidades();
  }, []);

  const fetchOportunidades = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await oportunidadeService.listarTodas();
      setOportunidades(data);
    } catch (err) {
      const errorMessage =
        err instanceof ApiError ? err.message : 'Erro ao carregar oportunidades';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const oportunidadeId = active.id as string;
    const novoEstagio = parseInt(over.id as string) as EstagioOportunidade;

    const oportunidade = oportunidades.find((o) => o.id === oportunidadeId);
    if (!oportunidade) return;

    // Se o estágio não mudou, não faz nada
    if (oportunidade.estagio === novoEstagio) return;

    // Atualiza localmente primeiro (otimistic update)
    setOportunidades((prev) =>
      prev.map((o) =>
        o.id === oportunidadeId ? { ...o, estagio: novoEstagio } : o
      )
    );

    // Atualiza no backend
    try {
      await oportunidadeService.atualizarEstagio(oportunidadeId, {
        estagio: novoEstagio,
      });
    } catch (err) {
      const errorMessage =
        err instanceof ApiError ? err.message : 'Erro ao atualizar oportunidade';
      alert(errorMessage);
      // Reverte a mudança em caso de erro
      await fetchOportunidades();
    }
  };

  const getOportunidadesPorEstagio = (estagio: EstagioOportunidade) => {
    return oportunidades
      .filter((o) => o.estagio === estagio)
      .sort((a, b) => a.ordem - b.ordem);
  };

  const getActiveOportunidade = () => {
    if (!activeId) return null;
    return oportunidades.find((o) => o.id === activeId);
  };

  const estagios = [
    EstagioOportunidade.Prospeccao,
    EstagioOportunidade.Qualificacao,
    EstagioOportunidade.Proposta,
    EstagioOportunidade.Negociacao,
    EstagioOportunidade.FechadoGanho,
    EstagioOportunidade.FechadoPerdido,
  ];

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Kanban</h1>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="space-y-6">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {estagios.map((estagio) => {
            const oportunidadesDoEstagio = getOportunidadesPorEstagio(estagio);
            return (
              <KanbanColumn
                key={estagio}
                estagio={estagio}
                oportunidades={oportunidadesDoEstagio}
              />
            );
          })}

          <DragOverlay>
            {activeId ? (
              <div className="rotate-5 opacity-80">
                <KanbanCard oportunidade={getActiveOportunidade()!} isDragging />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
