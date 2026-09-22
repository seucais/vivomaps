# Guia de Configuração das Listas do SharePoint

Para que o aplicativo funcione perfeitamente com os relacionamentos de dados, crie as seguintes **três listas** no seu site do SharePoint Corporativo. 

Siga as instruções de colunas abaixo:

---

## 1. Lista: `Fiber_Centrais`
Esta lista armazena a localização e detalhes de cada central (estações/hubs).

### Colunas a Criar:
1. **Title** (Coluna padrão do SharePoint)
   - *Renomeie ou use como:* `Nome da Central` (ex: `CO Centro`, `CO Barra`)
   - *Tipo:* Linha única de texto (Obrigatório)
2. **Endereco**
   - *Tipo:* Linha única de texto (Obrigatório)
   - *Descrição:* Endereço físico completo
3. **Latitude**
   - *Tipo:* Número (Decimal)
   - *Casas decimais:* 6 ou mais
   - *Obrigatório:* Sim
4. **Longitude**
   - *Tipo:* Número (Decimal)
   - *Casas decimais:* 6 ou mais
   - *Obrigatório:* Sim

---

## 2. Lista: `Fiber_Cabos`
Esta lista gerencia os cabos ópticos instalados e suas conexões físicas.

### Colunas a Criar:
1. **Title** (Coluna padrão do SharePoint)
   - *Renomeie ou use como:* `Código/Nome do Cabo` (ex: `Cabo-01-Centro-Barra`)
   - *Tipo:* Linha única de texto (Obrigatório)
2. **Capacidade**
   - *Tipo:* Opção (Choice)
   - *Opções:*
     ```text
     12FO
     24FO
     36FO
     72FO
     144FO
     288FO
     ```
   - *Formato de exibição:* Menu suspenso (Dropdown)
3. **CentralOrigem**
   - *Tipo:* Consulta (Lookup)
   - *Obter informações de:* `Fiber_Centrais`
   - *Nesta coluna:* `Title` (ou `Nome da Central`)
   - *Obrigatório:* Sim
4. **CentralDestino**
   - *Tipo:* Consulta (Lookup)
   - *Obter informações de:* `Fiber_Centrais`
   - *Nesta coluna:* `Title` (ou `Nome da Central`)
   - *Obrigatório:* Sim
5. **ExtensaoKM**
   - *Tipo:* Número (Decimal - 2 casas decimais)
   - *Descrição:* Comprimento físico total do cabo em quilômetros
6. **TipoRede**
   - *Tipo:* Opção (Choice)
   - *Opções:*
     ```text
     Aérea
     Subterrânea
     ```
   - *Formato:* Botões de opção ou Dropdown

---

## 3. Lista: `Fiber_Ocorrencias`
Esta lista registrará as falhas reportadas em campo pelos técnicos.

### Colunas a Criar:
1. **Title** (Coluna padrão do SharePoint)
   - *Tipo:* Linha única de texto
   - *Descrição:* Protocolo ou ID da Ocorrência (ex: `INC-2026-001`). Pode ser preenchido automaticamente com fórmulas.
2. **DataOcorrencia**
   - *Tipo:* Data e Hora (Apenas data ou Data e Hora)
   - *Valor Padrão:* Data de hoje
3. **CaboAfetado**
   - *Tipo:* Consulta (Lookup)
   - *Obter informações de:* `Fiber_Cabos`
   - *Nesta coluna:* `Title` (Código/Nome do Cabo)
   - *Adicionar também esta coluna (opcional para exibição):* `Capacidade`, `ExtensaoKM`, `TipoRede`
4. **CapacidadeCabo**
   - *Tipo:* Linha única de texto (Guardará uma cópia da capacidade para fins de histórico)
5. **CentralProxima**
   - *Tipo:* Consulta (Lookup)
   - *Obter informações de:* `Fiber_Centrais`
   - *Nesta coluna:* `Title`
6. **PontaA**
   - *Tipo:* Linha única de texto
7. **PontaB**
   - *Tipo:* Linha única de texto
8. **DistanciaCorte**
   - *Tipo:* Número (Inteiro ou Decimal em metros)
   - *Descrição:* Distância aproximada do ponto do corte em relação à Central Próxima
9. **EnlaceTotal**
   - *Tipo:* Número (Decimal)
   - *Descrição:* Tamanho total do cabo afetado
10. **TipoRede**
    - *Tipo:* Linha única de texto (Cópia do tipo de rede)
11. **Latitude**
    - *Tipo:* Número (Decimal - 6 casas decimais)
12. **Longitude**
    - *Tipo:* Número (Decimal - 6 casas decimais)
13. **EnderecoOcorrencia**
    - *Tipo:* Linha única de texto

---

> [!TIP]
> **Por que usar colunas do tipo "Consulta" (Lookup)?**
> No Power Apps, quando você seleciona o cabo em uma ocorrência, ele sabe automaticamente qual é a Central de Origem e Destino daquele cabo graças ao relacionamento direto criado no SharePoint. Isso evita erros de digitação por parte do técnico.
