/* IMO Morador — presentation polish */
(function(){
  const iconPaths={
    bell:'<path d="M18 8a6 6 0 0 0-12 0c0 6.5-3 7-3 9h18c0-2-3-2.5-3-9"/><path d="M10 21h4"/>',
    home:'<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M9.5 20v-6h5v6"/>',
    logout:'<path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M14 3h7v18h-7"/>',
    menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
    close:'<path d="M6 6l12 12M18 6 6 18"/>',
    ticket:'<path d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7l-5 4v-4H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/><path d="M8 9h8M8 13h5"/>'
  };

  /* Icons redrawn to follow the legacy artwork supplied by the client. */
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
    'Configurar Dados do Usuário':'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/><path d="M8.5 12h7"/>'
  };

  const ico=name=>`<svg viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name]||iconPaths.home}</svg>`;
  const moduleIco=label=>`<svg viewBox="0 0 24 24" aria-hidden="true">${modulePaths[label]||iconPaths.home}</svg>`;

  function residentActive(){
    try{return document.body.classList.contains('resident-mode') && currentUser==='morador'}catch(e){return document.body.classList.contains('resident-mode')}
  }

  function isMobile(){ return window.matchMedia('(max-width:760px)').matches; }

  function toggleResidentMenu(){
    const sidebar=document.getElementById('sidebar');
    if(!sidebar)return;
    if(isMobile()) sidebar.classList.toggle('open');
    else document.body.classList.toggle('sidebar-expanded');
    polishHeader(true);
  }

  function polishHeader(force){
    if(!residentActive())return;
    const actions=document.querySelector('.topbar-actions');
    if(!actions)return;
    let wrap=actions.querySelector('.resident-premium-actions');
    if(!wrap){
      wrap=document.createElement('div');
      wrap.className='resident-premium-actions';
      actions.appendChild(wrap);
    }
    const expanded=document.body.classList.contains('sidebar-expanded');
    wrap.innerHTML=`
      <button class="resident-premium-action resident-menu-action" data-tip="${expanded?'Recolher menu':'Expandir menu'}" aria-label="${expanded?'Recolher menu':'Expandir menu'}">${ico(expanded?'close':'menu')}</button>
      <button class="resident-premium-action" data-tip="Notificações" aria-label="Notificações">${ico('bell')}<span class="action-badge">3</span></button>
      <button class="resident-premium-action" data-tip="Início" aria-label="Voltar ao início">${ico('home')}</button>
      <button class="resident-premium-action" data-tip="Sair" aria-label="Sair da plataforma">${ico('logout')}</button>`;
    const btns=wrap.querySelectorAll('button');
    btns[0].onclick=toggleResidentMenu;
    btns[1].onclick=()=>{ if(typeof toast==='function')toast('Você tem 3 notificações novas'); };
    btns[2].onclick=()=>{ if(typeof openPage==='function')openPage('dashboard'); };
    btns[3].onclick=()=>document.getElementById('logoutBtn')?.click();
  }

  function replaceResidentIcons(){
    if(!residentActive())return;
    document.querySelectorAll('#navMenu .nav-item').forEach(btn=>{
      const label=btn.querySelector('span:last-child')?.textContent?.trim();
      if(!label)return;
      btn.title=label;
      const icon=btn.querySelector('span:first-child');
      if(icon) icon.innerHTML=moduleIco(label);
    });
    document.querySelectorAll('.resident-tile').forEach(tile=>{
      const label=tile.querySelector('strong')?.textContent?.trim();
      const box=tile.querySelector('.ri');
      if(label&&box) box.innerHTML=moduleIco(label);
    });
  }

  function ensureHomeMetrics(){
    if(!residentActive())return;
    const home=document.querySelector('.resident-home');
    if(!home || home.querySelector('.resident-metrics'))return;
    const launcher=home.querySelector('.resident-launcher');
    if(!launcher)return;
    const metrics=document.createElement('section');
    metrics.className='resident-metrics';
    metrics.innerHTML=`
      <article><span class="metric-icon">⌂</span><em>Bloco 1</em><strong>55</strong><small>Sua unidade</small></article>
      <article><span class="metric-icon">✓</span><em>94%</em><strong>18</strong><small>Garantias vigentes</small></article>
      <article><span class="metric-icon">◉</span><em>Atualizado</em><strong>1</strong><small>Chamado em aberto</small></article>
      <article><span class="metric-icon">＋</span><em>Hoje</em><strong>3</strong><small>Novos avisos</small></article>`;
    launcher.parentNode.insertBefore(metrics,launcher);

    const shell=document.createElement('section');
    shell.className='resident-shortcuts-shell';
    shell.innerHTML='<div class="shortcuts-title"><b>Atalhos do imóvel</b><span>arraste para navegar →</span></div>';
    launcher.parentNode.insertBefore(shell,launcher);
    shell.appendChild(launcher);
  }

  function polishSidebar(){
    if(!residentActive())return;
    replaceResidentIcons();
  }

  function ensureFab(){
    const existing=document.querySelector('.resident-ticket-fab');
    if(!residentActive()){
      existing?.remove();
      document.querySelector('.resident-premium-actions')?.remove();
      document.body.classList.remove('sidebar-expanded');
      return;
    }
    if(existing)return;
    const fab=document.createElement('button');
    fab.className='resident-ticket-fab';
    fab.setAttribute('aria-label','Abertura de chamado');
    fab.innerHTML=`<span class="fab-symbol">${ico('ticket')}</span><span class="fab-copy"><span>Abertura de chamado</span><small>Assistência técnica</small></span>`;
    fab.onclick=()=>{
      if(typeof openPage==='function')openPage('assistencia');
      setTimeout(()=>{ if(typeof toast==='function')toast('Área de abertura de chamado pronta para uso'); },100);
    };
    document.body.appendChild(fab);
  }

  function apply(){
    polishHeader();
    polishSidebar();
    ensureHomeMetrics();
    ensureFab();
  }

  const obs=new MutationObserver(()=>requestAnimationFrame(apply));
  obs.observe(document.body,{attributes:true,attributeFilter:['class'],childList:true,subtree:true});
  document.addEventListener('click',()=>setTimeout(apply,30),true);
  window.addEventListener('resize',()=>{ if(isMobile())document.body.classList.remove('sidebar-expanded'); setTimeout(apply,20); });
  window.addEventListener('load',()=>setTimeout(apply,60));
  setTimeout(apply,100);
})();
