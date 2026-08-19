/* IMO — ajustes finais solicitados pelo cliente no painel do morador */
(function(){
  if(window.__IMO_CLIENT_REVIEW__) return;
  window.__IMO_CLIENT_REVIEW__=true;

  const ASSIST_ICON='icone-assistencia-tecnica-oficial.svg?v=20260819-0931';

  function residentActive(){
    try{return currentUser==='morador' && document.body.classList.contains('resident-mode');}
    catch(e){return document.body.classList.contains('resident-mode');}
  }

  function replaceUnitText(){
    const small=document.querySelector('.resident-top-unit small');
    if(!small) return;
    const raw=(small.textContent||'').trim();
    let unit=(raw.match(/(?:Apto\.?|Unidade)\s*(\d+)/i)||[])[1];
    let bloco=(raw.match(/Bloco\s*(\d+)/i)||[])[1];
    if(!unit) unit=(raw.match(/\d+/)||['55'])[0];
    if(!bloco) bloco='1';
    small.innerHTML=`Unidade <strong>${unit}</strong> • Bloco <strong>${bloco}</strong>`;
  }

  function addQuickTitle(){
    const wrap=document.querySelector('.imo-shortcuts-wrap');
    if(!wrap || wrap.querySelector('.imo-quick-title')) return;
    const title=document.createElement('div');
    title.className='imo-quick-title';
    title.textContent='ACESSO RÁPIDO';
    wrap.prepend(title);
  }

  function assistanceImg(className=''){
    const img=document.createElement('img');
    img.src=ASSIST_ICON;
    img.alt='Assistência Técnica';
    if(className) img.className=className;
    img.draggable=false;
    return img;
  }

  function applyAssistanceIcon(){
    const shortcut=document.querySelector('.imo-shortcut[data-page="assistencia"] .imo-shortcut-icon');
    if(shortcut && !shortcut.querySelector('img')) shortcut.replaceChildren(assistanceImg());

    const side=document.querySelector('#navMenu .nav-item[data-page="assistencia"] span:first-child');
    if(side && !side.querySelector('img')) side.replaceChildren(assistanceImg());

    const openTicket=document.querySelector('.imo-open-ticket > span:first-child');
    if(openTicket && !openTicket.querySelector('img')) openTicket.replaceChildren(assistanceImg('imo-assistance-ticket-icon'));
  }

  function removeDuplicateUnitCard(){
    const metrics=document.querySelector('.imo-metrics');
    if(!metrics) return;
    [...metrics.querySelectorAll('.imo-metric')].forEach(card=>{
      const label=card.querySelector('small')?.textContent?.trim().toLowerCase();
      if(label==='sua unidade') card.remove();
    });
    metrics.classList.add('imo-client-metrics-reviewed');
  }

  function removeUnclearActivityChart(){
    const grid=document.querySelector('.imo-bottom-grid');
    if(!grid) return;
    [...grid.children].forEach(panel=>{
      const title=panel.querySelector('.imo-panel-head h3')?.textContent?.trim();
      if(title==='Atividade do seu imóvel') panel.remove();
    });
    grid.classList.add('imo-single-activity');
  }

  function keepWarrantyResidentOnly(){
    document.querySelectorAll('.imo-panel-head h3').forEach(h=>{
      if(h.textContent.trim()==='Garantias e manutenção') h.textContent='Garantias da unidade';
    });
    document.querySelectorAll('.imo-warranty th').forEach(th=>{
      if(th.textContent.trim()==='Progresso') th.textContent='Vigência';
    });
  }

  function applyReview(){
    if(!residentActive()) return;
    replaceUnitText();
    addQuickTitle();
    applyAssistanceIcon();
    removeDuplicateUnitCard();
    removeUnclearActivityChart();
    keepWarrantyResidentOnly();
  }

  const previousOpen=window.openPage;
  if(typeof previousOpen==='function'){
    const reviewedOpenPage=function(page){
      const result=previousOpen(page);
      requestAnimationFrame(()=>applyReview());
      setTimeout(applyReview,80);
      return result;
    };
    window.openPage=reviewedOpenPage;
    try{openPage=reviewedOpenPage;}catch(e){}
  }

  window.addEventListener('load',()=>{
    setTimeout(applyReview,80);
    setTimeout(applyReview,280);
  });
  setTimeout(applyReview,120);
  setTimeout(applyReview,500);
})();
