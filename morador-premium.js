/* IMO Resident Premium — evolution without breaking the familiar resident experience */
(function(){
  const units=[
    {id:'noon-55',condo:'Residencial Noon',unit:'Apto. 55',block:'Bloco 1',type:'Proprietário'},
    {id:'noon-92',condo:'Residencial Noon',unit:'Apto. 92',block:'Bloco 2',type:'Proprietário'},
    {id:'villas-04',condo:'Villas do Lago',unit:'Casa 04',block:'Alameda Ipê',type:'Proprietário'}
  ];

  function svg(name){
    const paths={
      home:'<path d="M3 11 12 3l9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>',
      book:'<path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H11v17H7.5A3.5 3.5 0 0 0 4 22z"/><path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H13v17h3.5A3.5 3.5 0 0 1 20 22z"/>',
      drill:'<path d="M3 7h10v6H3z"/><path d="M13 9h5l3 2-3 2h-5"/><path d="M6 13v7h5v-7"/><path d="M18 11h3"/>',
      dwg:'<path d="M4 3h12l4 4v14H4z"/><path d="M16 3v5h5"/><path d="M7 13h10M7 17h7"/><path d="m8 8 2 2 3-3"/>',
      video:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m10 9 5 3-5 3z"/>',
      support:'<path d="M4 13a8 8 0 0 1 16 0"/><path d="M4 13v4a2 2 0 0 0 2 2h2v-6H4Zm16 0v4a2 2 0 0 1-2 2h-2v-6h4Z"/><path d="M16 19c0 2-2 3-4 3"/>',
      reform:'<path d="M3 11 12 3l9 8"/><path d="M5 10v10h8"/><path d="m15 17 5-5 2 2-5 5-3 1z"/>',
      calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4m8-4v4M3 10h18"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>',
      maintenance:'<path d="M6 3h12v18H6z"/><path d="M9 3V1h6v2"/><path d="m9 11 2 2 4-4"/><path d="M9 17h6"/>',
      warranty:'<circle cx="12" cy="9" r="6"/><path d="m9 9 2 2 4-4"/><path d="m8 14-2 7 6-3 6 3-2-7"/>',
      occurrence:'<path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h8M8 16h5"/><path d="M7 2h10"/>',
      notice:'<path d="M4 4h16v13H7l-3 3z"/><path d="M8 8h8M8 12h5"/>',
      settings:'<circle cx="9" cy="8" r="3"/><path d="M4 18c1-4 9-4 10 0"/><path d="M18 13v2m0 4v2m-4-4h2m4 0h2"/>',
      building:'<path d="M4 21V5l8-3v19M12 8h8v13M7 8h2m-2 4h2m-2 4h2m8-4h2m-2 4h2"/>',
      bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
      logout:'<path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M14 3h7v18h-7"/>'
    };
    return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name]||paths.home}</svg>`;
  }

  const residentModules=[
    ['manual','book','Manual do Proprietário','Manual digital e protegido da sua unidade'],
    ['furacao','drill','Plantas para Furação','Consulte antes de realizar perfurações'],
    ['dwg','dwg','Plantas para Furação (DWG)','Arquivos técnicos da sua unidade'],
    ['videos','video','Vídeos de Uso e Operação','Orientações rápidas e práticas'],
    ['assistencia','support','Assistência Técnica','Abra e acompanhe seus chamados'],
    ['reformas','reform','Planos de Reforma','Solicitações, documentos e aprovações'],
    ['reservas','calendar','Agendamento de Espaços','Reserve as áreas do condomínio'],
    ['rotinas','maintenance','Plano de Manutenções','Cuidados preventivos do imóvel'],
    ['garantias','warranty','Gestão das Garantias','Prazos, coberturas e alertas'],
    ['ocorrencias','occurrence','Livro de Ocorrências','Registre e acompanhe ocorrências'],
    ['avisos','notice','Quadro de Avisos','Comunicados importantes do condomínio'],
    ['configuracoes','settings','Configurar Dados do Usuário','Contato, senha e preferências']
  ];

  NAV.morador=[['MEU IMÓVEL',residentModules.map(m=>[m[0],svg(m[1]),m[2]])]];

  const baseStart=startApp;
  const baseOpen=openPage;
  let selectedUnit=null;
  try{selectedUnit=JSON.parse(sessionStorage.getItem('imo_resident_unit')||'null')}catch(e){}

  startApp=function(username){
    if(username==='morador'&&!selectedUnit){showUnitPicker(()=>launchResident());return;}
    baseStart(username);
    if(username==='morador')setTimeout(enableResidentMode,0);else disableResidentMode();
  };
  window.startApp=startApp;

  function launchResident(){
    if(!selectedUnit)selectedUnit=units[0];
    sessionStorage.setItem('imo_resident_unit',JSON.stringify(selectedUnit));
    baseStart('morador');
    setTimeout(enableResidentMode,0);
  }

  function enableResidentMode(){
    if(currentUser!=='morador')return;
    document.body.classList.add('resident-mode');
    USERS.morador.context=selectedUnit?selectedUnit.unit:'Apto. 55';
    USERS.morador.meta=selectedUnit?`${selectedUnit.block} • ${selectedUnit.condo}`:'Bloco 1 • Residencial Noon';
    buildNav();
    setupResidentTopbar();
    openPage(currentPage==='dashboard'?'dashboard':currentPage);
  }

  function disableResidentMode(){
    document.body.classList.remove('resident-mode');
    document.querySelector('.resident-top-logo')?.remove();
    document.querySelectorAll('.resident-top-action').forEach(x=>x.remove());
  }

  function setupResidentTopbar(){
    const left=document.querySelector('.topbar-left');
    const actions=document.querySelector('.topbar-actions');
    if(!left||!actions)return;
    const u=selectedUnit||units[0];
    left.innerHTML=`<button class="resident-top-unit" onclick="residentChooseUnit()"><span class="unit-avatar">${svg('building')}</span><span><b>Imóvel selecionado</b><small>${u.unit} • ${u.block}</small></span></button>`;
    let logo=document.querySelector('.resident-top-logo');
    if(!logo){logo=document.createElement('div');logo.className='resident-top-logo';logo.innerHTML='<b>IMO</b><span>imóvel em ordem</span>';actions.parentNode.insertBefore(logo,actions)}
    if(!actions.querySelector('[data-res-home]')){const b=document.createElement('button');b.className='resident-top-action';b.dataset.resHome='1';b.title='Início';b.innerHTML=svg('home');b.onclick=()=>openPage('dashboard');actions.appendChild(b)}
    if(!actions.querySelector('[data-res-logout]')){const b=document.createElement('button');b.className='resident-top-action';b.dataset.resLogout='1';b.title='Sair';b.innerHTML=svg('logout');b.onclick=()=>document.getElementById('logoutBtn').click();actions.appendChild(b)}
  }

  document.getElementById('logoutBtn')?.addEventListener('click',()=>{sessionStorage.removeItem('imo_resident_unit');selectedUnit=null;disableResidentMode()});

  openPage=function(page){
    if(currentUser!=='morador'){baseOpen(page);return;}
    currentPage=page;
    document.querySelectorAll('.nav-item[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
    document.getElementById('sidebar')?.classList.remove('open');
    const mod=residentModules.find(m=>m[0]===page);
    const title=mod?mod[2]:'Início';
    document.getElementById('pageTitle').textContent=title;
    document.getElementById('breadcrumb').textContent=`IMO / Morador / ${title}`;
    if(page==='dashboard'){renderResidentHome();return;}
    if(page==='manual'){baseOpen('manual');setTimeout(()=>document.getElementById('content')?.classList.add('resident-internal'),0);return;}
    renderResidentInternal(page,title);
  };
  window.openPage=openPage;

  function renderResidentHome(){
    const u=selectedUnit||units[0];
    content.className='resident-home';
    content.innerHTML=`
      <div class="resident-heading"><div><span class="resident-kicker">ÁREA DO MORADOR</span><h1>Bem-vindo, Matheus.</h1><p>${u.condo} • ${u.unit} • ${u.block}</p></div><button class="resident-unit-pill" onclick="residentChooseUnit()"><span class="unit-icon">${svg('building')}</span><span><b>Trocar imóvel</b><small>Você possui ${units.length} unidades vinculadas</small></span></button></div>
      <div class="resident-launcher">${residentModules.map((m,i)=>`<article class="resident-tile" onclick="openPage('${m[0]}')"><div class="ri">${svg(m[1])}</div><strong>${m[2]}</strong><span>${m[3]}</span>${i===0?'<em class="badge">Atualizado</em>':''}${m[0]==='avisos'?'<em class="badge">3 novos</em>':''}</article>`).join('')}</div>
      <div class="resident-strip"><section class="resident-card"><a class="card-link" onclick="openPage('avisos')">Ver todos →</a><h3>Últimos avisos</h3><div class="notice-row"><span class="notice-dot">${svg('notice')}</span><div><b>Manutenção preventiva da piscina</b><small>Hoje, 09:30 • Administração do condomínio</small></div></div><div class="notice-row"><span class="notice-dot">${svg('calendar')}</span><div><b>Reserva do salão confirmada</b><small>15/08 • 18h às 23h</small></div></div><div class="notice-row"><span class="notice-dot">${svg('warranty')}</span><div><b>Garantia revisada</b><small>Impermeabilização • vigente até março/2027</small></div></div></section><section class="resident-card"><h3>Resumo da unidade</h3><div class="resident-summary"><div><b>18</b><span>garantias vigentes</span></div><div><b>1</b><span>chamado aberto</span></div><div><b>12</b><span>documentos</span></div></div><div class="notice-row"><span class="notice-dot">${svg('maintenance')}</span><div><b>Próxima manutenção</b><small>Limpeza dos filtros • 24/08</small></div></div></section></div>`;
  }

  function pageHead(title,desc,action=''){
    return `<div class="resident-back" onclick="openPage('dashboard')">← Voltar ao início</div><div class="resident-page-head"><div><p class="eyebrow">MEU IMÓVEL</p><h1>${title}</h1><p>${desc}</p></div>${action}</div>`;
  }

  function renderResidentInternal(page,title){
    content.className='resident-internal';
    const u=selectedUnit||units[0];
    const templates={
      reformas:()=>`${pageHead('Planos de Reforma','Solicite, envie documentos e acompanhe a aprovação da sua reforma.','<button class="action-btn primary" onclick="toast(\'Nova solicitação iniciada\')">＋ Cadastrar solicitação</button>')}<div class="resident-filterbar"><div class="filter-field">Data início</div><div class="filter-field">Data final</div><div class="filter-field">Status: Todos</div><button class="action-btn">Filtrar</button></div><div class="panel resident-table-card"><table class="data-table"><thead><tr><th>Data</th><th>Código</th><th>Último comentário</th><th>Status</th><th>Ações</th></tr></thead><tbody><tr><td>05/12/2025</td><td>#0000029</td><td>Documentação complementar solicitada</td><td><span class="status yellow">AJUSTE SOLICITADO</span></td><td><div class="resident-row-actions"><button onclick="toast(\'Solicitação aberta\')">Visualizar</button><button onclick="toast(\'Relatório preparado\')">Relatório</button></div></td></tr><tr><td>12/04/2026</td><td>#0000041</td><td>Projeto aprovado pelo condomínio</td><td><span class="status green">APROVADO</span></td><td><div class="resident-row-actions"><button>Visualizar</button></div></td></tr></tbody></table></div>`,
      assistencia:()=>`${pageHead('Assistência Técnica','Abra chamados da sua unidade e acompanhe cada etapa.','<button class="action-btn primary" onclick="toast(\'Novo chamado iniciado\')">＋ Novo chamado</button>')}<div class="panel resident-table-card"><table class="data-table"><thead><tr><th>Chamado</th><th>Abertura</th><th>Descrição</th><th>Status</th><th>Ação</th></tr></thead><tbody><tr><td>#000887</td><td>07/08/2026</td><td>Verificação da pia da cozinha</td><td><span class="status yellow">EM ANÁLISE</span></td><td><div class="resident-row-actions"><button>Visualizar</button></div></td></tr><tr><td>#000812</td><td>18/05/2026</td><td>Ajuste de vedação da janela</td><td><span class="status green">CONCLUÍDO</span></td><td><div class="resident-row-actions"><button>Relatório</button></div></td></tr></tbody></table></div>`,
      reservas:()=>`${pageHead('Agendamento de Espaços','Escolha o espaço, consulte disponibilidade e faça sua reserva.')}<div class="modules-grid"><article class="module-card"><div class="module-icon">${svg('calendar')}</div><h3>Salão de festas</h3><p>Capacidade para 60 pessoas • 09h às 23h</p><footer><span>Próximo horário: sábado</span><b>→</b></footer></article><article class="module-card"><div class="module-icon">${svg('calendar')}</div><h3>Churrasqueira</h3><p>Área gourmet • até 20 pessoas</p><footer><span>Disponível amanhã</span><b>→</b></footer></article><article class="module-card"><div class="module-icon">${svg('calendar')}</div><h3>Quadra</h3><p>Reservas de 1 hora</p><footer><span>3 horários hoje</span><b>→</b></footer></article><article class="module-card"><div class="module-icon">${svg('calendar')}</div><h3>Sauna</h3><p>Uso mediante agendamento</p><footer><span>Disponível</span><b>→</b></footer></article></div>`,
      garantias:()=>`${pageHead('Gestão das Garantias','Acompanhe prazos e condições de garantia da sua unidade.')}<div class="panel resident-table-card"><table class="data-table"><thead><tr><th>Item</th><th>Cobertura</th><th>Prazo</th><th>Vigência</th><th>Status</th></tr></thead><tbody><tr><td>Impermeabilização</td><td>Áreas molháveis</td><td>3 anos</td><td><div class="progress"><span style="width:67%"></span></div></td><td><span class="status green">VIGENTE</span></td></tr><tr><td>Esquadrias</td><td>Fixação e vedação</td><td>1 ano</td><td><div class="progress"><span style="width:93%"></span></div></td><td><span class="status yellow">ATENÇÃO</span></td></tr><tr><td>Instalações hidráulicas</td><td>Equipamentos</td><td>5 anos</td><td><div class="progress"><span style="width:32%"></span></div></td><td><span class="status green">VIGENTE</span></td></tr></tbody></table></div>`,
      avisos:()=>`${pageHead('Quadro de Avisos','Comunicados oficiais do Residencial Noon.')}<div class="resident-card"><div class="notice-row"><span class="notice-dot">${svg('notice')}</span><div><b>Manutenção preventiva da piscina</b><small>A piscina ficará indisponível das 08h às 13h na quarta-feira.</small></div></div><div class="notice-row"><span class="notice-dot">${svg('notice')}</span><div><b>Assembleia extraordinária</b><small>20/08/2026 às 19h30 • Salão de festas.</small></div></div><div class="notice-row"><span class="notice-dot">${svg('notice')}</span><div><b>Atualização cadastral</b><small>Confira seus telefones, veículos e moradores vinculados.</small></div></div></div>`,
      rotinas:()=>`${pageHead('Plano de Manutenções','Rotinas recomendadas para preservar o imóvel e suas garantias.')}<div class="panel resident-table-card"><table class="data-table"><thead><tr><th>Atividade</th><th>Periodicidade</th><th>Próximo prazo</th><th>Status</th></tr></thead><tbody><tr><td>Limpeza dos filtros do ar-condicionado</td><td>Mensal</td><td>24/08/2026</td><td><span class="status yellow">PRÓXIMA</span></td></tr><tr><td>Inspeção de rejuntes e vedações</td><td>Semestral</td><td>15/11/2026</td><td><span class="status green">EM DIA</span></td></tr><tr><td>Limpeza de sifões</td><td>Trimestral</td><td>02/10/2026</td><td><span class="status green">EM DIA</span></td></tr></tbody></table></div>`,
      ocorrencias:()=>`${pageHead('Livro de Ocorrências','Registre situações relacionadas ao condomínio e acompanhe o retorno.','<button class="action-btn primary" onclick="toast(\'Nova ocorrência iniciada\')">＋ Registrar ocorrência</button>')}<div class="panel resident-table-card"><table class="data-table"><thead><tr><th>Protocolo</th><th>Data</th><th>Assunto</th><th>Status</th></tr></thead><tbody><tr><td>#OC-0031</td><td>03/08/2026</td><td>Ruído em horário de silêncio</td><td><span class="status green">RESPONDIDO</span></td></tr><tr><td>#OC-0038</td><td>15/08/2026</td><td>Iluminação do corredor</td><td><span class="status yellow">EM ANÁLISE</span></td></tr></tbody></table></div>`,
      videos:()=>`${pageHead('Vídeos de Uso e Operação','Conteúdos rápidos para o uso correto dos sistemas da unidade.')}<div class="modules-grid"><article class="module-card"><div class="module-icon">${svg('video')}</div><h3>Quadro elétrico</h3><p>Cuidados e operação do DR.</p><footer><span>2 min</span><b>▷</b></footer></article><article class="module-card"><div class="module-icon">${svg('video')}</div><h3>Metais e torneiras</h3><p>Limpeza e conservação.</p><footer><span>1 min</span><b>▷</b></footer></article><article class="module-card"><div class="module-icon">${svg('video')}</div><h3>Ar-condicionado</h3><p>Limpeza dos filtros.</p><footer><span>3 min</span><b>▷</b></footer></article></div>`,
      furacao:()=>docPage('Plantas para Furação','Arquivos de referência para perfurações seguras na unidade.',[['Cozinha • parede hidráulica','PDF • atualizado 2026'],['Sala • parede TV','PDF • atualizado 2026'],['Banheiro suíte','PDF • atualizado 2026']]),
      dwg:()=>docPage('Plantas para Furação (DWG)','Arquivos técnicos para profissionais habilitados.',[['Apto 55 • planta geral','DWG • versão 3'],['Pontos hidráulicos','DWG • versão 2'],['Pontos elétricos','DWG • versão 2']]),
      configuracoes:()=>`${pageHead('Dados do Usuário','Mantenha seus dados de contato e preferências atualizados.')}<div class="panel"><div class="form-grid"><label>Nome<input value="Matheus Prado"></label><label>E-mail<input value="morador@imo.com.br"></label><label>Telefone<input value="(11) 99999-0000"></label><label>Unidade<input value="${u.unit} • ${u.block}" readonly></label></div><button class="action-btn primary" onclick="toast('Dados salvos')">Salvar alterações</button></div>`
    };
    content.innerHTML=(templates[page]||(()=>docPage(title,'Conteúdo vinculado à sua unidade.',[['Documento principal','Visualização disponível'],['Informação complementar','Atualizado recentemente']])))();
  }

  function docPage(title,desc,rows){
    return `${pageHead(title,desc)}<div class="panel resident-table-card"><table class="data-table"><thead><tr><th>Arquivo</th><th>Informação</th><th>Ação</th></tr></thead><tbody>${rows.map(r=>`<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td><div class="resident-row-actions"><button onclick="toast('Visualização aberta')">Acessar</button></div></td></tr>`).join('')}</tbody></table></div>`;
  }

  function showUnitPicker(done){
    document.getElementById('residentUnitModal')?.remove();
    const modal=document.createElement('div');
    modal.className='modal-backdrop resident-unit-modal';modal.id='residentUnitModal';
    modal.innerHTML=`<div class="wizard"><p class="eyebrow">SELECIONE SEU IMÓVEL</p><h2>Qual unidade deseja acessar?</h2><p class="muted">Encontramos mais de uma propriedade vinculada ao seu cadastro. Você poderá trocar de unidade a qualquer momento.</p><div class="unit-options">${units.map((u,i)=>`<button class="unit-option ${selectedUnit?.id===u.id?'selected':''}" data-unit="${u.id}"><span class="unit-icon">${svg('building')}</span><span><b>${u.unit} • ${u.block}</b><span>${u.condo} • ${u.type}</span></span></button>`).join('')}</div><button class="primary-btn wide" id="confirmResidentUnit">Acessar imóvel →</button></div>`;
    document.body.appendChild(modal);
    let chosen=selectedUnit||units[0];
    modal.querySelectorAll('.unit-option').forEach(btn=>btn.onclick=()=>{chosen=units.find(u=>u.id===btn.dataset.unit);modal.querySelectorAll('.unit-option').forEach(x=>x.classList.toggle('selected',x===btn))});
    modal.querySelector('#confirmResidentUnit').onclick=()=>{selectedUnit=chosen;sessionStorage.setItem('imo_resident_unit',JSON.stringify(chosen));modal.remove();if(done)done();else{setupResidentTopbar();openPage('dashboard')}};
  }

  window.residentChooseUnit=()=>showUnitPicker();

  // Handle refresh when the original script restored an existing resident session before this enhancement loaded.
  if(localStorage.getItem('imo_session')==='morador'&&!appView.classList.contains('hidden')){
    if(!selectedUnit)selectedUnit=units[0];
    setTimeout(enableResidentMode,0);
  }
})();