import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Target, 
  FolderKanban, 
  Image as ImageIcon, 
  Users, 
  Moon, 
  Sun, 
  ExternalLink, 
  ArrowRight,
  MapPin,
  CloudSun,
  ClipboardList,
  Mail,
  X,
  ShieldCheck,
  TrendingUp,
  HeartHandshake,
  Clock,
  Maximize2,
  RotateCw,
  Search,
  Monitor,
  Edit3,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Check,
  ChevronRight,
  ChevronLeft,
  Layers,
  Activity,
  Server,
  Network,
  Radio,
  Sliders,
  CheckCircle2,
  Globe,
  User,
  Camera,
  Upload,
  Contact,
  Grid,
  GitFork
} from 'lucide-react';

interface Projeto {
  id: string;
  nome: string;
  subtitulo: string;
  categoria: string;
  descricao: string;
  status: string;
  link: string;
  tags: string[];
}

interface Meta {
  id: string;
  titulo: string;
  categoria: string;
  progresso: number;
  prazo: string;
  responsavel: string;
}

interface MembroTime {
  id: string;
  nome: string;
  cargo: string;
  area: string;
  foto: string;
  email: string;
  parentId?: string | null;
  metrica?: string;
  sigla?: string;
}

interface ItemGaleria {
  id: string;
  titulo: string;
  categoria: string;
  url: string;
  data: string;
}

interface SlideCarrossel {
  id: number;
  titulo: string;
  subtitulo: string;
  descricao: string;
  icone: string;
  destaque: string;
  badge: string;
}

interface DadosEmpresa {
  nomeEmpresa: string;
  subtituloHeader: string;
  heroTitulo: string;
  heroDescricao: string;
  carrosselSlides: SlideCarrossel[];
}

// Dados Padrão (Vivo Backbone SPC Minimalista)
const DADOS_PADRAO = {
  empresa: {
    nomeEmpresa: "BACKBONE - SPC",
    subtituloHeader: "Rede Externa & Planta Interna Vivo",
    heroTitulo: "Gestão Operacional de Backbone & Infraestrutura Crítica",
    heroDescricao: "Centralização de processos, monitoramento de atenuamentos e gestão de estações técnicas com foco na alta disponibilidade da rede.",
    carrosselSlides: [
      {
        id: 1,
        titulo: "Operação Integrada de Backbone",
        subtitulo: "Engenharia de Transporte & Conectividade",
        descricao: "Garantimos a máxima disponibilidade nos anéis de fibra e estações do Backbone Vivo em SP, atuando na prevenção e no pronto atendimento de eventos.",
        icone: "🌐",
        destaque: "Operação Contínua 24/7",
        badge: "Escopo Geral"
      },
      {
        id: 2,
        titulo: "Planta Externa (Rede de Fibra Óptica)",
        subtitulo: "Cabos, Anéis de Transporte & TPL",
        descricao: "Supervisão e gerenciamento dos cabos de fibra, atendimento a rompimentos, manutenção preventiva de caixas de emenda e controle digital de TPL.",
        icone: "📡",
        destaque: "Rede Física de Campo",
        badge: "Rede Externa"
      },
      {
        id: 3,
        titulo: "Planta Interna (POPs & Centrais)",
        subtitulo: "Salas Técnicas, DWDM & Climatização",
        descricao: "Operacionalização dos Points of Presence (POPs), geradores de emergência, racks de transmissão DWDM/IP e acompanhamento preventivo das salas técnicas.",
        icone: "🏢",
        destaque: "Estações Técnicas",
        badge: "Planta Interna"
      },
      {
        id: 4,
        titulo: "Sistemas & Aplicações Integradas",
        subtitulo: "TPL, Meteo SP, VivoMaps & Cabos e Centrais",
        descricao: "Hub central de aplicações que unifica autorização de TPLs, alertas climáticos, geolocalização de ocorrências e o cadastro de cabos e centrais (Base44).",
        icone: "⚡",
        destaque: "Plataforma Única",
        badge: "Sistemas & Apps"
      }
    ]
  },
  projetos: [
    {
      id: 'controledetpl',
      nome: 'Controle de TPL',
      subtitulo: 'Gestão de Trabalhos em Linha',
      categoria: 'Rede Externa & Campo',
      descricao: 'Sistema para autorização, controle de TPL e emissão de relatórios de intervenção na rede de fibra.',
      status: 'Em Produção',
      link: typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:3002' : 'https://controledetpl.base44.app',
      tags: ['TPL', 'Planta Externa', 'Relatórios']
    },
    {
      id: 'meteo-vivosp',
      nome: 'Meteo Vivo SP',
      subtitulo: 'Monitoramento Climatológico',
      categoria: 'Planta Interna & Proteção',
      descricao: 'Painel em tempo real de tempestades, raios e alertas para proteção das estações e POPs da Vivo.',
      status: 'Em Produção',
      link: typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:3003' : 'https://meteo-vivosp-app.vercel.app',
      tags: ['Clima', 'Estações', 'Alertas']
    },
    {
      id: 'vivomaps-ocorrencias',
      nome: 'VivoMaps Ocorrências',
      subtitulo: 'Mapeamento Geoespacial de Sinistros',
      categoria: 'Rede Externa & Rastreio',
      descricao: 'Mapa interativo para localização de rompimentos de cabo, ocorrências técnicas e geolocalização de equipes.',
      status: 'Em Produção',
      link: typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:3004' : 'https://vivomaps-ocorrencias.base44.app',
      tags: ['Maps', 'Ocorrências', 'Campo']
    },
    {
      id: 'backbone-bbr-teste',
      nome: 'Cadastro de Cabos e Centrais',
      subtitulo: 'Gestão da Malha de Cabos & Centrais Vivo',
      categoria: 'Planta Interna & Externa',
      descricao: 'Plataforma para cadastro, gravação de rotas GPS, consulta e controle de cabos de fibra e centrais de backbone.',
      status: 'Em Produção',
      link: typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:5176' : 'https://vengeful-smart-cluster-flow.vercel.app',
      tags: ['Cabos', 'Centrais', 'Rotas GPS', 'Backbone']
    }
  ] as Projeto[],
  metas: [
    { id: '1', titulo: "Disponibilidade da Rede de Transporte > 99.99%", categoria: "Backbone", progresso: 98, prazo: "Q3 2026", responsavel: "Operações & Campo" },
    { id: '2', titulo: "Tempo Médio de Atendimento de Rompimentos < 2h", categoria: "Planta Externa", progresso: 92, prazo: "Q3 2026", responsavel: "Equipes de Linha" },
    { id: '3', titulo: "Automação de Alertas Pluviométricos nas Estações", categoria: "Planta Interna", progresso: 88, prazo: "Q4 2026", responsavel: "TI & Meteo SP" },
    { id: '4', titulo: "Digitalização Total dos TPLs de Rede", categoria: "Processos", progresso: 80, prazo: "Q4 2026", responsavel: "Governança TPL" }
  ] as Meta[],
  time: [
    { 
      id: '1', 
      nome: "ROBINSON CRISTOVAM DOS SANTOS", 
      cargo: "GER SR SERVICO AO CLIENTE", 
      area: "Gerência Sênior", 
      foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80", 
      email: "robinson.santos@vivo.com.br",
      parentId: null,
      metrica: "7 / 655"
    },
    { 
      id: '2', 
      nome: "CLEVERSON JOSE PINHEIRO DE ARAUJO", 
      cargo: "GERENTE TELECOM", 
      area: "Backbone & Telecom", 
      foto: "", 
      email: "cleverson.araujo@vivo.com.br",
      parentId: '1',
      metrica: "6 / 31"
    },
    { 
      id: '3', 
      nome: "ERISVELTON MATIAS MAIA", 
      cargo: "COORDENADOR SERVICO AO CLIENTE", 
      area: "Planta Interna", 
      foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80", 
      email: "erisvelton.maia@vivo.com.br",
      parentId: '2',
      metrica: "5 / 5"
    },
    { 
      id: '4', 
      nome: "JEFFERSON RODRIGUES DOS SANTOS", 
      cargo: "CONSULTOR SERVICO AO CLIENTE", 
      area: "Planta Interna", 
      foto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80", 
      email: "jefferson.rodrigues@vivo.com.br",
      parentId: '2',
      metrica: "4 / 12"
    },
    { 
      id: '5', 
      nome: "PAULO ROBERTO MOURA DA SILVA", 
      cargo: "COORDENADOR SERVICO AO CLIENTE", 
      area: "Rede Externa", 
      foto: "", 
      email: "paulo.moura@vivo.com.br",
      parentId: '2',
      metrica: "4 / 4"
    },
    { 
      id: '6', 
      nome: "RAFAEL RODRIGUES MACHADO", 
      cargo: "CONSULTOR SERVICO AO CLIENTE", 
      area: "Rede Externa", 
      foto: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80", 
      email: "rafael.machado@vivo.com.br",
      parentId: '2',
      metrica: "4 / 4"
    },
    { 
      id: '7', 
      nome: "SIDNEY ROGERIO DE FARIA", 
      cargo: "CONSULTOR SERVICO AO CLIENTE", 
      area: "Planta Interna", 
      foto: "", 
      email: "sidney.faria@vivo.com.br",
      parentId: '2',
      metrica: "3 / 3"
    },
    { 
      id: '8', 
      nome: "VINICIUS ABRIL BERNARDES", 
      cargo: "ANALISTA TELECOM SR", 
      area: "Rede Externa", 
      foto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80", 
      email: "vinicius.bernardes@vivo.com.br",
      parentId: '2',
      metrica: "3 / 3"
    }
  ] as MembroTime[],
  galeria: [
    { id: '1', titulo: "Manutenção Preventiva de Cabo Óptico", categoria: "Rede Externa", url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80", data: "Set 2026" },
    { id: '2', titulo: "Inspeção em Sala Técnica de Transmissão", categoria: "Planta Interna", url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80", data: "Ago 2026" },
    { id: '3', titulo: "Alinhamento com Equipes de Linha de Campo", categoria: "Operações", url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80", data: "Jul 2026" },
    { id: '4', titulo: "Celebração de Metas de Disponibilidade", categoria: "Conquistas", url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80", data: "Jun 2026" }
  ] as ItemGaleria[]
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'area' | 'workspace' | 'projetos' | 'metas' | 'galeria' | 'time'>('area');
  const [activeEmbeddedProject, setActiveEmbeddedProject] = useState<string>('controledetpl');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authForm, setAuthForm] = useState({ usuario: '', senha: '' });
  const [authError, setAuthError] = useState<string | null>(null);
  const galeriaFileInputRef = useRef<HTMLInputElement>(null);

  const handleGaleriaFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const nova: ItemGaleria = {
          id: `gal_${Date.now()}`,
          titulo: file.name.replace(/\.[^/.]+$/, ""),
          categoria: "Campo",
          url: event.target?.result as string,
          data: "Set 2026"
        };
        setGaleria([nova, ...galeria]);
        showNotification("Foto adicionada à Galeria com sucesso!");
      };
      reader.readAsDataURL(file);
    }
  };

  // Carrossel
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  // LocalStorage
  const [empresa, setEmpresa] = useState<DadosEmpresa>(() => {
    const saved = localStorage.getItem('clean_backbone_empresa');
    return saved ? JSON.parse(saved) : DADOS_PADRAO.empresa;
  });

  const [projetos, setProjetos] = useState<Projeto[]>(() => {
    try {
      localStorage.removeItem('clean_backbone_projetos_v6');
      localStorage.removeItem('clean_backbone_projetos_v8');
      localStorage.removeItem('clean_backbone_projetos_v9');
      const saved = localStorage.getItem('clean_backbone_projetos_v10_base44');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
          return parsed.map(p => {
            if (p.id === 'controledetpl' || p.nome?.includes('TPL')) {
              return { ...p, link: isLocal ? 'http://localhost:3002' : 'https://controledetpl.base44.app' };
            }
            if (p.id === 'meteo-vivosp' || p.nome?.includes('Meteo')) {
              return { ...p, link: isLocal ? 'http://localhost:3003' : 'https://meteo-vivosp-app.vercel.app' };
            }
            if (p.id === 'vivomaps-ocorrencias' || p.nome?.includes('VivoMaps')) {
              return { ...p, link: isLocal ? 'http://localhost:3004' : 'https://vivomaps-ocorrencias.base44.app' };
            }
            if (p.id === 'backbone-bbr-teste' || p.nome?.includes('Cabos')) {
              return { ...p, link: isLocal ? 'http://localhost:5176' : 'https://vengeful-smart-cluster-flow.vercel.app' };
            }
            return p;
          });
        }
      }
    } catch (e) {}
    return DADOS_PADRAO.projetos;
  });

  const [metas, setMetas] = useState<Meta[]>(() => {
    const saved = localStorage.getItem('clean_backbone_metas');
    return saved ? JSON.parse(saved) : DADOS_PADRAO.metas;
  });

  const [time, setTime] = useState<MembroTime[]>(() => {
    const saved = localStorage.getItem('clean_backbone_time_v3');
    return saved ? JSON.parse(saved) : DADOS_PADRAO.time;
  });

  const [galeria, setGaleria] = useState<ItemGaleria[]>(() => {
    const saved = localStorage.getItem('clean_backbone_galeria');
    return saved ? JSON.parse(saved) : DADOS_PADRAO.galeria;
  });

  useEffect(() => {
    localStorage.setItem('clean_backbone_empresa', JSON.stringify(empresa));
    localStorage.setItem('clean_backbone_projetos_v10_base44', JSON.stringify(projetos));
    localStorage.setItem('clean_backbone_metas', JSON.stringify(metas));
    localStorage.setItem('clean_backbone_time_v3', JSON.stringify(time));
    localStorage.setItem('clean_backbone_galeria', JSON.stringify(galeria));
  }, [empresa, projetos, metas, time, galeria]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const resetarParaPadrao = () => {
    if (window.confirm("Deseja restaurar os dados originais do BACKBONE - SPC?")) {
      setEmpresa(DADOS_PADRAO.empresa);
      setProjetos(DADOS_PADRAO.projetos);
      setMetas(DADOS_PADRAO.metas);
      setTime(DADOS_PADRAO.time);
      setGaleria(DADOS_PADRAO.galeria);
      localStorage.clear();
      showNotification("Conteúdo restaurado para o padrão!");
    }
  };

  const currentProject = projetos.find(p => p.id === activeEmbeddedProject) || projetos[0];

  const filteredProjetos = projetos.filter(p => 
    p.nome.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.descricao.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % empresa.carrosselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + empresa.carrosselSlides.length) % empresa.carrosselSlides.length);
  };

  // Organograma & Edição de Foto
  const [editingMember, setEditingMember] = useState<MembroTime | null>(null);
  const [viewModeTime, setViewModeTime] = useState<'organograma' | 'grid'>('organograma');

  const renderOrganogramCard = (m: MembroTime) => {
    const isRedeExterna = m.area?.toLowerCase().includes('externa');
    const isPlantaInterna = m.area?.toLowerCase().includes('interna');

    return (
      <div 
        key={m.id}
        className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-sm hover:shadow-md hover:border-violet-300 dark:hover:border-violet-800 transition-all flex items-center justify-between gap-3 relative w-[310px] sm:w-[330px] group shrink-0"
      >
        {/* LADO ESQUERDO: FOTO DO COLABORADOR COM HOVER DE TROCA */}
        <div 
          onClick={() => setEditingMember(m)}
          className="relative cursor-pointer shrink-0 group/photo"
          title="Clique para trocar a foto"
        >
          {m.foto ? (
            <img 
              src={m.foto} 
              alt={m.nome} 
              className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-xs" 
            />
          ) : m.sigla ? (
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center justify-center border border-slate-200 dark:border-slate-700">
              {m.sigla}
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center border border-slate-200 dark:border-slate-700">
              <User className="w-6 h-6" />
            </div>
          )}

          {/* Badge flutuante de foto no hover */}
          <div className="absolute inset-0 rounded-full bg-violet-600/70 text-white flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity">
            <Camera className="w-4 h-4" />
          </div>
        </div>

        {/* MEIO: NOME, CARGO, MÉTRICA E AREA BADGE */}
        <div className="flex-1 min-w-0 pr-1">
          <h4 className="font-bold text-[11px] text-slate-900 dark:text-white uppercase tracking-tight truncate leading-tight">
            {m.nome}
          </h4>
          <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide truncate mt-0.5">
            {m.cargo}
          </p>
          <div className="mt-1 flex items-center justify-between gap-1">
            <span className="text-[11px] font-bold text-slate-900 dark:text-white font-mono">
              {m.metrica || '1 / 1'}
            </span>
            {m.area && (
              <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                isRedeExterna 
                  ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40' 
                  : isPlantaInterna 
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                {m.area}
              </span>
            )}
          </div>
        </div>

        {/* LADO DIREITO: ÍCONE DE CARTÃO / EDITAR */}
        <div className="shrink-0 flex items-center">
          <button 
            onClick={() => setEditingMember(m)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-slate-800 transition"
            title="Editar Colaborador & Foto"
          >
            <Contact className="w-4 h-4" />
          </button>
        </div>

      </div>
    );
  };

  const currentSlide = empresa.carrosselSlides[currentSlideIndex] || empresa.carrosselSlides[0];

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] dark:bg-[#090d16] text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-sans antialiased transition-colors duration-200">
      
      {/* NOTIFICAÇÃO TOAST MINIMALISTA */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-medium shadow-md flex items-center gap-2 text-xs animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          {notification}
        </div>
      )}

      {/* NAVBAR CLEAN E MINIMALISTA */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between gap-3">
          
          {/* LOGO MINIMALISTA COM TOQUE ROXO VIVO */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => setActiveTab('area')}
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 text-white font-bold text-xs flex items-center justify-center shadow-sm shadow-purple-500/20">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-sm leading-none text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                <span>{empresa.nomeEmpresa}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-violet-600 dark:bg-violet-400"></span>
              </h1>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                {empresa.subtituloHeader}
              </span>
            </div>
          </div>

          {/* MENUS CLEAN COM TOQUE DE ROXO VIVO */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { id: 'area', label: 'Nossa Área' },
              { id: 'workspace', label: 'Aplicações Integradas', isLive: true },
              { id: 'projetos', label: 'Projetos' },
              { id: 'metas', label: 'Metas' },
              { id: 'galeria', label: 'Galeria' },
              { id: 'time', label: 'Time' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 font-semibold border border-violet-200/80 dark:border-violet-800/60 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {tab.label}
                {tab.isLive && (
                  <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-violet-500 inline-block animate-pulse"></span>
                )}
              </button>
            ))}
          </nav>

          {/* CONTROLES: MODO EDIÇÃO + DARK MODE */}
          <div className="flex items-center gap-2">
            
            {/* BOTÃO MODO EDIÇÃO */}
            <button
              onClick={() => {
                if (isEditMode) {
                  setIsEditMode(false);
                  showNotification("Modo Edição desativado.");
                } else {
                  setAuthForm({ usuario: '', senha: '' });
                  setAuthError(null);
                  setShowAuthModal(true);
                }
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
                isEditMode
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
              title="Ativar/Desativar edição de conteúdo (Requer Autenticação)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>{isEditMode ? 'Edição Ativa' : 'Editar Conteúdo'}</span>
            </button>

            {/* BOTÃO TEMA */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Alternar Tema Claro/Escuro"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

          </div>

        </div>
      </header>

      {/* PAINEL DE CONTROLE DE EDIÇÃO */}
      {isEditMode && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs text-amber-700 dark:text-amber-300 flex items-center justify-between">
          <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <Edit3 className="w-3.5 h-3.5" />
              Você está no <strong>Modo Edição</strong>. Clique nos campos abaixo para alterar o conteúdo.
            </span>
            <button 
              onClick={resetarParaPadrao}
              className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-800 dark:text-amber-200 font-medium text-[11px] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Restaurar Padrão
            </button>
          </div>
        </div>
      )}

      {/* MOBILE NAV TAB BAR (TOP QUICK BAR) */}
      <div className="md:hidden flex overflow-x-auto bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-2 gap-1.5 scrollbar-none snap-x sticky top-[60px] z-30">
        {[
          { id: 'area', label: 'Nossa Área' },
          { id: 'workspace', label: 'Apps Embutidos 🟣' },
          { id: 'projetos', label: 'Projetos' },
          { id: 'metas', label: 'Metas' },
          { id: 'galeria', label: 'Galeria' },
          { id: 'time', label: 'Time' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition snap-start active:scale-95 ${
              activeTab === tab.id
                ? 'bg-violet-600 text-white dark:bg-violet-500 dark:text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ÁREA DE CONTEÚDO PRINCIPAL */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 pb-24 md:pb-6">

        {/* ================= ABA: NOSSA ÁREA ================= */}
        {activeTab === 'area' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* HERO CLEAN MINIMALISTA COM CIDADE CONECTADA E TOQUE DE ROXO VIVO */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[200px]">
              
              {/* Linha acentuada em roxo Vivo no topo do Hero */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600"></div>

              <div className="space-y-3 max-w-3xl relative z-10 pt-1">
                {isEditMode ? (
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-slate-400 uppercase">Título do Hero</label>
                    <input 
                      type="text"
                      value={empresa.heroTitulo}
                      onChange={(e) => setEmpresa({...empresa, heroTitulo: e.target.value})}
                      className="w-full p-2 text-base font-semibold border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                    />
                    <label className="text-[11px] font-semibold text-slate-400 uppercase mt-2">Descrição</label>
                    <textarea 
                      value={empresa.heroDescricao}
                      onChange={(e) => setEmpresa({...empresa, heroDescricao: e.target.value})}
                      rows={2}
                      className="w-full p-2 text-xs border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                    />
                  </div>
                ) : (
                  <>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200/80 dark:border-violet-800/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-600 dark:bg-violet-400 animate-pulse"></span>
                      <span>Vivo Backbone SPC • Infraestrutura Crítica</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight leading-snug">
                      {empresa.heroTitulo}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                      {empresa.heroDescricao}
                    </p>
                  </>
                )}

                <div className="pt-2 flex flex-wrap gap-2">
                  <button 
                    onClick={() => {
                      setActiveTab('workspace');
                      setActiveEmbeddedProject('controledetpl');
                    }}
                    className="px-3.5 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-semibold transition shadow-sm shadow-violet-600/20 flex items-center gap-1.5"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    Acessar Aplicações Integradas
                  </button>
                  <button 
                    onClick={() => setActiveTab('projetos')}
                    className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                  >
                    Ver Lista de Projetos
                  </button>
                </div>
              </div>

            </div>

            {/* PAINEL DE MÉTRICAS MINIMALISTA */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { valor: "99.99%", rótulo: "Disponibilidade da Rede" },
                { valor: "100%", rótulo: "Manutenção Preventiva" },
                { valor: "24/7", rótulo: "Supervisão de POPs" },
                { valor: "3", rótulo: "Sistemas Integrados" }
              ].map((m, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-1 relative overflow-hidden group hover:border-violet-300 dark:hover:border-violet-800/80 transition-colors">
                  <div className="w-1 h-full absolute left-0 top-0 bg-violet-500/0 group-hover:bg-violet-600 transition-all"></div>
                  <span className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{m.valor}</span>
                  <p className="text-[11px] text-slate-500 font-medium">{m.rótulo}</p>
                </div>
              ))}
            </div>

            {/* CARROSSEL MINIMALISTA "NOSSA ÁREA" */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>Nossa Área — Backbone SPC</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
                  </h3>
                  <p className="text-xs text-slate-500">Conheça o escopo de atuação em Planta Externa & Planta Interna.</p>
                </div>

                {/* Botões do Carrossel */}
                <div className="flex items-center gap-1">
                  <button 
                    onClick={prevSlide}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-violet-50 hover:border-violet-200 dark:hover:bg-slate-800 transition"
                    title="Anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-medium text-slate-400 px-1 font-mono">
                    {currentSlideIndex + 1} / {empresa.carrosselSlides.length}
                  </span>
                  <button 
                    onClick={nextSlide}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-violet-50 hover:border-violet-200 dark:hover:bg-slate-800 transition"
                    title="Próximo"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* CARD DO CARROSSEL CLEAN */}
              <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 transition-all duration-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500/40 via-purple-500/40 to-transparent"></div>
                {isEditMode ? (
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-slate-400 uppercase">Título do Slide</label>
                    <input 
                      type="text"
                      value={currentSlide.titulo}
                      onChange={(e) => {
                        const copy = [...empresa.carrosselSlides];
                        copy[currentSlideIndex].titulo = e.target.value;
                        setEmpresa({...empresa, carrosselSlides: copy});
                      }}
                      className="w-full p-2 text-sm font-semibold border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                    />
                    <label className="text-[11px] font-semibold text-slate-400 uppercase">Subtítulo</label>
                    <input 
                      type="text"
                      value={currentSlide.subtitulo}
                      onChange={(e) => {
                        const copy = [...empresa.carrosselSlides];
                        copy[currentSlideIndex].subtitulo = e.target.value;
                        setEmpresa({...empresa, carrosselSlides: copy});
                      }}
                      className="w-full p-2 text-xs border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                    />
                    <label className="text-[11px] font-semibold text-slate-400 uppercase">Descrição</label>
                    <textarea 
                      value={currentSlide.descricao}
                      onChange={(e) => {
                        const copy = [...empresa.carrosselSlides];
                        copy[currentSlideIndex].descricao = e.target.value;
                        setEmpresa({...empresa, carrosselSlides: copy});
                      }}
                      rows={3}
                      className="w-full p-2 text-xs border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{currentSlide.icone}</span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200/80 dark:border-violet-800/60 uppercase tracking-wide">
                        {currentSlide.badge}
                      </span>
                    </div>
                    <h4 className="text-base font-semibold text-slate-900 dark:text-white leading-tight">
                      {currentSlide.titulo}
                    </h4>
                    <p className="text-xs font-medium text-slate-500">{currentSlide.subtitulo}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                      {currentSlide.descricao}
                    </p>
                  </div>
                )}

                {/* PONTINHOS DO CARROSSEL */}
                <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    {empresa.carrosselSlides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlideIndex(idx)}
                        className={`h-1.5 rounded-full transition-all ${
                          currentSlideIndex === idx 
                            ? 'w-6 bg-violet-600 dark:bg-violet-400 shadow-xs' 
                            : 'w-1.5 bg-slate-300 dark:bg-slate-700 hover:bg-violet-300'
                        }`}
                      />
                    ))}
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono">Slide {currentSlideIndex + 1} de {empresa.carrosselSlides.length}</span>
                </div>
              </div>
            </div>

            {/* SEÇÃO TRÊS PILARES MINIMALISTAS */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Pilares do Backbone</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <h4 className="font-semibold text-xs text-slate-900 dark:text-white">Rede Externa (Planta Externa)</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Manutenção preventiva de rotas de fibra óptica, atenuamentos, caixas de emenda e TPLs.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <h4 className="font-semibold text-xs text-slate-900 dark:text-white">Planta Interna (POPs & Centrais)</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Operacionalização das estações centrais, equipamentos DWDM/IP e ar condicionado de precisão.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <h4 className="font-semibold text-xs text-slate-900 dark:text-white">Integração de Sistemas 360</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Hub com os 3 sistemas: Controle de TPL, alertas climáticos Meteo SP e mapa VivoMaps Ocorrências.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ================= ABA: WORKSPACE / PROJETOS EMBUTIDOS INTEGRADOS ================= */}
        {activeTab === 'workspace' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            
            {/* TOPO DO EMBEDDED VIEWER */}
            <div className="p-3 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              
              {/* Seleção do Projeto para Incorporação */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1 whitespace-nowrap">
                  Aplicação Integrada:
                </span>
                {projetos.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActiveEmbeddedProject(p.id);
                      setIframeKey(prev => prev + 1);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
                      activeEmbeddedProject === p.id
                        ? 'bg-violet-600 text-white font-semibold shadow-sm shadow-violet-600/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>{p.nome === 'Controle de TPL' ? '📊' : p.nome === 'Meteo Vivo SP' ? '🌦️' : p.nome === 'VivoMaps Ocorrências' ? '🗺️' : '🌐'}</span>
                    <span>{p.nome}</span>
                  </button>
                ))}
              </div>

              {/* Ações da Janela */}
              <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end text-xs">
                <button
                  onClick={() => setIframeKey(prev => prev + 1)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  title="Recarregar App"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
                <a
                  href={currentProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1 font-medium"
                >
                  <span>Abrir em Nova Aba</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  title="Tela Cheia"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            {/* IFRAME CONTAINER INTEGRADO */}
            <div className={`relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-sm transition-all duration-200 ${
              isFullscreen ? 'fixed inset-0 sm:inset-3 z-50 border-0 sm:border-2 border-slate-800 dark:border-slate-200 shadow-2xl rounded-none sm:rounded-xl' : 'h-[75vh] sm:h-[680px] w-full'
            }`}>
              
              <div className="bg-slate-100 dark:bg-slate-950 px-3 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2 truncate pr-2">
                  <span className="w-2 h-2 rounded-full bg-violet-500 shrink-0 animate-pulse"></span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">{currentProject.nome}</span>
                </div>
                {isFullscreen ? (
                  <button onClick={() => setIsFullscreen(false)} className="px-2 py-1 rounded bg-rose-500 text-white text-[11px] font-bold shrink-0">
                    ✕ Fechar Tela Cheia
                  </button>
                ) : (
                  <button onClick={() => setIsFullscreen(true)} className="sm:hidden px-2 py-1 rounded bg-violet-600 text-white text-[11px] font-bold shrink-0">
                    ⛶ Expandir Tela
                  </button>
                )}
              </div>

              <iframe
                key={iframeKey}
                src={currentProject.link}
                title={currentProject.nome}
                allow="geolocation; camera; microphone; clipboard-write; encrypted-media"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-downloads allow-storage-access-by-user-activation"
                className="w-full h-[calc(100%-35px)] border-none bg-white dark:bg-slate-950"
              ></iframe>
            </div>

          </div>
        )}

        {/* ================= ABA: PROJETOS ================= */}
        {activeTab === 'projetos' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">Lista de Projetos do Backbone</h2>
                <p className="text-xs text-slate-500">Acesse os sistemas integrados ou abra em abas externas.</p>
              </div>

              {isEditMode && (
                <button 
                  onClick={() => {
                    const novo: Projeto = {
                      id: `proj_${Date.now()}`,
                      nome: "Novo Projeto",
                      subtitulo: "Descrição rápida",
                      categoria: "Geral",
                      descricao: "Detalhes do novo projeto...",
                      status: "Desenvolvimento",
                      link: "http://localhost:3000",
                      tags: ["Novo"]
                    };
                    setProjetos([...projetos, novo]);
                    showNotification("Novo projeto adicionado!");
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-medium text-xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Adicionar Projeto
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredProjetos.map((proj, idx) => (
                <div key={proj.id} className="p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    {isEditMode ? (
                      <div className="space-y-2">
                        <input 
                          type="text"
                          value={proj.nome}
                          onChange={(e) => {
                            const copy = [...projetos];
                            copy[idx].nome = e.target.value;
                            setProjetos(copy);
                          }}
                          className="w-full p-1.5 font-semibold text-xs border rounded dark:bg-slate-800 dark:border-slate-700"
                        />
                        <textarea 
                          value={proj.descricao}
                          onChange={(e) => {
                            const copy = [...projetos];
                            copy[idx].descricao = e.target.value;
                            setProjetos(copy);
                          }}
                          rows={2}
                          className="w-full p-1.5 text-xs border rounded dark:bg-slate-800 dark:border-slate-700"
                        />
                        <input 
                          type="text"
                          value={proj.link}
                          onChange={(e) => {
                            const copy = [...projetos];
                            copy[idx].link = e.target.value;
                            setProjetos(copy);
                          }}
                          placeholder="URL do Link"
                          className="w-full p-1.5 text-[11px] font-mono border rounded dark:bg-slate-800 dark:border-slate-700"
                        />
                        <button 
                          onClick={() => {
                            setProjetos(projetos.filter(p => p.id !== proj.id));
                            showNotification("Projeto removido.");
                          }}
                          className="text-xs text-rose-500 hover:underline flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Excluir Projeto
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-400">{proj.categoria}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 font-medium border border-violet-200/60 dark:border-violet-800/40">
                            {proj.status}
                          </span>
                        </div>
                        <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{proj.nome === 'Controle de TPL' ? '📊' : proj.nome === 'Meteo Vivo SP' ? '🌦️' : proj.nome === 'VivoMaps Ocorrências' ? '🗺️' : '🌐'}</span>
                          <span>{proj.nome}</span>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{proj.descricao}</p>
                      </>
                    )}
                  </div>

                  <div className="pt-2 space-y-1.5">
                    <button 
                      onClick={() => {
                        setActiveTab('workspace');
                        setActiveEmbeddedProject(proj.id);
                      }}
                      className="w-full py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium rounded-lg transition shadow-sm shadow-violet-600/20 flex items-center justify-center gap-1"
                    >
                      <Monitor className="w-3.5 h-3.5" /> Abrir Embutido
                    </button>
                    <a 
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center justify-center gap-1"
                    >
                      <span>Abrir em Nova Aba</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= ABA: METAS & OKRS ================= */}
        {activeTab === 'metas' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">Objetivos & Metas (Backbone SPC)</h2>
                <p className="text-xs text-slate-500">Indicadores de progresso da operação de rede.</p>
              </div>

              {isEditMode && (
                <button 
                  onClick={() => {
                    const nova: Meta = {
                      id: `meta_${Date.now()}`,
                      titulo: "Nova Meta",
                      categoria: "Geral",
                      progresso: 50,
                      prazo: "Q4 2026",
                      responsavel: "Time"
                    };
                    setMetas([...metas, nova]);
                    showNotification("Nova meta adicionada!");
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-medium text-xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Nova Meta
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {metas.map((meta, idx) => (
                <div key={meta.id} className="p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-3">
                  {isEditMode ? (
                    <div className="space-y-2">
                      <input 
                        type="text"
                        value={meta.titulo}
                        onChange={(e) => {
                          const copy = [...metas];
                          copy[idx].titulo = e.target.value;
                          setMetas(copy);
                        }}
                        className="w-full p-1.5 font-semibold text-xs border rounded dark:bg-slate-800 dark:border-slate-700"
                      />
                      <div className="flex gap-2">
                        <input 
                          type="number"
                          min={0}
                          max={100}
                          value={meta.progresso}
                          onChange={(e) => {
                            const copy = [...metas];
                            copy[idx].progresso = Number(e.target.value);
                            setMetas(copy);
                          }}
                          className="w-24 p-1.5 text-xs border rounded dark:bg-slate-800 dark:border-slate-700"
                        />
                        <input 
                          type="text"
                          value={meta.responsavel}
                          onChange={(e) => {
                            const copy = [...metas];
                            copy[idx].responsavel = e.target.value;
                            setMetas(copy);
                          }}
                          className="flex-1 p-1.5 text-xs border rounded dark:bg-slate-800 dark:border-slate-700"
                        />
                      </div>
                      <button 
                        onClick={() => {
                          setMetas(metas.filter(m => m.id !== meta.id));
                          showNotification("Meta removida.");
                        }}
                        className="text-xs text-rose-500 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Excluir Meta
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wide">{meta.categoria}</span>
                          <h3 className="font-semibold text-sm text-slate-900 dark:text-white">{meta.titulo}</h3>
                          <span className="text-xs text-slate-500">Responsável: {meta.responsavel}</span>
                        </div>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {meta.prazo}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Progresso</span>
                          <span className="font-semibold text-violet-700 dark:text-violet-300">{meta.progresso}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-violet-600 to-purple-600 rounded-full transition-all duration-500"
                            style={{ width: `${meta.progresso}%` }}
                          ></div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= ABA: GALERIA DO TIME ================= */}
        {activeTab === 'galeria' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">Galeria do Backbone</h2>
                <p className="text-xs text-slate-500">Fotos de campo, estações técnicas e equipe.</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={galeriaFileInputRef}
                  onChange={handleGaleriaFileUpload}
                  accept="image/*"
                  className="hidden"
                />

                <button
                  onClick={() => galeriaFileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                  title="Upload de foto do computador ou câmera"
                >
                  <Upload className="w-3.5 h-3.5 text-violet-200" />
                  <span>Upload de Foto</span>
                </button>

                {isEditMode && (
                  <button 
                    onClick={() => {
                      const nova: ItemGaleria = {
                        id: `foto_${Date.now()}`,
                        titulo: "Nova Foto",
                        categoria: "Eventos",
                        url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
                        data: "2026"
                      };
                      setGaleria([...galeria, nova]);
                      showNotification("Foto adicionada!");
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-medium text-xs flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar URL
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {galeria.map((g, idx) => (
                <div key={g.id} className="p-2 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-2 group hover:border-violet-300 dark:hover:border-violet-800/60 transition">
                  <div 
                    onClick={() => !isEditMode && setModalImage(g.url)}
                    className="h-44 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer"
                  >
                    <img src={g.url} alt={g.titulo} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  </div>
                  
                  {isEditMode ? (
                    <div className="space-y-1.5 p-1">
                      <input 
                        type="text"
                        value={g.titulo}
                        onChange={(e) => {
                          const copy = [...galeria];
                          copy[idx].titulo = e.target.value;
                          setGaleria(copy);
                        }}
                        className="w-full p-1 text-xs border rounded dark:bg-slate-800 dark:border-slate-700"
                      />
                      <input 
                        type="text"
                        value={g.url}
                        onChange={(e) => {
                          const copy = [...galeria];
                          copy[idx].url = e.target.value;
                          setGaleria(copy);
                        }}
                        placeholder="URL da Foto"
                        className="w-full p-1 text-[10px] border rounded dark:bg-slate-800 dark:border-slate-700 font-mono"
                      />
                      <button 
                        onClick={() => {
                          setGaleria(galeria.filter(item => item.id !== g.id));
                          showNotification("Foto removida.");
                        }}
                        className="text-xs text-rose-500 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Excluir Foto
                      </button>
                    </div>
                  ) : (
                    <div className="p-1">
                      <span className="text-[10px] text-violet-600 dark:text-violet-400 font-semibold uppercase">{g.categoria}</span>
                      <h4 className="font-semibold text-xs text-slate-900 dark:text-white leading-tight">{g.titulo}</h4>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= ABA: QUEM SOMOS / TIME (ORGANOGRAMA INTERATIVO) ================= */}
        {activeTab === 'time' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* CABEÇALHO DO ORGANOGRAMA */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#0f172a] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Organograma Vivo Backbone</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 font-semibold border border-violet-200/80 dark:border-violet-800/60">
                    Interativo
                  </span>
                </h2>
                <p className="text-xs text-slate-500">Clique na foto ou no ícone de qualquer colaborador para trocar a imagem, cargo e posição hierárquica.</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Alternar Organograma vs Grade */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium">
                  <button
                    onClick={() => setViewModeTime('organograma')}
                    className={`px-2.5 py-1 rounded-md transition flex items-center gap-1.5 ${
                      viewModeTime === 'organograma'
                        ? 'bg-white dark:bg-slate-900 text-violet-700 dark:text-violet-300 font-semibold shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <GitFork className="w-3.5 h-3.5" />
                    <span>Organograma</span>
                  </button>
                  <button
                    onClick={() => setViewModeTime('grid')}
                    className={`px-2.5 py-1 rounded-md transition flex items-center gap-1.5 ${
                      viewModeTime === 'grid'
                        ? 'bg-white dark:bg-slate-900 text-violet-700 dark:text-violet-300 font-semibold shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Grid className="w-3.5 h-3.5" />
                    <span>Grade</span>
                  </button>
                </div>

                {/* Botão Adicionar Colaborador */}
                <button 
                  onClick={() => {
                    const novo: MembroTime = {
                      id: `membro_${Date.now()}`,
                      nome: "NOVO COLABORADOR",
                      cargo: "COORDENADOR SERVICO AO CLIENTE",
                      area: "Operação",
                      foto: "",
                      email: "colaborador@vivo.com.br",
                      parentId: '2',
                      metrica: "1 / 1"
                    };
                    setTime([...time, novo]);
                    setEditingMember(novo);
                    showNotification("Novo colaborador adicionado. Configure a foto e o cargo!");
                  }}
                  className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Adicionar no Organograma
                </button>
              </div>
            </div>

            {/* MODO ORGANOGRAMA ÁRVORE HIERÁRQUICA */}
            {viewModeTime === 'organograma' ? (
              <div className="overflow-x-auto pb-8 pt-4">
                <div className="min-w-[720px] flex flex-col items-center space-y-2">
                  
                  {/* NÍVEL 1: GERÊNCIA SÊNIOR / TOPO */}
                  {time.filter(t => !t.parentId || !time.some(parent => parent.id === t.parentId)).map(topMember => (
                    <div key={topMember.id} className="flex flex-col items-center w-full">
                      
                      {/* CARD TOP MEMBER (GER SR SERVICO AO CLIENTE) */}
                      {renderOrganogramCard(topMember)}

                      {/* FILHOS DO NÍVEL 1 */}
                      {time.some(t => t.parentId === topMember.id) && (
                        <div className="w-full flex flex-col items-center">
                          
                          {/* Linha vertical conectando ao Nível 2 */}
                          <div className="w-0.5 h-7 bg-slate-300 dark:bg-slate-700"></div>

                          {/* NÍVEL 2: GERÊNCIA TELECOM */}
                          <div className="flex justify-center gap-8 w-full">
                            {time.filter(t => t.parentId === topMember.id).map(level2Member => (
                              <div key={level2Member.id} className="flex flex-col items-center w-full">
                                
                                {/* CARD LEVEL 2 MEMBER (GERENTE TELECOM) */}
                                {renderOrganogramCard(level2Member)}

                                {/* FILHOS DO NÍVEL 2 */}
                                {time.some(t => t.parentId === level2Member.id) && (
                                  <div className="w-full flex flex-col items-center">
                                    
                                    {/* Linha vertical conectando à barra horizontal */}
                                    <div className="w-0.5 h-7 bg-slate-300 dark:bg-slate-700"></div>
                                    
                                    {/* Linha horizontal para o nível 3 */}
                                    <div className="w-[85%] h-0.5 bg-slate-300 dark:bg-slate-700"></div>

                                    {/* NÍVEL 3: COORDENADORES E CONSULTORES DIVIDIDOS EM REDE EXTERNA E PLANTA INTERNA */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-3 max-w-4xl w-full">
                                      
                                      {/* REDE EXTERNA: PAULO, RAFAEL, VINICIUS */}
                                      <div className="space-y-3 bg-purple-500/5 dark:bg-purple-950/20 p-3.5 rounded-2xl border border-purple-200/60 dark:border-purple-800/40 flex flex-col items-center">
                                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider shadow-xs">
                                          <span>📡 Rede Externa</span>
                                        </div>
                                        <div className="space-y-3 w-full flex flex-col items-center">
                                          {time.filter(t => t.parentId === level2Member.id && t.area?.toLowerCase().includes('externa')).map(level3Member => (
                                            <div key={level3Member.id} className="flex justify-center w-full">
                                              {renderOrganogramCard(level3Member)}
                                            </div>
                                          ))}
                                        </div>
                                      </div>

                                      {/* PLANTA INTERNA: JEFFERSON, ERISVELTON, SIDNEY */}
                                      <div className="space-y-3 bg-blue-500/5 dark:bg-blue-950/20 p-3.5 rounded-2xl border border-blue-200/60 dark:border-blue-800/40 flex flex-col items-center">
                                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider shadow-xs">
                                          <span>🏢 Planta Interna</span>
                                        </div>
                                        <div className="space-y-3 w-full flex flex-col items-center">
                                          {time.filter(t => t.parentId === level2Member.id && (t.area?.toLowerCase().includes('interna') || !t.area?.toLowerCase().includes('externa'))).map(level3Member => (
                                            <div key={level3Member.id} className="flex justify-center w-full">
                                              {renderOrganogramCard(level3Member)}
                                            </div>
                                          ))}
                                        </div>
                                      </div>

                                    </div>

                                  </div>
                                )}

                              </div>
                            ))}
                          </div>

                        </div>
                      )}

                    </div>
                  ))}

                </div>
              </div>
            ) : (
              /* MODO GRADE CLEAN */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {time.map(m => (
                  <div key={m.id} className="p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-3 group hover:border-violet-300 dark:hover:border-violet-800 transition shadow-sm">
                    <div className="flex items-center gap-3">
                      {m.foto ? (
                        <img src={m.foto} alt={m.nome} className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                      ) : m.sigla ? (
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center border border-slate-200 dark:border-slate-700">
                          {m.sigla}
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                          <User className="w-6 h-6" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-tight truncate">{m.nome}</h3>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase truncate">{m.cargo}</p>
                        <span className="text-[11px] font-bold text-violet-600 dark:text-violet-400 font-mono">{m.metrica || '1 / 1'}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 truncate">
                        {m.parentId ? `Gestor: ${time.find(t => t.id === m.parentId)?.nome?.split(' ')[0] || 'Topo'}` : 'Diretoria / Topo'}
                      </span>
                      <button 
                        onClick={() => setEditingMember(m)}
                        className="px-2.5 py-1 rounded-lg bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-300 text-xs font-semibold hover:bg-violet-100 flex items-center gap-1"
                      >
                        <Camera className="w-3 h-3" /> Trocar Foto
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      {/* MODAL INTERATIVO: EDITAR COLABORADOR & TROCAR FOTO */}
      {editingMember && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 relative">
            <button 
              onClick={() => setEditingMember(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="p-2 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Editar Colaborador & Foto</h3>
                <p className="text-xs text-slate-500">Altere a foto, cargo e posição no organograma.</p>
              </div>
            </div>

            {/* FOTO E OPÇÕES DE UPLOAD */}
            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Foto de Perfil</label>
              
              <div className="flex items-center gap-4">
                {/* Visualização da Foto Atual */}
                <div className="relative shrink-0">
                  {editingMember.foto ? (
                    <img src={editingMember.foto} alt={editingMember.nome} className="w-16 h-16 rounded-full object-cover border-2 border-violet-500 shadow-sm" />
                  ) : editingMember.sigla ? (
                    <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm flex items-center justify-center border-2 border-violet-400">
                      {editingMember.sigla}
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-400 flex items-center justify-center border-2 border-slate-300 dark:border-slate-600">
                      <User className="w-8 h-8" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  {/* Upload do Arquivo Local */}
                  <div>
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow-sm transition">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Carregar do Computador</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setEditingMember({ ...editingMember, foto: reader.result as string });
                              showNotification("Foto carregada com sucesso!");
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>

                  {/* URL da foto */}
                  <div>
                    <input 
                      type="text"
                      placeholder="Ou cole a URL da foto..."
                      value={editingMember.foto}
                      onChange={(e) => setEditingMember({ ...editingMember, foto: e.target.value })}
                      className="w-full px-2.5 py-1 text-xs border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                    />
                  </div>
                </div>
              </div>

              {/* Presets Rápidos */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 font-medium block mb-1">Avatares Rápidos ou Limpar Foto:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button 
                    type="button"
                    onClick={() => setEditingMember({ ...editingMember, foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" })}
                    className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-[10px] font-medium hover:bg-slate-300"
                  >
                    Foto 1 (Masculino)
                  </button>
                  <button 
                    type="button"
                    onClick={() => setEditingMember({ ...editingMember, foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" })}
                    className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-[10px] font-medium hover:bg-slate-300"
                  >
                    Foto 2 (Masculino)
                  </button>
                  <button 
                    type="button"
                    onClick={() => setEditingMember({ ...editingMember, foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80" })}
                    className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-[10px] font-medium hover:bg-slate-300"
                  >
                    Foto 3 (Feminino)
                  </button>
                  <button 
                    type="button"
                    onClick={() => setEditingMember({ ...editingMember, foto: "", sigla: "" })}
                    className="px-2 py-1 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-medium hover:bg-rose-500/20"
                  >
                    Remover Foto (Ícone)
                  </button>
                </div>
              </div>
            </div>

            {/* FORMULÁRIO DE DADOS */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-500 block mb-1 uppercase text-[10px]">Nome Completo</label>
                <input 
                  type="text"
                  value={editingMember.nome}
                  onChange={(e) => setEditingMember({ ...editingMember, nome: e.target.value })}
                  className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-500 block mb-1 uppercase text-[10px]">Cargo</label>
                  <input 
                    type="text"
                    value={editingMember.cargo}
                    onChange={(e) => setEditingMember({ ...editingMember, cargo: e.target.value })}
                    className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-500 block mb-1 uppercase text-[10px]">Métrica / Subtexto (ex: 7 / 655)</label>
                  <input 
                    type="text"
                    value={editingMember.metrica || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, metrica: e.target.value })}
                    className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-500 block mb-1 uppercase text-[10px]">Responsável Direto (Gestor)</label>
                  <select 
                    value={editingMember.parentId || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, parentId: e.target.value || null })}
                    className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 font-medium"
                  >
                    <option value="">Nenhum (Topo da Hierarquia)</option>
                    {time.filter(t => t.id !== editingMember.id).map(t => (
                      <option key={t.id} value={t.id}>
                        {t.nome} ({t.cargo})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-500 block mb-1 uppercase text-[10px]">E-mail</label>
                  <input 
                    type="email"
                    value={editingMember.email}
                    onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                    className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>
              </div>
            </div>

            {/* BOTÕES SALVAR E EXCLUIR */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <button 
                type="button"
                onClick={() => {
                  setTime(time.filter(t => t.id !== editingMember.id));
                  setEditingMember(null);
                  showNotification("Colaborador removido.");
                }}
                className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 font-medium text-xs hover:bg-rose-500/20 transition flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Excluir
              </button>

              <div className="flex items-center gap-2">
                <button 
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium"
                >
                  Cancelar
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setTime(time.map(t => t.id === editingMember.id ? editingMember : t));
                    setEditingMember(null);
                    showNotification("Alterações salvas no organograma!");
                  }}
                  className="px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Salvar Alterações
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      </main>

      {/* MODAL DE IMAGEM DA GALERIA */}
      {modalImage && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setModalImage(null)}
        >
          <div className="relative max-w-3xl w-full bg-white dark:bg-slate-900 rounded-2xl overflow-hidden p-1 border border-slate-200 dark:border-slate-800">
            <button 
              onClick={() => setModalImage(null)}
              className="absolute top-3 right-3 text-white bg-slate-900/70 p-1.5 rounded-full hover:bg-slate-900"
            >
              <X className="w-4 h-4" />
            </button>
            <img src={modalImage} alt="Foto" className="w-full max-h-[75vh] object-contain rounded-xl" />
          </div>
        </div>
      {/* MODAL DE AUTENTICAÇÃO REQUERIDA PARA EDIÇÃO DE CONTEÚDO */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative space-y-4">
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Autenticação Requerida</h3>
                <p className="text-[11px] text-slate-500">Digite seu usuário e senha para editar o conteúdo.</p>
              </div>
            </div>

            {authError && (
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-semibold border border-rose-200 dark:border-rose-800">
                ⚠️ {authError}
              </div>
            )}

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const u = authForm.usuario.trim();
                const s = authForm.senha.trim();
                if (u === 'BackboneSPC' && s === 'BackboneSPC') {
                  setIsEditMode(true);
                  setShowAuthModal(false);
                  showNotification("Autenticação aceita! Modo Edição ativado.");
                } else {
                  setAuthError("Usuário ou senha incorretos! (Padrão: BackboneSPC / BackboneSPC)");
                }
              }}
              className="space-y-3"
            >
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-500 block mb-1">Usuário *</label>
                <input
                  type="text"
                  placeholder="Ex: BackboneSPC"
                  value={authForm.usuario}
                  onChange={(e) => setAuthForm({ ...authForm, usuario: e.target.value })}
                  className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white font-semibold"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-slate-500 block mb-1">Senha *</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={authForm.senha}
                  onChange={(e) => setAuthForm({ ...authForm, senha: e.target.value })}
                  className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white font-semibold"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Entrar e Editar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER CLEAN COM ROXO VIVO */}
      <footer className="mt-auto bg-white dark:bg-[#0f172a] border-t border-slate-200 dark:border-slate-800 py-4 text-center text-xs text-slate-400 pb-20 md:pb-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 text-white font-bold flex items-center justify-center text-xs shadow-xs">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{empresa.nomeEmpresa}</span>
            <span className="text-violet-600 dark:text-violet-400 font-medium">• {empresa.subtituloHeader}</span>
          </div>
          <p>© 2026 {empresa.nomeEmpresa}. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* DOCK BAR DE NAVEGAÇÃO MOBILE (NATIVE APP FEEL) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        {[
          { id: 'area', label: 'Área', icon: Building2 },
          { id: 'workspace', label: 'Apps 🟣', icon: Grid, isLive: true },
          { id: 'projetos', label: 'Projetos', icon: FolderKanban },
          { id: 'metas', label: 'Metas', icon: Target },
          { id: 'galeria', label: 'Galeria', icon: ImageIcon },
          { id: 'time', label: 'Time', icon: Users }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative cursor-pointer active:scale-90 ${
                isActive
                  ? 'text-violet-600 dark:text-violet-400 font-bold'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-violet-600 dark:text-violet-400 scale-110' : ''}`} />
                {tab.isLive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-violet-500 animate-pulse"></span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-sans">{tab.label}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
}
