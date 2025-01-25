# YouTube Transcriber and Summarizer

This project is a Node.js-based console application that:

1. Downloads audio from a YouTube video.
2. Transcribes the audio using OpenAI's Whisper API.
3. Summarizes the transcription using OpenAI's ChatGPT API.

The application is containerized using Docker for easy setup and deployment.

---

## Features

- Supports multiple languages for transcription and summarization.
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

## Usage

### 1. Run Locally

To run the application locally, use:

```bash
npx ts-node src/index.ts <YouTube URL> <Language Code>
```

### 2. Run with Docker

Build the Docker Image

```bash
docker-compose build
```

Run the Application

```bash
docker-compose run youtube-transcriber <YouTube URL> <Language Code>
```

## Output

The application saves the following files in the output directory:

- transcription.txt: The full transcription of the audio.
- summary.txt: The summarized version of the transcription.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
