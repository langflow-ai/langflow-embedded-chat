import { MessageSquare, X } from "lucide-react"
export default function ChatTrigger({ style, open, setOpen, triggerRef }: { style?: React.CSSProperties, open: boolean, setOpen: Function, triggerRef: React.RefObject<HTMLButtonElement> | null }) {

    return (
        <button ref={triggerRef} style={style}
            onClick={() => { setOpen(!open)}}
            className="trigger transition-all">
            <X className={"h-1/2 w-1/2 absolute transition-all duration-500 " + (open ? "scale-100" : "scale-0")} />
            <MessageSquare className={"h-1/2 w-1/2 absolute transition-all duration-500 " + (open ? "scale-0" : "scale-100")} />
        </button>
    )
}