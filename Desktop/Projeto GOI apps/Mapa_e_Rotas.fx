/*
  ==============================================================================
  FIBERGUARD POWER APPS BLUEPRINT
  MÓDULO: MAPA INTERATIVO, FILTRO E ROTAS DE GPS (POWER FX)
  ==============================================================================
  Copie as fórmulas abaixo e cole nas propriedades indicadas de cada controle
  no Power Apps Studio para criar o mapa dinâmico de ocorrências e rotas.
*/

// =============================================================================
// 1. FILTRAR MAPA E LISTA (GALERIA) POR CABO PESQUISADO
// =============================================================================
// Controle: Input de Texto para Busca (ex: txtPesquisaCabo)
//
// Controle: Mapa Nativo (ex: mapOcorrencias)
// Propriedade: Items
// Descrição: Exibe no mapa apenas os alfinetes das ocorrências cujo nome do cabo 
//            contém o texto digitado na pesquisa. Se estiver em branco, mostra todos.

Filter(
    Fiber_Ocorrencias,
    IsBlank(txtPesquisaCabo.Text) || txtPesquisaCabo.Text in CaboAfetado.Value
)

// Controle: Galeria de Ocorrências (ex: galOcorrencias)
// Propriedade: Items
// Descrição: Alinha a lista de ocorrências com o mesmo filtro do mapa.

Filter(
    Fiber_Ocorrencias,
    IsBlank(txtPesquisaCabo.Text) || txtPesquisaCabo.Text in CaboAfetado.Value
)


// =============================================================================
// 2. CENTRALIZAR MAPA NO ALFINETE SELECIONADO NA LISTA
// =============================================================================
// Controle: Mapa Nativo (ex: mapOcorrencias)
// Propriedades: DefaultLatitude e DefaultLongitude
// Descrição: Faz o mapa focar automaticamente na ocorrência que o usuário clicar 
//            dentro da Galeria (Lista).

// Propriedade: DefaultLatitude
If(
    !IsBlank(galOcorrencias.Selected), 
    galOcorrencias.Selected.Latitude, 
    -22.9068 // Latitude padrão (ex: Rio de Janeiro) se nada estiver selecionado
)

// Propriedade: DefaultLongitude
If(
    !IsBlank(galOcorrencias.Selected), 
    galOcorrencias.Selected.Longitude, 
    -43.1729 // Longitude padrão (ex: Rio de Janeiro) se nada estiver selecionado
)


// =============================================================================
// 3. ROTA DO GOOGLE MAPS (DIREÇÕES PARA O TÉCNICO)
// =============================================================================
// Controle: Botão "Navegar / Rota" dentro do card da Galeria (ex: btnComoChegar)
// Propriedade: OnSelect
// Descrição: Abre o navegador ou aplicativo Google Maps direto no celular do 
//            técnico com as coordenadas de destino prontas.

Launch(
    "https://www.google.com/maps/dir/?api=1&destination=" & 
    ThisItem.Latitude & "," & 
    ThisItem.Longitude
)

// Controle: Botão dentro do balão do Mapa (Propriedade OnSelectItem do Mapa)
// Propriedade: OnSelectItem
// Descrição: Se o técnico clicar em um pin no mapa, abre a rota do Google Maps.

Launch(
    "https://www.google.com/maps/dir/?api=1&destination=" & 
    mapOcorrencias.Selected.Latitude & "," & 
    mapOcorrencias.Selected.Longitude
)
