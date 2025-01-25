import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';

export async function splitAudio(
  inputPath: string,
  outputDir: string,
  chunkDuration: number = 300
): Promise<string[]> {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    const fileBaseName = path.basename(inputPath, path.extname(inputPath));
    const outputPattern = path.join(outputDir, `${fileBaseName}_%03d.wav`);

    ffmpeg(inputPath)
      .outputOptions([
        '-f',
        'segment', // enable file segmentation
        `-segment_time ${chunkDuration}`, // set the duration of each segment
        '-reset_timestamps 1', // reset timestamps for each segment
      ])
      .output(outputPattern)
      .on('end', () => {
        // collect all generated chunk files
        const files = fs
          .readdirSync(outputDir)
          .filter((file) => file.startsWith(`${fileBaseName}_`));
        const chunkPaths = files.map((file) => path.join(outputDir, file));
        resolve(chunkPaths);
      })
      .on('error', (err) => reject(err))
      .run();
  });
}
