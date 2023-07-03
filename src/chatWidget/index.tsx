import { useRef, useState } from "react";
import ChatTrigger from "./chatTrigger";
import ChatWindow from "./chatWindow";
import { ChatMessageType } from "../types/chatWidget";

export default function ChatWidget({ chat_trigger_style,host_url,flow_id,tweaks,
    send_icon_style,
     bot_message_style, 
     user_message_style, 
     chat_window_style, 
     error_message_style, 
     send_button_style,
     online,
     online_message,
     offline_message,
     window_title,
     chat_position, 
     placeholder, 
     input_style, 
     input_container_style }: 
    { send_icon_style?:React.CSSProperties,
        chat_position?: string,
        chat_trigger_style?: React.CSSProperties, 
    bot_message_style?: React.CSSProperties, 
    user_message_style?: React.CSSProperties, 
    chat_window_style?: React.CSSProperties, 
    online?: boolean,
    online_message?: string,
    offline_message?: string,
    window_title?: string,
    error_message_style?: React.CSSProperties, 
    send_button_style?: React.CSSProperties, 
    placeholder?: string, 
    input_style?: React.CSSProperties, 
    input_container_style?: React.CSSProperties,
        host_url: string,flow_id: string, tweaks?: { [key: string]: any } }) {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessageType[]>([]);
    function updateLastMessage(message: ChatMessageType) {
        setMessages((prev) => {
            prev[prev.length - 1] = message;
            return [...prev];
        });
    }
    function addMessage(message: ChatMessageType) {
        setMessages((prev) => [...prev, message]);
    }
    const triggerRef = useRef<HTMLButtonElement>(null);
    return (
        <div>
            <ChatTrigger triggerRef={triggerRef} open={open} setOpen={setOpen} style={chat_trigger_style} />
            <ChatWindow
            open={open}
            send_icon_style={send_icon_style}
            bot_message_style={bot_message_style} 
            user_message_style={user_message_style} 
            chat_window_style={chat_window_style} 
            error_message_style={error_message_style} 
            send_button_style={send_button_style} 
            placeholder={placeholder} 
            input_style={input_style} 
            online={online}
            online_message={online_message}
            offline_message={offline_message}
            window_title={window_title}
            input_container_style={input_container_style} 
            tweaks={tweaks} flowId={flow_id} hostUrl={host_url} 
            updateLastMessage={updateLastMessage} 
            addMessage={addMessage} messages={messages} 
            triggerRef={triggerRef} position={chat_position}/>
        </div>
    )
}
