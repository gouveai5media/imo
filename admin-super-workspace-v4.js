/* IMO — Super Admin / workspace operacional V4 baseado nas funções do sistema legado */
(function(){
  if(window.__IMO_ADMIN_SUPER_WORKSPACE_V4__) return;
  window.__IMO_ADMIN_SUPER_WORKSPACE_V4__=true;

  const STORAGE='imo_admin_condos_v3';
  const DEFAULT_MODULES=['furacao','dwg','videos','assistencia','garantias','reformas','reservas','ocorrencias','avisos','databook'];
  const MODULE_LABELS={
    furacao:'Plantas de furação',dwg:'Plantas de Furação (DWG)',videos:'Vídeos',assistencia:'Assistência Técnica',
    garantias:'Gestão das Garantias',reformas:'Planos de Reforma',reservas:'Agendamento de Espaços',
    ocorrencias:'Livro de Ocorrências',avisos:'Quadro de Avisos',databook:'Databook'
  };
  const FILE_TYPES=['Planta de furação','Planta de Furação (DWG)','Manual do Proprietário','Manual do Síndico','Databook','Garantia','Vídeo','Outro'];
  const TABS=[
    ['visao','⌂','Visão geral'],['dados','▤','Dados'],['contrato','◇','Contrato'],['estrutura','▦','Unidades & blocos'],
    ['arquivos','⌑','Arquivos'],['manuais','▥','Manuais'],['assistencia','◉','Assistência'],['reservas','▣','Reservas'],
    ['garantias','◒','Garantias'],['manutencoes','↻','Manutenções'],['comunicacao','◆','Avisos & ocorrências'],['acessos','◎','Acessar como']
  ];
  const seed=[
    {id:'noon',code:'2026001',name:'Residencial Noon',cnpj:'11.111.111/1111-11',type:'Vertical',builder:'Construtora Horizonte',inc:'Alfa Realty',sind:'Ronaldo Oliveira',sindPhone:'(11) 99999-1001',sindEmail:'ronaldo@noon.com.br',units:128,registrationDate:'2024-03-01',termYears:'5',contractEnd:'2029-02-28',status:'ATIVO',modules:DEFAULT_MODULES.slice(),unitTypes:['TIPO'],files:[{name:'Manual do Proprietário.pdf',type:'Manual do Proprietário',date:'2026-08-19'}]},
    {id:'vila',code:'2023001',name:'Reserva Vila Mariana',cnpj:'22.222.222/2222-22',type:'Vertical + Garden',builder:'Matriz Engenharia',inc:'Urban Incorporadora',sind:'Ana Martins',sindPhone:'(11) 98888-2020',sindEmail:'ana@reservavila.com.br',units:216,registrationDate:'2023-08-15',termYears:'5',contractEnd:'2028-08-14',status:'ATIVO',modules:DEFAULT_MODULES.slice(),unitTypes:['TIPO','Garden'],files:[]},
    {id:'villas',code:'2025001',name:'Villas do Lago',cnpj:'33.333.333/3333-33',type:'Horizontal',builder:'Lago Construções',inc:'Horizonte Desenvolvimento',sind:'Paulo Mendes',sindPhone:'(11) 97777-3030',sindEmail:'paulo@villasdolago.com.br',units:84,registrationDate:'2025-01-01',termYears:'5',contractEnd:'2029-12-31',status:'ATIVO',modules:['furacao','videos','assistencia','garantias','reformas','reservas','ocorrencias','avisos'],unitTypes:['TIPO','Casa'],files:[]},
    {id:'arau',code:'2022004',name:'Parque das Araucárias',cnpj:'44.444.444/4444-44',type:'Misto',builder:'Araucária Engenharia',inc:'Alfa Realty',sind:'Carla Souza',sindPhone:'(11) 96666-4040',sindEmail:'carla@arau.com.br',units:176,registrationDate:'2022-11-10',termYears:'5',contractEnd:'2027-11-09',status:'RENOVAÇÃO',modules:DEFAULT_MODULES.slice(),unitTypes:['TIPO','Garden'],files:[]}
  ];

  let selectedId=null;
  let activeTab='visao';
  let uploadQueue=[];

  const qs=s=>document.querySelector(s);
  const qsa=s=>[...document.querySelectorAll(s)];
  function isAdmin(){try{return currentUser==='admin';}catch(e){return false;}}
  function C(){return document.getElementById('content');}
  function esc(v=''){return String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));}
  function toastMsg(msg){if(typeof toast==='function')toast(msg);}
  function today(){return new Date().toISOString().slice(0,10);}
  function displayDate(v){if(!v)return '—';const p=String(v).split('-');return p.length===3?`${p[2]}/${p[1]}/${p[0]}`:v;}
  function addYearsMinusDay(dateStr,years){
    if(!dateStr||years==='custom'||!years)return '';
    const d=new Date(`${dateStr}T12:00:00`);if(Number.isNaN(d.getTime()))return '';
    d.setFullYear(d.getFullYear()+Number(years));d.setDate(d.getDate()-1);return d.toISOString().slice(0,10);
  }
  function uid(prefix){return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;}

  function load(){
    let data=null;try{data=JSON.parse(localStorage.getItem(STORAGE)||'null');}catch(e){}
    if(!Array.isArray(data)||!data.length)data=JSON.parse(JSON.stringify(seed));
    data.forEach(ensureShape);return data;
  }
  function save(data){try{localStorage.setItem(STORAGE,JSON.stringify(data));return true;}catch(e){toastMsg('Não foi possível salvar esta alteração na demonstração.');return false;}}
  function ensureShape(x){
    x.modules=Array.isArray(x.modules)?x.modules:DEFAULT_MODULES.slice();
    x.unitTypes=Array.isArray(x.unitTypes)&&x.unitTypes.length?x.unitTypes:['TIPO'];
    if(!x.unitTypes.includes('TIPO'))x.unitTypes.unshift('TIPO');
    x.files=Array.isArray(x.files)?x.files:[];
    x.blocks=Array.isArray(x.blocks)?x.blocks:[];
    x.habiteSe=Array.isArray(x.habiteSe)?x.habiteSe:[];
    x.customManuals=Array.isArray(x.customManuals)?x.customManuals:[];
    x.tickets=Array.isArray(x.tickets)?x.tickets:[];
    x.reservations=Array.isArray(x.reservations)?x.reservations:[];
    x.warranties=Array.isArray(x.warranties)?x.warranties:[];
    x.maintenancePlans=Array.isArray(x.maintenancePlans)?x.maintenancePlans:[];
    x.notices=Array.isArray(x.notices)?x.notices:[];
    x.occurrences=Array.isArray(x.occurrences)?x.occurrences:[];
    x.assistanceSystem=x.assistanceSystem||'Sistema IMO';
    x.maintenanceEmail=x.maintenanceEmail!==false;
    x.uploadLimit=x.uploadLimit||300;
    x.address=x.address||'';x.neighborhood=x.neighborhood||'';x.city=x.city||'';x.state=x.state||'SP';x.number=x.number||'';x.complement=x.complement||'';
    return x;
  }
  function getData(){return load();}
  function selected(data){return data.find(x=>x.id===selectedId);}
  function updateSelected(mutator){const data=getData();const x=selected(data);if(!x)return;mutator(x);ensureShape(x);save(data);return x;}
  function prepare(label='Condomínios'){
    try{currentPage='condominios';}catch(e){}
    qsa('#navMenu .nav-item[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page==='condominios'));
    qs('#sidebar')?.classList.remove('open');
    if(qs('#pageTitle'))qs('#pageTitle').textContent=label;
    if(qs('#breadcrumb'))qs('#breadcrumb').textContent=`IMO / Super Admin / ${label}`;
  }

  function renderList(){
    if(!isAdmin())return;selectedId=null;activeTab='visao';prepare('Condomínios');
    const c=C();if(!c)return;c.className='admin-condos-v4';
    c.innerHTML=`
      <section class="av4-hero"><div><span class="eyebrow">ADMINISTRAÇÃO DE CONDOMÍNIOS</span><h1>Condomínios</h1><p>O cadastro antigo vira um workspace único: escolha o empreendimento e ajuste todos os módulos por abas.</p></div><button class="action-btn primary" id="av4New">＋ Cadastrar condomínio</button></section>
      <section class="av4-toolbar"><div class="av4-search-wrap"><span>⌕</span><input id="av4Search" placeholder="Buscar por código, condomínio, CNPJ, construtora, incorporadora ou síndico"></div><select id="av4Sort"><option value="name">Condomínio A–Z</option><option value="code">Código</option><option value="builder">Construtora</option><option value="inc">Incorporadora</option><option value="contractEnd">Data limite do contrato</option></select><span class="av4-count" id="av4Count"></span></section>
      <section class="av4-table-card"><div class="av4-table-scroll"><table class="av4-table"><thead><tr><th>Código</th><th>Condomínio</th><th>Construtora</th><th>Incorporadora</th><th>Síndico</th><th>Unidades</th><th>Contrato</th><th>Status</th><th></th></tr></thead><tbody id="av4Rows"></tbody></table></div></section>`;
    qs('#av4Search').oninput=drawRows;qs('#av4Sort').onchange=drawRows;qs('#av4New').onclick=createNew;drawRows();
  }
  function drawRows(){
    const host=qs('#av4Rows');if(!host)return;const data=getData();
    const q=(qs('#av4Search')?.value||'').trim().toLowerCase();const sort=qs('#av4Sort')?.value||'name';
    const filtered=data.filter(x=>[x.code,x.name,x.cnpj,x.builder,x.inc,x.sind].join(' ').toLowerCase().includes(q))
      .sort((a,b)=>String(a[sort]||'').localeCompare(String(b[sort]||''),'pt-BR',{numeric:true}));
    qs('#av4Count').textContent=`${filtered.length} empreendimento${filtered.length===1?'':'s'}`;
    host.innerHTML=filtered.length?filtered.map(x=>`<tr data-open-condo="${esc(x.id)}"><td><b>${esc(x.code||'—')}</b></td><td><strong>${esc(x.name)}</strong><small>${esc(x.cnpj||'CNPJ não informado')}</small></td><td>${esc(x.builder||'—')}</td><td>${esc(x.inc||'—')}</td><td>${esc(x.sind||'—')}<small>${esc(x.sindPhone||'')}</small></td><td>${esc(x.units||0)}</td><td><b>${displayDate(x.contractEnd)}</b><small>${esc(x.termYears||'5')} anos</small></td><td><span class="status ${x.status==='ATIVO'?'green':'yellow'}">${esc(x.status||'ATIVO')}</span></td><td><button class="av4-open">Abrir →</button></td></tr>`).join(''):`<tr><td colspan="9" class="av4-empty">Nenhum condomínio encontrado.</td></tr>`;
    qsa('[data-open-condo]').forEach(r=>r.onclick=()=>openCondo(r.dataset.openCondo,'visao'));
  }
  function createNew(){
    const data=getData();const d=today();const x=ensureShape({id:uid('condo'),code:'',name:'Novo condomínio',cnpj:'',type:'Vertical',builder:'',inc:'',sind:'',sindPhone:'',sindEmail:'',units:0,registrationDate:d,termYears:'5',contractEnd:addYearsMinusDay(d,'5'),status:'ATIVO',modules:DEFAULT_MODULES.slice(),unitTypes:['TIPO'],files:[]});
    data.unshift(x);save(data);openCondo(x.id,'dados');
  }

  function openCondo(id,tab='visao'){
    if(!isAdmin())return;selectedId=id;activeTab=tab;uploadQueue=[];prepare('Condomínios');
    const data=getData();const x=selected(data);if(!x){renderList();return;}ensureShape(x);
    const c=C();c.className='admin-condos-v4';
    c.innerHTML=`
      <button class="av4-back" id="av4Back">← Voltar para condomínios</button>
      ${summary(x)}
      <nav class="av4-tabs">${TABS.map(t=>`<button class="av4-tab ${activeTab===t[0]?'active':''}" data-av4-tab="${t[0]}"><span>${t[1]}</span><b>${t[2]}</b></button>`).join('')}</nav>
      <div id="av4Tab"></div>`;
    qs('#av4Back').onclick=renderList;qsa('[data-av4-tab]').forEach(b=>b.onclick=()=>openCondo(id,b.dataset.av4Tab));renderTab(x);
  }
  function summary(x){
    return `<section class="av4-summary"><div class="av4-main"><span class="eyebrow">EMPREENDIMENTO SELECIONADO</span><h1>${esc(x.name)}</h1><small>Código ${esc(x.code||'não definido')} • CNPJ ${esc(x.cnpj||'não informado')}</small></div>
      <div><span>Construtora</span><b>${esc(x.builder||'Não informada')}</b></div><div><span>Incorporadora</span><b>${esc(x.inc||'Não informada')}</b></div><div><span>Síndico</span><b>${esc(x.sind||'Não informado')}</b><small>${esc(x.sindPhone||'')}</small></div><div><span>Contrato</span><b>${displayDate(x.contractEnd)}</b><small>${esc(x.status||'ATIVO')}</small></div></section>`;
  }

  function renderTab(x){
    const host=qs('#av4Tab');if(!host)return;
    const renderers={visao:overviewTab,dados:dataTab,contrato:contractTab,estrutura:structureTab,arquivos:filesTab,manuais:manualsTab,assistencia:assistanceTab,reservas:reservationsTab,garantias:warrantiesTab,manutencoes:maintenanceTab,comunicacao:communicationTab,acessos:accessTab};
    host.innerHTML=(renderers[activeTab]||overviewTab)(x);wireTab(x);
  }
  function panel(title,desc,body,extra=''){return `<section class="av4-panel"><div class="av4-panel-head"><div><h3>${title}</h3><p>${desc}</p></div>${extra}</div>${body}</section>`;}
  function metric(icon,value,label,sub){return `<article class="av4-metric"><span>${icon}</span><strong>${value}</strong><b>${label}</b><small>${sub}</small></article>`;}
  function overviewTab(x){
    const days=x.contractEnd?Math.ceil((new Date(x.contractEnd+'T12:00:00')-new Date())/86400000):0;
    return `<section class="av4-metrics">${metric('▦',x.units||0,'Unidades',`${x.blocks.length} bloco(s)`) }${metric('◉',x.tickets.filter(t=>t.status!=='ENCERRADO').length,'Chamados abertos','Assistência técnica')}${metric('▣',x.reservations.length,'Reservas','Histórico do empreendimento')}${metric('◒',x.warranties.length,'Garantias','Itens cadastrados')}</section>
      <section class="av4-overview-grid"><article class="av4-panel"><div class="av4-panel-head"><div><h3>Resumo operacional</h3><p>Atalhos para os cadastros que existiam no painel antigo.</p></div></div><div class="av4-quick-grid">${[['dados','▤','Dados do condomínio'],['estrutura','▦','Unidades e blocos'],['arquivos','⌑','Arquivos'],['manuais','▥','Manuais'],['assistencia','◉','Assistência técnica'],['reservas','▣','Agendamentos'],['garantias','◒','Garantias'],['manutencoes','↻','Manutenções']].map(a=>`<button data-go-tab="${a[0]}"><span>${a[1]}</span><b>${a[2]}</b></button>`).join('')}</div></article>
      <article class="av4-panel"><div class="av4-panel-head"><div><h3>Contrato</h3><p>Acompanhamento automático da vigência.</p></div></div><div class="av4-contract-card"><span>Data limite</span><strong>${displayDate(x.contractEnd)}</strong><b class="${days>0&&days<365?'warn':''}">${days>0?`${days} dias restantes`:'Contrato vencido ou sem data'}</b><button data-go-tab="contrato">Revisar contrato →</button></div></article></section>`;
  }
  function dataTab(x){
    return panel('Dados do condomínio','Informações principais destacadas no topo e editáveis aqui.',`<div class="av4-form"><label class="span2">Nome do condomínio<input id="v4-name" value="${esc(x.name)}"></label><label>Código / referência<input id="v4-code" value="${esc(x.code)}"></label><label>CNPJ<input id="v4-cnpj" value="${esc(x.cnpj)}"></label><label class="span2">Construtora<input id="v4-builder" value="${esc(x.builder)}" placeholder="Campo novo no sistema"></label><label class="span2">Incorporadora<input id="v4-inc" value="${esc(x.inc)}"></label><label>Tipologia<select id="v4-type">${['Vertical','Horizontal','Misto','Garden','Vertical + Garden'].map(v=>`<option ${x.type===v?'selected':''}>${v}</option>`).join('')}</select></label><label>Unidades<input id="v4-units" type="number" min="0" value="${esc(x.units)}"></label><label class="span2">Síndico responsável<input id="v4-sind" value="${esc(x.sind)}"></label><label>Telefone do síndico<input id="v4-sind-phone" value="${esc(x.sindPhone)}"></label><label>E-mail do síndico<input id="v4-sind-email" value="${esc(x.sindEmail)}"></label><label>Sistema de Assistência<select id="v4-assistance-system"><option ${x.assistanceSystem==='Sistema IMO'?'selected':''}>Sistema IMO</option><option ${x.assistanceSystem==='Externo'?'selected':''}>Externo</option><option ${x.assistanceSystem==='Não utilizado'?'selected':''}>Não utilizado</option></select></label><label>Limite incorporadora (MB)<input id="v4-upload-limit" type="number" value="${esc(x.uploadLimit)}"></label><label class="span2">Endereço<input id="v4-address" value="${esc(x.address)}"></label><label>Número<input id="v4-number" value="${esc(x.number)}"></label><label>Complemento<input id="v4-complement" value="${esc(x.complement)}"></label><label>Bairro<input id="v4-neighborhood" value="${esc(x.neighborhood)}"></label><label>Cidade<input id="v4-city" value="${esc(x.city)}"></label><label>UF<input id="v4-state" maxlength="2" value="${esc(x.state)}"></label></div><div class="av4-actions"><button class="av4-btn primary" id="v4SaveData">Salvar dados do condomínio</button></div>`);
  }
  function contractTab(x){
    return panel('Contrato','Prazo padrão de 5 anos, com opções 2, 5, 10 e 15 anos. A data limite continua editável.',`<div class="av4-contract-highlight"><div><span>Data de cadastro</span><b>${displayDate(x.registrationDate)}</b></div><div><span>Prazo</span><b>${x.termYears==='custom'?'Personalizado':`${esc(x.termYears)} anos`}</b></div><div><span>Data limite</span><b>${displayDate(x.contractEnd)}</b></div></div><div class="av4-form"><label>Data de cadastro<input id="v4-registration" type="date" value="${esc(x.registrationDate)}"></label><label>Prazo<select id="v4-term"><option value="2" ${x.termYears==='2'?'selected':''}>2 anos</option><option value="5" ${x.termYears==='5'?'selected':''}>5 anos • padrão IMO</option><option value="10" ${x.termYears==='10'?'selected':''}>10 anos</option><option value="15" ${x.termYears==='15'?'selected':''}>15 anos</option><option value="custom" ${x.termYears==='custom'?'selected':''}>Personalizado</option></select></label><label>Data limite do contrato<input id="v4-contract-end" type="date" value="${esc(x.contractEnd)}"></label><label>Status<select id="v4-status"><option ${x.status==='ATIVO'?'selected':''}>ATIVO</option><option ${x.status==='RENOVAÇÃO'?'selected':''}>RENOVAÇÃO</option><option ${x.status==='ENCERRADO'?'selected':''}>ENCERRADO</option></select></label></div><div class="av4-actions"><button class="av4-btn primary" id="v4SaveContract">Salvar contrato</button></div>`);
  }
  function structureTab(x){
    const modules=Object.entries(MODULE_LABELS).map(([id,label])=>`<label class="av4-check"><input type="checkbox" data-v4-module="${id}" ${x.modules.includes(id)?'checked':''}>${label}</label>`).join('');
    const unitTypes=x.unitTypes.map((u,i)=>`<span class="av4-chip">${esc(u)}${u==='TIPO'?'':`<button data-remove-unit="${i}">×</button>`}</span>`).join('');
    const blocks=x.blocks.length?x.blocks.map((b,i)=>`<div class="av4-list-row"><b>${esc(b)}</b><button data-remove-block="${i}">Excluir</button></div>`).join(''):'<p class="av4-empty-note">Nenhum bloco cadastrado.</p>';
    const hab=x.habiteSe.length?x.habiteSe.map((h,i)=>`<div class="av4-list-row"><b>Fase ${i+1}</b><span>${displayDate(h)}</span><button data-remove-hab="${i}">Excluir</button></div>`).join(''):'<p class="av4-empty-note">Nenhuma data de Habite-se cadastrada.</p>';
    return `${panel('Módulos do condomínio','Ative apenas o que o empreendimento utiliza. Manutenção de Unidades não é criada como padrão.',`<div class="av4-modules">${modules}</div><div class="av4-actions"><button class="av4-btn primary" id="v4SaveModules">Salvar módulos</button></div>`)}
      <div class="av4-two-col">${panel('Tipos de unidade','Por padrão existe somente TIPO. Crie Cobertura, Garden, Loja, Duplex etc. quando necessário.',`<div class="av4-chips">${unitTypes}</div><div class="av4-inline"><input id="v4NewUnit" placeholder="Ex.: Cobertura"><button class="av4-btn secondary" id="v4AddUnit">＋ Adicionar</button></div>`)}${panel('Blocos','Cadastre somente a estrutura real do empreendimento.',`${blocks}<div class="av4-inline"><input id="v4NewBlock" placeholder="Ex.: Bloco 1"><button class="av4-btn secondary" id="v4AddBlock">＋ Novo bloco</button></div>`)}</div>
      ${panel('Datas de Habite-se','Mantenha uma ou várias fases de Habite-se vinculadas ao condomínio.',`${hab}<div class="av4-inline small"><input id="v4NewHab" type="date"><button class="av4-btn secondary" id="v4AddHab">＋ Nova data</button></div>`)}`;
  }
  function filesTab(x){
    const saved=x.files.length?x.files.map((f,i)=>`<div class="av4-file-saved"><div><b>${esc(f.name)}</b><small>${esc(f.type||'Outro')}</small></div><span>${displayDate(f.date)}</span><button data-remove-file="${i}">Excluir</button></div>`).join(''):'<p class="av4-empty-note">Nenhum arquivo cadastrado.</p>';
    return panel('Arquivos do empreendimento','O campo Comentário do sistema antigo foi removido. A seleção aceita grandes lotes; no backend real o processamento será feito em fila.',`<div class="av4-upload"><label>Tipo<select id="v4FileType">${FILE_TYPES.map(t=>`<option>${t}</option>`).join('')}</select></label><label class="av4-file-picker">↑ Selecionar arquivos<input id="v4MultiFiles" type="file" multiple hidden></label><label class="av4-check compact"><input id="v4ReadOnly" type="checkbox">Somente leitura</label></div><div id="v4Queue" class="av4-queue"><p class="av4-empty-note">Nenhum arquivo selecionado. Pode selecionar 30, 50 ou mais arquivos.</p></div><div class="av4-actions"><button class="av4-btn primary" id="v4SaveFiles" disabled>Adicionar arquivos</button></div><div class="av4-section-title">Arquivos cadastrados</div>${saved}`);
  }
  function manualsTab(x){
    const rows=x.customManuals.length?x.customManuals.map((m,i)=>`<div class="av4-list-row"><div><b>${esc(m.name||m)}</b><small>Manual personalizado</small></div><button data-remove-manual="${i}">Excluir</button></div>`).join(''):'<p class="av4-empty-note">Nenhum manual personalizado. Eles só aparecem quando forem criados.</p>';
    return panel('Manuais','Manual do Proprietário e Manual do Síndico podem vir da migração. Manuais personalizados só aparecem se existirem.',`<div class="av4-info-strip"><span>▥</span><div><b>Manuais padrão</b><small>Os registros existentes serão puxados do banco legado durante a migração.</small></div></div>${rows}<div class="av4-inline"><input id="v4ManualName" placeholder="Nome do novo manual personalizado"><button class="av4-btn secondary" id="v4AddManual">＋ Novo manual</button></div>`);
  }
  function assistanceTab(x){
    const rows=x.tickets.length?x.tickets.map(t=>`<div class="av4-record"><div><span>#${esc(t.protocol)}</span><b>${esc(t.subject)}</b><small>${esc(t.unit||'Sem unidade')} • ${displayDate(t.date)}</small></div><span class="status ${t.status==='ABERTO'?'yellow':'green'}">${esc(t.status)}</span></div>`).join(''):'<p class="av4-empty-note">Nenhum chamado nesta demonstração. Na migração entra o histórico existente.</p>';
    return panel('Assistência Técnica','Chamados e histórico serão migrados do sistema atual mantendo vínculos com condomínio, unidade e morador.',`${rows}<div class="av4-create-row"><input id="v4TicketSubject" placeholder="Assunto do chamado"><input id="v4TicketUnit" placeholder="Unidade"><button class="av4-btn primary" id="v4AddTicket">＋ Abrir chamado</button></div>`);
  }
  function reservationsTab(x){
    const rows=x.reservations.length?x.reservations.map(r=>`<div class="av4-record"><div><b>${esc(r.space)}</b><small>${esc(r.unit||'Sem unidade')} • ${displayDate(r.date)} às ${esc(r.time)}</small></div><span class="status green">${esc(r.status)}</span></div>`).join(''):'<p class="av4-empty-note">Nenhuma reserva nesta demonstração. O histórico atual será migrado.</p>';
    return panel('Agendamento de Espaços','Reservas futuras e históricas devem permanecer disponíveis depois da migração.',`${rows}<div class="av4-create-row four"><input id="v4ResSpace" placeholder="Espaço"><input id="v4ResUnit" placeholder="Unidade"><input id="v4ResDate" type="date"><input id="v4ResTime" type="time"><button class="av4-btn primary" id="v4AddReservation">＋ Reservar</button></div>`);
  }
  function warrantiesTab(x){
    const rows=x.warranties.length?x.warranties.map(w=>`<div class="av4-record"><div><b>${esc(w.item)}</b><small>${esc(w.category)} • vence ${displayDate(w.end)}</small></div><span class="status green">${esc(w.status)}</span></div>`).join(''):'<p class="av4-empty-note">Nenhuma garantia nesta demonstração. As garantias existentes serão importadas.</p>';
    return panel('Gestão das Garantias','Cadastro e consulta de garantias vinculadas ao empreendimento.',`${rows}<div class="av4-create-row four"><input id="v4WarItem" placeholder="Item"><input id="v4WarCategory" placeholder="Categoria"><input id="v4WarEnd" type="date"><button class="av4-btn primary" id="v4AddWarranty">＋ Adicionar garantia</button></div>`);
  }
  function maintenanceTab(x){
    const rows=x.maintenancePlans.length?x.maintenancePlans.map(m=>`<div class="av4-record"><div><b>${esc(m.name)}</b><small>Periodicidade: ${esc(m.frequency)}</small></div><span class="status green">ATIVO</span></div>`).join(''):'<p class="av4-empty-note">Nenhum plano cadastrado nesta demonstração.</p>';
    return panel('Manutenções do condomínio','Função administrativa. A manutenção de unidade não aparece como módulo padrão do morador.',`<label class="av4-toggle"><input id="v4MaintenanceEmail" type="checkbox" ${x.maintenanceEmail?'checked':''}><span></span><b>Enviar e-mail do plano de manutenção</b></label>${rows}<div class="av4-create-row"><input id="v4MaintName" placeholder="Plano / rotina"><select id="v4MaintFrequency"><option>Mensal</option><option>Trimestral</option><option>Semestral</option><option>Anual</option></select><button class="av4-btn primary" id="v4AddMaintenance">＋ Adicionar rotina</button></div>`);
  }
  function communicationTab(x){
    const notices=x.notices.length?x.notices.map(n=>`<div class="av4-record"><div><b>${esc(n.title)}</b><small>Aviso • ${displayDate(n.date)}</small></div></div>`).join(''):'<p class="av4-empty-note">Nenhum aviso nesta demonstração.</p>';
    const occ=x.occurrences.length?x.occurrences.map(o=>`<div class="av4-record"><div><b>${esc(o.title)}</b><small>Ocorrência • ${displayDate(o.date)}</small></div></div>`).join(''):'<p class="av4-empty-note">Nenhuma ocorrência nesta demonstração.</p>';
    return `<div class="av4-two-col">${panel('Quadro de Avisos','Avisos do condomínio e histórico.',`${notices}<div class="av4-inline"><input id="v4NoticeTitle" placeholder="Novo aviso"><button class="av4-btn secondary" id="v4AddNotice">＋ Publicar</button></div>`)}${panel('Livro de Ocorrências','Ocorrências vinculadas ao empreendimento.',`${occ}<div class="av4-inline"><input id="v4OccTitle" placeholder="Nova ocorrência"><button class="av4-btn secondary" id="v4AddOccurrence">＋ Registrar</button></div>`)}</div>`;
  }
  function accessTab(x){
    return panel('Acessar como','Visualização supervisionada para suporte e conferência do empreendimento.',`<div class="av4-access-grid"><article><span>◆</span><div><b>Incorporadora</b><small>${esc(x.inc||'Não vinculada')}</small></div><button class="av4-btn primary" id="v4AsInc">Entrar</button></article><article><span>▣</span><div><b>Síndico</b><small>${esc(x.sind||'Não vinculado')}</small></div><button class="av4-btn primary" id="v4AsSind">Entrar</button></article></div>`);
  }

  function wireTab(x){
    qsa('[data-go-tab]').forEach(b=>b.onclick=()=>openCondo(x.id,b.dataset.goTab));
    if(activeTab==='dados')qs('#v4SaveData').onclick=()=>{updateSelected(y=>Object.assign(y,{name:val('v4-name'),code:val('v4-code'),cnpj:val('v4-cnpj'),builder:val('v4-builder'),inc:val('v4-inc'),type:val('v4-type'),units:Number(val('v4-units')||0),sind:val('v4-sind'),sindPhone:val('v4-sind-phone'),sindEmail:val('v4-sind-email'),assistanceSystem:val('v4-assistance-system'),uploadLimit:Number(val('v4-upload-limit')||300),address:val('v4-address'),number:val('v4-number'),complement:val('v4-complement'),neighborhood:val('v4-neighborhood'),city:val('v4-city'),state:val('v4-state').toUpperCase()}));toastMsg('Dados do condomínio salvos.');openCondo(x.id,'dados');};
    if(activeTab==='contrato'){
      const reg=qs('#v4-registration'),term=qs('#v4-term'),end=qs('#v4-contract-end');const auto=()=>{if(term.value!=='custom')end.value=addYearsMinusDay(reg.value,term.value);};reg.onchange=auto;term.onchange=auto;
      qs('#v4SaveContract').onclick=()=>{updateSelected(y=>{y.registrationDate=reg.value;y.termYears=term.value;y.contractEnd=end.value;y.status=val('v4-status');});toastMsg('Contrato atualizado.');openCondo(x.id,'contrato');};
    }
    if(activeTab==='estrutura'){
      qs('#v4SaveModules').onclick=()=>{updateSelected(y=>y.modules=qsa('[data-v4-module]:checked').map(i=>i.dataset.v4Module));toastMsg('Módulos atualizados.');openCondo(x.id,'estrutura');};
      qs('#v4AddUnit').onclick=()=>{const v=val('v4NewUnit').trim();if(!v)return;updateSelected(y=>{if(!y.unitTypes.some(u=>u.toLowerCase()===v.toLowerCase()))y.unitTypes.push(v);});openCondo(x.id,'estrutura');};
      qsa('[data-remove-unit]').forEach(b=>b.onclick=()=>{updateSelected(y=>{y.unitTypes.splice(Number(b.dataset.removeUnit),1);if(!y.unitTypes.includes('TIPO'))y.unitTypes.unshift('TIPO');});openCondo(x.id,'estrutura');});
      qs('#v4AddBlock').onclick=()=>{const v=val('v4NewBlock').trim();if(!v)return;updateSelected(y=>y.blocks.push(v));openCondo(x.id,'estrutura');};
      qsa('[data-remove-block]').forEach(b=>b.onclick=()=>{updateSelected(y=>y.blocks.splice(Number(b.dataset.removeBlock),1));openCondo(x.id,'estrutura');});
      qs('#v4AddHab').onclick=()=>{const v=val('v4NewHab');if(!v)return;updateSelected(y=>y.habiteSe.push(v));openCondo(x.id,'estrutura');};
      qsa('[data-remove-hab]').forEach(b=>b.onclick=()=>{updateSelected(y=>y.habiteSe.splice(Number(b.dataset.removeHab),1));openCondo(x.id,'estrutura');});
    }
    if(activeTab==='arquivos'){
      qs('#v4MultiFiles').onchange=e=>{uploadQueue=[...e.target.files];drawQueue();};
      qs('#v4SaveFiles').onclick=()=>{const type=val('v4FileType'),readOnly=qs('#v4ReadOnly').checked;const count=uploadQueue.length;updateSelected(y=>uploadQueue.forEach(f=>y.files.push({name:f.name,type,date:today(),readOnly,size:f.size})));uploadQueue=[];toastMsg(`${count} arquivo(s) adicionados.`);openCondo(x.id,'arquivos');};
      qsa('[data-remove-file]').forEach(b=>b.onclick=()=>{updateSelected(y=>y.files.splice(Number(b.dataset.removeFile),1));openCondo(x.id,'arquivos');});
    }
    if(activeTab==='manuais'){
      qs('#v4AddManual').onclick=()=>{const v=val('v4ManualName').trim();if(!v)return;updateSelected(y=>y.customManuals.push({name:v,date:today()}));openCondo(x.id,'manuais');};
      qsa('[data-remove-manual]').forEach(b=>b.onclick=()=>{updateSelected(y=>y.customManuals.splice(Number(b.dataset.removeManual),1));openCondo(x.id,'manuais');});
    }
    if(activeTab==='assistencia')qs('#v4AddTicket').onclick=()=>{const subject=val('v4TicketSubject').trim();if(!subject)return;updateSelected(y=>y.tickets.unshift({protocol:String(Date.now()).slice(-6),subject,unit:val('v4TicketUnit'),date:today(),status:'ABERTO'}));openCondo(x.id,'assistencia');};
    if(activeTab==='reservas')qs('#v4AddReservation').onclick=()=>{const space=val('v4ResSpace').trim(),date=val('v4ResDate');if(!space||!date)return;updateSelected(y=>y.reservations.unshift({space,unit:val('v4ResUnit'),date,time:val('v4ResTime')||'00:00',status:'CONFIRMADA'}));openCondo(x.id,'reservas');};
    if(activeTab==='garantias')qs('#v4AddWarranty').onclick=()=>{const item=val('v4WarItem').trim();if(!item)return;updateSelected(y=>y.warranties.unshift({item,category:val('v4WarCategory'),end:val('v4WarEnd'),status:'VIGENTE'}));openCondo(x.id,'garantias');};
    if(activeTab==='manutencoes'){
      qs('#v4MaintenanceEmail').onchange=e=>{updateSelected(y=>y.maintenanceEmail=e.target.checked);toastMsg('Preferência de envio atualizada.');};
      qs('#v4AddMaintenance').onclick=()=>{const name=val('v4MaintName').trim();if(!name)return;updateSelected(y=>y.maintenancePlans.unshift({name,frequency:val('v4MaintFrequency')}));openCondo(x.id,'manutencoes');};
    }
    if(activeTab==='comunicacao'){
      qs('#v4AddNotice').onclick=()=>{const title=val('v4NoticeTitle').trim();if(!title)return;updateSelected(y=>y.notices.unshift({title,date:today()}));openCondo(x.id,'comunicacao');};
      qs('#v4AddOccurrence').onclick=()=>{const title=val('v4OccTitle').trim();if(!title)return;updateSelected(y=>y.occurrences.unshift({title,date:today()}));openCondo(x.id,'comunicacao');};
    }
    if(activeTab==='acessos'){
      qs('#v4AsInc').onclick=()=>window.impersonate?.('incorporadora',x.name);qs('#v4AsSind').onclick=()=>window.impersonate?.('sindico',x.name);
    }
  }
  function val(id){return qs(`#${id}`)?.value??'';}
  function drawQueue(){
    const q=qs('#v4Queue'),btn=qs('#v4SaveFiles');if(!q||!btn)return;btn.disabled=!uploadQueue.length;
    q.innerHTML=uploadQueue.length?uploadQueue.map((f,i)=>`<div class="av4-queue-row"><div><b>${esc(f.name)}</b><small>${(f.size/1024/1024).toFixed(2)} MB</small></div><span>Pronto</span><button data-queue-remove="${i}">×</button></div>`).join(''):'<p class="av4-empty-note">Nenhum arquivo selecionado.</p>';
    qsa('[data-queue-remove]').forEach(b=>b.onclick=()=>{uploadQueue.splice(Number(b.dataset.queueRemove),1);drawQueue();});
  }

  const previousOpen=window.openPage;
  function v4Open(page){if(isAdmin()&&page==='condominios'){renderList();return;}return typeof previousOpen==='function'?previousOpen(page):undefined;}
  window.openPage=v4Open;try{openPage=v4Open;}catch(e){}
  document.addEventListener('click',e=>{if(!isAdmin())return;const nav=e.target.closest('#navMenu .nav-item[data-page="condominios"]');if(nav){e.preventDefault();e.stopImmediatePropagation();renderList();}},true);
  window.renderAdminCondosV4=renderList;
})();