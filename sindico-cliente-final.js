/* IMO — painel final do síndico alinhado ao layout do morador */
(function(){
  if(window.__IMO_SINDICO_CLIENTE_FINAL__) return;
  window.__IMO_SINDICO_CLIENTE_FINAL__=true;

  const paths={
    menu:'<path d="M5 7h14M5 12h14M5 17h14"/>',bell:'<path d="M18 8a6 6 0 0 0-12 0c0 6.5-3 7-3 9h18c0-2-3-2.5-3-9"/><path d="M10 21h4"/>',home:'<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M9.5 20v-6h5v6"/>',logout:'<path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M14 3h7v18h-7"/>',
    manual:'<path d="M4 4h6a4 4 0 0 1 4 4v13H8a4 4 0 0 0-4 3z"/><path d="M20 4h-6a4 4 0 0 0-4 4v13h6a4 4 0 0 1 4 3z"/>',
    drill:'<path d="M3 5h11v6H3z"/><path d="M14 7h4l3 2-3 2h-4"/><path d="M6 11v9h5v-9"/>',people:'<circle cx="8" cy="8" r="3"/><circle cx="16" cy="8" r="3"/><path d="M2 20c1-5 11-5 12 0M10 20c1-5 11-5 12 0"/>',pending:'<circle cx="9" cy="8" r="3"/><path d="M4 20c1-5 9-5 10 0M16 8h5M16 12h5M16 16h4"/>',cloud:'<path d="M6 18h12a4 4 0 0 0 0-8 6 6 0 0 0-11-2A5 5 0 0 0 6 18z"/>',video:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m10 9 5 3-5 3z"/>',support:'<path d="M3 5h12a4 4 0 0 1 4 4v3H8l-5 4z"/><path d="M10 13h8a3 3 0 0 1 3 3v3l-4-2h-7z"/>',reform:'<path d="M3 12 11 5l7 6v10H5v-9"/><path d="m13 20 6-6 2 2-6 6-4 1z"/>',maintenance:'<path d="M5 4h12v16H5z"/><path d="M8 8h6M8 12h6M8 16h4"/><circle cx="18" cy="18" r="4"/><path d="M18 16v2l1.5 1"/>',warranty:'<path d="M12 3 15 5l3-.2 1 3L22 10l-1 3 1 3-3 1-1 3-3-.2-3 2-3-2-3 .2-1-3-3-1 1-3-1-3 3-1 1-3 3 .2z"/><path d="m8.5 12 2.2 2.2L16 9"/>',calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/>',book:'<path d="M3 5h7a4 4 0 0 1 4 4v12H7a4 4 0 0 0-4 2z"/><path d="M21 5h-7a4 4 0 0 0-4 4v12h7a4 4 0 0 1 4 2z"/>',notice:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M6 8h12M6 12h12M6 16h7"/>',settings:'<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>'
  };
  const svg=k=>`<svg viewBox="0 0 24 24" aria-hidden="true">${paths[k]||paths.settings}</svg>`;
  const modules=[
    ['manual','Manual do Síndico','manual'],['manual','Manual do Proprietário','manual'],['documentos','Plantas para Furação','drill'],['documentos','Plantas para Furação (DWG)','drill'],['moradores','Cadastro de Moradores, Pets e Veículos','people'],['moradores','Cadastros Pendentes','pending'],['documentos','Databook','cloud'],['videos','Vídeos de Uso e Operação','video'],['assistencia','Assistência Técnica','support'],['reformas','Planos de Reforma','reform'],['rotinas','Plano Manutenção - Áreas Comuns','maintenance'],['garantias','Gestão das Garantias das áreas comuns','warranty'],['reservas','Agendamento de Espaços','calendar'],['ocorrencias','Livro de Ocorrências','book'],['avisos','Quadro de Avisos','notice'],['configuracoes','Configurar dados do Usuário','settings']
  ];

  function active(){try{return currentUser==='sindico';}catch(e){return false;}}
  function content(){return document.getElementById('content');}
  function navTo(page){if(typeof window.openPage==='function')window.openPage(page);}
  function condoName(){return document.getElementById('contextName')?.textContent?.trim()||'Residencial Noon';}
  function greet(){const h=new Date().getHours();return h<12?'Bom dia':h<18?'Boa tarde':'Boa noite';}

  function ensureShell(){
    if(!active())return;
    document.body.classList.add('sindico-mode');
    const top=document.querySelector('.topbar'); if(!top)return;
    if(!top.querySelector('.sindico-top-condo')){
      const left=top.querySelector('.topbar-left');
      const pill=document.createElement('button'); pill.className='sindico-top-condo'; pill.innerHTML=`<span class="condo-avatar">▣</span><span><b>Condomínio selecionado</b><small>${condoName()}</small></span>`; left.prepend(pill);
      const logo=document.createElement('div'); logo.className='sindico-top-logo'; logo.innerHTML='<b>IMO</b><span>imóvel em ordem</span>'; top.appendChild(logo);
      const actions=top.querySelector('.topbar-actions');
      const wrap=document.createElement('div'); wrap.className='sindico-final-actions'; wrap.innerHTML=`<button data-a="menu">${svg('menu')}</button><button data-a="bell">${svg('bell')}<i>3</i></button><button data-a="home">${svg('home')}</button><button data-a="logout">${svg('logout')}</button>`; actions.appendChild(wrap);
      wrap.querySelector('[data-a="menu"]').onclick=()=>{const s=document.getElementById('sidebar'); if(window.matchMedia('(max-width:760px)').matches)s?.classList.toggle('open'); else document.body.classList.toggle('sindico-sidebar-expanded');};
      wrap.querySelector('[data-a="home"]').onclick=()=>navTo('dashboard');
      wrap.querySelector('[data-a="bell"]').onclick=()=>{if(typeof toast==='function')toast('Você tem 3 notificações novas');};
      wrap.querySelector('[data-a="logout"]').onclick=()=>document.getElementById('logoutBtn')?.click();
    }
  }

  function adjustNav(){
    if(!active())return;
    const groups=[['CONDOMÍNIO',[['dashboard','⌂','Início'],['moradores','◎','Moradores, pets e veículos'],['avisos','✦','Quadro de avisos'],['reservas','◫','Agendamento de espaços'],['ocorrencias','▤','Livro de ocorrências']]],['MANUTENÇÃO & ATENDIMENTO',[['rotinas','↻','Plano de manutenção'],['garantias','◒','Garantias áreas comuns'],['assistencia','◉','Assistência técnica'],['reformas','⌑','Planos de reforma']]],['CONTEÚDO',[['manual','▤','Manuais'],['documentos','◇','Plantas & Databook'],['videos','▷','Vídeos de uso']]],['CONTA',[['configuracoes','⚙','Configurar meus dados']]]];
    try{NAV.sindico=groups;}catch(e){}
  }

  function renderHome(){
    if(!active())return; ensureShell();
    const c=content(); if(!c)return; c.className='sindico-home-final';
    c.innerHTML=`<section class="sindico-intro"><span>SÍNDICO</span><h1>${greet()}, Ronaldo.</h1><p>Administre ${condoName()} com as mesmas ferramentas do sistema IMO, em uma interface mais simples.</p></section>
    <section class="sindico-shortcuts-wrap"><div class="sindico-shortcuts">${modules.map(([page,label,icon])=>`<button data-page="${page}"><span class="sindico-shortcut-icon">${svg(icon)}</span><strong>${label}</strong></button>`).join('')}</div></section>
    <section class="sindico-metrics"><article><span class="metric-icon">${svg('people')}</span><em>128</em><small>Unidades cadastradas</small></article><article><span class="metric-icon">${svg('maintenance')}</span><b>12</b><small>Manutenções pendentes</small><button data-page="rotinas">Ver plano</button></article><article><span class="metric-icon">${svg('support')}</span><b>4</b><small>Chamados em aberto</small><button data-page="assistencia">Abrir assistência</button></article><article><span class="metric-icon">${svg('notice')}</span><b>3</b><small>Avisos ativos</small></article></section>
    <section class="sindico-panel"><div class="sindico-panel-head"><h3>Plano de manutenção — áreas comuns</h3><button data-page="rotinas">Ver plano completo</button></div><div class="sindico-maint-table"><div class="head"><span>Atividade</span><span>Responsável</span><span>Prazo</span><span>Status</span></div>${[['Ar condicionado (área comum)','Local','26/08/2026','PENDENTE'],['Água potável / Hidráulica','Local','31/08/2026','PENDENTE'],['Combate a incêndio / Bombas','Especializada','26/09/2026','PRÓXIMA'],['Churrasqueira / Carvão','Local','26/08/2026','PENDENTE']].map(r=>`<div class="row"><span>${r[0]}</span><span>${r[1]}</span><span>${r[2]}</span><span class="status">${r[3]}</span></div>`).join('')}</div></section>
    <section class="sindico-panel"><div class="sindico-panel-head"><h3>Atividade recente</h3><span>Atualizado agora</span></div><div class="sindico-activity"><p><b>Novo morador cadastrado</b><small>Há 18 minutos</small></p><p><b>Chamado #000905 atualizado</b><small>Hoje, 14:32</small></p><p><b>Reserva confirmada</b><small>Hoje, 11:08</small></p></div></section>`;
    c.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>navTo(b.dataset.page));
  }

  const priorStart=window.startApp;
  if(typeof priorStart==='function')window.startApp=function(username){document.body.classList.toggle('sindico-mode',username==='sindico');const r=priorStart.apply(this,arguments);if(username==='sindico'){adjustNav();if(typeof buildNav==='function')buildNav();setTimeout(renderHome,0);}return r;};
  const priorOpen=window.openPage;
  if(typeof priorOpen==='function')window.openPage=function(page){if(active()&&page==='dashboard'){try{currentPage='dashboard';}catch(e){}document.querySelectorAll('.nav-item[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page==='dashboard'));document.getElementById('pageTitle')&&(document.getElementById('pageTitle').textContent='Início');document.getElementById('breadcrumb')&&(document.getElementById('breadcrumb').textContent='IMO / Síndico / Início');document.getElementById('sidebar')?.classList.remove('open');renderHome();return;}return priorOpen.apply(this,arguments);};
  function boot(){if(active()){adjustNav();if(typeof buildNav==='function')buildNav();renderHome();}}
  window.addEventListener('load',()=>setTimeout(boot,150));setTimeout(boot,0);
})();