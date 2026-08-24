/* IMO — carrega condomínios reais do Supabase em modo de revisão seguro */
(function(){
  if(window.__IMO_REAL_CONDOMINIUMS__) return;
  window.__IMO_REAL_CONDOMINIUMS__=true;

  const STORAGE='imo_admin_condos_v3';
  const URL='https://oxfyzknyeeqbtpfdenhl.supabase.co/rest/v1/demo_condominiums?select=*&order=legacy_id.asc';
  const KEY='sb_publishable_4byc9-zuBQ5HcCVDzPFyxg_1BPW6l5g';

  function mapStatus(v){
    if(v==='renewal') return 'RENOVAÇÃO';
    if(v==='inactive'||v==='closed') return 'INATIVO';
    return 'ATIVO';
  }
  function safe(v){return v==null?'':String(v);}
  function mapRow(r){
    return {
      id:`legacy-${r.legacy_id}`,
      legacyId:r.legacy_id,
      code:safe(r.code),
      name:safe(r.name)||`Condomínio ${r.legacy_id}`,
      cnpj:safe(r.cnpj),
      type:safe(r.typology)||'TIPO',
      builder:safe(r.builder_name),
      inc:safe(r.incorporadora_name),
      sind:'',sindPhone:'',sindEmail:'',
      units:Number(r.unit_count||0),
      registrationDate:safe(r.registration_date),
      termYears:r.contract_term_years?String(r.contract_term_years):'5',
      contractEnd:safe(r.contract_end_date),
      status:mapStatus(r.status),
      address:safe(r.address_line),number:safe(r.address_number),complement:safe(r.address_complement),
      neighborhood:safe(r.neighborhood),city:safe(r.city),state:safe(r.state)||'SP',postalCode:safe(r.postal_code),
      assistanceSystem:safe(r.assistance_system)||'Sistema IMO',
      uploadLimit:Number(r.upload_limit_mb||300),
      maintenanceEmail:r.maintenance_email_enabled!==false,
      modules:[],unitTypes:['TIPO'],files:[],blocks:[],habiteSe:[],customManuals:[],tickets:[],reservations:[],warranties:[],maintenancePlans:[],notices:[],occurrences:[],
      realData:true
    };
  }

  async function sync(){
    try{
      const res=await fetch(URL,{headers:{apikey:KEY,Authorization:`Bearer ${KEY}`}});
      if(!res.ok) throw new Error(`Supabase ${res.status}`);
      const rows=await res.json();
      if(!Array.isArray(rows)||!rows.length) return;
      let existing=[];
      try{existing=JSON.parse(localStorage.getItem(STORAGE)||'[]');}catch(e){}
      const drafts=Array.isArray(existing)?existing.filter(x=>String(x.id||'').startsWith('condo-')&&!x.realData):[];
      const merged=[...rows.map(mapRow),...drafts];
      localStorage.setItem(STORAGE,JSON.stringify(merged));
      window.IMO_REAL_CONDOS_LOADED=rows.length;
      if(typeof window.renderAdminCondosV4==='function'){
        try{if(typeof currentUser!=='undefined'&&currentUser==='admin'&&typeof currentPage!=='undefined'&&currentPage==='condominios')window.renderAdminCondosV4();}catch(e){}
      }
      window.dispatchEvent(new CustomEvent('imo:real-condos-loaded',{detail:{count:rows.length}}));
    }catch(err){
      console.warn('[IMO] Não foi possível carregar condomínios reais:',err);
    }
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(sync,350));
  else setTimeout(sync,350);
  window.reloadIMORealCondos=sync;
})();
