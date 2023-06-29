import { useRef, useState } from "react";
import ChatTrigger from "./chatTrigger";
import ChatWindow from "./chatWindow";
import { ChatMessageType } from "../types/chatWidget";

export default function ChatWidget({ trigger }: { trigger?: React.CSSProperties }) {
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
            <ChatTrigger triggerRef={triggerRef} open={open} setOpen={setOpen} style={trigger} />
            {open && <ChatWindow updateLastMessage={updateLastMessage} addMessage={addMessage} messages={messages} triggerRef={triggerRef} position="bottom-left"/>}
        </div>
    )
}
