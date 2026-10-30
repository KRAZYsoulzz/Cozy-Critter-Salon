import fs from 'node:fs'; import path from 'node:path';
const root='C:/Users/gagee/Downloads/Lilah Games';
const dir=root+'/audio/voice'; const arch=root+'/_archive/v2-edge-voices';
fs.mkdirSync(arch,{recursive:true});
const m=JSON.parse(fs.readFileSync(root+'/tools/voice_manifest.json','utf8'));
let ok=0,fail=[];
const ids=Object.keys(m);
async function one(id){
  const r=await fetch(m[id].url); if(!r.ok) throw new Error('HTTP '+r.status);
  const buf=Buffer.from(await r.arrayBuffer()); if(buf.length<2000) throw new Error('tiny');
  const f=dir+'/'+id+'.mp3';
  if(fs.existsSync(f)&&!fs.existsSync(arch+'/'+id+'.mp3')) fs.copyFileSync(f,arch+'/'+id+'.mp3');
  fs.writeFileSync(f,buf); ok++;
}
const q=[...ids];
await Promise.all(Array.from({length:6},async()=>{while(q.length){const id=q.shift();try{await one(id)}catch(e){fail.push(id+':'+e.message)}}}));
console.log('ok',ok,'fail',fail);
