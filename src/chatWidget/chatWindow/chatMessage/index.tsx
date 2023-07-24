import { ChatMessageType } from "../../../types/chatWidget";
import { MoreHorizontal } from "lucide-react";

export default function ChatMessage({
  message,
  isSend,
  error,
  user_message_style,
  bot_message_style,
  error_message_style,
}: ChatMessageType) {
  return (
    <div
      className={
        "cl-chat-message " + (isSend ? " cl-justify-end" : " cl-justify-start")
      }
    >
      {isSend ? (
        <div style={user_message_style} className="cl-user_message">
          {message}
        </div>
      ) : error ? (
        <div style={error_message_style} className={"cl-error_message"}>
          {message}
        </div>
      ) : (
        <div style={bot_message_style} className={"cl-bot_message"}>
          {message === "" ? (
            <div className="cl-animate-pulse">
              <MoreHorizontal />
            </div>
          ) : (
            message
          )}
        </div>
      )}
    </div>
  );
}
