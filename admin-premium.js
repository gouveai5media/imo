// Premium Super Admin layer for IMO demo
NAV.admin=[
  ['VISÃO EXECUTIVA',[["dashboard","⌂","Cockpit"],["contratos","▦","Contratos"],["empreendimentos","▣","Empreendimentos"],["incorporadoras","◆","Incorporadoras"]]],
  ['OPERAÇÃO',[["usuarios","◎","Usuários & acessos"],["manuais","▤","Manuais & documentos"],["garantias","◒","Garantias"],["assistencia","◉","Assistência técnica"]]],
  ['PLATAFORMA',[["configuracoes","⚙","Configurações"]]]
];

MODULES.admin=[
 ['▦','Contratos','Ciclo completo dos contratos, vigência, renovação e responsáveis.','8 ativos'],
 ['▣','Empreendimentos','Condomínios, blocos, unidades e status de implantação.','12 ativos'],
 ['◆','Incorporadoras','Empresas contratantes, contatos e portfólio vinculado.','5 empresas'],
 ['◎','Usuários & acessos','Síndicos, administradores, moradores e permissões.','1.473 usuários'],
 ['▤','Conteúdo técnico','Manuais, databook, plantas e documentos protegidos.','36 publicações'],
 ['◒','Garantias','Prazos, regras e alertas por empreendimento.','94% vigentes'],
 ['◉','Operação','Assistência técnica, manutenção e solicitações.','18 chamados'],
 ['⚙','Plataforma','Identidade, perfis, permissões e parâmetros do SaaS.','4 perfis']
];

const IMO_CONTRACTS=[
 {id:'IMO-2026-018',condominio:'Residencial Noon',incorporadora:'Alfa Realty',inicio:'15/03/2026',fim:'14/03/2031',prazo:'5 anos',unidades:248,plano:'Enterprise',valor:'R$ 4.980/mês',responsavel:'Marina Alves',sindico:'Ronaldo Oliveira',status:'ATIVO',health:96},
 {id:'IMO-2026-014',condominio:'Reserva Vila Mariana',incorporadora:'Alfa Realty',inicio:'01/02/2026',fim:'31/01/2031',prazo:'5 anos',unidades:186,plano:'Enterprise',valor:'R$ 3.720/mês',responsavel:'Marina Alves',sindico:'Ana Martins',status:'ATIVO',health:91},
 {id:'IMO-2025-041',condominio:'Urban Moema',incorporadora:'Urban Incorporadora',inicio:'10/11/2025',fim:'09/11/2030',prazo:'5 anos',unidades:312,plano:'Premium',valor:'R$ 5.460/mês',responsavel:'Felipe Costa',sindico:'Carlos Lima',status:'ATIVO',health:88},
 {id:'IMO-2025-033',condominio:'Parque das Árvores',incorporadora:'Vértice Desenvolvimento',inicio:'20/09/2025',fim:'19/09/2028',prazo:'3 anos',unidades:144,plano:'Premium',valor:'R$ 2.880/mês',responsavel:'Bianca Freitas',sindico:'Paulo Nunes',status:'ATIVO',health:84},
 {id:'IMO-2024-021',condominio:'Vista Alto da Lapa',incorporadora:'Horizonte Inc.',inicio:'01/10/2024',fim:'30/09/2026',prazo:'2 anos',unidades:96,plano:'Essencial',valor:'R$ 1.920/mês',responsavel:'Eduardo Ramos',sindico:'Luciana Prado',status:'RENOVAÇÃO',health:72},
 {id:'IMO-2024-019',condominio:'Jardins do Brooklin',incorporadora:'Horizonte Inc.',inicio:'15/09/2024',fim:'14/09/2026',prazo:'2 anos',unidades:122,plano:'Premium',valor:'R$ 2.440/mês',responsavel:'Eduardo Ramos',sindico:'Renato Melo',status:'RENOVAÇÃO',health:78},
 {id:'IMO-2026-026',condominio:'Lume Pinheiros',incorporadora:'Lume Desenvolvimento',inicio:'01/08/2026',fim:'31/07/2031',prazo:'5 anos',unidades:210,plano:'Enterprise',valor:'R$ 4.200/mês',responsavel:'Carolina Reis',sindico:'Em definição',status:'IMPLANTAÇÃO',health:63},
 {id:'IMO-2026-029',condominio:'Bosque Santana',incorporadora:'Vértice Desenvolvimento',inicio:'10/08/2026',fim:'09/08/2031',prazo:'5 anos',unidades:168,plano:'Premium',valor:'R$ 3.360/mês',responsavel:'Bianca Freitas',sindico:'Em definição',status:'IMPLANTAÇÃO',health:58}
];

const _baseRenderDashboard=renderDashboard;
const _baseRenderModulePage=renderModulePage;
const _baseOpenPage=openPage;

function contractStatus(status){const cls=status==='ATIVO'?'green':status==='RENOVAÇÃO'?'yellow':'blue';return `<span class="status ${cls}">${status}</span>`;}
function adminKpi(icon,value,label,meta,tone=''){return `<article class="executive-kpi ${tone}"><div class="kpi-head"><span class="kpi-icon">${icon}</span><span class="kpi-spark">${meta}</span></div><strong>${value}</strong><p>${label}</p></article>`;}
function healthRing(value){return `<div class="health-ring" style="--p:${value}"><span>${value}</span></div>`;}
function adminHero(){return `<div class="admin-hero"><div><span class="admin-pill">SUPER ADMIN • EXECUTIVE VIEW</span><h1>${greeting()}, Matheus.</h1><p>Visão executiva da carteira IMO: contratos, implantações, renovações e saúde dos condomínios.</p></div><div class="hero-actions"><button class="action-btn" onclick="toast('Relatório executivo preparado')">⇩ Relatório executivo</button><button class="action-btn primary premium-cta" onclick="openContractComposer()">＋ Novo contrato</button></div></div>`;}

function renderAdminDashboard(){
 const totalUnits=IMO_CONTRACTS.reduce((s,c)=>s+c.unidades,0);
 content.innerHTML=`${adminHero()}
 <div class="executive-metrics">
   ${adminKpi('▦','8','Contratos ativos','+2 no trimestre')}
   ${adminKpi('⌂',totalUnits.toLocaleString('pt-BR'),'Unidades contratadas','+18,4% YoY')}
   ${adminKpi('◆','5','Incorporadoras','2 em expansão')}
   ${adminKpi('↻','2','Renovações próximas','Próx. 60 dias','attention')}
   ${adminKpi('◈','R$ 28,9 mil','Receita mensal demo','Carteira recorrente','revenue')}
 </div>
 <div class="executive-layout">
   <section class="panel portfolio-panel">
    <div class="panel-header rich"><div><span class="mini-label">CARTEIRA CONTRATUAL</span><h3>Contratos por ciclo</h3></div><button onclick="openPage('contratos')">Ver contratos →</button></div>
    <div class="portfolio-visual">
      <div class="donut" aria-label="Distribuição de contratos"><div><strong>8</strong><span>contratos</span></div></div>
      <div class="legend-list"><div><i class="legend-dot active"></i><span>Ativos</span><b>4</b><small>50%</small></div><div><i class="legend-dot renewal"></i><span>Renovação</span><b>2</b><small>25%</small></div><div><i class="legend-dot implementation"></i><span>Implantação</span><b>2</b><small>25%</small></div></div>
    </div>
   </section>
   <section class="panel renewal-panel">
    <div class="panel-header rich"><div><span class="mini-label">ATENÇÃO COMERCIAL</span><h3>Próximas renovações</h3></div><span>60 dias</span></div>
    <div class="renewal-card"><div><strong>Vista Alto da Lapa</strong><span>Horizonte Inc. • 96 unidades</span></div><div class="renewal-date"><b>49</b><small>dias</small></div></div>
    <div class="renewal-card"><div><strong>Jardins do Brooklin</strong><span>Horizonte Inc. • 122 unidades</span></div><div class="renewal-date"><b>33</b><small>dias</small></div></div>
    <button class="renewal-action" onclick="openPage('contratos')">Abrir pipeline de renovação <span>→</span></button>
   </section>
 </div>
 <div class="panel premium-table-panel">
   <div class="panel-header rich"><div><span class="mini-label">OPERAÇÃO EM TEMPO REAL</span><h3>Saúde dos principais contratos</h3></div><button onclick="openPage('contratos')">Carteira completa →</button></div>
   <div class="contract-cards">${IMO_CONTRACTS.slice(0,4).map(c=>`<article class="contract-mini"><div class="contract-mini-top"><div><span>${c.id}</span><h4>${c.condominio}</h4></div>${healthRing(c.health)}</div><p>${c.incorporadora}</p><div class="contract-mini-meta"><span>${c.unidades} unidades</span><span>${c.prazo}</span>${contractStatus(c.status)}</div></article>`).join('')}</div>
 </div>
 <div class="section-title">CENTRAL DE GESTÃO</div><div class="modules-grid premium-modules">${MODULES.admin.map(m=>`<article class="module-card" onclick="${m[1]==='Contratos'?"openPage('contratos')":`toast('${m[1]} aberto')`}"><div class="module-icon">${m[0]}</div><h3>${m[1]}</h3><p>${m[2]}</p><footer><span>${m[3]}</span><b>→</b></footer></article>`).join('')}</div>
 ${contractComposerMarkup()}`;
}

function renderContracts(){
 content.innerHTML=`<div class="admin-hero compact"><div><span class="admin-pill">GESTÃO COMERCIAL & CONTRATUAL</span><h1>Contratos</h1><p>Controle da relação entre IMO, incorporadora, condomínio, vigência, plano e responsáveis.</p></div><div class="hero-actions"><button class="action-btn">⇩ Exportar carteira</button><button class="action-btn primary premium-cta" onclick="openContractComposer()">＋ Novo contrato</button></div></div>
 <div class="executive-metrics contract-kpis">${adminKpi('▦','8','Contratos','Carteira total')}${adminKpi('✓','4','Operando','50% da carteira')}${adminKpi('↻','2','Em renovação','Próx. 60 dias','attention')}${adminKpi('◫','2','Implantando','Onboarding ativo')}${adminKpi('◈','1.486','Unidades','Contratadas')}</div>
 <div class="contract-toolbar"><div class="search-premium"><span>⌕</span><input id="contractSearch" placeholder="Buscar condomínio, incorporadora ou contrato..." oninput="filterContracts()"></div><div class="filter-chips"><button class="chip active" onclick="setContractFilter('TODOS',this)">Todos</button><button class="chip" onclick="setContractFilter('ATIVO',this)">Ativos</button><button class="chip" onclick="setContractFilter('RENOVAÇÃO',this)">Renovação</button><button class="chip" onclick="setContractFilter('IMPLANTAÇÃO',this)">Implantação</button></div></div>
 <div class="panel contract-list-panel"><div class="contract-list-head"><span>CONDOMÍNIO / CONTRATO</span><span>INCORPORADORA</span><span>VIGÊNCIA</span><span>PLANO</span><span>SAÚDE</span><span>STATUS</span><span></span></div><div id="contractRows">${contractRows(IMO_CONTRACTS)}</div></div>
 <div class="contract-insights"><div class="panel"><span class="mini-label">RISCO DE RENOVAÇÃO</span><h3>2 contratos merecem atenção</h3><p>Os contratos da Horizonte Inc. vencem em setembro. Estruture contato comercial e proposta de renovação antecipada.</p><button class="text-link" onclick="toast('Pipeline de renovação sinalizado')">Criar ação comercial →</button></div><div class="panel"><span class="mini-label">EXPANSÃO DE CARTEIRA</span><h3>+378 unidades em implantação</h3><p>Lume Pinheiros e Bosque Santana estão em onboarding e devem ampliar a base ativa nas próximas semanas.</p><button class="text-link" onclick="toast('Checklist de implantação aberto')">Ver implantação →</button></div></div>
 ${contractComposerMarkup()}`;
 window._contractFilter='TODOS';
}

function contractRows(list){return list.map(c=>`<article class="contract-row" data-status="${c.status}" data-search="${(c.condominio+' '+c.incorporadora+' '+c.id).toLowerCase()}"><div class="contract-name"><div class="contract-logo">${c.condominio.split(' ').slice(0,2).map(x=>x[0]).join('')}</div><div><strong>${c.condominio}</strong><span>${c.id} • ${c.unidades} unidades</span></div></div><div><strong>${c.incorporadora}</strong><span>${c.responsavel}</span></div><div><strong>${c.inicio}</strong><span>até ${c.fim} • ${c.prazo}</span></div><div><strong>${c.plano}</strong><span>${c.valor}</span></div><div class="health-cell">${healthRing(c.health)}<span>${c.health>=90?'Excelente':c.health>=75?'Saudável':'Atenção'}</span></div><div>${contractStatus(c.status)}</div><button class="row-action" onclick="showContract('${c.id}')">•••</button></article>`).join('');}

function setContractFilter(status,btn){window._contractFilter=status;document.querySelectorAll('.filter-chips .chip').forEach(x=>x.classList.remove('active'));btn.classList.add('active');filterContracts();}
function filterContracts(){const q=(document.getElementById('contractSearch')?.value||'').toLowerCase();document.querySelectorAll('.contract-row').forEach(r=>{const okStatus=!window._contractFilter||window._contractFilter==='TODOS'||r.dataset.status===window._contractFilter;const okSearch=!q||r.dataset.search.includes(q);r.style.display=okStatus&&okSearch?'grid':'none';});}
function showContract(id){const c=IMO_CONTRACTS.find(x=>x.id===id);toast(`${c.condominio} • ${c.status} • ${c.fim}`);}

function contractComposerMarkup(){return `<div id="contractComposer" class="composer-overlay hidden"><div class="composer-card"><button class="composer-close" onclick="closeContractComposer()">×</button><span class="admin-pill">NOVO CONTRATO</span><h2>Cadastrar contrato</h2><p>Estrutura demonstrativa para o Super Admin. Os dados serão conectados ao banco na etapa de produção.</p><div class="composer-grid"><label>Condomínio<input id="newCondo" placeholder="Ex.: Residencial Aurora"></label><label>Incorporadora<input placeholder="Ex.: Alfa Realty"></label><label>Data de início<input type="date"></label><label>Prazo<select><option>5 anos</option><option>3 anos</option><option>2 anos</option><option>1 ano</option></select></label><label>Quantidade de unidades<input type="number" placeholder="Ex.: 180"></label><label>Plano<select><option>Enterprise</option><option>Premium</option><option>Essencial</option></select></label><label>Responsável incorporadora<input placeholder="Nome do contato"></label><label>Síndico<input placeholder="Nome do síndico"></label></div><div class="composer-actions"><button class="action-btn" onclick="closeContractComposer()">Cancelar</button><button class="action-btn primary premium-cta" onclick="saveDemoContract()">Salvar contrato</button></div></div></div>`;}
function openContractComposer(){document.getElementById('contractComposer')?.classList.remove('hidden');}
function closeContractComposer(){document.getElementById('contractComposer')?.classList.add('hidden');}
function saveDemoContract(){const n=document.getElementById('newCondo')?.value||'Novo condomínio';closeContractComposer();toast(`${n} cadastrado no ambiente de demonstração`);}

openPage=function(page){currentPage=page;document.querySelectorAll('.nav-item[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===page));document.getElementById('sidebar').classList.remove('open');const label=[...document.querySelectorAll('.nav-item[data-page]')].find(b=>b.dataset.page===page)?.innerText.trim()||'Dashboard';document.getElementById('pageTitle').textContent=label;document.getElementById('breadcrumb').textContent=`IMO / ${USERS[currentUser].role} / ${label}`;if(currentUser==='admin'&&page==='dashboard')renderAdminDashboard();else if(currentUser==='admin'&&page==='contratos')renderContracts();else if(page==='dashboard')_baseRenderDashboard();else _baseRenderModulePage(page,label);};

window.openPage=openPage;window.openContractComposer=openContractComposer;window.closeContractComposer=closeContractComposer;window.saveDemoContract=saveDemoContract;window.setContractFilter=setContractFilter;window.filterContracts=filterContracts;window.showContract=showContract;

// If an admin session was restored before this enhancement loaded, rebuild it with the premium navigation.
if(currentUser==='admin'){buildNav();openPage('dashboard');}
