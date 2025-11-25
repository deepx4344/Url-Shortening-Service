# URL Shortener

A small URL shortener using Node.js, Express, and MongoDB.

Quick start

1. Copy `.env.example` to `.env` and set `MONGO_URI` and `PORT` as needed.

2. Install dependencies:
npm install

3. Start the server:
npm start

Notes & behavior

- The service stores original URLs and generated short codes in MongoDB.
- The server expects `MONGO_URI` or "mongoURI" to be set in environment.
