/* IMO — garante os ícones personalizados também no menu lateral */
(function(){
  if(window.__IMO_TOOL_ICONS_SIDEBAR_FIX__) return;
  window.__IMO_TOOL_ICONS_SIDEBAR_FIX__=true;

  let scheduled=false;

  function api(){ return window.imoToolIcons || null; }

  function makeImg(id,src,label){
    const img=document.createElement('img');
    img.className='imo-tool-icon-img imo-tool-icon-sidebar';
    img.src=src;
    img.alt=label||'Ícone';
    img.draggable=false;
    img.dataset.toolId=id;
    return img;
  }

  function applySidebar(){
    const icons=api();
    if(!icons?.modules) return;

    icons.modules.forEach(mod=>{
      const src=icons.get(mod.id);
      document.querySelectorAll(`#navMenu .nav-item[data-page="${mod.id}"]`).forEach(btn=>{
        const holder=btn.querySelector('span:first-child');
        if(!holder) return;

        const current=holder.querySelector(':scope > img.imo-tool-icon-img');
        const currentSrc=current?.getAttribute('src')||'';
        const valid=current && currentSrc===src && current.dataset.toolId===mod.id;

        if(!valid){
          holder.replaceChildren(makeImg(mod.id,src,mod.label));
        }
        holder.dataset.imoToolIcon=src;
        btn.title=mod.label;
      });
    });
  }

  function schedule(){
    if(scheduled) return;
    scheduled=true;
    requestAnimationFrame(()=>{
      scheduled=false;
      applySidebar();
    });
  }

  const style=document.createElement('style');
  style.textContent=`
    body.resident-mode #navMenu .nav-item>span:first-child{
      display:grid!important;
      place-items:center!important;
      overflow:visible!important;
    }
    body.resident-mode #navMenu .nav-item>span:first-child img.imo-tool-icon-sidebar{
      display:block!important;
      width:31px!important;
      height:29px!important;
      object-fit:contain!important;
      max-width:31px!important;
      max-height:29px!important;
      opacity:1!important;
      filter:brightness(0) invert(1)!important;
    }
    body.resident-mode #navMenu .nav-item.active>span:first-child img.imo-tool-icon-sidebar{
      filter:none!important;
    }
    body.resident-mode.sidebar-expanded #navMenu .nav-item>span:first-child img.imo-tool-icon-sidebar{
      width:29px!important;
      height:27px!important;
    }
  `;
  document.head.appendChild(style);

  window.addEventListener('load',()=>{
    applySidebar();
    setTimeout(applySidebar,100);
    setTimeout(applySidebar,350);
    setTimeout(applySidebar,900);
  });

  document.addEventListener('click',e=>{
    if(e.target.closest('#navMenu,.imo-final-menu,#menuToggle')){
      setTimeout(applySidebar,0);
      setTimeout(applySidebar,100);
    }
  },true);

  const nav=document.getElementById('navMenu');
  if(nav){
    new MutationObserver(schedule).observe(nav,{childList:true,subtree:true});
  }else{
    new MutationObserver(()=>{
      const menu=document.getElementById('navMenu');
      if(menu && !menu.dataset.iconFixObserved){
        menu.dataset.iconFixObserved='1';
        new MutationObserver(schedule).observe(menu,{childList:true,subtree:true});
        schedule();
      }
    }).observe(document.body,{childList:true,subtree:true});
  }

  applySidebar();
})();
