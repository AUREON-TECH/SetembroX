(()=>{
const cfg=window.RAIOX_AUTH_CONFIG||{};
const STORE='raiox.auth.session.v1';
const $=id=>document.getElementById(id);
const state={session:null,user:null,admin:null,months:[],month:null,people:[],teams:[],assignments:[],presence:[],one:[],tasks:[],approvals:[]};
const TITLES={
  today:['Hoje','Registro operacional diário da sua equipe.'],
  teams:['Equipes','Defina equipes, horários e vínculos do mês.'],
  people:['Pessoas','Cadastro mestre e acessos individuais ao RAIO X.'],
  one:['Olho no Olho','Conversa 1:1, compromissos e acompanhamento.'],
  tasks:['Pendências','Tudo que você precisa revisar, conversar ou acompanhar.'],
  reports:['Relatórios','Resumo diário e mensal da gestão de pessoas.'],
  approvals:['Aprovações','Controle quem pode ou não acessar o RAIO X.']
};
const STATUS={
  present:'Compareceu',absent:'Não compareceu',unavailable:'Indisponível',agreed_off:'Folga combinada',
  late:'Chegou após o combinado',left_early:'Saiu antes do combinado',training:'Treinamento',remote:'Remoto'
};

function toast(msg,error=false){const el=$('ceoToast');el.textContent=msg;el.className='toast show'+(error?' error':'');setTimeout(()=>el.className='toast',2600);}
function localDate(d=new Date()){const z=new Date(d.getTime()-d.getTimezoneOffset()*60000);return z.toISOString().slice(0,10);}
function money(v){return Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}

async function raw(path,options={},token=state.session?.access_token){
  const headers=Object.assign({apikey:cfg.key,'Content-Type':'application/json'},options.headers||{});
  if(token)headers.Authorization='Bearer '+token;
  const res=await fetch(cfg.url+path,Object.assign({},options,{headers}));
  const txt=await res.text();let data={};try{data=txt?JSON.parse(txt):{};}catch(_){data={message:txt};}
  if(!res.ok)throw new Error(data.message||data.msg||data.error||'Erro ao acessar o banco.');
  return data;
}
async function rest(path,options={}){return raw('/rest/v1/'+path,options);}

function loadSession(){try{return JSON.parse(localStorage.getItem(STORE)||'null');}catch(_){return null;}}
async function refresh(s){const d=await raw('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:JSON.stringify({refresh_token:s.refresh_token})},null);const n={access_token:d.access_token,refresh_token:d.refresh_token,expires_at:d.expires_at||Math.floor(Date.now()/1000)+(d.expires_in||3600),user:d.user};localStorage.setItem(STORE,JSON.stringify(n));return n;}
async function validateCEO(){
  let s=loadSession();if(!s)throw new Error('Faça login no RAIO X primeiro.');
  if(!s.expires_at||s.expires_at-Math.floor(Date.now()/1000)<90)s=await refresh(s);
  const user=await raw('/auth/v1/user',{method:'GET'},s.access_token);
  state.session=s;state.user=user;
  const rows=await rest('ceo_admins?select=user_id,display_name&user_id=eq.'+encodeURIComponent(user.id));
  if(!rows[0])throw new Error('Esta conta não possui acesso ao Portal CEO.');
  state.admin=rows[0];
}
async function signOut(){try{await raw('/auth/v1/logout',{method:'POST'});}catch(_){}localStorage.removeItem(STORE);location.href='./';}

async function loadBase(){
  const [months,people]=await Promise.all([
    rest('ceo_months?select=*&order=ref_month.desc'),
    rest('ceo_people?select=*&order=full_name.asc')
  ]);
  state.months=months;
  state.people=people;
  fillPeopleSelects();
  await loadApprovals();
  const preferred=state.months.find(m=>m.status==='open')||state.months[0];
  renderMonths(preferred?.id);
  if(preferred)await selectMonth(preferred.id);
}
function renderMonths(selected){
  $('monthSelect').innerHTML=state.months.map(m=>'<option value="'+m.id+'">'+esc(m.label)+(m.status==='closed'?' • fechado':'')+'</option>').join('');
  if(selected)$('monthSelect').value=selected;
}
async function selectMonth(id){
  state.month=state.months.find(m=>m.id===id)||state.months[0];
  if(!state.month)return;
  $('monthSelect').value=state.month.id;
  await Promise.all([loadTeams(),loadTasks(),loadOne()]);
  await loadToday();
  renderTeams();renderPeople();renderOneHistory();renderTasks();await renderReports();
}
async function loadTeams(){
  state.teams=await rest('ceo_teams?select=*&month_id=eq.'+state.month.id+'&order=start_time.asc');
  state.assignments=await rest('ceo_team_assignments?select=*&month_id=eq.'+state.month.id+'&valid_to=is.null');
}
async function loadToday(){
  const date=$('todayDate').value||localDate();$('todayDate').value=date;
  state.presence=await rest('ceo_daily_presence?select=*&work_date=eq.'+date);
  renderToday();
}
async function loadTasks(){state.tasks=await rest('ceo_tasks?select=*&month_id=eq.'+state.month.id+'&order=created_at.desc');}
async function loadOne(){state.one=await rest('ceo_one_on_one?select=*&month_id=eq.'+state.month.id+'&order=meeting_date.desc,created_at.desc');}

async function loadApprovals(){
  try{
    state.approvals=await rest('raiox_app_users?select=user_id,display_name,email,role,active,approval_status,requested_at,approved_at,created_at&order=requested_at.desc.nullslast,created_at.desc');
  }catch(err){
    state.approvals=[];
    toast('Não foi possível carregar as aprovações.',true);
  }
  renderApprovals();
}

function approvalLabel(status){
  return status==='approved'?'Aprovado':status==='rejected'?'Recusado':'Aguardando';
}

function renderApprovals(){
  const rows=state.approvals||[];
  const pending=rows.filter(x=>x.approval_status==='pending'||(!x.active&&x.approval_status!=='rejected'));
  const approved=rows.filter(x=>x.approval_status==='approved'&&x.active);
  const rejected=rows.filter(x=>x.approval_status==='rejected');

  const badge=$('approvalBadge');
  if(badge){
    badge.textContent=pending.length;
    badge.hidden=pending.length===0;
  }

  if($('approvalSummary')){
    $('approvalSummary').innerHTML=[
      ['Aguardando',pending.length,'precisam da sua decisão'],
      ['Aprovados',approved.length,'podem entrar'],
      ['Recusados',rejected.length,'sem acesso']
    ].map(x=>'<div class="summary-card"><small>'+x[0]+'</small><b>'+x[1]+'</b><span>'+x[2]+'</span></div>').join('');
  }

  if(!$('approvalsList'))return;
  const ordered=[...pending,...approved,...rejected.filter(x=>!pending.includes(x)&&!approved.includes(x))];
  $('approvalsList').innerHTML=ordered.length?ordered.map(x=>{
    const pendingStatus=x.approval_status==='pending'||(!x.active&&x.approval_status!=='rejected');
    const cls=pendingStatus?'pending':x.active?'approved':'rejected';
    const when=x.requested_at||x.created_at||'';
    return '<div class="approval-card '+cls+'" data-approval="'+x.user_id+'">'+
      '<div class="approval-person"><span class="approval-dot"></span><div><b>'+esc(x.display_name||'Usuário')+'</b><small>'+esc(x.email||'E-mail não informado')+'</small></div></div>'+
      '<div class="approval-meta"><span>'+approvalLabel(pendingStatus?'pending':x.approval_status)+'</span><small>'+(when?new Date(when).toLocaleString('pt-BR'):'—')+'</small></div>'+
      '<div class="approval-actions">'+
        (pendingStatus?'<button class="approve" data-approve="'+x.user_id+'">Aprovar</button><button class="reject" data-reject="'+x.user_id+'">Recusar</button>':
          x.active?'<button class="reject" data-revoke="'+x.user_id+'">Bloquear acesso</button>':'<button class="approve" data-approve="'+x.user_id+'">Reaprovar</button>')+
      '</div>'+
    '</div>';
  }).join(''):'<div class="approval-empty">Nenhuma solicitação de acesso encontrada.</div>';

  document.querySelectorAll('[data-approve]').forEach(btn=>btn.onclick=()=>approveAccess(btn.dataset.approve,true));
  document.querySelectorAll('[data-reject]').forEach(btn=>btn.onclick=()=>approveAccess(btn.dataset.reject,false));
  document.querySelectorAll('[data-revoke]').forEach(btn=>btn.onclick=()=>approveAccess(btn.dataset.revoke,false,true));
}

async function approveAccess(userId,approve,revoke=false){
  const payload=approve
    ?{active:true,approval_status:'approved',approved_at:new Date().toISOString(),approved_by:state.user.id,updated_at:new Date().toISOString()}
    :{active:false,approval_status:'rejected',approved_at:null,approved_by:state.user.id,updated_at:new Date().toISOString()};
  try{
    await rest('raiox_app_users?user_id=eq.'+encodeURIComponent(userId),{
      method:'PATCH',
      headers:{Prefer:'return=minimal'},
      body:JSON.stringify(payload)
    });
    toast(approve?'Acesso aprovado.':(revoke?'Acesso bloqueado.':'Solicitação recusada.'));
    await loadApprovals();
  }catch(err){toast(err.message,true);}
}


function activePeople(){return state.people.filter(p=>p.status==='active');}
function personById(id){return state.people.find(p=>p.id===id);}
function teamByPerson(id){const a=state.assignments.find(x=>x.person_id===id&&!x.valid_to);return a?state.teams.find(t=>t.id===a.team_id):null;}

function renderToday(){
  const people=activePeople();
  const counts={present:0,absent:0,late:0,other:0};
  state.presence.forEach(x=>{if(x.status==='present')counts.present++;else if(x.status==='absent')counts.absent++;else if(x.status==='late')counts.late++;else counts.other++;});
  $('todaySummary').innerHTML=[
    ['Ativos',people.length,'pessoas'],
    ['Compareceram',counts.present,'registros'],
    ['Não compareceram',counts.absent,'registros'],
    ['Após combinado',counts.late,'registros'],
    ['Outros',counts.other,'folga/indisponível/etc.']
  ].map(x=>'<div class="summary-card"><small>'+x[0]+'</small><b>'+x[1]+'</b><span>'+x[2]+'</span></div>').join('');
  $('todayCount').textContent=people.length+' pessoas';
  $('todayPeople').innerHTML=people.map(p=>{
    const rec=state.presence.find(x=>x.person_id===p.id)||{};
    const team=teamByPerson(p.id);
    const opts=Object.entries(STATUS).map(([k,v])=>'<option value="'+k+'" '+(rec.status===k?'selected':'')+'>'+v+'</option>').join('');
    return '<div class="presence-row" data-person="'+p.id+'"><div class="person-main"><b>'+esc(p.full_name)+'</b><span>'+esc(p.area||p.roles?.join(' • ')||'')+(team?' • '+esc(team.name)+' • '+String(team.start_time).slice(0,5):' • sem equipe')+'</span></div><select class="presence-status"><option value="">Sem registro</option>'+opts+'</select><input class="arrival" type="time" value="'+esc(rec.arrival_time?String(rec.arrival_time).slice(0,5):'')+'"><input class="presence-note" placeholder="Observação" value="'+esc(rec.note||'')+'"><button class="ghost save-presence">Salvar</button></div>';
  }).join('');
  document.querySelectorAll('.save-presence').forEach(btn=>btn.onclick=savePresence);
}
async function savePresence(e){
  const row=e.currentTarget.closest('.presence-row');const person=row.dataset.person;const status=row.querySelector('.presence-status').value;
  if(!status){toast('Escolha o registro operacional.',true);return;}
  const body={person_id:person,month_id:state.month.id,work_date:$('todayDate').value,status,arrival_time:row.querySelector('.arrival').value||null,note:row.querySelector('.presence-note').value||null,updated_at:new Date().toISOString()};
  try{
    await rest('ceo_daily_presence?on_conflict=person_id,work_date',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(body)});
    toast('Registro salvo.');await loadToday();
  }catch(err){toast(err.message,true);}
}

function renderTeams(){
  $('teamsGrid').innerHTML=state.teams.length?state.teams.map(t=>'<div class="team-card"><small>EQUIPE</small><h3>'+esc(t.name)+'</h3><b>'+String(t.start_time).slice(0,5)+'</b><p>Tolerância '+t.tolerance_minutes+' min'+(t.end_time?' • saída '+String(t.end_time).slice(0,5):'')+'</p></div>').join(''):'<div class="team-card"><h3>Nenhuma equipe criada</h3><p>Crie a primeira e defina o horário combinado.</p></div>';
  $('teamAssignments').innerHTML=activePeople().map(p=>{
    const current=teamByPerson(p.id);
    const options='<option value="">Sem equipe</option>'+state.teams.map(t=>'<option value="'+t.id+'" '+(current?.id===t.id?'selected':'')+'>'+esc(t.name)+' • '+String(t.start_time).slice(0,5)+'</option>').join('');
    return '<div class="assignment-row"><div><b>'+esc(p.full_name)+'</b><span>'+esc(p.area||'')+'</span></div><select data-assign="'+p.id+'">'+options+'</select></div>';
  }).join('');
  document.querySelectorAll('[data-assign]').forEach(sel=>sel.onchange=()=>assignTeam(sel.dataset.assign,sel.value));
}
async function addTeam(){
  const name=prompt('Nome da equipe:','Equipe 10h');if(!name)return;
  const start=prompt('Horário combinado de entrada (HH:MM):','10:00');if(!/^\d{2}:\d{2}$/.test(start||'')){toast('Horário inválido.',true);return;}
  const tolerance=Number(prompt('Tolerância em minutos:','10')||10);
  try{await rest('ceo_teams',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({month_id:state.month.id,name,start_time:start,tolerance_minutes:tolerance})});toast('Equipe criada.');await loadTeams();renderTeams();}catch(err){toast(err.message,true);}
}
async function assignTeam(personId,teamId){
  try{
    const current=state.assignments.find(a=>a.person_id===personId&&!a.valid_to);
    if(current)await rest('ceo_team_assignments?id=eq.'+current.id,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({valid_to:localDate()})});
    if(teamId)await rest('ceo_team_assignments',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({person_id:personId,team_id:teamId,month_id:state.month.id,valid_from:localDate()})});
    toast('Equipe atualizada.');await loadTeams();renderTeams();
  }catch(err){toast(err.message,true);}
}

function renderPeople(){
  const rows=state.people.map(p=>'<tr><td><b>'+esc(p.full_name)+'</b></td><td>'+esc((p.roles||[]).join(' • '))+'</td><td>'+esc(p.area||'')+'</td><td><select data-status="'+p.id+'"><option value="active" '+(p.status==='active'?'selected':'')+'>Ativo</option><option value="inactive" '+(p.status==='inactive'?'selected':'')+'>Inativo</option><option value="away" '+(p.status==='away'?'selected':'')+'>Indisponível</option><option value="ended" '+(p.status==='ended'?'selected':'')+'>Encerrado</option></select></td><td><div class="row-actions"><button data-access="'+p.id+'" data-name="'+esc(p.full_name)+'">Criar acesso</button></div></td></tr>').join('');
  $('peopleTable').innerHTML='<table class="people-table"><thead><tr><th>Nome</th><th>Função</th><th>Área</th><th>Status</th><th>Acesso</th></tr></thead><tbody>'+rows+'</tbody></table>';
  document.querySelectorAll('[data-status]').forEach(sel=>sel.onchange=()=>updatePersonStatus(sel.dataset.status,sel.value));
  document.querySelectorAll('[data-access]').forEach(btn=>btn.onclick=()=>createAccess(btn.dataset.access,btn.dataset.name));
}
async function updatePersonStatus(id,status){try{await rest('ceo_people?id=eq.'+id,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({status,updated_at:new Date().toISOString()})});const p=personById(id);if(p)p.status=status;toast('Status atualizado.');renderToday();}catch(err){toast(err.message,true);}}
async function addPerson(){
  const name=prompt('Nome completo:');if(!name)return;
  const area=prompt('Área/função principal:','Promotor de Marketing')||'';
  try{await rest('ceo_people',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({full_name:name,roles:[area],area,status:'active'})});toast('Pessoa adicionada.');state.people=await rest('ceo_people?select=*&order=full_name.asc');fillPeopleSelects();renderPeople();renderTeams();}catch(err){toast(err.message,true);}
}
async function createAccess(personId,name){
  const email=prompt('E-mail de acesso de '+name+':');if(!email)return;
  const password=prompt('Senha inicial (mínimo 6 caracteres):');if(!password)return;
  try{
    const res=await fetch(cfg.url+'/functions/v1/raiox-create-user',{method:'POST',headers:{apikey:cfg.key,Authorization:'Bearer '+state.session.access_token,'Content-Type':'application/json'},body:JSON.stringify({person_id:personId,display_name:name,email,password})});
    const data=await res.json();if(!res.ok)throw new Error(data.error||'Falha ao criar acesso.');
    toast('Acesso criado para '+name+'.');
  }catch(err){toast(err.message,true);}
}

function fillPeopleSelects(){
  const opts=state.people.map(p=>'<option value="'+p.id+'">'+esc(p.full_name)+'</option>').join('');
  $('onePerson').innerHTML=opts;$('taskPerson').innerHTML='<option value="">Sem pessoa específica</option>'+opts;
}
async function saveOne(){
  const body={person_id:$('onePerson').value,month_id:state.month.id,meeting_date:$('oneDate').value||localDate(),topic:$('oneTopic').value||null,what_is_working:$('oneWorking').value||null,blockers:$('oneBlockers').value||null,improvement:$('oneImprovement').value||null,leadership_support:$('oneSupport').value||null,commitments:$('oneCommitments').value||null,review_date:$('oneReviewDate').value||null,visibility:$('oneVisibility').value};
  try{await rest('ceo_one_on_one',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify(body)});toast('Olho no Olho salvo.');['oneTopic','oneWorking','oneBlockers','oneImprovement','oneSupport','oneCommitments','oneReviewDate'].forEach(id=>$(id).value='');await loadOne();renderOneHistory();}catch(err){toast(err.message,true);}
}
function renderOneHistory(){
  $('oneHistory').innerHTML=state.one.length?state.one.map(x=>{const p=personById(x.person_id);return '<div class="history-card"><header><b>'+esc(p?.full_name||'Profissional')+' • '+esc(x.topic||'Olho no Olho')+'</b><small>'+esc(x.meeting_date)+'</small></header><p>'+(x.commitments?'Compromissos: '+esc(x.commitments):esc(x.improvement||x.blockers||'Registro salvo.'))+'</p></div>';}).join(''):'<div class="history-card"><p>Nenhuma conversa registrada neste mês.</p></div>';
}
async function saveTask(){
  if(!$('taskTitle').value.trim()){toast('Digite o título da pendência.',true);return;}
  const body={month_id:state.month.id,person_id:$('taskPerson').value||null,title:$('taskTitle').value.trim(),due_date:$('taskDue').value||null,priority:$('taskPriority').value,note:$('taskNote').value||null};
  try{await rest('ceo_tasks',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify(body)});$('taskTitle').value='';$('taskNote').value='';toast('Pendência adicionada.');await loadTasks();renderTasks();}catch(err){toast(err.message,true);}
}
function renderTasks(){
  const open=state.tasks.filter(t=>t.status==='open');
  $('tasksList').innerHTML=open.length?open.map(t=>{const p=personById(t.person_id);return '<div class="task-card"><header><b>'+esc(t.title)+'</b><small>'+esc(t.priority.toUpperCase())+(t.due_date?' • '+esc(t.due_date):'')+'</small></header><p>'+esc(p?.full_name||'Geral')+(t.note?' • '+esc(t.note):'')+'</p><button data-done="'+t.id+'">Concluir</button></div>';}).join(''):'<div class="task-card"><p>Nenhuma pendência aberta.</p></div>';
  document.querySelectorAll('[data-done]').forEach(btn=>btn.onclick=()=>finishTask(btn.dataset.done));
}
async function finishTask(id){try{await rest('ceo_tasks?id=eq.'+id,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({status:'done',completed_at:new Date().toISOString()})});toast('Pendência concluída.');await loadTasks();renderTasks();}catch(err){toast(err.message,true);}}

async function renderReports(){
  if(!state.month)return;
  const start=state.month.ref_month;
  const end=new Date(start+'T00:00:00');end.setMonth(end.getMonth()+1);const endStr=localDate(end);
  const presence=await rest('ceo_daily_presence?select=*&work_date=gte.'+start+'&work_date=lt.'+endStr);
  const counts={present:0,absent:0,late:0,agreed_off:0,unavailable:0,training:0,remote:0,left_early:0};
  presence.forEach(x=>{if(counts[x.status]!=null)counts[x.status]++;});
  const open=state.tasks.filter(t=>t.status==='open').length;
  $('reportMonthTitle').textContent=state.month.label;
  $('reportSummary').innerHTML=[
    ['Registros',presence.length,'no mês'],
    ['Compareceu',counts.present,'registros'],
    ['Não compareceu',counts.absent,'registros'],
    ['Após combinado',counts.late,'registros'],
    ['Olho no Olho',state.one.length,'conversas']
  ].map(x=>'<div class="summary-card"><small>'+x[0]+'</small><b>'+x[1]+'</b><span>'+x[2]+'</span></div>').join('');
  const byPerson={};presence.forEach(r=>{byPerson[r.person_id]??={present:0,absent:0,late:0,other:0};if(r.status==='present')byPerson[r.person_id].present++;else if(r.status==='absent')byPerson[r.person_id].absent++;else if(r.status==='late')byPerson[r.person_id].late++;else byPerson[r.person_id].other++;});
  const attention=Object.entries(byPerson).filter(([,v])=>v.absent||v.late).sort((a,b)=>(b[1].absent*2+b[1].late)-(a[1].absent*2+a[1].late)).slice(0,10);
  $('reportBody').innerHTML=
    '<div class="report-section"><h3>Resumo operacional</h3><p>'+counts.present+' comparecimentos • '+counts.absent+' não comparecimentos • '+counts.late+' registros após o horário combinado • '+counts.agreed_off+' folgas combinadas • '+counts.unavailable+' indisponibilidades.</p></div>'+
    '<div class="report-section"><h3>Acompanhamentos</h3><p>'+state.one.length+' Olho no Olho registrados • '+open+' pendências abertas.</p></div>'+
    '<div class="report-section"><h3>Pontos para revisar</h3><p>'+(attention.length?attention.map(([id,v])=>{const p=personById(id);return esc(p?.full_name||'Pessoa')+': '+v.absent+' não compareceu • '+v.late+' após combinado';}).join('<br>'):'Sem ocorrências de falta/atraso registradas no mês.')+'</p></div>';
}

async function newMonth(){
  const ref=prompt('Novo mês no formato AAAA-MM:','2026-10');if(!/^\d{4}-\d{2}$/.test(ref||'')){if(ref)toast('Formato inválido.',true);return;}
  const date=ref+'-01';const [y,m]=ref.split('-').map(Number);const label=new Date(y,m-1,1).toLocaleDateString('pt-BR',{month:'long',year:'numeric'}).replace(/^./,s=>s.toUpperCase());
  try{await rest('ceo_months',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({ref_month:date,label,status:'open',created_by:state.user.id})});toast('Novo mês criado.');state.months=await rest('ceo_months?select=*&order=ref_month.desc');renderMonths();const created=state.months.find(x=>x.ref_month===date);if(created)await selectMonth(created.id);}catch(err){toast(err.message,true);}
}

function setTab(id){
  document.querySelectorAll('.ceo-tab').forEach(s=>s.classList.toggle('on',s.id===id));
  document.querySelectorAll('#ceoNav button').forEach(b=>b.classList.toggle('active',b.dataset.tab===id));
  $('ceoTitle').textContent=TITLES[id][0];$('ceoSubtitle').textContent=TITLES[id][1];
  if(id==='reports')renderReports();
  if(id==='approvals')loadApprovals();
}
function bind(){
  document.querySelectorAll('#ceoNav button').forEach(b=>b.onclick=()=>setTab(b.dataset.tab));
  $('monthSelect').onchange=()=>selectMonth($('monthSelect').value);
  $('todayDate').onchange=loadToday;$('reloadToday').onclick=loadToday;
  $('addTeamBtn').onclick=addTeam;$('addPersonBtn').onclick=addPerson;
  $('saveOneBtn').onclick=saveOne;$('saveTaskBtn').onclick=saveTask;
  $('refreshReports').onclick=renderReports;if($('refreshApprovals'))$('refreshApprovals').onclick=loadApprovals;$('newMonthBtn').onclick=newMonth;$('ceoLogout').onclick=signOut;
}
async function init(){
  try{
    await validateCEO();
    $('ceoUserName').textContent=state.admin.display_name||'CEO';$('ceoUserEmail').textContent=state.user.email||'';
    $('todayDate').value=localDate();$('oneDate').value=localDate();
    bind();await loadBase();
    $('ceoLoading').style.display='none';$('ceoApp').hidden=false;
  }catch(err){
    $('ceoLoading').innerHTML='<div class="loader-mark">RX</div><b>'+esc(err.message)+'</b><a href="./" style="color:#18e7ff;font-size:9px">Voltar ao RAIO X</a>';
  }
}
document.addEventListener('DOMContentLoaded',init);
})();