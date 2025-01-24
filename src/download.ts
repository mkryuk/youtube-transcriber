import youtubedl from 'youtube-dl-exec';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';

export async function downloadAudio(
  videoUrl: string,
  outputDir: string
): Promise<string> {
  const audioPath = path.join(outputDir, 'audio.opus');

  return new Promise((resolve, reject) => {
    youtubedl(videoUrl, {
      extractAudio: true,
      audioFormat: 'opus',
      output: audioPath,
    })
      .then(() => resolve(audioPath))
      .catch(reject);
  });
}

export async function convertToWav(
  inputPath: string,
  outputDir: string
): Promise<string> {
  const outputPath = path.join(outputDir, 'audio.wav');

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .toFormat('wav')
      .audioChannels(1)
      .audioFrequency(16000)
      .save(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', reject);
  });
}
