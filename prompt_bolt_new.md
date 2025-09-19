# Prompt para Criação de Website com Bolt.new

## Objetivo Geral

Desenvolver um website moderno e dinâmico, com foco em análise e acompanhamento de ativos financeiros, similar em funcionalidades ao `investidor10.com.br`, mas com um design visualmente atraente, moderno, com animações e um layout bonito, inspirado no `analitica.auvp.com.br`. As cores predominantes devem ser preto, cinza grafite e branco, com detalhes em amarelo para realçar elementos importantes e interativos.

## Funcionalidades Essenciais (Inspiradas em Investidor10.com.br e aprimoradas)

O site deve oferecer as seguintes funcionalidades principais:

### 1. Pesquisa e Exibição de Ativos

- **Campo de Busca Centralizado:** Um campo de busca proeminente na página inicial para que os usuários possam pesquisar ativos por nome da empresa ou ticker (ex: PETR4, Petrobras, BTC-USD, BRL=X).
- **Sugestões de Busca:** À medida que o usuário digita, o sistema deve sugerir ativos relevantes.
- **Página de Detalhes do Ativo:** Ao selecionar um ativo, o usuário será direcionado a uma página dedicada com as seguintes informações:
    - **Cotação Atual:** Preço atual, variação diária (valor e percentual), volume de negociação.
    - **Informações do Dia:** Abertura, mínima, máxima, fechamento anterior.
    - **Indicadores Fundamentalistas (para Ações):** P/L, P/VP, Dividend Yield, LPA, VPA, EV/EBITDA, PEG Ratio, ROE, ROA, Margem Líquida, Dívida/Patrimônio, Liquidez Corrente, Liquidez Seca.
    - **Valuation:** Valor de Mercado, Enterprise Value, Valor Graham, Preço Teto Bazin.
    - **Balanço:** Caixa Total, Dívida Bruta, Dívida Líquida, Patrimônio Líquido.
    - **Gráficos Interativos:** Gráficos de linha para preço e gráficos de barra para volume, com opções de período (5d, 1m, 6m, 1a, 5a, max). Os gráficos devem ser responsivos e permitir zoom/pan.

### 2. Rankings e Destaques

- **Rankings Dinâmicos:** Seções de rankings para diferentes categorias de ativos, como:
    - Maiores Dividend Yield
    - Maiores Valor de Mercado
    - Maiores Receitas
    - Ativos Mais Procurados
- **Filtros de Categoria:** Opções para filtrar rankings por tipo de ativo (Ações, FIIs, Stocks, Criptomoedas, Moedas, ETFs).
- **Destaques de Mercado:** Exibição de cotações de moedas (USD, EUR), índices (IBOV, IFIX), criptomoedas (BTC) e ETFs relevantes, com suas respectivas variações.

### 3. Comparação de Ativos

- **Ferramenta de Comparação:** Uma funcionalidade que permita ao usuário selecionar dois ou mais ativos para comparar seu desempenho histórico em um único gráfico normalizado (base 100).

### 4. Notícias e Conteúdo

- **Seção de Notícias:** Um feed de notícias financeiras relevantes, com artigos e análises.
- **Agenda de Dividendos:** Uma seção clara e organizada mostrando a agenda de pagamentos de dividendos e JCP.

### 5. Ferramentas Adicionais

- **Classificação de Viabilidade (Selo):** Inspirado no `analitica.auvp.com.br`, um sistema visual para classificar a viabilidade de um ativo (ex: 'Confiável', 'Viável', 'Requer Atenção', 'Não Viável'), baseado em critérios definidos.
- **Renda Fixa e Imposto de Renda:** Seções informativas sobre renda fixa e orientações para declaração de imposto de renda para investimentos.

## Design e Experiência do Usuário

### 1. Estilo Visual (Inspirado em Analitica.auvp.com.br)

- **Paleta de Cores:**
    - **Primárias:** Preto (#000000), Cinza Grafite (#36454F ou similar), Branco (#FFFFFF).
    - **Destaque:** Amarelo (#FFD700 ou similar) para botões, links, ícones interativos e elementos de destaque.
- **Layout:** Limpo, moderno e espaçoso, com uso de cards para organizar informações. Deve ser responsivo para desktop e mobile.
- **Tipografia:** Fontes modernas e legíveis, com hierarquia clara para títulos, subtítulos e corpo de texto.
- **Ícones:** Ícones minimalistas e intuitivos.

### 2. Animações e Interatividade

- **Microinterações:** Animações suaves ao passar o mouse sobre elementos, cliques em botões, carregamento de dados.
- **Transições:** Transições fluidas entre páginas e ao exibir/ocultar elementos.
- **Gráficos Interativos:** Gráficos com tooltips informativos, capacidade de zoom, pan e seleção de período de forma visualmente agradável.
- **Carrosséis/Sliders:** Utilizar carrosséis para exibir rankings ou ativos em destaque, com transições animadas.

### 3. Estrutura de Navegação

- **Menu Superior:** Navegação clara com links para Home, Rankings, Ações, FIIs, Internacional, Criptomoedas, Notícias, Carteira (se implementado), Assinar/PRO, Entrar/Inscrever-se.
- **Rodapé:** Links para informações adicionais, termos de uso, política de privacidade, contato.

## Integração com a API Fornecida

O site deverá consumir a API fornecida (`deepseek_python_20250919_031f26.py`) para obter os dados financeiros. A API é um servidor Flask que expõe os seguintes endpoints:

- **`/api/pesquisar/<nome>`:** Pesquisa ativos por nome ou ticker. Retorna uma lista de tickers correspondentes.
- **`/api/dados/<ticker>`:** Retorna dados detalhados de um ativo (cotação, info, histórico, indicadores, etc.).
- **`/api/grafico/<ticker>?periodo=<periodo>`:** Gera um gráfico de preço para o ativo e período especificados, retornando a imagem em formato base64.
- **`/api/comparar/<ticker1>/<ticker2>`:** (A ser implementado na API, mas a funcionalidade é desejada no site) Retorna um gráfico comparativo entre dois ativos.

### Como a Bolt.new deve usar a API:

1.  **Execução da API:** A Bolt.new deve assumir que o arquivo `deepseek_python_20250919_031f26.py` será executado em um servidor backend (por exemplo, usando `python deepseek_python_20250919_031f26.py`). O site frontend deverá fazer requisições HTTP (GET) para os endpoints desta API.
2.  **Mapeamento de Dados:** Os dados retornados pela API (JSON para `/api/dados` e `/api/pesquisar`, e base64 para `/api/grafico`) devem ser parseados e utilizados para popular as seções do site.
3.  **Geração de Gráficos:** Para os gráficos, a imagem base64 retornada pelo endpoint `/api/grafico` deve ser incorporada diretamente no HTML/CSS/JS do frontend.
4.  **Tratamento de Erros:** O site deve exibir mensagens amigáveis ao usuário caso a API retorne erros ou não encontre dados para um ativo.

## Considerações Adicionais

- **Performance:** O site deve ser otimizado para carregamento rápido e boa performance.
- **SEO:** Estrutura amigável para motores de busca.
- **Acessibilidade:** Design inclusivo e acessível.
- **Tecnologias:** Sugere-se o uso de frameworks modernos de frontend (React, Vue, Angular) para um desenvolvimento eficiente e para incorporar as animações e interatividade desejadas.

## Arquivos Fornecidos

Os seguintes arquivos serão fornecidos para a Bolt.new:

- `deepseek_python_20250919_031f26.py`: O código-fonte da API Flask.
- `MANUAL_API.txt`: Manual de uso da API.
- `CLEARGEMINI.rar`: Contém o arquivo `acoes-listadas-b3.csv` (necessário para a API) e exemplos de gráficos gerados pela aplicação original (para referência visual).

O objetivo é que a Bolt.new utilize esses recursos para construir um site funcional e esteticamente superior, conforme as diretrizes de design e funcionalidades descritas acima.

