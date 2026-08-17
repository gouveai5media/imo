/* IMO Morador — final presentation polish */
(function(){
  const iconPaths={
    bell:'<path d="M18 8a6 6 0 0 0-12 0c0 6.5-3 7-3 9h18c0-2-3-2.5-3-9"/><path d="M10 21h4"/>',
    home:'<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M9.5 20v-6h5v6"/>',
    logout:'<path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M14 3h7v18h-7"/>',
    menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
    ticket:'<path d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7l-5 4v-4H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/><path d="M8 9h8M8 13h5"/>'
  };
  const ico=name=>`<svg viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name]||iconPaths.home}</svg>`;

  function residentActive(){
    try{return document.body.classList.contains('resident-mode') && currentUser==='morador'}catch(e){return document.body.classList.contains('resident-mode')}
  }

  function polishHeader(){
    if(!residentActive())return;
    const actions=document.querySelector('.topbar-actions');
    if(!actions||actions.querySelector('.resident-premium-actions'))return;
    const wrap=document.createElement('div');
    wrap.className='resident-premium-actions';
    wrap.innerHTML=`
      <button class="resident-premium-action resident-menu-action" data-tip="Menu" aria-label="Abrir menu">${ico('menu')}</button>
      <button class="resident-premium-action" data-tip="Notificações" aria-label="Notificações">${ico('bell')}<span class="action-badge">3</span></button>
      <button class="resident-premium-action" data-tip="Início" aria-label="Voltar ao início">${ico('home')}</button>
      <button class="resident-premium-action" data-tip="Sair" aria-label="Sair da plataforma">${ico('logout')}</button>`;
    actions.appendChild(wrap);
    const btns=wrap.querySelectorAll('button');
    btns[0].onclick=()=>document.getElementById('sidebar')?.classList.toggle('open');
    btns[1].onclick=()=>{ if(typeof toast==='function')toast('Você tem 3 notificações novas'); };
    btns[2].onclick=()=>{ if(typeof openPage==='function')openPage('dashboard'); };
    btns[3].onclick=()=>document.getElementById('logoutBtn')?.click();
  }

  function polishSidebar(){
    if(!residentActive())return;
    document.querySelectorAll('#navMenu .nav-item').forEach(btn=>{
      const label=btn.querySelector('span:last-child')?.textContent?.trim();
      if(label)btn.title=label;
    });
  }

  function ensureFab(){
    const existing=document.querySelector('.resident-ticket-fab');
    if(!residentActive()){
      existing?.remove();
      document.querySelector('.resident-premium-actions')?.remove();
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
    ensureFab();
  }

  const obs=new MutationObserver(()=>requestAnimationFrame(apply));
  obs.observe(document.body,{attributes:true,attributeFilter:['class'],childList:true,subtree:true});
  document.addEventListener('click',()=>setTimeout(apply,30),true);
  window.addEventListener('load',()=>setTimeout(apply,60));
  setTimeout(apply,100);
})();
