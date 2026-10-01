import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=(p)=>fs.readFileSync(p,'utf8');
const html=read('index.html');
const auth=read('auth.js');
const authCss=read('auth.css');
const ceoHtml=read('ceo.html');
const ceo=read('ceo.js');
const ceoCss=read('ceo.css');
const pendingHtml=read('pending.html');
const pendingJs=read('pending.js');
const sw=read('sw.js');
const xia=read('xia-performance.js');

for(const [name,src] of [['auth.js',auth],['ceo.js',ceo],['pending.js',pendingJs],['sw.js',sw],['xia-performance.js',xia]]){
  assert.doesNotThrow(()=>new Function(src),name+' must be valid JavaScript');
}

assert.match(html,/id=["']authGate["']/,'RAIO X must have a login gate');
assert.match(html,/id=["']authEmail["']/,'login must request email');
assert.match(html,/id=["']authPassword["']/,'login must request password');
assert.match(html,/id=["']authModeSignup["']/,'login must offer simple access creation');
assert.match(html,/id=["']raioxAppShell["'][^>]*hidden/,'main app must stay hidden until authenticated');
assert.match(html,/id=["']ceoPortalLink["'][^>]*hidden/,'CEO portal link must start hidden');
assert.match(auth,/grant_type=password/,'login must use email/password auth');
assert.match(auth,/grant_type=refresh_token/,'persistent session must refresh safely');
assert.match(auth,/localStorage\.setItem\(STORE/,'session must persist locally');
assert.match(auth,/raiox_app_users/,'login must check access allowlist');
assert.match(auth,/approval_status/,'login must enforce CEO approval');
assert.match(auth,/pending\.html/,'pending users must be routed to approval status page');
assert.match(auth,/raiox-request-access-v2/,'new access requests must use the safe v2 endpoint');
assert.match(auth,/const canManage=\[['"]ceo['"],['"]manager['"]\]\.includes\(ctx\.access\.role\)/,'management portal visibility must be limited to CEO or manager roles');
assert.doesNotMatch(auth,/sms|phone|otp/i,'main login must not depend on SMS/phone/OTP');

assert.match(pendingHtml,/Aguardando aprovação/i,'pending status page must exist');
assert.match(pendingHtml,/id=["']checkApproval["']/,'pending page must let user re-check approval');
assert.match(pendingJs,/approval_status/,'pending page must verify approval status');
assert.match(pendingJs,/location\.href=['"]\.\//,'approved user must be able to return to RAIO X');

assert.match(ceoHtml,/Portal (CEO|de Gestão)/i,'private management page must exist');
assert.match(ceoHtml,/Olho no Olho/i,'CEO portal must include one-on-one');
assert.match(ceoHtml,/data-tab=["']xia["']/,'CEO portal must include XIA');
assert.match(ceoHtml,/data-tab=["']agenda["']/,'CEO portal must include intelligent agenda');
assert.match(ceoHtml,/data-tab=["']approvals["']/,'Approvals must be in CEO sidebar');
assert.match(ceoHtml,/MÊS DE REFERÊNCIA/i,'CEO portal must support monthly reference');
assert.match(ceoHtml,/personCnpj/,'PJ registration must include CNPJ');
assert.match(ceoHtml,/personStartTime/,'PJ registration must include individual schedule');
assert.match(ceoHtml,/personGoalCouples/,'professional must support monthly volume goal');
assert.match(ceoHtml,/personGoalSales/,'professional must support monthly sales goal');
assert.match(ceoHtml,/personGoalVgv/,'professional must support monthly VGV goal');
assert.match(ceoHtml,/Distratados/i,'CEO portal must preserve a terminated-professionals area');

assert.match(ceo,/ceo_admins/,'CEO portal must validate admin authorization');
assert.match(ceo,/ceo_daily_presence/,'CEO portal must store operational presence');
assert.match(ceo,/status:row\.querySelector\(['"]\.presence-status['"]\)\.value\|\|['"]present['"]/,'day save must default each professional to present');
assert.match(ceo,/function markAllPresent/,'CEO can mark everyone present');
assert.match(ceo,/async function saveDay/,'CEO can save the whole day in one action');
assert.match(ceo,/ceo_team_assignments/,'CEO portal must store team assignments');
assert.match(ceo,/default_start_time/,'person can have an individual start time');
assert.match(ceo,/ceo_person_goals/,'CEO portal must store monthly goals per professional');
assert.match(ceo,/ceo_agenda/,'CEO portal must store intelligent agenda events');
assert.match(ceo,/ceo_one_on_one/,'CEO portal must store one-on-one conversations');
assert.match(ceo,/ceo_tasks/,'CEO portal must store follow-up tasks');
assert.match(ceo,/approval_status/,'CEO portal must manage access approval states');
assert.match(ceo,/reset_password/,'CEO portal must support password changes');
assert.match(ceo,/Distratados|status:'ended'/,'CEO portal must support contract termination history');
assert.match(ceo,/data-delete-person|deletePerson/,'CEO portal must allow deleting erroneous/non-team records');
assert.match(ceo,/XIA_PERFORMANCE/,'XIA must consume the performance snapshot');
assert.match(ceo,/buildXiaPrompt/,'XIA must generate a complete prompt for external AI analysis');
assert.match(ceo,/Não invente|nao invente/i,'XIA must distinguish evidence from unsupported inference');

assert.match(ceoCss,/\.approval-card/,'Approvals must have dedicated card styling');
assert.match(ceoCss,/\.xia-/,'XIA must have dedicated styling');
assert.match(ceoCss,/\.agenda-/,'Agenda must have dedicated styling');
assert.match(authCss,/\.auth-mode-switch/,'login/create access switch must be styled');
assert.ok(authCss.length>1000,'login must have dedicated visual styling');

assert.match(sw,/xia-performance\.js/,'PWA cache must include XIA data shell');
assert.match(sw,/pending\.html/,'PWA cache must include pending approval page');
assert.match(sw,/ALWAYS_NETWORK_FIRST/,'auth and CEO assets must prioritize fresh network versions');
assert.match(sw,/const CACHE = ['"]raiox-v\d+[-\w]*['"]/,'PWA cache must use a versioned RAIO X cache');

console.log('RAIO X auth + CEO audit passed');

assert.match(html,/id=["']entryCeoPortal["'][^>]*hidden/,'CEO portal CTA must exist on the operation entry and start hidden');
assert.match(auth,/entryCeoPortal/,'auth must reveal the CEO entry CTA only for CEO sessions');

assert.match(auth,/const ctx=await signIn\(email,password\);[\s\S]*?reveal\(ctx\);[\s\S]*?return;/,'approved preauthorized signup must enter RAIO X immediately');
