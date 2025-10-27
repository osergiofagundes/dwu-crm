'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
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
    const oportunidade = oportunidades.find((o) => o.id === oportunidadeId);
    if (!oportunidade) return;

    // Determinar o estágio de destino
    // over.id pode ser o ID de uma oportunidade (sortable) ou o ID de um estágio (droppable)
    const overItem = oportunidades.find((o) => o.id === over.id);
    const novoEstagio = overItem 
      ? overItem.estagio 
      : (parseInt(over.id as string) as EstagioOportunidade);

    const estagioAnterior = oportunidade.estagio;
    
    // Se está movendo dentro do mesmo estágio
    if (estagioAnterior === novoEstagio && active.id !== over.id) {
      // Reordenar localmente
      const oportunidadesDoEstagio = oportunidades
        .filter((o) => o.estagio === novoEstagio)
        .sort((a, b) => a.ordem - b.ordem);
      
      const oldIndex = oportunidadesDoEstagio.findIndex((o) => o.id === active.id);
      const newIndex = oportunidadesDoEstagio.findIndex((o) => o.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const reordered = arrayMove(oportunidadesDoEstagio, oldIndex, newIndex);
        
        // Atualizar ordens localmente
        const updatedOportunidades = oportunidades.map((o) => {
          if (o.estagio === novoEstagio) {
            const newOrderIndex = reordered.findIndex((ro) => ro.id === o.id);
            return { ...o, ordem: newOrderIndex };
          }
          return o;
        });
        
        setOportunidades(updatedOportunidades);
        
        // Atualizar no backend com a nova ordem
        try {
          await oportunidadeService.atualizarEstagio(oportunidadeId, {
            estagio: novoEstagio,
            ordem: newIndex,
          });
        } catch (err) {
          const errorMessage =
            err instanceof ApiError ? err.message : 'Erro ao reordenar oportunidade';
          alert(errorMessage);
          await fetchOportunidades();
        }
      }
      return;
    }

    // Se o estágio mudou
    if (estagioAnterior !== novoEstagio) {
      const oportunidadesDestinoAtuais = oportunidades
        .filter((o) => o.estagio === novoEstagio)
        .sort((a, b) => a.ordem - b.ordem);
      
      // Determinar a posição no novo estágio
      let novaOrdem = 0;
      if (overItem) {
        // Soltou em cima de outro card
        novaOrdem = overItem.ordem;
      } else {
        // Soltou na área vazia da coluna (no final)
        novaOrdem = oportunidadesDestinoAtuais.length > 0
          ? Math.max(...oportunidadesDestinoAtuais.map(o => o.ordem)) + 1
          : 0;
      }
      
      // Atualiza localmente primeiro (otimistic update)
      setOportunidades((prev) =>
        prev.map((o) => {
          if (o.id === oportunidadeId) {
            return { ...o, estagio: novoEstagio, ordem: novaOrdem };
          }
          // Atualizar ordens das outras oportunidades no estágio de destino
          if (o.estagio === novoEstagio && o.ordem >= novaOrdem) {
            return { ...o, ordem: o.ordem + 1 };
          }
          return o;
        })
      );

      // Atualiza no backend
      try {
        await oportunidadeService.atualizarEstagio(oportunidadeId, {
          estagio: novoEstagio,
          ordem: novaOrdem,
        });
        // Recarrega para ter certeza que as ordens estão corretas
        await fetchOportunidades();
      } catch (err) {
        const errorMessage =
          err instanceof ApiError ? err.message : 'Erro ao atualizar oportunidade';
        alert(errorMessage);
        // Reverte a mudança em caso de erro
        await fetchOportunidades();
      }
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
          collisionDetection={closestCenter}
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
