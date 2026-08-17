/* IMO — estabilidade final da navegação do Super Admin */
(function(){
  if(window.__IMO_ADMIN_NAV_FIX__) return;
  window.__IMO_ADMIN_NAV_FIX__=true;

  const stableAdminNav=[
    ['OPERAÇÃO',[
      ['dashboard','⌂','Centro de Operações'],
      ['condominios','▣','Condomínios'],
      ['contratos','◇','Contratos'],
      ['incorporadoras','◆','Incorporadoras'],
      ['atendimento','◉','Central de atendimento']
    ]],
    ['CONTEÚDO IMO',[
      ['manuais','▤','Manuais do Proprietário'],
      ['garantias','◒','Garantias'],
      ['rotinas','↻','Planos de manutenção'],
      ['documentos','⌑','Plantas & Databook']
    ]],
    ['PLATAFORMA',[
      ['usuarios','◎','Usuários & acessos'],
      ['configuracoes','⚙','Configurações']
    ]]
  ];

  const condos=[
    {name:'Residencial Noon',type:'Vertical',inc:'Alfa Realty',sind:'Ronaldo Oliveira',units:128,contract:'01/03/2024 → 28/02/2029',status:'ATIVO'},
    {name:'Reserva Vila Mariana',type:'Vertical + Garden',inc:'Urban Incorporadora',sind:'Ana Martins',units:216,contract:'15/08/2023 → 14/08/2028',status:'ATIVO'},
    {name:'Villas do Lago',type:'Casas',inc:'Horizonte Desenvolvimento',sind:'Paulo Mendes',units:84,contract:'01/01/2025 → 31/12/2029',status:'ATIVO'},
    {name:'Parque das Araucárias',type:'Misto',inc:'Alfa Realty',sind:'Carla Souza',units:176,contract:'10/11/2022 → 09/11/2027',status:'RENOVAÇÃO'}
  ];

  function isAdmin(){
    try{return currentUser==='admin';}catch(e){return false;}
  }

  function prepare(page,label){
    try{currentPage=page;}catch(e){}
    document.querySelectorAll('#navMenu .nav-item[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
    document.getElementById('sidebar')?.classList.remove('open');
    const title=document.getElementById('pageTitle');
    const breadcrumb=document.getElementById('breadcrumb');
    if(title) title.textContent=label;
    if(breadcrumb) breadcrumb.textContent=`IMO / Super Admin / ${label}`;
  }

  function table(){
    return `<div class="panel table-panel"><div class="panel-header"><h3>Todos os condomínios</h3><span>${condos.length} exibidos na demonstração</span></div><div class="table-scroll"><table class="data-table"><thead><tr><th>Cliente</th><th>Tipologia</th><th>Incorporadora</th><th>Síndico</th><th>Unidades</th><th>Contrato</th><th>Status</th><th>Acessar como</th></tr></thead><tbody>${condos.map(x=>`<tr><td><b>${x.name}</b></td><td>${x.type}</td><td>${x.inc}</td><td>${x.sind}</td><td>${x.units}</td><td>${x.contract}</td><td><span class="status ${x.status==='ATIVO'?'green':'yellow'}">${x.status}</span></td><td><button class="mini-btn" data-impersonate="incorporadora" data-condo="${x.name}">Incorporadora</button> <button class="mini-btn" data-impersonate="sindico" data-condo="${x.name}">Síndico</button></td></tr>`).join('')}</tbody></table></div></div>`;
  }

  function renderCondos(){
    if(!isAdmin()) return;
    prepare('condominios','Condomínios');
    const content=document.getElementById('content');
    if(!content) return;
    content.className='';
    content.innerHTML=`<div class="welcome-row"><div><p class="eyebrow">CARTEIRA IMO</p><h1>Condomínios</h1><p>Cadastre e acompanhe cada condomínio, incorporadora, síndico, contrato e estrutura de unidades.</p></div><button type="button" class="action-btn primary" id="stableNewCondo">＋ Cadastrar condomínio</button></div>${table()}`;
    document.getElementById('stableNewCondo')?.addEventListener('click',()=>openWizardSafe());
    content.querySelectorAll('[data-impersonate]').forEach(btn=>btn.addEventListener('click',()=>{
      if(typeof window.impersonate==='function') window.impersonate(btn.dataset.impersonate,btn.dataset.condo);
    }));
  }

  function fallbackWizard(){
    document.getElementById('wizard')?.remove();
    const m=document.createElement('div');
    m.className='modal-backdrop';
    m.id='wizard';
    m.innerHTML=`<div class="wizard"><button class="wizard-x" type="button">×</button><p class="eyebrow">NOVO CLIENTE • PASSO 1 DE 3</p><h2>Que tipo de condomínio vamos configurar?</h2><p class="muted">A tipologia sugere automaticamente áreas, módulos e estrutura inicial.</p><div class="type-grid">${[['🏢','Vertical','Prédio / torres'],['🏘','Horizontal','Condomínio de casas'],['◫','Misto','Prédios + casas'],['♧','Garden','Unidades garden / térreas']].map(x=>`<button type="button" data-type="${x[1]}"><b>${x[0]}</b><strong>${x[1]}</strong><span>${x[2]}</span></button>`).join('')}</div></div>`;
    document.body.appendChild(m);
    m.querySelector('.wizard-x').onclick=()=>m.remove();
    m.querySelectorAll('[data-type]').forEach(btn=>btn.onclick=()=>fallbackStep2(m,btn.dataset.type));
  }

  function fallbackStep2(m,type){
    const w=m.querySelector('.wizard');
    w.innerHTML=`<button class="wizard-x" type="button">×</button><p class="eyebrow">NOVO CLIENTE • PASSO 2 DE 3</p><h2>${type}: configure as áreas</h2><p class="muted">Selecione os espaços e módulos que fazem parte do condomínio.</p><div class="amenities">${['Salão de festas','Churrasqueira','Piscina','Sauna','Academia','Quadra','Brinquedoteca','Coworking','Pet place','Bicicletário'].map((x,i)=>`<label><input type="checkbox" ${i<6?'checked':''}> ${x}</label>`).join('')}</div><button class="primary-btn wide" id="stableWizardNext">Continuar →</button>`;
    w.querySelector('.wizard-x').onclick=()=>m.remove();
    w.querySelector('#stableWizardNext').onclick=()=>fallbackStep3(m,type);
  }

  function fallbackStep3(m,type){
    const w=m.querySelector('.wizard');
    w.innerHTML=`<button class="wizard-x" type="button">×</button><p class="eyebrow">NOVO CLIENTE • PASSO 3 DE 3</p><h2>Contrato e implantação</h2><div class="form-grid"><label>Condomínio<input value="Residencial Horizonte"></label><label>Tipologia<input value="${type}" readonly></label><label>Incorporadora<select><option>Alfa Realty</option><option>Urban Incorporadora</option></select></label><label>Prazo<select><option>5 anos</option><option>3 anos</option></select></label><label>Início<input type="date" value="2026-08-17"></label><label>Unidades<input type="number" value="180"></label></div><div class="wizard-content"><b>Conteúdo IMO a implantar</b><label><input type="checkbox" checked> Manual do Proprietário</label><label><input type="checkbox" checked> Manual do Síndico</label><label><input type="checkbox" checked> Plano de manutenção do condomínio</label><label><input type="checkbox" checked> Garantias</label><label><input type="checkbox" checked> Plantas & Databook</label></div><button class="primary-btn wide" id="stableWizardSave">Criar condomínio e contrato ✓</button>`;
    w.querySelector('.wizard-x').onclick=()=>m.remove();
    w.querySelector('#stableWizardSave').onclick=()=>{if(typeof toast==='function')toast('Condomínio configurado para demonstração');m.remove();};
  }

  function openWizardSafe(){
    if(typeof window.openWizard==='function'){
      try{window.openWizard();return;}catch(e){console.warn('IMO: fallback do cadastro de condomínio ativado',e);}
    }
    fallbackWizard();
  }

  const previousOpen=window.openPage;
  function adminStableOpen(page){
    if(isAdmin() && page==='condominios'){
      renderCondos();
      return;
    }
    if(typeof previousOpen==='function') return previousOpen(page);
  }
  window.openPage=adminStableOpen;
  try{openPage=adminStableOpen;}catch(e){}
  window.openWizardSafe=openWizardSafe;

  document.addEventListener('click',function(e){
    if(!isAdmin()) return;
    const condoNav=e.target.closest('#navMenu .nav-item[data-page="condominios"]');
    if(condoNav){
      e.preventDefault();
      e.stopImmediatePropagation();
      renderCondos();
      return;
    }
    const newCondo=e.target.closest('[data-admin-new-condo]');
    if(newCondo){e.preventDefault();openWizardSafe();}
  },true);

  function ensureAdminNav(){
    if(!isAdmin()) return;
    try{NAV.admin=stableAdminNav;}catch(e){}
    if(typeof buildNav==='function') buildNav();
  }

  window.addEventListener('load',()=>setTimeout(()=>{
    if(isAdmin()){
      ensureAdminNav();
      const page=(typeof currentPage!=='undefined'&&currentPage)||'dashboard';
      adminStableOpen(page==='condominios'?'condominios':'dashboard');
    }
  },60));
})();
