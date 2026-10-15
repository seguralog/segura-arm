<!-- 0. ABA ENTRADA E SAÍDA (WMS PROVISÓRIO) -->
<div id="aba-entrada-saida" class="aba-conteudo space-y-6">
    <!-- Cabeçalho do Módulo -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-black p-6 rounded-xl text-white">
        <div>
            <h2 class="text-2xl font-bold tracking-tight text-orange-500">WMS / Gestão de Armazenagem e Coletor</h2>
            <p class="text-neutral-400 text-xs">Entrada/Saída por leitor barcode, controle por NS, Seguro do Estoque e Cálculo de Pico Mensal.</p>
        </div>
        <div class="flex gap-2">
            <button onclick="abrirModalProdutoWms()" class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold transition shadow-sm text-xs">
                + Cadastrar Produto
            </button>
            <button onclick="exportarEstoqueCsv()" class="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold transition shadow-sm text-xs">
                📥 Exportar Planilha
            </button>
        </div>
    </div>

    <!-- Cards de Resumo -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
            <span class="text-xs font-semibold text-neutral-500 uppercase">Itens Armazenados</span>
            <p id="wms-total-itens" class="text-2xl font-bold text-neutral-900 mt-1">0</p>
        </div>
        <div class="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
            <span class="text-xs font-semibold text-neutral-500 uppercase">Posições Ocupadas Atuais</span>
            <p id="wms-total-posicoes" class="text-2xl font-bold text-orange-600 mt-1">0.00</p>
        </div>
        <div class="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
            <span class="text-xs font-semibold text-neutral-500 uppercase">Valor Total Estoque (Seguro)</span>
            <p id="wms-total-valor-seguro" class="text-2xl font-bold text-emerald-600 mt-1">R$ 0,00</p>
        </div>
    </div>

    <!-- Terminal do Coletor de Dados -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-xl border-2 border-orange-500 shadow-md space-y-4">
            <h3 class="text-sm font-bold text-neutral-900 border-b border-neutral-200 pb-2 flex items-center gap-2">
                📱 Terminal do Coletor / Leitor
            </h3>

            <div>
                <label class="block text-xs font-bold text-neutral-700 mb-1">Operação</label>
                <div class="grid grid-cols-2 gap-2">
                    <button id="btn-op-saida" onclick="definirTipoOperacaoWms('SAIDA')" class="py-3 text-center rounded-lg font-bold text-xs bg-orange-600 text-white border border-orange-600 shadow">
                        Saída (Expedição)
                    </button>
                    <button id="btn-op-entrada" onclick="definirTipoOperacaoWms('ENTRADA')" class="py-3 text-center rounded-lg font-bold text-xs bg-neutral-100 text-neutral-600 border border-neutral-300">
                        Entrada (Recebimento)
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-2">
                <div>
                    <label class="block text-xs font-semibold text-neutral-700 mb-1">Nº Pedido / NF</label>
                    <input type="text" id="wms-doc-numero" placeholder="Ex: 10450" class="w-full border rounded-lg p-2 text-xs font-bold">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-neutral-700 mb-1">Cadastro (Dono)</label>
                    <input type="text" id="wms-doc-cliente" value="ProHospital" class="w-full border rounded-lg p-2 text-xs bg-neutral-50">
                </div>
            </div>

            <div>
                <label class="block text-xs font-bold text-neutral-700 mb-1">Produto Operado *</label>
                <select id="wms-select-produto" class="w-full border border-neutral-300 rounded-lg p-2.5 text-xs font-bold focus:ring-2 focus:ring-orange-500 focus:outline-none">
                    <option value="">-- Selecione o Produto --</option>
                </select>
            </div>

            <div>
                <label class="block text-xs font-bold text-orange-800 mb-1">Bipar Código / NS *</label>
                <input type="text" id="wms-input-bipagem" placeholder="Aguardando leitor..." 
                       class="w-full border-2 border-orange-600 rounded-lg p-3 text-base font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-orange-600 bg-orange-50" autofocus>
                <p class="text-[10px] text-neutral-500 mt-1">Pressione [ENTER] no coletor após a leitura.</p>
            </div>

            <div id="wms-feedback-operacao" class="p-3 rounded-lg text-xs font-bold hidden"></div>
        </div>

        <!-- Tabela de Movimentações Recentes -->
        <div class="lg:col-span-2 bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-4">
            <div class="flex justify-between items-center border-b border-neutral-200 pb-2">
                <h3 class="text-sm font-bold text-neutral-900">Histórico de Bipagens Recentes</h3>
                <button onclick="carregarMovimentacoesWms()" class="text-xs text-orange-700 hover:underline font-semibold">Atualizar Tabela</button>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse text-xs">
                    <thead>
                        <tr class="bg-neutral-900 text-white text-[11px] uppercase">
                            <th class="p-3 rounded-tl-lg">Data/Hora</th>
                            <th class="p-3">Operação</th>
                            <th class="p-3">Código</th>
                            <th class="p-3">Descrição Produto</th>
                            <th class="p-3">Nº Série (NS)</th>
                            <th class="p-3 rounded-tr-lg">Qtde</th>
                        </tr>
                    </thead>
                    <tbody id="wms-tabela-movimentos" class="divide-y divide-neutral-200">
                        <tr><td colspan="6" class="p-4 text-center text-neutral-500">Carregando histórico...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Consulta de Pico Mensal para Faturamento -->
    <div class="bg-black text-white p-6 rounded-xl shadow-md space-y-4">
        <h3 class="text-sm font-bold text-orange-500 uppercase tracking-wide">📊 Fechamento Mensal: Pico de Posições e Valor em Estoque</h3>
        <div class="flex flex-col md:flex-row items-end gap-4">
            <div>
                <label class="block text-xs font-semibold text-neutral-300 mb-1">Mês/Ano do Fechamento</label>
                <input type="month" id="wms-mes-relatorio" class="border rounded-lg p-2 text-xs text-black font-bold">
            </div>
            <button onclick="gerarRelatorioPicoMensal()" class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs transition">
                Consultar Pico do Mês
            </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-neutral-800">
            <div><span class="text-[10px] text-neutral-400 font-bold uppercase">Dia do Pico no Mês:</span><p id="wms-pico-data" class="text-lg font-bold text-white">-</p></div>
            <div><span class="text-[10px] text-neutral-400 font-bold uppercase">Pico de Posições Ocupadas:</span><p id="wms-pico-posicoes" class="text-lg font-bold text-orange-500">0.00 posições</p></div>
            <div><span class="text-[10px] text-neutral-400 font-bold uppercase">Valor Armazenado no Pico (Seguro):</span><p id="wms-pico-valor" class="text-lg font-bold text-emerald-400">R$ 0,00</p></div>
        </div>
    </div>

    <!-- Tabela de Inventário Atual em Galpão -->
    <div class="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-4">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-neutral-200 pb-3">
            <div>
                <h3 class="text-sm font-bold text-neutral-900">Produtos Armazenados em Estoque</h3>
            </div>
            <input type="text" id="wms-filtro-estoque" onkeyup="filtrarTabelaEstoqueWms()" placeholder="Buscar por Código, NS ou Produto..." class="border border-neutral-300 rounded-lg px-3 py-1.5 text-xs w-full md:w-64">
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
                <thead>
                    <tr class="bg-neutral-100 border-b border-neutral-200 text-[11px] font-bold text-neutral-700 uppercase">
                        <th class="p-3">Código</th>
                        <th class="p-3">Descrição Produto</th>
                        <th class="p-3">Nº Série</th>
                        <th class="p-3">Dono (Cadastro)</th>
                        <th class="p-3">Qtde</th>
                        <th class="p-3">Endereço</th>
                        <th class="p-3">Posições Ocupadas</th>
                        <th class="p-3">Valor Total Seguro (R$)</th>
                    </tr>
                </thead>
                <tbody id="wms-tabela-estoque" class="divide-y divide-neutral-200">
                    <tr><td colspan="8" class="p-4 text-center text-neutral-500">Carregando estoque...</td></tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Modal: Cadastro de Produto WMS -->
<div id="modal-wms-produto" class="fixed inset-0 bg-black/50 backdrop-blur-sm hidden flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4 border-t-4 border-orange-600">
        <h3 class="text-base font-bold text-neutral-900">Cadastrar Novo Produto</h3>
        <form id="form-wms-produto" onsubmit="salvarProdutoWms(event)" class="space-y-3">
            <div>
                <label class="block text-xs font-semibold text-neutral-700">Código do Produto *</label>
                <input type="text" id="wms-prod-codigo" required class="w-full border rounded-lg p-2 text-xs font-mono">
            </div>
            <div>
                <label class="block text-xs font-semibold text-neutral-700">Descrição do Produto *</label>
                <input type="text" id="wms-prod-desc" required class="w-full border rounded-lg p-2 text-xs">
            </div>
            <div>
                <label class="block text-xs font-semibold text-neutral-700">Dono do Material (Cadastro)</label>
                <input type="text" id="wms-prod-cliente" value="ProHospital" required class="w-full border rounded-lg p-2 text-xs">
            </div>
            <div class="grid grid-cols-3 gap-2">
                <div>
                    <label class="block text-xs font-semibold text-neutral-700">Exige NS?</label>
                    <select id="wms-prod-exige-ns" class="w-full border rounded-lg p-2 text-xs font-bold">
                        <option value="true">SIM</option>
                        <option value="false">NÃO</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-semibold text-neutral-700">Posição (Fator)</label>
                    <input type="number" step="0.1" id="wms-prod-fator" value="1.0" required class="w-full border rounded-lg p-2 text-xs">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-neutral-700">Valor Seguro R$</label>
                    <input type="number" step="0.01" id="wms-prod-valor" value="0.00" required class="w-full border rounded-lg p-2 text-xs font-bold">
                </div>
            </div>
            <div class="flex justify-end gap-2 pt-2">
                <button type="button" onclick="fecharModalProdutoWms()" class="px-4 py-2 border rounded-lg text-xs font-medium">Cancelar</button>
                <button type="submit" class="px-4 py-2 bg-orange-600 text-white rounded-lg text-xs font-bold shadow">Salvar Produto</button>
            </div>
        </form>
    </div>
</div>
