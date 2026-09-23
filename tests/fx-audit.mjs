import assert from 'node:assert/strict';
import fs from 'node:fs';

const html=fs.readFileSync('index.html','utf8');
const app=fs.readFileSync('app.js','utf8');
const data=fs.readFileSync('fx-data.js','utf8');
const engine=fs.readFileSync('fx-engine.js','utf8');
const sales=fs.readFileSync('sales-count-fix.js','utf8');
const css=fs.readFileSync('fx.css','utf8');

assert.doesNotThrow(()=>new Function(app),'app.js must remain valid JavaScript');
assert.doesNotThrow(()=>new Function(data),'fx-data.js must remain valid JavaScript');
assert.doesNotThrow(()=>new Function(engine),'fx-engine.js must remain valid JavaScript');
assert.doesNotThrow(()=>new Function(sales),'sales-count-fix.js must remain valid JavaScript');

assert.match(html,/data-go=["']fx["']/i,'navigation must expose FX');
assert.match(html,/id=["']fx["']/i,'app must have FX section');
assert.match(html,/id=["']fxSel["']/i,'FX must allow selecting a professional');
assert.match(html,/id=["']fxValidation["']/i,'FX must show validation state');
assert.match(html,/src=["']\.\/fx-data\.js["'][^>]*>[\s\S]*src=["']\.\/app\.js["'][^>]*>[\s\S]*src=["']\.\/fx-engine\.js["']/i,'FX scripts must load in the correct order');
assert.doesNotMatch(html,/\\n<script/i,'HTML must not contain a literal escaped newline between scripts');

const parsed=new Function(data+'; return {FX_DAILY,FX_EXPECTED,FX_PERIOD};')();
const {FX_DAILY,FX_EXPECTED}=parsed;
assert.ok(Object.keys(FX_DAILY).length>=22,'FX must include the professional roster');

for(const [name,rows] of Object.entries(FX_DAILY)){
  assert.equal(rows.length,22,name+' must have 22 daily records');
  const total=rows.reduce((a,r)=>({c:a.c+r[0],s:a.s+r[1],v:a.v+r[2],q:a.q+r[3],nq:a.nq+r[4]}),{c:0,s:0,v:0,q:0,nq:0});
  assert.deepEqual(total,FX_EXPECTED[name],name+' daily totals must match official monthly totals');
}

const global=Object.values(FX_EXPECTED).reduce((a,x)=>({c:a.c+x.c,s:a.s+x.s,v:a.v+x.v,q:a.q+x.q,nq:a.nq+x.nq}),{c:0,s:0,v:0,q:0,nq:0});
assert.deepEqual(global,{c:351,s:78,v:6895850,q:231,nq:117},'FX global totals must match the official base through 22/09');

assert.deepEqual(FX_EXPECTED.Paulo,{c:33,s:4,v:343000,q:22,nq:11},'Paulo totals must match the official sheet');
assert.deepEqual(FX_DAILY.Paulo[21],[3,0,0,3,0],'Paulo 22/09 must be 3 couples, 0 sales, 0 VGV, 3 Q, 0 NQ');

assert.match(engine,/function classify\(c,s\)/,'FX must classify daily performance');
assert.match(engine,/CAPTAÇÃO • CRÍTICO/,'0 couple day must be a strong capture alert');
assert.match(engine,/SALA\/CONVERSÃO/,'2+ couples without a sale must flag transformation');
assert.match(engine,/EQUILIBRADO/,'days with volume and sales must be balanced');
assert.match(engine,/DADOS CONFERIDOS COM A BASE OFICIAL/,'FX must surface successful data validation');
assert.match(engine,/DADOS DIVERGENTES/,'FX must block conclusions on mismatched data');
assert.match(engine,/Cálculo bloqueado/,'FX must refuse to diagnose divergent totals');
assert.match(engine,/Gargalo principal: CAPTAÇÃO|Gargalo principal: TRANSFORMAÇÃO|Gargalo MISTO|Performance equilibrada/,'FX must produce a decisive operational conclusion');
assert.match(engine,/Não é decisão automática|não é decisão automática/i,'FX must keep employment decisions human');

assert.match(css,/\.fx-grid\s*\{/,'FX needs dedicated layout');
assert.match(css,/\.fx-validate\.ok\s*\{/,'FX needs a validated-data state');
assert.match(css,/\.fx-validate\.bad\s*\{/,'FX needs a divergent-data state');

console.log('SETEMBRO X FX strong audit passed');
