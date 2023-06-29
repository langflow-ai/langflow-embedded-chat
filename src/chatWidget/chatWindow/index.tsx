import { Send } from 'lucide-react';
import { getChatPosition } from '../utils';
import { useRef } from 'react';

export default function ChatWindow({ position, triggerRef, width=288, height=320}: 
{position: string, triggerRef: React.RefObject<HTMLButtonElement>, width?: number, height?: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const {left, top} =  getChatPosition(position, triggerRef.current!.getBoundingClientRect(), width,height);
    return (
        <div className='absolute' style={{top,left}}>
            <div ref={ref} className="flex flex-col w-72 h-80 rounded-lg shadow-md border border-gray-100">
                <div className="flex flex-col-reverse w-full h-full">
                    {/* Chat messages */}
                </div>
                <div className="flex w-full h-12 items-center border-t border-gray-200">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        className="px-4 py-2 h-full w-full rounded-l-lg focus:outline-none"
                    />
                    <Send className='hover:stroke-blue-400 stroke-blue-500 w-6 h-6 mr-3' />
                </div>
            </div>
        </div>
    )
}