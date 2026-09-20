const S={"couples":328,"sales":76,"vgv":6726650,"q":217,"nq":108,"mq":3,"gift":73460.13,"gifts":945,"activeVgv":6450650,"canceled":3};
const P=[{"n":"Ricardo","r":"Captador","e":1,"c":30,"s":2,"v":184000,"q":22,"nq":8,"g":5999.3,"d":9,"w":5,"ws":1,"wv":92000,"p":45},{"n":"Paulo","r":"Captador","e":1,"c":29,"s":4,"v":343000,"q":18,"nq":11,"g":6115.31,"d":16,"w":12,"ws":3,"wv":251000,"p":44},{"n":"Renan","r":"Captador","e":1,"c":27,"s":5,"v":403600,"q":18,"nq":9,"g":5429.4,"d":13,"w":8,"ws":0,"wv":0,"p":40},{"n":"André","r":"Captador","e":1,"c":24,"s":1,"v":77200,"q":11,"nq":13,"g":5121.42,"d":11,"w":9,"ws":0,"wv":0,"p":36},{"n":"Otávio","r":"Captador","e":1,"c":22,"s":2,"v":154400,"q":13,"nq":8,"g":4751.47,"d":11,"w":7,"ws":0,"wv":0,"p":33},{"n":"Manara","r":"Captador","e":1,"c":21,"s":9,"v":711200,"q":17,"nq":4,"g":4639.5,"d":12,"w":8,"ws":7,"wv":555200,"p":32},{"n":"Clacion","r":"Captador","e":1,"c":21,"s":7,"v":607300,"q":12,"nq":9,"g":5405.41,"d":13,"w":8,"ws":4,"wv":331400,"p":32},{"n":"Pedro","r":"Captador","e":1,"c":19,"s":3,"v":525000,"q":16,"nq":3,"g":5411.37,"d":10,"w":8,"ws":2,"wv":171000,"p":28},{"n":"Larissa","r":"Captador","e":1,"c":15,"s":17,"v":1502950,"q":10,"nq":5,"g":2491.87,"d":9,"w":3,"ws":2,"wv":256750,"p":22},{"n":"Ana Caroline","r":"Captador","e":1,"c":15,"s":6,"v":548200,"q":12,"nq":3,"g":3959.55,"d":10,"w":5,"ws":4,"wv":392000,"p":22},{"n":"Márcio","r":"Captador","e":1,"c":15,"s":3,"v":260200,"q":7,"nq":7,"g":3001.72,"d":10,"w":3,"ws":2,"wv":162200,"p":22},{"n":"Jéssica","r":"Captador","e":1,"c":13,"s":3,"v":265000,"q":6,"nq":7,"g":3291.62,"d":10,"w":3,"ws":0,"wv":0,"p":20},{"n":"Matheus Esley","r":"Captador","e":1,"c":13,"s":1,"v":92000,"q":10,"nq":3,"g":2859.7,"d":8,"w":3,"ws":0,"wv":0,"p":20},{"n":"Josyene","r":"Captador","e":1,"c":12,"s":3,"v":251000,"q":9,"nq":3,"g":1907.93,"d":9,"w":5,"ws":1,"wv":80000,"p":18},{"n":"Suene","r":"Captador","e":1,"c":10,"s":2,"v":176400,"q":7,"nq":3,"g":2843.69,"d":9,"w":4,"ws":2,"wv":176400,"p":15},{"n":"Tainá","r":"Captador","e":1,"c":9,"s":0,"v":0,"q":7,"nq":2,"g":2183.74,"d":6,"w":1,"ws":0,"wv":0,"p":14},{"n":"Weena","r":"Captador","e":1,"c":7,"s":8,"v":625200,"q":3,"nq":4,"g":1427.83,"d":5,"w":1,"ws":0,"wv":0,"p":10},{"n":"Cássio","r":"Captador","e":1,"c":7,"s":0,"v":0,"q":5,"nq":1,"g":1783.84,"d":3,"w":2,"ws":0,"wv":0,"p":10},{"n":"Adriano","r":"Captador","e":1,"c":6,"s":0,"v":0,"q":3,"nq":3,"g":1157.88,"d":6,"w":3,"ws":0,"wv":0,"p":9},{"n":"Letícia","r":"Captador","e":1,"c":5,"s":0,"v":0,"q":4,"nq":1,"g":1325.86,"d":5,"w":2,"ws":0,"wv":0,"p":8},{"n":"Matheus Domingos","r":"Captador","e":1,"c":4,"s":0,"v":0,"q":4,"nq":0,"g":839.9,"d":4,"w":3,"ws":0,"wv":0,"p":6},{"n":"Barbara","r":"Captador","e":1,"c":3,"s":0,"v":0,"q":2,"nq":1,"g":1007.88,"d":3,"w":1,"ws":0,"wv":0,"p":4},{"n":"Felipe","r":"Sub-líder","e":0,"c":1,"s":0,"v":0,"q":1,"nq":0,"g":503.94,"d":1,"w":0,"ws":0,"wv":0,"p":2}];
const PR={"prof":[["Empresário(a)",68,17.6],["Autônomo(a)",21,4.8],["Advogado (a)",11,18.2],["Engenheiro (a)",10,20.0],["Engenheiro civil(a)",9,11.1],["Funcionário Público (a)",8,12.5]],"age":[["30–39",131,14.5],["40–49",94,17.0],["Até 29",53,15.1],["50–59",39,10.3],["60+",10,10.0]],"inc":[["R$ 15 mil+",283,14.8],["R$ 10–15 mil",43,14.0],["Até R$ 7 mil",2,50.0]],"car":[["ONIX",17,11.8],["HB20",13,30.8],["COROLLA",11,9.1],["COMPASS",10,10.0],["CIVIC",9,11.1],["HR-V",9,44.4],["ARGO",8,37.5],["T-CROSS",8,12.5]]};

const E=20,R=10,M=30;
const metaCouples=400,metaSales=100,metaVgv=8500000;
const money=x=>'R$ '+Intl.NumberFormat('pt-BR',{notation:x>=1e6?'compact':'standard',maximumFractionDigits:x>=1e6?2:0}).format(x||0);
const moneyFull=x=>'R$ '+Intl.NumberFormat('pt-BR',{maximumFractionDigits:0}).format(x||0);
const pct=x=>(x||0).toFixed(1).replace('.',',')+'%';
const cv=p=>p.c?p.s/p.c*100:0;
const co=p=>p.c?p.g/p.c:0;
const el=P.filter(p=>p.e);
const captainRank=()=>[...el].sort((a,b)=>b.w-a.w||b.ws-a.ws||b.wv-a.wv);
const couplesRank=()=>[...el].sort((a,b)=>b.c-a.c||b.s-a.s);
const vgvRank=()=>[...el].sort((a,b)=>b.v-a.v||b.s-a.s);
const cap=captainRank()[0];
const race=couplesRank()[0];
const team=Math.round(S.couples/E*M);

const k=(l,v,s,t='c')=>`<div class="card kpi"><small>${l}</small><b class="${t}">${v}</b><span class="muted">${s}</span></div>`;
const ins=(t,x)=>`<div class="in"><strong>${t}</strong><span class="muted">${x}</span></div>`;

function bars(id,a,fmt=(v,x)=>v){
  const e=document.getElementById(id),mx=Math.max(...a.map(x=>x[1]),1);
  e.innerHTML=a.map(([n,v,x])=>`<div class="br"><label>${n}</label><div class="bar"><i style="width:${v/mx*100}%"></i></div><b>${fmt(v,x)}</b></div>`).join('');
}

function fightRows(list,metric,format){
  const leader=metric(list[0]);
  return list.slice(0,5).map((p,i)=>{
    const value=metric(p),gap=Math.max(0,leader-value);
    const gapText=i===0?'LÍDER':(format==='money'?`${moneyFull(gap)} do líder`:`${gap} do líder`);
    const score=format==='money'?moneyFull(value):`${value} casais`;
    const sub=format==='week'?`${p.ws} venda${p.ws===1?'':'s'} na semana`:`${p.s} venda${p.s===1?'':'s'} no mês`;
    return `<div class="fight ${i===0?'lead':''}"><div class="place">${i===0?'★':i+1}</div><div class="who"><b>${p.n}</b><small>${sub}</small></div><div class="score">${score}<span class="gap">${gapText}</span></div></div>`;
  }).join('');
}

function radar(){
  radarCaptain.innerHTML=fightRows(captainRank(),p=>p.w,'week');
  radarVgv.innerHTML=fightRows(vgvRank(),p=>p.v,'money');
  radarCouples.innerHTML=fightRows(couplesRank(),p=>p.c,'couples');
}

function cinema(){
  const couplesPct=Math.min(100,S.couples/metaCouples*100);
  const salesPct=Math.min(100,S.sales/metaSales*100);
  const vgvPct=Math.min(100,S.vgv/metaVgv*100);

  iCap.textContent=`${cap.n} • ${cap.w}`;
  i22.textContent=`${race.n} • ${race.c}/22`;
  iProj.textContent=team+' casais';
  missionText.innerHTML=`<b>${S.couples} casais</b>, <b>${S.sales} vendas</b> e <b>${money(S.vgv)}</b> em VGV. ${race.n} está a <b>${Math.max(0,22-race.c)} casal</b> do Livre do Mês.`;

  heroLeaderName.textContent=cap.n;
  heroLeaderSub.textContent=`CAPITÃO DA SEMANA • TOP 1 EM CASAIS • ${race.c}/22`;
  goalCouplesText.textContent=`${S.couples} / ${metaCouples} • ${pct(couplesPct)}`;
  goalSalesText.textContent=`${S.sales} / ${metaSales} • ${pct(salesPct)}`;
  goalVgvText.textContent=`${money(S.vgv)} / R$ 8,5 mi • ${pct(vgvPct)}`;

  requestAnimationFrame(()=>{
    barCouples.style.width=couplesPct+'%';
    barSales.style.width=salesPct+'%';
    barVgv.style.width=vgvPct+'%';
  });

  enter.onclick=()=>cin.classList.add('hide');
}

function renderArenaX(){
  const arena=document.getElementById('arenaX');
  if(!arena)return;

  const missingCouples=Math.max(0,metaCouples-S.couples);
  const missingSales=Math.max(0,metaSales-S.sales);
  const missingVgv=Math.max(0,metaVgv-S.vgv);
  const week=captainRank().slice(0,3);
  const chase=couplesRank()[1];
  const chaseGap=Math.max(0,race.c-chase.c);
  const raceGap=Math.max(0,22-race.c);

  arena.innerHTML=`
    <div class="arena-head">
      <div><span class="arena-kicker">⚡ ARENA X</span><h3>PRESSÃO DA META</h3></div>
      <span class="arena-live"><i></i> OPERAÇÃO ATIVA</span>
    </div>
    <div class="arena-metrics">
      <div class="arena-metric"><small>FALTAM PARA 400</small><b>${missingCouples}</b><span>casais</span></div>
      <div class="arena-metric"><small>FALTAM PARA 100</small><b>${missingSales}</b><span>vendas</span></div>
      <div class="arena-metric"><small>FALTAM PARA R$ 8,5 MI</small><b>${moneyFull(missingVgv)}</b><span>em VGV</span></div>
    </div>
    <div class="arena-lower">
      <div class="arena-battle">
        <div class="arena-title"><b>BATALHA DA SEMANA</b><span>casais</span></div>
        ${week.map((p,i)=>`<div class="arena-row"><span class="arena-pos">${i+1}</span><strong>${p.n}</strong><div class="arena-line"><i style="width:${Math.max(12,p.w/Math.max(week[0].w,1)*100)}%"></i></div><b>${p.w}</b></div>`).join('')}
      </div>
      <div class="arena-alert">
        <span class="arena-alert-label">ALERTA DE MOVIMENTO</span>
        <strong>${raceGap===0?`${race.n} bateu 22!`:`${race.n} está a ${raceGap} casal${raceGap===1?'':'ais'} do Livre do Mês`}</strong>
        <p>${chase.n} está a ${chaseGap} casal${chaseGap===1?'':'ais'} do Top 1 mensal.</p>
        <em>Cada casal muda o ranking.</em>
      </div>
    </div>`;
}

function dash(){
  dk.innerHTML=[
    k('Casais',S.couples,'base oficial até 20/09'),
    k('Vendas',S.sales,pct(S.sales/S.couples*100)+' conversão','g'),
    k('VGV',money(S.vgv),money(S.vgv/S.sales)+' ticket','v'),
    k('Q',S.q,pct(S.q/S.couples*100)+' qualificação'),
    k('NQ',S.nq,'não qualificados','a'),
    k('Cancelamentos',S.canceled,moneyFull(S.vgv-S.activeVgv)+' fora do VGV ativo','r'),
    k('Brindes',S.gifts,moneyFull(S.gift)+' investidos','v'),
    k('Custo/casal',moneyFull(S.gift/S.couples),'brindes ÷ casais','g')
  ].join('');

  const sec=captainRank()[1];
  renderArenaX();

  free.innerHTML=`<span class="badge g">CORRIDA DOS 22 • LIVRE DO MÊS</span><div class="big"><b>${race.n}</b><span class="g">${race.c} / 22</span></div><div class="muted">O primeiro captador a 22 ganha liberdade de horário no mês, conforme alinhamento.</div><div class="prog"><i style="width:${Math.min(100,race.c/22*100)}%"></i></div><small class="muted">Falta ${Math.max(0,22-race.c)} casal.</small>`;

  const month=couplesRank();
  bars('top',month.slice(0,8).map(p=>[p.n,p.c]));
  di.innerHTML=
    ins('Projeção da equipe',`Ritmo atual: ${team} casais até 30/09.`)+
    ins('Capitão da semana',`${cap.n} lidera com ${cap.w} casais; ${sec.n} vem com ${sec.w}.`)+
    ins('Top VGV',`${vgvRank()[0].n} lidera com ${moneyFull(vgvRank()[0].v)}.`)+
    ins('Corrida dos 22',`${race.n} está com ${race.c} e precisa de ${Math.max(0,22-race.c)}.`)+
    ins('Custo real',`${moneyFull(S.gift/S.couples)} por casal.`);
}

function mv(p,m){
  if(m==='conversion')return cv(p);
  if(m==='cost')return-co(p);
  return {couples:p.c,weekly:p.w,sales:p.s,vgv:p.v,q:p.q,projection:p.p}[m]||0;
}

function rank(){
  const m=rm.value;
  const a=[...P].sort((x,y)=>{
    if(m==='weekly')return bsafe(y.w-x.w)||bsafe(y.ws-x.ws)||bsafe(y.wv-x.wv);
    return mv(y,m)-mv(x,m);
  });
  rb.innerHTML=a.map((p,i)=>`<tr><td class="pos">${['🥇','🥈','🥉'][i]||'#'+(i+1)}</td><td><div class="person"><div class="av">${p.n[0]}</div><div><b>${p.n}</b><span class="mini">${p.r}</span></div></div></td><td><b>${p.c}</b></td><td>${p.w}</td><td>${p.s}</td><td>${moneyFull(p.v)}</td><td>${pct(cv(p))}</td><td>${p.q}</td><td>${moneyFull(co(p))}</td><td><b class="v">${p.p}</b></td><td>${p.e?`<span class="tag">${Math.max(0,22-p.c)} faltam</span>`:'<span class="mini">liderança</span>'}</td></tr>`).join('');
}
function bsafe(x){return Number.isFinite(x)?x:0}

function get(id){return P.find(p=>p.n===document.getElementById(id).value)||P[0]}

function individual(){
  const p=get('sel'),avg=p.c/Math.max(p.d,1),n35=Math.max(0,(35-p.c)/R),n50=Math.max(0,(50-p.c)/R);
  ik.innerHTML=[
    k('Casais',p.c,avg.toFixed(1).replace('.',',')+'/dia'),
    k('Vendas',p.s,pct(cv(p))+' conversão','g'),
    k('VGV',moneyFull(p.v),moneyFull(p.v/Math.max(p.c,1))+'/casal','v'),
    k('Q',p.q,pct(p.q/Math.max(p.c,1)*100)),
    k('Semana',p.w,`${p.ws} venda(s) na semana`,'a'),
    k('Projeção',p.p,'casais em 30/09','v'),
    k('Custo/casal',moneyFull(co(p)),'brindes ÷ casais','a'),
    k('Dias trabalhados',p.d,'base atual')
  ].join('');
  cc.innerHTML=`Você está com <b>${p.c} casais</b>. ${p.e?`Faltam <b>${Math.max(0,22-p.c)}</b> para 22 e a disputa do Livre do Mês.`:'Como Sub-líder, seu foco é elevar o ritmo da equipe.'} Sua projeção é <b>${p.p} casais</b>. Para 35, precisa de <b>${n35.toFixed(1).replace('.',',')}</b>/dia; para 50, <b>${n50.toFixed(1).replace('.',',')}</b>/dia.`;
  const strong=cv(p)>=20?'Conversão':p.q/Math.max(p.c,1)>=.7?'Qualificação':'Volume';
  cg.innerHTML=`<div><small>Ponto forte</small><b>${strong}</b></div><div><small>Meta de hoje</small><b>${Math.max(2,Math.ceil(n35))} casais</b></div><div><small>Ritmo p/ 50</small><b>${n50.toFixed(1).replace('.',',')}/dia</b></div><div><small>Semana</small><b>${p.w} casais</b></div>`;
}

function profile(){
  bars('pb',PR.prof,(v,x)=>v+' • '+x+'%');
  bars('ab',PR.age,(v,x)=>v+' • '+x+'%');
  bars('ib',PR.inc,(v,x)=>v+' • '+x+'%');
  bars('cb',PR.car,(v,x)=>v+' • '+x+'%');
  pi.innerHTML=
    ins('Maior VGV por profissão','Empresário(a): R$ 1,76 mi em VGV geral.')+
    ins('Faixa etária','40–49: 17,0% de conversão em 94 casais; até 29: 15,1% em 53 casais.')+
    ins('Carros com força','HR-V: 44,4% de conversão e R$ 807,6 mil em VGV; Argo: 37,5%; HB20: 30,8%.')+
    ins('Ponto','324 dos 328 registros vieram do Parque Dreams.');
}

function projection(){
  const b=team;
  sc.innerHTML=`<div class="card pad sc"><div class="eye">CENÁRIO ATUAL</div><b class="c">${b}</b><span>casais projetados</span></div><div class="card pad sc"><div class="eye">+10% PERFORMANCE</div><b class="v">${Math.round(b*1.1)}</b><span>casais projetados</span></div><div class="card pad sc"><div class="eye">ALTA PERFORMANCE +25%</div><b class="g">${Math.round(b*1.25)}</b><span>casais projetados</span></div>`;
  const p=get('psel');
  tg.innerHTML=[22,35,50].map(t=>{
    const miss=Math.max(0,t-p.c),per=miss/R;
    return`<div class="card pad"><div class="eye">${t} CASAIS</div><b style="font-size:23px">${p.c} / ${t}</b><div class="prog"><i style="width:${Math.min(100,p.c/t*100)}%"></i></div><span class="muted">Faltam ${miss} • ${per.toFixed(1).replace('.',',')}/dia</span></div>`;
  }).join('');
}

function costs(){
  const c=S.gift/S.couples;
  ck.innerHTML=[
    k('Total gasto',moneyFull(S.gift),'brindes efetivos','a'),
    k('Brindes',S.gifts,'quantidade total','v'),
    k('Médio/brinde',moneyFull(S.gift/S.gifts),'custo unitário'),
    k('Custo/casal',moneyFull(c),'principal eficiência','g'),
    k('Custo/venda',moneyFull(S.gift/S.sales),'brindes ÷ vendas','a'),
    k('Custo/Q',moneyFull(S.gift/S.q),'brindes ÷ Q'),
    k('VGV/casal',moneyFull(S.vgv/S.couples),'resultado por casal','v'),
    k('Ticket médio',moneyFull(S.vgv/S.sales),'por venda','g')
  ].join('');
  const a=[...P].filter(p=>p.c).sort((x,y)=>co(x)-co(y)).slice(0,10);
  bars('cob',a.map(p=>[p.n,co(p)]),(v)=>moneyFull(v));
  ci.innerHTML=ins('Melhor eficiência',`${a[0].n}: ${moneyFull(co(a[0]))}/casal.`)+ins('Média da operação',`${moneyFull(c)}/casal.`)+ins('Controle','Valores calculados a partir dos brindes efetivos da base oficial.');
}

const META={
  dash:['CENTRAL DE MISSÃO','Performance da Captação','Onde estamos, onde podemos chegar e o que fazer hoje.'],
  rank:['COMPETITIVIDADE','Ranking de Performance','Resultado e projeção no mesmo lugar.'],
  ind:['PROFESSOR X','Performance Individual','Seu resultado transformado em ação.'],
  perfil:['INTELIGÊNCIA DE PERFIL','Perfil de Casais','Quem chega, quem compra e qual perfil gera resultado.'],
  proj:['FUTURO PROVÁVEL','Projeções','Ritmo atual, +10% e alta performance.'],
  custos:['EFICIÊNCIA FINANCEIRA','Custo de Brinde','Quanto cada casal, Q e venda estão custando.']
};

function go(id){
  document.querySelectorAll('.sec').forEach(x=>x.classList.toggle('on',x.id===id));
  document.querySelectorAll('[data-go]').forEach(x=>x.classList.toggle('active',x.dataset.go===id));
  const m=META[id];eye.textContent=m[0];pt.textContent=m[1];ps.textContent=m[2];
  scrollTo({top:0,behavior:'smooth'});
}

document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
rm.onchange=rank;
const opts=P.map(p=>`<option>${p.n}</option>`).join('');
sel.innerHTML=opts;psel.innerHTML=opts;
sel.onchange=individual;psel.onchange=projection;
cinema();radar();dash();rank();individual();profile();projection();costs();

const swVersion='setembrox-v17-data-2009';
const canRegisterSw=location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1';
if('serviceWorker'in navigator&&canRegisterSw){
  navigator.serviceWorker.register(`./sw.js?v=${swVersion}`,{updateViaCache:'none'})
    .then((registration)=>registration.update())
    .catch(()=>{});
}
