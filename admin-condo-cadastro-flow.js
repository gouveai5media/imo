/* IMO — refinamento do fluxo de cadastro do condomínio */
(function(){
  if(window.__IMO_CONDO_CADASTRO_FLOW__) return;
  window.__IMO_CONDO_CADASTRO_FLOW__=true;

  function isAdmin(){
    try{return currentUser==='admin';}catch(e){return false;}
  }

  function labelById(form,id){
    const field=form.querySelector('#'+id);
    return field?.closest('label') || null;
  }

  function section(icon,title,desc,labels,extra='',id=''){
    const box=document.createElement('section');
    box.className='av4-cadastro-section';
    if(id) box.id=id;
    box.innerHTML=`<header><span class="av4-cadastro-icon">${icon}</span><div><h4>${title}</h4><p>${desc}</p></div></header><div class="av4-cadastro-grid"></div>${extra}`;
    const grid=box.querySelector('.av4-cadastro-grid');
    labels.filter(Boolean).forEach(label=>grid.appendChild(label));
    return box;
  }

  function buildNavigator(panel,wrap,steps){
    if(panel.querySelector('.av4-cadastro-nav')) return;
    const nav=document.createElement('div');
    nav.className='av4-cadastro-nav';
    nav.innerHTML=`<div class="av4-cadastro-nav-head"><div><strong>Navegação do cadastro</strong><span>Use as etapas para ir direto ao bloco desejado.</span></div><div class="av4-cadastro-progress"><b id="av4CadastroCurrent">1</b><span>/ ${steps.length}</span></div></div><div class="av4-cadastro-nav-track">${steps.map((s,i)=>`<button type="button" data-cadastro-target="${s.id}" class="${i===0?'active':''}"><span>${i+1}</span><b>${s.label}</b></button>`).join('')}</div>`;
    wrap.before(nav);

    const buttons=[...nav.querySelectorAll('[data-cadastro-target]')];
    buttons.forEach(btn=>btn.onclick=()=>{
      const target=document.getElementById(btn.dataset.cadastroTarget);
      if(!target)return;
      target.scrollIntoView({behavior:'smooth',block:'start'});
      buttons.forEach(b=>b.classList.toggle('active',b===btn));
      const current=nav.querySelector('#av4CadastroCurrent');
      if(current) current.textContent=String(buttons.indexOf(btn)+1);
      btn.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});
    });

    const observer=new IntersectionObserver(entries=>{
      const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(!visible)return;
      const btn=buttons.find(b=>b.dataset.cadastroTarget===visible.target.id);
      if(!btn)return;
      buttons.forEach(b=>b.classList.toggle('active',b===btn));
      const current=nav.querySelector('#av4CadastroCurrent');
      if(current) current.textContent=String(buttons.indexOf(btn)+1);
      btn.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});
    },{rootMargin:'-26% 0px -58% 0px',threshold:[0,.2,.4,.6]});
    steps.forEach(s=>{const el=document.getElementById(s.id);if(el)observer.observe(el);});
  }

  function refine(){
    if(!isAdmin()) return;
    const save=document.querySelector('#v4SaveData');
    const form=document.querySelector('.admin-condos-v4 .av4-form');
    const panel=save?.closest('.av4-panel');
    if(!save || !form || !panel || form.dataset.cadastroRefined==='1') return;
    form.dataset.cadastroRefined='1';

    const title=panel.querySelector('.av4-panel-head h3');
    const desc=panel.querySelector('.av4-panel-head p');
    if(title) title.textContent='Cadastro do condomínio';
    if(desc) desc.textContent='Cadastro organizado em etapas, com navegação rápida no topo e um único salvamento no final.';

    document.querySelectorAll('[data-av4-tab="dados"] b').forEach(el=>el.textContent='Cadastro');

    const steps=[
      {id:'cadastro-dados',label:'Dados'},
      {id:'cadastro-endereco',label:'Endereço'},
      {id:'cadastro-sindico',label:'Síndico'},
      {id:'cadastro-incorporadora',label:'Incorporadora'},
      {id:'cadastro-config',label:'Configurações'}
    ];

    const blocks=[];
    blocks.push(section('▤','Dados do condomínio','Identificação principal e características do empreendimento.',[
      labelById(form,'v4-name'),labelById(form,'v4-code'),labelById(form,'v4-cnpj'),labelById(form,'v4-builder'),labelById(form,'v4-type'),labelById(form,'v4-units')
    ],'',steps[0].id));

    blocks.push(section('⌂','Endereço do empreendimento','Localização física do condomínio.',[
      labelById(form,'v4-address'),labelById(form,'v4-number'),labelById(form,'v4-complement'),labelById(form,'v4-neighborhood'),labelById(form,'v4-city'),labelById(form,'v4-state')
    ],'',steps[1].id));

    blocks.push(section('◎','Cadastro do síndico','Responsável vinculado ao condomínio. Os dados existentes serão trazidos da base antiga.',[
      labelById(form,'v4-sind'),labelById(form,'v4-sind-phone'),labelById(form,'v4-sind-email')
    ],'',steps[2].id));

    blocks.push(section('◆','Cadastro da incorporadora','Vínculo da incorporadora responsável pelo empreendimento.',[
      labelById(form,'v4-inc')
    ],`<div class="av4-cadastro-note"><b>Importante</b><span>Os demais dados cadastrais e acessos da incorporadora serão vinculados ao cadastro existente durante a migração do banco legado.</span></div>`,steps[3].id));

    blocks.push(section('⚙','Configurações iniciais','Regras operacionais que já nascem definidas no cadastro do condomínio.',[
      labelById(form,'v4-assistance-system'),labelById(form,'v4-upload-limit')
    ],`<div class="av4-default-rule"><span>✓</span><div><b>Manutenções do condomínio</b><small>Ativado por padrão no cadastro. As rotinas pré-definidas serão selecionadas conforme o empreendimento.</small></div></div>`,steps[4].id));

    const wrap=document.createElement('div');
    wrap.className='av4-cadastro-flow';
    blocks.forEach(b=>wrap.appendChild(b));
    form.replaceWith(wrap);
    buildNavigator(panel,wrap,steps);

    const action=save.closest('.av4-actions');
    if(action){
      const hint=document.createElement('div');
      hint.className='av4-save-hint';
      hint.innerHTML='<b>Cadastro único</b><span>Navegue pelas etapas acima, revise os dados e salve tudo de uma vez.</span>';
      action.prepend(hint);
      action.classList.add('av4-cadastro-actions');
    }
  }

  let scheduled=false;
  function schedule(){
    if(scheduled) return;
    scheduled=true;
    requestAnimationFrame(()=>{scheduled=false;refine();});
  }

  new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
  window.addEventListener('load',()=>{refine();setTimeout(refine,120);});
  refine();

  if(!document.querySelector('script[data-imo-module-defaults]')){
    const script=document.createElement('script');
    script.src='admin-condo-module-defaults.js?v=20260821-1004';
    script.dataset.imoModuleDefaults='1';
    document.body.appendChild(script);
  }

  if(!document.querySelector('link[data-imo-legacy-docs]')){
    const css=document.createElement('link');
    css.rel='stylesheet';
    css.href='admin-legacy-documents.css?v=20260825-1625';
    css.dataset.imoLegacyDocs='1';
    document.head.appendChild(css);
  }
  if(!document.querySelector('script[data-imo-legacy-docs]')){
    const script=document.createElement('script');
    script.src='admin-legacy-documents.js?v=20260825-1625';
    script.dataset.imoLegacyDocs='1';
    document.body.appendChild(script);
  }
})();
