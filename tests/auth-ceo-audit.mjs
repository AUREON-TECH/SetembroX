import assert from 'node:assert/strict';
import fs from 'node:fs';

const html=fs.readFileSync('index.html','utf8');
const auth=fs.readFileSync('auth.js','utf8');
const authCss=fs.readFileSync('auth.css','utf8');
const ceoHtml=fs.readFileSync('ceo.html','utf8');
const ceo=fs.readFileSync('ceo.js','utf8');
const sw=fs.readFileSync('sw.js','utf8');

assert.doesNotThrow(()=>new Function(auth),'auth.js must be valid JavaScript');
assert.doesNotThrow(()=>new Function(ceo),'ceo.js must be valid JavaScript');

assert.match(html,/id=["']authGate["']/,'RAIO X must have a login gate');
assert.match(html,/id=["']authEmail["']/,'login must request email');
assert.match(html,/id=["']authPassword["']/,'login must request password');
assert.match(html,/id=["']raioxAppShell["'][^>]*hidden/,'main app must stay hidden until authenticated');
assert.match(html,/id=["']raioxLogout["']/,'main app must offer logout');
assert.match(html,/id=["']ceoPortalLink["'][^>]*hidden/,'CEO portal link must start hidden');
assert.match(auth,/grant_type=password/,'login must use email/password auth');
assert.match(auth,/localStorage\.setItem\(STORE/,'session must persist locally');
assert.match(auth,/grant_type=refresh_token/,'persistent session must refresh safely');
assert.match(auth,/raiox_app_users/,'login must check the RAIO X access allowlist');
assert.match(auth,/ctx\.access\.role!==['"]ceo['"]/,'CEO portal link must only be shown to CEO role');
assert.doesNotMatch(auth,/sms|phone|otp/i,'main login must not rely on SMS/phone/OTP');

assert.match(ceoHtml,/Portal CEO/i,'private CEO page must exist');
assert.match(ceoHtml,/Olho no Olho/i,'CEO portal must include Olho no Olho');
assert.match(ceoHtml,/Equipes e horários/i,'CEO portal must include team schedule management');
assert.match(ceoHtml,/MÊS DE REFERÊNCIA/i,'CEO portal must support month reference');
assert.match(ceo,/ceo_admins/,'CEO portal must validate admin authorization in the database');
assert.match(ceo,/ceo_daily_presence/,'CEO portal must store operational presence');
assert.match(ceo,/ceo_team_assignments/,'CEO portal must store team assignments');
assert.match(ceo,/ceo_one_on_one/,'CEO portal must store one-on-one conversations');
assert.match(ceo,/ceo_tasks/,'CEO portal must store follow-up tasks');
assert.match(ceo,/raiox-create-user/,'CEO portal must create email/password access for professionals');
assert.match(ceo,/start_time/,'teams must have configurable start times');
assert.match(sw,/\.\/auth\.js/,'PWA cache must include auth shell');
assert.match(sw,/\.\/ceo\.js/,'PWA cache must include CEO portal shell');
assert.ok(authCss.length>1000,'login must have dedicated visual styling');

console.log('RAIO X auth + CEO audit passed');
