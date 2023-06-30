import { ChatMessageType } from "../../../types/chatWidget";
import { MoreHorizontal } from 'lucide-react';

export default function ChatMessage({ message, isSend, error, user_message_style, bot_message_style, error_message_style }: ChatMessageType) {
    return (
        <div className={"w-full py-2 px-2 flex " + (isSend ? " justify-end" : " justify-start")}>
            {isSend ?
                <div style={user_message_style} className="rounded-lg w-fit max-w-full  px-2 py-1 break-before-all text-right rounded-br-none bg-blue-500 text-white">{message}</div> :
                error ? <div style={error_message_style} className={" bg-red-400 break-before-all rounded-lg rounded-bl-none text-left px-2 py-1 text-white"}>
                    {message}                
                </div> :
            <div style={bot_message_style} className={"bg-gray-400 break-before-all rounded-lg rounded-bl-none text-left px-2 py-1 text-white"}>
                {message==="" ? <div className="animate-pulse"><MoreHorizontal/></div> : message}
            </div>}
        </div>)
}