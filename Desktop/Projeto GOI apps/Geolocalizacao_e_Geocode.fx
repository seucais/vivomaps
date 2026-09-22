/*
  ==============================================================================
  FIBERGUARD POWER APPS BLUEPRINT
  MÓDULO: GEOLOCALIZAÇÃO E GEOCODIFICAÇÃO (POWER FX)
  ==============================================================================
  Copie as fórmulas abaixo e cole nas propriedades indicadas de cada controle
  no Power Apps Studio.
*/

// =============================================================================
// 1. CAPTURAR GPS ATUAL DO TÉCNICO
// =============================================================================
// Controle: Botão (ex: btnPegarGPS)
// Propriedade: OnSelect
// Descrição: Lê o chip de GPS do aparelho celular ou do notebook e salva em variáveis locais.

UpdateContext({
    locLat: Location.Latitude,
    locLng: Location.Longitude
});
Notify("GPS capturado: " & locLat & ", " & locLng, NotificationType.Success)


// =============================================================================
// 2. CONFIGURAR OS CAMPOS DE EXIBIÇÃO DE LATITUDE E LONGITUDE
// =============================================================================
// Controle: Input de Texto para Latitude (ex: txtLatitude)
// Propriedade: Default
locLat

// Controle: Input de Texto para Longitude (ex: txtLongitude)
// Propriedade: Default
locLng


// =============================================================================
// 3. GEOCODIFICAR ENDEREÇO DIGITADO (CONVERSÃO ENDEREÇO -> COORDENADAS)
// =============================================================================
// Pré-requisito: Adicionar a conexão "Bing Maps" nas conexões do aplicativo.
// Controle: Botão ao lado do campo de endereço (ex: btnBuscarEndereco)
// Propriedade: OnSelect
// Descrição: Chama a API do Bing Maps para buscar o endereço escrito no campo txtEndereco.

UpdateContext({
    locGeocoded: BingMaps.GetGeocode(txtEndereco.Text)
});
If(
    !IsEmpty(locGeocoded),
    UpdateContext({
        locLat: First(locGeocoded).Point.Coordinates.Latitude,
        locLng: First(locGeocoded).Point.Coordinates.Longitude
    });
    Notify("Endereço localizado com sucesso!", NotificationType.Success),
    Notify("Não encontramos este endereço. Verifique a digitação ou use o botão do GPS.", NotificationType.Error)
)


// =============================================================================
// 4. LIMPAR FORMULÁRIO / INICIALIZAR VARIÁVEIS
// =============================================================================
// Controle: Tela de Ocorrência (OnVisible) ou Botão "Novo Registro"
// Propriedade: OnSelect ou OnVisible
// Descrição: Reseta os campos e limpa as variáveis de coordenadas locais.

UpdateContext({
    locLat: Blank(),
    locLng: Blank(),
    locGeocoded: Blank()
});
Reset(txtEndereco);
Reset(txtDistanciaCorte)
