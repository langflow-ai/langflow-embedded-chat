import { Send } from 'lucide-react';
import { getChatPosition } from '../utils';
import { useEffect, useRef, useState } from 'react';
import { ChatMessageType } from '../../types/chatWidget';
import ChatMessage from './chatMessage';
import { sendMessage } from '../../controllers';

export default function ChatWindow({ updateLastMessage,messages,addMessage,position, triggerRef, width = 288, height = 320 }:
    {updateLastMessage:Function,messages:ChatMessageType[], addMessage:Function, position: string, triggerRef: React.RefObject<HTMLButtonElement>, width?: number, height?: number }) {
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
            sendMessage("http://localhost:7860", "e8aa9e4e-5952-41aa-a626-0e05573b50e1", value)
            .then((res) => {
                if (res.data && res.data.result && res.data.result.response){
                    updateLastMessage({ message: res.data.result.response, isSend: false });
                }
                setSendingMessage(false);
            }).catch((err) => {
                // console.log(err);
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
            <div ref={ref} className="flex flex-col w-72 h-80 rounded-lg shadow-md border border-gray-100">
                <div className="flex flex-col w-full h-full overflow-scroll scrollbar-hide">
                    {messages.map((message, index) =>
                        <ChatMessage key={index} message={message.message} isSend={message.isSend} />
                    )}
                    <div ref={lastMessage}></div>
                </div>
                <div className="flex w-full h-12 items-center border-t border-gray-200">
                    <input
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleClick() }}
                        type="text"
                        placeholder="Type your message..."
                        className="px-4 py-2 h-full w-full rounded-l-lg focus:outline-none"
                    />
                    <button disabled={sendingMessage} onClick={handleClick}>
                        <Send className={"w-6 h-6 mr-3 "+(!sendingMessage ? 'hover:stroke-blue-400 stroke-blue-500':"stroke-gray-400")} />
                    </button>
                </div>
            </div>
        </div>
    )
}