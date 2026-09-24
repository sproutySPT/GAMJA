const V='everything-v2',SC=self.registration.scope,ASSETS=['manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all([SC,...ASSETS].map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
async function nav(r){const c=await caches.open(V);try{const res=await Promise.race([fetch(r),new Promise((_,j)=>setTimeout(j,3000))]);if(res.ok)c.put(SC,res.clone());return res}catch(_){return(await c.match(SC))||fetch(r)}}
async function swr(r){const c=await caches.open(V),h=await c.match(r);const n=fetch(r).then(res=>{if(res.ok||res.type==='opaque')c.put(r,res.clone());return res}).catch(()=>h);return h||n}
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
if(r.mode==='navigate'&&u.origin===location.origin){e.respondWith(nav(r));return}
if(u.origin===location.origin||u.hostname==='cdn.jsdelivr.net'||u.hostname==='fonts.gstatic.com')e.respondWith(swr(r))});
