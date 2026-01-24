# ElevenLabs API & SDK Research Report
**Date:** 2026-01-07 | **Focus:** Text-to-Speech API, SDK Integration, Streaming, Parameters

---

## Executive Summary

ElevenLabs provides a production-ready TTS API with multiple models optimized for different use cases. Key capabilities include real-time streaming, multiple voice options, configurable quality/latency tradeoffs, and both REST and WebSocket endpoints. Streaming is critical for UI feedback—progress can be displayed via chunk delivery rate, with Flash models offering ~75ms latency for interactive applications.

---

## 1. API Structure & Endpoints

### Core Text-to-Speech Endpoint
```
POST /v1/text-to-speech/:voice_id
Headers: xi-api-key (required)
Returns: Audio bytes (MP3, PCM, or uLaw formats)
```

### Key Parameters

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| `text` | string | Yes | Max 40,000 characters (varies by model) |
| `voice_id` | string | Yes | Retrieve from `/v1/voices` endpoint |
| `model_id` | string | No | Default: `eleven_multilingual_v2` |
| `voice_settings` | object | No | Stability, similarity_boost, speed, style, seed |
| `output_format` | string | No | `mp3_44100_128` (default), `pcm_16000`, `ulaw_8000`, etc. |
| `language_code` | string | No | ISO 639-1 code (e.g., `en`, `es`, `ja`) |
| `pronunciation_dictionary_locators` | array | No | For custom pronunciation (increases latency) |

### Response Format
- **Non-streaming:** Complete audio file as bytes
- **Streaming:** Chunked transfer encoding (MP3 data streamed as generated)

### Get Voices Endpoint
```
GET /v1/voices
Returns: List of available voices with metadata (name, gender, accent, etc.)
```

---

## 2. Available Models & Performance Characteristics

### Model Comparison

| Model | Latency | Quality | Languages | Price | Best For |
|-------|---------|---------|-----------|-------|----------|
| **Flash v2.5** | ~75ms | Good | 32 | 50% lower | Real-time apps, agents, conversational AI |
| **Turbo** | ~300ms | Very Good | 32 | Standard | Balanced quality/speed |
| **eleven_multilingual_v2** | ~250-300ms | Excellent | 32 | Standard | High-fidelity, emotional expression |
| **v3 (alpha)** | Moderate | Best | 32 | TBD | Next-gen quality (limited availability) |

### Model Selection Guide
- **High quality required:** `eleven_multilingual_v2`
- **Low latency critical:** `eleven_flash_v2_5` (~75ms model time, 135ms e2e)
- **Multilingual support:** Both v2 and Flash v2.5 support 32 languages
- **Interactive apps:** Flash models with chunked streaming

---

## 3. Voice Settings & Configuration

All settings are optional and override stored voice settings per-request:

```python
voice_settings = {
    "stability": 0.33,              # 0.0-1.0: Lower = more variation
    "similarity_boost": 0.75,       # 0.0-1.0: Higher = closer to original voice
    "use_speaker_boost": True,      # Boost voice characteristics
    "speed": 1.0,                   # 0.5-2.0: Playback speed multiplier
    "style": 0.0,                   # 0.0-1.0: Style exaggeration (adds latency)
    "seed": 2                       # For voice cloning consistency
}
```

### Latency Impact
- **style > 0:** Increases latency, less stable but more expressive
- **use_speaker_boost:** No latency penalty, enhances voice
- **speed:** No latency impact; client-side parameter
- **pronunciation_dictionary:** Heavy latency increase (avoid if low-latency critical)

### Recommended Settings for Different Use Cases

**Interactive/Real-time (e.g., chat):**
```python
{
    "stability": 0.4,
    "similarity_boost": 0.75,
    "use_speaker_boost": True,
    "speed": 1.0,
    "style": 0.0
}
```

**High-Quality Narration:**
```python
{
    "stability": 0.33,
    "similarity_boost": 0.75,
    "use_speaker_boost": True,
    "style": 0.5,
    "speed": 1.0
}
```

---

## 4. Python SDK Integration

### Installation & Setup
```bash
pip install elevenlabs
```

### Basic Usage
```python
from elevenlabs.client import ElevenLabs
from elevenlabs.play import play

client = ElevenLabs(api_key="YOUR_API_KEY")

# Standard generation
audio = client.text_to_speech.convert(
    text="Hello world",
    voice_id="JBFqnCBsd6RMkjVDRZzb",
    model_id="eleven_flash_v2_5"
)

# Save to file
with open("output.mp3", "wb") as f:
    f.write(audio)
```

### Streaming (Real-time audio delivery)
```python
from elevenlabs import stream

audio_stream = client.text_to_speech.stream(
    text="This is streamed audio",
    voice_id="JBFqnCBsd6RMkjVDRZzb",
    model_id="eleven_flash_v2_5"
)

# Option 1: Play immediately as chunks arrive
stream(audio_stream)

# Option 2: Manual processing (for UI feedback)
with open("output.mp3", "wb") as f:
    for chunk in audio_stream:
        if chunk:
            f.write(chunk)
            # TODO: Emit progress event here
```

### Voice Cloning
```python
new_voice = client.voices.add(
    name="Alex",
    description="Custom voice description",
    files=["./sample_0.mp3", "./sample_1.mp3", "./sample_2.mp3"]
)
```

---

## 5. WebSocket Streaming (Real-time Chunk Control)

For ultra-low latency conversational AI, use WebSocket with `chunk_length_schedule`:

```
wss://api.elevenlabs.io/v1/text-to-speech/:voice_id/stream-input?auto_mode=true
```

**Key Feature: Automatic chunk generation based on text length**

```python
chunk_length_schedule = [120, 160, 250, 290]
# Generates audio after 120 chars, then 160, then 250, etc.
```

**Example async usage:**
```python
import asyncio

async def write_to_local(audio_stream):
    with open('./output.mp3', "wb") as f:
        async for chunk in audio_stream:
            if chunk:
                f.write(chunk)

async def listen(websocket):
    while True:
        try:
            data = await websocket.recv()
            # Process audio chunk
        except Exception as e:
            break
```

**Benefits:**
- Send text progressively as it's generated (from LLM)
- Audio generation begins before full text is available
- Chunk scheduling prevents premature generation

---

## 6. Displaying Progress to Users

### Progress Indicator Strategies

#### Strategy 1: Chunk Count (Streaming HTTP)
```python
chunk_count = 0
for chunk in audio_stream:
    if chunk:
        chunk_count += 1
        # Emit: "Chunk {chunk_count} received"
        # Visual: Simple counter or progress bar
```
**Pros:** Real feedback, no estimation needed
**Cons:** Chunk count varies by audio length

#### Strategy 2: Estimated Character Progress
```python
total_chars = len(text)
chars_sent = 0

# During WebSocket transmission:
for chunk in text_chunks:
    chars_sent += len(chunk)
    progress_pct = (chars_sent / total_chars) * 100
    # Emit: f"{progress_pct:.0f}% sent to TTS"
```

#### Strategy 3: Time-Based (Elapsed Millis)
```python
import time

start_time = time.time()
for chunk in audio_stream:
    if chunk:
        elapsed = (time.time() - start_time) * 1000
        # Emit: f"Generating... ({elapsed:.0f}ms elapsed)"
```

#### Strategy 4: Streaming Status Messages
```
User sees:
1. "Sending to voice generation..." (0-50ms)
2. "Audio streaming..." (50ms+)
3. "Complete" (when stream ends)
```

#### Recommended for UI: Multi-Stage Progress
```
Stage 1: "Requesting generation..." → Show spinner
Stage 2: "Streaming audio chunks..." → Show chunk count
Stage 3: "Generation complete" → Transition to player
```

---

## 7. Backend Integration Best Practices

### Async Streaming Pattern (Python/FastAPI)
```python
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import asyncio

app = FastAPI()

@app.post("/generate-audio")
async def generate_audio(request: StoryAudioRequest):
    client = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))

    async def audio_generator():
        try:
            stream = client.text_to_speech.stream(
                text=request.text,
                voice_id=request.voice_id,
                model_id="eleven_flash_v2_5"
            )

            for chunk in stream:
                if chunk:
                    yield chunk

        except Exception as e:
            # Log error, emit to WebSocket, etc.
            yield f"ERROR: {str(e)}".encode()

    return StreamingResponse(
        audio_generator(),
        media_type="audio/mpeg"
    )
```

### Database Logging
- Store `voice_id`, `model_id`, `voice_settings`, generation time, character count
- Track latency per generation for optimization
- Monitor API errors and rate limits

### Error Handling
```python
try:
    audio = client.text_to_speech.convert(...)
except Exception as e:
    # ElevenLabs errors include:
    # - RateLimitError (reduce concurrency)
    # - InvalidVoiceIdError (validate voice_id first)
    # - InputLengthError (text too long)
    # - APIError (transient, retry with backoff)
    pass
```

---

## 8. Configuration Options for UI Exposure

**Recommended to expose:**
1. ✅ Voice selection dropdown (from `/v1/voices`)
2. ✅ Model selection (Flash v2.5 vs. v2 for quality tradeoff)
3. ✅ Speed slider (0.5-2.0, no latency cost)
4. ⚠️ Stability slider (0-1, affects variation)
5. ⚠️ Similarity boost (0-1, affects voice fidelity)

**Not recommended (adds complexity/latency):**
- ❌ Style exaggeration (adds latency, less stable)
- ❌ Custom pronunciation dictionaries
- ❌ Speaker boost toggle (enable by default)

**UI Example:**
```
Voice: [Select Voice] ▼
Model: [Flash v2.5 - Fast] ▼
Speed: [===●======] 1.0x
Advanced Settings ▼
  ├─ Stability: [===●======] 0.4
  └─ Similarity: [======●===] 0.75
```

---

## 9. Cost & Rate Limiting Considerations

- **Pricing:** Per-character (typically $0.30/1M characters for Flash)
- **Rate limits:** Check `X-RateLimit-*` headers in responses
- **Quota:** Set monthly character limit in dashboard
- **Caching:** Store generated audio files; reuse for identical text+voice+settings

---

## 10. JavaScript/Node.js SDK (Brief)

Similar to Python SDK:
```javascript
import { ElevenLabsClient } from "elevenlabs";

const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

const audioStream = await client.textToSpeech.stream({
    voiceId: "JBFqnCBsd6RMkjVDRZzb",
    text: "Hello world",
    modelId: "eleven_flash_v2_5"
});

for await (const chunk of audioStream) {
    // Process chunk
}
```

---

## Key Takeaways for Pipeline Visibility UI

1. **Streaming is real:** Use HTTP streaming (not polling) to show live progress
2. **Chunk count is reliable:** Display "Streaming chunk X/Y" as audio arrives
3. **Flash v2.5 is low-latency:** 75ms model time allows interactive feedback
4. **Voice settings matter:** Expose stability/similarity/speed; hide style/pronunciation
5. **Status stages:** Requesting → Streaming → Complete provides clear UX
6. **Error granularity:** Different error types require different user messages

---

## Unresolved Questions

1. **Concurrent generation limits:** Does ElevenLabs rate-limit by account or per-IP? How many simultaneous streams are allowed?
2. **Chunk timing variability:** Does chunk arrival time correlate predictably with text length for progress bar estimation?
3. **WebSocket vs. HTTP streaming trade-offs:** When should we prefer WebSocket for chunk-aware generation?
4. **Voice customization persistence:** Do custom cloned voices persist in account, or are they session-specific?
5. **Fallback strategies:** What's the recommended TTS fallback if ElevenLabs API is down?
