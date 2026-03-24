import { Send } from "lucide-react";
import { extractMessageFromOutput, getAnimationOrigin, getChatPosition, parseAdditionalHeaders } from "../utils";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChatMessageType } from "../../types/chatWidget";
import ChatMessage from "./chatMessage";
import { sendMessage } from "../../controllers";
import { sendMessageStreaming } from "../../controllers/streamMessage";
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
  stream
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
  stream?: boolean;

}) {
  const [value, setValue] = useState<string>("");
  const ref = useRef<HTMLDivElement>(null);
  const lastMessage = useRef<HTMLDivElement>(null);
  const [windowPosition, setWindowPosition] = useState({ left: "0", top: "0" });
  const inputRef = useRef<HTMLInputElement>(null); /* User input Ref */
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

  /* Initial listener for loss of focus that refocuses User input after a small delay */

  const [sendingMessage, setSendingMessage] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => { abortRef.current?.abort(); };
  }, []);

  // Ensure additional_headers is always an object
  const parsedHeaders = useMemo(() => parseAdditionalHeaders(additional_headers), [additional_headers]);

  function handleClick() {
    if (value && value.trim() !== "") {
      const currentValue = value;
      addMessage({ message: currentValue, isSend: true });
      setSendingMessage(true);
      setValue("");

      if (stream) {
        // Streaming path
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        addMessage({ message: "", isSend: false });
        setIsStreaming(true);
        const accumulated = { current: "" };
        let rafId: number | null = null;

        const updateMessage = () => {
          updateLastMessage({ message: accumulated.current, isSend: false });
          rafId = null;
        };

        sendMessageStreaming(
          hostUrl, flowId, currentValue, input_type, output_type,
          sessionId.current,
          {
            onToken: (chunk) => {
              accumulated.current += chunk;
              if (!rafId) rafId = requestAnimationFrame(updateMessage);
            },
            onEnd: (data) => {
              if (rafId) cancelAnimationFrame(rafId);
              // Final update with accumulated text
              if (accumulated.current) {
                updateLastMessage({ message: accumulated.current, isSend: false });
              }
              // Capture session_id from end event result
              if (data && data.session_id) {
                sessionId.current = data.session_id;
              }
              setIsStreaming(false);
              setSendingMessage(false);
            },
            onError: (error) => {
              if (rafId) cancelAnimationFrame(rafId);
              updateLastMessage({
                message: accumulated.current || error,
                isSend: false,
                error: true,
              });
              setIsStreaming(false);
              setSendingMessage(false);
            },
          },
          output_component, tweaks, api_key, parsedHeaders as { [key: string]: string } | undefined,
          controller.signal,
        );
      } else {
        // Non-streaming path (existing behavior)
        sendMessage(hostUrl, flowId, currentValue, input_type, output_type, sessionId, output_component, tweaks, api_key, parsedHeaders)
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
    }
  }

  useEffect(() => {
    if (lastMessage.current)
      lastMessage.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* Refocus the User input whenever a new response is returned from the LLM */

  useEffect(() => {
    // after a slight delay
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
          {sendingMessage && !isStreaming && (
            <ChatMessagePlaceholder bot_message_style={bot_message_style} />
          )}
          <div ref={lastMessage}></div>
        </div>
        <div style={input_container_style} className="cl-input_container">
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
  );
}
