import { Send, Paperclip, Mic, X, FileIcon } from "lucide-react";
import { extractMessageFromOutput, getAnimationOrigin, getChatPosition, parseAdditionalHeaders } from "../utils";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChatMessageType, FileAttachment } from "../../types/chatWidget";
import ChatMessage from "./chatMessage";
import { sendMessage } from "../../controllers";
import { uploadFiles } from "../../controllers/uploadFiles";
import ChatMessagePlaceholder from "../../chatPlaceholder";

export default function ChatWindow({
  api_key,
  flowId,
  hostUrl,
  updateLastMessage,
  messages,
  output_type,
  input_type,
  output_component,
  bot_message_style,
  send_icon_style,
  user_message_style,
  chat_window_style,
  error_message_style,
  placeholder_sending,
  send_button_style,
  online = true,
  open,
  online_message = "We'll reply as soon as we can",
  offline_message = "We're offline now",
  window_title = "Chat",
  placeholder,
  input_style,
  input_container_style,
  addMessage,
  position,
  triggerRef,
  width = 450,
  height = 650,
  tweaks,
  sessionId,
  additional_headers,
  file_upload,
  voice_input,
  file_component,
  voice_language,
}: {
  api_key?: string;
  output_type: string,
  input_type: string,
  output_component?: string,
  bot_message_style?: React.CSSProperties;
  send_icon_style?: React.CSSProperties;
  user_message_style?: React.CSSProperties;
  chat_window_style?: React.CSSProperties;
  error_message_style?: React.CSSProperties;
  send_button_style?: React.CSSProperties;
  online?: boolean;
  open: boolean;
  online_message?: string;
  placeholder_sending?: string;
  offline_message?: string;
  window_title?: string;
  placeholder?: string;
  input_style?: React.CSSProperties;
  input_container_style?: React.CSSProperties;
  tweaks?: { [key: string]: any };
  flowId: string;
  hostUrl: string;
  updateLastMessage: Function;
  messages: ChatMessageType[];
  addMessage: Function;
  position?: string;
  triggerRef: React.RefObject<HTMLButtonElement>;
  width?: number;
  height?: number;
  sessionId: React.MutableRefObject<string>;
  additional_headers?: { [key: string]: string } | string;
  file_upload?: boolean;
  voice_input?: boolean;
  file_component?: string;
  voice_language?: string;

}) {
  const [value, setValue] = useState<string>("");
  const ref = useRef<HTMLDivElement>(null);
  const lastMessage = useRef<HTMLDivElement>(null);
  const [windowPosition, setWindowPosition] = useState({ left: "0", top: "0" });
  const inputRef = useRef<HTMLInputElement>(null);

  // File upload state
  const [attachedFiles, setAttachedFiles] = useState<FileAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Voice input state
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const speechSupported = useRef(false);
  const voiceBaseText = useRef("");

  useEffect(() => {
    if (triggerRef)
      setWindowPosition(
        getChatPosition(
          triggerRef.current!.getBoundingClientRect(),
          width,
          height,
          position
        )
      );
  }, [triggerRef, width, height, position]);

  const [sendingMessage, setSendingMessage] = useState(false);

  // Ensure additional_headers is always an object
  const parsedHeaders = useMemo(() => parseAdditionalHeaders(additional_headers), [additional_headers]);

  // Initialize SpeechRecognition
  useEffect(() => {
    if (!voice_input) return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    speechSupported.current = true;
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    if (voice_language) recognition.lang = voice_language;

    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      const base = voiceBaseText.current;
      setValue(base ? base + " " + transcript : transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      setIsListening(false);
      if (event.error !== "aborted" && event.error !== "no-speech") {
        console.error("Speech recognition error:", event.error);
      }
    };
    recognitionRef.current = recognition;
    return () => { recognitionRef.current?.abort(); };
  }, [voice_input, voice_language]);

  // Clean up object URLs and voice on unmount
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  function toggleListening() {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      voiceBaseText.current = value;
      try { recognitionRef.current.start(); setIsListening(true); }
      catch { /* already started */ }
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    const newAttachments: FileAttachment[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined;
      newAttachments.push({ file, preview });
    }
    setAttachedFiles(prev => [...prev, ...newAttachments]);
    // Reset input so selecting the same file again works
    e.target.value = "";
  }

  function removeFile(index: number) {
    setAttachedFiles(prev => {
      const removed = prev[index];
      if (removed.preview) URL.revokeObjectURL(removed.preview);
      return prev.filter((_, i) => i !== index);
    });
  }

  function clearFiles() {
    attachedFiles.forEach(f => { if (f.preview) URL.revokeObjectURL(f.preview); });
    setAttachedFiles([]);
  }

  async function handleClick() {
    const hasText = value && value.trim() !== "";
    const hasFiles = attachedFiles.length > 0;
    if (!hasText && !hasFiles) return;

    const currentValue = value;
    addMessage({ message: currentValue || (hasFiles ? "[File upload]" : ""), isSend: true });
    setSendingMessage(true);
    setValue("");

    // Upload files if attached
    let mergedTweaks = tweaks ? { ...tweaks } : {};
    if (hasFiles) {
      try {
        const filePaths = await uploadFiles(
          hostUrl, flowId,
          attachedFiles.map(f => f.file),
          api_key,
          parsedHeaders as { [key: string]: string } | undefined
        );
        if (file_component) {
          mergedTweaks[file_component] = { path: filePaths.length === 1 ? filePaths[0] : filePaths };
        } else {
          console.warn("file_upload is enabled but file_component prop is not set. File paths will not be sent to the flow.");
        }
        clearFiles();
      } catch (err: any) {
        const errMsg = err.response?.data?.detail || err.message || "File upload failed";
        addMessage({ message: errMsg, isSend: false, error: true });
        setSendingMessage(false);
        return;
      }
    }

    sendMessage(hostUrl, flowId, currentValue || "", input_type, output_type, sessionId, output_component, mergedTweaks, api_key, parsedHeaders)
      .then((res) => {
        if (
          res.data &&
          res.data.outputs &&
          Object.keys(res.data.outputs).length > 0 &&
          res.data.outputs[0].outputs && res.data.outputs[0].outputs.length > 0
        ) {
          const flowOutputs: Array<any> = res.data.outputs[0].outputs;
          if (output_component &&
            flowOutputs.map(e => e.component_id).includes(output_component)) {
            Object.values(flowOutputs.find(e => e.component_id === output_component).outputs).forEach((output: any) => {
              addMessage({
                message: extractMessageFromOutput(output),
                isSend: false,
              });
            })
          } else if (
            flowOutputs.length === 1
          ) {
            Object.values(flowOutputs[0].outputs).forEach((output: any) => {
              addMessage({
                message: extractMessageFromOutput(output),
                isSend: false,
              });
            })
          } else {
            flowOutputs
              .sort((a, b) => {
                const aTimestamp = Math.min(...Object.values(a.outputs).map((output: any) => Date.parse(output.message?.timestamp)));
                const bTimestamp = Math.min(...Object.values(b.outputs).map((output: any) => Date.parse(output.message?.timestamp)));
                return aTimestamp - bTimestamp;
              })
              .forEach((flowOutput) => {
                Object.values(flowOutput.outputs).forEach((output: any) => {
                  addMessage({
                    message: extractMessageFromOutput(output),
                    isSend: false,
                  });
                });
              });
          }
        }
        if (res.data && res.data.session_id) {
          sessionId.current = res.data.session_id;
        }
        setSendingMessage(false);
      })
      .catch((err) => {
        const response = err.response;
        if (err.code === "ERR_NETWORK") {
          updateLastMessage({
            message: "Network error",
            isSend: false,
            error: true,
          });
        } else if (
          response &&
          response.status === 500 &&
          response.data &&
          response.data.detail
        ) {
          updateLastMessage({
            message: response.data.detail,
            isSend: false,
            error: true,
          });
        }
        console.error(err);
        setSendingMessage(false);
      });
  }

  useEffect(() => {
    if (lastMessage.current)
      lastMessage.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, [messages, open]);

  return (
    <div
      className={
        "cl-chat-window " +
        getAnimationOrigin(position) +
        (open ? " cl-scale-100" : " cl-scale-0")
      }
      style={{ ...windowPosition, zIndex: 9999 }}
    >
      <div
        style={{ ...chat_window_style, width: width, height: height }}
        ref={ref}
        className="cl-window"
      >
        <div className="cl-header">
          {window_title}
          <div className="cl-header-subtitle">
            {online ? (
              <>
                <div className="cl-online-message"></div>
                {online_message}
              </>
            ) : (
              <>
                <div className="cl-offline-message"></div>
                {offline_message}
              </>
            )}
          </div>
        </div>
        <div className="cl-messages_container">
          {messages.map((message, index) => (
            <ChatMessage
              bot_message_style={bot_message_style}
              user_message_style={user_message_style}
              error_message_style={error_message_style}
              key={index}
              message={message.message}
              isSend={message.isSend}
              error={message.error}
            />
          ))}
          {sendingMessage && (
            <ChatMessagePlaceholder bot_message_style={bot_message_style} />
          )}
          <div ref={lastMessage}></div>
        </div>
        <div style={input_container_style} className="cl-input_container">
          {/* File previews */}
          {attachedFiles.length > 0 && (
            <div className="cl-file-previews">
              {attachedFiles.map((f, i) => (
                <div key={i} className="cl-file-preview-item">
                  {f.preview ? (
                    <img src={f.preview} alt={f.file.name} className="cl-file-thumbnail" />
                  ) : (
                    <FileIcon className="cl-file-icon" size={20} />
                  )}
                  <span className="cl-file-name">{f.file.name}</span>
                  <button onClick={() => removeFile(i)} className="cl-file-remove" type="button">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          {/* Input row */}
          <div className="cl-input-row">
            {/* File upload button */}
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
                  className="cl-action-button"
                  disabled={sendingMessage}
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                >
                  <Paperclip className={"cl-action-icon" + (sendingMessage ? " cl-sending-message" : "")} size={20} />
                </button>
              </>
            )}
            {/* Voice input button */}
            {voice_input && speechSupported.current && (
              <button
                className={"cl-action-button" + (isListening ? " cl-voice-active" : "")}
                disabled={sendingMessage}
                onClick={toggleListening}
                type="button"
              >
                <Mic className={"cl-action-icon" + (sendingMessage ? " cl-sending-message" : "")} size={20} />
              </button>
            )}
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleClick();
              }}
              type="text"
              disabled={sendingMessage}
              placeholder={sendingMessage ? (placeholder_sending || "Thinking...") : (placeholder || "Type your message...")}
              style={input_style}
              ref={inputRef}
              className="cl-input-element"
            />
            <button
              style={send_button_style}
              disabled={sendingMessage}
              onClick={handleClick}
            >
              <Send
                style={send_icon_style}
                className={
                  "cl-send-icon " +
                  (!sendingMessage
                    ? "cl-notsending-message"
                    : "cl-sending-message")
                }
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
