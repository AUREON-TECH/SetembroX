(()=>{
const cfg=window.RAIOX_AUTH_CONFIG||{};
const STORE='raiox.auth.session.v1';
const $=id=>document.getElementById(id);
const state={
  session:null,user:null,admin:null,
  months:[],month:null,people:[],teams:[],assignments:[],
  presence:[],one:[],tasks:[],approvals:[],agenda:[],goals:[],todayArea:'all'
};
const TITLES={
  today:['Hoje','Pulso executivo da operação: performance, presença e atenção.'],
  teams:['Equipes','Defina equipes, horários e vínculos do mês.'],
  people:['Pessoas','Cadastro PJ completo, cargos, metas e histórico.'],
  one:['Olho no Olho','Conversa 1:1, compromissos e acompanhamento.'],
  xia:['XIA','Inteligência analítica 360° de cada profissional.'],
  agenda:['Agenda','Treinamentos, meetings, reuniões e compromissos.'],
  tasks:['Pendências','Tudo que você precisa revisar, conversar ou acompanhar.'],
  reports:['Relatórios','Resumo diário e mensal da gestão de pessoas.'],
  approvals:['Aprovações','Controle quem pode ou não acessar o RAIO X.']
};
const STATUS={
  present:'Compareceu',
  absent:'Não compareceu',
  unavailable:'Indisponível',
  agreed_off:'Folga combinada',
  late:'Chegou após o combinado',
  left_early:'Saiu antes do combinado',
  training:'Treinamento',
  remote:'Remoto'
};
const ROLE_ORDER=['Promotor de Marketing','Liner / Consultor','Closer / Fechador','Liderança','Gestão','Apoio','Outros'];

function toast(msg,error=false){
  const el=$('ceoToast'); if(!el)return;
  el.textContent=msg; el.className='toast show'+(error?' error':'');
  setTimeout(()=>el.className='toast',2800);
}
function localDate(d=new Date()){
  const z=new Date(d.getTime()-d.getTimezoneOffset()*60000);
  return z.toISOString().slice(0,10);
}
function money(v){return Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}
function num(v,d=0){return Number(v||0).toLocaleString('pt-BR',{minimumFractionDigits:d,maximumFractionDigits:d});}
function pct(v){return num(v,1)+'%';}
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function norm(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();}
function time5(v){return v?String(v).slice(0,5):'';}
function roleOf(p){return (p.roles&&p.roles[0])||p.area||'Outros';}
function statusLabel(s){return s==='active'?'Ativo':s==='inactive'?'Inativo':s==='away'?'Indisponível':s==='ended'?'Distratado':s;}
function dateBr(v){if(!v)return '—';const [y,m,d]=String(v).slice(0,10).split('-');return d+'/'+m+'/'+y;}
function monthKeyFromDate(v){return String(v||'').slice(0,7)+'-01';}

async function raw(path,options={},token=state.session?.access_token){
  const headers=Object.assign({apikey:cfg.key,'Content-Type':'application/json'},options.headers||{});
  if(token)headers.Authorization='Bearer '+token;
  const res=await fetch(cfg.url+path,Object.assign({},options,{headers}));
  const txt=await res.text();let data={};
  try{data=txt?JSON.parse(txt):{};}catch(_){data={message:txt};}
  if(!res.ok)throw new Error(data.message||data.msg||data.error||'Erro ao acessar o banco.');
  return data;
}
async function rest(path,options={}){return raw('/rest/v1/'+path,options);}

function loadSession(){try{return JSON.parse(localStorage.getItem(STORE)||'null');}catch(_){return null;}}
async function refresh(s){
  const d=await raw('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:JSON.stringify({refresh_token:s.refresh_token})},null);
  const n={access_token:d.access_token,refresh_token:d.refresh_token,expires_at:d.expires_at||Math.floor(Date.now()/1000)+(d.expires_in||3600),user:d.user};
  localStorage.setItem(STORE,JSON.stringify(n)); return n;
}
async function validateCEO(){
  let s=loadSession(); if(!s)throw new Error('Faça login no RAIO X primeiro.');
  if(!s.expires_at||s.expires_at-Math.floor(Date.now()/1000)<90)s=await refresh(s);
  const user=await raw('/auth/v1/user',{method:'GET'},s.access_token);
  state.session=s; state.user=user;
  const rows=await rest('ceo_admins?select=user_id,display_name&user_id=eq.'+encodeURIComponent(user.id));
  if(!rows[0])throw new Error('Esta conta não possui acesso ao Portal CEO.');
  state.admin=rows[0];
}
async function signOut(){
  try{await raw('/auth/v1/logout',{method:'POST'});}catch(_){}
  localStorage.removeItem(STORE); location.href='./';
}
async function adminAction(action,payload={}){
  const res=await fetch(cfg.url+'/functions/v1/raiox-create-user',{
    method:'POST',
    headers:{apikey:cfg.key,Authorization:'Bearer '+state.session.access_token,'Content-Type':'application/json'},
    body:JSON.stringify(Object.assign({action},payload))
  });
  const data=await res.json();
  if(!res.ok)throw new Error(data.error||'Falha ao administrar o acesso.');
  return data;
}

async function loadBase(){
  const [months,people]=await Promise.all([
    rest('ceo_months?select=*&order=ref_month.desc'),
    rest('ceo_people?select=*&order=full_name.asc')
  ]);
  state.months=months; state.people=people;
  fillPeopleSelects();
  await loadApprovals();
  const currentMonth=monthKeyFromDate(localDate());
  const preferred=state.months.find(m=>m.ref_month===currentMonth)||state.months.find(m=>m.status==='open')||state.months[0];
  renderMonths(preferred?.id);
  if(preferred)await selectMonth(preferred.id);
}
function renderMonths(selected){
  if(!$('monthSelect'))return;
  $('monthSelect').innerHTML=state.months.map(m=>'<option value="'+m.id+'">'+esc(m.label)+(m.status==='closed'?' • fechado':'')+'</option>').join('');
  if(selected)$('monthSelect').value=selected;
}
async function selectMonth(id){
  state.month=state.months.find(m=>m.id===id)||state.months[0];
  if(!state.month)return;
  $('monthSelect').value=state.month.id;
  const monthPrefix=state.month.ref_month.slice(0,7);
  const today=localDate();
  if(!$('todayDate').value||$('todayDate').value.slice(0,7)!==monthPrefix){
    $('todayDate').value=today.slice(0,7)===monthPrefix?today:state.month.ref_month;
  }
  await Promise.all([loadTeams(),loadTasks(),loadOne(),loadGoals(),loadAgenda()]);
  await loadToday();
  fillPeopleSelects();
  renderTeams(); renderPeople(); renderOneHistory(); renderTasks(); renderAgenda(); await renderReports();
  if(document.getElementById('xia')?.classList.contains('on'))await renderXIA();
}
async function loadTeams(){
  state.teams=await rest('ceo_teams?select=*&month_id=eq.'+state.month.id+'&order=start_time.asc');
  state.assignments=await rest('ceo_team_assignments?select=*&month_id=eq.'+state.month.id+'&valid_to=is.null');
}
async function loadTasks(){state.tasks=await rest('ceo_tasks?select=*&month_id=eq.'+state.month.id+'&order=created_at.desc');}
async function loadOne(){state.one=await rest('ceo_one_on_one?select=*&month_id=eq.'+state.month.id+'&order=meeting_date.desc,created_at.desc');}
async function loadGoals(){state.goals=await rest('ceo_person_goals?select=*&month_id=eq.'+state.month.id);}
async function loadAgenda(){state.agenda=await rest('ceo_agenda?select=*&month_id=eq.'+state.month.id+'&order=event_date.asc,start_time.asc');}
async function loadToday(){
  const date=$('todayDate').value||localDate(); $('todayDate').value=date;
  state.presence=await rest('ceo_daily_presence?select=*&work_date=eq.'+date);
  renderToday();
}
function activePeople(){return state.people.filter(p=>p.status!=='ended');}
function workingPeople(){return state.people.filter(p=>p.status==='active');}
function personById(id){return state.people.find(p=>p.id===id);}
function goalByPerson(id){return state.goals.find(g=>g.person_id===id)||null;}
function teamByPerson(id){
  const a=state.assignments.find(x=>x.person_id===id&&!x.valid_to);
  return a?state.teams.find(t=>t.id===a.team_id):null;
}
function effectiveStart(p){
  const team=teamByPerson(p.id);
  return time5(p.default_start_time)||time5(team?.start_time)||'—';
}

function performanceUpdatedMonth(){
  const raw=window.XIA_PERFORMANCE?.updated||'';
  const m=raw.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  return m?m[3]+'-'+m[2]:null;
}
function performanceAvailableForDate(date){
  return Boolean(date&&performanceUpdatedMonth()===String(date).slice(0,7));
}
const TODAY_AREA_ROLES={
  promotor:'Promotor de Marketing',
  liner:'Liner / Consultor',
  closer:'Closer / Fechador'
};
function todayAreaRole(){return TODAY_AREA_ROLES[state.todayArea]||null;}
function personMatchesTodayArea(p){
  const role=todayAreaRole();
  return !role||norm(roleOf(p))===norm(role);
}
function todayWorkingPeople(){return workingPeople().filter(personMatchesTodayArea);}
function performanceRoles(roleName='Promotor de Marketing'){
  return (window.XIA_PERFORMANCE?.people||[])
    .flatMap(person=>(person.roles||[]).map(role=>({name:person.name,...role})))
    .filter(x=>norm(x.role)===norm(roleName));
}
function areaPerformanceDay(date,roleName){
  if(!performanceAvailableForDate(date))return null;
  const day=Math.max(1,Number(String(date).slice(8,10)||1));
  const roles=performanceRoles(roleName);
  const people=[];
  const total={c:0,s:0,v:0,q:0,nq:0,g:0};
  roles.forEach(r=>{
    const row=r.daily?.[day-1]||[0,0,0,0,0];
    const item={name:r.name,c:Number(row[0]||0),s:Number(row[1]||0),v:Number(row[2]||0),q:Number(row[3]||0),nq:Number(row[4]||0),g:0,month:r,role:r.role};
    people.push(item);
    total.c+=item.c; total.s+=item.s; total.v+=item.v; total.q+=item.q; total.nq+=item.nq;
  });
  return {day,total,people,role:roleName,updated:window.XIA_PERFORMANCE?.updated||'—'};
}
function performanceDay(date){
  const role=todayAreaRole();
  if(role)return areaPerformanceDay(date,role);
  if(!performanceAvailableForDate(date))return null;
  return {
    mode:'all',
    updated:window.XIA_PERFORMANCE?.updated||'—',
    areas:Object.entries(TODAY_AREA_ROLES).map(([key,label])=>({key,label,data:areaPerformanceDay(date,label)}))
  };
}
function performanceMonth(roleName=todayAreaRole()){
  if(!roleName||!state.month||performanceUpdatedMonth()!==state.month.ref_month.slice(0,7))return null;
  const roles=performanceRoles(roleName);
  return roles.reduce((a,r)=>{
    a.c+=Number(r.c||0);a.s+=Number(r.s||0);a.v+=Number(r.v||0);a.q+=Number(r.q||0);a.nq+=Number(r.nq||0);a.g+=Number(r.g||0);
    return a;
  },{c:0,s:0,v:0,q:0,nq:0,g:0});
}
function todayAttention(perf){
  const alerts=[];
  const rows=[...document.querySelectorAll('.presence-row')];
  rows.forEach(row=>{
    const p=personById(row.dataset.person);
    const status=row.querySelector('.presence-status')?.value||'present';
    if(!p)return;
    if(status==='absent')alerts.push({level:'critical',title:p.full_name,text:'Não compareceu hoje.',tag:'PRESENÇA'});
    else if(status==='late')alerts.push({level:'warn',title:p.full_name,text:'Chegou após o horário combinado.',tag:'HORÁRIO'});
    else if(status==='left_early')alerts.push({level:'warn',title:p.full_name,text:'Saiu antes do horário combinado.',tag:'HORÁRIO'});
    else if(status==='unavailable')alerts.push({level:'info',title:p.full_name,text:'Está marcado como indisponível.',tag:'DISPONIBILIDADE'});
  });
  const perfPeople=perf?.mode==='all'
    ? perf.areas.flatMap(a=>(a.data?.people||[]).map(x=>({...x,areaLabel:a.label})))
    : (perf?.people||[]);
  if(perfPeople.length){
    perfPeople.filter(x=>x.c>=2&&x.s===0).sort((a,b)=>b.c-a.c).slice(0,4).forEach(x=>{
      alerts.push({level:'warn',title:x.name,text:x.c+' casais hoje e nenhuma venda registrada.',tag:'CONVERSÃO'});
    });
    perfPeople.filter(x=>x.c>=2&&x.q/Math.max(x.c,1)<.5).sort((a,b)=>b.c-a.c).slice(0,3).forEach(x=>{
      alerts.push({level:'info',title:x.name,text:'Qualificação de '+pct(x.q/Math.max(x.c,1)*100)+' hoje ('+x.q+' Q em '+x.c+').',tag:'QUALIFICAÇÃO'});
    });
  }
  const unique=[];
  const seen=new Set();
  alerts.forEach(a=>{
    const key=norm(a.title)+'|'+a.tag;
    if(!seen.has(key)){seen.add(key);unique.push(a);}
  });
  return unique.slice(0,8);
}
function renderTodayExecutive(){
  const date=$('todayDate')?.value||localDate();
  const perf=performanceDay(date);
  const month=performanceMonth();
  if($('todayPerformance')){
    if(!perf){
      $('todayPerformance').innerHTML='<div class="today-data-empty"><b>Performance do período ainda não carregada</b><span>Presença e gestão continuam disponíveis. Base XIA: '+esc(window.XIA_PERFORMANCE?.updated||'—')+'.</span></div>';
    }else if(perf.mode==='all'){
      const cards=perf.areas.map((a,i)=>{
        const t=a.data?.total||{c:0,s:0,v:0};
        const conv=t.c?t.s/t.c*100:0;
        const volumeLabel=a.key==='promotor'?'casais':'atendimentos';
        return [a.label,t.c+' / '+t.s,volumeLabel+' / vendas • '+pct(conv),['cyan','blue','violet'][i]||'cyan'];
      });
      cards.push(['Visão de gestão',todayWorkingPeople().length+' pessoas','Todas as áreas • base '+perf.updated,'gold']);
      $('todayPerformance').innerHTML=cards.map(x=>'<div class="today-kpi '+x[3]+'"><small>'+x[0]+'</small><b>'+x[1]+'</b><span>'+x[2]+'</span></div>').join('');
    }else{
      const t=perf.total;
      const conv=t.c?t.s/t.c*100:0;
      const qual=t.c?t.q/t.c*100:0;
      const monthConv=month?.c?month.s/month.c*100:0;
      const volumeLabel=state.todayArea==='promotor'?'Casais':'Atendimentos';
      $('todayPerformance').innerHTML=[
        [volumeLabel+' hoje',t.c,'volume da área','cyan'],
        ['Vendas hoje',t.s,pct(conv)+' conversão','green'],
        ['VGV hoje',money(t.v),month?'Mês '+money(month.v):'base '+perf.updated,'violet'],
        ['Q / NQ',t.q+' / '+t.nq,pct(qual)+' qualificação','blue'],
        ['Mês acumulado',month?month.c+' / '+month.s:'—',month?(volumeLabel.toLowerCase()+' / vendas • '+pct(monthConv)):'sem base','gold']
      ].map(x=>'<div class="today-kpi '+x[3]+'"><small>'+x[0]+'</small><b>'+x[1]+'</b><span>'+x[2]+'</span></div>').join('');
    }
  }
  const alerts=todayAttention(perf);
  if($('todayAlertCount'))$('todayAlertCount').textContent=alerts.length+' sinal'+(alerts.length===1?'':'s');
  if($('todayAlerts'))$('todayAlerts').innerHTML=alerts.length?alerts.map(a=>
    '<div class="today-alert '+a.level+'"><span>'+esc(a.tag)+'</span><div><b>'+esc(a.title)+'</b><p>'+esc(a.text)+'</p></div></div>'
  ).join(''):'<div class="today-alert-empty"><b>Nenhum sinal crítico agora.</b><span>Continue acompanhando performance e presença ao longo do dia.</span></div>';
}
function effectiveTodayStatus(p){
  const rec=state.presence.find(x=>x.person_id===p.id);
  return rec?.status||'present';
}
function updateTodaySummaryFromRows(){
  const rows=[...document.querySelectorAll('.presence-row')];
  const counts={present:0,absent:0,late:0,other:0};
  rows.forEach(row=>{
    const s=row.querySelector('.presence-status')?.value||'present';
    if(s==='present')counts.present++;
    else if(s==='absent')counts.absent++;
    else if(s==='late')counts.late++;
    else counts.other++;
  });
  if($('todaySummary'))$('todaySummary').innerHTML=[
    ['Ativos',rows.length,'pessoas'],
    ['Presentes',counts.present,'no dia'],
    ['Ausências',counts.absent,'no dia'],
    ['Atrasos',counts.late,'no dia'],
    ['Outros',counts.other,'folga/indisponível/etc.']
  ].map(x=>'<div class="summary-card"><small>'+x[0]+'</small><b>'+x[1]+'</b><span>'+x[2]+'</span></div>').join('');
  renderTodayExecutive();
}
function renderToday(){
  const people=todayWorkingPeople();
  const areaLabel=state.todayArea==='all'?'Todas as áreas':(TODAY_AREA_ROLES[state.todayArea]||'Área');
  $('todayCount').textContent=people.length+' pessoas • '+areaLabel;
  $('todayPeople').innerHTML=people.map(p=>{
    const rec=state.presence.find(x=>x.person_id===p.id)||{};
    const team=teamByPerson(p.id);
    const selected=rec.status||'present';
    const opts=Object.entries(STATUS).map(([k,v])=>'<option value="'+k+'" '+(selected===k?'selected':'')+'>'+v+'</option>').join('');
    const schedule=time5(p.default_start_time)||time5(team?.start_time);
    const teamText=team?team.name:'sem equipe';
    return '<div class="presence-row" data-person="'+p.id+'">'+
      '<div class="person-main"><b>'+esc(p.full_name)+'</b><span>'+esc(roleOf(p))+' • '+esc(teamText)+(schedule?' • '+schedule:'')+'</span></div>'+
      '<select class="presence-status">'+opts+'</select>'+
      '<input class="arrival" type="time" title="Horário real de chegada" value="'+esc(time5(rec.arrival_time))+'">'+
      '<input class="presence-note" placeholder="Observação" value="'+esc(rec.note||'')+'">'+
    '</div>';
  }).join('');
  document.querySelectorAll('.presence-status').forEach(s=>s.onchange=updateTodaySummaryFromRows);
  updateTodaySummaryFromRows();
}
function markAllPresent(){
  document.querySelectorAll('.presence-status').forEach(s=>s.value='present');
  updateTodaySummaryFromRows();
}
async function saveDay(){
  const rows=[...document.querySelectorAll('.presence-row')];
  if(!rows.length)return;
  const workDate=$('todayDate').value;
  if(workDate.slice(0,7)!==state.month.ref_month.slice(0,7)){
    toast('A data escolhida não pertence ao mês de referência selecionado.',true);
    return;
  }
  const body=rows.map(row=>({
    person_id:row.dataset.person,
    month_id:state.month.id,
    work_date:workDate,
    status:row.querySelector('.presence-status').value||'present',
    arrival_time:row.querySelector('.arrival').value||null,
    note:row.querySelector('.presence-note').value||null,
    updated_at:new Date().toISOString()
  }));
  try{
    $('saveDayBtn').disabled=true; $('saveDayBtn').textContent='Salvando...';
    await rest('ceo_daily_presence?on_conflict=person_id,work_date',{
      method:'POST',
      headers:{Prefer:'resolution=merge-duplicates,return=minimal'},
      body:JSON.stringify(body)
    });
    toast(body.length+' registros do dia salvos.');
    await loadToday();
  }catch(err){toast(err.message,true);}
  finally{$('saveDayBtn').disabled=false;$('saveDayBtn').textContent='Salvar o dia';}
}

function renderTeams(){
  $('teamsGrid').innerHTML=state.teams.length?state.teams.map(t=>
    '<div class="team-card"><small>EQUIPE</small><h3>'+esc(t.name)+'</h3><b>'+time5(t.start_time)+'</b><p>Tolerância '+t.tolerance_minutes+' min'+(t.end_time?' • saída '+time5(t.end_time):'')+'</p></div>'
  ).join(''):'<div class="team-card"><h3>Nenhuma equipe criada</h3><p>Crie a primeira e defina o horário combinado.</p></div>';

  $('teamAssignments').innerHTML=workingPeople().map(p=>{
    const current=teamByPerson(p.id);
    const options='<option value="">Sem equipe</option>'+state.teams.map(t=>'<option value="'+t.id+'" '+(current?.id===t.id?'selected':'')+'>'+esc(t.name)+' • '+time5(t.start_time)+'</option>').join('');
    return '<div class="assignment-row"><div><b>'+esc(p.full_name)+'</b><span>'+esc(roleOf(p))+' • horário individual '+esc(time5(p.default_start_time)||'não definido')+'</span></div><select data-assign="'+p.id+'">'+options+'</select></div>';
  }).join('');
  document.querySelectorAll('[data-assign]').forEach(sel=>sel.onchange=()=>assignTeam(sel.dataset.assign,sel.value));
  fillAgendaTeams();
}
async function addTeam(){
  const name=prompt('Nome da equipe:','Equipe 10h'); if(!name)return;
  const start=prompt('Horário combinado de entrada (HH:MM):','10:00');
  if(!/^\d{2}:\d{2}$/.test(start||'')){toast('Horário inválido.',true);return;}
  const tolerance=Number(prompt('Tolerância em minutos:','10')||10);
  try{
    await rest('ceo_teams',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({month_id:state.month.id,name,start_time:start,tolerance_minutes:tolerance})});
    toast('Equipe criada.'); await loadTeams(); renderTeams(); renderPeople();
  }catch(err){toast(err.message,true);}
}
async function assignTeam(personId,teamId){
  try{
    const current=state.assignments.find(a=>a.person_id===personId&&!a.valid_to);
    if(current&&current.team_id!==teamId){
      await rest('ceo_team_assignments?id=eq.'+current.id,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({valid_to:localDate()})});
    }
    if(teamId&&current?.team_id!==teamId){
      await rest('ceo_team_assignments',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({person_id:personId,team_id:teamId,month_id:state.month.id,valid_from:localDate()})});
    }
    if(!teamId&&current){/* current already closed above */}
    toast('Equipe atualizada.'); await loadTeams(); renderTeams(); renderPeople(); renderToday();
  }catch(err){toast(err.message,true);}
}

function personTable(rows,ended=false){
  if(!rows.length)return '<div class="approval-empty">'+(ended?'Nenhum distratado.':'Nenhuma pessoa neste grupo.')+'</div>';
  return '<div class="table-wrap"><table class="people-table"><thead><tr>'+
    '<th>Profissional</th><th>CNPJ / Contato</th><th>Horário</th><th>Equipe</th><th>Status</th><th>Metas do mês</th><th>Ações</th>'+
    '</tr></thead><tbody>'+rows.map(p=>{
      const team=teamByPerson(p.id); const goal=goalByPerson(p.id);
      const status=p.status||'active';
      const actions=ended
        ?'<button data-edit-person="'+p.id+'">Ver / editar</button><button class="danger" data-delete-person="'+p.id+'">Excluir</button>'
        :'<button data-edit-person="'+p.id+'">Editar</button><button data-access-person="'+p.id+'">Acesso</button><button class="danger" data-end-person="'+p.id+'">Distratar</button><button class="danger" data-delete-person="'+p.id+'">Excluir</button>';
      return '<tr>'+
        '<td><b>'+esc(p.full_name)+'</b><small>'+esc((p.roles&&p.roles.length?p.roles:[roleOf(p)]).join(' • '))+(p.email?' • '+esc(p.email):'')+'</small></td>'+
        '<td>'+esc(p.cnpj||'—')+'<small>'+esc(p.phone||'sem telefone')+'</small></td>'+
        '<td><b>'+esc(effectiveStart(p))+'</b><small>'+esc(time5(p.default_end_time)||'saída não definida')+'</small></td>'+
        '<td>'+esc(team?.name||'Sem equipe')+'</td>'+
        '<td><span class="status-badge status-'+esc(status)+'">'+esc(statusLabel(status))+'</span></td>'+
        '<td><b>'+num(goal?.couples_goal||0)+' / '+num(goal?.sales_goal||0)+'</b><small>volume / vendas'+(goal?.vgv_goal?' • '+money(goal.vgv_goal):'')+'</small></td>'+
        '<td><div class="row-actions">'+actions+'</div></td>'+
      '</tr>';
    }).join('')+'</tbody></table></div>';
}
function bindPeopleActions(){
  document.querySelectorAll('[data-edit-person]').forEach(b=>b.onclick=()=>openPersonModal(personById(b.dataset.editPerson)));
  document.querySelectorAll('[data-access-person]').forEach(b=>b.onclick=()=>openAccessForPerson(b.dataset.accessPerson));
  document.querySelectorAll('[data-end-person]').forEach(b=>b.onclick=()=>endPerson(b.dataset.endPerson));
  document.querySelectorAll('[data-delete-person]').forEach(b=>b.onclick=()=>deletePerson(b.dataset.deletePerson));
}
function renderPeople(){
  const active=state.people.filter(p=>p.status!=='ended');
  const ended=state.people.filter(p=>p.status==='ended');
  $('activePeopleCount').textContent=active.length+' ativos/cadastrados';
  $('endedPeopleCount').textContent=ended.length+' distratados';

  const grouped={};
  active.forEach(p=>{
    const roles=(p.roles&&p.roles.length?p.roles:[roleOf(p)]).map(r=>ROLE_ORDER.includes(r)?r:'Outros');
    [...new Set(roles)].forEach(role=>(grouped[role]??=[]).push(p));
  });
  $('peopleTable').innerHTML=ROLE_ORDER.filter(r=>grouped[r]?.length).map(role=>
    '<div class="role-group"><div class="role-group-head"><h3>'+esc(role)+'</h3><span>'+grouped[role].length+' pessoas</span></div>'+personTable(grouped[role])+'</div>'
  ).join('');
  $('endedPeopleTable').innerHTML=personTable(ended,true);
  bindPeopleActions();
}

function fillPersonTeamSelect(selected=''){
  const el=$('personTeam'); if(!el)return;
  el.innerHTML='<option value="">Sem equipe</option>'+state.teams.map(t=>'<option value="'+t.id+'">'+esc(t.name)+' • '+time5(t.start_time)+'</option>').join('');
  el.value=selected||'';
}
function openPersonModal(p=null){
  const edit=Boolean(p);
  $('personModalTitle').textContent=edit?'Editar cadastro PJ':'Adicionar pessoa';
  $('personEditId').value=p?.id||'';
  $('personName').value=p?.full_name||'';
  $('personCnpj').value=p?.cnpj||'';
  $('personPhone').value=p?.phone||'';
  $('personRole').value=roleOf(p||{roles:['Promotor de Marketing']});
  $('personStatus').value=p?.status==='ended'?'inactive':p?.status||'active';
  $('personEmail').value=p?.email||'';
  $('personStartedOn').value=p?.started_on||'';
  $('personStartTime').value=time5(p?.default_start_time);
  $('personEndTime').value=time5(p?.default_end_time);
  $('personNotes').value=p?.notes||'';
  $('personPassword').value='';
  const goal=p?goalByPerson(p.id):null;
  $('personGoalCouples').value=goal?.couples_goal||'';
  $('personGoalSales').value=goal?.sales_goal||'';
  $('personGoalVgv').value=goal?.vgv_goal||'';
  fillPersonTeamSelect(p?teamByPerson(p.id)?.id:'');
  $('personModal').hidden=false;
  setTimeout(()=>$('personName')?.focus(),50);
}
function closePersonModal(){if($('personModal'))$('personModal').hidden=true;}
async function savePerson(){
  const id=$('personEditId').value;
  const name=$('personName').value.trim();
  const role=$('personRole').value;
  if(!name){toast('Informe o nome completo.',true);return;}
  const body={
    full_name:name,
    cnpj:$('personCnpj').value.trim()||null,
    phone:$('personPhone').value.trim()||null,
    roles:[role],
    area:role,
    status:$('personStatus').value,
    email:$('personEmail').value.trim().toLowerCase()||null,
    started_on:$('personStartedOn').value||null,
    default_start_time:$('personStartTime').value||null,
    default_end_time:$('personEndTime').value||null,
    notes:$('personNotes').value.trim()||null,
    updated_at:new Date().toISOString()
  };
  try{
    $('savePersonBtn').disabled=true;
    let personId=id;
    if(id){
      await rest('ceo_people?id=eq.'+id,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify(body)});
    }else{
      const created=await rest('ceo_people',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(body)});
      personId=created[0]?.id;
    }
    if(!personId)throw new Error('Não foi possível identificar o cadastro salvo.');

    const goalBody={
      month_id:state.month.id,
      person_id:personId,
      couples_goal:Number($('personGoalCouples').value||0),
      sales_goal:Number($('personGoalSales').value||0),
      vgv_goal:Number($('personGoalVgv').value||0),
      updated_at:new Date().toISOString()
    };
    await rest('ceo_person_goals?on_conflict=month_id,person_id',{
      method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(goalBody)
    });

    const teamId=$('personTeam').value;
    await assignTeam(personId,teamId);

    const email=$('personEmail').value.trim();
    const password=$('personPassword').value;
    if(!id&&email&&password){
      if(password.length<6)throw new Error('A senha inicial precisa ter pelo menos 6 caracteres.');
      await adminAction('create_user',{person_id:personId,display_name:name,email,password});
    }

    state.people=await rest('ceo_people?select=*&order=full_name.asc');
    await loadGoals(); await loadApprovals(); fillPeopleSelects(); renderPeople(); renderToday(); closePersonModal();
    toast('Cadastro salvo.');
  }catch(err){toast(err.message,true);}
  finally{$('savePersonBtn').disabled=false;}
}
async function endPerson(id){
  const p=personById(id); if(!p)return;
  const reason=prompt('Motivo do distrato de '+p.full_name+':','');
  if(reason===null)return;
  if(!confirm('Distratar '+p.full_name+'? O histórico será preservado.'))return;
  try{
    await rest('ceo_people?id=eq.'+id,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({status:'ended',ended_on:localDate(),end_reason:reason||null,updated_at:new Date().toISOString()})});
    await rest('raiox_app_users?person_id=eq.'+id,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:false,approval_status:'rejected',updated_at:new Date().toISOString()})});
    state.people=await rest('ceo_people?select=*&order=full_name.asc');
    await loadApprovals(); fillPeopleSelects(); renderPeople(); renderToday();
    toast('Profissional movido para Distratados.');
  }catch(err){toast(err.message,true);}
}
async function deletePerson(id){
  const p=personById(id); if(!p)return;
  if(!confirm('Excluir definitivamente o cadastro de '+p.full_name+'? Use apenas para quem não faz parte da operação ou foi cadastrado por engano.'))return;
  try{
    await rest('raiox_app_users?person_id=eq.'+id,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:false,approval_status:'rejected',person_id:null,updated_at:new Date().toISOString()})});
    await rest('ceo_people?id=eq.'+id,{method:'DELETE',headers:{Prefer:'return=minimal'}});
    state.people=await rest('ceo_people?select=*&order=full_name.asc');
    await loadGoals(); await loadApprovals(); fillPeopleSelects(); renderPeople(); renderToday();
    toast('Cadastro excluído.');
  }catch(err){toast(err.message,true);}
}
async function openAccessForPerson(personId){
  const p=personById(personId); if(!p)return;
  const existing=state.approvals.find(a=>a.person_id===personId)||state.approvals.find(a=>norm(a.email)===norm(p.email));
  if(existing){
    const choice=prompt('Digite 1 para alterar a senha, 2 para bloquear/reaprovar acesso:','1');
    if(choice==='1')return resetPassword(existing.user_id,p.full_name);
    if(choice==='2'){
      if(existing.active)return revokeAccess(existing.user_id);
      return approveAccess(existing.user_id,true);
    }
    return;
  }
  const email=p.email||prompt('E-mail de acesso de '+p.full_name+':','');
  if(!email)return;
  const password=prompt('Senha inicial (mínimo 6 caracteres):','');
  if(!password)return;
  try{
    await adminAction('create_user',{person_id:p.id,display_name:p.full_name,email,password});
    await rest('ceo_people?id=eq.'+p.id,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({email,updated_at:new Date().toISOString()})});
    await loadApprovals(); toast('Acesso criado e aprovado.');
  }catch(err){toast(err.message,true);}
}
async function resetPassword(userId,name='usuário'){
  const password=prompt('Nova senha para '+name+' (mínimo 6 caracteres):','');
  if(password===null)return;
  if(password.length<6){toast('A senha precisa ter pelo menos 6 caracteres.',true);return;}
  try{await adminAction('reset_password',{user_id:userId,password});toast('Senha alterada com sucesso.');}
  catch(err){toast(err.message,true);}
}

async function loadApprovals(){
  try{
    state.approvals=await rest('raiox_app_users?select=user_id,person_id,display_name,email,role,active,approval_status,requested_at,approved_at,created_at&order=requested_at.desc.nullslast,created_at.desc');
  }catch(err){state.approvals=[];toast('Não foi possível carregar as aprovações.',true);}
  renderApprovals();
}
function approvalLabel(status){return status==='approved'?'Aprovado':status==='rejected'?'Recusado':'Aguardando';}
function renderApprovals(){
  const rows=state.approvals||[];
  const pending=rows.filter(x=>x.approval_status==='pending'||(!x.active&&x.approval_status!=='rejected'));
  const approved=rows.filter(x=>x.approval_status==='approved'&&x.active);
  const rejected=rows.filter(x=>x.approval_status==='rejected');
  const badge=$('approvalBadge');
  if(badge){badge.textContent=pending.length;badge.hidden=pending.length===0;}
  if($('approvalSummary'))$('approvalSummary').innerHTML=[
    ['Aguardando',pending.length,'precisam da sua decisão'],
    ['Aprovados',approved.length,'podem entrar'],
    ['Recusados/Bloqueados',rejected.length,'sem acesso']
  ].map(x=>'<div class="summary-card"><small>'+x[0]+'</small><b>'+x[1]+'</b><span>'+x[2]+'</span></div>').join('');

  if(!$('approvalsList'))return;
  const ordered=[...pending,...approved,...rejected.filter(x=>!pending.includes(x)&&!approved.includes(x))];
  $('approvalsList').innerHTML=ordered.length?ordered.map(x=>{
    const isPending=x.approval_status==='pending'||(!x.active&&x.approval_status!=='rejected');
    const cls=isPending?'pending':x.active?'approved':'rejected';
    const when=x.requested_at||x.created_at||'';
    return '<div class="approval-card '+cls+'">'+
      '<div class="approval-person"><span class="approval-dot"></span><div><b>'+esc(x.display_name||'Usuário')+'</b><small>'+esc(x.email||'E-mail não informado')+'</small></div></div>'+
      '<div class="approval-meta"><span>'+approvalLabel(isPending?'pending':x.approval_status)+'</span><small>'+(when?new Date(when).toLocaleString('pt-BR'):'—')+'</small></div>'+
      '<div class="approval-actions">'+
      (isPending
        ?'<button class="approve" data-approve="'+x.user_id+'">Aprovar</button><button class="reject" data-reject="'+x.user_id+'">Recusar</button>'
        :x.active
          ?'<button data-pass="'+x.user_id+'" data-pass-name="'+esc(x.display_name||'usuário')+'">Alterar senha</button><button class="reject" data-revoke="'+x.user_id+'">Bloquear</button>'
          :'<button class="approve" data-approve="'+x.user_id+'">Reaprovar</button>')+
      '</div></div>';
  }).join(''):'<div class="approval-empty">Nenhuma solicitação de acesso encontrada.</div>';

  document.querySelectorAll('[data-approve]').forEach(b=>b.onclick=()=>approveAccess(b.dataset.approve,true));
  document.querySelectorAll('[data-reject]').forEach(b=>b.onclick=()=>approveAccess(b.dataset.reject,false));
  document.querySelectorAll('[data-revoke]').forEach(b=>b.onclick=()=>revokeAccess(b.dataset.revoke));
  document.querySelectorAll('[data-pass]').forEach(b=>b.onclick=()=>resetPassword(b.dataset.pass,b.dataset.passName));
}
async function approveAccess(userId,approve){
  try{
    if(approve){
      await adminAction('approve_user',{user_id:userId});
      toast('Acesso aprovado. A pessoa já pode entrar.');
    }else{
      await rest('raiox_app_users?user_id=eq.'+encodeURIComponent(userId),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:false,approval_status:'rejected',approved_at:null,approved_by:state.user.id,updated_at:new Date().toISOString()})});
      toast('Solicitação recusada.');
    }
    await loadApprovals();
  }catch(err){toast(err.message,true);}
}
async function revokeAccess(userId){
  if(!confirm('Bloquear o acesso deste usuário?'))return;
  try{
    await rest('raiox_app_users?user_id=eq.'+encodeURIComponent(userId),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:false,approval_status:'rejected',updated_at:new Date().toISOString()})});
    toast('Acesso bloqueado.'); await loadApprovals();
  }catch(err){toast(err.message,true);}
}

function fillPeopleSelects(){
  const current=workingPeople();
  const opts=current.map(p=>'<option value="'+p.id+'">'+esc(p.full_name)+' • '+esc(roleOf(p))+'</option>').join('');
  if($('onePerson'))$('onePerson').innerHTML=opts;
  if($('taskPerson'))$('taskPerson').innerHTML='<option value="">Sem pessoa específica</option>'+opts;
  if($('agendaPerson'))$('agendaPerson').innerHTML='<option value="">Toda a operação / sem pessoa</option>'+opts;
  if($('xiaPerson')){
    const prior=$('xiaPerson').value;
    $('xiaPerson').innerHTML=current.map(p=>'<option value="'+p.id+'">'+esc(p.full_name)+' • '+esc(roleOf(p))+'</option>').join('');
    if(prior&&current.some(p=>p.id===prior))$('xiaPerson').value=prior;
  }
}
function fillAgendaTeams(){
  if(!$('agendaTeam'))return;
  const prior=$('agendaTeam').value;
  $('agendaTeam').innerHTML='<option value="">Sem equipe específica</option>'+state.teams.map(t=>'<option value="'+t.id+'">'+esc(t.name)+'</option>').join('');
  if(prior)$('agendaTeam').value=prior;
}

async function saveOne(){
  const personId=$('onePerson').value;
  if(!personId){toast('Escolha o profissional.',true);return;}
  const body={
    person_id:personId,month_id:state.month.id,meeting_date:$('oneDate').value||localDate(),
    topic:$('oneTopic').value||null,what_is_working:$('oneWorking').value||null,
    blockers:$('oneBlockers').value||null,improvement:$('oneImprovement').value||null,
    leadership_support:$('oneSupport').value||null,commitments:$('oneCommitments').value||null,
    review_date:$('oneReviewDate').value||null,visibility:$('oneVisibility').value
  };
  try{
    await rest('ceo_one_on_one',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify(body)});
    toast('Olho no Olho salvo.');
    ['oneTopic','oneWorking','oneBlockers','oneImprovement','oneSupport','oneCommitments','oneReviewDate'].forEach(id=>$(id).value='');
    await loadOne(); renderOneHistory();
  }catch(err){toast(err.message,true);}
}
function renderOneHistory(){
  $('oneHistory').innerHTML=state.one.length?state.one.map(x=>{
    const p=personById(x.person_id);
    return '<div class="history-card"><header><b>'+esc(p?.full_name||'Profissional')+' • '+esc(x.topic||'Olho no Olho')+'</b><small>'+dateBr(x.meeting_date)+(x.review_date?' • revisar '+dateBr(x.review_date):'')+'</small></header><p>'+
      (x.commitments?'Compromissos: '+esc(x.commitments):esc(x.improvement||x.blockers||'Registro salvo.'))+'</p></div>';
  }).join(''):'<div class="history-card"><p>Nenhuma conversa registrada neste mês.</p></div>';
}

async function saveAgenda(){
  const title=$('agendaTitle').value.trim();
  if(!title){toast('Digite o título do compromisso.',true);return;}
  const body={
    month_id:state.month.id,
    person_id:$('agendaPerson').value||null,
    team_id:$('agendaTeam').value||null,
    event_type:$('agendaType').value,
    title,
    event_date:$('agendaDate').value||localDate(),
    start_time:$('agendaStart').value||null,
    end_time:$('agendaEnd').value||null,
    priority:$('agendaPriority').value,
    notes:$('agendaNotes').value.trim()||null
  };
  try{
    await rest('ceo_agenda',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify(body)});
    $('agendaTitle').value=''; $('agendaNotes').value=''; $('agendaStart').value=''; $('agendaEnd').value='';
    toast('Compromisso adicionado à agenda.'); await loadAgenda(); renderAgenda();
  }catch(err){toast(err.message,true);}
}
function renderAgenda(){
  if(!$('agendaList'))return;
  const today=localDate();
  const scheduled=state.agenda.filter(a=>a.status==='scheduled');
  const todayItems=scheduled.filter(a=>a.event_date===today);
  const overdue=scheduled.filter(a=>a.event_date<today);
  const upcoming=scheduled.filter(a=>a.event_date>today);
  $('agendaSummary').innerHTML=[
    ['Hoje',todayItems.length,'compromissos'],
    ['Próximos',upcoming.length,'agendados'],
    ['Atrasados',overdue.length,'para revisar'],
    ['Concluídos',state.agenda.filter(a=>a.status==='done').length,'no mês']
  ].map(x=>'<div class="summary-card"><small>'+x[0]+'</small><b>'+x[1]+'</b><span>'+x[2]+'</span></div>').join('');

  const ordered=[...scheduled,...state.agenda.filter(a=>a.status==='done')];
  $('agendaList').innerHTML=ordered.length?ordered.map(a=>{
    const p=personById(a.person_id); const team=state.teams.find(t=>t.id===a.team_id);
    const type={meeting:'Meeting',training:'Treinamento',one_on_one:'Olho no Olho',commitment:'Compromisso',reminder:'Lembrete',operational:'Operacional',other:'Outro'}[a.event_type]||a.event_type;
    return '<div class="agenda-card '+(a.status==='done'?'done':'')+'">'+
      '<div class="agenda-date"><b>'+dateBr(a.event_date)+'</b><span>'+esc(time5(a.start_time)||'sem horário')+'</span></div>'+
      '<div class="agenda-copy"><small>'+esc(type)+' • '+esc(a.priority)+'</small><b>'+esc(a.title)+'</b><p>'+esc(p?.full_name||team?.name||'Operação geral')+(a.notes?' • '+esc(a.notes):'')+'</p></div>'+
      '<div class="agenda-actions">'+(a.status==='scheduled'?'<button data-agenda-done="'+a.id+'">Concluir</button>':'<span>Concluído</span>')+'</div>'+
    '</div>';
  }).join(''):'<div class="approval-empty">Nenhum compromisso neste mês.</div>';
  document.querySelectorAll('[data-agenda-done]').forEach(b=>b.onclick=()=>finishAgenda(b.dataset.agendaDone));
}
async function finishAgenda(id){
  try{
    await rest('ceo_agenda?id=eq.'+id,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({status:'done',updated_at:new Date().toISOString()})});
    toast('Compromisso concluído.'); await loadAgenda(); renderAgenda();
  }catch(err){toast(err.message,true);}
}

async function saveTask(){
  if(!$('taskTitle').value.trim()){toast('Digite o título da pendência.',true);return;}
  const body={month_id:state.month.id,person_id:$('taskPerson').value||null,title:$('taskTitle').value.trim(),due_date:$('taskDue').value||null,priority:$('taskPriority').value,note:$('taskNote').value||null};
  try{
    await rest('ceo_tasks',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify(body)});
    $('taskTitle').value='';$('taskNote').value='';toast('Pendência adicionada.');await loadTasks();renderTasks();
  }catch(err){toast(err.message,true);}
}
function renderTasks(){
  const open=state.tasks.filter(t=>t.status==='open');
  $('tasksList').innerHTML=open.length?open.map(t=>{
    const p=personById(t.person_id);
    return '<div class="task-card"><header><b>'+esc(t.title)+'</b><small>'+esc(t.priority.toUpperCase())+(t.due_date?' • '+dateBr(t.due_date):'')+'</small></header><p>'+esc(p?.full_name||'Geral')+(t.note?' • '+esc(t.note):'')+'</p><button data-done="'+t.id+'">Concluir</button></div>';
  }).join(''):'<div class="task-card"><p>Nenhuma pendência aberta.</p></div>';
  document.querySelectorAll('[data-done]').forEach(b=>b.onclick=()=>finishTask(b.dataset.done));
}
async function finishTask(id){
  try{
    await rest('ceo_tasks?id=eq.'+id,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({status:'done',completed_at:new Date().toISOString()})});
    toast('Pendência concluída.');await loadTasks();renderTasks();
  }catch(err){toast(err.message,true);}
}

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
  const byPerson={};
  presence.forEach(r=>{
    byPerson[r.person_id]??={present:0,absent:0,late:0,other:0};
    if(r.status==='present')byPerson[r.person_id].present++;
    else if(r.status==='absent')byPerson[r.person_id].absent++;
    else if(r.status==='late')byPerson[r.person_id].late++;
    else byPerson[r.person_id].other++;
  });
  const attention=Object.entries(byPerson).filter(([,v])=>v.absent||v.late).sort((a,b)=>(b[1].absent*2+b[1].late)-(a[1].absent*2+a[1].late)).slice(0,10);
  $('reportBody').innerHTML=
    '<div class="report-section"><h3>Resumo operacional</h3><p>'+counts.present+' comparecimentos • '+counts.absent+' não comparecimentos • '+counts.late+' após o horário combinado • '+counts.agreed_off+' folgas combinadas • '+counts.unavailable+' indisponibilidades.</p></div>'+
    '<div class="report-section"><h3>Liderança e agenda</h3><p>'+state.one.length+' Olho no Olho • '+open+' pendências abertas • '+state.agenda.filter(a=>a.status==='scheduled').length+' compromissos agendados.</p></div>'+
    '<div class="report-section"><h3>Pontos para revisar</h3><p>'+(attention.length?attention.map(([id,v])=>{const p=personById(id);return esc(p?.full_name||'Pessoa')+': '+v.absent+' não compareceu • '+v.late+' após combinado';}).join('<br>'):'Sem registros de não comparecimento/atraso no mês.')+'</p></div>';
}

function perfForPerson(p){
  const base=window.XIA_PERFORMANCE?.people||[];
  return base.find(x=>norm(x.name)===norm(p.full_name))||null;
}
function perfMonthMatches(){
  const updated=window.XIA_PERFORMANCE?.updated||'';
  const m=updated.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if(!m||!state.month)return false;
  return state.month.ref_month.slice(0,7)===m[3]+'-'+m[2];
}
function choosePrimaryPerf(p,perf){
  if(!perf?.roles?.length)return null;
  const r=roleOf(p);
  return perf.roles.find(x=>norm(x.role)===norm(r))||perf.roles[0];
}
function dailyConsistency(role){
  const active=(role?.daily||[]).filter(r=>Number(r[0])>0);
  if(active.length<2)return {label:'Sem amostra suficiente',score:null,activeDays:active.length,avg:active.length?active[0][0]:0,cv:null,saleDays:active.filter(r=>r[1]>0).length};
  const vals=active.map(r=>Number(r[0]||0));
  const avg=vals.reduce((a,b)=>a+b,0)/vals.length;
  const sd=Math.sqrt(vals.reduce((a,b)=>a+(b-avg)**2,0)/vals.length);
  const cv=avg?sd/avg:0;
  const label=cv<=.45?'Alta':cv<=.75?'Moderada':'Baixa';
  return {label,score:Math.max(0,Math.round((1-Math.min(cv,1))*100)),activeDays:active.length,avg,cv,saleDays:active.filter(r=>Number(r[1])>0).length};
}
function xiaList(items,empty){
  return items.length?items.map(x=>'<div class="xia-item '+esc(x.level||'')+'"><b>'+esc(x.title)+'</b><p>'+esc(x.text)+'</p></div>').join(''):'<div class="xia-empty">'+esc(empty)+'</div>';
}
async function renderXIA(){
  if(!$('xiaPerson'))return;
  const personId=$('xiaPerson').value||workingPeople()[0]?.id;
  if(!personId){$('xiaIdentity').innerHTML='<div class="xia-empty">Nenhum profissional ativo.</div>';return;}
  $('xiaPerson').value=personId;
  const p=personById(personId); if(!p)return;
  const [presence,notes]=await Promise.all([
    rest('ceo_daily_presence?select=*&month_id=eq.'+state.month.id+'&person_id=eq.'+personId+'&order=work_date.asc'),
    rest('ceo_person_notes?select=*&person_id=eq.'+personId+'&order=happened_on.desc')
  ]);
  const goal=goalByPerson(personId);
  const team=teamByPerson(personId);
  const one=state.one.filter(x=>x.person_id===personId);
  const tasks=state.tasks.filter(x=>x.person_id===personId);
  const agenda=state.agenda.filter(x=>x.person_id===personId);
  const perf=perfForPerson(p);
  const primary=choosePrimaryPerf(p,perf);
  const sameMonth=perfMonthMatches();
  const consistency=dailyConsistency(primary);

  const presenceCounts={present:0,absent:0,late:0,other:0};
  presence.forEach(x=>{
    if(x.status==='present')presenceCounts.present++;
    else if(x.status==='absent')presenceCounts.absent++;
    else if(x.status==='late')presenceCounts.late++;
    else presenceCounts.other++;
  });

  const conv=primary?.c?primary.s/primary.c*100:0;
  const qual=primary?.c?primary.q/primary.c*100:0;
  const cost=primary?.c?primary.g/primary.c:0;
  const strengths=[],attention=[],actions=[],consistencyItems=[];

  if(primary&&sameMonth){
    if(primary.s>0&&conv>=20)strengths.push({title:'Boa conversão',text:'Conversão de '+pct(conv)+' em '+primary.c+' '+(primary.role==='Promotor de Marketing'?'casais':'atendimentos')+'.'});
    if(primary.c>=8&&qual>=65)strengths.push({title:'Qualificação consistente',text:'Taxa Q de '+pct(qual)+'.'});
    if(consistency.label==='Alta')strengths.push({title:'Execução consistente',text:'Variação diária baixa entre '+consistency.activeDays+' dias com produção.'});
    if(goal?.sales_goal>0&&primary.s>=goal.sales_goal)strengths.push({title:'Meta de vendas atingida',text:primary.s+' vendas para meta de '+goal.sales_goal+'.'});
    if(goal?.couples_goal>0&&primary.c>=goal.couples_goal)strengths.push({title:'Meta de volume atingida',text:primary.c+' para meta de '+goal.couples_goal+'.'});

    if(primary.c>=8&&primary.s===0)attention.push({level:'critical',title:'Conversão crítica',text:'Há '+primary.c+' oportunidades e nenhuma venda registrada.'});
    else if(primary.c>=8&&conv<10)attention.push({level:'critical',title:'Conversão muito baixa',text:'Conversão de '+pct(conv)+' com '+primary.c+' oportunidades.'});
    else if(primary.c>=8&&conv<15)attention.push({level:'warn',title:'Conversão abaixo do esperado',text:'Conversão de '+pct(conv)+'; revisar abordagem e passagem de etapa.'});
    if(primary.c>=8&&qual<50)attention.push({level:'warn',title:'Qualificação baixa',text:'Taxa Q de '+pct(qual)+'.'});
    if(primary.role==='Promotor de Marketing'&&primary.c>=8&&cost>280)attention.push({level:'warn',title:'Custo por casal elevado',text:'Custo médio de '+money(cost)+' por casal.'});
    if(consistency.label==='Baixa')attention.push({level:'warn',title:'Baixa consistência diária',text:'O volume oscila bastante entre os dias com produção.'});
    if(goal?.sales_goal>0&&primary.s<goal.sales_goal)attention.push({level:'info',title:'Meta de vendas ainda aberta',text:primary.s+' de '+goal.sales_goal+' vendas.'});
    if(goal?.couples_goal>0&&primary.c<goal.couples_goal)attention.push({level:'info',title:'Meta de volume ainda aberta',text:primary.c+' de '+goal.couples_goal+'.'});
  }else{
    attention.push({level:'info',title:'Performance deste mês ainda não carregada',text:'A base de performance disponível no XIA está atualizada até '+(window.XIA_PERFORMANCE?.updated||'—')+'. Os dados de gestão do mês selecionado continuam válidos.'});
  }

  if(presenceCounts.absent>0)attention.push({level:'warn',title:'Não comparecimentos registrados',text:presenceCounts.absent+' registro(s) no mês selecionado.'});
  if(presenceCounts.late>0)attention.push({level:'info',title:'Chegadas após o combinado',text:presenceCounts.late+' registro(s) no mês selecionado.'});
  const openTasks=tasks.filter(t=>t.status==='open');
  const urgent=openTasks.filter(t=>t.priority==='high'||t.priority==='critical');
  if(urgent.length)attention.push({level:'warn',title:'Pendências prioritárias',text:urgent.length+' acompanhamento(s) de prioridade alta/crítica em aberto.'});

  consistencyItems.push({title:'Ritmo de produção',text:primary&&sameMonth?(consistency.label+' • '+consistency.activeDays+' dias com produção • média '+num(consistency.avg,1)+' por dia ativo'):'Aguardando performance do mês.'});
  consistencyItems.push({title:'Presença operacional',text:presenceCounts.present+' compareceu • '+presenceCounts.absent+' não compareceu • '+presenceCounts.late+' após combinado • '+presenceCounts.other+' outros registros.'});
  consistencyItems.push({title:'Conversas de liderança',text:one.length+' Olho no Olho no mês • '+notes.length+' anotação(ões) históricas.'});
  consistencyItems.push({title:'Agenda individual',text:agenda.filter(a=>a.status==='scheduled').length+' compromisso(s) futuro(s)/aberto(s) vinculado(s).'});

  if(attention.some(x=>x.title.includes('Conversão')))actions.push({title:'Revisar processo comercial',text:'Use 2–3 casos reais recentes para identificar em qual etapa a oportunidade está se perdendo.'});
  if(attention.some(x=>x.title.includes('Qualificação')))actions.push({title:'Revisar qualidade da entrada',text:'Compare os perfis Q/NQ e alinhe critérios antes de aumentar volume.'});
  if(attention.some(x=>x.title.includes('consistência')))actions.push({title:'Criar cadência mínima',text:'Defina um padrão diário simples e acompanhe por blocos, em vez de olhar apenas o acumulado do mês.'});
  if(presenceCounts.absent||presenceCounts.late)actions.push({title:'Olho no Olho operacional',text:'Converse sobre disponibilidade e combinados usando os registros como fatos, sem presumir causa.'});
  if(!actions.length)actions.push({title:'Manter e elevar o padrão',text:'Preserve o que já funciona e defina um próximo ganho mensurável para o ciclo seguinte.'});
  actions.push({title:'Validar com a pessoa',text:'A XIA mostra evidências e padrões. Use o Olho no Olho para validar contexto, causas e próximos compromissos.'});

  const roleCards=(perf?.roles||[]).map(r=>{
    const rconv=r.c?r.s/r.c*100:0;
    return '<div class="xia-role-card"><small>'+esc(r.role)+'</small><b>'+r.c+' / '+r.s+'</b><span>volume / vendas • '+pct(rconv)+' conversão • '+money(r.v)+' VGV</span></div>';
  }).join('');

  $('xiaIdentity').innerHTML='<div class="xia-person-head"><div><span class="eyebrow">PROFISSIONAL</span><h3>'+esc(p.full_name)+'</h3><p>'+esc(roleOf(p))+' • '+esc(team?.name||'sem equipe')+' • horário '+esc(effectiveStart(p))+' • status '+esc(statusLabel(p.status))+'</p></div><div class="xia-base">Performance: '+esc(window.XIA_PERFORMANCE?.updated||'sem base')+'<br>Gestão: '+esc(state.month.label)+'</div></div>'+
    '<div class="xia-role-grid">'+(roleCards||'<div class="xia-empty">Sem performance histórica ligada ao nome deste cadastro.</div>')+'</div>';

  $('xiaMetrics').innerHTML=[
    ['Volume',primary&&sameMonth?primary.c:'—',primary?.role||'sem base'],
    ['Vendas',primary&&sameMonth?primary.s:'—',goal?.sales_goal?'meta '+goal.sales_goal:'sem meta'],
    ['Conversão',primary&&sameMonth?pct(conv):'—','base disponível'],
    ['Qualificação',primary&&sameMonth?pct(qual):'—','Q / volume'],
    ['Consistência',primary&&sameMonth?consistency.label:'—',consistency.score!=null?consistency.score+'/100':'sem amostra']
  ].map(x=>'<div class="summary-card"><small>'+x[0]+'</small><b>'+x[1]+'</b><span>'+esc(x[2])+'</span></div>').join('');

  $('xiaStrengths').innerHTML=xiaList(strengths,'Nenhum ponto forte mensurável foi destacado automaticamente nesta base.');
  $('xiaAttention').innerHTML=xiaList(attention,'Nenhum alerta relevante encontrado pelos critérios atuais.');
  $('xiaConsistency').innerHTML=xiaList(consistencyItems,'Sem dados suficientes.');
  $('xiaActions').innerHTML=xiaList(actions,'Sem ação sugerida.');

  const prompt=buildXiaPrompt({p,goal,team,presenceCounts,one,tasks,agenda,notes,perf,primary,sameMonth,consistency,strengths,attention,actions});
  $('xiaPrompt').value=prompt;
}
function buildXiaPrompt(ctx){
  const {p,goal,team,presenceCounts,one,tasks,agenda,notes,perf,consistency,strengths,attention,actions}=ctx;
  const perfText=(perf?.roles||[]).map(r=>{
    const conv=r.c?r.s/r.c*100:0,qual=r.c?r.q/r.c*100:0,cost=r.c?r.g/r.c:0;
    const dc=dailyConsistency(r);
    return '- '+r.role+': volume '+r.c+', vendas '+r.s+', conversão '+pct(conv)+', VGV '+money(r.v)+', Q '+r.q+', NQ '+r.nq+', qualificação '+pct(qual)+', custo/volume '+money(cost)+', dias com produção '+dc.activeDays+', consistência '+dc.label+'.';
  }).join('\n')||'- Sem performance ligada a este cadastro.';

  const oneText=one.slice(0,5).map(x=>'- '+dateBr(x.meeting_date)+' | '+(x.topic||'Olho no Olho')+' | compromissos: '+(x.commitments||'não registrados')).join('\n')||'- Nenhum Olho no Olho no mês.';
  const taskText=tasks.filter(t=>t.status==='open').map(t=>'- '+t.priority+' | '+t.title+(t.due_date?' | prazo '+dateBr(t.due_date):'')).join('\n')||'- Nenhuma pendência aberta.';
  const agendaText=agenda.filter(a=>a.status==='scheduled').map(a=>'- '+dateBr(a.event_date)+' '+time5(a.start_time)+' | '+a.title).join('\n')||'- Nenhum compromisso individual em aberto.';
  const notesText=notes.slice(0,8).map(n=>'- '+dateBr(n.happened_on)+' | '+n.category+' | '+n.note).join('\n')||'- Nenhuma anotação adicional.';

  return [
    'XIA — DOSSIÊ DE INTELIGÊNCIA ANALÍTICA DO PROFISSIONAL',
    'Objetivo: analisar o profissional com profundidade usando apenas os fatos abaixo. Não invente motivos, traços de personalidade, saúde, intenção ou contexto que não estejam nos dados. Separe claramente FATO, HIPÓTESE A VALIDAR e RECOMENDAÇÃO.',
    '',
    'PROFISSIONAL',
    'Nome: '+p.full_name,
    'Função: '+roleOf(p),
    'Equipe: '+(team?.name||'Sem equipe'),
    'Horário combinado: '+effectiveStart(p),
    'Status: '+statusLabel(p.status),
    'Mês de referência da gestão: '+state.month.label,
    'Base de performance disponível: '+(window.XIA_PERFORMANCE?.updated||'não informada'),
    '',
    'METAS DO MÊS',
    'Volume/casais/atendimentos: '+(goal?.couples_goal||0),
    'Vendas: '+(goal?.sales_goal||0),
    'VGV: '+money(goal?.vgv_goal||0),
    '',
    'PERFORMANCE POR FUNÇÃO',
    perfText,
    '',
    'REGISTRO OPERACIONAL',
    'Compareceu: '+presenceCounts.present,
    'Não compareceu: '+presenceCounts.absent,
    'Chegou após combinado: '+presenceCounts.late,
    'Outros registros: '+presenceCounts.other,
    '',
    'OLHO NO OLHO',
    oneText,
    '',
    'PENDÊNCIAS',
    taskText,
    '',
    'AGENDA INDIVIDUAL',
    agendaText,
    '',
    'ANOTAÇÕES',
    notesText,
    '',
    'PRÉ-LEITURA DO XIA',
    'Forças detectadas: '+(strengths.map(x=>x.title+' — '+x.text).join(' | ')||'nenhuma destacada automaticamente'),
    'Pontos de atenção: '+(attention.map(x=>x.title+' — '+x.text).join(' | ')||'nenhum alerta pelos critérios atuais'),
    'Consistência: '+consistency.label+(consistency.score!=null?' ('+consistency.score+'/100)':''),
    'Ações sugeridas: '+actions.map(x=>x.title+' — '+x.text).join(' | '),
    '',
    'FAÇA A ANÁLISE EM 8 PARTES:',
    '1. Resumo executivo do profissional.',
    '2. Onde está indo bem e quais evidências sustentam isso.',
    '3. Onde está errando ou perdendo resultado e quais evidências sustentam isso.',
    '4. Consistência: o que é estável e o que oscila.',
    '5. Relação entre volume, qualidade, conversão, vendas e VGV.',
    '6. Pontos que precisam ser investigados no próximo Olho no Olho — formule perguntas, não presuma causas.',
    '7. Plano de ação objetivo para os próximos 7 e 30 dias, com métricas.',
    '8. O que a liderança deve acompanhar sem transformar a análise em decisão automática sobre a pessoa.',
    '',
    'Importante: quando os dados forem insuficientes ou de períodos diferentes, diga explicitamente. Não trate correlação como causa.'
  ].join('\n');
}
async function copyXIA(){
  const text=$('xiaPrompt').value;
  if(!text)return;
  try{await navigator.clipboard.writeText(text);toast('Dossiê XIA copiado para a IA.');}
  catch(_){$('xiaPrompt').focus();$('xiaPrompt').select();document.execCommand('copy');toast('Dossiê XIA copiado.');}
}

async function newMonth(){
  const now=new Date();now.setMonth(now.getMonth()+1,1);
  const suggested=localDate(now).slice(0,7);
  const ref=prompt('Novo mês no formato AAAA-MM:',suggested);
  if(!/^\d{4}-\d{2}$/.test(ref||'')){if(ref)toast('Formato inválido.',true);return;}
  const date=ref+'-01';const [y,m]=ref.split('-').map(Number);
  const label=new Date(y,m-1,1).toLocaleDateString('pt-BR',{month:'long',year:'numeric'}).replace(/^./,s=>s.toUpperCase());
  try{
    await rest('ceo_months',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({ref_month:date,label,status:'open',created_by:state.user.id})});
    toast('Novo mês criado.');
    state.months=await rest('ceo_months?select=*&order=ref_month.desc');
    renderMonths();
    const created=state.months.find(x=>x.ref_month===date); if(created)await selectMonth(created.id);
  }catch(err){toast(err.message,true);}
}

function setTab(id){
  document.querySelectorAll('.ceo-tab').forEach(s=>s.classList.toggle('on',s.id===id));
  document.querySelectorAll('#ceoNav button').forEach(b=>b.classList.toggle('active',b.dataset.tab===id));
  $('ceoTitle').textContent=TITLES[id]?.[0]||id;
  $('ceoSubtitle').textContent=TITLES[id]?.[1]||'';
  if(id==='today')renderTodayExecutive();
  if(id==='reports')renderReports();
  if(id==='approvals')loadApprovals();
  if(id==='agenda')renderAgenda();
  if(id==='xia')renderXIA();
}
function bind(){
  document.querySelectorAll('#ceoNav button').forEach(b=>b.onclick=()=>setTab(b.dataset.tab));
  $('monthSelect').onchange=()=>selectMonth($('monthSelect').value);
  $('todayDate').onchange=loadToday;
  $('todayArea').onchange=()=>{
    state.todayArea=$('todayArea').value||'all';
    renderToday();
  };
  $('reloadToday').onclick=loadToday;
  $('markAllPresentBtn').onclick=markAllPresent;
  $('saveDayBtn').onclick=saveDay;
  $('addTeamBtn').onclick=addTeam;
  $('addPersonBtn').onclick=()=>openPersonModal();
  $('closePersonModal').onclick=closePersonModal;
  $('cancelPersonModal').onclick=closePersonModal;
  $('savePersonBtn').onclick=savePerson;
  $('personModal').addEventListener('click',e=>{if(e.target===$('personModal'))closePersonModal();});
  $('saveOneBtn').onclick=saveOne;
  $('saveAgendaBtn').onclick=saveAgenda;
  $('saveTaskBtn').onclick=saveTask;
  $('refreshReports').onclick=renderReports;
  $('refreshApprovals').onclick=loadApprovals;
  $('newMonthBtn').onclick=newMonth;
  $('ceoLogout').onclick=signOut;
  $('xiaPerson').onchange=renderXIA;
  $('refreshXia').onclick=renderXIA;
  $('copyXiaBtn').onclick=copyXIA;
}
async function init(){
  try{
    await validateCEO();
    $('ceoUserName').textContent=state.admin.display_name||'CEO';
    $('ceoUserEmail').textContent=state.user.email||'';
    $('todayDate').value=localDate();
    if($('todayArea')){$('todayArea').value=state.todayArea;}
    $('oneDate').value=localDate();
    if($('agendaDate'))$('agendaDate').value=localDate();
    bind(); await loadBase();
    $('ceoLoading').style.display='none'; $('ceoApp').hidden=false;
  }catch(err){
    $('ceoLoading').innerHTML='<div class="loader-mark">RX</div><b>'+esc(err.message)+'</b><a href="./" style="color:#18e7ff;font-size:11px">Voltar ao RAIO X</a>';
  }
}
document.addEventListener('DOMContentLoaded',init);
})();