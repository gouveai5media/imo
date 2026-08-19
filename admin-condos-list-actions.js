/* IMO — ações diretas na listagem de condomínios do Super Admin */
(function(){
  if(window.__IMO_ADMIN_CONDOS_LIST_ACTIONS__) return;
  window.__IMO_ADMIN_CONDOS_LIST_ACTIONS__=true;

  function isAdmin(){
    try{return currentUser==='admin';}catch(e){return false;}
  }

  function condoName(row){
    const cell=row?.querySelector('td:nth-child(2)');
    return cell?.querySelector('strong')?.textContent?.trim() || cell?.querySelector('b')?.textContent?.trim() || cell?.textContent?.trim() || 'Condomínio';
  }

  function apply(){
    if(!isAdmin()) return;
    const table=document.querySelector('.admin-condos-v4 .av4-table');
    if(!table) return;

    const header=table.querySelector('thead tr');
    if(header){
      const heads=[...header.children];
      const sindIndex=heads.findIndex(th=>th.textContent.trim().toLowerCase()==='síndico');
      if(sindIndex>=0){
        heads[sindIndex].remove();
        header.dataset.sindicoRemoved='1';
      }
      const last=header.lastElementChild;
      if(last) last.textContent='Ações';
    }

    table.querySelectorAll('tbody tr[data-open-condo]').forEach(row=>{
      if(row.dataset.actionsPatched==='1') return;

      const cells=[...row.children];
      // Estrutura original: Código, Condomínio, Construtora, Incorporadora, Síndico, Unidades, Contrato, Status, Ação
      if(cells.length>=9) cells[4].remove();

      const actionCell=row.lastElementChild;
      if(!actionCell) return;
      const openBtn=actionCell.querySelector('.av4-open');
      if(openBtn){
        openBtn.textContent='Abrir';
        openBtn.classList.add('av4-action-open');
      }

      const sind=document.createElement('button');
      sind.type='button';
      sind.className='av4-list-role-btn av4-list-sindico';
      sind.dataset.viewRole='sindico';
      sind.textContent='Ver como Síndico';

      const inc=document.createElement('button');
      inc.type='button';
      inc.className='av4-list-role-btn av4-list-incorporadora';
      inc.dataset.viewRole='incorporadora';
      inc.textContent='Ver como Incorporadora';

      const wrap=document.createElement('div');
      wrap.className='av4-row-actions';
      if(openBtn) wrap.appendChild(openBtn);
      wrap.appendChild(sind);
      wrap.appendChild(inc);
      actionCell.replaceChildren(wrap);
      row.dataset.actionsPatched='1';
    });
  }

  window.addEventListener('click',function(e){
    const btn=e.target.closest('.av4-list-role-btn[data-view-role]');
    if(!btn || !isAdmin()) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    const row=btn.closest('tr[data-open-condo]');
    const name=condoName(row);
    if(typeof window.impersonate==='function') window.impersonate(btn.dataset.viewRole,name);
  },true);

  let queued=false;
  const schedule=()=>{
    if(queued) return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;apply();});
  };

  new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
  window.addEventListener('load',()=>{apply();setTimeout(apply,100);setTimeout(apply,400);});
  apply();
})();
