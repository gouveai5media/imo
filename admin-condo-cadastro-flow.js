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

  function section(icon,title,desc,labels,extra=''){
    const box=document.createElement('section');
    box.className='av4-cadastro-section';
    box.innerHTML=`<header><span class="av4-cadastro-icon">${icon}</span><div><h4>${title}</h4><p>${desc}</p></div></header><div class="av4-cadastro-grid"></div>${extra}`;
    const grid=box.querySelector('.av4-cadastro-grid');
    labels.filter(Boolean).forEach(label=>grid.appendChild(label));
    return box;
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
    if(desc) desc.textContent='Cadastro organizado por blocos, mantendo tudo na mesma tela e um único salvamento no final.';

    document.querySelectorAll('[data-av4-tab="dados"] b').forEach(el=>el.textContent='Cadastro');

    const blocks=[];
    blocks.push(section('▤','Dados do condomínio','Identificação principal e características do empreendimento.',[
      labelById(form,'v4-name'),labelById(form,'v4-code'),labelById(form,'v4-cnpj'),labelById(form,'v4-builder'),labelById(form,'v4-type'),labelById(form,'v4-units')
    ]));

    blocks.push(section('⌂','Endereço do empreendimento','Localização física do condomínio.',[
      labelById(form,'v4-address'),labelById(form,'v4-number'),labelById(form,'v4-complement'),labelById(form,'v4-neighborhood'),labelById(form,'v4-city'),labelById(form,'v4-state')
    ]));

    blocks.push(section('◎','Cadastro do síndico','Responsável vinculado ao condomínio. Os dados existentes serão trazidos da base antiga.',[
      labelById(form,'v4-sind'),labelById(form,'v4-sind-phone'),labelById(form,'v4-sind-email')
    ]));

    blocks.push(section('◆','Cadastro da incorporadora','Vínculo da incorporadora responsável pelo empreendimento.',[
      labelById(form,'v4-inc')
    ],`<div class="av4-cadastro-note"><b>Importante</b><span>Os demais dados cadastrais e acessos da incorporadora serão vinculados ao cadastro existente durante a migração do banco legado.</span></div>`));

    blocks.push(section('⚙','Configurações iniciais','Regras operacionais que já nascem definidas no cadastro do condomínio.',[
      labelById(form,'v4-assistance-system'),labelById(form,'v4-upload-limit')
    ],`<div class="av4-default-rule"><span>✓</span><div><b>Manutenções do condomínio</b><small>Ativado por padrão no cadastro. As rotinas pré-definidas serão selecionadas conforme o empreendimento.</small></div></div>`));

    const wrap=document.createElement('div');
    wrap.className='av4-cadastro-flow';
    blocks.forEach(b=>wrap.appendChild(b));
    form.replaceWith(wrap);

    const action=save.closest('.av4-actions');
    if(action){
      const hint=document.createElement('div');
      hint.className='av4-save-hint';
      hint.innerHTML='<b>Cadastro único</b><span>Revise os blocos acima e salve todas as informações de uma vez.</span>';
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

  // Carrega a política contratual dos módulos depois de todas as camadas do Super Admin.
  if(!document.querySelector('script[data-imo-module-defaults]')){
    const script=document.createElement('script');
    script.src='admin-condo-module-defaults.js?v=20260821-1004';
    script.dataset.imoModuleDefaults='1';
    document.body.appendChild(script);
  }
})();
