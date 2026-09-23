import assert from 'node:assert/strict';
import fs from 'node:fs';

const html=fs.readFileSync('index.html','utf8');
const app=fs.readFileSync('app.js','utf8');
const data=fs.readFileSync('fx-data.js','utf8');
const css=fs.readFileSync('fx.css','utf8');

assert.doesNotThrow(()=>new Function(data+'\n'+app),'FX data + app must remain valid JavaScript');

assert.match(html,/data-go=["']fx["']/i,'navigation must expose FX');
assert.match(html,/id=["']fx["']/i,'app must have FX section');
assert.match(html,/id=["']fxSel["']/i,'FX must allow selecting a professional');
assert.match(html,/id=["']fxChart["']/i,'FX must have a constancy chart');
assert.match(html,/id=["']fxDaily["']/i,'FX must have a daily diagnostic timeline');
assert.match(html,/id=["']fxConclusion["']/i,'FX must have a final performance conclusion');

assert.match(data,/const\s+FX_DAILY\s*=/,'FX daily data must exist');
assert.match(data,/"Paulo":\[\[2,0,0,2,0\]/,'Paulo day 1 must be represented');
assert.match(data,/\[3,0,0,3,0\]\]\};/,'FX data must include the 22nd day');

assert.match(app,/function\s+renderFX\s*\(/,'app must render FX');
assert.match(app,/function\s+fxClassifyDay\s*\(/,'app must classify daily performance');
assert.match(app,/Captação|Sala\/Conversão|Equilibrado/,'FX must use the three requested diagnostic signals');
assert.match(app,/sinal|indício|diagnóstico/i,'FX labels must be framed as diagnostic signals, not proof of fault');
assert.match(app,/Constância|Conversão|Impulsionador|Pontos positivos|Pontos de atenção/i,'FX must include the requested feedback dimensions');
assert.match(app,/não.*decisão automática|decisão humana|avaliação humana/i,'FX must keep employment decisions human');

assert.match(css,/\.fx-grid\s*\{/,'FX needs dedicated layout');
assert.match(css,/\.fx-day\s*\{/,'FX daily timeline needs dedicated styling');

console.log('SETEMBRO X FX audit passed');
