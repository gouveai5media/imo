/* IMO Morador — remove toda manutenção de unidade da experiência do morador */
(function(){
  if(window.__IMO_RESIDENT_NO_MAINTENANCE__) return;
  window.__IMO_RESIDENT_NO_MAINTENANCE__=true;

  function residentActive(){
    try{return currentUser==='morador' && document.body.classList.contains('resident-mode');}
    catch(e){return document.body.classList.contains('resident-mode');}
  }

  function cleanResidentMaintenance(){
    if(!residentActive()) return;

    document.querySelectorAll('#navMenu .nav-item[data-page="rotinas"], .imo-shortcut[data-page="rotinas"], .resident-tile[data-page="rotinas"]').forEach(el=>el.remove());

    document.querySelectorAll('.imo-panel-head h3').forEach(h=>{
      if(h.textContent.trim()==='Garantias e manutenção') h.textContent='Garantias da unidade';
    });

    document.querySelectorAll('.imo-warranty th').forEach(th=>{
      if(th.textContent.trim()==='Progresso') th.textContent='Vigência';
    });
  }

  const previousOpenPage=window.openPage;
  if(typeof previousOpenPage==='function'){
    const noMaintenanceOpenPage=function(page){
      if(residentActive() && page==='rotinas'){
        if(typeof toast==='function') toast('Manutenções não fazem parte da área do morador.');
        return previousOpenPage('dashboard');
      }
      const result=previousOpenPage(page);
      requestAnimationFrame(cleanResidentMaintenance);
      return result;
    };
    window.openPage=noMaintenanceOpenPage;
    try{openPage=noMaintenanceOpenPage;}catch(e){}
  }

  let scheduled=false;
  function scheduleClean(){
    if(scheduled) return;
    scheduled=true;
    requestAnimationFrame(()=>{
      scheduled=false;
      cleanResidentMaintenance();
    });
  }

  const nav=document.getElementById('navMenu');
  const content=document.getElementById('content');
  if(nav) new MutationObserver(scheduleClean).observe(nav,{childList:true,subtree:true});
  if(content) new MutationObserver(scheduleClean).observe(content,{childList:true,subtree:true});

  window.addEventListener('load',()=>setTimeout(cleanResidentMaintenance,80));
  setTimeout(cleanResidentMaintenance,120);
})();
