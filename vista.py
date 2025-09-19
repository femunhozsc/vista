import matplotlib.pyplot as plt
import csv
import os
import pandas as pd # Import pandas
from datetime import datetime
import yfinance as yf
import requests
from pytz import timezone
from difflib import get_close_matches
from dateutil.relativedelta import relativedelta
import math

class ClearviewVista:
    """
    Plataforma aprimorada para análise de ativos financeiros, com mais indicadores,
    gráficos comparativos e layout de exibição aprimorado.
    """
    def __init__(self):
        self.cache = {}
        self.tickers_map = {}
        self.nomes_map = {}
        self.carregar_dados_csv('/acoes-listadas-b3.csv')

        if not os.path.exists('graficos'):
            makedirs('graficos')

        self.traducoes = {
            'sector': 'Setor', 'industry': 'Indústria', 'longBusinessSummary': 'Descrição',
            'quoteType': 'Tipo de Ativo', 'market': 'Mercado', 'exchangeName': 'Bolsa',
            'EQUITY': 'Ação', 'CRYPTOCURRENCY': 'Criptomoeda', 'CURRENCY': 'Moeda',
            'ETF': 'ETF', 'INDEX': 'Índice', 'MUTUALFUND': 'Fundo'
        }
        self.mostrar_boas_vindas()
        self.mostrar_instrucoes()

    def mostrar_boas_vindas(self):
        os.system('cls' if os.name == 'nt' else 'clear')
        print("\n" + "="*80)
        print(" CLEARVIEW CAPITAL - VISTA PRO".center(80))
        print(" Visual Inteligente de Seleção Técnica e Analítica".center(80))
        print("="*80)

    def mostrar_instrucoes(self):
        """Exibe as instruções de uso da plataforma."""
        print("\nCOMO PESQUISAR:")
        print(" - Ativo Único: Digite o nome da empresa ('Petrobras'), ticker ('PETR4'), etc.")
        print("   - Para criptomoedas, use o formato 'BTC-USD' ou 'BTC-BRL'.")
        print("   - Para moedas, use o formato 'BRL=X' ou 'EURBRL=X'.")
        print(" - Comparação Gráfica: Digite ATIVO1/ATIVO2 (ex: 'PETR4/ITUB4' ou 'BOVA11/IFIX')")
        print(" - Para ver estas instruções novamente, digite 'inicio'.")
        print(" - Para sair, digite 'sair'.")
        print("-" * 80)

    def obter_data_hora_internet(self):
        try:
            response = requests.get("http://worldtimeapi.org/api/timezone/America/Sao_Paulo", timeout=5)
            response.raise_for_status()
            dados = response.json()
            dt = datetime.fromisoformat(dados['datetime'])
            return dt.astimezone(timezone('America/Sao_Paulo')).strftime("%d/%m/%Y %H:%M:%S")
        except requests.exceptions.RequestException:
            return datetime.now(timezone('America/Sao_Paulo')).strftime("%d/%m/%Y %H:%M:%S (local)")

    def carregar_dados_csv(self, arquivo_csv):
        if not os.path.exists(arquivo_csv): # Added check for file existence
            print(f"❌ Erro: Arquivo '{arquivo_csv}' não encontrado. A busca por nome não funcionará.")
            return
        try:
            with open(arquivo_csv, mode='r', encoding='utf-8') as f:
                leitor = csv.reader(f)
                next(leitor)
                for linha in leitor:
                    if len(linha) >= 2 and linha[0] and linha[1]:
                        ticker_sa = f"{linha[0].strip().upper()}.SA"
                        nome = linha[1].strip().upper()
                        self.tickers_map[ticker_sa] = nome
                        if nome not in self.nomes_map: self.nomes_map[nome] = []
                        self.nomes_map[nome].append(ticker_sa)
            print(f"✅ Base de ações brasileiras carregada com {len(self.nomes_map)} empresas.")
        except Exception as e:
            print(f"❌ Erro ao carregar o arquivo CSV: {e}")

    def pesquisar_ativo(self, comando):
        comando_upper = comando.strip().upper()

        # Check for exact ticker match first
        if comando_upper.endswith('.SA') and comando_upper in self.tickers_map:
             return [comando_upper]
        if f"{comando_upper}.SA" in self.tickers_map:
             return [f"{comando_upper}.SA"]
        if comando_upper in self.tickers_map: # Check for ticker without .SA if it exists
             return [comando_upper]


        if '/' in comando_upper:
            partes = comando_upper.split('/')
            return [f"{partes[0].strip()}{partes[1].strip()}=X"] if len(partes) == 2 else []
        if '-' in comando_upper: return [comando_upper]
        if comando_upper in self.nomes_map: return self.nomes_map[comando_upper]
        matches = get_close_matches(comando_upper, self.nomes_map.keys(), n=5, cutoff=0.6)
        if matches:
            return list(set(ticker for match in matches for ticker in self.nomes_map[match]))
        if not any(c in comando_upper for c in '.-/^') and (comando_upper.isalpha() or any(c.isdigit() for c in comando_upper)):
            return [f"{comando_upper}.SA", comando_upper]
        return [comando_upper]

    def _fetch_ticker_data(self, ticker):
        try:
            ativo = yf.Ticker(ticker)
            info = ativo.info
            if not info or info.get('regularMarketPrice') is None: return None
            hist = ativo.history(period="5y")
            return {"info": info, "historico": hist}
        except Exception:
            return None


    def buscar_dados_ativo(self, ticker):
        if ticker in self.cache: return self.cache[ticker]
        dados = self._fetch_ticker_data(ticker)
        if dados:
            self.cache[ticker] = dados
            return dados
        if ticker.upper().endswith('-BRL'):
            base_crypto = ticker.split('-')[0]
            ticker_usd, ticker_cambio = f"{base_crypto}-USD", 'BRL=X'
            dados_usd = self.buscar_dados_ativo(ticker_usd)
            dados_cambio = self.buscar_dados_ativo(ticker_cambio)
            if dados_usd and dados_cambio:
                info_usd, hist_usd = dados_usd['info'], dados_usd['historico']
                cambio_actual = dados_cambio['info']['regularMarketPrice']
                info_sintetico = info_usd.copy()
                info_sintetico['currency'] = 'BRL'
                for key in ['regularMarketPrice', 'dayHigh', 'dayLow', 'open', 'previousClose', 'marketCap']:
                    if info_sintetico.get(key) is not None:
                        info_sintetico[key] = info_sintetico[key] * cambio_actual
                hist_merged = pd.merge(hist_usd[['Close']], dados_cambio['historico'][['Close']],
                                       left_index=True, right_index=True, how='inner')
                if not hist_merged.empty:
                    hist_merged['Close_BRL'] = hist_merged['Close_x'] * hist_merged['Close_y']
                    dados_sinteticos = {'info': info_sintetico, 'historico': hist_merged[['Close_BRL']].rename(columns={'Close_BRL': 'Close'})}
                    self.cache[ticker] = dados_sinteticos
                    return dados_sinteticos

        return None

    def formatar_valor(self, valor, tipo='numero', moeda='R$'):
        if not isinstance(valor, (int, float)): return "N/D"
        try:
            if tipo == 'porcentagem':
                # Check if the value is significantly greater than 1, suggesting it might be a whole number percentage
                # If so, divide by 100. Otherwise, assume it's a decimal percentage or already correctly scaled.
                valor_final = valor / 100 if abs(valor) > 10 else valor # Adjusted threshold
                return f"{valor_final:,.2f}%"
            prefixo = f"{moeda} " if tipo == 'moeda' else ""
            if abs(valor) >= 1e12: return f"{prefixo}{valor / 1e12:,.2f} Tri"
            if abs(valor) >= 1e9: return f"{prefixo}{valor / 1e9:,.2f} Bi"
            if abs(valor) >= 1e6: return f"{prefixo}{valor / 1e6:,.2f} Mi"
            return f"{prefixo}{valor:,.2f}"
        except (ValueError, TypeError): return "N/D"

    def traduzir(self, texto):
        return self.traducoes.get(texto, texto if texto else 'N/D')

    def plotar_grafico(self, ticker, periodo, dados_historicos_base):
        if dados_historicos_base.empty: return
        hoje = pd.Timestamp.now(tz=dados_historicos_base.index.tz)
        periodos = {'5d': hoje - pd.Timedelta(days=5), '1m': hoje - relativedelta(months=1),
                    '6m': hoje - relativedelta(months=6), '1y': hoje - relativedelta(years=1),
                    '5y': hoje - relativedelta(years=5), 'max': dados_historicos_base.index.min()}
        dados_periodo = dados_historicos_base[dados_historicos_base.index >= periodos.get(periodo, hoje)]
        if dados_periodo.empty: return

        ticker_safe = ticker.replace('.SA', '').replace('^', '').replace('=', '').replace('/', '_')
        for tipo in ['Preço', 'Volume']:
            plt.style.use('seaborn-v0_8-darkgrid')
            fig, ax = plt.subplots(figsize=(14, 7))
            if tipo == 'Preço':
                ax.plot(dados_periodo.index, dados_periodo['Close'], label='Preço', color='deepskyblue')
            elif 'Volume' in dados_periodo.columns:
                ax.bar(dados_periodo.index, dados_periodo['Volume'], label='Volume', color='royalblue')
            else:
                continue
            ax.set_title(f'Histórico de {tipo} - {ticker} ({periodo})', fontsize=16)
            plt.tight_layout()
            nome_arquivo = f"graficos/{ticker_safe}_{tipo.lower()}_{periodo}.png"
            plt.savefig(nome_arquivo)
            plt.close(fig)
            print(f"📈 Gráfico de {tipo.lower()} salvo em: {nome_arquivo}")

    def plotar_grafico_comparativo(self, ticker1_str, ticker2_str):
        dados1 = self._obter_dados_para_comparacao(ticker1_str)
        dados2 = self._obter_dados_para_comparacao(ticker2_str)

        if not dados1 or not dados2:
            print("❌ Não foi possível obter dados para um ou ambos os ativos para comparação.")
            return

        ticker1, hist1 = dados1
        ticker2, hist2 = dados2

        hist_merged = pd.concat([hist1['Close'].rename(ticker1), hist2['Close'].rename(ticker2)], axis=1).dropna()
        if hist_merged.empty:
            print("❌ Os ativos não possuem histórico de preços no mesmo período para comparação.")
            return

        normalized_hist = (hist_merged / hist_merged.iloc[0]) * 100

        plt.style.use('seaborn-v0_8-darkgrid')
        fig, ax = plt.subplots(figsize=(14, 7))
        ax.plot(normalized_hist.index, normalized_hist[ticker1], label=ticker1)
        ax.plot(normalized_hist.index, normalized_hist[ticker2], label=ticker2)
        ax.set_title(f'Comparação de Desempenho: {ticker1} vs {ticker2}', fontsize=16)
        ax.set_ylabel('Performance Normalizada (Base 100)')
        ax.legend()
        plt.tight_layout()

        safe_name = f"graficos/comp_{ticker1.replace('.SA','').upper()}_vs_{ticker2.replace('.SA','').upper()}.png"
        plt.savefig(safe_name)
        plt.close(fig)
        print(f"📈 Gráfico comparativo salvo em: {safe_name}")

    def _obter_dados_para_comparacao(self, ticker_str):
        tickers = self.pesquisar_ativo(ticker_str)
        if not tickers: return None
        dados = self.buscar_dados_ativo(tickers[0])
        return (tickers[0], dados['historico']) if dados and not dados['historico'].empty else None

    def _calcular_variacao_periodo(self, historico, meses):
        if historico.empty or len(historico) < 2: return "N/D"
        hoje = historico.index[-1]
        data_inicio = hoje - relativedelta(months=meses)
        try:
            idx_start = historico.index.searchsorted(data_inicio, side='right') - 1
            if idx_start < 0: return "N/D"

            preco_inicio = historico['Close'].iloc[idx_start]
            preco_fim = historico['Close'].iloc[-1]

            if preco_inicio == 0: return "N/D"

            return self.formatar_valor(((preco_fim / preco_inicio) - 1) * 100, 'porcentagem') # Multiply by 100 here
        except Exception: return "N/D"

    def mostrar_analise_completa(self, ticker, dados):
        info = dados.get("info", {})
        nome = info.get('longName') or info.get('shortName', 'Nome não encontrado')
        quote_type = info.get('quoteType')
        moeda_sym = info.get('currency', 'USD')
        moeda_map = {'BRL': 'R$'}
        moeda = moeda_map.get(moeda_sym, f'{moeda_sym} ')

        print("\n" + "="*80)
        print(f" ANÁLISE COMPLETA: {nome} ({ticker})".center(80))
        print(f" {self.obter_data_hora_internet()}".center(80))
        print("="*80)

        # SEÇÃO COTAÇÃO
        print(f"\n{'💹 COTAÇÃO':^40}")
        print("-" * 40)
        preco_actual_val = info.get('regularMarketPrice')
        variacao_val = info.get('regularMarketChange')
        fechamento_anterior_val = info.get('previousClose')


        preco_actual_str = self.formatar_valor(preco_actual_val, 'moeda', moeda)
        variacao_str = self.formatar_valor(variacao_val, 'moeda', moeda)

        # Calculate percentage variation manually using previous close
        variacao_pct_calculada = None
        if variacao_val is not None and fechamento_anterior_val is not None and fechamento_anterior_val != 0:
             variacao_pct_calculada = (variacao_val / fechamento_anterior_val) * 100


        if variacao_pct_calculada is not None:
             print(f"💰 Preço Atual: {preco_actual_str}")
             print(f"📈 Variação: {self.formatar_valor(variacao_pct_calculada, 'porcentagem')} ({variacao_str})")
        else:
             print(f"💰 Preço Atual: {preco_actual_str}")
             print(f"📈 Variação: N/D ({variacao_str})")


        print(f"🔄 Volume: {self.formatar_valor(info.get('volume'))}")

        # SEÇÃO INFORMAÇÕES DO DIA
        print(f"\n{'📅 INFORMAÇÕES DO DIA':^40}")
        print("-" * 40)
        print(f"🔹 Abertura: {self.formatar_valor(info.get('open'), 'moeda', moeda)}")
        print(f"🔹 Mínima: {self.formatar_valor(info.get('dayLow'), 'moeda', moeda)}")
        print(f"🔹 Máxima: {self.formatar_valor(info.get('dayHigh'), 'moeda', moeda)}")
        print(f"🔹 Fech. anterior: {self.formatar_valor(info.get('previousClose'), 'moeda', moeda)}")

        if quote_type == 'EQUITY':
            # SEÇÃO INDICADORES FUNDAMENTALISTAS
            print(f"\n{'📊 INDICADORES FUNDAMENTALISTAS':^40}")
            print("-" * 40)
            print(f"🔸 P/L: {self.formatar_valor(info.get('trailingPE'))} | P/L Futuro: {self.formatar_valor(info.get('forwardPE'))}")
            print(f"🔸 P/VP: {self.formatar_valor(info.get('priceToBook'))} | P/Vendas: {self.formatar_valor(info.get('priceToSalesTrailing12Months'))}")
            # Corrected Dividend Yield formatting - assume it's already a percentage in decimal form
            print(f"🔸 Dividend Yield: {self.formatar_valor(info.get('dividendYield', 0) * 100, 'porcentagem')}")
            print(f"🔸 LPA: {self.formatar_valor(info.get('trailingEps'))} | VPA: {self.formatar_valor(info.get('bookValue'))}")
            print(f"🔸 EV/EBITDA: {self.formatar_valor(info.get('enterpriseToEbitda'))} | PEG Ratio: {self.formatar_valor(info.get('pegRatio'))}")
            print(f"🔸 ROE: {self.formatar_valor(info.get('returnOnEquity'), 'porcentagem')} | ROA: {self.formatar_valor(info.get('returnOnAssets'), 'porcentagem')}")
            print(f"🔸 Marg. Líquida: {self.formatar_valor(info.get('profitMargins'), 'porcentagem')}")
            print(f"🔸 Dívida/Patrimônio: {self.formatar_valor(info.get('debtToEquity'))}")
            print(f"🔸 Liquidez Corrente: {self.formatar_valor(info.get('currentRatio'))} | Liquidez Seca: {self.formatar_valor(info.get('quickRatio'))}")

            # SEÇÃO VALUATION
            print(f"\n{' FORMULAS CLÁSSICAS/VALUATION':^40}")
            print("-" * 40)
            print(f"🔸 Valor de Mercado: {self.formatar_valor(info.get('marketCap'), 'moeda', moeda)}")
            print(f"🔸 Enterprise Value: {self.formatar_valor(info.get('enterpriseValue'), 'moeda', moeda)}")
            lpa = info.get('trailingEps'); vpa = info.get('bookValue')
            valor_graham = math.sqrt(22.5 * lpa * vpa) if lpa and vpa and lpa > 0 and vpa > 0 else None
            print(f"🔸 Valor Graham: {self.formatar_valor(valor_graham, 'moeda', moeda)}")
            div_acao = info.get('trailingAnnualDividendRate')
            preco_teto = div_acao / 0.06 if div_acao and div_acao > 0 else None
            print(f"🔸 Preço Teto Bazin: {self.formatar_valor(preco_teto, 'moeda', moeda)}")

            # SEÇÃO BALANÇO
            print(f"\n{'💼 BALANÇO':^40}")
            print("-" * 40)
            print(f"🔸 Caixa Total: {self.formatar_valor(info.get('totalCash'), 'moeda', moeda)}")
            print(f"🔸 Dívida Total: {self.formatar_valor(info.get('totalDebt'), 'moeda', moeda)}")
            print(f"🔸 Receita Total: {self.formatar_valor(info.get('totalRevenue'), 'moeda', moeda)}")

        elif quote_type in ['ETF', 'MUTUALFUND']:
            print(f"\n{'📊 INFORMAÇÕES DO FUNDO':^40}")
            print("-" * 40)
            print(f"🔸 Capitalização: {self.formatar_valor(info.get('totalAssets'), 'moeda', moeda)}")
            # Corrected Dividend Yield formatting for ETFs/Mutual Funds - assume it's already a percentage in decimal form
            print(f"🔸 Dividend Yield: {self.formatar_valor(info.get('yield', 0) * 100, 'porcentagem')}")
            hist = dados.get("historico")
            print(f"🔸 Variação (12M): {self._calcular_variacao_periodo(hist, 12)}")
            print(f"🔸 Variação (60M): {self._calcular_variacao_periodo(hist, 60)}")

        print("\n" + "="*80)


def main():
    plataforma = ClearviewVista()
    ultimo_ticker_valido, ultimos_dados_validos = None, None
    while True:
        comando = input("\nDigite o comando (ex: PETR4, PETR4/ITUB4, inicio, sair): ").strip()
        if not comando: continue
        if comando.lower() == 'sair': break
        if comando.lower() == 'inicio':
            plataforma.mostrar_boas_vindas(); plataforma.mostrar_instrucoes(); continue

        if '/' in comando and not any(c.isdigit() for c in comando.split('/')[0][:3]): # Heurística para comparação
            partes = [p.strip() for p in comando.split('/')]
            if len(partes) == 2:
                plataforma.plotar_grafico_comparativo(partes[0], partes[1])
                continue

        tickers_potenciais = plataforma.pesquisar_ativo(comando)
        tickers_validos = {t: d for t in tickers_potenciais if (d := plataforma.buscar_dados_ativo(t))}
        if not tickers_validos: print(f"❌ Nenhum ativo encontrado para '{comando}'."); continue

        ticker_final = None
        if len(tickers_validos) == 1:
            ticker_final = list(tickers_validos.keys())[0]
        else:
            print("\n Múltiplos ativos encontrados. Escolha uma opção:")
            lista_tickers = list(tickers_validos.keys())
            for i, t in enumerate(lista_tickers, 1):
                nome = plataforma.tickers_map.get(t, tickers_validos[t]['info'].get('shortName', 'N/D'))
                print(f" {i} - {t.replace('.SA', '')} ({nome})")
            try:
                escolha = int(input("\nDigite o número: "))
                if 1 <= escolha <= len(lista_tickers): ticker_final = lista_tickers[escolha - 1]
            except (ValueError, IndexError): print("❌ Entrada inválida.")

        if ticker_final:
            ultimo_ticker_valido, ultimos_dados_validos = ticker_final, tickers_validos[ticker_final]
            plataforma.mostrar_analise_completa(ticker_final, ultimos_dados_validos)

            while True:
                cmd = input("\nGerar gráfico? (ex: 5d, 1m, 1y) ou Enter para nova busca: ").strip().lower()
                if not cmd: break
                if cmd in ['5d', '1m', '6m', '1y', '5y', 'max']:
                    plataforma.plotar_grafico(ticker_final, cmd, ultimos_dados_validos.get("historico", pd.DataFrame()))
                else: print("❌ Período inválido.")
    print("\nObrigado por usar o Clearview Vista! Até logo.\n")

if __name__ == "__main__":
    main()