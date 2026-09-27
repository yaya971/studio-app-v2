---
name: hotclip
description: >
  Autonomous AI viral video clipping, auto-reframing (16:9 to 9:16), animated dynamic karaoke subtitles,
  silence & filler word removal, hook detection, and vertical video generation using Whisper and FFmpeg.
---

# 🎬 Hotclip — AI Viral Video & Re-framing Engine

Located in `tools/hotclip/`.

## Capabilities
- **Viral Hook Detection**: Identifies the most engaging moments in long-form videos (podcasts, streams, YouTube videos).
- **Smart 9:16 Re-framing**: Dynamic face/speaker tracking and crop to convert horizontal videos into TikTok/Reels/Shorts format.
- **Karaoke Animated Subtitles**: Word-by-word synchronized subtitles with customizable color highlighting, fonts, and animation styles.
- **Smart Trimming**: Removes filler words ("um", "uh", "like") and dead silences automatically.
- **Local & Fast**: Built with Whisper, Python, and FFmpeg for fast batch processing.

## Core Commands & Scripts
- Python CLI in `tools/hotclip/`
- FFmpeg video re-framing pipeline
- Whisper transcription & alignment
