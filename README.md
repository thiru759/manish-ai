# Manish AI

A responsive React/Vite chatbot UI with an Express backend that calls the OpenAI API. Includes a dark/light theme, English/Tamil-friendly system prompt, in-session conversation context, saved chat history in the browser, typing state, and mobile sidebar.

## Requirements
- Node.js 18 or newer
- An API key for the AI provider used by this backend

## Run locally
1. Install Node.js from https://nodejs.org/
2. Unzip this project and open a terminal in the project folder.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Copy `.env.example` to `.env`.
5. Put your own API key in `.env`:
   ```env
   OPENAI_API_KEY=your_real_key_here
   OPENAI_MODEL=gpt-4.1-mini
   PORT=3001
   ```
6. Start both frontend and backend:
   ```bash
   npm start
   ```
7. Open the local URL printed by Vite (usually http://localhost:5173).

The frontend sends requests to `/api/chat`. For local development, configure Vite to proxy the API to Express by adding the `server` section below to `vite.config.js`:
```js
server: { proxy: { "/api": "http://localhost:3001" } }
```
Then restart `npm start`.

## Security notes
- Never commit `.env` or paste your API key into frontend code.
- Keep the API key on the server only.
- API usage may incur costs according to your provider's pricing.
- Chat history is saved in this browser's local storage; this demo does not sync history across devices or provide account sign-in.

## Production deployment
Deploy the frontend and backend with a host that supports Node.js. Set `OPENAI_API_KEY`, `OPENAI_MODEL`, and `PORT` as server-side environment variables. Configure the frontend host to proxy `/api` requests to the backend, or change the fetch URL to your backend's public API origin and configure CORS to allow only your frontend domain. Do not expose the backend publicly without appropriate rate limiting and abuse protection.

## Notes
The app needs a valid API key and network access to the chosen AI provider to produce live AI answers. Without it, the backend returns a setup message rather than pretending to be connected.
