import assert from 'node:assert/strict';
import fs from 'node:fs';

const html=fs.readFileSync('index.html','utf8');
const css=fs.readFileSync('layout-premium.css','utf8');
const app=fs.readFileSync('app.js','utf8');

assert.match(html,/layout-premium\.css/,'premium layout stylesheet must be loaded');
assert.match(html,/id=["']flowBadge["']/,'header must show sequence badge');
assert.match(html,/FLUXO OPERACIONAL/,'sidebar must identify the workflow');
assert.match(html,/data-go=["']dash["'][^>]*>[^<]*01/i,'Central must be step 01');
assert.match(html,/data-go=["']fx["'][^>]*>[^<]*04/i,'FX must be step 04');
assert.match(html,/data-go=["']custos["'][^>]*>[^<]*08/i,'Costs must be step 08');
assert.match(app,/FLOW_ORDER/,'app must know the workflow order');
assert.match(app,/flowBadge/,'navigation must update the sequence badge');

assert.match(css,/main\s*\{[^}]*max-width:/s,'main must use a controlled content width');
assert.match(css,/\.sec\.on\s*\{[^}]*display:grid/s,'active sections must use a structured grid flow');
assert.match(css,/\.kpis\s*\{[^}]*grid-template-columns:repeat\(4/s,'desktop KPIs must form a four-column grid');
assert.match(css,/\.fx-grid\s*\{[^}]*align-items:stretch/s,'FX grids must avoid uneven empty space');
assert.match(css,/\.diag-grid\s*\{[^}]*align-items:stretch/s,'diagnostic grids must avoid uneven empty space');
assert.match(css,/\.card\s*\{[^}]*min-width:0/s,'cards must be allowed to shrink cleanly');
assert.match(css,/@media\(max-width:740px\)/,'mobile layout must be defined');
assert.doesNotMatch(css,/\.cin\s*\{|\.future-cin\s*\{/,'premium layout must not override the approved entrance');

console.log('SETEMBRO X premium layout audit passed');
