(()=>{
  const people=new Map();
  const add=(p,role,daily)=>{
    if(!people.has(p.n))people.set(p.n,[]);
    people.get(p.n).push({
      role,c:p.c||0,s:p.s||0,v:p.v||0,q:p.q||0,nq:p.nq||0,g:p.g||0,d:p.d||0,
      w:p.w||0,ws:p.ws||0,wv:p.wv||0,daily:(daily&&daily[p.n])||[]
    });
  };
  const prom=[{"n":"Ricardo","r":"Promotor de Marketing","c":42,"s":6,"v":499319.96,"q":30,"nq":12,"g":9052.99,"d":14,"w":4,"ws":1,"wv":81919.96},{"n":"Paulo","r":"Promotor de Marketing","c":38,"s":5,"v":434900,"q":26,"nq":12,"g":7703.14,"d":21,"w":0,"ws":0,"wv":0},{"n":"Clacion","r":"Promotor de Marketing","c":35,"s":10,"v":1048500,"q":20,"nq":15,"g":10718.8,"d":21,"w":7,"ws":3,"wv":251200},{"n":"Renan","r":"Promotor de Marketing","c":33,"s":3,"v":403600,"q":24,"nq":9,"g":6467.33,"d":17,"w":3,"ws":0,"wv":0},{"n":"Otávio","r":"Promotor de Marketing","c":27,"s":4,"v":326300,"q":16,"nq":10,"g":6011.32,"d":15,"w":2,"ws":1,"wv":91900},{"n":"Suene","r":"Promotor de Marketing","c":26,"s":5,"v":452900,"q":16,"nq":10,"g":7931.12,"d":15,"w":5,"ws":1,"wv":80500},{"n":"André","r":"Promotor de Marketing","c":25,"s":2,"v":156200,"q":12,"nq":13,"g":5793.34,"d":12,"w":1,"ws":1,"wv":79000},{"n":"Manara","r":"Promotor de Marketing","c":23,"s":9,"v":711200,"q":17,"nq":6,"g":4975.46,"d":13,"w":0,"ws":0,"wv":0},{"n":"Pedro","r":"Promotor de Marketing","c":23,"s":1,"v":525000,"q":20,"nq":3,"g":6703.24,"d":14,"w":1,"ws":0,"wv":0},{"n":"Jéssica","r":"Promotor de Marketing","c":23,"s":3,"v":444800,"q":9,"nq":14,"g":5943.34,"d":15,"w":1,"ws":0,"wv":0},{"n":"Ana Caroline","r":"Promotor de Marketing","c":22,"s":9,"v":886400,"q":16,"nq":6,"g":5399.45,"d":15,"w":2,"ws":3,"wv":246300},{"n":"Josyene","r":"Promotor de Marketing","c":22,"s":4,"v":330920,"q":17,"nq":5,"g":3977.73,"d":16,"w":4,"ws":0,"wv":0},{"n":"Márcio","r":"Promotor de Marketing","c":20,"s":4,"v":352200,"q":11,"nq":8,"g":3819.7,"d":15,"w":2,"ws":0,"wv":0},{"n":"Larissa","r":"Promotor de Marketing","c":18,"s":11,"v":1502950,"q":12,"nq":6,"g":2927.83,"d":12,"w":2,"ws":0,"wv":0},{"n":"Matheus Esley","r":"Promotor de Marketing","c":14,"s":1,"v":92000,"q":11,"nq":3,"g":3195.66,"d":9,"w":0,"ws":0,"wv":0},{"n":"Tainá","r":"Promotor de Marketing","c":13,"s":0,"v":0,"q":9,"nq":4,"g":2955.66,"d":9,"w":0,"ws":0,"wv":0},{"n":"Weena","r":"Promotor de Marketing","c":13,"s":2,"v":625200,"q":7,"nq":6,"g":2619.7,"d":8,"w":4,"ws":0,"wv":0},{"n":"Adriano","r":"Promotor de Marketing","c":11,"s":1,"v":77200,"q":6,"nq":5,"g":2165.76,"d":8,"w":0,"ws":0,"wv":0},{"n":"Letícia","r":"Promotor de Marketing","c":10,"s":1,"v":92000,"q":7,"nq":3,"g":2669.7,"d":10,"w":1,"ws":1,"wv":92000},{"n":"Cássio","r":"Promotor de Marketing","c":8,"s":0,"v":0,"q":6,"nq":1,"g":2119.8,"d":4,"w":1,"ws":0,"wv":0},{"n":"Matheus Domingos","r":"Promotor de Marketing","c":4,"s":0,"v":0,"q":4,"nq":0,"g":839.9,"d":4,"w":0,"ws":0,"wv":0},{"n":"Barbara","r":"Promotor de Marketing","c":4,"s":0,"v":0,"q":3,"nq":1,"g":1175.86,"d":4,"w":1,"ws":0,"wv":0},{"n":"Gabriel","r":"Promotor de Marketing","c":1,"s":0,"v":0,"q":1,"nq":0,"g":167.98,"d":1,"w":0,"ws":0,"wv":0}];
  prom.forEach(p=>add(p,'Promotor de Marketing',typeof FX_DAILY!=='undefined'?FX_DAILY:{}));
  const areas=window.AREA_DATA||{};
  ['liner','closer'].forEach(key=>{
    const a=areas[key];
    if(!a)return;
    (a.P||[]).forEach(p=>add(p,a.label||p.r||key,a.FX_DAILY||{}));
  });
  window.XIA_PERFORMANCE={
    updated:'30/09/2026',
    people:[...people.entries()].map(([name,roles])=>({name,roles})).sort((a,b)=>a.name.localeCompare(b.name,'pt-BR'))
  };
})();