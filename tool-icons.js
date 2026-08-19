/* IMO — gerenciador global dos ícones das ferramentas/módulos */
(function(){
  if(window.__IMO_TOOL_ICONS__) return;
  window.__IMO_TOOL_ICONS__=true;

  const STORAGE='imo_tool_icons_v1';
  const stroke='#2798cf';
  const svg=(body,view='0 0 24 24')=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${view}" fill="none" stroke="${stroke}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
  const toData=markup=>'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(markup);

  const modules=[
    {id:'manual',label:'Manual do Proprietário',icon:svg('<path d="M4 4h6.5A3.5 3.5 0 0 1 14 7.5V21H7.5A3.5 3.5 0 0 0 4 24z"/><path d="M20 4h-6.5A3.5 3.5 0 0 0 10 7.5V21h6.5A3.5 3.5 0 0 1 20 24z"/><circle cx="8" cy="9" r="2.5"/><path d="M8 5.5v1M8 11.5v1M4.5 9h1M10.5 9h1M6 7l.7.7M9.3 10.3l.7.7M10 7l-.7.7M6.7 10.3 6 11"')},
    {id:'furacao',label:'Plantas para Furação',icon:svg('<path d="M3 5h11v6H3z"/><path d="M14 7h4l3 2-3 2h-4"/><path d="M6 11v9h5v-9"/><path d="M19 9h3M2 3v18"/><path d="M5 15h7"/>')},
    {id:'dwg',label:'Plantas para Furação (DWG)',icon:svg('<path d="M3 5h11v6H3z"/><path d="M14 7h4l3 2-3 2h-4"/><path d="M6 11v9h5v-9"/><path d="M19 9h3M2 3v18"/><rect x="11.5" y="12" width="5.5" height="8" rx="1"/><path d="M13 14h2.5M13 16h2.5M13 18h2.5"/>')},
    {id:'videos',label:'Vídeos de Uso e Operação',icon:svg('<rect x="2.5" y="4" width="19" height="16" rx="2"/><path d="M2.5 7h19"/><circle cx="5" cy="5.5" r=".5" fill="#2798cf"/><circle cx="7" cy="5.5" r=".5" fill="#2798cf"/><circle cx="9" cy="5.5" r=".5" fill="#2798cf"/><path d="m10 10 5 3-5 3z"/>')},
    {id:'assistencia',label:'Assistência Técnica',icon:svg('<path d="M3.5 4.5h8.5a4 4 0 0 1 4 4v2H8l-4.5 3.4v-3.4A3.5 3.5 0 0 1 0 7V8a3.5 3.5 0 0 1 3.5-3.5Z"/><circle cx="5" cy="7.5" r=".45" fill="#2798cf"/><circle cx="7" cy="7.5" r=".45" fill="#2798cf"/><circle cx="9" cy="7.5" r=".45" fill="#2798cf"/><path d="M8 10.5h8.5a4 4 0 0 1 4 4v3l-3.5-2.6H14"/><path d="M10.5 15a3.5 3.5 0 0 1 7 0v2"/><path d="M10.5 16v2h2v-4h-2M17.5 16v2h-2"/><path d="M15.5 18v.8c0 .7-.6 1.2-1.3 1.2h-1"/>')},
    {id:'reformas',label:'Planos de Reforma',icon:svg('<path d="M3 12 11 5l7 6v10H5v-9"/><path d="m13 20 6-6 2 2-6 6-4 1z"/><path d="M16 13l3 3"/>')},
    {id:'reservas',label:'Agendamento de Espaços',icon:svg('<rect x="3" y="5" width="16" height="15" rx="2"/><path d="M7 3v4m8-4v4M3 10h16M7 13h2m3 0h2m-7 4h2m3 0h2"/><circle cx="18" cy="18" r="4"/><path d="M18 16v2l1.5 1"/>')},
    {id:'garantias',label:'Gestão das Garantias',icon:svg('<path d="M12 3 15 5l3-.2 1.2 2.8L22 9l-1 3 1 3-2.8 1.4L18 19.2l-3-.2-3 2-3-2-3 .2-1.2-2.8L2 15l1-3-1-3 2.8-1.4L6 4.8 9 5z"/><path d="m8.5 12 2.2 2.2L16 9"/><path d="m7 18-2 5 5-2M17 18l2 5-5-2"/>')},
    {id:'ocorrencias',label:'Livro de Ocorrências',icon:svg('<path d="M3 5h7a4 4 0 0 1 4 4v12H7a4 4 0 0 0-4 2z"/><path d="M21 5h-7a4 4 0 0 0-4 4v12h7a4 4 0 0 1 4 2z"/><path d="M6 9h4M6 12h4M14 9h4M14 12h4M14 15h3"/>')},
    {id:'avisos',label:'Quadro de Avisos',icon:svg('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7h20M5 10h14M5 13h14M5 16h4"/><path d="m13 10 3 6h-6z"/><path d="M13 12.5v1.5M13 15.5h.01"/>')},
    {id:'configuracoes',label:'Configurar Dados do Usuário',icon:svg('<circle cx="9" cy="8" r="3"/><path d="M4 18c1-4 9-4 10 0"/><circle cx="18" cy="17" r="3"/><path d="M18 12v2M18 20v2M13 17h2M21 17h2"/>')}
  ];

  const defaults=Object.fromEntries(modules.map(m=>[m.id,toData(m.icon)]));
  function load(){try{return JSON.parse(localStorage.getItem(STORAGE)||'{}')||{};}catch(e){return {};}}
  let custom=load();
  function persist(){try{localStorage.setItem(STORAGE,JSON.stringify(custom));return true;}catch(e){return false;}}
  function get(id){return custom[id]||defaults[id]||defaults.manual;}
  function getDefault(id){return defaults[id]||defaults.manual;}
  function set(id,data){if(!defaults[id]||!data)return false;custom[id]=data;if(!persist()){delete custom[id];return false;}apply();return true;}
  function reset(id){if(!defaults[id])return;delete custom[id];persist();apply();}
  function resetAll(){custom={};persist();apply();}
  function isCustom(id){return !!custom[id];}

  function imgFor(id){const img=document.createElement('img');img.src=get(id);img.alt=modules.find(m=>m.id===id)?.label||'Ícone';img.draggable=false;img.className='imo-tool-icon-img';return img;}
  function replace(container,id){if(!container)return;const src=get(id);if(container.dataset.imoToolIcon===src)return;container.dataset.imoToolIcon=src;container.replaceChildren(imgFor(id));}

  function apply(root=document){
    modules.forEach(m=>{
      root.querySelectorAll?.(`.imo-shortcut[data-page="${m.id}"] .imo-shortcut-icon`).forEach(el=>replace(el,m.id));
      root.querySelectorAll?.(`#navMenu .nav-item[data-page="${m.id}"] span:first-child`).forEach(el=>replace(el,m.id));
    });
    root.querySelectorAll?.('.imo-open-ticket > span:first-child').forEach(el=>replace(el,'assistencia'));
  }

  const style=document.createElement('style');
  style.textContent=`
    .imo-tool-icon-img{display:block!important;width:100%!important;height:100%!important;object-fit:contain!important;max-width:100%!important;max-height:100%!important;filter:none!important;opacity:1!important}
    body.resident-mode .imo-shortcut-icon .imo-tool-icon-img{width:48px!important;height:44px!important;margin:auto!important}
    body.resident-mode #navMenu .nav-item>span:first-child .imo-tool-icon-img{width:31px!important;height:29px!important;margin:auto!important}
    body.resident-mode .imo-open-ticket>span:first-child .imo-tool-icon-img{width:22px!important;height:22px!important}
  `;
  document.head.appendChild(style);

  window.imoToolIcons={modules,get,getDefault,set,reset,resetAll,isCustom,apply};
  window.addEventListener('load',()=>{apply();setTimeout(apply,150);setTimeout(apply,500);});
  let queued=false;
  new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply();});}).observe(document.body,{childList:true,subtree:true});
})();
