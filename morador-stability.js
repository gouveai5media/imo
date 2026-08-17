/* IMO Morador — navigation safety net for presentation */
(function(){
  const pageByLabel={
    'Manual do Proprietário':'manual',
    'Plantas para Furação':'furacao',
    'Plantas para Furação (DWG)':'dwg',
    'Vídeos de Uso e Operação':'videos',
    'Assistência Técnica':'assistencia',
    'Planos de Reforma':'reformas',
    'Agendamento de Espaços':'reservas',
    'Plano de Manutenções':'rotinas',
    'Gestão das Garantias':'garantias',
    'Livro de Ocorrências':'ocorrencias',
    'Quadro de Avisos':'avisos',
    'Configurar Dados do Usuário':'configuracoes'
  };

  function residentActive(){
    try{return currentUser==='morador' && document.body.classList.contains('resident-mode');}
    catch(e){return document.body.classList.contains('resident-mode');}
  }

  function navigate(page){
    if(!page)return;
    const fn=window.openPage;
    if(typeof fn==='function'){
      fn(page);
      const sidebar=document.getElementById('sidebar');
      if(window.matchMedia('(max-width:760px)').matches) sidebar?.classList.remove('open');
    }
  }

  function requestLogout(){
    const core=document.getElementById('logoutBtn');
    if(core){core.click();return;}
    /* Fallback only if the original control is unavailable. */
    try{localStorage.removeItem('imo_session');sessionStorage.removeItem('imo_resident_unit');currentUser=null;}catch(e){}
    document.body.classList.remove('resident-mode','sidebar-expanded');
    document.getElementById('appView')?.classList.add('hidden');
    document.getElementById('loginView')?.classList.remove('hidden');
  }

  const nav=document.getElementById('navMenu');
  if(nav && !nav.dataset.residentStableNavigation){
    nav.dataset.residentStableNavigation='1';
    nav.addEventListener('click',function(e){
      if(!residentActive())return;
      const item=e.target.closest('.nav-item[data-page]');
      if(!item || !nav.contains(item))return;
      e.preventDefault();
      e.stopImmediatePropagation();
      navigate(item.dataset.page);
    },true);
  }

  const content=document.getElementById('content');
  if(content && !content.dataset.residentStableNavigation){
    content.dataset.residentStableNavigation='1';
    content.addEventListener('click',function(e){
      if(!residentActive())return;
      const tile=e.target.closest('.resident-tile');
      if(tile && content.contains(tile)){
        const label=tile.querySelector('strong')?.textContent?.trim();
        const page=pageByLabel[label];
        if(page){
          e.preventDefault();
          e.stopImmediatePropagation();
          navigate(page);
          return;
        }
      }
      const back=e.target.closest('.resident-back');
      if(back && content.contains(back)){
        e.preventDefault();
        e.stopImmediatePropagation();
        navigate('dashboard');
      }
    },true);
  }

  /* Header/FAB actions are delegated at document level because they are created dynamically. */
  document.addEventListener('click',function(e){
    if(!residentActive())return;

    const logout=e.target.closest('.resident-logout-action');
    if(logout){
      e.preventDefault();
      e.stopImmediatePropagation();
      requestLogout();
      return;
    }

    const home=e.target.closest('.resident-home-action');
    if(home){
      e.preventDefault();
      e.stopImmediatePropagation();
      navigate('dashboard');
      return;
    }

    const fab=e.target.closest('.resident-ticket-fab');
    if(fab){
      e.preventDefault();
      e.stopImmediatePropagation();
      navigate('assistencia');
    }
  },true);

  document.addEventListener('keydown',function(e){
    if(!residentActive() || e.key!=='Escape')return;
    document.getElementById('sidebar')?.classList.remove('open');
    document.body.classList.remove('sidebar-expanded');
  });
})();
