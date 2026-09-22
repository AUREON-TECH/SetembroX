import assert from 'node:assert/strict';
import fs from 'node:fs';

const html=fs.readFileSync('index.html','utf8');
const app=fs.readFileSync('app.js','utf8');
const css=fs.readFileSync('ops-dashboard.css','utf8');
assert.doesNotThrow(()=>new Function(app),'app.js must remain valid JavaScript');

assert.match(html,/id=["']todayOps["']/i,'dashboard must have a Hoje operational panel');
assert.match(html,/id=["']metaPace["']/i,'dashboard must have a meta pace panel');
assert.match(html,/id=["']dailyEvolution["']/i,'dashboard must have a daily evolution panel');

assert.match(app,/const\s+DAILY\s*=/,'app must carry daily evolution data');
assert.match(app,/function\s+renderTodayOps\s*\(/,'app must render the Hoje panel');
assert.match(app,/function\s+renderMetaPace\s*\(/,'app must render the target pace panel');
assert.match(app,/function\s+renderDailyEvolution\s*\(/,'app must render the daily evolution panel');
assert.match(app,/\["21",10,1,77200/,'latest daily data must represent 21/09');
assert.match(app,/metaCouples\s*-\s*S\.couples/,'pace panel must use remaining couples');
assert.match(app,/metaSales\s*-\s*S\.sales/,'pace panel must use remaining sales');
assert.match(app,/metaVgv\s*-\s*S\.vgv/,'pace panel must use remaining VGV');

assert.match(css,/\.ops-grid\s*\{/,'new management panels need dedicated layout styles');
assert.match(css,/\.evo-chart\s*\{/,'daily evolution chart needs dedicated styles');

assert.doesNotMatch(html+app,/Batalha por Equipes|Clacion\s*[×xX]\s*Felipe/i,'team battle must not be added');

console.log('SETEMBRO X operations dashboard audit passed');
