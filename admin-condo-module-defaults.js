/* IMO — regra de módulos padrão no cadastro de novos condomínios */
(function(){
  if(window.__IMO_CONDO_MODULE_DEFAULTS__) return;
  window.__IMO_CONDO_MODULE_DEFAULTS__=true;

  const STORAGE='imo_admin_condos_v3';
  const NEW_DEFAULTS=[
    'furacao','videos','assistencia','garantias','reformas','reservas',
    'ocorrencias','avisos','databook','planos_manutencao'
  ];
  const OPTIONAL_DEFAULT_OFF=['dwg','databook_usuarios','manutencao_unidades'];
  const EXTRA_MODULES=[
    ['databook_usuarios','Databook (usuários)',false],
    ['planos_manutencao','Planos de Manutenção',true],
    ['manutencao_unidades','Manutenção de Unidades',false]
  ];

  function isAdmin(){try{return currentUser==='admin';}catch(e){return false;}}
  function load(){try{const d=JSON.parse(localStorage.getItem(STORAGE)||'[]');return Array.isArray(d)?d:[];}catch(e){return [];}}
  function save(data){try{localStorage.setItem(STORAGE,JSON.stringify(data));}catch(e){}}
  function isNewDraft(x){return !!x && String(x.id||'').startsWith('condo-') && !String(x.code||'').trim();}

  function normalizeNewDrafts(){
    if(!isAdmin()) return;
    const data=load();let changed=false;
    data.forEach(x=>{
      if(!isNewDraft(x) || x.moduleContractDefaultsV1) return;
      x.modules=NEW_DEFAULTS.slice();
      x.moduleContractDefaultsV1=true;
      changed=true;
    });
    if(changed) save(data);
  }

  function visibleCondo(){
    const name=document.querySelector('.admin-condos-v4 .av4-summary .av4-main h1')?.textContent?.trim();
    if(!name) return null;
    return load().find(x=>String(x.name||'').trim()===name) || null;
  }

  function addExtraModules(){
    if(!isAdmin()) return;
    const grid=document.querySelector('.admin-condos-v4 .av4-modules');
    if(!grid) return;
    const condo=visibleCondo();
    if(!condo) return;
    const modules=Array.isArray(condo.modules)?condo.modules:[];

    // Corrige o estado visual do DWG em novos cadastros, caso a tela tenha sido renderizada
    // antes da normalização do localStorage.
    const dwg=grid.querySelector('[data-v4-module="dwg"]');
    if(dwg && isNewDraft(condo)) dwg.checked=false;

    EXTRA_MODULES.forEach(([id,label,defaultOn])=>{
      if(grid.querySelector(`[data-v4-module="${id}"]`)) return;
      const item=document.createElement('label');
      item.className='av4-check av4-contract-module';
      const checked=modules.includes(id) || (isNewDraft(condo) && defaultOn && !condo.moduleContractDefaultsV1);
      item.innerHTML=`<input type="checkbox" data-v4-module="${id}" ${checked?'checked':''}><span>${label}</span>`;
      grid.appendChild(item);
    });

    const desc=grid.closest('.av4-panel')?.querySelector('.av4-panel-head p');
    if(desc) desc.textContent='Os módulos abaixo representam o que foi contratado. No novo cadastro, DWG, Databook (usuários) e Manutenção de Unidades começam desmarcados e só são ativados quando contratados.';
  }

  function markOptional(){
    const grid=document.querySelector('.admin-condos-v4 .av4-modules');
    if(!grid) return;
    OPTIONAL_DEFAULT_OFF.forEach(id=>{
      const input=grid.querySelector(`[data-v4-module="${id}"]`);
      const label=input?.closest('label');
      if(label) label.classList.add('av4-module-contract-optional');
    });
  }

  let scheduled=false;
  function apply(){
    scheduled=false;
    normalizeNewDrafts();
    addExtraModules();
    markOptional();
  }
  function schedule(){
    if(scheduled) return;
    scheduled=true;
    requestAnimationFrame(apply);
  }

  new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
  window.addEventListener('load',()=>{apply();setTimeout(apply,120);setTimeout(apply,400);});
  apply();
})();
