import fs from 'fs';
const rep=(f,a,b,all=false)=>{let t=fs.readFileSync(f,'utf8'); if(!t.includes(a)){console.log('MISS',f,a.slice(0,60));return;} t=all?t.split(a).join(b):t.replace(a,b); fs.writeFileSync(f,t); console.log('ok',a.slice(0,40));};
const P='src/pets.js';
rep(P,'RoundedBoxGeometry(0.82, 0.76, 1.14, 5, 0.3)','RoundedBoxGeometry(0.82, 0.76, 1.14, 8, 0.37)');
rep(P,'RoundedBoxGeometry(0.84, 0.74, 0.78, 5, 0.25)','RoundedBoxGeometry(0.84, 0.74, 0.78, 8, 0.34)');
rep(P,'RoundedBoxGeometry(0.4, 0.28, 0.3, 5, 0.12)','RoundedBoxGeometry(0.4, 0.28, 0.3, 6, 0.13)');
rep(P,'RoundedBoxGeometry(0.68, 0.6, 1.0, 5, 0.24)','RoundedBoxGeometry(0.68, 0.6, 1.0, 8, 0.29)');
rep(P,'RoundedBoxGeometry(1.0, 0.6, 0.74, 5, 0.26)','RoundedBoxGeometry(1.0, 0.6, 0.74, 8, 0.29)');
rep(P,'RoundedBoxGeometry(0.5, 0.5, 0.86, 5, 0.2)','RoundedBoxGeometry(0.5, 0.5, 0.86, 8, 0.245)');
// dik-dik eyes
rep(P,'eyeRadius: 0.097,','eyeRadius: 0.078, noLash: true,');
rep(P,'new THREE.SphereGeometry(0.115, 14, 12), creamMat);\n      ring.scale.set(1.0, 1.05, 0.4);','new THREE.SphereGeometry(0.14, 16, 12), creamMat);\n      ring.scale.set(1.0, 1.05, 0.4);');
// lashes optional
rep(P,'for (let k = 0; k < 3; k++) { const lash','for (let k = 0; k < (cfg.noLash ? 0 : 3); k++) { const lash');
rep(P,'new THREE.TorusGeometry(R * 0.98, R * 0.17, 6, 16, Math.PI), new THREE.MeshBasicMaterial({ color: 0x1e1424 }));','new THREE.TorusGeometry(R * 0.98, R * (cfg.noLash ? 0.07 : 0.17), 6, 16, Math.PI), new THREE.MeshBasicMaterial({ color: 0x1e1424 }));');
// happy arc
rep(P,"      this.headGroup.add(eg);\n      if (side === -1) {","      const arc = new THREE.Mesh(new THREE.TorusGeometry(R * 0.78, R * 0.2, 8, 20, Math.PI), new THREE.MeshBasicMaterial({ color: 0x1e1424 }));\n      arc.position.z = R * 0.3; arc.visible = false; eg.add(arc);\n      eg.userData.arc = arc; eg.userData.heart = heart;\n      (this.eyeGroups = this.eyeGroups || []).push(eg);\n      this.headGroup.add(eg);\n      if (side === -1) {");
rep(P,"    this.mouthClosed.position.set(0, cfg.mouthY, cfg.mouthZ);\n    this.headGroup.add(this.mouthClosed);","    this.mouthClosed.position.set(0, cfg.mouthY, cfg.mouthZ);\n    this.headGroup.add(this.mouthClosed);\n    this.mouthBaseY = cfg.mouthY;\n    this.tear = new THREE.Mesh(new THREE.SphereGeometry(R * 0.28, 8, 8), new THREE.MeshBasicMaterial({ color: 0x7fd0ff }));\n    this.tear.scale.set(0.8, 1.3, 0.6);\n    this.tear.position.set(-cfg.eyeX * 1.05, cfg.eyeY - R * 1.35, cfg.eyeZ + R * 0.25);\n    this.tear.visible = false;\n    this.headGroup.add(this.tear);");
// update logic
rep(P,"    const blink = (this.animTime % 4.1) > 3.95;\n    const eyeScaleY = blink ? 0.12 : Math.max(0.22, 1.0 - this.squintAmount * 0.68);",
"    if (this.happyTimer > 0) this.happyTimer -= dt;\n    const happy = this.happyTimer > 0;\n    const sad = !!this.sad && !happy;\n    if (this.eyeGroups) {\n      for (const eg of this.eyeGroups) {\n        const hv = eg.userData.heart && eg.userData.heart.visible;\n        for (const c of eg.children) {\n          if (c === eg.userData.heart) continue;\n          if (c === eg.userData.arc) c.visible = happy && !hv;\n          else c.visible = !(happy && !hv);\n        }\n      }\n    }\n    if (this.mouthClosed) {\n      const ms = happy ? 1.65 : (sad ? 0.85 : 1);\n      this.mouthClosed.scale.set(ms, happy ? 1.5 : 1, 1);\n      this.mouthClosed.rotation.x = sad ? 0 : Math.PI;\n      this.mouthClosed.position.y = this.mouthBaseY + (sad ? -0.035 : 0);\n    }\n    if (this.tear) { this.tear.visible = sad; if (sad) this.tear.position.y -= 0; }\n    const blink = (this.animTime % 4.1) > 3.95;\n    const eyeScaleY = blink ? 0.12 : Math.max(0.22, (sad ? 0.82 : 1.0) - this.squintAmount * 0.68);");
// public API
rep(P,"  buildEyesAndMouth(cfg) {","  setHappy(sec = 1.6) { this.happyTimer = Math.max(this.happyTimer || 0, sec); }\n\n  buildEyesAndMouth(cfg) {");
// gfx wobble
rep('src/gfx.js',"mv.xyz += n * uThick * (1.0 + 0.05 * -mv.z);","float wob = 1.0 + 0.32 * sin(position.x * 43.0 + position.y * 31.0 + position.z * 11.0) * sin(position.z * 37.0 - position.y * 19.0 + position.x * 13.0);\n        mv.xyz += n * uThick * wob * (1.0 + 0.05 * -mv.z);");
// closer camera
rep('src/main.js',"this.camTargetPos.set(st.petPos.x, st.petPos.y + 1.25, st.petPos.z + 3.1);\n    this.camTargetLook.set(st.petPos.x, st.petPos.y + 0.6, st.petPos.z);","this.camTargetPos.set(st.petPos.x, st.petPos.y + 1.1, st.petPos.z + 2.6);\n    this.camTargetLook.set(st.petPos.x, st.petPos.y + 0.62, st.petPos.z);");
