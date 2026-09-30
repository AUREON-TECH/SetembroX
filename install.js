(()=>{
  let deferredPrompt=null;
  const $=id=>document.getElementById(id);
  const isStandalone=()=>window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;

  function setStatus(text){
    const el=$('installStatus');
    if(!el)return;
    el.hidden=!text;
    el.textContent=text||'';
  }
  function refresh(){
    const btn=$('installRaioX');
    if(!btn)return;
    if(isStandalone()){
      btn.hidden=true;
      setStatus('RAIO X já está instalado neste aparelho.');
      return;
    }
    btn.hidden=false;
  }

  window.addEventListener('beforeinstallprompt',e=>{
    e.preventDefault();
    deferredPrompt=e;
    refresh();
  });

  window.addEventListener('appinstalled',()=>{
    deferredPrompt=null;
    refresh();
  });

  document.addEventListener('DOMContentLoaded',()=>{
    refresh();
    $('installRaioX')?.addEventListener('click',async()=>{
      if(isStandalone()){refresh();return;}
      if(deferredPrompt){
        deferredPrompt.prompt();
        const choice=await deferredPrompt.userChoice;
        deferredPrompt=null;
        if(choice?.outcome==='accepted')setStatus('Instalação iniciada.');
        else setStatus('Instalação cancelada.');
        return;
      }
      const ua=navigator.userAgent||'';
      if(/iPhone|iPad|iPod/i.test(ua)){
        setStatus('No iPhone/iPad: toque em Compartilhar e depois em “Adicionar à Tela de Início”.');
      }else{
        setStatus('Abra o menu do navegador e escolha “Instalar app” ou “Adicionar à tela inicial”.');
      }
    });
  });
})();