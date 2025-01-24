import { downloadAudio, convertToWav } from '../download';
import youtubedl from 'youtube-dl-exec';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';

jest.mock('youtube-dl-exec'); // Mock youtube-dl-exec
jest.mock('fluent-ffmpeg'); // Mock fluent-ffmpeg

describe('Download and Conversion Functions', () => {
  const videoUrl = 'https://youtu.be/example';
  const outputDir = path.resolve(__dirname, '../../output');
  const mockedAudioPath = path.join(outputDir, 'audio.opus');
  const mockedWavPath = path.join(outputDir, 'audio.wav');

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  describe('downloadAudio', () => {
    it('should resolve with the correct audio path when download succeeds', async () => {
      // Mock youtube-dl-exec to resolve successfully
      (youtubedl as unknown as jest.Mock).mockResolvedValueOnce(undefined);

      const result = await downloadAudio(videoUrl, outputDir);
      expect(result).toBe(mockedAudioPath);
      expect(youtubedl).toHaveBeenCalledWith(videoUrl, {
        extractAudio: true,
        audioFormat: 'opus',
        output: mockedAudioPath,
      });
    });

    it('should reject with an error when download fails', async () => {
      // Mock youtube-dl-exec to reject with an error
      (youtubedl as unknown as jest.Mock).mockRejectedValueOnce(
        new Error('Download failed')
      );

      await expect(downloadAudio(videoUrl, outputDir)).rejects.toThrow(
        'Download failed'
      );
    });
  });

  describe('convertToWav', () => {
    it('should resolve with the correct wav path when conversion succeeds', async () => {
      // Mock fluent-ffmpeg to simulate a successful conversion
      (ffmpeg as unknown as jest.Mock).mockImplementation(() => {
        const fakeFFmpeg: {
          toFormat: jest.MockedFunction<() => typeof fakeFFmpeg>;
          audioChannels: jest.MockedFunction<() => typeof fakeFFmpeg>;
          audioFrequency: jest.MockedFunction<() => typeof fakeFFmpeg>;
          save: jest.MockedFunction<() => typeof fakeFFmpeg>;
          on: jest.MockedFunction<
            (event: string, callback: () => void) => typeof fakeFFmpeg
          >;
          onEndCallback?: () => void;
          onErrorCallback?: (error: Error) => void;
        } = {
          toFormat: jest.fn().mockReturnThis(),
          audioChannels: jest.fn().mockReturnThis(),
          audioFrequency: jest.fn().mockReturnThis(),
          save: jest.fn().mockImplementation(() => {
            setTimeout(() => {
              if (fakeFFmpeg.onEndCallback) {
                fakeFFmpeg.onEndCallback();
              }
            }, 10);
            return fakeFFmpeg;
          }),
          on: jest.fn((event: string, callback: () => void) => {
            if (event === 'end') fakeFFmpeg.onEndCallback = callback;
            return fakeFFmpeg;
          }),
        } as {
          toFormat: jest.MockedFunction<() => typeof fakeFFmpeg>;
          audioChannels: jest.MockedFunction<() => typeof fakeFFmpeg>;
          audioFrequency: jest.MockedFunction<() => typeof fakeFFmpeg>;
          save: jest.MockedFunction<() => typeof fakeFFmpeg>;
          on: jest.MockedFunction<
            (event: string, callback: () => void) => typeof fakeFFmpeg
          >;
          onEndCallback?: () => void;
        };
        return fakeFFmpeg;
      });

      const result = await convertToWav(mockedAudioPath, outputDir);
      expect(result).toBe(mockedWavPath);
      expect(ffmpeg).toHaveBeenCalledWith(mockedAudioPath);
    });

    it('should reject with an error when conversion fails', async () => {
      // Mock fluent-ffmpeg to simulate a conversion error
      (ffmpeg as unknown as jest.Mock).mockImplementation(() => {
        const fakeFFmpeg: {
          toFormat: jest.MockedFunction<() => typeof fakeFFmpeg>;
          audioChannels: jest.MockedFunction<() => typeof fakeFFmpeg>;
          audioFrequency: jest.MockedFunction<() => typeof fakeFFmpeg>;
          save: jest.MockedFunction<() => typeof fakeFFmpeg>;
          on: jest.MockedFunction<
            (
              event: string,
              callback: (error?: Error) => void
            ) => typeof fakeFFmpeg
          >;
          onEndCallback?: () => void;
          onErrorCallback?: (error: Error) => void;
        } = {
          toFormat: jest.fn().mockReturnThis(),
          audioChannels: jest.fn().mockReturnThis(),
          audioFrequency: jest.fn().mockReturnThis(),
          save: jest.fn().mockImplementation(() => {
            setTimeout(() => {
              if (fakeFFmpeg.onErrorCallback) {
                fakeFFmpeg.onErrorCallback(new Error('Conversion failed'));
              }
            }, 10);
            return fakeFFmpeg;
          }),
          on: jest.fn((event: string, callback: (error?: Error) => void) => {
            if (event === 'error') fakeFFmpeg.onErrorCallback = callback;
            return fakeFFmpeg;
          }),
        };
        return fakeFFmpeg;
      });

      await expect(convertToWav(mockedAudioPath, outputDir)).rejects.toThrow(
        'Conversion failed'
      );
    });
  });
});
