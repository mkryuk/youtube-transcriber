import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

export async function transcribeAudio(
  audioPath: string,
  language: string
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;

  const formData = new FormData();
  formData.append('file', fs.createReadStream(audioPath));
  formData.append('model', 'whisper-1');
  formData.append('language', language);

  const response = await axios.post(
    'https://api.openai.com/v1/audio/transcriptions',
    formData,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        ...formData.getHeaders(),
      },
    }
  );

  return response.data.text;
}
