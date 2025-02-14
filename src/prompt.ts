import axios from 'axios';

export async function processPrompt(
  text: string,
  prompt: string
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  console.log('THE PROMPT:', prompt);

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: `${prompt}\n\n${text}`,
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
