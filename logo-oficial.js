/* IMO — identidade visual global configurável pelo Super Admin */
(function(){
  if(window.__IMO_OFFICIAL_LOGO__) return;
  window.__IMO_OFFICIAL_LOGO__=true;

  const DEFAULT_LOGO='logo-oficial.svg?v=20260819-0928';
  const LOGO_KEY='imo_brand_logo';
  const FAVICON_KEY='imo_brand_favicon';

  const style=document.createElement('style');
  style.textContent=`
    .imo-official-logo{display:block!important;width:100%!important;height:100%!important;object-fit:contain!important;object-position:center!important;max-width:none!important;filter:none!important;transform:none!important}
    .brand-mark.imo-logo-applied{letter-spacing:0!important;font-size:0!important;display:grid!important;place-items:center!important;overflow:visible!important}
    .login-visual .brand-mark.imo-logo-applied{width:179px!important;height:85px!important;background:transparent!important;padding:0!important;border-radius:0!important}
    .mobile-brand .brand-mark.imo-logo-applied{width:132px!important;height:63px!important;background:linear-gradient(135deg,#0c7fb6,#159bcf)!important;padding:7px 10px!important;border-radius:14px!important}
    .mobile-brand>.brand-mark.imo-logo-applied+span{display:none!important}
    .sidebar-brand .brand-mark.imo-logo-applied{width:118px!important;height:56px!important;background:linear-gradient(135deg,#0c7fb6,#159bcf)!important;padding:6px 9px!important;border-radius:13px!important;flex:0 0 118px!important}
    .sidebar-brand .brand-mark.imo-logo-applied~div{display:none!important}
    .resident-top-logo.imo-logo-applied{width:126px!important;min-width:126px!important;height:60px!important;display:grid!important;place-items:center!important;font-size:0!important;line-height:1!important}
    .resident-top-logo.imo-logo-applied .imo-official-logo{width:126px!important;height:60px!important}
    body.resident-mode .resident-top-logo.imo-logo-applied b,body.resident-mode .resident-top-logo.imo-logo-applied span{display:none!important}
    @media(max-width:760px){
      .login-visual .brand-mark.imo-logo-applied{width:150px!important;height:71px!important}
      .mobile-brand .brand-mark.imo-logo-applied{width:118px!important;height:56px!important}
      .sidebar-brand .brand-mark.imo-logo-applied{width:112px!important;height:53px!important;flex-basis:112px!important}
      .resident-top-logo.imo-logo-applied,.resident-top-logo.imo-logo-applied .imo-official-logo{width:92px!important;height:44px!important;min-width:92px!important}
    }
  `;
  document.head.appendChild(style);

  function safeGet(key){try{return localStorage.getItem(key)||'';}catch(e){return '';}}
  function safeSet(key,value){try{value?localStorage.setItem(key,value):localStorage.removeItem(key);return true;}catch(e){return false;}}
  function getLogo(){return safeGet(LOGO_KEY)||DEFAULT_LOGO;}
  function getFavicon(){return safeGet(FAVICON_KEY);}

  function img(){
    const el=document.createElement('img');
    el.className='imo-official-logo';
    el.src=getLogo();
    el.alt='IMO - Imóvel em ordem';
    el.width=179;
    el.height=85;
    el.draggable=false;
    return el;
  }

  function applyTo(el){
    if(!el) return;
    const logo=getLogo();
    const current=el.querySelector(':scope > .imo-official-logo');
    if(current && current.getAttribute('src')===logo) return;
    el.classList.add('imo-logo-applied');
    el.replaceChildren(img());
  }

  function applyFavicon(){
    const src=getFavicon();
    let link=document.querySelector('link[data-imo-favicon]');
    if(!src){if(link)link.remove();return;}
    if(!link){link=document.createElement('link');link.rel='icon';link.dataset.imoFavicon='1';document.head.appendChild(link);}
    link.href=src;
  }

  function applyAll(root=document){
    root.querySelectorAll?.('.brand-mark,.resident-top-logo').forEach(applyTo);
    applyFavicon();
  }

  let scheduled=false;
  function scheduleApply(){
    if(scheduled) return;
    scheduled=true;
    requestAnimationFrame(()=>{scheduled=false;applyAll();});
  }

  window.imoBranding={
    defaultLogo:DEFAULT_LOGO,
    getLogo,
    getFavicon,
    setLogo(data){const ok=safeSet(LOGO_KEY,data);applyAll();return ok;},
    resetLogo(){safeSet(LOGO_KEY,'');applyAll();},
    setFavicon(data){const ok=safeSet(FAVICON_KEY,data);applyFavicon();return ok;},
    resetFavicon(){safeSet(FAVICON_KEY,'');applyFavicon();},
    apply:applyAll
  };

  applyAll();
  window.addEventListener('load',()=>{applyAll();setTimeout(applyAll,200);});
  new MutationObserver(scheduleApply).observe(document.body,{childList:true,subtree:true});
})();
