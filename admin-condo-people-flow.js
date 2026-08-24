/* IMO — cadastro de unidades e condôminos no Super Admin */
(function(){
  if(window.__IMO_CONDO_PEOPLE_FLOW__) return;
  window.__IMO_CONDO_PEOPLE_FLOW__=true;
  const STORAGE='imo_admin_condos_v3';

  function isAdmin(){try{return currentUser==='admin';}catch(e){return false;}}
  function load(){try{const d=JSON.parse(localStorage.getItem(STORAGE)||'[]');return Array.isArray(d)?d:[];}catch(e){return [];}}
  function save(d){localStorage.setItem(STORAGE,JSON.stringify(d));}
  function current(){
    const name=document.querySelector('.admin-condos-v4 .av4-summary .av4-main h1')?.textContent?.trim();
    if(!name)return null;
    const data=load(), condo=data.find(x=>String(x.name||'').trim()===name);
    if(!condo)return null;
    condo.unitRecords=Array.isArray(condo.unitRecords)?condo.unitRecords:[];
    condo.residents=Array.isArray(condo.residents)?condo.residents:[];
    return {data,condo};
  }
  function esc(v=''){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function uid(p){return p+'-'+Date.now()+'-'+Math.random().toString(36).slice(2,6);}

  function render(){
    if(!isAdmin())return;
    const modules=document.querySelector('.admin-condos-v4 .av4-modules');
    if(!modules)return;
    const panel=modules.closest('.av4-panel');
    const root=panel?.parentElement;
    if(!root || root.querySelector('#imoPeopleFlow'))return;
    const state=current(); if(!state)return;
    const {condo}=state;

    const box=document.createElement('section');
    box.className='av4-panel imo-people-flow'; box.id='imoPeopleFlow';
    box.innerHTML=`
      <div class="av4-panel-head"><div><h3>Unidades e condôminos</h3><p>Cadastre a estrutura real do condomínio e vincule proprietários, moradores e locatários às unidades.</p></div></div>
      <div class="imo-people-summary">
        <div><strong>${condo.unitRecords.length}</strong><span>unidades cadastradas</span></div>
        <div><strong>${condo.residents.length}</strong><span>pessoas vinculadas</span></div>
      </div>
      <div class="imo-people-grid">
        <section>
          <h4>Nova unidade</h4>
          <div class="imo-inline-form">
            <input id="imoUnitNumber" placeholder="Unidade / número">
            <input id="imoUnitBlock" placeholder="Bloco">
            <select id="imoUnitType">${(condo.unitTypes||['TIPO']).map(t=>`<option>${esc(t)}</option>`).join('')}</select>
            <button class="av4-btn primary" id="imoAddUnit">＋ Adicionar unidade</button>
          </div>
          <div class="imo-records">${condo.unitRecords.length?condo.unitRecords.map(u=>`<div class="imo-record"><div><b>${esc(u.number)}</b><small>${esc(u.block||'Sem bloco')} • ${esc(u.type||'TIPO')}</small></div><button data-del-unit="${esc(u.id)}">Excluir</button></div>`).join(''):'<p class="av4-empty-note">Nenhuma unidade cadastrada manualmente nesta demonstração.</p>'}</div>
        </section>
        <section>
          <h4>Novo condômino</h4>
          <div class="imo-inline-form resident">
            <input id="imoResidentName" placeholder="Nome completo">
            <input id="imoResidentEmail" type="email" placeholder="E-mail / login">
            <input id="imoResidentPhone" placeholder="Telefone">
            <select id="imoResidentRelation"><option value="owner">Proprietário</option><option value="resident">Morador</option><option value="tenant">Locatário</option><option value="authorized">Autorizado</option></select>
            <select id="imoResidentUnit"><option value="">Selecione a unidade</option>${condo.unitRecords.map(u=>`<option value="${esc(u.id)}">${esc(u.block?u.block+' / ':'')}${esc(u.number)}</option>`).join('')}</select>
            <button class="av4-btn primary" id="imoAddResident">＋ Vincular condômino</button>
          </div>
          <div class="imo-records">${condo.residents.length?condo.residents.map(r=>{const u=condo.unitRecords.find(x=>x.id===r.unitId);return `<div class="imo-record"><div><b>${esc(r.name)}</b><small>${esc(r.email||r.phone||'Sem contato')} • ${esc(r.relationLabel)}${u?' • '+esc((u.block?u.block+' / ':'')+u.number):''}</small></div><button data-del-resident="${esc(r.id)}">Excluir</button></div>`}).join(''):'<p class="av4-empty-note">Nenhum condômino vinculado nesta demonstração.</p>'}</div>
        </section>
      </div>`;
    root.appendChild(box);

    box.querySelector('#imoAddUnit').onclick=()=>{
      const number=box.querySelector('#imoUnitNumber').value.trim(); if(!number)return;
      const s=current(); if(!s)return;
      s.condo.unitRecords.push({id:uid('unit'),number,block:box.querySelector('#imoUnitBlock').value.trim(),type:box.querySelector('#imoUnitType').value||'TIPO'});
      save(s.data); refresh();
    };
    box.querySelector('#imoAddResident').onclick=()=>{
      const name=box.querySelector('#imoResidentName').value.trim(), unitId=box.querySelector('#imoResidentUnit').value; if(!name||!unitId)return;
      const rel=box.querySelector('#imoResidentRelation'), s=current(); if(!s)return;
      s.condo.residents.push({id:uid('person'),name,email:box.querySelector('#imoResidentEmail').value.trim(),phone:box.querySelector('#imoResidentPhone').value.trim(),unitId,relationship:rel.value,relationLabel:rel.options[rel.selectedIndex].text});
      save(s.data); refresh();
    };
    box.querySelectorAll('[data-del-unit]').forEach(b=>b.onclick=()=>{const s=current();if(!s)return;s.condo.unitRecords=s.condo.unitRecords.filter(x=>x.id!==b.dataset.delUnit);s.condo.residents=s.condo.residents.filter(x=>x.unitId!==b.dataset.delUnit);save(s.data);refresh();});
    box.querySelectorAll('[data-del-resident]').forEach(b=>b.onclick=()=>{const s=current();if(!s)return;s.condo.residents=s.condo.residents.filter(x=>x.id!==b.dataset.delResident);save(s.data);refresh();});
  }

  function refresh(){document.querySelector('#imoPeopleFlow')?.remove();render();}
  let scheduled=false;function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;render();});}
  new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
  window.addEventListener('load',()=>{render();setTimeout(render,150);}); render();

  if(!document.querySelector('script[data-imo-real-condos]')){
    const script=document.createElement('script');
    script.src='imo-real-condominiums.js?v=20260824-2043';
    script.dataset.imoRealCondos='1';
    document.body.appendChild(script);
  }
})();
