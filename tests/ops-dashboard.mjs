import assert from 'node:assert/strict';
import fs from 'node:fs';

const html=fs.readFileSync('index.html','utf8');
const app=fs.readFileSync('app.js','utf8');
const css=fs.readFileSync('ops-dashboard.css','utf8');
const diagnosticCss=fs.readFileSync('diagnostic.css','utf8');
assert.doesNotThrow(()=>new Function(app),'app.js must remain valid JavaScript');

assert.match(html,/id=["']todayOps["']/i,'dashboard must have a Hoje operational panel');
assert.match(html,/id=["']metaPace["']/i,'dashboard must have a meta pace panel');
assert.match(html,/id=["']dailyEvolution["']/i,'dashboard must have a daily evolution panel');

assert.match(app,/const\s+DAILY\s*=/,'app must carry daily evolution data');
assert.match(app,/function\s+renderTodayOps\s*\(/,'app must render the Hoje panel');
assert.match(app,/function\s+renderMetaPace\s*\(/,'app must render the target pace panel');
assert.match(app,/function\s+renderDailyEvolution\s*\(/,'app must render the daily evolution panel');
assert.match(app,/\["25",8,3,269920/,'latest daily data must represent 25/09');
assert.match(app,/metaCouples\s*-\s*S\.couples/,'pace panel must use remaining couples');
assert.match(app,/metaSales\s*-\s*S\.sales/,'pace panel must use remaining sales');
assert.match(app,/metaVgv\s*-\s*S\.vgv/,'pace panel must use remaining VGV');

assert.match(css,/\.ops-grid\s*\{/,'new management panels need dedicated layout styles');
assert.match(css,/\.evo-chart\s*\{/,'daily evolution chart needs dedicated styles');

assert.doesNotMatch(html+app,/Batalha por Equipes|Clacion\s*[×xX]\s*Felipe/i,'team battle must not be added');

assert.match(app,/raceWinner=.*P\.find\([^\n]*Ricardo/i,'Ricardo must remain the official winner of the 22 race in Promotor view');
assert.match(app,/Ricardo venceu a Corrida dos 22|Ricardo.*vencedor/i,'dashboard must identify Ricardo as the winner of the 22 race');

assert.match(html,/data-go=["']diag["']/i,'navigation must expose the strengths and weaknesses tab');
assert.match(html,/id=["']diag["']/i,'app must have a diagnostic section');
assert.match(html,/id=["']dsel["']/i,'diagnostic tab must allow selecting a professional');
assert.match(app,/function\s+renderDiagnosis\s*\(/,'app must render strengths and weaknesses dynamically');
assert.match(app,/Volume\/dia|Conversão|Qualificação|VGV\/casal|Custo\/casal/i,'diagnostic must compare performance dimensions');
assert.match(diagnosticCss,/\.diag-grid\s*\{/,'diagnostic tab needs a dedicated premium layout');

console.log('SETEMBRO X operations dashboard audit passed');
