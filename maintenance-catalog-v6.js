
(function(){
  if(window.__IMO_MAINT_V6__) return;
  window.__IMO_MAINT_V6__=true;

  var CAT_KEY='imo_maintenance_catalog_v6_1';
  var CONDO_KEY='imo_admin_condos_v3';
  var EXEC_KEY='imo_maintenance_executions_v6';
  var catalogCache=null;

  function q(s){return document.querySelector(s)}
  function qa(s){return Array.prototype.slice.call(document.querySelectorAll(s))}
  function e(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function slug(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
  function uid(p){return p+'-'+Date.now()+'-'+Math.random().toString(36).slice(2,6)}
  function loadCondos(){try{var d=JSON.parse(localStorage.getItem(CONDO_KEY)||'[]');return Array.isArray(d)?d:[]}catch(x){return[]}}
  function saveCondos(d){localStorage.setItem(CONDO_KEY,JSON.stringify(d))}
  function loadExec(){try{return JSON.parse(localStorage.getItem(EXEC_KEY)||'[]')}catch(x){return[]}}
  function saveExec(d){localStorage.setItem(EXEC_KEY,JSON.stringify(d))}
  function today(){return new Date().toISOString().slice(0,10)}
  function pt(v){if(!v)return '—';var p=v.split('-');return p.length===3?p[2]+'/'+p[1]+'/'+p[0]:v}

  function normalize(cat){
    cat.forEach(function(g,gi){
      g.id=g.id||slug(g.system+'-'+g.subsystem)||uid('group');
      g.order=typeof g.order==='number'?g.order:gi;
      g.active=g.active!==false;
      g.activities=Array.isArray(g.activities)?g.activities:[];
      g.activities.forEach(function(a,ai){
        a.id=a.id||('act-'+g.id+'-'+ai);
        a.active=a.active!==false;
        a.value=a.value==null?null:Number(a.value);
        a.unit=a.unit||'';
        a.responsible=a.responsible||'Local';
      });
    });
    return cat;
  }

  function ensureCatalog(){
    if(catalogCache)return Promise.resolve(catalogCache);
    try{
      var saved=JSON.parse(localStorage.getItem(CAT_KEY)||'null');
      if(Array.isArray(saved)&&saved.length){catalogCache=normalize(saved);return Promise.resolve(catalogCache)}
    }catch(x){}
    return fetch('maintenance-data-v6.json?v=20260831-1005').then(function(r){return r.json()}).then(function(d){
      catalogCache=normalize(d);
      localStorage.setItem(CAT_KEY,JSON.stringify(catalogCache));
      return catalogCache;
    });
  }
  function saveCatalog(cat){catalogCache=normalize(cat);localStorage.setItem(CAT_KEY,JSON.stringify(catalogCache))}

  function ensureCondo(c){
    if(!Array.isArray(c.maintenanceSelected)){
      c.maintenanceSelected=Array.isArray(c.maintenancePlans)?c.maintenancePlans.map(function(x){return x.id}).filter(Boolean):[];
    }
    if(!c.maintenanceConfig||typeof c.maintenanceConfig!=='object')c.maintenanceConfig={};
    return c;
  }
  function updateCondo(id,fn){
    var d=loadCondos(),c=d.find(function(x){return x.id===id});
    if(!c)return null;
    ensureCondo(c);fn(c);saveCondos(d);return c;
  }
  function condoById(id){var c=loadCondos().find(function(x){return x.id===id});return c?ensureCondo(c):null}

  function prepare(title,crumb){
    if(q('#pageTitle'))q('#pageTitle').textContent=title;
    if(q('#breadcrumb'))q('#breadcrumb').textContent=crumb;
    if(q('#sidebar'))q('#sidebar').classList.remove('open');
  }

  function patchRoles(){
    try{
      if(NAV&&NAV.morador)NAV.morador.forEach(function(g){g[1]=g[1].filter(function(i){return i[0]!=='rotinas'})});
      if(NAV&&NAV.incorporadora){
        var has=NAV.incorporadora.some(function(g){return g[1].some(function(i){return i[0]==='rotinas'})});
        if(!has){
          var target=NAV.incorporadora.find(function(g){return g[0]==='CONTEÚDO'})||NAV.incorporadora[0];
          target[1].push(['rotinas','↻','Plano de manutenção']);
        }
      }
    }catch(x){}
    if(document.body.classList.contains('resident-mode'))qa('[data-page="rotinas"]').forEach(function(n){n.remove()});
  }

  function renderBase(){
    ensureCatalog().then(function(cat){
      prepare('Base de manutenção','IMO / Super Admin / Base de manutenção');
      var c=q('#content');if(!c)return;c.className='maint-v6-page';
      c.innerHTML='<section class="maint-v6-head"><div><span class="eyebrow">CADASTRO MESTRE</span><h1>Base de manutenção</h1><p>Sistemas, subsistemas e atividades padrão. Esta base alimenta todos os condomínios.</p></div><button class="action-btn primary" id="mNewGroup">＋ Cadastrar sistema</button></section>'+
      '<div class="maint-v6-toolbar"><input id="mSearch" placeholder="Nome do sistema ou subsistema"><span id="mCount"></span></div><div id="mGroups"></div>';
      function draw(){
        var term=(q('#mSearch').value||'').toLowerCase().trim();
        var data=cat.filter(function(g){return (g.system+' '+g.subsystem).toLowerCase().indexOf(term)>=0});
        q('#mCount').textContent=data.length+' sistemas/subsistemas';
        q('#mGroups').innerHTML=data.map(function(g){
          var prev=g.activities.slice(0,3).map(function(a){
            var per=a.value?(a.value+' '+e(a.unit)):'Periodicidade a confirmar';
            return '<p>'+e(a.text)+'<small>'+per+' • '+e(a.responsible)+'</small></p>';
          }).join('');
          return '<section class="maint-group-card"><header><div><h3>'+e(g.system)+'</h3><span>'+e(g.subsystem)+' • '+g.activities.length+' atividade(s)</span></div><div><button data-medit="'+g.id+'">Editar</button><button class="danger" data-mdel="'+g.id+'">Excluir</button></div></header><div class="maint-group-preview">'+prev+(g.activities.length>3?'<em>+ '+(g.activities.length-3)+' atividades</em>':'')+'</div></section>';
        }).join('')||'<div class="maint-empty">Nenhum item encontrado.</div>';
        qa('[data-medit]').forEach(function(b){b.onclick=function(){renderEditor(b.dataset.medit)}});
        qa('[data-mdel]').forEach(function(b){b.onclick=function(){if(!confirm('Excluir este sistema/subsistema?'))return;cat=cat.filter(function(g){return g.id!==b.dataset.mdel});saveCatalog(cat);draw()}});
      }
      q('#mSearch').oninput=draw;
      q('#mNewGroup').onclick=function(){renderEditor(null)};
      draw();
    });
  }

  function editorActivity(a){
    var units=['Dia(s)','Semana(s)','Mês(es)','Ano(s)'];
    var resp=['Local','Especializada','Capacitada','Local / Especializada','Local / Capacitada','Capacitada / Especializada'];
    return '<section class="maint-activity-editor" data-aid="'+e(a.id||uid('act'))+'">'+
      '<label class="wide">ATIVIDADE (ITEM DO PLANO DE MANUTENÇÃO)<textarea data-f="text">'+e(a.text||'')+'</textarea></label>'+
      '<div><label>PERIODICIDADE<div class="maint-period"><input data-f="value" type="number" min="1" value="'+e(a.value||'')+'"><select data-f="unit">'+units.map(function(u){return '<option '+(a.unit===u?'selected':'')+'>'+u+'</option>'}).join('')+'</select></div></label>'+
      '<label>RESPONSÁVEL<select data-f="responsible">'+resp.map(function(r){return '<option '+(a.responsible===r?'selected':'')+'>'+r+'</option>'}).join('')+'</select></label></div>'+
      '<button type="button" class="maint-trash" data-rmact>×</button></section>';
  }

  function renderEditor(id){
    ensureCatalog().then(function(cat){
      var group=id?cat.find(function(g){return g.id===id}):{id:uid('group'),system:'',subsystem:'',order:cat.length,activities:[]};
      if(!group)return;
      var c=q('#content');c.className='maint-v6-page';
      c.innerHTML='<button class="maint-back" id="mBackBase">← Voltar para Base de manutenção</button>'+
        '<section class="maint-v6-head"><div><span class="eyebrow">'+(id?'EDITAR':'NOVO')+' SISTEMA</span><h1>'+(id?'Editar manutenção':'Cadastrar sistema/subsistema')+'</h1></div><button class="action-btn primary" id="mSaveGroup">Salvar alterações</button></section>'+
        '<section class="maint-editor-panel"><div class="maint-editor-grid"><label>Sistema<input id="mSystem" value="'+e(group.system)+'"></label><label>Subsistema<input id="mSubsystem" value="'+e(group.subsystem)+'"></label><label>Ordem<input id="mOrder" type="number" value="'+e(group.order||0)+'"></label></div></section>'+
        '<div id="mActs">'+group.activities.map(editorActivity).join('')+'</div><button class="maint-add-record" id="mAddAct">＋ NOVO REGISTRO</button>';
      q('#mBackBase').onclick=renderBase;
      function wire(){qa('[data-rmact]').forEach(function(b){b.onclick=function(){b.closest('.maint-activity-editor').remove()}})}
      wire();
      q('#mAddAct').onclick=function(){q('#mActs').insertAdjacentHTML('beforeend',editorActivity({id:uid('act'),text:'',value:1,unit:'Mês(es)',responsible:'Local'}));wire()};
      q('#mSaveGroup').onclick=function(){
        var system=q('#mSystem').value.trim(),sub=q('#mSubsystem').value.trim();
        if(!system||!sub){alert('Informe Sistema e Subsistema.');return}
        var acts=qa('.maint-activity-editor').map(function(row){
          var value=Number(row.querySelector('[data-f="value"]').value||0)||null;
          return {id:row.dataset.aid,text:row.querySelector('[data-f="text"]').value.trim(),value:value,unit:value?row.querySelector('[data-f="unit"]').value:'',responsible:row.querySelector('[data-f="responsible"]').value,active:true};
        }).filter(function(a){return a.text});
        var idx=cat.findIndex(function(g){return g.id===group.id});
        var obj={id:group.id,system:system,subsystem:sub,order:Number(q('#mOrder').value||0),active:true,activities:acts};
        if(idx>=0)cat[idx]=obj;else cat.push(obj);
        saveCatalog(cat);renderBase();
      };
    });
  }

  function renderSelection(condoId){
    Promise.all([ensureCatalog()]).then(function(res){
      var cat=res[0],condo=condoById(condoId);if(!condo)return;
      var selected=new Set(condo.maintenanceSelected||[]);
      prepare('Manutenção do condomínio','IMO / Super Admin / Condomínios / '+condo.name+' / Manutenção');
      var c=q('#content');c.className='maint-v6-page';
      c.innerHTML='<button class="maint-back" id="mBackCondos">← Voltar para condomínios</button>'+
        '<section class="maint-v6-head"><div><span class="eyebrow">CONDOMÍNIO</span><h1>'+e(condo.name)+' — Manutenções</h1><p>Marque os sistemas/subsistemas que fazem parte deste condomínio. É possível alterar depois.</p></div><button class="action-btn primary" id="mSaveSel">Salvar seleção</button></section>'+
        '<div class="maint-v6-toolbar"><input id="mSelSearch" placeholder="Nome do sistema ou subsistema"><span id="mSelCount"></span></div><div class="maint-selection-list" id="mSelList"></div>';
      function draw(){
        var term=(q('#mSelSearch').value||'').toLowerCase().trim();
        q('#mSelCount').textContent=selected.size+' selecionado(s)';
        q('#mSelList').innerHTML=cat.filter(function(g){return (g.system+' '+g.subsystem).toLowerCase().indexOf(term)>=0}).map(function(g){
          return '<article><label><input type="checkbox" data-sel="'+g.id+'" '+(selected.has(g.id)?'checked':'')+'><span><b>'+e(g.system)+'</b><small>'+e(g.subsystem)+' • '+g.activities.length+' atividade(s)</small></span></label>'+(selected.has(g.id)?'<button data-cfg="'+g.id+'">Configurar datas</button>':'')+'</article>';
        }).join('');
        qa('[data-sel]').forEach(function(i){i.onchange=function(){if(i.checked)selected.add(i.dataset.sel);else selected.delete(i.dataset.sel);draw()}});
        qa('[data-cfg]').forEach(function(b){b.onclick=function(){renderCondoConfig(condoId,b.dataset.cfg)}});
      }
      q('#mSelSearch').oninput=draw;
      q('#mSaveSel').onclick=function(){updateCondo(condoId,function(x){x.maintenanceSelected=Array.from(selected)});if(typeof toast==='function')toast('Manutenções atualizadas.');draw()};
      q('#mBackCondos').onclick=function(){if(window.renderAdminCondosV4)window.renderAdminCondosV4()};
      draw();
    });
  }

  function renderCondoConfig(condoId,groupId){
    ensureCatalog().then(function(cat){
      var condo=condoById(condoId),group=cat.find(function(g){return g.id===groupId});if(!condo||!group)return;
      var c=q('#content');c.className='maint-v6-page';
      c.innerHTML='<button class="maint-back" id="mBackSel">← Voltar para seleção</button>'+
        '<section class="maint-v6-head"><div><span class="eyebrow">EDITAR MANUTENÇÃO</span><h1>'+e(group.system)+' / '+e(group.subsystem)+'</h1><p>'+e(condo.name)+'</p></div><button class="action-btn primary" id="mSaveCfg">Atualizar</button></section>'+
        '<div>'+group.activities.map(function(a){
          var cfg=(condo.maintenanceConfig||{})[a.id]||{defaultDate:true,specificDate:''};
          return '<section class="maint-condo-activity" data-act="'+a.id+'"><div class="activity"><label>ATIVIDADE (ITEM DO PLANO DE MANUTENÇÃO)<textarea readonly>'+e(a.text)+'</textarea></label></div>'+
          '<div class="meta"><label>PERIODICIDADE<div class="maint-period"><input readonly value="'+e(a.value||'')+'"><input readonly value="'+e(a.unit||'A confirmar')+'"></div></label><label>RESPONSÁVEL<input readonly value="'+e(a.responsible)+'"></label></div>'+
          '<div class="date"><label class="check"><input type="checkbox" data-default '+(cfg.defaultDate!==false?'checked':'')+'><span>Data Padrão</span></label><label>DATA ESPECÍFICA<input type="date" data-specific value="'+e(cfg.specificDate||'')+'"></label></div></section>';
        }).join('')+'</div>';
      q('#mBackSel').onclick=function(){renderSelection(condoId)};
      q('#mSaveCfg').onclick=function(){
        updateCondo(condoId,function(x){
          group.activities.forEach(function(a){
            var row=q('[data-act="'+a.id+'"]');
            x.maintenanceConfig[a.id]={defaultDate:row.querySelector('[data-default]').checked,specificDate:row.querySelector('[data-specific]').value};
          });
        });
        if(typeof toast==='function')toast('Configurações de manutenção atualizadas.');
        renderSelection(condoId);
      };
    });
  }

  function addInterval(date,value,unit){
    var d=new Date(date+'T12:00:00'),v=Number(value);
    if(unit.indexOf('Dia')===0)d.setDate(d.getDate()+v);
    else if(unit.indexOf('Semana')===0)d.setDate(d.getDate()+7*v);
    else if(unit.indexOf('Mês')===0)d.setMonth(d.getMonth()+v);
    else if(unit.indexOf('Ano')===0)d.setFullYear(d.getFullYear()+v);
    return d;
  }
  function nextDue(condo,a){
    var cfg=(condo.maintenanceConfig||{})[a.id]||{};
    if(cfg.defaultDate===false&&cfg.specificDate)return new Date(cfg.specificDate+'T12:00:00');
    var base=(Array.isArray(condo.habiteSe)&&condo.habiteSe[0])||condo.registrationDate;
    if(!base||!a.value||!a.unit)return null;
    var d=new Date(base+'T12:00:00'),now=new Date(),guard=0;
    while(d<now&&guard<1500){d=addInterval(d.toISOString().slice(0,10),a.value,a.unit);guard++}
    return d;
  }
  function status(d){if(!d)return 'CONFIGURAR';var days=Math.ceil((d-new Date())/86400000);return days<0?'ATRASADA':days<=7?'PENDENTE':'PRÓXIMA'}

  function roleCondo(){
    var all=loadCondos().map(ensureCondo),ctx=q('#contextName')?q('#contextName').textContent.trim():'';
    var c=all.find(function(x){return x.name===ctx});
    if(!c&&currentUser==='incorporadora')c=all.find(function(x){return x.inc===ctx});
    return c||all[0];
  }

  function renderRoutines(){
    ensureCatalog().then(function(cat){
      var condo=roleCondo();if(!condo)return;
      var sel=new Set(condo.maintenanceSelected||[]);
      var groups=cat.filter(function(g){return sel.has(g.id)});
      prepare('Plano de manutenção','IMO / '+(currentUser==='sindico'?'Síndico':'Incorporadora')+' / Plano de manutenção');
      var c=q('#content');c.className='maint-v6-page role-maint';
      var body=groups.map(function(g){
        var rows=g.activities.map(function(a){
          var d=nextDue(condo,a),st=status(d),date=d?pt(d.toISOString().slice(0,10)):'A definir';
          return '<div class="routine-row"><div>'+e(a.text)+'</div><span>'+e(a.responsible)+'</span><span>'+date+'</span><span class="routine-status '+st.toLowerCase()+'">'+st+'</span><div><button data-exec="'+a.id+'">NOVO REGISTRO</button><button data-hist="'+a.id+'">HISTÓRICO</button></div></div>';
        }).join('');
        return '<section class="routine-group"><h3>'+e(g.subsystem)+' <span>('+e(g.system)+')</span></h3>'+rows+'</section>';
      }).join('');
      c.innerHTML='<section class="maint-v6-head"><div><span class="eyebrow">'+(currentUser==='sindico'?'SÍNDICO':'INCORPORADORA')+'</span><h1>Rotinas Periódicas</h1><p>'+e(condo.name)+' • Data Padrão calculada a partir do Habite-se.</p></div></section>'+
        '<div class="routine-toolbar"><button>Rotinas Periódicas</button><button>Mês Atual</button><button>Relatório Geral</button><div><input type="date"><input type="date"><button>FILTRAR</button></div></div>'+
        '<div class="routine-head"><span>ATIVIDADE</span><span>RESPONSÁVEL</span><span>PRAZO ATÉ</span><span>STATUS</span><span></span></div>'+(body||'<div class="maint-empty">Nenhuma manutenção selecionada para este condomínio.</div>');
      qa('[data-exec]').forEach(function(b){b.onclick=function(){var note=prompt('Registro da execução / observação:','Manutenção realizada');if(note===null)return;var d=loadExec();d.unshift({id:uid('exec'),condoId:condo.id,actId:b.dataset.exec,date:today(),note:note,status:'REALIZADA'});saveExec(d);alert('Registro salvo no histórico.')}});
      qa('[data-hist]').forEach(function(b){b.onclick=function(){var list=loadExec().filter(function(x){return x.condoId===condo.id&&x.actId===b.dataset.hist});alert(list.length?list.map(function(x){return pt(x.date)+' — '+x.status+' — '+x.note}).join('\n'):'Nenhum registro no histórico.')}});
    });
  }

  function patchRegistration(){
    if(currentUser!=='admin')return;
    var form=q('#imoRegForm'),step=q('#imoRegStep7 .imo-reg-grid');if(!form||!step||form.dataset.maintV6)return;
    form.dataset.maintV6='1';
    ensureCatalog().then(function(cat){
      step.innerHTML='<div class="imo-maint-select span2">'+cat.map(function(g){return '<label><input type="checkbox" data-reg-maint-v6="'+g.id+'"><span><b>'+e(g.system)+'</b><small>'+e(g.subsystem)+' • '+g.activities.length+' atividade(s)</small></span></label>'}).join('')+'</div><div class="imo-reg-note span2">Selecione agora ou altere depois pela ferramenta <b>Manutenção</b> da listagem do condomínio.</div>';
      form.addEventListener('submit',function(){
        var ids=qa('[data-reg-maint-v6]:checked').map(function(i){return i.dataset.regMaintV6}),name=q('#regName')?q('#regName').value.trim():'';
        setTimeout(function(){var d=loadCondos(),c=d.find(function(x){return x.name===name});if(c){ensureCondo(c);c.maintenanceSelected=ids;saveCondos(d)}},30);
      },true);
    });
  }

  function patchList(){
    if(currentUser!=='admin')return;
    qa('tr[data-open-condo]').forEach(function(row){
      var b=row.querySelector('[data-v5-tool="manutencoes"]');
      if(b){b.removeAttribute('data-v5-tool');b.setAttribute('data-maint-condo',row.dataset.openCondo);b.textContent='Manutenção'}
    });
  }

  var prevOpen=window.openPage;
  window.openPage=function(page){
    patchRoles();
    if(currentUser==='morador'&&page==='rotinas')return prevOpen&&prevOpen('dashboard');
    if(currentUser==='admin'&&page==='rotinas'){renderBase();return}
    if((currentUser==='sindico'||currentUser==='incorporadora')&&page==='rotinas'){renderRoutines();return}
    return prevOpen&&prevOpen.apply(this,arguments);
  };
  try{openPage=window.openPage}catch(x){}

  document.addEventListener('click',function(ev){
    var b=ev.target.closest('[data-maint-condo]');
    if(b&&currentUser==='admin'){ev.preventDefault();ev.stopPropagation();renderSelection(b.getAttribute('data-maint-condo'))}
  },true);

  var queued=false;
  new MutationObserver(function(){
    if(queued)return;queued=true;
    requestAnimationFrame(function(){queued=false;patchRegistration();patchList();patchRoles()});
  }).observe(document.body,{childList:true,subtree:true});

  window.addEventListener('load',function(){setTimeout(function(){patchRegistration();patchList();patchRoles()},180)});
  ensureCatalog();patchRoles();
})();
