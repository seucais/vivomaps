import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import PainelView from '@/components/views/PainelView';
import GravarRotaView, { GravarRotaModal } from '@/components/views/GravarRotaView';
import RotasView from '@/components/views/RotasView';
import CabosView from '@/components/views/CabosView';
import CentraisView from '@/components/views/CentraisView';
import PerfilView from '@/components/views/PerfilView';
import GerenciarUsuariosView from '@/components/views/GerenciarUsuariosView';
import ImportExportView from '@/components/views/ImportExportView';
import { loadBBRData, saveBBRData, resetBBRData } from '@/lib/bbrStore';

export default function Dashboard() {
  const [store, setStore] = useState(() => loadBBRData());
  const [activeView, setActiveView] = useState('painel');

  // Modals state
  const [modalGravarRota, setModalGravarRota] = useState(false);
  const [modalNovoCabo, setModalNovoCabo] = useState(false);
  const [modalNovaCentral, setModalNovaCentral] = useState(false);

  // Route linking and exploration state
  const [linkingCabo, setLinkingCabo] = useState(null);
  const [routeFilterCabo, setRouteFilterCabo] = useState(null);

  const handleNavigateToVincularRotas = (cabo) => {
    setLinkingCabo(cabo);
    setRouteFilterCabo(null);
    setActiveView('rotas');
  };

  const handleExplorarRotas = (cabo) => {
    setRouteFilterCabo(cabo);
    setLinkingCabo(null);
    setActiveView('rotas');
  };

  const handleToggleLinkRotaToCabo = (caboId, rotaId) => {
    setStore(prev => {
      const targetCabo = (prev.cabos || []).find(c => c.id === caboId);
      if (!targetCabo) return prev;

      const currentLinks = targetCabo.rotasVinculadas || [];
      const isLinked = currentLinks.includes(rotaId);
      const updatedLinks = isLinked
        ? currentLinks.filter(id => id !== rotaId)
        : [...currentLinks, rotaId];

      const updatedCabo = { ...targetCabo, rotasVinculadas: updatedLinks };
      const updatedCabos = prev.cabos.map(c => c.id === caboId ? updatedCabo : c);

      if (linkingCabo && linkingCabo.id === caboId) {
        setLinkingCabo(updatedCabo);
      }

      return {
        ...prev,
        cabos: updatedCabos
      };
    });
  };

  // Save state to localStorage safely
  useEffect(() => {
    saveBBRData(store);
  }, [store]);

  const handleResetStore = () => {
    if (window.confirm('Deseja recarregar a base de dados original das planilhas do Google Sheets (1.516 centrais e 127 cabos)? Suas alterações manuais serão preservadas ou reiniciadas.')) {
      const reseted = resetBBRData();
      setStore(reseted);
      alert('✅ Base de dados re-alimentada com sucesso!');
    }
  };

  // Handler for User Profile update (e.g. photo)
  const handleUpdateUsuario = (usuarioAtualizado) => {
    setStore(prev => ({
      ...prev,
      usuarioAtual: usuarioAtualizado,
      usuarios: prev.usuarios.map(u => u.id === usuarioAtualizado.id ? usuarioAtualizado : u)
    }));
  };

  // Handlers for Centrais (Create & Update)
  const handleSaveCentral = (centralData) => {
    setStore(prev => {
      const exists = prev.centrais.some(c => c.id === centralData.id);
      const updatedCentrais = exists
        ? prev.centrais.map(c => c.id === centralData.id ? centralData : c)
        : [centralData, ...prev.centrais];

      return {
        ...prev,
        centrais: updatedCentrais,
        atividades: [
          {
            id: `act_${Date.now()}`,
            usuario: prev.usuarioAtual.nome,
            acao: exists ? 'Edição de Central' : 'Cadastro de Central',
            detalhes: `Central ${centralData.nome} (${centralData.sigla}) ${exists ? 'atualizada' : 'cadastrada'}.`,
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
          },
          ...prev.atividades
        ]
      };
    });
  };

  const handleDeleteCentral = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta central?')) {
      setStore(prev => ({
        ...prev,
        centrais: prev.centrais.filter(c => c.id !== id)
      }));
    }
  };

  // Handlers for Cabos (Create & Update)
  const handleSaveCabo = (caboData) => {
    setStore(prev => {
      const exists = prev.cabos.some(c => c.id === caboData.id);
      const updatedCabos = exists
        ? prev.cabos.map(c => c.id === caboData.id ? caboData : c)
        : [caboData, ...prev.cabos];

      return {
        ...prev,
        cabos: updatedCabos,
        atividades: [
          {
            id: `act_${Date.now()}`,
            usuario: prev.usuarioAtual.nome,
            acao: exists ? 'Edição de Tronco' : 'Cadastro de Tronco',
            detalhes: `Tronco ${caboData.nome} ${exists ? 'atualizado' : 'registrado'}.`,
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
          },
          ...prev.atividades
        ]
      };
    });
  };

  const handleDeleteCabo = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este tronco?')) {
      setStore(prev => ({
        ...prev,
        cabos: prev.cabos.filter(c => c.id !== id)
      }));
    }
  };

  // Handlers for Rotas (Create, Update & Delete)

  const handleSaveRota = (rotaData) => {
    setStore(prev => {
      const safeRotas = prev.rotas || [];
      const exists = safeRotas.some(r => r.id === rotaData.id);
      const updatedRotas = exists
        ? safeRotas.map(r => r.id === rotaData.id ? rotaData : r)
        : [rotaData, ...safeRotas];

      return {
        ...prev,
        rotas: updatedRotas,
        atividades: [
          {
            id: `act_${Date.now()}`,
            usuario: prev.usuarioAtual?.nome || 'william bispo',
            acao: exists ? 'Edição de Rota' : 'Importação de Rota Google Earth',
            detalhes: `Rota ${rotaData.nome} ${exists ? 'atualizada' : 'importada do Google Earth'}.`,
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
          },
          ...(prev.atividades || [])
        ]
      };
    });
  };

  const handleUpdateRota = (rotaAtualizada) => {
    handleSaveRota(rotaAtualizada);
  };

  const handleDeleteRota = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta rota?')) {
      setStore(prev => ({
        ...prev,
        rotas: prev.rotas.filter(r => r.id !== id)
      }));
    }
  };

  // Handlers for User Management
  const handleUpdateUserRole = (id, newRole) => {
    setStore(prev => ({
      ...prev,
      usuarios: prev.usuarios.map(u => u.id === id ? { ...u, role: newRole } : u)
    }));
  };

  const handleApproveUser = (id) => {
    setStore(prev => ({
      ...prev,
      usuarios: prev.usuarios.map(u => u.id === id ? { ...u, status: 'Ativo' } : u)
    }));
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Excluir usuário do sistema?')) {
      setStore(prev => ({
        ...prev,
        usuarios: prev.usuarios.filter(u => u.id !== id)
      }));
    }
  };

  // Handlers for Messages
  const handleEnviarMensagem = (novaMsg) => {
    setStore(prev => ({
      ...prev,
      mensagens: [novaMsg, ...prev.mensagens]
    }));
  };

  // Import / Export
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(store, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `backbone_bbr_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (jsonObj) => {
    if (jsonObj && jsonObj.centrais && jsonObj.cabos) {
      setStore(jsonObj);
    } else {
      alert('Estrutura de JSON inválida.');
    }
  };

  const handleResetData = () => {
    if (window.confirm('Deseja restaurar a base de dados original do BACKBONE - BBR?')) {
      const reset = resetBBRData();
      setStore(reset);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950 font-sans antialiased text-slate-900 dark:text-slate-100">
      {/* Sidebar Fixo */}
      <Sidebar 
        activeView={activeView}
        setActiveView={setActiveView}
        usuario={store.usuarioAtual}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 max-w-[1600px] w-full mx-auto overflow-y-auto">
        {activeView === 'painel' && (
          <PainelView 
            store={store} 
            setActiveView={setActiveView}
            onOpenGravarRotaModal={() => setModalGravarRota(true)}
            onOpenNovoCaboModal={() => setModalNovoCabo(true)}
            onOpenNovaCentralModal={() => setModalNovaCentral(true)}
            onResetData={handleResetData}
          />
        )}

        {activeView === 'gravar-rota' && (
          <GravarRotaView 
            onSaveRota={(novaRota) => {
              handleSaveRota(novaRota);
              setActiveView('rotas');
            }}
            cabos={store.cabos}
            centrais={store.centrais}
          />
        )}

        {activeView === 'rotas' && (
          <RotasView 
            rotas={store.rotas}
            linkingCabo={linkingCabo}
            routeFilterCabo={routeFilterCabo}
            onToggleLinkRotaToCabo={handleToggleLinkRotaToCabo}
            onClearLinkingCabo={() => setLinkingCabo(null)}
            onClearRouteFilterCabo={() => setRouteFilterCabo(null)}
            onNavigateToCabos={() => setActiveView('cabos')}
            onSaveRota={handleSaveRota}
            onUpdateRota={handleUpdateRota}
            onDeleteRota={handleDeleteRota}
            onOpenGravarModal={() => setModalGravarRota(true)}
          />
        )}

        {activeView === 'cabos' && (
          <CabosView 
            cabos={store.cabos}
            rotas={store.rotas}
            onSaveCabo={handleSaveCabo}
            onDeleteCabo={handleDeleteCabo}
            onNavigateToVincularRotas={handleNavigateToVincularRotas}
            onExplorarRotas={handleExplorarRotas}
            isModalOpen={modalNovoCabo}
            setIsModalOpen={setModalNovoCabo}
          />
        )}

        {activeView === 'centrais' && (
          <CentraisView 
            centrais={store.centrais}
            onSaveCentral={handleSaveCentral}
            onDeleteCentral={handleDeleteCentral}
            isModalOpen={modalNovaCentral}
            setIsModalOpen={setModalNovaCentral}
          />
        )}

        {activeView === 'perfil' && (
          <PerfilView 
            usuario={store.usuarioAtual}
            mensagens={store.mensagens}
            onEnviarMensagem={handleEnviarMensagem}
            onUpdateUsuario={handleUpdateUsuario}
          />
        )}

        {activeView === 'usuarios' && (
          <GerenciarUsuariosView 
            usuarios={store.usuarios}
            onUpdateUserRole={handleUpdateUserRole}
            onApproveUser={handleApproveUser}
            onDeleteUser={handleDeleteUser}
          />
        )}

        {activeView === 'import-export' && (
          <ImportExportView 
            store={store}
            onImportJSON={handleImportJSON}
            onExportJSON={handleExportJSON}
            onResetData={handleResetData}
          />
        )}
      </main>

      {/* Global Gravar Rota Modal */}
      <GravarRotaModal 
        isOpen={modalGravarRota}
        onClose={() => setModalGravarRota(false)}
        onSelectTipo={(tipo) => {
          setModalGravarRota(false);
          setActiveView('gravar-rota');
        }}
      />
    </div>
  );
}