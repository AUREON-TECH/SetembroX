const S={"couples":351,"sales":78,"vgv":6895850,"q":231,"nq":117,"mq":3,"gift":78091.65,"gifts":1011,"activeVgv":6619850,"canceled":3};
const P=[{"n":"Paulo","r":"Captador","e":1,"c":33,"s":4,"v":343000,"q":22,"nq":11,"g":6871.22,"d":18,"w":4,"ws":0,"wv":0,"p":45},{"n":"Ricardo","r":"Captador","e":1,"c":30,"s":2,"v":184000,"q":22,"nq":8,"g":5999.3,"d":9,"w":0,"ws":0,"wv":0,"p":41},{"n":"Renan","r":"Captador","e":1,"c":28,"s":5,"v":403600,"q":19,"nq":9,"g":5597.38,"d":14,"w":1,"ws":0,"wv":0,"p":38},{"n":"Otávio","r":"Captador","e":1,"c":24,"s":2,"v":154400,"q":14,"nq":9,"g":5087.43,"d":12,"w":2,"ws":0,"wv":0,"p":33},{"n":"André","r":"Captador","e":1,"c":24,"s":1,"v":77200,"q":11,"nq":13,"g":5121.42,"d":11,"w":0,"ws":0,"wv":0,"p":33},{"n":"Manara","r":"Captador","e":1,"c":23,"s":9,"v":711200,"q":17,"nq":6,"g":4975.46,"d":13,"w":2,"ws":0,"wv":0,"p":31},{"n":"Clacion","r":"Captador","e":1,"c":21,"s":7,"v":607300,"q":12,"nq":9,"g":5405.41,"d":13,"w":0,"ws":0,"wv":0,"p":29},{"n":"Pedro","r":"Captador","e":1,"c":19,"s":3,"v":525000,"q":16,"nq":3,"g":5411.37,"d":10,"w":0,"ws":0,"wv":0,"p":26},{"n":"Márcio","r":"Captador","e":1,"c":17,"s":4,"v":352200,"q":9,"nq":7,"g":3351.72,"d":12,"w":2,"ws":1,"wv":92000,"p":23},{"n":"Jéssica","r":"Captador","e":1,"c":16,"s":3,"v":265000,"q":7,"nq":9,"g":4113.54,"d":11,"w":3,"ws":0,"wv":0,"p":22},{"n":"Larissa","r":"Captador","e":1,"c":15,"s":17,"v":1502950,"q":10,"nq":5,"g":2491.87,"d":9,"w":0,"ws":0,"wv":0,"p":20},{"n":"Ana Caroline","r":"Captador","e":1,"c":15,"s":6,"v":548200,"q":12,"nq":3,"g":3959.55,"d":10,"w":0,"ws":0,"wv":0,"p":20},{"n":"Matheus Esley","r":"Captador","e":1,"c":14,"s":1,"v":92000,"q":11,"nq":3,"g":3195.66,"d":9,"w":1,"ws":0,"wv":0,"p":19},{"n":"Josyene","r":"Captador","e":1,"c":13,"s":3,"v":251000,"q":9,"nq":4,"g":2075.91,"d":10,"w":1,"ws":0,"wv":0,"p":18},{"n":"Tainá","r":"Captador","e":1,"c":12,"s":0,"v":0,"q":8,"nq":4,"g":2619.7,"d":8,"w":3,"ws":0,"wv":0,"p":16},{"n":"Suene","r":"Captador","e":1,"c":10,"s":2,"v":176400,"q":7,"nq":3,"g":2843.69,"d":9,"w":0,"ws":0,"wv":0,"p":14},{"n":"Adriano","r":"Captador","e":1,"c":8,"s":1,"v":77200,"q":4,"nq":4,"g":1577.83,"d":7,"w":2,"ws":1,"wv":77200,"p":11},{"n":"Weena","r":"Captador","e":1,"c":7,"s":8,"v":625200,"q":3,"nq":4,"g":1427.83,"d":5,"w":0,"ws":0,"wv":0,"p":10},{"n":"Cássio","r":"Captador","e":1,"c":7,"s":0,"v":0,"q":5,"nq":1,"g":1783.84,"d":3,"w":0,"ws":0,"wv":0,"p":10},{"n":"Letícia","r":"Captador","e":1,"c":7,"s":0,"v":0,"q":6,"nq":1,"g":1829.8,"d":7,"w":2,"ws":0,"wv":0,"p":10},{"n":"Matheus Domingos","r":"Captador","e":1,"c":4,"s":0,"v":0,"q":4,"nq":0,"g":839.9,"d":4,"w":0,"ws":0,"wv":0,"p":5},{"n":"Barbara","r":"Captador","e":1,"c":3,"s":0,"v":0,"q":2,"nq":1,"g":1007.88,"d":3,"w":0,"ws":0,"wv":0,"p":4},{"n":"Felipe","r":"Sub-líder","e":0,"c":1,"s":0,"v":0,"q":1,"nq":0,"g":503.94,"d":1,"w":0,"ws":0,"wv":0,"p":1}];
const PR={"prof":[["Empresário(a)",70,17.1],["Autônomo(a)",22,4.5],["Advogado (a)",12,16.7],["Engenheiro (a)",11,18.2],["Comerciante(a)",10,0.0],["Engenheiro civil(a)",9,11.1]],"age":[["30–39",137,13.9],["40–49",100,18.0],["Até 29",59,13.6],["50–59",42,9.5],["60+",12,8.3]],"inc":[["R$ 15 mil+",303,14.5],["R$ 10–15 mil",46,13.0],["Até R$ 7 mil",2,50.0]],"car":[["ONIX",19,15.8],["HB20",14,28.6],["COROLLA",13,7.7],["CIVIC",10,10.0],["COMPASS",10,10.0],["ARGO",9,33.3],["HR-V",9,44.4],["T-CROSS",9,11.1]]};
const DAILY=[["1",4,0,0,3,1,753.94],["2",11,1,367000,4,7,2619.7],["3",11,2,173900,6,5,2247.78],["4",22,3,234000,16,6,4595.51],["5",25,6,537200,18,7,6209.3],["6",17,1,79000,9,8,3757.63],["7",19,2,171000,15,3,5265.41],["8",10,1,77200,7,3,2719.7],["9",14,1,92000,13,1,3191.62],["10",14,1,92000,8,6,2539.75],["11",20,8,617600,16,4,4217.53],["12",30,16,1344200,25,5,7067.23],["13",27,6,473600,15,12,5207.48],["14",17,10,797600,10,7,4279.55],["15",0,0,0,0,0,0],["16",10,2,161000,7,2,2035.81],["17",18,1,92000,10,8,3563.59],["18",13,3,236200,8,4,2301.77],["19",26,3,270000,14,12,6183.34],["20",20,9,911150,13,7,4703.49],["21",10,1,77200,6,4,1963.79],["22",13,1,92000,8,5,2667.73]];

const E=22,R=8,M=30;
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
const raceWinner=P.find(p=>p.n==='Ricardo')||race;
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


function renderTodayOps(){
  const [day,couples,sales,vgv,q,nq,gift]=DAILY[DAILY.length-1];
  const leader={n:'Paulo e Jéssica',w:3,ws:0};
  todayOps.innerHTML=`
    <div class="ops-pad">
      <div class="ops-head"><div><span class="ops-kicker">HOJE • ${day}/09</span><h3>Pulso da operação</h3></div><span class="ops-live"><i></i> FECHAMENTO</span></div>
      <div class="today-hero"><b>${couples}</b><span>CASAIS HOJE</span></div>
      <div class="today-strip">
        <div class="today-stat"><small>Vendas</small><b class="g">${sales}</b></div>
        <div class="today-stat"><small>VGV</small><b class="v">${moneyFull(vgv)}</b></div>
        <div class="today-stat"><small>Qualificação</small><b>${q} Q • ${nq} NQ</b></div>
      </div>
      <div class="today-highlight"><div><small>Destaque do dia</small><div class="muted" style="font-size:9px">Brindes: ${moneyFull(gift)}</div></div><strong>${leader.n} • ${leader.w} casais • ${leader.ws} venda</strong></div>
    </div>`;
}

function renderMetaPace(){
  const mc=Math.max(0,metaCouples-S.couples),ms=Math.max(0,metaSales-S.sales),mv=Math.max(0,metaVgv-S.vgv);
  const days=Math.max(1,R);
  const pc=Math.min(100,S.couples/metaCouples*100),ps=Math.min(100,S.sales/metaSales*100),pv=Math.min(100,S.vgv/metaVgv*100);
  metaPace.innerHTML=`
    <div class="ops-pad">
      <div class="ops-head"><div><span class="ops-kicker">RITMO DA META</span><h3>O que falta para fechar setembro</h3></div><span class="ops-live"><i></i> ${R} DIAS</span></div>
      <div class="pace-summary">
        <div class="pace-box"><small>Faltam casais</small><b class="c">${mc}</b><span>${(mc/days).toFixed(1).replace('.',',')} por dia</span></div>
        <div class="pace-box"><small>Faltam vendas</small><b class="g">${ms}</b><span>${(ms/days).toFixed(1).replace('.',',')} por dia</span></div>
        <div class="pace-box"><small>Falta VGV</small><b class="v">${moneyFull(mv)}</b><span>${moneyFull(mv/days)} por dia</span></div>
      </div>
      <div class="pace-needed">
        <div class="pace-row"><label>Casais</label><div class="pace-track"><i style="width:${pc}%"></i></div><b>${pct(pc)}</b></div>
        <div class="pace-row"><label>Vendas</label><div class="pace-track"><i style="width:${ps}%"></i></div><b>${pct(ps)}</b></div>
        <div class="pace-row"><label>VGV</label><div class="pace-track"><i style="width:${pv}%"></i></div><b>${pct(pv)}</b></div>
      </div>
      <div class="pace-foot">Ritmo necessário calculado sobre os ${R} dias restantes após a base de 22/09.</div>
    </div>`;
}

function renderDailyEvolution(){
  let cc=0,ss=0,vv=0;
  const cum=DAILY.map(([d,c,s,v])=>{cc+=c;ss+=s;vv+=v;return[d,cc,ss,vv]});
  const W=920,H=230,L=42,T=18,RGT=18,B=28;
  const x=i=>L+(W-L-RGT)*(i/Math.max(1,cum.length-1));
  const y=p=>T+(H-T-B)*(1-Math.min(108,p)/108);
  const pts=(idx,meta)=>cum.map((r,i)=>`${x(i).toFixed(1)},${y(r[idx]/meta*100).toFixed(1)}`).join(' ');
  const grid=[0,25,50,75,100].map(v=>`<line class="${v===100?'evo-goal':'evo-axis'}" x1="${L}" y1="${y(v)}" x2="${W-RGT}" y2="${y(v)}"/><text class="${v===100?'evo-goal-label':'evo-label'}" x="3" y="${y(v)+3}">${v}%</text>`).join('');
  const labels=cum.map((r,i)=>i%4===0||i===cum.length-1?`<text class="evo-label" x="${x(i)-4}" y="${H-7}">${r[0]}</text>`:'').join('');
  const cp=S.couples/metaCouples*100,sp=S.sales/metaSales*100,vp=S.vgv/metaVgv*100;
  dailyEvolution.innerHTML=`
    <div class="ops-pad">
      <div class="evo-top">
        <div class="evo-title"><span class="ops-kicker">EVOLUÇÃO DIÁRIA</span><h3>Trajetória contra a meta</h3><p>Casais, vendas e VGV na mesma escala: percentual da meta oficial.</p></div>
        <div class="evo-legend">
          <span class="evo-pill couples"><i></i>Casais <b>${pct(cp)}</b></span>
          <span class="evo-pill sales"><i></i>Vendas <b>${pct(sp)}</b></span>
          <span class="evo-pill vgv"><i></i>VGV <b>${pct(vp)}</b></span>
        </div>
      </div>
      <div class="evo-shell"><svg class="evo-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Evolução diária de casais vendas e VGV">${grid}<polyline class="evo-couples" points="${pts(1,metaCouples)}"/><polyline class="evo-sales" points="${pts(2,metaSales)}"/><polyline class="evo-vgv" points="${pts(3,metaVgv)}"/>${labels}</svg></div>
      <div class="evo-insight">
        <div><small>Melhor dia em casais</small><b>12/09 • 30 casais</b></div>
        <div><small>Melhor dia em vendas</small><b>12/09 • 16 vendas</b></div>
        <div><small>Maior VGV diário</small><b>12/09 • R$ 1,34 mi</b></div>
      </div>
    </div>`;
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
  i22.textContent=`${raceWinner.n} • VENCEDOR`;
  iProj.textContent=team+' casais';
  missionText.innerHTML=`<b>${S.couples} casais</b>, <b>${S.sales} vendas</b> e <b>${money(S.vgv)}</b> em VGV. <b>${raceWinner.n}</b> venceu a Corrida dos 22; ${race.n} lidera o volume mensal com <b>${race.c} casais</b>.`;

  heroLeaderName.textContent=cap.n;
  heroLeaderSub.textContent=`CAPITÃO DA SEMANA • ${cap.w} CASAIS NA SEMANA`;
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
        <strong>Ricardo venceu a Corrida dos 22!</strong>
        <p>${race.n} lidera o volume mensal com ${race.c} casais; ${raceWinner.n} foi o primeiro a atingir 22.</p>
        <em>Cada casal muda o ranking.</em>
      </div>
    </div>`;
}

function dash(){
  dk.innerHTML=[
    k('Casais',S.couples,'base oficial até 22/09'),
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

  free.innerHTML=`<span class="badge g">CORRIDA DOS 22 • LIVRE DO MÊS</span><div class="big"><b>${raceWinner.n}</b><span class="g">VENCEDOR</span></div><div class="muted">${raceWinner.n} foi o primeiro captador a atingir 22 casais e conquistou a liberdade de horário no mês.</div><div class="prog"><i style="width:100%"></i></div><small class="muted">🏆 Conquista confirmada • ${race.n} é o líder atual de volume com ${race.c} casais.</small>`;

  const month=couplesRank();
  bars('top',month.slice(0,8).map(p=>[p.n,p.c]));
  di.innerHTML=
    ins('Projeção da equipe',`Ritmo atual: ${team} casais até 30/09.`)+
    ins('Capitão da semana',`${cap.n} lidera com ${cap.w} casais; ${sec.n} vem com ${sec.w}.`)+
    ins('Top VGV',`${vgvRank()[0].n} lidera com ${moneyFull(vgvRank()[0].v)}.`)+
    ins('Corrida dos 22',`${raceWinner.n} venceu a disputa; ${race.n} lidera o volume atual com ${race.c} casais.`)+
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


function diagnosticMetrics(p){
  const totalDays=el.reduce((a,x)=>a+x.d,0)||1;
  const totalC=el.reduce((a,x)=>a+x.c,0)||1;
  const totalS=el.reduce((a,x)=>a+x.s,0);
  const totalQ=el.reduce((a,x)=>a+x.q,0);
  const totalV=el.reduce((a,x)=>a+x.v,0);
  const totalG=el.reduce((a,x)=>a+x.g,0);
  const avgPace=totalC/totalDays;
  const avgConv=totalS/totalC*100;
  const avgQual=totalQ/totalC*100;
  const avgVgv=totalV/totalC;
  const avgCost=totalG/totalC;
  const pace=p.c/Math.max(p.d,1);
  const conv=cv(p);
  const qual=p.q/Math.max(p.c,1)*100;
  const vgv=p.v/Math.max(p.c,1);
  const cost=co(p);
  return[
    {n:'Volume/dia',score:avgPace?pace/avgPace:1,show:'Você: '+pace.toFixed(1).replace('.',',')+' • operação: '+avgPace.toFixed(1).replace('.',',')+' casal/dia'},
    {n:'Conversão',score:avgConv?conv/avgConv:1,show:'Você: '+pct(conv)+' • operação: '+pct(avgConv)},
    {n:'Qualificação',score:avgQual?qual/avgQual:1,show:'Você: '+pct(qual)+' • operação: '+pct(avgQual)},
    {n:'VGV/casal',score:avgVgv?vgv/avgVgv:1,show:'Você: '+moneyFull(vgv)+' • operação: '+moneyFull(avgVgv)},
    {n:'Custo/casal',score:cost?avgCost/cost:1,show:'Você: '+moneyFull(cost)+' • operação: '+moneyFull(avgCost)}
  ];
}

function diagnosticItem(m){
  const delta=Math.round((m.score-1)*100);
  const label=(delta>=0?'+':'')+delta+'% vs média';
  return '<div class="diag-item"><div class="diag-item-top"><b>'+m.n+'</b><span class="diag-score">'+label+'</span></div><p>'+m.show+'</p></div>';
}

function renderDiagnosis(){
  if(!document.getElementById('dsel'))return;
  if(!dsel.options.length)dsel.innerHTML=el.map(p=>'<option>'+p.n+'</option>').join('');
  const p=el.find(x=>x.n===dsel.value)||el[0];
  const metrics=diagnosticMetrics(p);
  const strong=[...metrics].sort((a,b)=>b.score-a.score).slice(0,3);
  const weak=[...metrics].sort((a,b)=>a.score-b.score).slice(0,3);
  const weakest=weak[0];

  const actions={
    'Volume/dia':'Aumentar o número de abordagens e pesquisas por turno. Definir uma meta curta por bloco de horário e acompanhar o ritmo durante o dia.',
    'Conversão':'Revisar abordagem, convite e transição. Ouvir objeções recorrentes e treinar uma resposta objetiva antes do próximo turno.',
    'Qualificação':'Reforçar a pesquisa antes da entrada em sala, priorizando renda, perfil e critérios que aumentam a qualidade das fichas.',
    'VGV/casal':'Buscar perfis com maior potencial de compra e melhorar a leitura do casal antes da entrega para sala.',
    'Custo/casal':'Revisar o uso de brindes e priorizar os incentivos que geram mais entrada em sala com menor custo.'
  };

  const coupleProgress=S.couples/metaCouples*100;
  const salesProgress=S.sales/metaSales*100;
  const vgvProgress=S.vgv/metaVgv*100;
  const qRate=S.q/S.couples*100;

  diagName.textContent=p.n;
  diagTag.textContent='Base até 22/09 • comparação com a média da operação';
  diagOps.innerHTML=
    '<div class="diag-op"><small>Meta mais avançada</small><b class="c">Casais '+pct(coupleProgress)+'</b><span>'+S.couples+' de '+metaCouples+'</span></div>'+
    '<div class="diag-op"><small>Maior atenção na meta</small><b class="a">Vendas '+pct(salesProgress)+'</b><span>'+S.sales+' de '+metaSales+'</span></div>'+
    '<div class="diag-op"><small>VGV realizado</small><b class="v">'+pct(vgvProgress)+'</b><span>'+moneyFull(S.vgv)+' de R$ 8,5 mi</span></div>'+
    '<div class="diag-op"><small>Qualificação da operação</small><b class="g">'+pct(qRate)+'</b><span>'+S.q+' Q em '+S.couples+' casais</span></div>';

  diagStrength.innerHTML=strong.map(diagnosticItem).join('');
  diagWeak.innerHTML=weak.map(diagnosticItem).join('');

  const avgDay=p.c/Math.max(p.d,1);
  diagAction.innerHTML=
    '<div class="diag-action-grid"><div><small>PRÓXIMA AÇÃO • '+p.n+'</small><h3>Prioridade: '+weakest.n+'</h3><p>'+actions[weakest.n]+'</p></div>'+
    '<div class="diag-action-kpis"><div><span>Casais</span><b>'+p.c+'</b></div><div><span>Vendas</span><b>'+p.s+'</b></div><div><span>Ritmo diário</span><b>'+avgDay.toFixed(1).replace('.',',')+'</b></div><div><span>Projeção</span><b>'+p.p+' casais</b></div></div></div>';
}

function profile(){
  bars('pb',PR.prof,(v,x)=>v+' • '+x+'%');
  bars('ab',PR.age,(v,x)=>v+' • '+x+'%');
  bars('ib',PR.inc,(v,x)=>v+' • '+x+'%');
  bars('cb',PR.car,(v,x)=>v+' • '+x+'%');
  pi.innerHTML=
    ins('Maior VGV por profissão','Empresário(a): R$ 1,76 mi em VGV geral.')+
    ins('Faixa etária','40–49: 18,0% de conversão em 100 casais; 30–39: 13,9% em 137 casais.')+
    ins('Carros com força','HR-V: 44,4% de conversão; Argo: 33,3%; HB20: 28,6%.')+
    ins('Ponto','347 dos 351 registros vieram do Parque Dreams.');
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
  diag:['DIAGNÓSTICO X','Pontos Fortes & Fracos','Leitura comparativa para feedback, desenvolvimento e ação.'],
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
sel.onchange=individual;psel.onchange=projection;dsel.onchange=renderDiagnosis;
cinema();radar();dash();renderTodayOps();renderMetaPace();renderDailyEvolution();rank();individual();renderDiagnosis();profile();projection();costs();

const swVersion='setembrox-v21-diagnostic';
const canRegisterSw=location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1';
if('serviceWorker'in navigator&&canRegisterSw){
  navigator.serviceWorker.register(`./sw.js?v=${swVersion}`,{updateViaCache:'none'})
    .then((registration)=>registration.update())
    .catch(()=>{});
}
