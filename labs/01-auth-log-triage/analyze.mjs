import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const rows=readFileSync(new URL('./events.json',import.meta.url),'utf8');
const events=JSON.parse(rows);
const windowMs=5*60*1000;
const failures=new Map();
const alerts=[];
for (const event of [...events].sort((a,b)=>Date.parse(a.time)-Date.parse(b.time))) {
 const key=event.source+'|'+event.user;
 const now=Date.parse(event.time);
 if (!Number.isFinite(now)) throw new Error('Invalid event timestamp');
 const recent=(failures.get(key)||[]).filter(t=>now-t<=windowMs);
 if(event.result==='failure') recent.push(now);
 if(event.result==='success' && recent.length>=5) alerts.push({time:event.time,user:event.user,source:event.source,failures:recent.length,reason:'Success after repeated failures within five minutes'});
 failures.set(key,recent);
}
assert.equal(alerts.length,1,'Expected one synthetic alert');
assert.equal(alerts[0].user,'lab-user');
assert.equal(alerts[0].failures,5);
console.log(JSON.stringify({dataset:'synthetic',events:events.length,alerts,checks:'passed'},null,2));
