import { jest } from '@jest/globals';
import { downloadAudio, convertToWav } from '../download';
import { splitAudio } from '../split';
import { transcribeAudio } from '../transcribe';
import { summarizeText } from '../summarize';
import { processPrompt } from '../prompt';

jest.mock('../download');
jest.mock('../split');
jest.mock('../transcribe');
jest.mock('../summarize');
jest.mock('../prompt');

describe('index.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should download audio from YouTube and process it', async () => {
    const mockDownloadAudio = downloadAudio as jest.MockedFunction<
      typeof downloadAudio
    >;
    const mockConvertToWav = convertToWav as jest.MockedFunction<
      typeof convertToWav
    >;
    const mockSplitAudio = splitAudio as jest.MockedFunction<typeof splitAudio>;
    const mockTranscribeAudio = transcribeAudio as jest.MockedFunction<
      typeof transcribeAudio
    >;
    const mockSummarizeText = summarizeText as jest.MockedFunction<
      typeof summarizeText
    >;
    const mockProcessPrompt = processPrompt as jest.MockedFunction<
      typeof processPrompt
    >;

    mockDownloadAudio.mockResolvedValue('audio.mp3');
    mockConvertToWav.mockResolvedValue('audio.wav');
    mockSplitAudio.mockResolvedValue(['chunk1.wav', 'chunk2.wav']);
    mockTranscribeAudio.mockResolvedValue('transcription');
    mockSummarizeText.mockResolvedValue('summary');
    mockProcessPrompt.mockResolvedValue('result');

    process.argv = [
      'node',
      'index.ts',
      '--youtube',
      'http://youtube.com/video',
      '--language',
      'en',
      '--summarize',
    ];

    const { main } = await import('../index');

    await main();

    expect(mockDownloadAudio).toHaveBeenCalledWith(
      'http://youtube.com/video',
      expect.any(String)
    );
    expect(mockConvertToWav).toHaveBeenCalledWith(
      'audio.mp3',
      expect.any(String)
    );
    expect(mockSplitAudio).toHaveBeenCalledWith(
      'audio.wav',
      expect.any(String)
    );
    expect(mockTranscribeAudio).toHaveBeenCalledWith('chunk1.wav', 'en');
    expect(mockTranscribeAudio).toHaveBeenCalledWith('chunk2.wav', 'en');
    expect(mockSummarizeText).toHaveBeenCalledWith(
      'transcription,transcription',
      'en'
    );
  });

  it('should process audio file and send custom prompt', async () => {
    const mockConvertToWav = convertToWav as jest.MockedFunction<
      typeof convertToWav
    >;
    const mockSplitAudio = splitAudio as jest.MockedFunction<typeof splitAudio>;
    const mockTranscribeAudio = transcribeAudio as jest.MockedFunction<
      typeof transcribeAudio
    >;
    const mockProcessPrompt = processPrompt as jest.MockedFunction<
      typeof processPrompt
    >;

    mockConvertToWav.mockResolvedValue('audio.wav');
    mockSplitAudio.mockResolvedValue(['chunk1.wav']);
    mockTranscribeAudio.mockResolvedValue('transcription');
    mockProcessPrompt.mockResolvedValue('result');

    process.argv = [
      'node',
      'index.ts',
      '--audio',
      'audio.mp3',
      '--language',
      'en',
      '--prompt',
      'custom prompt',
    ];

    const { main } = await import('../index');

    await main();

    expect(mockConvertToWav).toHaveBeenCalledWith(
      'audio.mp3',
      expect.any(String)
    );
    expect(mockSplitAudio).toHaveBeenCalledWith(
      'audio.wav',
      expect.any(String)
    );
    expect(mockTranscribeAudio).toHaveBeenCalledWith('chunk1.wav', 'en');
    expect(mockProcessPrompt).toHaveBeenCalledWith(
      'transcription',
      'custom prompt'
    );
  });
});
