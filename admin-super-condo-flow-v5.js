/* IMO — Super Admin V5: fluxo centralizado por condomínio */
(function(){
  if(window.__IMO_ADMIN_CONDO_FLOW_V5__) return;
  window.__IMO_ADMIN_CONDO_FLOW_V5__=true;

  const STORAGE='imo_admin_condos_v3';
  const DEFAULT_MODULES=['furacao','videos','databook','assistencia','reformas','planos_manutencao','garantias','reservas','ocorrencias','avisos'];
  const MODULES=[
    ['furacao','Plantas de Furação',true],['dwg','Plantas de Furação (DWG)',false],['videos','Vídeos',true],
    ['databook','Databook',true],['databook_usuarios','Databook (usuários)',false],['assistencia','Assistência Técnica',true],
    ['reformas','Planos de Reforma',true],['planos_manutencao','Planos de Manutenção',true],['manutencao_unidades','Manutenção de Unidades',false],
    ['garantias','Gestão das Garantias',true],['reservas','Agendamento de Espaços',true],['ocorrencias','Livro de Ocorrências',true],['avisos','Quadro de Avisos',true]
  ];
  const MAINTENANCE_BASE=[
    ['hidraulica-agua','Hidráulica','Água potável'],
    ['incendio-bombas','Combate a incêndio','Bombas'],
    ['eletrica-instalacoes','Elétrica','Instalações'],
    ['seguranca-detectores','Segurança','Detectores e alarmes'],
    ['esquadrias-aluminio','Esquadrias','Alumínio'],
    ['fachada-pintada','Fachada','Pintada']
  ];

  const qs=s=>document.querySelector(s), qsa=s=>[...document.querySelectorAll(s)];
  function isAdmin(){try{return currentUser==='admin';}catch(e){return false;}}
  function esc(v=''){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function load(){try{const d=JSON.parse(localStorage.getItem(STORAGE)||'[]');return Array.isArray(d)?d:[];}catch(e){return[];}}
  function save(d){localStorage.setItem(STORAGE,JSON.stringify(d));}
  function uid(){return 'condo-'+Date.now()+'-'+Math.random().toString(36).slice(2,7);}
  function today(){return new Date().toISOString().slice(0,10);}
  function endDate(start,years){if(!start||years==='custom')return '';const d=new Date(start+'T12:00:00');d.setFullYear(d.getFullYear()+Number(years));d.setDate(d.getDate()-1);return d.toISOString().slice(0,10);}
  function toastMsg(m){try{if(typeof toast==='function')toast(m);}catch(e){}}

  function patchAdminNav(){
    try{
      NAV.admin=[
        ['OPERAÇÃO',[['dashboard','⌂','Centro de Operações'],['condominios','▣','Condomínios'],['incorporadoras','◆','Incorporadoras'],['atendimento','◉','Central de atendimento']]],
        ['CADASTROS GERAIS',[['rotinas','↻','Base de manutenção'],['usuarios','◎','Usuários & acessos']]],
        ['PLATAFORMA',[['configuracoes','⚙','Configurações']]]
      ];
      if(isAdmin()&&typeof buildNav==='function')buildNav();
    }catch(e){}
  }

  function section(n,title,desc,body){
    return `<section class="imo-reg-section" id="imoRegStep${n}"><header><span>${n}</span><div><h3>${title}</h3><p>${desc}</p></div></header><div class="imo-reg-grid">${body}</div></section>`;
  }

  function field(label,html,wide=''){return `<label class="${wide}"><span>${label}</span>${html}</label>`;}

  function renderRegistration(){
    if(!isAdmin())return;
    const c=qs('#content'); if(!c)return;
    try{currentPage='condominios';}catch(e){}
    qsa('#navMenu .nav-item[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page==='condominios'));
    qs('#pageTitle')&&(qs('#pageTitle').textContent='Cadastrar condomínio');
    qs('#breadcrumb')&&(qs('#breadcrumb').textContent='IMO / Super Admin / Condomínios / Novo cadastro');

    const d=today(), contractEnd=endDate(d,'5');
    c.className='imo-reg-page';
    c.innerHTML=`
      <div class="imo-reg-top"><div><button type="button" id="imoRegBack">← Voltar para condomínios</button><span class="eyebrow">NOVO CONDOMÍNIO</span><h1>Cadastro completo do condomínio</h1><p>Configure o empreendimento inteiro primeiro. Depois de salvar, os PDFs e arquivos são carregados pelas ferramentas da listagem.</p></div><button class="action-btn primary" id="imoRegSaveTop">Salvar condomínio</button></div>
      <nav class="imo-reg-nav">${['Dados','Síndico','Incorporadora','Contrato','Estrutura & Habite-se','Ferramentas','Planos de manutenção','Configurações'].map((x,i)=>`<button type="button" data-step="${i+1}"><b>${i+1}</b><span>${x}</span></button>`).join('')}</nav>
      <form id="imoRegForm">
        ${section(1,'Dados do condomínio','Identificação principal e endereço do empreendimento.',
          field('Nome do condomínio','<input id="regName" required>','span2')+
          field('Código / referência','<input id="regCode">')+
          field('CNPJ','<input id="regCnpj">')+
          field('Construtora','<input id="regBuilder">','span2')+
          field('Tipologia','<select id="regType"><option>Vertical</option><option>Horizontal</option><option>Misto</option><option>Garden</option><option>Vertical + Garden</option></select>')+
          field('Quantidade de unidades','<input id="regUnits" type="number" min="0" value="0">')+
          field('Endereço','<input id="regAddress">','span2')+
          field('Número','<input id="regNumber">')+
          field('Complemento','<input id="regComplement">')+
          field('Bairro','<input id="regNeighborhood">')+
          field('Cidade','<input id="regCity">')+
          field('UF','<input id="regState" maxlength="2" value="SP">')
        )}
        ${section(2,'Síndico','O síndico já nasce vinculado a este condomínio.',
          field('Nome completo','<input id="regSindName">','span2')+
          field('Telefone','<input id="regSindPhone">')+
          field('E-mail','<input id="regSindEmail" type="email">')
        )}
        ${section(3,'Incorporadora','Selecione ou cadastre a incorporadora responsável pelo condomínio.',
          field('Incorporadora','<input id="regIncName" list="imoIncList" required><datalist id="imoIncList"></datalist>','span2')+
          field('Responsável / contato','<input id="regIncContact">')+
          field('Telefone','<input id="regIncPhone">')+
          field('E-mail','<input id="regIncEmail" type="email">','span2')+
          '<div class="imo-reg-note span2">Se a incorporadora já existir, ela será vinculada. Se for nova, estes dados ficam preparados para o cadastro definitivo.</div>'
        )}
        ${section(4,'Contrato','O contrato faz parte do cadastro do condomínio.',
          field('Data de cadastro',`<input id="regDate" type="date" value="${d}">`)+
          field('Prazo','<select id="regTerm"><option value="2">2 anos</option><option value="5" selected>5 anos • padrão IMO</option><option value="10">10 anos</option><option value="15">15 anos</option><option value="custom">Personalizado</option></select>')+
          field('Data limite do contrato',`<input id="regContractEnd" type="date" value="${contractEnd}">`)+
          field('Status','<select id="regStatus"><option>ATIVO</option><option>RENOVAÇÃO</option><option>ENCERRADO</option></select>')
        )}
        ${section(5,'Estrutura e Habite-se','O Habite-se é o marco que inicia o cronograma das manutenções.',
          field('Tipos de unidade','<input id="regUnitTypes" value="TIPO" placeholder="TIPO, Garden, Cobertura">','span2')+
          field('Blocos / torres','<input id="regBlocks" placeholder="Bloco A, Bloco B">','span2')+
          field('Habite-se principal','<input id="regHabite" type="date">')+
          field('Norma','<select id="regNorm"><option value="antiga">Antiga</option><option value="nova">Nova</option></select>')+
          '<div class="imo-reg-note span2"><b>Regra:</b> as manutenções selecionadas abaixo começam a contar a partir do Habite-se correspondente.</div>'
        )}
        ${section(6,'Ferramentas e módulos contratados','Marque o que este condomínio realmente utilizará. Os itens opcionais permanecem desmarcados.',
          '<div class="imo-reg-modules span2">'+MODULES.map(([id,label,on])=>`<label><input type="checkbox" data-reg-module="${id}" ${on?'checked':''}><span>${label}</span></label>`).join('')+'</div>'+
          '<div class="imo-reg-note span2">Esses módulos controlam o que aparecerá depois nos painéis de Incorporadora, Síndico e Morador.</div>'
        )}
        ${section(7,'Planos de manutenção do condomínio','Selecione, a partir da base padrão do sistema, quais sistemas/subsistemas pertencem a este condomínio.',
          '<div class="imo-maint-select span2">'+MAINTENANCE_BASE.map(([id,sys,sub])=>`<label><input type="checkbox" data-reg-maint="${id}"><span><b>${sys}</b><small>${sub}</small></span></label>`).join('')+'</div>'+
          '<div class="imo-reg-note span2">Aqui não se cria uma rotina nova. O Super Admin apenas seleciona itens da base mestre já cadastrada no sistema.</div>'
        )}
        ${section(8,'Configurações operacionais','Preferências iniciais do condomínio.',
          field('Sistema de Assistência','<select id="regAssistance"><option>Sistema IMO</option><option>Externo</option><option>Não utilizado</option></select>')+
          field('Limite da incorporadora (MB)','<input id="regUploadLimit" type="number" value="300">')+
          '<label class="imo-reg-check span2"><input id="regMaintEmail" type="checkbox" checked><span>Enviar e-mails do plano de manutenção</span></label>'+
          '<div class="imo-reg-access span2"><b>Regras de acesso a documentos</b><p>Morador/proprietário vê somente documentos do condomínio/unidade vinculados ao perfil; Síndico vê os documentos do condomínio permitidos ao síndico; Incorporadora vê os documentos dos condomínios vinculados; Super Admin vê tudo.</p></div>'
        )}
        <div class="imo-reg-actions"><button type="button" id="imoRegCancel">Cancelar</button><button type="submit" class="action-btn primary">Salvar condomínio e voltar para a listagem</button></div>
      </form>`;

    const known=[...new Set(load().map(x=>x.inc).filter(Boolean))];
    const dl=qs('#imoIncList'); if(dl)dl.innerHTML=known.map(x=>`<option value="${esc(x)}"></option>`).join('');

    const reg=qs('#regDate'),term=qs('#regTerm'),end=qs('#regContractEnd');
    const auto=()=>{if(term.value!=='custom')end.value=endDate(reg.value,term.value);};
    reg.onchange=auto;term.onchange=auto;

    qsa('.imo-reg-nav [data-step]').forEach(b=>b.onclick=()=>qs('#imoRegStep'+b.dataset.step)?.scrollIntoView({behavior:'smooth',block:'start'}));
    const back=()=>window.renderAdminCondosV4?.();
    qs('#imoRegBack').onclick=back;qs('#imoRegCancel').onclick=back;
    qs('#imoRegSaveTop').onclick=()=>qs('#imoRegForm')?.requestSubmit();

    qs('#imoRegForm').onsubmit=e=>{
      e.preventDefault();
      const name=qs('#regName').value.trim(); if(!name){toastMsg('Informe o nome do condomínio.');return;}
      const modules=qsa('[data-reg-module]:checked').map(i=>i.dataset.regModule);
      const maintIds=qsa('[data-reg-maint]:checked').map(i=>i.dataset.regMaint);
      const maint=MAINTENANCE_BASE.filter(x=>maintIds.includes(x[0])).map(x=>({id:x[0],system:x[1],subsystem:x[2],name:x[1]+' • '+x[2],frequency:'Base IMO',active:true}));
      const x={
        id:uid(),code:qs('#regCode').value.trim(),name,cnpj:qs('#regCnpj').value.trim(),type:qs('#regType').value,builder:qs('#regBuilder').value.trim(),
        inc:qs('#regIncName').value.trim(),incContact:qs('#regIncContact').value.trim(),incPhone:qs('#regIncPhone').value.trim(),incEmail:qs('#regIncEmail').value.trim(),
        sind:qs('#regSindName').value.trim(),sindPhone:qs('#regSindPhone').value.trim(),sindEmail:qs('#regSindEmail').value.trim(),units:Number(qs('#regUnits').value||0),
        registrationDate:qs('#regDate').value,termYears:qs('#regTerm').value,contractEnd:qs('#regContractEnd').value,status:qs('#regStatus').value,
        address:qs('#regAddress').value.trim(),number:qs('#regNumber').value.trim(),complement:qs('#regComplement').value.trim(),neighborhood:qs('#regNeighborhood').value.trim(),city:qs('#regCity').value.trim(),state:qs('#regState').value.trim().toUpperCase(),
        unitTypes:qs('#regUnitTypes').value.split(',').map(s=>s.trim()).filter(Boolean),blocks:qs('#regBlocks').value.split(',').map(s=>s.trim()).filter(Boolean),
        habiteSe:qs('#regHabite').value?[qs('#regHabite').value]:[],norm:qs('#regNorm').value,modules,maintenancePlans:maint,
        maintenanceEmail:qs('#regMaintEmail').checked,assistanceSystem:qs('#regAssistance').value,uploadLimit:Number(qs('#regUploadLimit').value||300),
        files:[],customManuals:[],tickets:[],reservations:[],warranties:[],notices:[],occurrences:[]
      };
      if(!x.unitTypes.includes('TIPO'))x.unitTypes.unshift('TIPO');
      const data=load();data.unshift(x);save(data);
      toastMsg('Condomínio cadastrado. Agora use as ferramentas da listagem para carregar documentos e administrar os módulos.');
      back();
    };
  }

  function openTool(row,tab){
    row.click();
    setTimeout(()=>document.querySelector('[data-av4-tab="'+tab+'"]')?.click(),30);
  }

  function patchList(){
    if(!isAdmin())return;
    const hero=qs('.admin-condos-v4 .av4-hero');
    if(hero){
      const p=hero.querySelector('p'); if(p)p.textContent='Cadastre o condomínio completo e, depois, use as ferramentas da listagem para documentos, manutenção e acessos.';
      const btn=hero.querySelector('#av4New');if(btn){btn.textContent='＋ Cadastrar novo condomínio';btn.dataset.v5New='1';}
    }
    qsa('.admin-condos-v4 tbody tr[data-open-condo]').forEach(row=>{
      const cell=row.lastElementChild;if(!cell||cell.dataset.v5Tools==='1')return;
      cell.dataset.v5Tools='1';
      cell.innerHTML=`<div class="imo-list-tools">
        <button type="button" data-v5-tool="dados">Cadastro</button>
        <button type="button" data-v5-tool="arquivos">Arquivos / PDFs</button>
        <button type="button" data-v5-tool="manutencoes">Manutenção</button>
        <button type="button" data-v5-role="sindico">Ver como Síndico</button>
        <button type="button" data-v5-role="incorporadora">Ver como Incorporadora</button>
      </div>`;
    });
  }

  document.addEventListener('click',e=>{
    const n=e.target.closest('#av4New[data-v5-new],#av4New');
    if(n&&isAdmin()){e.preventDefault();e.stopImmediatePropagation();renderRegistration();return;}
    const t=e.target.closest('[data-v5-tool]');
    if(t&&isAdmin()){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();const row=t.closest('tr[data-open-condo]');if(row)openTool(row,t.dataset.v5Tool);return;}
    const r=e.target.closest('[data-v5-role]');
    if(r&&isAdmin()){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();const row=r.closest('tr[data-open-condo]');const name=row?.querySelector('td:nth-child(2) strong')?.textContent?.trim()||'Condomínio';window.impersonate?.(r.dataset.v5Role,name);}
  },true);

  const oldStart=window.startApp;
  if(typeof oldStart==='function'){
    window.startApp=function(username){patchAdminNav();const out=oldStart.apply(this,arguments);if(username==='admin')setTimeout(()=>{patchAdminNav();patchList();},0);return out;};
    try{startApp=window.startApp;}catch(e){}
  }

  let queued=false;
  new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;patchList();});}).observe(document.body,{childList:true,subtree:true});
  window.addEventListener('load',()=>{patchAdminNav();setTimeout(patchList,120);});
  patchAdminNav();setTimeout(patchList,0);
})();