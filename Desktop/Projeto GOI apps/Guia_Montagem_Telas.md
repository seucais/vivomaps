# Guia de Montagem do Aplicativo no Power Apps Studio

Este guia prático orienta você no desenho das telas, inserção de componentes e aplicação dos scripts desenvolvidos.

---

## 🚀 Passo 1: Preparação do Ambiente e Conexões

1. Abra o [make.powerapps.com](https://make.powerapps.com/).
2. Crie um novo aplicativo em branco: **Aplicativo de Tela (Canvas App)**. Escolha o layout **Tablet** para visualização intranet (telas maiores) ou **Telefone** para técnicos em campo.
3. No menu esquerdo, vá em **Dados (ícone de banco de dados cilindro)** > **Adicionar dados**.
   - Procure por **SharePoint**, selecione sua conta corporativa, escolha o site e marque as 3 listas criadas: `Fiber_Centrais`, `Fiber_Cabos` e `Fiber_Ocorrencias`.
   - Adicione também o conector **Bing Maps** (gratuito) para habilitar a busca de endereços.

---

## 📺 Passo 2: Estruturando as Telas

Recomenda-se criar **duas telas principais** no seu aplicativo:

### Tela A: `scrDashboard` (Intranet e Mapa)
Esta é a tela inicial do sistema. Desenhe os seguintes componentes nela:

1. **Cabeçalho (Header):**
   - Um retângulo azul/roxo no topo.
   - Um controle de texto (Label) com o título: `FiberGuard - Gestão de Ocorrências`.
2. **Barra de Pesquisa:**
   - Insira uma Entrada de Texto (Text Input). Nomeie-a como `txtPesquisaCabo`.
   - Defina a propriedade `DelayOutput` como `true` (melhora a performance de pesquisa).
3. **Galeria de Ocorrências (Lista Lateral):**
   - Insira uma Galeria Vertical (`galOcorrencias`).
   - Defina a propriedade `Items` como a fórmula descrita em [Mapa_e_Rotas.fx](file:///c:/Users/William/Desktop/Projeto%20GOI%20apps/Mapa_e_Rotas.fx) (Filtro por busca).
   - Dentro do card da galeria, coloque campos de texto apontando para `ThisItem.CaboAfetado.Value`, `ThisItem.DataOcorrencia` e `ThisItem.TipoRede`.
   - Insira um botão/ícone de navegação (seta ou mapa) chamado `btnComoChegar` e insira a fórmula de `Launch()` do Google Maps no `OnSelect` (veja [Mapa_e_Rotas.fx](file:///c:/Users/William/Desktop/Projeto%20GOI%20apps/Mapa_e_Rotas.fx)).
4. **Mapa de Ocorrências (Painel Central):**
   - Vá em **Inserir** > **Mídia** > **Mapa** (ou digite "Mapa" na busca). Adicione o controle à tela ao lado da galeria.
   - Nomeie o controle como `mapOcorrencias`.
   - Ajuste as seguintes propriedades:
     - `Items`: `galOcorrencias.AllItems` (isso faz o mapa refletir exatamente o que está filtrado na lista).
     - `ItemLatitudes`: `Latitude`
     - `ItemLongitudes`: `Longitude`
     - `ItemLabels`: `Title`
     - `DefaultLatitude`: `If(!IsBlank(galOcorrencias.Selected), galOcorrencias.Selected.Latitude, -22.9068)`
     - `DefaultLongitude`: `If(!IsBlank(galOcorrencias.Selected), galOcorrencias.Selected.Longitude, -43.1729)`
5. **Botão de Ação:**
   - Adicione um botão "Registrar Ocorrência".
   - Propriedade `OnSelect`: `Navigate(scrNovaOcorrencia, ScreenTransition.Cover)`

---

### Tela B: `scrNovaOcorrencia` (Formulário do Técnico)
Tela onde o técnico preenche as informações e captura as coordenadas.

Desenhe os seguintes controles e organize-os:

1. **Campo: Seleção do Cabo**
   - Tipo: Dropdown (Nomeie como `ddCaboAfetado`).
   - `Items`: `Fiber_Cabos`.
2. **Campo: Detalhes do Cabo (Autopreenchidos e bloqueados)**
   - **Capacidade do Cabo (Label ou Text Input):** `Default` = `ddCaboAfetado.Selected.Capacidade.Value`
   - **Ponta A (Label ou Text Input):** `Default` = `ddCaboAfetado.Selected.CentralOrigem.Value`
   - **Ponta B (Label ou Text Input):** `Default` = `ddCaboAfetado.Selected.CentralDestino.Value`
   - **Tipo de Rede (Label ou Text Input):** `Default` = `ddCaboAfetado.Selected.TipoRede.Value`
   - **Enlace Total (Label ou Text Input):** `Default` = `ddCaboAfetado.Selected.ExtensaoKM`
3. **Campo: Distância do Corte**
   - Tipo: Text Input (Nomeie como `txtDistanciaCorte`).
   - Defina o `Format` para `Number` (Aceita apenas números).
4. **Módulo de Localização por Endereço:**
   - Campo de texto para endereço completo (`txtEndereco`).
   - Botão ao lado: "Pesquisar Endereço".
   - Propriedade `OnSelect` do botão: Cole a fórmula de geocodificação presente em [Geolocalizacao_e_Geocode.fx](file:///c:/Users/William/Desktop/Projeto%20GOI%20apps/Geolocalizacao_e_Geocode.fx).
5. **Módulo de Localização por GPS Atual:**
   - Botão grande: "Pegar Coordenadas GPS".
   - Propriedade `OnSelect` do botão: Cole a fórmula de capturar GPS presente em [Geolocalizacao_e_Geocode.fx](file:///c:/Users/William/Desktop/Projeto%20GOI%20apps/Geolocalizacao_e_Geocode.fx).
6. **Inputs de Exibição das Coordenadas (Latitude e Longitude):**
   - Crie `txtLatitude` e `txtLongitude` para que o técnico visualize o ponto registrado antes de salvar.
   - Configure a propriedade `Default` deles como `locLat` e `locLng` respectivamente (veja [Geolocalizacao_e_Geocode.fx](file:///c:/Users/William/Desktop/Projeto%20GOI%20apps/Geolocalizacao_e_Geocode.fx)).
7. **Botão Salvar:**
   - Propriedade `OnSelect`: Cole a fórmula de `Patch` presente em [Autopreenchimento_Cabos.fx](file:///c:/Users/William/Desktop/Projeto%20GOI%20apps/Autopreenchimento_Cabos.fx).

---

## 🎨 Dicas de Design Premium (Aparência Moderna)

Para dar uma sensação de "Intranet moderna" premium no seu aplicativo Power Apps:

*   **Paleta de Cores:**
    *   **Fundo:** Use tons escuros ou cinza-grafite muito claros (`RGBA(245, 246, 248, 1)`) para evitar o visual branco padrão sem graça.
    *   **Destaques:** Use o azul corporativo (`RGBA(0, 90, 156, 1)`) ou roxo metálico para botões principais.
    *   **Sucesso / Alerta:** Verde suave (`RGBA(46, 204, 113, 1)`) para notificações de sucesso; Vermelho Coral (`RGBA(231, 76, 60, 1)`) para ocorrências/erros.
*   **Bordas Arredondadas:** Defina o `BorderRadius` de todos os botões, caixas de entrada e galerias para `8` ou `12` pixels. Isso dá um aspecto muito mais amigável e moderno.
*   **Efeito Hover:** Nos botões, defina a cor de `HoverFill` ligeiramente mais escura que a cor padrão, gerando uma micro-animação visual ao passar o mouse.
