/* IMO — política final de cor dos ícones das ferramentas */
(function(){
  if(window.__IMO_TOOL_ICON_COLOR_POLICY__) return;
  window.__IMO_TOOL_ICON_COLOR_POLICY__=true;

  const style=document.createElement('style');
  style.id='imo-tool-icon-color-policy';
  style.textContent=`
    /* Acesso Rápido: qualquer PNG/SVG/WebP enviado vira azul IMO */
    body.resident-mode .imo-shortcut .imo-shortcut-icon img.imo-tool-icon-img,
    body.resident-mode .imo-shortcut .imo-shortcut-icon img,
    body.resident-mode .resident-tile .imo-shortcut-icon img{
      filter:brightness(0) saturate(100%) invert(49%) sepia(82%) saturate(1260%) hue-rotate(162deg) brightness(91%) contrast(86%)!important;
      opacity:1!important;
    }

    /* Menu lateral: sempre branco, independentemente da cor do arquivo */
    body.resident-mode #navMenu .nav-item[data-page]>span:first-child img.imo-tool-icon-img,
    body.resident-mode #navMenu .nav-item[data-page]>span:first-child img.imo-tool-icon-sidebar,
    body.resident-mode #navMenu .nav-item[data-page]>span:first-child img,
    body.resident-mode #navMenu .nav-item[data-page].active>span:first-child img.imo-tool-icon-img,
    body.resident-mode #navMenu .nav-item[data-page].active>span:first-child img.imo-tool-icon-sidebar,
    body.resident-mode #navMenu .nav-item[data-page].active>span:first-child img{
      filter:brightness(0) saturate(100%) invert(1)!important;
      opacity:1!important;
    }

    /* CTA de assistência técnica: ícone branco sobre o botão azul */
    body.resident-mode .imo-open-ticket>span:first-child img{
      filter:brightness(0) saturate(100%) invert(1)!important;
      opacity:1!important;
    }
  `;
  document.head.appendChild(style);

  function reinforce(){
    if(!document.getElementById('imo-tool-icon-color-policy')) document.head.appendChild(style);
  }
  window.addEventListener('load',reinforce);
})();
