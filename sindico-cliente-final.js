/* IMO — painel final do síndico inspirado na operação do legado */
(function(){
  if(window.__IMO_SINDICO_CLIENTE_FINAL__) return;
  window.__IMO_SINDICO_CLIENTE_FINAL__=true;

  const paths={
    manual:'<path d="M4 4h6a4 4 0 0 1 4 4v13H8a4 4 0 0 0-4 3z"/><path d="M20 4h-6a4 4 0 0 0-4 4v13h6a4 4 0 0 1 4 3z"/>',
    drill:'<path d="M3 5h11v6H3z"/><path d="M14 7h4l3 2-3 2h-4"/><path d="M6 11v9h5v-9"/>',
    people:'<circle cx="8" cy="8" r="3"/><circle cx="16" cy="8" r="3"/><path d="M2 20c1-5 11-5 12 0M10 20c1-5 11-5 12 0"/>',
    pending:'<circle cx="9" cy="8" r="3"/><path d="M4 20c1-5 9-5 10 0M16 8h5M16 12h5M16 16h4"/>',
    cloud:'<path d="M6 18h12a4 4 0 0 0 0-8 6 6 0 0 0-11-2A5 5 0 0 0 6 18z"/>',
    video:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m10 9 5 3-5 3z"/>',
    support:'<path d="M3 5h12a4 4 0 0 1 4 4v3H8l-5 4z"/><path d="M10 13h8a3 3 0 0 1 3 3v3l-4-2h-7z"/>',
    reform:'<path d="M3 12 11 5l7 6v10H5v-9"/><path d="m13 20 6-6 2 2-6 6-4 1z"/>',
    maintenance:'<path d="M5 4h12v16H5z"/><path d="M8 8h6M8 12h6M8 16h4"/><circle cx="18" cy="18" r="4"/><path d="M18 16v2l1.5 1"/>',
    warranty:'<path d="M12 3 15 5l3-.2 1 3L22 10l-1 3 1 3-3 1-1 3-3-.2-3 2-3-2-3 .2-1-3-3-1 1-3-1-3 3-1 1-3 3 .2z"/><path d="m8.5 12 2.2 2.2L16 9"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/>',
    book:'<path d="M3 5h7a4 4 0 0 1 4 4v12H7a4 4 0 0 0-4 2z"/><path d="M21 5h-7a4 4 0 0 0-4 4v12h7a4 4 0 0 1 4 2z"/>',
    notice:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M6 8h12M6 12h12M6 16h7"/>',
    settings:'<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>'
  };
  const svg=k=>`<svg viewBox="0 0 24 24" aria-hidden="true">${paths[k]||paths.settings}</svg>`;

  const modules=[
    ['manual','Manual do Síndico','manual'],['manual','Manual do Proprietário','manual'],['documentos','Plantas para Furação','drill'],['documentos','Plantas para Furação (DWG)','drill'],
    ['moradores','Cadastro de Moradores, Pets e Veículos','people'],['moradores','Cadastros Pendentes','pending'],['documentos','Databook','cloud'],['videos','Vídeos de Uso e Operação','video'],
    ['assistencia','Assistência Técnica','support'],['reformas','Planos de Reforma','reform'],['rotinas','Plano de Manutenção - Áreas Comuns','maintenance'],['garantias','Gestão das Garantias das áreas comuns','warranty'],
    ['reservas','Agendamento de Espaços','calendar'],['ocorrencias','Livro de Ocorrências','book'],['avisos','Quadro de Avisos','notice'],['configuracoes','Configurar dados do Usuário','settings']
  ];

  function active(){try{return currentUser==='sindico';}catch(e){return false;}}
  function content(){return document.getElementById('content');}
  function navTo(page){if(typeof window.openPage==='function')window.openPage(page);}
  function condoName(){return document.getElementById('contextName')?.textContent?.trim()||'Condomínio';}

  function renderHome(){
    if(!active())return;
    const c=content(); if(!c)return;
    c.className='sindico-legacy-home';
    c.innerHTML=`
      <section class="sindico-home-head"><div><span class="eyebrow">SÍNDICO</span><h1>Bem-vindo</h1><p>${condoName()} • escolha uma ferramenta para administrar o condomínio.</p></div></section>
      <section class="sindico-tools" aria-label="Ferramentas do condomínio">
        ${modules.map(([page,label,icon])=>`<button type="button" class="sindico-tool" data-page="${page}"><span class="sindico-tool-icon">${svg(icon)}</span><strong>${label}</strong></button>`).join('')}
      </section>`;
    c.querySelectorAll('.sindico-tool').forEach(b=>b.onclick=()=>navTo(b.dataset.page));
  }

  function adjustNav(){
    if(!active())return;
    const groups=[
      ['CONDOMÍNIO',[['dashboard','⌂','Início'],['moradores','◎','Moradores, pets e veículos'],['avisos','✦','Quadro de avisos'],['reservas','◫','Agendamento de espaços'],['ocorrencias','▤','Livro de ocorrências']]],
      ['MANUTENÇÃO & ATENDIMENTO',[['rotinas','↻','Plano de manutenção'],['garantias','◒','Garantias áreas comuns'],['assistencia','◉','Assistência técnica'],['reformas','⌑','Planos de reforma']]],
      ['CONTEÚDO',[['manual','▤','Manuais'],['documentos','◇','Plantas & Databook'],['videos','▷','Vídeos de uso']]],
      ['CONTA',[['configuracoes','⚙','Configurar meus dados']]]
    ];
    try{NAV.sindico=groups;}catch(e){}
  }

  const priorStart=window.startApp;
  if(typeof priorStart==='function'){
    window.startApp=function(username){
      const r=priorStart.apply(this,arguments);
      if(username==='sindico'){
        adjustNav();
        if(typeof buildNav==='function')buildNav();
        setTimeout(renderHome,0);
      }
      return r;
    };
  }

  const priorOpen=window.openPage;
  if(typeof priorOpen==='function'){
    window.openPage=function(page){
      if(active()&&page==='dashboard'){
        try{currentPage='dashboard';}catch(e){}
        document.querySelectorAll('.nav-item[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page==='dashboard'));
        const pt=document.getElementById('pageTitle'); if(pt)pt.textContent='Início';
        const bc=document.getElementById('breadcrumb'); if(bc)bc.textContent='IMO / Síndico / Início';
        document.getElementById('sidebar')?.classList.remove('open');
        renderHome(); return;
      }
      return priorOpen.apply(this,arguments);
    };
  }

  function boot(){if(active()){adjustNav();if(typeof buildNav==='function')buildNav();renderHome();}}
  window.addEventListener('load',()=>setTimeout(boot,150));
  setTimeout(boot,0);
})();