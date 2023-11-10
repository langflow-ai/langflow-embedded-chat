import { Send } from "lucide-react";
import { getAnimationOrigin, getChatPosition } from "../utils";
import React, { useEffect, useRef, useState } from "react";
import { ChatMessageType } from "../../types/chatWidget";
import ChatMessage from "./chatMessage";
import { sendMessage } from "../../controllers";

export default function ChatWindow({
  api_key,
  flowId,
  hostUrl,
  updateLastMessage,
  messages,
  chat_inputs,
  chat_input_field,
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
  chat_output_key,
  input_style,
  input_container_style,
  addMessage,
  position,
  triggerRef,
  width = 450,
  height = 650,
  tweaks,
  sessionId,
  additional_headers
}: {
  api_key?: string;
  chat_inputs: Object;
  chat_input_field: string;
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
  chat_output_key?: string;
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
  additional_headers?: {[key:string]:string};

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

  const handleBlur = () => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }; 
  const inputElem = inputRef.current;
  inputElem?.addEventListener('blur', handleBlur);

  const [sendingMessage, setSendingMessage] = useState(false);

  function handleClick() {
    if (value && value.trim() !== "") {
      addMessage({ message: value, isSend: true });
      setSendingMessage(true);
      setValue("");
      sendMessage(hostUrl, flowId, value, chat_inputs,chat_input_field,sessionId, tweaks,api_key, additional_headers)
        .then((res) => {
          if (
            res.data &&
            res.data.result &&
            Object.keys(res.data.result).length > 0
          ) {
            if (chat_output_key &&
            res.data.result[chat_output_key]) {
              updateLastMessage({
                message: res.data.result[chat_output_key],
                isSend: false,
              });
            } else if (
              Object.keys(res.data.result).length === 1
            ) {
              updateLastMessage({
                message: Object.values(res.data.result)[0],
                isSend: false,
              });
            } else {
              updateLastMessage({
                message: "Multiple output keys were detected in the response. Please, define the output key to specify the intended response.",
                isSend: false,
                error: true,
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
      addMessage({ message: "", isSend: false });
    }
  }

  useEffect(() => {
    if (lastMessage.current)
      lastMessage.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

/* Refocus the User input whenever a new response is returned from the LLM */

  useEffect(() => {
    const handleBlur = () => {
      // after a slight delay
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    };
    const inputElem = inputRef.current;
    inputElem?.addEventListener('blur', handleBlur);
    inputRef.current?.focus();

    // Clean up the listener when the component is unmounted
  
    return () => {
      inputElem?.removeEventListener('blur', handleBlur);
    };
  }, [messages]);

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
