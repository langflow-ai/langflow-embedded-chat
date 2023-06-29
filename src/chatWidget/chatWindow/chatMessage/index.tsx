import { ChatMessageType } from "../../../types/chatWidget";

export default function ChatMessage({ message, isSend }: ChatMessageType) {
    return (
        <div className={"w-full py-2 px-2 flex "+(isSend?" justify-end":" justify-start")}>
            {isSend ? <div className="rounded-lg w-fit max-w-full overflow-hidden px-2 py-1 text-right rounded-br-none bg-blue-500 text-white">{message}</div> :
                <div className="rounded-lg rounded-bl-none text-left px-2 py-1 bg-slate-500 text-white">{message}</div>}
        </div>)
}