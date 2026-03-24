---
title: "feat: Add multi-modal chat support (file uploads + voice input)"
type: feat
status: active
date: 2026-03-25
origin: docs/brainstorms/2026-03-24-multimodal-chat-requirements.md
---

# feat: Add multi-modal chat support (file uploads + voice input)

## Overview

Add file upload and voice-to-text input capabilities to the embedded chat widget, allowing users to attach files to messages and dictate text via the browser's Web Speech API. Both features are opt-in via boolean props to preserve backward compatibility.

## Problem Statement

The embedded chat widget only supports text input. Users with Langflow flows that accept file inputs (images, documents) or users who prefer voice dictation cannot use those capabilities through the widget. This limits the widget's usefulness compared to the Langflow playground chat.

## Proposed Solution

Two independent features behind boolean props:

1. **File Upload** (`file_upload` prop): A paperclip button in the input area opens a native file picker. Selected files show as previews above the input. On send, files are uploaded to Langflow via `POST /api/v1/files/upload/{flow_id}`, and file references are included in the message payload via the `tweaks` object targeting a configurable `file_component` prop.

2. **Voice Input** (`voice_input` prop): A microphone button activates the browser's SpeechRecognition API. Transcribed text is appended to the input field for review before sending. The button is hidden when the API is unavailable.

## Technical Approach

### Architecture

The implementation follows the existing prop-flow pattern: web component props (src/index.tsx) → ChatWidget → ChatWindow. New state management and UI elements are added to ChatWindow. A new file upload controller follows the existing sendMessage/sendMessageStreaming pattern.

### Key Design Decisions

- **File references via tweaks** (see origin: docs/brainstorms/2026-03-24-multimodal-chat-requirements.md): Langflow's API requires file paths in `tweaks[COMPONENT_ID].path`. The widget needs a `file_component` string prop to know which flow component accepts files. Multiple files use array format: `tweaks[file_component].path = [path1, path2]`.
- **Upload on send**: Files are uploaded when the user clicks send, not immediately on selection. This avoids orphaned uploads and simplifies cancellation.
- **Sequential uploads**: Multiple files upload one-by-one. If any upload fails, remaining uploads are skipped and the error is shown.
- **Web Speech API for voice** (see origin): Zero dependencies, client-side only. Button hidden when API unavailable. Uses `continuous: false` with `interimResults: true`.
- **Voice appends text**: Transcribed text is appended to any existing input text, not replaced. Users can dictate in multiple parts.
- **Opt-in via props** (see origin): `file_upload` and `voice_input` default to `false`. Existing deployments are unaffected.
- **Any file type accepted** (see origin): No client-side type restriction. Server determines what it can process.

### Implementation Phases

#### Phase 1: Foundation — Props, Types, Upload Controller

**Goal**: Wire up new props and create the file upload controller.

**Files**:
- `src/index.tsx` — Add `file_upload: "boolean"`, `voice_input: "boolean"`, `file_component: "string"`, `voice_language: "string"` to r2wc props
- `src/chatWidget/index.tsx` — Destructure and pass new props to ChatWindow
- `src/types/chatWidget/index.ts` — Add `FileAttachment` type
- `src/controllers/uploadFiles.ts` — New file upload controller

**Approach**:

Add four new props to the r2wc registration:
```typescript
file_upload: "boolean",
voice_input: "boolean",
file_component: "string",
voice_language: "string",
```

Add type for file attachments:
```typescript
export type FileAttachment = {
  file: File;
  preview?: string; // Object URL for image thumbnails
};
```

Create upload controller following existing axios pattern from `src/controllers/index.ts`:
```typescript
// controllers/uploadFiles.ts
export async function uploadFiles(
  baseUrl: string,
  flowId: string,
  files: File[],
  api_key?: string,
  additional_headers?: { [key: string]: string }
): Promise<string[]> {
  const paths: string[] = [];
  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);
    const headers: any = {};
    if (api_key) headers["x-api-key"] = api_key;
    if (additional_headers) Object.assign(headers, additional_headers);
    const res = await axios.post(
      `${baseUrl}/api/v1/files/upload/${flowId}`, formData, { headers }
    );
    paths.push(res.data.file_path);
  }
  return paths;
}
```

**Patterns to follow**: `src/controllers/index.ts:1-30` for axios usage and header construction.

**Verification**: TypeScript compiles with no errors. New props accepted by web component.

**Execution note**: Straightforward wiring — no test-first needed.

---

#### Phase 2: File Upload UI

**Goal**: Add file picker button, file preview area, and integrate upload into send flow.

**Files**:
- `src/chatWidget/chatWindow/index.tsx` — File picker button, preview area, modified handleClick
- `src/chatWidget/index.tsx` — Embedded CSS additions for new elements

**Approach**:

Add state and refs to ChatWindow:
```typescript
const [attachedFiles, setAttachedFiles] = useState<FileAttachment[]>([]);
const fileInputRef = useRef<HTMLInputElement>(null);
```

Add hidden file input and paperclip button (using lucide-react `Paperclip` icon):
```tsx
{file_upload && (
  <>
    <input
      type="file"
      multiple
      ref={fileInputRef}
      className="cl-file-input-hidden"
      onChange={handleFileSelect}
    />
    <button
      className="cl-file-button"
      disabled={sendingMessage}
      onClick={() => fileInputRef.current?.click()}
    >
      <Paperclip className="cl-action-icon" />
    </button>
  </>
)}
```

Restructure `cl-input_container` from a flat flex-row to a flex-column wrapper with two rows: a file preview row (conditional) and the input row. The existing flex-row layout moves into an inner `.cl-input-row` div.

File preview area above the input row:
```tsx
{attachedFiles.length > 0 && (
  <div className="cl-file-previews">
    {attachedFiles.map((f, i) => (
      <div key={i} className="cl-file-preview-item">
        {f.preview ? (
          <img src={f.preview} className="cl-file-thumbnail" />
        ) : (
          <File className="cl-file-icon" />
        )}
        <span className="cl-file-name">{f.file.name}</span>
        <button onClick={() => removeFile(i)} className="cl-file-remove">
          <X size={14} />
        </button>
      </div>
    ))}
  </div>
)}
```

Modify `handleClick()`:
1. Allow sending when `attachedFiles.length > 0` even if text is empty
2. File upload and tweaks merging happen *before* the existing streaming/non-streaming branch — both paths receive the same modified tweaks object
3. Before sending message, upload all files via `uploadFiles()`
4. If upload succeeds, merge file paths into tweaks: `{ ...tweaks, [file_component]: { path: filePaths } }`
5. If upload fails, show error message via `addMessage({ error: true })`, don't send
6. Clear attachedFiles and revoke object URLs after successful send

**Button layout**: `[Paperclip] [Mic] [text input] [Send]` — action buttons before input, send after.

**CSS classes** (add to embedded styles in ChatWidget):
- `.cl-input_container` — Change from `flex-row` to `flex-direction: column` (breaking change scoped to this container)
- `.cl-input-row` — New inner div: `display: flex; align-items: center` (inherits the old row layout)
- `.cl-file-input-hidden` — `display: none`
- `.cl-file-button` — Same size/style as send button area
- `.cl-action-icon` — `height: 1.25rem; width: 1.25rem; color: #6b7280; cursor: pointer`
- `.cl-file-previews` — Flex row, gap, horizontal scroll, border-bottom
- `.cl-file-preview-item` — Flex row, aligned, with filename and remove button
- `.cl-file-thumbnail` — `40px × 40px`, object-fit cover, rounded
- `.cl-file-icon` — Fallback icon for non-image files
- `.cl-file-name` — Truncated text, max 120px width
- `.cl-file-remove` — Small X button, hover highlight

**Patterns to follow**: Existing send button styling at `src/chatWidget/chatWindow/index.tsx:318-332`. Embedded CSS pattern in `src/chatWidget/index.tsx` (the large CSS string).

**Verification**:
- File picker opens on paperclip click
- Selected files show preview with remove button
- Image files show thumbnail; others show file icon + name
- Files upload on send; file references appear in tweaks payload
- Upload error prevents message send and shows error
- Files cleared after successful send

**Execution note**: Build UI incrementally — button first, then preview, then upload integration.

---

#### Phase 3: Voice Input

**Goal**: Add microphone button with Web Speech API integration.

**Files**:
- `src/types/speech-recognition.d.ts` — TypeScript declarations for SpeechRecognition
- `src/chatWidget/chatWindow/index.tsx` — Mic button, recognition logic
- `src/chatWidget/index.tsx` — CSS for recording state

**Approach**:

Create TypeScript declarations for SpeechRecognition and webkitSpeechRecognition (the API is not in standard TS lib types). Declare on the Window interface.

In ChatWindow, add state and refs:
```typescript
const [isListening, setIsListening] = useState(false);
const recognitionRef = useRef<SpeechRecognition | null>(null);
const speechSupported = useRef(false);
const voiceBaseText = useRef(""); // Text in input before voice started
```

Initialize SpeechRecognition in a `useEffect`:
```typescript
useEffect(() => {
  if (!voice_input) return;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return;
  speechSupported.current = true;
  const recognition = new SR();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  if (voice_language) recognition.lang = voice_language;

  recognition.onresult = (event) => {
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    // Replace only the voice-appended portion, preserving base text.
    // voiceBaseText.current is captured when recording starts.
    const base = voiceBaseText.current;
    setValue(base ? base + " " + transcript : transcript);
  };
  recognition.onend = () => setIsListening(false);
  recognition.onerror = (event) => {
    setIsListening(false);
    if (event.error !== "aborted" && event.error !== "no-speech") {
      console.error("Speech recognition error:", event.error);
    }
  };
  recognitionRef.current = recognition;
  return () => { recognitionRef.current?.abort(); };
}, [voice_input, voice_language]);
```

**Important**: `voiceBaseText` captures the current input value when the user starts recording. Each `onresult` replaces everything after the base text with the latest transcript (interim or final). This prevents duplication from interim results firing repeatedly.

Add mic button (lucide-react `Mic` icon), hidden when unsupported:
```tsx
{voice_input && speechSupported.current && (
  <button
    className={`cl-voice-button ${isListening ? "cl-voice-active" : ""}`}
    disabled={sendingMessage}
    onClick={toggleListening}
  >
    <Mic className="cl-action-icon" />
  </button>
)}
```

Toggle function:
```typescript
function toggleListening() {
  if (!recognitionRef.current) return;
  if (isListening) {
    recognitionRef.current.stop();
  } else {
    voiceBaseText.current = value; // Capture current input as base
    try { recognitionRef.current.start(); setIsListening(true); }
    catch { /* already started */ }
  }
}
```

**CSS additions**:
- `.cl-voice-button` — Same styling as file button
- `.cl-voice-active` — Red/pink background color, pulsing animation via `@keyframes cl-pulse`
- `@keyframes cl-pulse` — Scale 1 → 1.1 → 1, opacity 1 → 0.8 → 1, 1.5s infinite

**Patterns to follow**: AbortController cleanup pattern at `src/chatWidget/chatWindow/index.tsx:99-103`.

**Verification**:
- Mic button visible only when `voice_input=true` AND browser supports SpeechRecognition
- Mic button hidden in Firefox (no SpeechRecognition support)
- Click mic → recording state (visual feedback) → speak → text appears in input
- Click mic again → stops recording
- Text appended to existing input content
- Cleanup on unmount (no leaked listeners)
- Button disabled during sendingMessage

**Execution note**: Test in Chrome (has webkitSpeechRecognition). Feature detection handles unsupported browsers.

---

#### Phase 4: Polish and Integration

**Goal**: Handle edge cases, ensure backward compatibility, update README.

**Files**:
- `src/chatWidget/chatWindow/index.tsx` — Edge case handling
- `README.md` — Document new props

**Approach**:

Edge cases to handle:
- File-only messages (no text): Allow send when `attachedFiles.length > 0`, use `input_value: ""`
- Widget close/reopen: Clear attachedFiles (revoke object URLs), stop voice recognition
- Abort file uploads on unmount: Use AbortController for axios requests
- Merge file tweaks with existing tweaks prop: `{ ...tweaks, [file_component]: { path: filePaths } }`
- Streaming + files: Include file tweaks in streaming request payload too

README updates — add to props table:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| file_upload | Boolean | false | Enable file attachment button |
| file_component | String | - | Flow component ID that accepts files (required when file_upload=true) |
| voice_input | Boolean | false | Enable voice-to-text input button |
| voice_language | String | Browser default | BCP 47 language code for speech recognition (e.g., "en-US") |

**Verification**:
- Existing text-only behavior unchanged when new props omitted
- `file_upload=true` without `file_component` logs warning
- All features work with both streaming and non-streaming modes
- Widget renders correctly at various widths (450px default, narrower)

---

## System-Wide Impact

### Interaction Graph

File upload: User clicks send → `uploadFiles()` called → on success, file paths merged into tweaks → `sendMessage()`/`sendMessageStreaming()` called with modified tweaks → normal response flow.

Voice input: User clicks mic → SpeechRecognition.start() → browser handles audio capture → onresult callback updates input value via setValue() → user clicks send → normal text flow.

Neither feature introduces new callbacks, middleware, or observers beyond what already exists.

### Error Propagation

- File upload errors (network, auth, server): Caught in handleClick, shown as error message via `addMessage({ error: true })`, message not sent
- Voice errors: Caught in recognition.onerror, logged to console, recording state reset. Non-critical — user can retry or type manually
- No retry logic needed — user manually retries by clicking send again

### State Lifecycle Risks

- Object URLs from `URL.createObjectURL()` for image previews must be revoked on file removal and component unmount to prevent memory leaks
- SpeechRecognition instance must be aborted on unmount
- In-flight file uploads should be abortable on unmount

### API Surface Parity

Only one interface (the web component). No other entry points need updating.

### Integration Test Scenarios

1. Upload file + send message (non-streaming): File uploaded, tweaks include file path, response received
2. Upload file + send message (streaming): Same flow works with streaming enabled
3. File upload failure: Error shown, message not sent, files preserved for retry
4. Voice input → text in field → send: Transcribed text sent as normal message
5. File + voice + text combined: All three inputs work together in single message

## Acceptance Criteria

### Functional Requirements

- [ ] [R1] Paperclip button opens native file picker when `file_upload=true`
- [ ] [R2] Files uploaded to `/api/v1/files/upload/{flow_id}`, paths included in tweaks
- [ ] [R3] File previews show above input (thumbnails for images, icon+name for others), with remove button
- [ ] [R4] Mic button activates SpeechRecognition when `voice_input=true`
- [ ] [R5] Transcribed text inserted into input field for review before sending
- [ ] [R6] Both features default to false; existing behavior unchanged when props omitted
- [ ] [R7] Multiple files can be attached and uploaded in a single message
- [ ] [R8] Upload failure shows error message, prevents message send

### Non-Functional Requirements

- [ ] Voice button hidden in browsers without SpeechRecognition (Firefox)
- [ ] Object URLs properly revoked (no memory leaks)
- [ ] SpeechRecognition cleaned up on unmount
- [ ] Works with both streaming and non-streaming modes
- [ ] No visual regression at default 450×650 widget size

## Dependencies & Prerequisites

- Langflow server with file upload endpoint (`POST /api/v1/files/upload/{flow_id}`)
- Flow must have a file-accepting component whose ID is passed via `file_component` prop
- Web Speech API available in target browser (Chrome, Edge, Safari) for voice input
- lucide-react already includes `Paperclip`, `Mic`, `File`, `X` icons (no new dependencies)

## Sources & References

### Origin

- **Origin document:** [docs/brainstorms/2026-03-24-multimodal-chat-requirements.md](docs/brainstorms/2026-03-24-multimodal-chat-requirements.md) — Key decisions carried forward: opt-in via props, Web Speech API for voice, any file type accepted, no drag-and-drop in v1

### Internal References

- Prop registration pattern: `src/index.tsx:4-36`
- Prop flow through ChatWidget: `src/chatWidget/index.tsx`
- Input area structure: `src/chatWidget/chatWindow/index.tsx:304-333`
- Controller pattern (axios): `src/controllers/index.ts`
- Controller pattern (fetch/streaming): `src/controllers/streamMessage.ts`
- Embedded CSS: `src/chatWidget/index.tsx` (lines 88-2147)
- Icon usage: `lucide-react` — Send, MessageSquare, X, MoreHorizontal

### External References

- Langflow file upload API: `POST /api/v1/files/upload/{flow_id}` — multipart/form-data, returns `{file_path: string}`
- Langflow file reference in run payload: `tweaks[COMPONENT_ID].path = file_path`
- Web Speech API (MDN): SpeechRecognition interface with webkitSpeechRecognition fallback
- SpeechRecognition error types: no-speech, audio-capture, not-allowed, network, aborted
