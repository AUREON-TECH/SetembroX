(()=>{
const cfg=window.RAIOX_AUTH_CONFIG||{};
const STORE='raiox.auth.session.v1';
const $=id=>document.getElementById(id);

function load(){try{return JSON.parse(localStorage.getItem(STORE)||'null');}catch(_){return null;}}
function save(v){localStorage.setItem(STORE,JSON.stringify(v));}
function clear(){localStorage.removeItem(STORE);}
async function req(path,options={},token){
  const headers=Object.assign({apikey:cfg.key,'Content-Type':'application/json'},options.headers||{});
  if(token)headers.Authorization='Bearer '+token;
  const res=await fetch(cfg.url+path,Object.assign({},options,{headers}));
  const txt=await res.text();let data={};try{data=txt?JSON.parse(txt):{};}catch(_){}
  if(!res.ok)throw new Error(data.message||data.msg||data.error||'Não foi possível verificar agora.');
  return data;
}
async function refresh(s){
  const d=await req('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:JSON.stringify({refresh_token:s.refresh_token})});
  const n={access_token:d.access_token,refresh_token:d.refresh_token,expires_at:d.expires_at||Math.floor(Date.now()/1000)+(d.expires_in||3600),user:d.user};
  save(n);return n;
}
async function getSession(){
  let s=load();if(!s)return null;
  if(!s.expires_at||s.expires_at-Math.floor(Date.now()/1000)<90)s=await refresh(s);
  const user=await req('/auth/v1/user',{method:'GET'},s.access_token);
  s.user=user;save(s);return s;
}
function setStatus(type,text){
  const el=$('pendingStatus');el.className='pending-status '+type;
  el.innerHTML='<span></span><b>'+text+'</b>';
}
async function check(){
  const btn=$('checkApproval');btn.disabled=true;btn.textContent='VERIFICANDO...';
  try{
    const s=await getSession();
    if(!s){location.href='./';return;}
    $('pendingEmail').textContent=s.user?.email||'—';
    const rows=await req('/rest/v1/raiox_app_users?select=active,approval_status&user_id=eq.'+encodeURIComponent(s.user.id),{method:'GET'},s.access_token);
    const row=Array.isArray(rows)?rows[0]:null;
    if(row?.active&&row.approval_status==='approved'){
      setStatus('approved','ACESSO APROVADO');
      btn.textContent='ENTRAR NO RAIO X';
      btn.disabled=false;
      btn.onclick=()=>location.href='./';
      return;
    }
    if(row?.approval_status==='rejected'){
      setStatus('rejected','ACESSO NÃO APROVADO');
      btn.textContent='VERIFICAR NOVAMENTE';
    }else{
      setStatus('waiting','AGUARDANDO APROVAÇÃO DO CEO');
      btn.textContent='VERIFICAR APROVAÇÃO';
    }
  }catch(err){
    setStatus('waiting','AGUARDANDO APROVAÇÃO DO CEO');
    btn.textContent='VERIFICAR APROVAÇÃO';
  }finally{btn.disabled=false;}
}
$('checkApproval').onclick=check;
$('useOtherAccount').onclick=()=>{clear();location.href='./';};
check();
})();