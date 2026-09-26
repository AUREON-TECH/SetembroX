import assert from 'node:assert/strict';
import fs from 'node:fs';

const html=fs.readFileSync('index.html','utf8');
const app=fs.readFileSync('app.js','utf8');
const areaSrc=fs.readFileSync('area-data.js','utf8');
const fxSrc=fs.readFileSync('fx-data.js','utf8');
const engine=fs.readFileSync('fx-engine.js','utf8');
const sales=fs.readFileSync('sales-count-fix.js','utf8');
const sw=fs.readFileSync('sw.js','utf8');

assert.doesNotThrow(()=>new Function(app),'app.js must remain valid JavaScript');
assert.doesNotThrow(()=>new Function(areaSrc),'area-data.js must remain valid JavaScript');
assert.doesNotThrow(()=>new Function(fxSrc),'fx-data.js must remain valid JavaScript');
assert.doesNotThrow(()=>new Function(engine),'fx-engine.js must remain valid JavaScript');
assert.doesNotThrow(()=>new Function(sales),'sales-count-fix.js must remain valid JavaScript');

assert.match(html,/id=["']areaSel["']/,'header must have an area selector');
assert.match(html,/value=["']promotor["']/,'selector must expose Promotor de Marketing');
assert.match(html,/value=["']liner["']/,'selector must expose Liner');
assert.match(html,/value=["']closer["']/,'selector must expose Closer');
assert.match(html,/Closer \/ Fechador/,'Closer must be labeled as Fechador');
assert.ok(html.indexOf('area-data.js') < html.indexOf('fx-data.js'),'area-data.js must load before fx-data.js');
assert.ok(html.indexOf('fx-data.js') < html.indexOf('app.js'),'fx-data.js must load before app.js');
assert.doesNotMatch(html,/\\n<script/,'HTML must not contain escaped script newlines');

const raw=areaSrc.replace(/^window\.AREA_DATA=/,'').replace(/;\s*$/,'');
const area=JSON.parse(raw);
assert.deepEqual(Object.keys(area).sort(),['closer','liner']);

function totalsFromPeople(P){
  return P.reduce((a,p)=>({couples:a.couples+p.c,sales:a.sales+p.s,vgv:a.vgv+p.v,q:a.q+p.q,nq:a.nq+p.nq,gift:+(a.gift+p.g).toFixed(2)}),{couples:0,sales:0,vgv:0,q:0,nq:0,gift:0});
}
function totalsFromFx(FX){
  return Object.values(FX).reduce((a,p)=>({couples:a.couples+p.c,sales:a.sales+p.s,vgv:a.vgv+p.v,q:a.q+p.q,nq:a.nq+p.nq}),{couples:0,sales:0,vgv:0,q:0,nq:0});
}

assert.equal(area.liner.P.length,11,'Liner view must contain 11 professionals');
assert.equal(area.closer.P.length,8,'Closer view must contain 8 professionals');
assert.deepEqual(totalsFromPeople(area.liner.P),{couples:382,sales:84,vgv:7707370,q:253,nq:126,gift:85404.94});
assert.deepEqual(totalsFromPeople(area.closer.P),{couples:367,sales:84,vgv:7707370,q:243,nq:121,gift:83289.18});
assert.deepEqual(totalsFromFx(area.liner.FX_EXPECTED),{couples:382,sales:84,vgv:7707370,q:253,nq:126});
assert.deepEqual(totalsFromFx(area.closer.FX_EXPECTED),{couples:367,sales:84,vgv:7707370,q:243,nq:121});

for(const [key,dataset] of Object.entries(area)){
  for(const [name,rows] of Object.entries(dataset.FX_DAILY)){
    assert.equal(rows.length,25,key+' / '+name+' must have 25 daily records');
    const t=rows.reduce((a,r)=>({c:a.c+r[0],s:a.s+r[1],v:a.v+r[2],q:a.q+r[3],nq:a.nq+r[4]}),{c:0,s:0,v:0,q:0,nq:0});
    assert.deepEqual(t,dataset.FX_EXPECTED[name],key+' / '+name+' FX totals must reconcile');
  }
}

assert.match(app,/const AREA_KEY=/,'app must resolve selected area');
assert.match(app,/P\.splice\(0,P\.length/,'app must replace the professional roster before rankings render');
assert.match(app,/Object\.assign\(S,a\.S\)/,'app must replace selected area totals');
assert.match(app,/AREA_VOLUME_LABEL/,'app must use role-aware volume labels');
assert.match(app,/PERFORMANCE DA ÁREA/,'arena must have role-specific mode');
assert.match(fxSrc,/AREA_DATA\[__fxArea\]/,'FX data must switch with selected area');
assert.match(engine,/areaKey==='closer'/,'FX engine must have Closer-specific logic');
assert.match(engine,/areaKey==='liner'/,'FX engine must have Liner-specific logic');
assert.doesNotMatch(sales,/salesByPerson|weekSalesByPerson/,'rerender script must not overwrite selected-area sales');
assert.match(sw,/\.\/area-data\.js/,'PWA cache must include role data');

console.log('SETEMBRO X area roles audit passed');
