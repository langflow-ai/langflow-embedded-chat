import { Send } from 'lucide-react';
import { getChatPosition } from '../utils';
import { useEffect, useRef, useState } from 'react';
import { ChatMessageType } from '../../types/chatWidget';
import ChatMessage from './chatMessage';
import { sendMessage } from '../../controllers';

export default function ChatWindow(
    { flowId, hostUrl, updateLastMessage, messages,
        bot_message_style,
        send_icon_style, 
        user_message_style, 
        chat_window_style, 
        error_message_style, 
        send_button_style, 
        placeholder, 
        input_style, 
        input_container_style,
        addMessage, position, triggerRef, width = 288, height = 320, tweaks }:
        {
            bot_message_style: React.CSSProperties,
            send_icon_style:React.CSSProperties, 
            user_message_style: React.CSSProperties, chat_window_style: React.CSSProperties, error_message_style: React.CSSProperties, send_button_style: React.CSSProperties, placeholder: string, input_style: React.CSSProperties, input_container_style: React.CSSProperties,
            tweaks?: { [key: string]: any },
            flowId: string,
            hostUrl: string,
            updateLastMessage: Function,
            messages: ChatMessageType[],
            addMessage: Function, position: string, triggerRef: React.RefObject<HTMLButtonElement>, width?: number, height?: number
        }) {
    const [value, setValue] = useState<string>("");
    const ref = useRef<HTMLDivElement>(null);
    const lastMessage = useRef<HTMLDivElement>(null);
    const { left, top } = getChatPosition(position, triggerRef.current!.getBoundingClientRect(), width, height);
    const [sendingMessage, setSendingMessage] = useState(false);

    function handleClick() {
        if (value && value.trim() !== "") {
            addMessage({ message: value, isSend: true });
            setSendingMessage(true);
            setValue('');
            sendMessage(hostUrl, flowId, value, tweaks)
                .then((res) => {
                    if (res.data && res.data.result && res.data.result.response) {
                        updateLastMessage({ message: res.data.result.response, isSend: false });
                    }
                    setSendingMessage(false);
                }).catch((err) => {
                    const response = err.response;
                    if (err.code === "ERR_NETWORK") {
                        updateLastMessage({ message: "Network error", isSend: false, error: true });
                    }
                    else if (response && response.status === 500 && response.data && response.data.detail) {
                        updateLastMessage({ message: response.data.detail, isSend: false, error: true });
                    }
                    console.log(err);
                    setSendingMessage(false);
                });
            addMessage({ message: "", isSend: false })
        }
    }

    useEffect(() => {
        if (lastMessage.current) lastMessage.current.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    return (
        <div className='absolute' style={{ top, left }}>
            <div style={chat_window_style} ref={ref} className="flex flex-col w-72 h-80 rounded-lg shadow-md border border-gray-100">
                <div className="flex flex-col w-full h-full overflow-x-clip overflow-scroll scrollbar-hide">
                    {messages.map((message, index) =>
                        <ChatMessage
                            bot_message_style={bot_message_style}
                            user_message_style={user_message_style}
                            error_message_style={error_message_style}
                            key={index}
                            message={message.message}
                            isSend={message.isSend}
                            error={message.error} />
                    )}
                    <div ref={lastMessage}></div>
                </div>
                <div style={input_container_style} className="flex w-full h-12 items-center border-t border-gray-200">
                    <input
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleClick() }}
                        type="text"
                        placeholder={placeholder||"Type your message..."}
                        style={input_style}
                        className="px-4 py-2 h-full w-full rounded-l-lg focus:outline-none"
                    />
                    <button style={send_button_style} disabled={sendingMessage} onClick={handleClick}>
                        <Send style={send_icon_style} className={"w-6 h-6 mr-3 " + (!sendingMessage ? 'hover:stroke-blue-400 stroke-blue-500' : "stroke-gray-400")} />
                    </button>
                </div>
            </div>
        </div>
    )
}