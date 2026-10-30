import fs from 'node:fs';
let s = fs.readFileSync('src/voice.js','utf8');
const a = s.indexOf('  initSpeechFallback() {'); const b = s.indexOf('  getSettings() {');
s = s.slice(0,a) + '  initSpeechFallback() {\n    // Intentionally empty: the game NEVER uses the OS robot voice. Every spoken line is a pre-rendered ElevenLabs "Clara" clip.\n  }\n\n' + s.slice(b);
s = s.replace(/    if \(typeof window !== 'undefined' && 'speechSynthesis' in window\) \{\n      try \{ window\.speechSynthesis\.cancel\(\); \} catch \{ \/\* ignore \*\/ \}\n    \}\n/, '');
// fallback block in speak
s = s.replace("      } catch {\n        // Fallback to speechSynthesis if MP3 is missing or blocked\n        this.soundEngine?.setVoiceDucking(false);\n      }\n    }\n\n    if (text) {\n      this.speakFallback(text, this.currentWordSpans);\n    }\n  }", "      } catch (err) {\n        // MP3 missing or autoplay-blocked: stay silent (never the OS voice). Log missing ids so they can be generated.\n        this.soundEngine?.setVoiceDucking(false);\n        if (err && err.name === 'NotSupportedError') console.warn('VoiceEngine: missing voice clip for id', id);\n      }\n    } else if (text) {\n      console.warn('VoiceEngine: line without a clip id (silent):', text.slice(0, 50));\n    }\n  }");
const c = s.indexOf('  speakFallback('); const d = s.indexOf('  speakSingleWord(');
s = s.slice(0,c) + s.slice(d);
const e = s.indexOf('    if (typeof window !== \'undefined\' && \'speechSynthesis\' in window) {\n      const settings');
const f = s.lastIndexOf('  }\n}');
s = s.slice(0,e) + '    // Tap-a-word: pop + highlight only (no per-word clips, no OS TTS).\n' + s.slice(f);
s = s.replace('highlighting, tap-any-word pronunciation, and speechSynthesis fallback.', 'highlighting. No speechSynthesis anywhere (ElevenLabs clips only).');
fs.writeFileSync('src/voice.js', s);
