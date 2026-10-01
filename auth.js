(()=>{
  const cfg=window.RAIOX_AUTH_CONFIG||{};
  const STORE='raiox.auth.session.v1';
  const $=id=>document.getElementById(id);
  let current=null;
  let refreshTimer=null;
  let mode='login';

  async function request(path,options={},token){
    const headers=Object.assign({
      apikey:cfg.key,
      'Content-Type':'application/json'
    },options.headers||{});
    if(token)headers.Authorization='Bearer '+token;
    const res=await fetch(cfg.url+path,Object.assign({},options,{headers}));
    const text=await res.text();
    let data={};
    try{data=text?JSON.parse(text):{};}catch(_){data={message:text};}
    if(!res.ok)throw Object.assign(new Error(data.msg||data.message||data.error_description||'Falha de autenticação.'),{status:res.status,data});
    return data;
  }

  function save(session){
    current=session;
    localStorage.setItem(STORE,JSON.stringify(session));
    scheduleRefresh();
  }

  function load(){
    try{return JSON.parse(localStorage.getItem(STORE)||'null');}catch(_){return null;}
  }

  function clear(){
    current=null;
    if(refreshTimer)clearTimeout(refreshTimer);
    localStorage.removeItem(STORE);
  }

  async function refresh(session){
    if(!session?.refresh_token)throw new Error('Sessão expirada.');
    const data=await request('/auth/v1/token?grant_type=refresh_token',{
      method:'POST',
      body:JSON.stringify({refresh_token:session.refresh_token})
    });
    const next=normalize(data);
    save(next);
    return next;
  }

  function normalize(data){
    const now=Math.floor(Date.now()/1000);
    return {
      access_token:data.access_token,
      refresh_token:data.refresh_token,
      expires_at:data.expires_at||now+(data.expires_in||3600),
      user:data.user||null
    };
  }

  async function getUser(session){
    return request('/auth/v1/user',{method:'GET',headers:{'Content-Type':'application/json'}},session.access_token);
  }

  async function getAccess(userId,token){
    const rows=await request('/rest/v1/raiox_app_users?select=user_id,display_name,role,active,approval_status,email&user_id=eq.'+encodeURIComponent(userId),{
      method:'GET',
      headers:{Accept:'application/json'}
    },token);
    const row=Array.isArray(rows)?rows[0]:null;
    if(!row||!row.active||row.approval_status!=='approved'){
      throw Object.assign(new Error('Aguardando aprovação do CEO.'),{code:'not_allowed',access:row});
    }
    return row;
  }

  async function ensureSession(){
    let session=load();
    if(!session)return null;
    const now=Math.floor(Date.now()/1000);
    let user=null;
    try{
      if(!session.access_token||!session.expires_at||session.expires_at-now<90)session=await refresh(session);
      user=await getUser(session);
      session.user=user;
      const access=await getAccess(user.id,session.access_token);
      save(session);
      return {session,user,access};
    }catch(e){
      if(e?.code==='not_allowed'){
        save(session);
        return {pending:true,session,user,access:e.access||null};
      }
      clear();
      return null;
    }
  }

  async function signIn(email,password){
    const data=await request('/auth/v1/token?grant_type=password',{
      method:'POST',
      body:JSON.stringify({email:email.trim().toLowerCase(),password})
    });
    const session=normalize(data);
    const user=data.user||await getUser(session);
    session.user=user;
    save(session);
    const access=await getAccess(user.id,session.access_token);
    return {session,user,access};
  }
  async function signUp(email,password){
    return request('/functions/v1/raiox-request-access-v2',{
      method:'POST',
      body:JSON.stringify({
        email:email.trim().toLowerCase(),
        password,
        display_name:email.trim().split('@')[0]
      })
    });
  }

  function setMode(next){
    mode=next;
    const signup=mode==='signup';
    $('authModeLogin')?.classList.toggle('active',!signup);
    $('authModeSignup')?.classList.toggle('active',signup);
    if($('authNameField'))$('authNameField').hidden=true;
    if($('authName'))$('authName').required=false;
    if($('authTitle'))$('authTitle').textContent=signup?'Crie seu acesso':'Entre na sua conta';
    if($('authIntro'))$('authIntro').textContent=signup
      ?'Cadastre seu nome, e-mail e senha. O acesso só será liberado depois da aprovação do CEO.'
      :'Cada profissional acessa com o próprio e-mail e senha. Sua sessão fica salva neste aparelho para os próximos acessos.';
    if($('authSubmit'))$('authSubmit').textContent=signup?'SOLICITAR ACESSO':'ENTRAR NO RAIO X';
    if($('authApprovalHint'))$('authApprovalHint').hidden=!signup;
    message('');
  }

  async function signOut(){
    try{
      if(current?.access_token)await request('/auth/v1/logout',{method:'POST'},current.access_token);
    }catch(_){}
    clear();
    location.reload();
  }

  function scheduleRefresh(){
    if(refreshTimer)clearTimeout(refreshTimer);
    if(!current?.expires_at)return;
    const delay=Math.max(30000,(current.expires_at*1000-Date.now())-120000);
    refreshTimer=setTimeout(async()=>{
      try{await refresh(current);}catch(_){clear();location.reload();}
    },delay);
  }

  function setLoading(loading){
    const btn=$('authSubmit');
    if(!btn)return;
    btn.disabled=loading;
    btn.textContent=loading?(mode==='signup'?'ENVIANDO...':'ENTRANDO...'):(mode==='signup'?'SOLICITAR ACESSO':'ENTRAR NO RAIO X');
  }

  function message(text,type=''){
    const el=$('authMessage');
    if(!el)return;
    el.className='auth-message '+type;
    el.textContent=text||'';
  }

  function reveal(ctx){
    $('authGate')?.classList.add('hidden');
    const shell=$('raioxAppShell');
    if(shell)shell.hidden=false;
    document.body.classList.add('raiox-authenticated');
    const name=ctx.access.display_name||ctx.user.email?.split('@')[0]||'Usuário';
    const email=ctx.user.email||'';
    if($('authUserName'))$('authUserName').textContent=name;
    if($('authUserEmail'))$('authUserEmail').textContent=email;
    const canManage=['ceo','manager'].includes(ctx.access.role);
    const ceo=$('ceoPortalLink');
    if(ceo)ceo.hidden=!canManage;
    const entryCeo=$('entryCeoPortal');
    if(entryCeo)entryCeo.hidden=!canManage;
    window.RAIOX_AUTH={user:ctx.user,access:ctx.access,session:ctx.session,signOut};
    window.dispatchEvent(new CustomEvent('raiox:authenticated',{detail:window.RAIOX_AUTH}));
  }

  function showGate(){
    const shell=$('raioxAppShell');
    if(shell)shell.hidden=true;
    $('authGate')?.classList.remove('hidden');
    setTimeout(()=>$('authEmail')?.focus(),80);
  }

  async function init(){
    if(!cfg.url||!cfg.key){showGate();message('Configuração de autenticação indisponível.','error');return;}
    const existing=await ensureSession();
    if(existing?.pending){location.replace('./pending.html');return;}
    if(existing){reveal(existing);return;}
    showGate();
    setMode('login');
    $('authModeLogin')?.addEventListener('click',()=>setMode('login'));
    $('authModeSignup')?.addEventListener('click',()=>setMode('signup'));

    $('authTogglePassword')?.addEventListener('click',()=>{
      const input=$('authPassword');
      if(!input)return;
      input.type=input.type==='password'?'text':'password';
      $('authTogglePassword').textContent=input.type==='password'?'Mostrar':'Ocultar';
    });

    $('authForm')?.addEventListener('submit',async e=>{
      e.preventDefault();
      message('');
      setLoading(true);
      try{
        if(mode==='signup'){
          const email=$('authEmail').value;
          const password=$('authPassword').value;
          if(password.length<8)throw Object.assign(new Error('A senha precisa ter pelo menos 8 caracteres.'),{code:'form'});
          await signUp(email,password);
          try{
            const ctx=await signIn(email,password);
            reveal(ctx);
            return;
          }catch(err){
            if(err?.code==='not_allowed'){location.href='./pending.html';return;}
            throw err;
          }
        }
        const ctx=await signIn($('authEmail').value,$('authPassword').value);
        reveal(ctx);
      }catch(err){
        if(err.code==='not_allowed'){location.href='./pending.html';return;}
        const msg=err.code==='form'?err.message
          :err.status===400?'E-mail ou senha incorretos.':'Não foi possível concluir agora. Tente novamente.';
        message(msg,'error');
      }finally{setLoading(false);}
    });

    $('raioxLogout')?.addEventListener('click',signOut);
  }

  document.addEventListener('DOMContentLoaded',init);
})();