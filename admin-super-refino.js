/* IMO — Super Admin: workspace funcional de condomínios conforme estudo do cliente */
(function(){
  if(window.__IMO_ADMIN_SUPER_REFINO__) return;
  window.__IMO_ADMIN_SUPER_REFINO__=true;

  const STORAGE='imo_admin_condos_v3';
  const MODULES=[
    ['furacao','Plantas de furação'],['dwg','Plantas de Furação (DWG)'],['videos','Vídeos'],
    ['assistencia','Assistência Técnica'],['garantias','Gestão das Garantias'],['reformas','Planos de Reforma'],
    ['reservas','Agendamento de Espaços'],['ocorrencias','Livro de Ocorrências'],['avisos','Quadro de Avisos'],['databook','Databook']
  ];
  const defaultData=[
    {id:'noon',code:'2026001',name:'Residencial Noon',cnpj:'11.111.111/1111-11',type:'Vertical',builder:'Construtora Horizonte',inc:'Alfa Realty',sind:'Ronaldo Oliveira',sindPhone:'(11) 99999-1001',sindEmail:'ronaldo@noon.com.br',units:128,registrationDate:'2024-03-01',termYears:'5',contractEnd:'2029-02-28',status:'ATIVO',modules:['furacao','dwg','videos','assistencia','garantias','reformas','reservas','ocorrencias','avisos','databook'],unitTypes:['TIPO'],files:[{name:'Manual do Proprietário.pdf',type:'Manual do Proprietário',date:'2026-08-19'}]},
    {id:'vila',code:'2023001',name:'Reserva Vila Mariana',cnpj:'22.222.222/2222-22',type:'Vertical + Garden',builder:'Matriz Engenharia',inc:'Urban Incorporadora',sind:'Ana Martins',sindPhone:'(11) 98888-2020',sindEmail:'ana@reservavila.com.br',units:216,registrationDate:'2023-08-15',termYears:'5',contractEnd:'2028-08-14',status:'ATIVO',modules:['furacao','dwg','videos','assistencia','garantias','reformas','reservas','ocorrencias','avisos','databook'],unitTypes:['TIPO','Garden'],files:[]},
    {id:'villas',code:'2025001',name:'Villas do Lago',cnpj:'33.333.333/3333-33',type:'Horizontal',builder:'Lago Construções',inc:'Horizonte Desenvolvimento',sind:'Paulo Mendes',sindPhone:'(11) 97777-3030',sindEmail:'paulo@villasdolago.com.br',units:84,registrationDate:'2025-01-01',termYears:'5',contractEnd:'2029-12-31',status:'ATIVO',modules:['furacao','videos','assistencia','garantias','reformas','reservas','ocorrencias','avisos'],unitTypes:['TIPO','Casa'],files:[]},
    {id:'arau',code:'2022004',name:'Parque das Araucárias',cnpj:'44.444.444/4444-44',type:'Misto',builder:'Araucária Engenharia',inc:'Alfa Realty',sind:'Carla Souza',sindPhone:'(11) 96666-4040',sindEmail:'carla@arau.com.br',units:176,registrationDate:'2022-11-10',termYears:'5',contractEnd:'2027-11-09',status:'RENOVAÇÃO',modules:['furacao','dwg','videos','assistencia','garantias','reformas','reservas','ocorrencias','avisos','databook'],unitTypes:['TIPO','Garden'],files:[]}
  ];

  let condos=load();
  let selectedId=null;
  let activeTab='dados';
  let uploadQueue=[];

  function isAdmin(){try{return currentUser==='admin';}catch(e){return false;}}
  function C(){return document.getElementById('content');}
  function load(){try{const x=JSON.parse(localStorage.getItem(STORAGE)||'null');return Array.isArray(x)&&x.length?x:structuredClone(defaultData);}catch(e){return JSON.parse(JSON.stringify(defaultData));}}
  function persist(){try{localStorage.setItem(STORAGE,JSON.stringify(condos));return true;}catch(e){return false;}}
  function esc(v=''){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
  function toastMsg(msg){if(typeof toast==='function')toast(msg);}
  function selected(){return condos.find(x=>x.id===selectedId);}
  function prepare(label='Condomínios'){
    try{currentPage='condominios';}catch(e){}
    document.querySelectorAll('#navMenu .nav-item[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page==='condominios'));
    document.getElementById('sidebar')?.classList.remove('open');
    const title=document.getElementById('pageTitle');const crumb=document.getElementById('breadcrumb');
    if(title)title.textContent=label;if(crumb)crumb.textContent=`IMO / Super Admin / ${label}`;
  }
  function addYearsMinusDay(dateStr,years){
    if(!dateStr||!years||years==='custom')return '';
    const d=new Date(dateStr+'T12:00:00');if(Number.isNaN(d.getTime()))return '';
    d.setFullYear(d.getFullYear()+Number(years));d.setDate(d.getDate()-1);
    return d.toISOString().slice(0,10);
  }
  function displayDate(v){if(!v)return '—';const [y,m,d]=v.split('-');return y&&m&&d?`${d}/${m}/${y}`:v;}

  function renderList(){
    if(!isAdmin())return;selectedId=null;prepare('Condomínios');
    const c=C();if(!c)return;c.className='admin-condos-v3';
    c.innerHTML=`
      <section class="ac-hero"><div><span class="eyebrow">ADMINISTRAÇÃO DE CONDOMÍNIOS</span><h1>Condomínios</h1><p>Pesquisa rápida, ordenamento e acesso ao workspace completo de cada empreendimento.</p></div><button class="action-btn primary" id="acNew">＋ Cadastrar condomínio</button></section>
      <section class="ac-toolbar"><input id="acSearch" class="ac-search" placeholder="Buscar por código, condomínio, CNPJ, construtora, incorporadora ou síndico"><select id="acSort" class="ac-sort"><option value="name">Ordenar: Condomínio A–Z</option><option value="code">Código</option><option value="builder">Construtora</option><option value="inc">Incorporadora</option><option value="contractEnd">Data limite do contrato</option></select><div class="ac-count" id="acCount"></div></section>
      <section class="ac-table-card"><div style="overflow:auto"><table class="ac-table"><thead><tr><th>Código</th><th>Condomínio</th><th>Construtora</th><th>Incorporadora</th><th>Síndico</th><th>Unidades</th><th>Contrato</th><th>Status</th><th></th></tr></thead><tbody id="acBody"></tbody></table></div></section>`;
    document.getElementById('acSearch').addEventListener('input',drawRows);
    document.getElementById('acSort').addEventListener('change',drawRows);
    document.getElementById('acNew').onclick=createNew;
    drawRows();
  }

  function drawRows(){
    const body=document.getElementById('acBody');if(!body)return;
    const q=(document.getElementById('acSearch')?.value||'').trim().toLowerCase();
    const sort=document.getElementById('acSort')?.value||'name';
    const filtered=condos.filter(x=>[x.code,x.name,x.cnpj,x.builder,x.inc,x.sind].join(' ').toLowerCase().includes(q)).sort((a,b)=>String(a[sort]||'').localeCompare(String(b[sort]||''),'pt-BR',{numeric:true}));
    document.getElementById('acCount').textContent=`${filtered.length} empreendimento${filtered.length===1?'':'s'}`;
    body.innerHTML=filtered.length?filtered.map(x=>`<tr data-condo="${x.id}"><td><b>${esc(x.code)}</b></td><td><b>${esc(x.name)}</b><span class="ac-sub">${esc(x.cnpj)}</span></td><td>${esc(x.builder||'—')}</td><td>${esc(x.inc||'—')}</td><td>${esc(x.sind||'—')}<span class="ac-sub">${esc(x.sindPhone||'')}</span></td><td>${esc(x.units)}</td><td><b>${displayDate(x.contractEnd)}</b><span class="ac-sub">${esc(x.termYears)} anos</span></td><td><span class="status ${x.status==='ATIVO'?'green':'yellow'}">${esc(x.status)}</span></td><td><button class="ac-open">Abrir →</button></td></tr>`).join(''):`<tr><td colspan="9" class="ac-empty">Nenhum condomínio encontrado.</td></tr>`;
    body.querySelectorAll('[data-condo]').forEach(row=>row.onclick=()=>openCondo(row.dataset.condo,'dados'));
  }

  function createNew(){
    const id='novo-'+Date.now();
    condos.unshift({id,code:'',name:'Novo condomínio',cnpj:'',type:'Vertical',builder:'',inc:'',sind:'',sindPhone:'',sindEmail:'',units:0,registrationDate:new Date().toISOString().slice(0,10),termYears:'5',contractEnd:addYearsMinusDay(new Date().toISOString().slice(0,10),'5'),status:'ATIVO',modules:MODULES.map(x=>x[0]),unitTypes:['TIPO'],files:[]});
    persist();openCondo(id,'dados');
  }

  function openCondo(id,tab='dados'){
    if(!isAdmin())return;selectedId=id;activeTab=tab;uploadQueue=[];prepare('Condomínios');
    const x=selected();if(!x){renderList();return;}
    const c=C();c.className='admin-condos-v3';
    c.innerHTML=`
      <button class="ac-back" id="acBack">← Voltar para condomínios</button>
      <section class="ac-summary"><div class="ac-summary-main"><span class="eyebrow">EMPREENDIMENTO SELECIONADO</span><h1>${esc(x.name)}</h1><small>Código ${esc(x.code||'não definido')} • CNPJ ${esc(x.cnpj||'não informado')}</small></div><div class="ac-summary-stat"><span>Construtora</span><b>${esc(x.builder||'Não informada')}</b></div><div class="ac-summary-stat"><span>Incorporadora</span><b>${esc(x.inc||'Não informada')}</b></div><div class="ac-summary-stat"><span>Síndico</span><b>${esc(x.sind||'Não informado')}<br><small>${esc(x.sindPhone||'')}</small></b></div><div class="ac-summary-stat"><span>Contrato</span><b>${displayDate(x.contractEnd)}<br><span class="status ${x.status==='ATIVO'?'green':'yellow'}">${esc(x.status)}</span></b></div></section>
      <nav class="ac-tabs">${[['dados','Dados do condomínio'],['contrato','Contrato'],['modulos','Módulos & unidades'],['arquivos','Arquivos'],['acessos','Acessar como']].map(t=>`<button class="ac-tab ${activeTab===t[0]?'active':''}" data-tab="${t[0]}">${t[1]}</button>`).join('')}</nav>
      <div id="acTabContent"></div>`;
    document.getElementById('acBack').onclick=renderList;
    c.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>openCondo(id,b.dataset.tab));
    renderTab();
  }

  function renderTab(){
    const x=selected();const host=document.getElementById('acTabContent');if(!x||!host)return;
    if(activeTab==='dados') host.innerHTML=dataTab(x);
    if(activeTab==='contrato') host.innerHTML=contractTab(x);
    if(activeTab==='modulos') host.innerHTML=modulesTab(x);
    if(activeTab==='arquivos') host.innerHTML=filesTab(x);
    if(activeTab==='acessos') host.innerHTML=accessTab(x);
    wireTab();
  }

  function dataTab(x){return `<section class="ac-panel"><div class="ac-panel-head"><div><h3>Dados do condomínio</h3><p>Os dados principais ficam no topo e podem ser atualizados aqui.</p></div></div><div class="ac-form"><label class="span2">Nome do condomínio<input id="f-name" value="${esc(x.name)}"></label><label>Código / ID de referência<input id="f-code" value="${esc(x.code)}"></label><label>CNPJ<input id="f-cnpj" value="${esc(x.cnpj)}"></label><label class="span2">Construtora<input id="f-builder" value="${esc(x.builder)}" placeholder="Nome da construtora"></label><label class="span2">Incorporadora<input id="f-inc" value="${esc(x.inc)}" placeholder="Nome da incorporadora"></label><label>Tipologia<select id="f-type">${['Vertical','Horizontal','Misto','Garden','Vertical + Garden'].map(v=>`<option ${x.type===v?'selected':''}>${v}</option>`).join('')}</select></label><label>Unidades<input id="f-units" type="number" min="0" value="${esc(x.units)}"></label><label class="span2">Síndico responsável<input id="f-sind" value="${esc(x.sind)}"></label><label>Telefone do síndico<input id="f-sindPhone" value="${esc(x.sindPhone)}"></label><label>E-mail do síndico<input id="f-sindEmail" value="${esc(x.sindEmail)}"></label></div><div class="ac-save-row"><button class="ac-btn primary" id="saveData">Salvar dados do condomínio</button></div></section>`;}

  function contractTab(x){return `<section class="ac-panel"><div class="ac-panel-head"><div><h3>Contrato</h3><p>Data de cadastro + prazo padrão calculam automaticamente a data limite. A data limite continua editável.</p></div></div><div class="ac-contract-highlight"><div><span>Data de cadastro</span><b>${displayDate(x.registrationDate)}</b></div><div><span>Prazo selecionado</span><b>${esc(x.termYears)} ${x.termYears==='custom'?'personalizado':'anos'}</b></div><div><span>Data limite do contrato</span><b>${displayDate(x.contractEnd)}</b></div></div><div class="ac-form"><label>Data de cadastro<input id="f-registration" type="date" value="${esc(x.registrationDate)}"></label><label>Prazo do contrato<select id="f-term"><option value="2" ${x.termYears==='2'?'selected':''}>2 anos</option><option value="5" ${x.termYears==='5'?'selected':''}>5 anos • padrão IMO</option><option value="10" ${x.termYears==='10'?'selected':''}>10 anos</option><option value="15" ${x.termYears==='15'?'selected':''}>15 anos</option><option value="custom" ${x.termYears==='custom'?'selected':''}>Personalizado</option></select></label><label>Data limite do contrato<input id="f-contractEnd" type="date" value="${esc(x.contractEnd)}"></label><label>Status<select id="f-status"><option ${x.status==='ATIVO'?'selected':''}>ATIVO</option><option ${x.status==='RENOVAÇÃO'?'selected':''}>RENOVAÇÃO</option><option ${x.status==='ENCERRADO'?'selected':''}>ENCERRADO</option></select></label></div><div class="ac-save-row"><button class="ac-btn primary" id="saveContract">Salvar contrato</button></div></section>`;}

  function modulesTab(x){return `<section class="ac-panel"><div class="ac-panel-head"><div><h3>Módulos do condomínio</h3><p>Ative somente as ferramentas utilizadas. “Manutenção de Unidades” não nasce mais como módulo padrão.</p></div></div><div class="ac-modules">${MODULES.map(m=>`<label class="ac-check"><input type="checkbox" data-module="${m[0]}" ${x.modules.includes(m[0])?'checked':''}> ${m[1]}</label>`).join('')}</div><div class="ac-panel-head" style="margin-top:22px"><div><h3>Tipos de unidade</h3><p>Por padrão existe apenas <b>TIPO</b>. Cobertura, Garden, Loja, Duplex etc. aparecem somente quando forem criados.</p></div></div><div class="ac-unit-types" id="unitTypes">${x.unitTypes.map((u,i)=>`<span class="ac-unit-chip">${esc(u)}${u==='TIPO'?'':`<button data-remove-type="${i}">×</button>`}</span>`).join('')}</div><div class="ac-add-type"><input id="newUnitType" placeholder="Ex.: Cobertura, Garden, Loja"><button class="ac-btn secondary" id="addUnitType">＋ Adicionar tipo</button></div><div class="ac-save-row"><button class="ac-btn primary" id="saveModules">Salvar módulos e unidades</button></div></section>`;}

  function filesTab(x){return `<section class="ac-panel"><div class="ac-panel-head"><div><h3>Arquivos do empreendimento</h3><p>Upload múltiplo sem o antigo campo “Comentário” e sem limite artificial de 20 arquivos por seleção.</p></div></div><div class="ac-upload"><div class="ac-upload-row"><label>Tipo de arquivo<select id="fileType"><option>Planta de furação</option><option>Planta de Furação (DWG)</option><option>Manual do Proprietário</option><option>Manual do Síndico</option><option>Databook</option><option>Garantia</option><option>Outro</option></select></label><label class="ac-file-label">↑ Selecionar arquivos<input id="multiFiles" type="file" multiple hidden></label><label class="ac-check" style="height:42px;box-sizing:border-box"><input id="readOnly" type="checkbox"> Somente leitura</label></div><div class="ac-file-queue" id="fileQueue"><span class="ac-sub">Nenhum arquivo selecionado. Você pode selecionar 30, 50 ou mais arquivos de uma vez; o processamento real será feito em fila no backend.</span></div><div class="ac-save-row"><button class="ac-btn primary" id="saveFiles" disabled>Adicionar arquivos</button></div></div><div class="ac-file-list"><h4>Arquivos cadastrados</h4>${(x.files||[]).length?(x.files||[]).map(f=>`<div class="ac-file-saved"><b>${esc(f.name)}</b><span>${esc(f.type)}</span><span>${displayDate(f.date)}</span></div>`).join(''):'<div class="ac-sub">Nenhum arquivo cadastrado nesta demonstração.</div>'}</div></section>`;}

  function accessTab(x){return `<section class="ac-panel"><div class="ac-panel-head"><div><h3>Acessar como</h3><p>Visualização supervisionada do empreendimento para suporte e conferência.</p></div></div><div class="ac-access-grid"><div class="ac-access-card"><b>Visualizar como Incorporadora</b><span>${esc(x.inc||'Incorporadora vinculada')}</span><button class="ac-btn primary" id="asInc">Entrar como incorporadora</button></div><div class="ac-access-card"><b>Visualizar como Síndico</b><span>${esc(x.sind||'Síndico vinculado')}</span><button class="ac-btn primary" id="asSind">Entrar como síndico</button></div></div></section>`;}

  function wireTab(){
    const x=selected();if(!x)return;
    if(activeTab==='dados') document.getElementById('saveData').onclick=()=>{
      Object.assign(x,{name:val('f-name'),code:val('f-code'),cnpj:val('f-cnpj'),builder:val('f-builder'),inc:val('f-inc'),type:val('f-type'),units:Number(val('f-units')||0),sind:val('f-sind'),sindPhone:val('f-sindPhone'),sindEmail:val('f-sindEmail')});persist();toastMsg('Dados do condomínio salvos.');openCondo(x.id,'dados');
    };
    if(activeTab==='contrato'){
      const reg=document.getElementById('f-registration'),term=document.getElementById('f-term'),end=document.getElementById('f-contractEnd');
      const auto=()=>{if(term.value!=='custom')end.value=addYearsMinusDay(reg.value,term.value);};reg.onchange=auto;term.onchange=auto;
      document.getElementById('saveContract').onclick=()=>{x.registrationDate=reg.value;x.termYears=term.value;x.contractEnd=end.value;x.status=val('f-status');persist();toastMsg('Contrato atualizado.');openCondo(x.id,'contrato');};
    }
    if(activeTab==='modulos'){
      document.getElementById('addUnitType').onclick=()=>{const input=document.getElementById('newUnitType');const v=input.value.trim();if(!v)return;if(!x.unitTypes.some(u=>u.toLowerCase()===v.toLowerCase()))x.unitTypes.push(v);persist();openCondo(x.id,'modulos');};
      document.querySelectorAll('[data-remove-type]').forEach(b=>b.onclick=()=>{x.unitTypes.splice(Number(b.dataset.removeType),1);if(!x.unitTypes.includes('TIPO'))x.unitTypes.unshift('TIPO');persist();openCondo(x.id,'modulos');});
      document.getElementById('saveModules').onclick=()=>{x.modules=[...document.querySelectorAll('[data-module]:checked')].map(i=>i.dataset.module);persist();toastMsg('Módulos e tipos de unidade atualizados.');openCondo(x.id,'modulos');};
    }
    if(activeTab==='arquivos'){
      const input=document.getElementById('multiFiles');input.onchange=()=>{uploadQueue=[...input.files];drawQueue();};
      document.getElementById('saveFiles').onclick=()=>{const type=val('fileType');const today=new Date().toISOString().slice(0,10);x.files=x.files||[];uploadQueue.forEach(f=>x.files.push({name:f.name,type,date:today,readOnly:document.getElementById('readOnly').checked,size:f.size}));persist();toastMsg(`${uploadQueue.length} arquivo(s) adicionado(s) à demonstração.`);uploadQueue=[];openCondo(x.id,'arquivos');};
    }
    if(activeTab==='acessos'){
      document.getElementById('asInc').onclick=()=>window.impersonate?.('incorporadora',x.name);
      document.getElementById('asSind').onclick=()=>window.impersonate?.('sindico',x.name);
    }
  }
  function val(id){return document.getElementById(id)?.value??'';}
  function drawQueue(){
    const q=document.getElementById('fileQueue'),save=document.getElementById('saveFiles');if(!q||!save)return;
    save.disabled=!uploadQueue.length;
    q.innerHTML=uploadQueue.length?uploadQueue.map((f,i)=>`<div class="ac-file-row"><span><b>${esc(f.name)}</b></span><em>${(f.size/1024/1024).toFixed(2)} MB</em><small>Pronto</small><button data-qremove="${i}">×</button></div>`).join(''):'<span class="ac-sub">Nenhum arquivo selecionado.</span>';
    q.querySelectorAll('[data-qremove]').forEach(b=>b.onclick=()=>{uploadQueue.splice(Number(b.dataset.qremove),1);drawQueue();});
  }

  const previousOpen=window.openPage;
  function refinedOpen(page){
    if(isAdmin()&&page==='condominios'){renderList();return;}
    return typeof previousOpen==='function'?previousOpen(page):undefined;
  }
  window.openPage=refinedOpen;try{openPage=refinedOpen;}catch(e){}
  document.addEventListener('click',e=>{
    if(!isAdmin())return;
    const nav=e.target.closest('#navMenu .nav-item[data-page="condominios"]');
    if(nav){e.preventDefault();e.stopImmediatePropagation();renderList();}
  },true);
  window.renderAdminCondosRefined=renderList;
})();