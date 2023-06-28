import { Send } from 'lucide-react';
import { getChatPosition } from '../utils';

export default function ChatWindow({ position, triggerRef}: {position: string, triggerRef: React.RefObject<HTMLDivElement> }) {
    const relativePosition =  getChatPosition(position, triggerRef.current!.getBoundingClientRect());
    return (
        <div className={'absolute '+ relativePosition}>
            <div className="flex flex-col bg-white w-72 h-80 rounded-lg shadow-md border border-gray-100">
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