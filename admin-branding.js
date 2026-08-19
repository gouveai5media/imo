/* IMO — Configurações > Identidade Visual e ícones das ferramentas */
(function(){
  if(window.__IMO_ADMIN_BRANDING__) return;
  window.__IMO_ADMIN_BRANDING__=true;

  let pendingLogo='';
  let pendingFavicon='';
  let logoChanged=false;
  let faviconChanged=false;
  let pendingTools={};
  let changedTools=new Set();

  function isAdmin(){try{return currentUser==='admin';}catch(e){return false;}}
  function branding(){return window.imoBranding||null;}
  function toolIcons(){return window.imoToolIcons||null;}
  function content(){return document.getElementById('content');}

  function prepare(){
    try{currentPage='configuracoes';}catch(e){}
    document.querySelectorAll('#navMenu .nav-item[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page==='configuracoes'));
    document.getElementById('sidebar')?.classList.remove('open');
    const title=document.getElementById('pageTitle');
    const crumb=document.getElementById('breadcrumb');
    if(title) title.textContent='Identidade Visual';
    if(crumb) crumb.textContent='IMO / Super Admin / Configurações / Identidade Visual';
  }

  function currentLogo(){return branding()?.getLogo?.()||'logo-oficial.svg';}
  function currentFavicon(){return branding()?.getFavicon?.()||currentLogo();}
  function toastMsg(msg){if(typeof toast==='function')toast(msg);}
  function setSaveEnabled(){const b=document.getElementById('brandSave');if(b)b.disabled=!(logoChanged||faviconChanged||changedTools.size);}

  function toolCards(){
    const api=toolIcons();
    if(!api) return '<div class="brand-file-note"><span>!</span><p>Gerenciador de ícones não carregado.</p></div>';
    return api.modules.map(m=>{
      const custom=api.isCustom(m.id);
      return `<article class="tool-brand-card" data-tool-card="${m.id}">
        <div class="tool-icon-preview"><img id="toolPreview-${m.id}" src="${api.get(m.id)}" alt="${m.label}"></div>
        <div class="tool-card-copy"><strong>${m.label}</strong><span class="tool-origin" id="toolOrigin-${m.id}">${custom?'Personalizado':'Ícone padrão'}</span></div>
        <div class="tool-card-actions">
          <label class="tool-upload-mini" title="Trocar ícone">↑<input type="file" id="toolInput-${m.id}" data-tool-input="${m.id}" accept="image/png,image/svg+xml,image/webp" hidden></label>
          <button type="button" class="tool-reset-mini" data-tool-reset="${m.id}" title="Restaurar ícone padrão">↺</button>
        </div>
      </article>`;
    }).join('');
  }

  function render(){
    if(!isAdmin()) return;
    prepare();
    pendingLogo=currentLogo();
    pendingFavicon=currentFavicon();
    logoChanged=false;faviconChanged=false;
    changedTools=new Set();
    pendingTools={};
    const api=toolIcons();
    api?.modules.forEach(m=>pendingTools[m.id]=api.get(m.id));

    const c=content();if(!c)return;
    c.className='branding-page';
    c.innerHTML=`
      <section class="branding-hero">
        <div><span class="branding-pill">CONFIGURAÇÕES DA PLATAFORMA</span><h1>Identidade Visual</h1><p>Gerencie o logo da IMO e os ícones das ferramentas. As alterações são aplicadas automaticamente em todos os ambientes compatíveis da plataforma.</p></div>
        <span class="brand-demo-badge"><i></i> Ambiente de demonstração</span>
      </section>

      <section class="branding-scope">
        ${[['⌂','Login','Tela de acesso'],['◎','Super Admin','Gestão IMO'],['◆','Incorporadora','Empreendimentos'],['▣','Síndico','Condomínio'],['◉','Morador','Unidade']].map(x=>`<div class="scope-item"><span class="scope-icon">${x[0]}</span><div><b>${x[1]}</b><span>${x[2]}</span></div></div>`).join('')}
      </section>

      <section class="branding-grid">
        <article class="branding-card">
          <div class="branding-card-head"><div><h3>Logo principal</h3><p>Utilizado nos cabeçalhos, login e identificação da plataforma.</p></div><span class="branding-status">ATIVO</span></div>
          <div class="brand-preview-stage"><img id="brandLogoPreview" src="${currentLogo()}" alt="Pré-visualização do logo"></div>
          <div class="brand-preview-caption"><span>Pré-visualização em fundo institucional</span><strong>Proporção preservada automaticamente</strong></div>
          <div class="brand-upload-row">
            <label class="brand-upload-btn">↑ Selecionar novo logo<input id="brandLogoInput" type="file" accept="image/png,image/svg+xml,image/webp" hidden></label>
            <button type="button" class="brand-reset-btn" id="brandResetLogo">Restaurar logo original IMO</button>
          </div>
          <div class="brand-file-note"><span>i</span><p><b>Formatos aceitos:</b> PNG, SVG ou WebP, com até 1,5 MB. O sistema mantém a proporção original da marca.</p></div>
        </article>

        <article class="branding-card">
          <div class="branding-card-head"><div><h3>Ícone do navegador</h3><p>Favicon exibido na aba do navegador e atalhos.</p></div><span class="branding-status">OPCIONAL</span></div>
          <div class="favicon-preview"><div class="favicon-box"><img id="brandFaviconPreview" src="${currentFavicon()}" alt="Pré-visualização do favicon"></div><small>Prévia da aba do navegador</small></div>
          <div class="brand-upload-row">
            <label class="brand-upload-btn">↑ Selecionar favicon<input id="brandFaviconInput" type="file" accept="image/png,image/svg+xml,image/x-icon,image/vnd.microsoft.icon" hidden></label>
            <button type="button" class="brand-reset-btn" id="brandResetFavicon">Usar logo principal</button>
          </div>
          <div class="brand-file-note"><span>i</span><p>Recomendamos uma arte quadrada. Na versão real, o arquivo será armazenado no Supabase Storage.</p></div>
        </article>
      </section>

      <section class="branding-card branding-tools-section">
        <div class="branding-card-head tools-head"><div><h3>Ícones das ferramentas</h3><p>Troque individualmente os ícones dos módulos exibidos no Acesso Rápido e no menu lateral. O nome e a função da ferramenta não são alterados.</p></div><button type="button" class="brand-reset-btn tools-reset-all" id="toolsResetAll">Restaurar todos os ícones</button></div>
        <div class="tools-grid">${toolCards()}</div>
        <div class="brand-file-note"><span>i</span><p><b>Recomendação:</b> use SVG com fundo transparente para manter o padrão visual. PNG e WebP também são aceitos. Na demonstração, cada ícone deve ter no máximo 500 KB.</p></div>
      </section>

      <div class="branding-actions"><button type="button" class="brand-reset-btn" id="brandDiscard">Descartar alterações</button><button type="button" class="brand-save-btn" id="brandSave" disabled>Salvar identidade visual</button></div>`;

    wire();
  }

  function readImage(file,kind,id){
    if(!file)return;
    const allowedLogo=['image/png','image/svg+xml','image/webp'];
    const allowedFav=['image/png','image/svg+xml','image/x-icon','image/vnd.microsoft.icon'];
    const allowedTool=['image/png','image/svg+xml','image/webp'];
    const allowed=kind==='logo'?allowedLogo:kind==='favicon'?allowedFav:allowedTool;
    if(!allowed.includes(file.type)){toastMsg(kind==='favicon'?'Use PNG, SVG ou ICO.':'Use PNG, SVG ou WebP.');return;}
    const limit=kind==='tool'?500*1024:1.5*1024*1024;
    if(file.size>limit){toastMsg(kind==='tool'?'O ícone deve ter no máximo 500 KB.':'O arquivo deve ter no máximo 1,5 MB.');return;}
    const reader=new FileReader();
    reader.onload=()=>{
      const data=String(reader.result||'');
      if(kind==='logo'){
        pendingLogo=data;logoChanged=true;
        const p=document.getElementById('brandLogoPreview');if(p)p.src=data;
        if(!faviconChanged){pendingFavicon=data;const f=document.getElementById('brandFaviconPreview');if(f)f.src=data;}
      }else if(kind==='favicon'){
        pendingFavicon=data;faviconChanged=true;
        const p=document.getElementById('brandFaviconPreview');if(p)p.src=data;
      }else if(id){
        pendingTools[id]=data;changedTools.add(id);
        const p=document.getElementById(`toolPreview-${id}`);if(p)p.src=data;
        const o=document.getElementById(`toolOrigin-${id}`);if(o){o.textContent='Alterado • não salvo';o.classList.add('pending');}
      }
      setSaveEnabled();
    };
    reader.readAsDataURL(file);
  }

  function wire(){
    document.getElementById('brandLogoInput')?.addEventListener('change',e=>readImage(e.target.files?.[0],'logo'));
    document.getElementById('brandFaviconInput')?.addEventListener('change',e=>readImage(e.target.files?.[0],'favicon'));

    document.querySelectorAll('[data-tool-input]').forEach(input=>input.addEventListener('change',e=>readImage(e.target.files?.[0],'tool',input.dataset.toolInput)));
    document.querySelectorAll('[data-tool-reset]').forEach(btn=>btn.addEventListener('click',()=>{
      const id=btn.dataset.toolReset;const api=toolIcons();if(!id||!api)return;
      pendingTools[id]=api.getDefault(id);changedTools.add(id);
      const p=document.getElementById(`toolPreview-${id}`);if(p)p.src=pendingTools[id];
      const o=document.getElementById(`toolOrigin-${id}`);if(o){o.textContent='Padrão • não salvo';o.classList.add('pending');}
      setSaveEnabled();
    }));

    document.getElementById('toolsResetAll')?.addEventListener('click',()=>{
      const api=toolIcons();if(!api)return;
      api.modules.forEach(m=>{
        pendingTools[m.id]=api.getDefault(m.id);changedTools.add(m.id);
        const p=document.getElementById(`toolPreview-${m.id}`);if(p)p.src=pendingTools[m.id];
        const o=document.getElementById(`toolOrigin-${m.id}`);if(o){o.textContent='Padrão • não salvo';o.classList.add('pending');}
      });
      setSaveEnabled();
    });

    document.getElementById('brandResetLogo')?.addEventListener('click',()=>{
      pendingLogo=branding()?.defaultLogo||'logo-oficial.svg';logoChanged=true;
      const p=document.getElementById('brandLogoPreview');if(p)p.src=pendingLogo;
      if(!faviconChanged){pendingFavicon=pendingLogo;const f=document.getElementById('brandFaviconPreview');if(f)f.src=pendingLogo;}
      setSaveEnabled();
    });

    document.getElementById('brandResetFavicon')?.addEventListener('click',()=>{
      pendingFavicon=pendingLogo||currentLogo();faviconChanged=true;
      const p=document.getElementById('brandFaviconPreview');if(p)p.src=pendingFavicon;
      setSaveEnabled();
    });

    document.getElementById('brandDiscard')?.addEventListener('click',render);
    document.getElementById('brandSave')?.addEventListener('click',()=>{
      const api=branding();
      const icons=toolIcons();
      let ok=true;
      if(api){
        if(logoChanged){if(pendingLogo===api.defaultLogo) api.resetLogo();else ok=api.setLogo(pendingLogo)!==false&&ok;}
        if(faviconChanged){if(pendingFavicon===pendingLogo||pendingFavicon===api.getLogo()) api.resetFavicon();else ok=api.setFavicon(pendingFavicon)!==false&&ok;}
      }
      if(icons){
        changedTools.forEach(id=>{
          if(pendingTools[id]===icons.getDefault(id)) icons.reset(id);
          else ok=icons.set(id,pendingTools[id])!==false&&ok;
        });
      }
      if(!ok){toastMsg('Não foi possível salvar tudo. Reduza o tamanho dos arquivos e tente novamente.');return;}
      api?.apply?.();icons?.apply?.();
      toastMsg('Identidade visual e ícones atualizados.');
      render();
    });
  }

  const previousOpen=window.openPage;
  function brandingOpen(page){
    if(isAdmin()&&page==='configuracoes'){render();return;}
    return typeof previousOpen==='function'?previousOpen(page):undefined;
  }
  window.openPage=brandingOpen;
  try{openPage=brandingOpen;}catch(e){}

  document.addEventListener('click',e=>{
    if(!isAdmin())return;
    const nav=e.target.closest('#navMenu .nav-item[data-page="configuracoes"]');
    if(nav){e.preventDefault();e.stopImmediatePropagation();render();}
  },true);

  window.renderAdminBranding=render;
})();
