(()=>{
  const cfg=window.RAIOX_AUTH_CONFIG||{};
  const $=id=>document.getElementById(id);
  const num=v=>Number(v||0);
  const fmtInt=v=>Intl.NumberFormat('pt-BR',{maximumFractionDigits:0}).format(num(v));
  const fmtMoney=v=>'R$ '+Intl.NumberFormat('pt-BR',{notation:num(v)>=1e6?'compact':'standard',maximumFractionDigits:num(v)>=1e6?1:0}).format(num(v));
  const fmtMoneyFull=v=>'R$ '+Intl.NumberFormat('pt-BR',{maximumFractionDigits:0}).format(num(v));
  const pct=(a,b)=>b>0?(a/b*100):0;
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  async function rest(path,token){
    const res=await fetch(cfg.url+'/rest/v1/'+path,{
      headers:{apikey:cfg.key,Authorization:'Bearer '+token,Accept:'application/json'}
    });
    if(!res.ok)throw new Error('Falha ao carregar o mês atual.');
    return res.json();
  }

  function areaRole(){
    const key=new URLSearchParams(location.search).get('area')||'promotor';
    return key==='liner'?'Liner / Consultor':key==='closer'?'Closer / Fechador':'Promotor de Marketing';
  }

  function sum(rows,key){return rows.reduce((a,r)=>a+num(r[key]),0);}
  function aggregate(rows){
    return {
      researches:sum(rows,'researches'),
      couples:sum(rows,'couples'),
      sales:sum(rows,'sales'),
      vgv:sum(rows,'vgv'),
      q:sum(rows,'q'),
      nq:sum(rows,'nq'),
      gifts:sum(rows,'gifts'),
      week_volume:sum(rows,'week_volume'),
      week_sales:sum(rows,'week_sales'),
      week_vgv:sum(rows,'week_vgv')
    };
  }

  function goalCard(cls,icon,label,current,goal,formatter,id){
    const p=Math.min(100,pct(current,goal));
    return '<article class="goal-card '+cls+'">'+
      '<div class="goal-icon">'+icon+'</div>'+
      '<div class="goal-copy"><strong>'+formatter(goal)+'</strong><b>'+label+'</b>'+
      '<small>'+formatter(current)+' / '+formatter(goal)+' • '+p.toFixed(1).replace('.',',')+'%</small></div>'+
      '<div class="goal-track"><i id="'+id+'" style="width:'+p+'%"></i></div></article>';
  }

  function updateGoalHero(month,rows){
    const prom=rows.filter(r=>r.role==='Promotor de Marketing');
    const a=aggregate(prom);
    const grid=document.querySelector('.goal-grid');
    if(grid){
      grid.classList.add('live-month-goals');
      grid.innerHTML=
        goalCard('research-goal','⌕','PESQUISAS',a.researches,num(month.goal_research),fmtInt,'barResearch')+
        goalCard('cyan-goal','◎','CASAIS',a.couples,num(month.goal_couples),fmtInt,'barCouples')+
        goalCard('purple-goal','◇','VENDAS',a.sales,num(month.goal_sales),fmtInt,'barSales')+
        goalCard('violet-goal','↗','VGV',a.vgv,num(month.goal_vgv),fmtMoney,'barVgv');
    }
    const label=document.querySelector('.mission-label b');
    if(label)label.textContent='META OFICIAL • '+month.label.toUpperCase();

    const leader=[...prom].sort((x,y)=>num(y.week_volume)-num(x.week_volume)||num(y.week_sales)-num(x.week_sales))[0];
    const monthLeader=[...prom].sort((x,y)=>num(y.couples)-num(x.couples)||num(y.sales)-num(x.sales))[0];
    const winner=[...prom].filter(x=>num(x.couples)>=22).sort((x,y)=>num(y.couples)-num(x.couples))[0];

    if($('missionText')){
      $('missionText').innerHTML=prom.length
        ?'<b>'+esc(month.label)+'</b> • '+fmtInt(a.couples)+' casais, '+fmtInt(a.sales)+' vendas e '+fmtMoney(a.vgv)+' em VGV.'
        :'<b>'+esc(month.label)+'</b> aberto. As metas do mês já estão definidas. Aguardando o primeiro lançamento de performance.';
    }
    if($('heroLeaderName'))$('heroLeaderName').textContent=leader?.professional_name||'SEM RESULTADO AINDA';
    if($('heroLeaderSub'))$('heroLeaderSub').textContent=leader?'CAPITÃO DA SEMANA • '+fmtInt(leader.week_volume)+' NO PERÍODO':'AGUARDANDO PRIMEIRO LANÇAMENTO • '+month.label.toUpperCase();
    if($('iCap'))$('iCap').textContent=leader?leader.professional_name+' • '+fmtInt(leader.week_volume):'—';
    if($('i22'))$('i22').textContent=winner?winner.professional_name+' • VENCEDOR':monthLeader&&num(monthLeader.couples)>0?monthLeader.professional_name+' • '+fmtInt(monthLeader.couples)+'/22':'—';
    const days=new Date(month.ref_month+'T12:00:00').getUTCMonth()+1===new Date().getMonth()+1?Math.max(1,new Date().getDate()):1;
    const daysInMonth=new Date(Number(month.ref_month.slice(0,4)),Number(month.ref_month.slice(5,7)),0).getDate();
    const projection=a.couples>0?Math.round(a.couples/days*daysInMonth):0;
    if($('iProj'))$('iProj').textContent=fmtInt(projection)+' casais';
  }

  function currentMonthEmpty(month){
    const empty='<div class="current-month-empty"><b>'+esc(month.label)+' iniciou</b>Nenhum resultado de performance foi lançado neste mês ainda.</div>';
    const goalR=num(month.goal_research),goalC=num(month.goal_couples),goalS=num(month.goal_sales),goalV=num(month.goal_vgv);

    if($('dk'))$('dk').innerHTML=[
      ['Pesquisas','0','Meta '+fmtInt(goalR)],
      ['Casais','0','Meta '+fmtInt(goalC)],
      ['Vendas','0','Meta '+fmtInt(goalS)],
      ['VGV','R$ 0','Meta '+fmtMoney(goalV)]
    ].map(x=>'<div class="card kpi"><small>'+x[0]+'</small><b class="c">'+x[1]+'</b><span class="muted">'+x[2]+'</span></div>').join('');

    if($('todayOps'))$('todayOps').innerHTML='<div class="ops-pad">'+empty+'</div>';
    if($('metaPace'))$('metaPace').innerHTML='<div class="ops-pad"><div class="ops-head"><div><span class="ops-kicker">META DO MÊS</span><h3>'+esc(month.label)+'</h3></div></div>'+
      '<div class="pace-summary"><div class="pace-box"><small>Pesquisas</small><b class="c">'+fmtInt(goalR)+'</b><span>faltam '+fmtInt(goalR)+'</span></div>'+
      '<div class="pace-box"><small>Casais</small><b class="c">'+fmtInt(goalC)+'</b><span>faltam '+fmtInt(goalC)+'</span></div>'+
      '<div class="pace-box"><small>Vendas</small><b class="g">'+fmtInt(goalS)+'</b><span>faltam '+fmtInt(goalS)+'</span></div>'+
      '<div class="pace-box"><small>VGV</small><b class="v">'+fmtMoney(goalV)+'</b><span>faltam '+fmtMoney(goalV)+'</span></div></div></div>';
    if($('dailyEvolution'))$('dailyEvolution').innerHTML='<div class="ops-pad">'+empty+'</div>';

    ['radarCaptain','radarVgv','radarCouples','arenaX','free','top','di'].forEach(id=>{if($(id))$(id).innerHTML=empty;});
    const radarMini=document.querySelector('#radar .radar-head .mini'); if(radarMini)radarMini.textContent='Base de '+month.label+' • sem lançamentos ainda';
    document.querySelectorAll('#radar .battle-title span').forEach(x=>x.textContent='mês atual');

    if($('rb'))$('rb').innerHTML='<tr><td colspan="11"><div class="current-month-empty">Nenhum ranking de '+esc(month.label)+' ainda.</div></td></tr>';
    if($('rm'))$('rm').disabled=true;

    ['sel','psel','dsel','fxSel'].forEach(id=>{
      const el=$(id); if(!el)return; el.innerHTML='<option>'+esc(month.label)+' • sem dados</option>'; el.disabled=true;
    });

    const blanks={
      ik:empty,cc:empty,cg:'',fxKpis:empty,fxChart:empty,fxDriver:empty,fxPositive:empty,fxNegative:empty,fxUnknown:empty,fxDaily:empty,fxConclusion:empty,
      diagOps:empty,diagOperationAttention:empty,diagPeopleAttention:empty,diagWeak:empty,diagAction:empty,
      pb:empty,ab:empty,ib:empty,cb:empty,pi:empty,sc:empty,tg:empty,ck:empty,cob:empty,ci:empty
    };
    Object.entries(blanks).forEach(([id,html])=>{if($(id))$(id).innerHTML=html;});
    if($('fxValidation'))$('fxValidation').textContent='SEM DADOS DE '+month.label.toUpperCase();
    if($('fxName'))$('fxName').textContent='—';
    const hero=document.querySelector('#perfil .hero');
    if(hero)hero.innerHTML='<div class="eye">PERFIL DO MÊS</div><h3>'+esc(month.label)+'</h3><p>O perfil de casais será exibido quando a base deste mês for carregada.</p>';
  }

  function updateCurrentMonthLabels(month){
    const rankMini=document.querySelector('#rank .title .mini');
    if(rankMini)rankMini.textContent='Base atual • '+month.label;
    const fxTitle=document.querySelector('.fx-daily-wrap .fx-title h3');
    if(fxTitle)fxTitle.textContent='Calendário de evidências • '+month.label;
    const foot=document.querySelector('aside .foot');
    if(foot){
      [...foot.childNodes].forEach(n=>{if(n.nodeType===3&&/Base oficial/i.test(n.textContent||''))n.textContent='Base atual • '+month.label+' ';});
    }
  }

  async function load(ctx){
    if(!ctx?.session?.access_token||!cfg.url||!cfg.key)return;
    try{
      const token=ctx.session.access_token;
      const months=await rest('ceo_months?select=ref_month,label,status,goal_research,goal_couples,goal_sales,goal_vgv,super_goal_research,super_goal_couples,super_goal_sales,super_goal_vgv&status=eq.open&order=ref_month.desc&limit=1',token);
      const month=months?.[0]; if(!month)return;
      const rows=await rest('raiox_performance_records?select=professional_name,role,researches,couples,sales,vgv,q,nq,gifts,active_days,week_volume,week_sales,week_vgv,daily&ref_month=eq.'+encodeURIComponent(month.ref_month),token);
      updateGoalHero(month,rows||[]);
      updateCurrentMonthLabels(month);
      const selected=(rows||[]).filter(r=>r.role===areaRole());
      if(!selected.length)currentMonthEmpty(month);
    }catch(err){
      console.error('RAIO X mês atual:',err);
    }
  }

  window.addEventListener('raiox:authenticated',e=>load(e.detail));
  if(window.RAIOX_AUTH)load(window.RAIOX_AUTH);
})();