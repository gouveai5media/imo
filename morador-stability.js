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
    'Gestão das Garantias':'garantias',
    'Livro de Ocorrências':'ocorrencias',
    'Quadro de Avisos':'avisos',
    'Configurar Dados do Usuário':'configuracoes'
  };

  function residentActive(){
    try{return currentUser==='morador' && document.body.classList.contains('resident-mode');}
    catch(e){return document.body.classList.contains('resident-mode');}
  }

  function cleanResidentMaintenance(){
    if(!residentActive())return;

    document.querySelectorAll('#navMenu .nav-item[data-page="rotinas"], .imo-shortcut[data-page="rotinas"], .resident-tile[data-page="rotinas"]').forEach(el=>el.remove());

    document.querySelectorAll('.imo-panel-head h3').forEach(h=>{
      if(h.textContent.trim()==='Garantias e manutenção')h.textContent='Garantias da unidade';
    });

    document.querySelectorAll('.imo-warranty th').forEach(th=>{
      if(th.textContent.trim()==='Progresso')th.textContent='Vigência';
    });
  }

  function navigate(page){
    if(!page)return;
    if(residentActive() && page==='rotinas'){
      if(typeof toast==='function')toast('Manutenções não fazem parte da área do morador.');
      page='dashboard';
    }
    const fn=window.openPage;
    if(typeof fn==='function'){
      fn(page);
      const sidebar=document.getElementById('sidebar');
      if(window.matchMedia('(max-width:760px)').matches) sidebar?.classList.remove('open');
      requestAnimationFrame(cleanResidentMaintenance);
    }
  }

  function requestLogout(){
    const core=document.getElementById('logoutBtn');
    if(core){core.click();return;}
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

  let cleaningScheduled=false;
  function scheduleClean(){
    if(cleaningScheduled)return;
    cleaningScheduled=true;
    requestAnimationFrame(()=>{
      cleaningScheduled=false;
      cleanResidentMaintenance();
    });
  }

  if(nav)new MutationObserver(scheduleClean).observe(nav,{childList:true,subtree:true});
  if(content)new MutationObserver(scheduleClean).observe(content,{childList:true,subtree:true});

  document.addEventListener('keydown',function(e){
    if(!residentActive() || e.key!=='Escape')return;
    document.getElementById('sidebar')?.classList.remove('open');
    document.body.classList.remove('sidebar-expanded');
  });

  window.addEventListener('load',()=>setTimeout(cleanResidentMaintenance,80));
  setTimeout(cleanResidentMaintenance,120);
})();
