/* IMO — camada final do morador para apresentação */
(function(){
  if(window.__IMO_CLIENT_FINAL__) return;
  window.__IMO_CLIENT_FINAL__=true;

  const topIcons={
    menu:'<path d="M5 7h14M5 12h14M5 17h14"/>',
    bell:'<path d="M18 8a6 6 0 0 0-12 0c0 6.5-3 7-3 9h18c0-2-3-2.5-3-9"/><path d="M10 21h4"/>',
    home:'<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M9.5 20v-6h5v6"/>',
    logout:'<path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M14 3h7v18h-7"/>',
    ticket:'<path d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7l-5 4v-4H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/><path d="M8 9h8M8 13h5"/>',
    building:'<path d="M4 21V5l8-3v19M12 8h8v13M7 8h2m-2 4h2m-2 4h2m8-4h2m-2 4h2"/>',
    shield:'<path d="M12 3 20 6v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="m9 12 2 2 4-4"/>',
    notice:'<path d="M4 5h16v12H7l-3 3z"/><path d="M8 9h8M8 13h5"/>'
  };

  const modulePaths={
    'Manual do Proprietário':'<path d="M4 4h6.5A3.5 3.5 0 0 1 14 7.5V21H7.5A3.5 3.5 0 0 0 4 24z"/><path d="M20 4h-6.5A3.5 3.5 0 0 0 10 7.5V21h6.5A3.5 3.5 0 0 1 20 24z"/><circle cx="8" cy="9" r="2.5"/><path d="M8 5.5v1M8 11.5v1M4.5 9h1M10.5 9h1M6 7l.7.7M9.3 10.3l.7.7M10 7l-.7.7M6.7 10.3 6 11"/>',
    'Plantas para Furação':'<path d="M3 5h11v6H3z"/><path d="M14 7h4l3 2-3 2h-4"/><path d="M6 11v9h5v-9"/><path d="M19 9h3M2 3v18"/><path d="M5 15h7"/>',
    'Plantas para Furação (DWG)':'<path d="M3 5h11v6H3z"/><path d="M14 7h4l3 2-3 2h-4"/><path d="M6 11v9h5v-9"/><path d="M19 9h3M2 3v18"/><rect x="11.5" y="12" width="5.5" height="8" rx="1"/><path d="M13 14h2.5M13 16h2.5M13 18h2.5"/>',
    'Vídeos de Uso e Operação':'<rect x="2.5" y="4" width="19" height="16" rx="2"/><path d="M2.5 7h19"/><circle cx="5" cy="5.5" r=".5"/><circle cx="7" cy="5.5" r=".5"/><circle cx="9" cy="5.5" r=".5"/><path d="m10 10 5 3-5 3z"/>',
    'Assistência Técnica':'<path d="M3 5h10a4 4 0 0 1 4 4v2H8l-4 3v-3H3z"/><path d="M8 11h10a4 4 0 0 1 4 4v4l-4-3H8z"/><path d="M11 14a3 3 0 0 1 6 0v2"/><path d="M11 16v2h2v-4h-2M17 16v2h-2"/>',
    'Planos de Reforma':'<path d="M3 12 11 5l7 6v10H5v-9"/><path d="m13 20 6-6 2 2-6 6-4 1z"/><path d="M16 13l3 3"/>',
    'Agendamento de Espaços':'<rect x="3" y="5" width="16" height="15" rx="2"/><path d="M7 3v4m8-4v4M3 10h16M7 13h2m3 0h2m-7 4h2m3 0h2"/><circle cx="18" cy="18" r="4"/><path d="M18 16v2l1.5 1"/>',
    'Plano de Manutenções':'<path d="M6 5h10v14H6z"/><path d="M8 3h6v3H8zM8 9h6M8 12h5"/><circle cx="5" cy="5" r="3"/><path d="M5 3v2l1 1"/><path d="m15 18 5-5 2 2-5 5-4 1z"/>',
    'Gestão das Garantias':'<path d="M12 3 15 5l3-.2 1.2 2.8L22 9l-1 3 1 3-2.8 1.4L18 19.2l-3-.2-3 2-3-2-3 .2-1.2-2.8L2 15l1-3-1-3 2.8-1.4L6 4.8 9 5z"/><path d="m8.5 12 2.2 2.2L16 9"/><path d="m7 18-2 5 5-2M17 18l2 5-5-2"/>',
    'Livro de Ocorrências':'<path d="M3 5h7a4 4 0 0 1 4 4v12H7a4 4 0 0 0-4 2z"/><path d="M21 5h-7a4 4 0 0 0-4 4v12h7a4 4 0 0 1 4 2z"/><path d="M6 9h4M6 12h4M14 9h4M14 12h4M14 15h3"/>',
    'Quadro de Avisos':'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7h20M5 10h14M5 13h14M5 16h4"/><path d="m13 10 3 6h-6z"/><path d="M13 12.5v1.5M13 15.5h.01"/>',
    'Configurar Dados do Usuário':'<circle cx="9" cy="8" r="3"/><path d="M4 18c1-4 9-4 10 0"/><circle cx="18" cy="17" r="3"/><path d="M18 12v2M18 20v2M13 17h2M21 17h2"/>'
  };

  const modules=[
    ['manual','Manual do Proprietário'],['furacao','Plantas para Furação'],['dwg','Plantas para Furação (DWG)'],['videos','Vídeos de Uso e Operação'],['assistencia','Assistência Técnica'],['reformas','Planos de Reforma'],['reservas','Agendamento de Espaços'],['rotinas','Plano de Manutenções'],['garantias','Gestão das Garantias'],['ocorrencias','Livro de Ocorrências'],['avisos','Quadro de Avisos'],['configuracoes','Configurar Dados do Usuário']
  ];

  const svg=(paths,view='0 0 24 24')=>`<svg viewBox="${view}" aria-hidden="true">${paths}</svg>`;
  const topSvg=name=>svg(topIcons[name]||topIcons.home);
  const modSvg=label=>svg(modulePaths[label]||topIcons.home);

  function residentActive(){
    try{return currentUser==='morador' && document.body.classList.contains('resident-mode');}
    catch(e){return document.body.classList.contains('resident-mode');}
  }

  function getUnitInfo(){
    const t=document.querySelector('.resident-top-unit small')?.textContent?.trim()||'Apto. 55 • Bloco 1';
    return t;
  }

  function logout(){
    const btn=document.getElementById('logoutBtn');
    if(btn){btn.click();return;}
    try{localStorage.removeItem('imo_session');sessionStorage.removeItem('imo_resident_unit');}catch(e){}
    document.getElementById('appView')?.classList.add('hidden');
    document.getElementById('loginView')?.classList.remove('hidden');
  }

  function ensureHeader(){
    if(!residentActive())return;
    const actions=document.querySelector('.topbar-actions');
    if(!actions)return;
    let wrap=actions.querySelector('.imo-final-actions');
    if(!wrap){
      wrap=document.createElement('div');
      wrap.className='imo-final-actions';
      wrap.innerHTML=`
        <button type="button" class="imo-final-action imo-final-menu" aria-label="Abrir menu">${topSvg('menu')}</button>
        <button type="button" class="imo-final-action imo-final-bell" aria-label="Notificações">${topSvg('bell')}<span class="imo-badge">3</span></button>
        <button type="button" class="imo-final-action imo-final-home" aria-label="Início">${topSvg('home')}</button>
        <button type="button" class="imo-final-action imo-final-logout" aria-label="Sair">${topSvg('logout')}</button>`;
      actions.appendChild(wrap);
      wrap.querySelector('.imo-final-menu').onclick=()=>{
        const side=document.getElementById('sidebar');
        if(window.matchMedia('(max-width:760px)').matches) side?.classList.toggle('open');
        else document.body.classList.toggle('sidebar-expanded');
      };
      wrap.querySelector('.imo-final-bell').onclick=()=>{if(typeof toast==='function')toast('Você tem 3 notificações novas');};
      wrap.querySelector('.imo-final-home').onclick=()=>{if(typeof window.openPage==='function')window.openPage('dashboard');};
      wrap.querySelector('.imo-final-logout').onclick=logout;
    }
  }

  function replaceSidebarIcons(){
    if(!residentActive())return;
    document.querySelectorAll('#navMenu .nav-item[data-page]').forEach(btn=>{
      const label=btn.querySelector('span:last-child')?.textContent?.trim();
      if(!label)return;
      const icon=btn.querySelector('span:first-child');
      if(icon)icon.innerHTML=modSvg(label);
      btn.title=label;
    });
  }

  function renderFinalHome(){
    if(!residentActive())return;
    const c=document.getElementById('content');
    if(!c)return;
    const unit=getUnitInfo();
    c.className='resident-home imo-client-home';
    c.innerHTML=`
      <section class="imo-client-intro">
        <span class="kicker">MORADOR</span>
        <h1>Bom dia, Matheus.</h1>
        <p>Acompanhe seu imóvel, documentos e serviços em um só lugar.</p>
      </section>

      <section class="imo-shortcuts-wrap">
        <div class="imo-shortcuts">
          ${modules.map((m,i)=>`<button type="button" class="imo-shortcut resident-tile" data-page="${m[0]}"><span class="imo-shortcut-icon">${modSvg(m[1])}</span><strong>${m[1]}</strong>${i===0?'<span class="shortcut-dot"></span>':''}</button>`).join('')}
        </div>
      </section>

      <section class="imo-metrics">
        <article class="imo-metric"><span class="imo-metric-icon">${topSvg('building')}</span><span class="metric-tag">${unit.includes('Bloco')?unit.split('•').pop().trim():'Bloco 1'}</span><strong>${(unit.match(/\d+/)||['55'])[0]}</strong><small>Sua unidade</small></article>
        <article class="imo-metric"><span class="imo-metric-icon">${topSvg('shield')}</span><span class="metric-tag">94%</span><strong>18</strong><small>Garantias vigentes</small></article>
        <article class="imo-metric call-card"><span class="imo-metric-icon">${topSvg('ticket')}</span><span class="metric-tag">Atualizado</span><strong>1</strong><small>Chamado em aberto</small><button type="button" class="imo-open-ticket" data-page="assistencia"><span>${topSvg('ticket')}</span><span><b>Abertura de chamado</b><em>Assistência técnica</em></span></button></article>
        <article class="imo-metric"><span class="imo-metric-icon">${topSvg('notice')}</span><span class="metric-tag">Hoje</span><strong>3</strong><small>Novos avisos</small></article>
      </section>

      <section class="imo-panel imo-warranty">
        <div class="imo-panel-head"><h3>Garantias e manutenção</h3><span>Atualizado agora</span></div>
        <table><thead><tr><th>Item</th><th>Categoria</th><th>Prazo</th><th>Progresso</th><th>Status</th></tr></thead><tbody>
          <tr><td>Porta corta-fogo</td><td>Dobradiças e molas</td><td>12/09/2026</td><td><div class="imo-progress"><i style="width:88%"></i></div></td><td><span class="imo-status yellow">ATENÇÃO</span></td></tr>
          <tr><td>Impermeabilização</td><td>Áreas molháveis</td><td>18/03/2027</td><td><div class="imo-progress"><i style="width:67%"></i></div></td><td><span class="imo-status green">VIGENTE</span></td></tr>
          <tr><td>Esquadrias</td><td>Fixação</td><td>30/08/2026</td><td><div class="imo-progress"><i style="width:96%"></i></div></td><td><span class="imo-status red">VENCE EM BREVE</span></td></tr>
        </tbody></table>
      </section>

      <section class="imo-bottom-grid">
        <article class="imo-panel"><div class="imo-panel-head"><h3>Atividade do seu imóvel</h3><span>Últimos 6 meses</span></div><div class="imo-chart">${[8,9,11,9,8,12].map((h,i)=>`<div class="imo-chart-item"><div class="imo-chart-bar" style="height:${h}%"></div><span>${['Mar','Abr','Mai','Jun','Jul','Ago'][i]}</span></div>`).join('')}</div></article>
        <article class="imo-panel"><div class="imo-panel-head"><h3>Atividade recente</h3><span>Ver tudo</span></div><div class="imo-activity">
          <div class="imo-activity-row"><span class="imo-activity-dot">${topSvg('notice')}</span><div><b>Novo aviso publicado</b><small>Há 12 minutos</small></div></div>
          <div class="imo-activity-row"><span class="imo-activity-dot">${topSvg('ticket')}</span><div><b>Chamado #000887 atualizado</b><small>Hoje, 15:40</small></div></div>
          <div class="imo-activity-row"><span class="imo-activity-dot">${topSvg('building')}</span><div><b>Reserva confirmada</b><small>Ontem, 18:20</small></div></div>
          <div class="imo-activity-row"><span class="imo-activity-dot">${topSvg('shield')}</span><div><b>Garantia revisada</b><small>02 ago, 10:10</small></div></div>
        </div></article>
      </section>`;
  }

  function applyFinalShell(){
    if(!residentActive())return;
    ensureHeader();
    replaceSidebarIcons();
    const c=document.getElementById('content');
    if(c && (typeof currentPage==='undefined' || currentPage==='dashboard' || c.classList.contains('resident-home'))) renderFinalHome();
  }

  document.addEventListener('click',function(e){
    if(!residentActive())return;
    const target=e.target.closest('[data-page]');
    if(!target)return;
    if(!target.closest('#content'))return;
    e.preventDefault();
    const page=target.dataset.page;
    if(page && typeof window.openPage==='function')window.openPage(page);
  });

  const prevOpen=window.openPage;
  if(typeof prevOpen==='function'){
    window.openPage=function(page){
      const r=prevOpen(page);
      requestAnimationFrame(()=>{
        ensureHeader();replaceSidebarIcons();
        if(page==='dashboard')renderFinalHome();
      });
      return r;
    };
    try{openPage=window.openPage;}catch(e){}
  }

  const prevStart=window.startApp;
  if(typeof prevStart==='function'){
    window.startApp=function(username){
      const r=prevStart(username);
      setTimeout(()=>{if(username==='morador')applyFinalShell();},90);
      return r;
    };
    try{startApp=window.startApp;}catch(e){}
  }

  window.addEventListener('resize',()=>{
    if(window.matchMedia('(max-width:760px)').matches)document.body.classList.remove('sidebar-expanded');
  });
  window.addEventListener('load',()=>setTimeout(applyFinalShell,120));
  setTimeout(applyFinalShell,150);
  setTimeout(applyFinalShell,500);
})();
