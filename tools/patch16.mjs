import fs from 'node:fs';
const f='src/activities/yard.js'; let s = fs.readFileSync(f,'utf8');
const rep = (a, b) => { if (!s.includes(a)) { console.log('MISS', a.slice(0,80)); return; } s = s.replace(a, b); };
rep("this.minigameTimer -= dt;\n    const elapsedPct = Math.min(100, Math.round(((25 - this.minigameTimer) / 25) * 100));", "// Untimed: no clock, no fail state - the round ends when enough treats are caught.\n    const elapsedPct = Math.min(100, Math.round((this.minigameScore / 8) * 100));");
rep("if (this.minigameTimer <= 0) {\n      this.completeMinigame();", "if (this.minigameScore >= 8) {\n      this.completeMinigame();");
rep("const txt = `Treats: ${this.minigameScore}   ${t}s`;", "const txt = `Treats: ${Math.min(this.minigameScore, 8)} / 8  \u2665`;");
fs.writeFileSync(f, s);
