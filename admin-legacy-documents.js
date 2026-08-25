/* IMO — adaptação funcional de documentos do legado no layout novo */
(function(){
  if(window.__IMO_LEGACY_DOCUMENTS__) return;
  window.__IMO_LEGACY_DOCUMENTS__=true;

  const STORAGE='imo_admin_condos_v3';
  const TYPES=[
    {code:'0',slug:'furacao',label:'Plantas de Furação',read:false,aud:['owner','resident','syndic','incorporadora']},
    {code:'20',slug:'documentos',label:'Documentos',read:false,aud:['syndic','incorporadora']},
    {code:'5',slug:'databook',label:'Databook',read:false,aud:['syndic','incorporadora']},
    {code:'3',slug:'manual_proprietario',label:'Manual do Proprietário',read:true,aud:['owner','resident','syndic','incorporadora']},
    {code:'203',slug:'manual_proprietario_download',label:'Manual do Proprietário (Download)',read:false,aud:['owner','resident','syndic','incorporadora']},
    {code:'4',slug:'manual_sindico',label:'Manual do Síndico',read:true,aud:['syndic','incorporadora']},
    {code:'204',slug:'manual_sindico_download',label:'Manual do Síndico (Download)',read:false,aud:['syndic','incorporadora']},
    {code:'12',slug:'manual_casa',label:'Manual Casa',read:true,aud:['owner','resident','syndic','incorporadora']},
    {code:'2012',slug:'manual_casa_download',label:'Manual Casa (Download)',read:false,aud:['owner','resident','syndic','incorporadora']}
  ];
  const ROLE_LABEL={owner:'Proprietário',resident:'Morador',syndic:'Síndico',incorporadora:'Incorporadora'};

  function esc(v=''){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function load(){try{const x=JSON.parse(localStorage.getItem(STORAGE)||'[]');return Array.isArray(x)?x:[];}catch(e){return[];}}
  function save(x){localStorage.setItem(STORAGE,JSON.stringify(x));}
  function current(){
    const name=document.querySelector('.admin-condos-v4 .av4-summary .av4-main h1')?.textContent?.trim();
    if(!name)return null;
    const data=load(), condo=data.find(x=>String(x.name||'').trim()===name);
    if(!condo)return null;
    condo.files=Array.isArray(condo.files)?condo.files:[];
    return {data,condo};
  }
  function typeByCode(code){return TYPES.find(x=>x.code===String(code))||TYPES[0];}
  function uid(){return 'doc-'+Date.now()+'-'+Math.random().toString(36).slice(2,7);}
  function toastMsg(msg){try{if(typeof toast==='function')toast(msg);}catch(e){}}

  window.imoCanSeeDocument=function(doc,ctx={}){
    if(!doc)return false;
    if(ctx.role==='admin')return true;
    if(ctx.condominiumId && doc.condominiumId && String(ctx.condominiumId)!==String(doc.condominiumId))return false;
    const aud=Array.isArray(doc.audiences)?doc.audiences:[];
    if(ctx.role && !aud.includes(ctx.role))return false;
    if(doc.unitType && ctx.unitType && doc.unitType!==ctx.unitType)return false;
    return true;
  };

  function patchTabLabel(){
    document.querySelectorAll('.av4-tab').forEach(b=>{
      const txt=b.textContent.trim();
      if(txt.includes('Arquivos')){
        const strong=b.querySelector('b'); if(strong) strong.textContent='Documentos & arquivos';
      }
      if(txt.includes('Manuais')){
        const strong=b.querySelector('b'); if(strong) strong.textContent='Tipos de manuais';
      }
    });
  }

  function render(){
    patchTabLabel();
    const host=document.querySelector('#av4Tab');
    const active=[...document.querySelectorAll('.av4-tab')].find(b=>b.classList.contains('active'))?.textContent||'';
    if(!host || !active.includes('Documentos')) return;
    if(host.querySelector('#imoLegacyDocs')) return;
    const s=current(); if(!s)return;
    const {condo}=s;
    const old=[...host.children]; old.forEach(n=>n.style.display='none');

    const box=document.createElement('section'); box.id='imoLegacyDocs'; box.className='imo-legacy-docs';
    box.innerHTML=`
      <section class="av4-panel">
        <div class="av4-panel-head"><div><h3>Documentos do condomínio</h3><p>Mesma lógica do sistema antigo: cada arquivo pertence ao condomínio, tem um tipo, perfis autorizados e pode ser somente leitura ou permitir download.</p></div></div>
        <div class="imo-doc-form">
          <label><span>Tipo</span><select id="imoDocType">${TYPES.map(t=>`<option value="${t.code}">${esc(t.label)}</option>`).join('')}</select></label>
          <label><span>Título</span><input id="imoDocTitle" placeholder="Ex.: Manual do Proprietário"></label>
          <label class="wide"><span>Arquivo(s)</span><input id="imoDocFiles" type="file" multiple></label>
          <label><span>Tipo de unidade (opcional)</span><input id="imoDocUnitType" placeholder="Ex.: Garden, TIPO"></label>
          <div class="imo-doc-permissions wide">
            <div><strong>Acesso</strong><small>Super Admin sempre tem acesso.</small></div>
            ${Object.entries(ROLE_LABEL).map(([k,v])=>`<label><input type="checkbox" data-aud="${k}"> ${v}</label>`).join('')}
          </div>
          <label class="switch"><input id="imoReadOnly" type="checkbox"><span>Somente leitura / modo revista</span></label>
          <label class="switch"><input id="imoDownload" type="checkbox"><span>Permitir download</span></label>
          <button class="av4-btn primary" id="imoAddDocs">＋ Adicionar arquivo(s)</button>
        </div>
      </section>
      <section class="av4-panel"><div class="av4-panel-head"><div><h3>Arquivos cadastrados</h3><p>Organizados por categoria, como no legado.</p></div></div><div id="imoDocList"></div></section>`;
    host.appendChild(box);

    const typeSel=box.querySelector('#imoDocType');
    function applyDefaults(){
      const t=typeByCode(typeSel.value);
      box.querySelector('#imoReadOnly').checked=t.read;
      box.querySelector('#imoDownload').checked=!t.read;
      box.querySelectorAll('[data-aud]').forEach(i=>i.checked=t.aud.includes(i.dataset.aud));
      if(!box.querySelector('#imoDocTitle').value)box.querySelector('#imoDocTitle').placeholder=t.label;
    }
    typeSel.onchange=applyDefaults; applyDefaults();
    box.querySelector('#imoReadOnly').onchange=e=>{if(e.target.checked)box.querySelector('#imoDownload').checked=false;};
    box.querySelector('#imoDownload').onchange=e=>{if(e.target.checked)box.querySelector('#imoReadOnly').checked=false;};

    box.querySelector('#imoAddDocs').onclick=()=>{
      const files=[...box.querySelector('#imoDocFiles').files];
      if(!files.length){toastMsg('Selecione pelo menos um arquivo.');return;}
      const state=current(); if(!state)return;
      const t=typeByCode(typeSel.value), title=box.querySelector('#imoDocTitle').value.trim(), unitType=box.querySelector('#imoDocUnitType').value.trim();
      const audiences=[...box.querySelectorAll('[data-aud]:checked')].map(i=>i.dataset.aud);
      files.forEach((f,idx)=>state.condo.files.push({
        id:uid(),legacyType:t.code,type:t.label,title:title||(files.length===1?t.label:`${t.label} ${idx+1}`),name:f.name,
        size:f.size||0,date:new Date().toISOString().slice(0,10),readModeOnly:box.querySelector('#imoReadOnly').checked,
        downloadAllowed:box.querySelector('#imoDownload').checked,audiences,unitType,condominiumId:state.condo.id,source:'new-ui'
      }));
      save(state.data); toastMsg('Arquivo(s) adicionados ao condomínio.'); refresh();
    };
    drawList(box,condo);
  }

  function drawList(box,condo){
    const host=box.querySelector('#imoDocList');
    if(!condo.files.length){host.innerHTML='<p class="av4-empty-note">Nenhum documento cadastrado.</p>';return;}
    const groups={}; condo.files.forEach(f=>{const k=f.type||'Outro';(groups[k]||(groups[k]=[])).push(f);});
    host.innerHTML=Object.entries(groups).map(([label,items])=>`<div class="imo-doc-group"><h4>${esc(label)}</h4>${items.map(f=>`<article class="imo-doc-item"><div><strong>${esc(f.title||f.name)}</strong><small>${esc(f.name||'')} • ${esc(f.date||'')}</small><div class="imo-doc-tags"><span>${f.readModeOnly?'Somente leitura':'Visualização normal'}</span><span>${f.downloadAllowed?'Download permitido':'Sem download'}</span>${(f.audiences||[]).map(a=>`<span>${esc(ROLE_LABEL[a]||a)}</span>`).join('')}${f.unitType?`<span>Unidade: ${esc(f.unitType)}</span>`:''}</div></div><button data-del-doc="${esc(f.id||'')}">Excluir</button></article>`).join('')}</div>`).join('');
    host.querySelectorAll('[data-del-doc]').forEach(b=>b.onclick=()=>{const s=current();if(!s)return;s.condo.files=s.condo.files.filter(x=>String(x.id||'')!==String(b.dataset.delDoc));save(s.data);refresh();});
  }

  function refresh(){document.querySelector('#imoLegacyDocs')?.remove();render();}
  let queued=false;function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;render();});}
  new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
  window.addEventListener('load',()=>setTimeout(render,100)); render();
})();
