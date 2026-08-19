/* IMO — prioridade final do workspace V4 do Super Admin */
(function(){
  if(window.__IMO_ADMIN_SUPER_WORKSPACE_PRIORITY__) return;
  window.__IMO_ADMIN_SUPER_WORKSPACE_PRIORITY__=true;

  function isAdmin(){
    try{return currentUser==='admin';}catch(e){return false;}
  }

  function openNewWorkspace(){
    if(typeof window.renderAdminCondosV4==='function'){
      window.renderAdminCondosV4();
      return true;
    }
    if(typeof window.openPage==='function'){
      window.openPage('condominios');
      return true;
    }
    return false;
  }

  /*
   * Captura no window: executa antes dos listeners antigos registrados
   * no document e impede que eles restaurem a tela legada.
   */
  window.addEventListener('click',function(e){
    if(!isAdmin()) return;
    const target=e.target instanceof Element ? e.target : null;
    const nav=target?.closest('#navMenu .nav-item[data-page="condominios"]');
    if(!nav) return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    openNewWorkspace();
  },true);

  /* Se alguma camada antiga tentar abrir Condomínios depois do carregamento,
     reafirma o workspace V4 através do openPage final. */
  window.addEventListener('load',function(){
    setTimeout(function(){
      if(!isAdmin()) return;
      const nav=document.querySelector('#navMenu .nav-item[data-page="condominios"]');
      if(nav) nav.dataset.workspace='v4';
    },120);
  });
})();
