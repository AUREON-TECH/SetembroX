(() => {
  const q = (id) => document.getElementById(id);
  const money = (x) => 'R$ ' + Intl.NumberFormat('pt-BR',{maximumFractionDigits:0}).format(x||0);
  const pct = (x) => (Number(x)||0).toFixed(1).replace('.',',') + '%';
  const areaKey = new URLSearchParams(location.search).get('area') || 'promotor';
  const areaLabel = areaKey==='liner'?'Liner / Consultor':areaKey==='closer'?'Closer / Fechador':'Promotor de Marketing';

  function totals(rows){
    return rows.reduce((a,r)=>{
      a.c+=r[0]; a.s+=r[1]; a.v+=r[2]; a.q+=r[3]; a.nq+=r[4];
      if(r[0]>0)a.active++;
      if(r[0]===0)a.zero++;
      if(r[1]>0)a.result++;
      if(r[0]>0&&r[1]===0)a.activeNoSale++;
      if(r[0]===0)a.captureCritical++;
      else if(areaKey!=='promotor'){
        if(r[1]>0)a.ok++;
        else if(r[0]===1)a.capture++;
        else{a.room++;if(r[0]>=3)a.roomStrong++;}
      }else if(r[0]===1){a.capture++; if(r[1]>0)a.lowVolumeSale++;}
      else if(r[1]===0){a.room++; if(r[0]>=3)a.roomStrong++;}
      else a.ok++;
      return a;
    },{c:0,s:0,v:0,q:0,nq:0,active:0,zero:0,result:0,activeNoSale:0,captureCritical:0,capture:0,lowVolumeSale:0,room:0,roomStrong:0,ok:0});
  }

  function validate(name,rows){
    const got=totals(rows), exp=FX_EXPECTED[name];
    const fields=['c','s','v','q','nq'];
    const differences=fields.filter(k=>!exp||got[k]!==exp[k]).map(k=>k+': '+got[k]+' ≠ '+(exp?exp[k]:'?'));
    if(typeof P!=='undefined'){
      const p=P.find(x=>x.n===name);
      if(p){
        for(const k of ['c','s','v','q','nq']){
          if(got[k]!==p[k] && !differences.some(x=>x.startsWith(k+':'))) differences.push(k+': diário '+got[k]+' ≠ mensal '+p[k]);
        }
      }
    }
    return{ok:differences.length===0,got,exp,differences};
  }

  function classify(c,s){
    if(areaKey==='closer'){
      if(c===0)return{kind:'capture',label:'SEM ATENDIMENTO',title:'Sem atendimento',desc:'Nenhum casal foi atribuído a este fechador no dia.'};
      if(s===0)return{kind:'room',label:'FECHAMENTO • ATENÇÃO',title:c>=3?'Volume forte sem venda':'Atendimento sem venda',desc:(c>=3?'Alerta forte':'Alerta')+': houve '+c+' atendimento(s) e nenhuma venda. Revisar objeções, proposta e fechamento.'};
      return{kind:'ok',label:'FECHAMENTO',title:c>=3?'Dia forte de fechamento':'Venda realizada',desc:'Houve atendimento e venda no mesmo dia. Sinal positivo de transformação.'};
    }
    if(areaKey==='liner'){
      if(c===0)return{kind:'capture',label:'SEM ATENDIMENTO',title:'Sem atendimento',desc:'Nenhum casal foi atribuído a este Liner/Consultor no dia.'};
      if(c===1&&s===0)return{kind:'capture',label:'BAIXO VOLUME',title:'Baixo volume',desc:'Apenas 1 atendimento e nenhuma venda. Aumentar volume e revisar a transição para fechamento.'};
      if(s===0)return{kind:'room',label:'CONVERSÃO • ATENÇÃO',title:c>=3?'Volume forte sem venda':'Atendimento sem transformação',desc:(c>=3?'Alerta forte':'Alerta')+': houve volume de atendimento e nenhuma venda. Revisar diagnóstico, condução e passagem ao closer.'};
      return{kind:'ok',label:'RESULTADO',title:c>=3?'Volume + resultado':'Atendimento convertido',desc:'Houve atendimento e venda no mesmo dia.'};
    }
    if(c===0)return{kind:'capture',label:'CAPTAÇÃO • CRÍTICO',title:'Zero geração',desc:'0 casal: alerta direto de captação. Antes de fechar o feedback, confirme se houve folga, ausência ou impedimento operacional.'};
    if(c===1){
      if(s>0)return{kind:'capture',label:'CAPTAÇÃO • ATENÇÃO',title:'Venda com baixo volume',desc:'A venda aconteceu, mas só 1 oportunidade foi gerada. Resultado positivo com capacidade de produção abaixo do ideal.'};
      return{kind:'capture',label:'CAPTAÇÃO • ATENÇÃO',title:'Baixo volume sem venda',desc:'1 casal e 0 venda: o primeiro gargalo do dia está na geração de oportunidade.'};
    }
    if(s===0)return{kind:'room',label:'SALA/CONVERSÃO',title:c>=3?'Volume forte sem venda':'Volume sem transformação',desc:(c>=3?'Alerta forte':'Alerta')+': houve volume de captação e nenhuma venda. Revisar perfil, transição, liner/closer e sala antes de atribuir responsabilidade final.'};
    return{kind:'ok',label:'EQUILIBRADO',title:c>=3?'Dia forte e completo':'Dia convertido',desc:'Houve volume e venda no mesmo dia. Captação e transformação produziram resultado.'};
  }

  function operationTotals(){
    return Object.values(FX_EXPECTED).reduce((a,x)=>({c:a.c+x.c,s:a.s+x.s,v:a.v+x.v,q:a.q+x.q,nq:a.nq+x.nq}),{c:0,s:0,v:0,q:0,nq:0});
  }

  function chart(rows){
    const W=900,H=220,L=34,R=14,T=18,B=30,mx=Math.max(4,...rows.map(r=>r[0]));
    const x=i=>L+(W-L-R)*(i/Math.max(1,rows.length-1));
    const y=v=>T+(H-T-B)*(1-v/mx);
    const pts=rows.map((r,i)=>x(i).toFixed(1)+','+y(r[0]).toFixed(1)).join(' ');
    const grid=[0,1,2,3,4,5,6,7].filter(v=>v<=mx).map(v=>'<line class="fx-axis" x1="'+L+'" y1="'+y(v)+'" x2="'+(W-R)+'" y2="'+y(v)+'"/><text class="fx-label" x="4" y="'+(y(v)+3)+'">'+v+'</text>').join('');
    const labels=rows.map((r,i)=>(i%3===0||i===rows.length-1)?'<text class="fx-label" x="'+(x(i)-5)+'" y="'+(H-8)+'">'+String(i+1).padStart(2,'0')+'</text>':'').join('');
    const dots=rows.map((r,i)=>r[1]>0?'<circle class="fx-sale-dot" cx="'+x(i)+'" cy="'+Math.max(T+5,y(r[0])-10)+'" r="'+Math.min(9,4+r[1])+'"><title>Dia '+(i+1)+': '+r[1]+' venda(s)</title></circle>':'').join('');
    return '<svg class="fx-chart" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Constância diária de casais e vendas">'+grid+'<polyline class="fx-line" points="'+pts+'"/>'+dots+labels+'</svg>';
  }

  function insight(title,text,type){
    return '<div class="fx-insight fx-'+type+'"><b>'+title+'</b><p>'+text+'</p></div>';
  }

  function decision(t,rows,opConv){
    const oneNoSale=rows.filter(r=>r[0]===1&&r[1]===0).length;
    const oneWithSale=rows.filter(r=>r[0]===1&&r[1]>0).length;
    const twoPlusNoSale=rows.filter(r=>r[0]>=2&&r[1]===0).length;
    const threePlusNoSale=rows.filter(r=>r[0]>=3&&r[1]===0).length;
    const captureScore=t.zero*2 + oneNoSale*1.5 + (areaKey==='promotor'?oneWithSale*.5:0);
    const roomScore=twoPlusNoSale + threePlusNoSale*.75;
    const conv=t.c?t.s/t.c*100:0;
    const consistency=t.active/rows.length*100;
    if(consistency>=75 && conv>=opConv) return{kind:'ok',title:'Performance equilibrada',priority:'Manter constância e replicar os dias de venda.',captureScore,roomScore};
    if(captureScore>roomScore*1.25) return{kind:'capture',title:areaKey==='closer'?'Gargalo principal: VOLUME ATRIBUÍDO':areaKey==='liner'?'Gargalo principal: VOLUME DE ATENDIMENTO':'Gargalo principal: CAPTAÇÃO',priority:areaKey==='promotor'?'Primeiro corrigir volume e constância. Depois cobrar transformação.':'Primeiro entender volume atribuído e constância antes de avaliar conversão.',captureScore,roomScore};
    if(roomScore>captureScore*1.25) return{kind:'room',title:areaKey==='closer'?'Gargalo principal: FECHAMENTO':areaKey==='liner'?'Gargalo principal: CONVERSÃO DO LINER':'Gargalo principal: TRANSFORMAÇÃO',priority:areaKey==='closer'?'O volume chega; o foco deve ser objeções, proposta e fechamento.':areaKey==='liner'?'O volume chega; o foco deve ser diagnóstico, condução e passagem ao closer.':'O volume chega; o foco do feedback deve ser qualidade, transição e conversão em sala.',captureScore,roomScore};
    return{kind:'mixed',title:'Gargalo MISTO',priority:areaKey==='promotor'?'Há perda tanto na geração quanto na transformação. Separar metas de volume e conversão.':'Há oscilação de volume e transformação. Separar análise de atendimentos e conversão.',captureScore,roomScore};
  }

  function renderFX(){
    const sel=q('fxSel');
    if(!sel||typeof FX_DAILY==='undefined'||typeof FX_EXPECTED==='undefined')return;
    const order=(typeof P!=='undefined'?P.map(x=>x.n):Object.keys(FX_DAILY)).filter(n=>FX_DAILY[n]);
    if(!sel.options.length){
      sel.innerHTML=order.map(n=>'<option value="'+n+'">'+n+'</option>').join('');
      sel.value=order.includes('Paulo')?'Paulo':order[0];
    }
    const name=sel.value || order[0];
    const rows=FX_DAILY[name];
    const checked=validate(name,rows);
    const badge=q('fxValidation');
    badge.textContent=checked.ok?'✓ '+areaLabel.toUpperCase()+' • DADOS CONFERIDOS COM A BASE OFICIAL':'⚠ DADOS DIVERGENTES';
    badge.className='fx-validate '+(checked.ok?'ok':'bad');
    q('fxName').textContent=name;

    if(!checked.ok){
      q('fxKpis').innerHTML='';
      q('fxChart').innerHTML='';
      q('fxDriver').innerHTML='';
      q('fxPositive').innerHTML='';
      q('fxNegative').innerHTML='';
      q('fxUnknown').innerHTML='';
      q('fxDaily').innerHTML='';
      q('fxConclusion').className='fx-conclusion fx-alert';
      q('fxConclusion').innerHTML='<h3>Cálculo bloqueado</h3><p>A FX encontrou divergência entre a soma diária e o total oficial de '+name+': '+checked.differences.join(' • ')+'. Nenhuma conclusão foi gerada para evitar erro.</p>';
      return;
    }

    q('fxConclusion').className='fx-conclusion';
    const t=checked.got, period=rows.length;
    const consistency=t.active/period*100, conv=t.c?t.s/t.c*100:0, qRate=t.c?t.q/t.c*100:0;
    const avgActive=t.active?t.c/t.active:0, ticket=t.s?t.v/t.s:0;
    const op=operationTotals(), opConv=op.c?op.s/op.c*100:0, opQ=op.c?op.q/op.c*100:0;
    const resultDays=rows.map((r,i)=>r[1]>0?i+1:null).filter(Boolean);
    const zeroDays=rows.map((r,i)=>r[0]===0?i+1:null).filter(Boolean);
    const roomDays=rows.map((r,i)=>r[0]>=2&&r[1]===0?i+1:null).filter(Boolean);
    const strongRoomDays=rows.map((r,i)=>r[0]>=3&&r[1]===0?i+1:null).filter(Boolean);
    const best=Math.max(...rows.map(r=>r[0]),0);
    const bestDays=rows.map((r,i)=>r[0]===best?i+1:null).filter(Boolean);
    const d=decision(t,rows,opConv);

    q('fxKpis').innerHTML=
      '<div class="fx-kpi"><small>Casais</small><b>'+t.c+'</b><span>'+avgActive.toFixed(1).replace('.',',')+' por dia ativo</span></div>'+
      '<div class="fx-kpi"><small>Vendas</small><b>'+t.s+'</b><span>'+pct(conv)+' conversão</span></div>'+
      '<div class="fx-kpi"><small>VGV</small><b>'+money(t.v)+'</b><span>'+money(ticket)+' ticket/venda</span></div>'+
      '<div class="fx-kpi"><small>Constância</small><b>'+pct(consistency)+'</b><span>'+t.active+' dias com casal • '+t.zero+' zerados</span></div>';
    q('fxChart').innerHTML=chart(rows);

    let driver='Constância';
    let driverText='A alavanca mais importante é reduzir dias de baixa geração e sustentar 2+ casais com mais frequência.';
    if(conv>=opConv&&t.s>0){driver='Conversão';driverText='A conversão está no nível ou acima da operação. O próximo salto vem de aumentar volume sem perder a capacidade de fechar.'}
    else if(qRate>=opQ){driver='Qualificação';driverText='A qualidade dos casais está no nível ou acima da operação; o ganho depende de transformar melhor esse perfil.'}
    q('fxDriver').innerHTML='<small>IMPULSIONADOR PRINCIPAL</small><h3>'+driver+'</h3><p>'+driverText+'</p><span class="fx-decision '+d.kind+'">'+d.title+'</span><p><b>Direção:</b> '+d.priority+'</p>';

    const positives=[
      ['Constância',t.active+' de '+period+' dias tiveram casal ('+pct(consistency)+').'],
      ['Qualificação',t.q+' Q em '+t.c+' casais ('+pct(qRate)+'), operação em '+pct(opQ)+'.'],
      ['Dias com venda',resultDays.length+' dias: '+(resultDays.length?resultDays.map(x=>String(x).padStart(2,'0')+'/09').join(', '):'nenhum')+'.'],
      ['Pico de volume',best+' casais nos dias '+bestDays.join(', ')+'.']
    ];
    const negatives=[
      ['Dias zerados',t.zero+' dias: '+(zeroDays.length?zeroDays.join(', '):'nenhum')+'. '+(areaKey==='promotor'?'Pela regra FX são alertas de captação; confirme escala/folga.':'Confirmar escala, atribuição e jornada antes da conclusão.')],
      ['Dias ativos sem venda',t.activeNoSale+' dias tiveram casal e nenhuma venda.'],
      [(areaKey==='closer'?'Fechamento':areaKey==='liner'?'Conversão do Liner':'Sala/Conversão'),roomDays.length+' dias com 2+ atendimentos e 0 venda'+(roomDays.length?': '+roomDays.join(', '):'')+'.'],
      ['Conversão',pct(conv)+' no profissional vs '+pct(opConv)+' na operação.']
    ];
    const unknowns=[
      ['Dias fortes sem venda',strongRoomDays.length?('Nos dias '+strongRoomDays.join(', ')+' houve 3+ casais e 0 venda. Revisar perfil, transição e sala.'):'Não houve dia com 3+ casais e 0 venda.'],
      ['Padrão dos dias de venda',resultDays.length?('Comparar ponto, horário, perfil e sala dos dias '+resultDays.join(', ')+'.'):'Ainda não existe dia de venda para comparar.'],
      ['Zeros precisam de contexto','Antes de concluir falha de execução, confirme folga, ausência, ponto e jornada nos dias zerados.']
    ];
    q('fxPositive').innerHTML=positives.map(x=>insight(x[0],x[1],'positive')).join('');
    q('fxNegative').innerHTML=negatives.map(x=>insight(x[0],x[1],'negative')).join('');
    q('fxUnknown').innerHTML=unknowns.map(x=>insight(x[0],x[1],'unknown')).join('');

    q('fxDaily').innerHTML=rows.map((r,i)=>{
      const c=classify(r[0],r[1]);
      return '<div class="fx-day"><div class="fx-day-top"><b>'+String(i+1).padStart(2,'0')+'/09</b><span class="fx-signal '+c.kind+'">'+c.label+'</span></div>'+
      '<div class="fx-day-metrics"><div><small>Casais</small><b>'+r[0]+'</b></div><div><small>Vendas</small><b>'+r[1]+'</b></div><div><small>VGV</small><b>'+money(r[2])+'</b></div></div>'+
      '<p><b>'+c.title+'.</b> '+c.desc+'</p></div>';
    }).join('');

    q('fxConclusion').innerHTML=
      '<div class="fx-conclusion-grid"><div><small>ETAPA 3 • CONCLUSÃO OPERACIONAL FX</small><span class="fx-decision '+d.kind+'">'+d.title+'</span><h3>'+d.priority+'</h3><p>Leitura fechada com '+t.c+' casais, '+t.s+' vendas, '+money(t.v)+' de VGV, '+pct(conv)+' de conversão e '+pct(consistency)+' de constância.</p><p class="human">Conclusão de performance para conduzir o feedback. Não é decisão automática de promoção, advertência ou desligamento; contexto de escala e observação da liderança continuam obrigatórios.</p></div>'+
      '<div class="fx-scoregrid"><div><span>'+(areaKey==='promotor'?'Captação crítica':'Sem atendimento')+'</span><b>'+t.captureCritical+' dias</b></div><div><span>'+(areaKey==='promotor'?'Captação baixa':'Baixo volume')+'</span><b>'+t.capture+' dias</b></div><div><span>'+(areaKey==='closer'?'Fechamento atenção':areaKey==='liner'?'Conversão atenção':'Sala/Conversão')+'</span><b>'+t.room+' dias</b></div><div><span>Resultado</span><b>'+t.ok+' dias</b></div></div></div>';
  }

  function initFX(){
    const legend=q('fxLegendText');
    if(legend)legend.textContent=areaKey==='closer'?'Sem atendimento • Fechamento atenção • Fechamento':areaKey==='liner'?'Sem atendimento • Conversão atenção • Resultado':'Captação • Sala/Conversão • Equilibrado';
    const sel=q('fxSel');
    if(!sel)return;
    sel.innerHTML='';
    sel.addEventListener('change',renderFX);
    renderFX();
  }

  window.renderFX=renderFX;
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initFX);
  else initFX();
})();