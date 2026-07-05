# Voxamir

Voxamir is a browser-first voice calling prototype built with Next.js. The current app demonstrates an AI-powered, low-bandwidth call UI with local WebRTC transport and simulated latent packet flow.

## What’s included

- Custom responsive landing page with product overview and MVP demo link
- `/mvp` call-style demo page with:
  - microphone capture using the Web Audio API
  - local `RTCPeerConnection` and WebRTC `DataChannel`
  - simulated latent encoding and packet transmission
  - realtime metrics for status, connection, and packet counters
- Modern dark UI with mobile-responsive layout

## Current status

Completed:
- Defined MVP scope and success criteria
- Initialized Git repository and pushed to GitHub
- Built frontend call UI and home page UI
- Implemented local WebRTC demo flow in browser
- Verified Next.js build successfully

In progress:
- Setup development environment and dependency management
- Improve backend API for signaling and multi-peer call support
- Add actual voice codec / latent encoding pipeline
- Integrate real call provider or peer signaling backend

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and browse to `/mvp` for the call demo.

## Project structure

- `src/app/page.js` — landing homepage
- `src/app/mvp/page.js` — MVP voice call demo
- `src/app/layout.js` — global layout settings
- `README.md` — project overview and instructions

## Next steps

1. Add backend signaling for remote peer connections
2. Replace simulated latent packets with a real browser codec
3. Add voice playback / audio rendering for received latent data
4. Polish UI/UX for real call flow and mobile behavior

## Notes

This project is built with Next.js 16 and uses Tailwind-style utility classes for styling.
