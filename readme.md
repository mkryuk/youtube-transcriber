# YouTube Transcriber and Summarizer

This project is a Node.js-based console application that:

1. Downloads audio from a YouTube video.
2. Transcribes the audio using OpenAI's Whisper API.
3. Summarizes the transcription using OpenAI's ChatGPT API.

The application is containerized using Docker for easy setup and deployment.

---

## Features

- Supports multiple languages for transcription and summarization.
- Allows input via YouTube video URL or local audio file.
- Outputs transcription and summary as separate files.
- Easy to run using Docker or locally on your system.

---

## Requirements

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Docker](https://www.docker.com/) (if running in a container)
- OpenAI API key for Whisper and ChatGPT.

---

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/mkryuk/youtube-transcriber.git
cd youtube-transcriber
```

### 2. Add Environment Variables

Create a .env file in the project root with your OpenAI API key:
OPENAI_API_KEY=your_openai_api_key

### 3. Install Dependencies

If running locally:

```bash
npm install
```

---

## Usage

### 1. Run Locally

You can run the application locally using the following options:

#### **Using YouTube URL:**

```bash
npx ts-node src/index.ts -y <YouTube URL> -l <Language Code> [-S]
```

#### **Using Local Audio File:**

```bash
npx ts-node src/index.ts -a <Audio File Path> -l <Language Code> [-S]
```

## Options:

- -p, --prompt - Custom prompt for OpenAI.
- -y, --youtube - The YouTube video URL.
- -a, --audio - Path to the local audio file.
- -l, --language - Language code for transcription (e.g., en for English, uk for Ukrainian).
- -S, --summarize - Summarize the transcription (optional).

## Example:

Transcribe and summarize a YouTube video:

```
npx ts-node src/index.ts -y "https://youtu.be/url" -l "en" -S
```

Transcribe a local audio file without summarizing:

```
npx ts-node src/index.ts -a "./path/to/audio.wav" -l "en"
```

## Build the Docker Image

```
docker-compose build
```

## Run the Application

```
docker-compose run youtube-transcriber -y <YouTube URL> -l <Language Code> [-S]
```

## Output

The application saves the following files in the output directory:

- transcription.txt: The full transcription of the audio.
- summary.txt: The summarized version of the transcription.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
