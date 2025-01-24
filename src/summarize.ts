import axios from 'axios';

export async function summarizeText(
  text: string,
  language: string
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant that summarizes text.`,
        },
        {
          role: 'user',
          content: `Summarize the following text in ${language}: ${text}`,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.choices[0].message.content;
}
