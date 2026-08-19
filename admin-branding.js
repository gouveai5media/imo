/* IMO — Configurações > Identidade Visual */
(function(){
  if(window.__IMO_ADMIN_BRANDING__) return;
  window.__IMO_ADMIN_BRANDING__=true;

  let pendingLogo='';
  let pendingFavicon='';
  let logoChanged=false;
  let faviconChanged=false;

  function isAdmin(){try{return currentUser==='admin';}catch(e){return false;}}
  function branding(){return window.imoBranding||null;}
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

  function render(){
    if(!isAdmin()) return;
    prepare();
    pendingLogo=currentLogo();
    pendingFavicon=currentFavicon();
    logoChanged=false;faviconChanged=false;
    const c=content();if(!c)return;
    c.className='branding-page';
    c.innerHTML=`
      <section class="branding-hero">
        <div><span class="branding-pill">CONFIGURAÇÕES DA PLATAFORMA</span><h1>Identidade Visual</h1><p>Gerencie a marca exibida em toda a experiência IMO. Uma alteração salva aqui é aplicada automaticamente no login e nos quatro níveis de acesso.</p></div>
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
          <div class="brand-file-note"><span>i</span><p><b>Formatos aceitos:</b> PNG, SVG ou WebP, com até 1,5 MB. O sistema nunca estica ou deforma o arquivo; apenas redimensiona mantendo a proporção.</p></div>
        </article>

        <article class="branding-card">
          <div class="branding-card-head"><div><h3>Ícone do navegador</h3><p>Favicon exibido na aba do navegador e atalhos.</p></div><span class="branding-status">OPCIONAL</span></div>
          <div class="favicon-preview"><div class="favicon-box"><img id="brandFaviconPreview" src="${currentFavicon()}" alt="Pré-visualização do favicon"></div><small>Prévia da aba do navegador</small></div>
          <div class="brand-upload-row">
            <label class="brand-upload-btn">↑ Selecionar favicon<input id="brandFaviconInput" type="file" accept="image/png,image/svg+xml,image/x-icon,image/vnd.microsoft.icon" hidden></label>
            <button type="button" class="brand-reset-btn" id="brandResetFavicon">Usar logo principal</button>
          </div>
          <div class="brand-file-note"><span>i</span><p>Recomendamos uma arte quadrada. Na versão real, o arquivo será armazenado no Supabase Storage e vinculado à configuração global da plataforma.</p></div>
        </article>
      </section>

      <div class="branding-actions"><button type="button" class="brand-reset-btn" id="brandDiscard">Descartar alterações</button><button type="button" class="brand-save-btn" id="brandSave" disabled>Salvar identidade visual</button></div>`;

    wire();
  }

  function toastMsg(msg){if(typeof toast==='function')toast(msg);}
  function setSaveEnabled(){const b=document.getElementById('brandSave');if(b)b.disabled=!(logoChanged||faviconChanged);}

  function readImage(file,kind){
    if(!file)return;
    const allowedLogo=['image/png','image/svg+xml','image/webp'];
    const allowedFav=['image/png','image/svg+xml','image/x-icon','image/vnd.microsoft.icon'];
    const allowed=kind==='logo'?allowedLogo:allowedFav;
    if(!allowed.includes(file.type)){
      toastMsg(kind==='logo'?'Use PNG, SVG ou WebP.':'Use PNG, SVG ou ICO.');return;
    }
    if(file.size>1.5*1024*1024){toastMsg('O arquivo deve ter no máximo 1,5 MB.');return;}
    const reader=new FileReader();
    reader.onload=()=>{
      const data=String(reader.result||'');
      if(kind==='logo'){
        pendingLogo=data;logoChanged=true;
        const p=document.getElementById('brandLogoPreview');if(p)p.src=data;
        if(!faviconChanged){pendingFavicon=data;const f=document.getElementById('brandFaviconPreview');if(f)f.src=data;}
      }else{
        pendingFavicon=data;faviconChanged=true;
        const p=document.getElementById('brandFaviconPreview');if(p)p.src=data;
      }
      setSaveEnabled();
    };
    reader.readAsDataURL(file);
  }

  function wire(){
    document.getElementById('brandLogoInput')?.addEventListener('change',e=>readImage(e.target.files?.[0],'logo'));
    document.getElementById('brandFaviconInput')?.addEventListener('change',e=>readImage(e.target.files?.[0],'favicon'));

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
      if(!api){toastMsg('Configuração de marca indisponível.');return;}
      let ok=true;
      if(logoChanged){
        if(pendingLogo===api.defaultLogo) api.resetLogo();
        else ok=api.setLogo(pendingLogo)!==false && ok;
      }
      if(faviconChanged){
        if(pendingFavicon===pendingLogo || pendingFavicon===api.getLogo()) api.resetFavicon();
        else ok=api.setFavicon(pendingFavicon)!==false && ok;
      }
      if(!ok){toastMsg('Não foi possível salvar: o arquivo pode ser grande demais para esta demonstração.');return;}
      api.apply();
      toastMsg('Identidade visual atualizada em todos os painéis.');
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
