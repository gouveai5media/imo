/* IMO — aplica o logo oficial enviado pelo cliente sem redesenho */
(function(){
  if(window.__IMO_OFFICIAL_LOGO__) return;
  window.__IMO_OFFICIAL_LOGO__=true;

  const LOGO='logo-oficial.svg?v=20260819-0914';

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

  function img(){
    const el=document.createElement('img');
    el.className='imo-official-logo';
    el.src=LOGO;
    el.alt='IMO - Imóvel em ordem';
    el.width=179;
    el.height=85;
    el.draggable=false;
    return el;
  }

  function applyTo(el){
    if(!el || el.dataset.officialImoLogo==='1') return;
    el.dataset.officialImoLogo='1';
    el.classList.add('imo-logo-applied');
    el.replaceChildren(img());
  }

  function applyAll(root=document){
    root.querySelectorAll?.('.brand-mark,.resident-top-logo').forEach(applyTo);
  }

  applyAll();
  window.addEventListener('load',()=>applyAll());

  const observer=new MutationObserver(mutations=>{
    let shouldApply=false;
    for(const m of mutations){
      if(m.addedNodes.length){shouldApply=true;break;}
    }
    if(shouldApply) requestAnimationFrame(()=>applyAll());
  });
  observer.observe(document.body,{childList:true,subtree:true});
})();
