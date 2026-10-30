export default async (page,h)=>{
 await h.tap('#btn-play-game'); await h.sleep(1500); await h.tap('#btn-avatar-done'); await h.sleep(900); await h.tap('#btn-save-pet-name'); await h.sleep(2500);
 const pos=()=>h.ev(()=>{const p=window.gameApp.avatar.root.position;return [+p.x.toFixed(2),+p.z.toFixed(2)]});
 console.log('start',await pos());
 await page.mouse.move(700,300); await page.mouse.down(); await page.mouse.move(720,300,{steps:4}); await h.sleep(1200); console.log('held right',await pos());
 await page.mouse.move(200,300,{steps:6}); await h.sleep(1500); console.log('held left',await pos());
 await page.mouse.up(); await h.sleep(300); const a=await pos(); await h.sleep(800); console.log('released',a,await pos());
};
