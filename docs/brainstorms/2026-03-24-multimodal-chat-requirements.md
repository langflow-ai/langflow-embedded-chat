---
date: 2026-03-24
topic: multimodal-chat
---

# Multi-Modal Chat Support

## Problem Frame
The embedded chat widget only supports text input. Users want to upload files (images, documents, etc.) and use voice input, similar to the Langflow playground chat. This limits the widget's usefulness for flows that accept multimodal inputs.

## Requirements
- R1. Users can attach files to messages via a file picker button in the input area
- R2. Attached files are uploaded to the Langflow server before the message is sent, and the file reference is included in the message payload
- R3. Attached files show a preview/indicator in the input area before sending (filename + remove button; image thumbnails for image files)
- R4. Users can activate voice input via a microphone button, which converts speech to text using the browser's Web Speech API (SpeechRecognition)
- R5. Voice input inserts transcribed text into the input field, allowing the user to review/edit before sending
- R6. Both file upload and voice input are opt-in via props (`file_upload` and `voice_input`, both boolean, default `false`) to preserve backward compatibility
- R7. Multiple files can be attached to a single message
- R8. If a file upload fails (server error, auth failure), the error is shown to the user and the message is not sent

## Success Criteria
- Files can be uploaded and processed by Langflow flows that support file inputs
- Voice dictation works in Chrome/Edge and gracefully degrades (button hidden) in unsupported browsers
- Existing text-only behavior is unchanged when props are omitted

## Scope Boundaries
- No server-side speech-to-text — voice uses browser-native SpeechRecognition only
- No drag-and-drop file upload for v1 (file picker button only)
- No file size validation in the widget — let the server reject oversized files
- No camera/webcam capture — file picker only
- Voice input converts to text only — no audio file recording/upload
- No rendering of file references in bot responses (follow-up feature)

## Key Decisions
- **Web Speech API for voice**: Zero dependencies, converts to text client-side. Button hidden when API unavailable. Simplest approach with good UX.
- **Any file type accepted**: The widget doesn't restrict file types — the Langflow flow determines what it can process. Keeps the widget generic.
- **Opt-in via props**: Both features default to `false` so existing deployments are unaffected.

## Dependencies / Assumptions
- Langflow server has a file upload endpoint (`POST /api/v1/files/upload/{flow_id}`) that returns a file path/reference
- The `/run` endpoint accepts file references in the input payload (needs verification during planning)
- Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`) is available in target browsers

## Outstanding Questions

### Deferred to Planning
- [Affects R2][Needs research] Exact Langflow API for uploading files and referencing them in `/run` requests — how does the playground send file references?
- [Affects R4][Technical] How to handle the SpeechRecognition language setting — should it match a prop or use browser default?
- [Affects R1][Technical] UI layout for the file attachment button and voice button alongside the existing send button

## Next Steps
-> `/ce:plan` for structured implementation planning
