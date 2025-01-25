import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { splitAudio } from './split';
import { downloadAudio, convertToWav } from './download';
import { transcribeAudio } from './transcribe';
import { summarizeText } from './summarize';

dotenv.config();

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: ts-node src/index.ts <YouTube URL> <Language Code>');
    process.exit(1);
  }

  const [videoUrl, language] = args;
  const outputDir = path.resolve(__dirname, '../output');

  // ensure the output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    console.log('Downloading audio from YouTube...');
    const audioPath = await downloadAudio(videoUrl, outputDir);

    console.log('Converting audio to WAV...');
    const wavPath = await convertToWav(audioPath, outputDir);

    console.log('Checking file size and splitting if necessary...');
    const chunkPaths = await splitAudio(wavPath, outputDir);

    console.log('Processing chunks with Whisper...');
    const transcriptions = [];
    for (const chunkPath of chunkPaths) {
      const transcription = await transcribeAudio(chunkPath, language);
      transcriptions.push(transcription);
    }

    const fullTranscription = transcriptions.join();

    // save transcription to a file
    const transcriptionFile = path.join(outputDir, 'transcription.txt');
    fs.writeFileSync(transcriptionFile, fullTranscription, 'utf8');
    console.log(`Transcription saved to ${transcriptionFile}`);

    // summarize the transcription
    console.log('Summarizing transcription...');
    const summary = await summarizeText(fullTranscription, language);

    // save summary to a file
    const summaryFile = path.join(outputDir, 'summary.txt');
    fs.writeFileSync(summaryFile, summary, 'utf8');
    console.log(`Summary saved to ${summaryFile}`);
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
  }
}

main();
