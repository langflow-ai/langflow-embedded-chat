import { Send } from 'lucide-react';
import { getChatPosition } from '../utils';
import { useEffect, useRef, useState } from 'react';
import { ChatMessageType } from '../../types/chatWidget';
import ChatMessage from './chatMessage';

export default function ChatWindow({ position, triggerRef, width = 288, height = 320 }:
    { position: string, triggerRef: React.RefObject<HTMLButtonElement>, width?: number, height?: number }) {
    const [messages, setMessages] = useState<ChatMessageType[]>([]);
    const [value, setValue] = useState<string>();
    const ref = useRef<HTMLDivElement>(null);
    const lastMessage = useRef<HTMLDivElement>(null);
    const { left, top } = getChatPosition(position, triggerRef.current!.getBoundingClientRect(), width, height);

    function handleClick() {
        if (value) {
            setMessages((prev)=>[...prev, { message: value, isSend: true }]);
            setValue('');
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
                    <Send onClick={handleClick} className='hover:stroke-blue-400 stroke-blue-500 w-6 h-6 mr-3' />
                </div>
            </div>
        </div>
    )
}