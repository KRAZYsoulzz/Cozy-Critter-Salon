// ============================================================================
// Cozy Critter Salon & Spa - Voice Pack Generator (ElevenLabs + Neural TTS)
// Generates warm, natural MP3 voice files for every line in /audio/voice/lines.json
// ============================================================================
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const API_KEY = process.env.ELEVENLABS_API_KEY || process.argv[2] || '';
const TARGET_DIR = process.argv[3] || path.resolve('C:/Users/gagee/Downloads/Lilah Games/audio/voice');
const LINES_PATH = path.join(TARGET_DIR, 'lines.json');
const DEFAULT_VOICE_ID = 'cgSgspJ2msm6clMCkdW9'; // Jessica

async function testElevenLabsKey(key) {
  if (!key || !key.startsWith('sk_')) return false;
  try {
    const res = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: { 'xi-api-key': key }
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function synthesizeElevenLabs(voiceId, text, outPath) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_64`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg'
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_turbo_v2_5',
      voice_settings: {
        stability: 0.48,
        similarity_boost: 0.78,
        style: 0.35,
        use_speaker_boost: true
      }
    })
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(outPath, buf);
  return buf.length;
}

async function generateWithNeuralTTS(entries) {
  const require = createRequire('C:/Users/gagee/.gemini/antigravity/brain/3abf2b96-e04a-4729-bc4b-51690ab7d8a5/scratch/shots/package.json');
  const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');

  const queue = [...entries];
  let generated = 0;
  let skipped = 0;

  async function worker(workerId) {
    const tts = new MsEdgeTTS();
    await tts.setMetadata('en-US-AnaNeural', OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    while (queue.length > 0) {
      const [id, text] = queue.shift();
      const outPath = path.join(TARGET_DIR, `${id}.mp3`);
      if (fs.existsSync(outPath) && fs.statSync(outPath).size > 500) {
        skipped++;
        continue;
      }
      try {
        const { audioStream } = tts.toStream(text, { rate: '+2%', pitch: '+2Hz' });
        const chunks = [];
        await new Promise((resolve, reject) => {
          audioStream.on('data', d => chunks.push(d));
          audioStream.on('end', resolve);
          audioStream.on('close', resolve);
          audioStream.on('error', reject);
        });
        const buf = Buffer.concat(chunks);
        if (buf.length > 200) {
          fs.writeFileSync(outPath, buf);
          generated++;
        }
      } catch (e) {
        console.error(`[Worker ${workerId}] Failed ${id}:`, e.message);
      }
    }
    try { tts.close(); } catch { /* ignore */ }
  }

  await Promise.all([worker(1), worker(2), worker(3), worker(4), worker(5), worker(6)]);
  console.log(`Neural TTS complete! Generated: ${generated}, Skipped: ${skipped}`);
}

async function main() {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
  // Remove temp test file if present
  const tempFile = path.join(TARGET_DIR, 'audio.mp3');
  if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);

  const manifest = JSON.parse(fs.readFileSync(LINES_PATH, 'utf8'));
  const entries = Object.entries(manifest.lines || {});
  console.log(`Processing ${entries.length} voice lines...`);

  const hasValidElevenLabs = await testElevenLabsKey(API_KEY);
  if (hasValidElevenLabs) {
    console.log('Using ElevenLabs API (sk_ key verified)...');
    let generated = 0;
    for (const [id, text] of entries) {
      const outPath = path.join(TARGET_DIR, `${id}.mp3`);
      if (fs.existsSync(outPath) && fs.statSync(outPath).size > 500) continue;
      await synthesizeElevenLabs(DEFAULT_VOICE_ID, text, outPath);
      generated++;
    }
    console.log(`ElevenLabs generation complete: ${generated} files.`);
  } else {
    console.log('Note: Provided key does not start with sk_ (it is an ElevenLabs Key ID). Generating natural neural MP3s with en-US-AnaNeural...');
    await generateWithNeuralTTS(entries);
  }
  process.exit(0);
}

main();
