import { ChatMessageType } from "../../../types/chatWidget";
import { MoreHorizontal } from 'lucide-react';

export default function ChatMessage({ message, isSend, error, user_message_style, bot_message_style, error_message_style }: ChatMessageType) {
    return (
        <div className={"w-full py-2 px-2 flex " + (isSend ? " justify-end" : " justify-start")}>
            {isSend ?
                <div style={user_message_style} className="user_message">{message}</div> :
                error ? <div style={error_message_style} className={" error_message"}>
                    {message}                
                </div> :
            <div style={bot_message_style} className={"bot_message"}>
                {message==="" ? <div className="animate-pulse"><MoreHorizontal/></div> : message}
            </div>}
        </div>)
}