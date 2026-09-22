/*
  ==============================================================================
  FIBERGUARD POWER APPS BLUEPRINT
  MÓDULO: RELACIONAMENTO E AUTOPREENCHIMENTO DE CABOS (POWER FX)
  ==============================================================================
  Copie as fórmulas abaixo e cole nas propriedades indicadas de cada controle
  no Power Apps Studio para fazer com que os dados do Cabo selecionado
  autopreencham a ocorrência.
*/

// =============================================================================
// 1. DROPDOWN DE SELEÇÃO DO CABO
// =============================================================================
// Controle: Dropdown de Cabos (ex: ddCaboAfetado)
// Propriedade: Items
// Descrição: Lista todos os cabos cadastrados na lista principal "Fiber_Cabos"
//            para que o técnico selecione qual sofreu o corte.

Fiber_Cabos


// =============================================================================
// 2. CAMPO: CAPACIDADE DO CABO (AUTOMÁTICO)
// =============================================================================
// Controle: Input de Texto ou Label (ex: txtCapacidadeCabo)
// Propriedade: Default (ou Text se for Label)
// Descrição: Puxa automaticamente a capacidade pré-cadastrada no cabo selecionado.

ddCaboAfetado.Selected.Capacidade.Value


// =============================================================================
// 3. CAMPO: PONTA A / CENTRAL ORIGEM (AUTOMÁTICO)
// =============================================================================
// Controle: Input de Texto ou Label (ex: txtPontaA)
// Propriedade: Default
// Descrição: Obtém o Nome da Central de Origem cadastrada na relação do Cabo.
//            Como CentralOrigem é uma coluna de Consulta (Lookup), usamos .Value.

ddCaboAfetado.Selected.CentralOrigem.Value


// =============================================================================
// 4. CAMPO: PONTA B / CENTRAL DESTINO (AUTOMÁTICO)
// =============================================================================
// Controle: Input de Texto ou Label (ex: txtPontaB)
// Propriedade: Default
// Descrição: Obtém o Nome da Central de Destino cadastrada na relação do Cabo.

ddCaboAfetado.Selected.CentralDestino.Value


// =============================================================================
// 5. CAMPO: TIPO DE REDE (AUTOMÁTICO)
// =============================================================================
// Controle: Input de Texto ou Label (ex: txtTipoRede)
// Propriedade: Default
// Descrição: Puxa automaticamente se o cabo é Aéreo ou Subterrâneo.

ddCaboAfetado.Selected.TipoRede.Value


// =============================================================================
// 6. CAMPO: ENLACE TOTAL DO CABO (AUTOMÁTICO)
// =============================================================================
// Controle: Input de Texto ou Label (ex: txtEnlaceTotal)
// Propriedade: Default
// Descrição: Puxa o comprimento em KM cadastrado para aquele cabo.

ddCaboAfetado.Selected.ExtensaoKM


// =============================================================================
// 7. BOTÃO SALVAR REGISTRO DE OCORRÊNCIA
// =============================================================================
// Controle: Botão Salvar (ex: btnSalvarOcorrencia)
// Propriedade: OnSelect
// Descrição: Grava a Ocorrência no SharePoint associando o cabo e as variáveis do formulário.

Patch(
    Fiber_Ocorrencias,
    Defaults(Fiber_Ocorrencias),
    {
        Title: "INC-" & Text(Now(), "yyyy-mm-dd-hh-mm"), // Protocolo gerado por data/hora
        DataOcorrencia: Today(),
        CaboAfetado: {
            '@odata.type': "#Microsoft.Azure.Connectors.SharePoint.SPListExpandedReference",
            Id: ddCaboAfetado.Selected.ID,
            Value: ddCaboAfetado.Selected.Title
        },
        CapacidadeCabo: ddCaboAfetado.Selected.Capacidade.Value,
        PontaA: ddCaboAfetado.Selected.CentralOrigem.Value,
        PontaB: ddCaboAfetado.Selected.CentralDestino.Value,
        DistanciaCorte: Value(txtDistanciaCorte.Text),
        EnlaceTotal: Value(ddCaboAfetado.Selected.ExtensaoKM),
        TipoRede: ddCaboAfetado.Selected.TipoRede.Value,
        Latitude: Value(txtLatitude.Text),
        Longitude: Value(txtLongitude.Text),
        EnderecoOcorrencia: txtEndereco.Text
    }
);
Notify("Ocorrência registrada com sucesso!", NotificationType.Success);
Navigate(scrDashboard, ScreenTransition.Cover)
