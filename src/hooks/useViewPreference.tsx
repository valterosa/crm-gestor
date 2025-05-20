
import { useState, useEffect } from 'react';

type ViewType = 'kanban' | 'tabela' | 'cartoes';

export const useViewPreference = (area: 'leads' | 'tarefas') => {
  const storageKey = `${area}_view_preference`;
  
  // Inicializar com a preferência guardada ou a visualização padrão
  const [activeView, setActiveView] = useState<ViewType>(() => {
    const savedView = localStorage.getItem(storageKey);
    return (savedView as ViewType) || 'kanban';
  });

  // Atualizar o localStorage quando a visualização muda
  useEffect(() => {
    localStorage.setItem(storageKey, activeView);
  }, [activeView, storageKey]);

  return { activeView, setActiveView };
};
