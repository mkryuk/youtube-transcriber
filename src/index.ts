import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { splitAudio } from './split';
import { downloadAudio, convertToWav } from './download';
import { transcribeAudio } from './transcribe';
import { summarizeText } from './summarize';

dotenv.config();

async function main() {
  // define and parse command-line arguments
  const argv = yargs(hideBin(process.argv))
    .option('youtube', {
      alias: 'y',
      type: 'string',
      describe: 'YouTube video URL',
      conflicts: 'audio',
    })
    .option('audio', {
      alias: 'a',
      type: 'string',
      describe: 'Path to an audio file',
      conflicts: 'youtube',
    })
    .option('language', {
      alias: 'l',
      type: 'string',
      describe: 'Language for transcription',
      demandOption: true,
    })
    .option('summarize', {
      alias: 'S',
      type: 'boolean',
      describe: 'Summarize the transcription',
      default: false,
    })
    .help().argv as {
    youtube?: string;
    audio?: string;
    language: string;
    summarize: boolean;
  }; // explicit type cast for argv

  const { youtube: videoUrl, audio: audioFilePath, language, summarize } = argv;
  const outputDir = path.resolve(__dirname, '../output');

  // ensure the output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    let audioPath = audioFilePath;

    if (videoUrl) {
      console.log('Downloading audio from YouTube...');
      audioPath = await downloadAudio(videoUrl, outputDir);
    }

    if (!audioPath) {
      throw new Error(
        'You must specify either a YouTube URL (-y) or an audio file path (-a).'
      );
    }

    console.log('Converting audio to WAV...');
    const wavPath = await convertToWav(audioPath, outputDir);

    console.log('Checking file size and splitting if necessary...');
    const chunkPaths = await splitAudio(wavPath, outputDir);

    console.log('Processing chunks with Whisper...');
    const transcriptions: string[] = [];
    for (const chunkPath of chunkPaths) {
      const transcription = await transcribeAudio(chunkPath, language);
      transcriptions.push(transcription);
    }

    const fullTranscription = transcriptions.join();

    // save the transcription to a file
    const transcriptionFile = path.join(outputDir, 'transcription.txt');
    fs.writeFileSync(transcriptionFile, fullTranscription, 'utf8');
    console.log(`Transcription saved to ${transcriptionFile}`);

    if (summarize) {
      console.log('Summarizing transcription...');
      const summary = await summarizeText(fullTranscription, language);

      // save the summary to a file
      const summaryFile = path.join(outputDir, 'summary.txt');
      fs.writeFileSync(summaryFile, summary, 'utf8');
      console.log(`Summary saved to ${summaryFile}`);
    }
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
  }
}

main();
