
import React, { useState } from 'react';
import Button from '../ui/Button';
import { User, Clock } from 'lucide-react';

interface ModerationItem {
    id: number;
    type: 'Comment' | 'Summary';
    content: string;
    user: string;
    timestamp: string;
    reason: string;
}

const initialQueue: ModerationItem[] = [
    { id: 1, type: 'Summary', content: 'Patient seems to have a rare case of...', user: 'user@example.com', timestamp: '2 hours ago', reason: 'Potential PII' },
    { id: 2, type: 'Comment', content: 'This is not a helpful analysis.', user: 'test@example.com', timestamp: '5 hours ago', reason: 'Profanity' },
    { id: 3, type: 'Summary', content: 'The diagnosis is clearly wrong, it should be...', user: 'another@example.com', timestamp: '1 day ago', reason: 'Medical Misinformation' },
];

const ContentModeration: React.FC = () => {
    const [queue, setQueue] = useState<ModerationItem[]>(initialQueue);

    const handleAction = (id: number, action: 'approve' | 'reject') => {
        // In a real app, this would be an API call.
        console.log(`Item ${id} was ${action}d.`);
        setQueue(prevQueue => prevQueue.filter(item => item.id !== id));
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold">Content Moderation Queue</h2>
            {queue.length > 0 ? (
                <div className="space-y-4">
                    {queue.map(item => (
                        <div key={item.id} className="bg-bkg p-4 rounded-lg border border-content/10">
                            <div className="flex justify-between items-start">
                               <div>
                                   <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${item.type === 'Summary' ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'}`}>{item.type}</span>
                                   <p className="mt-2 p-3 bg-content/5 rounded-md italic">"{item.content}"</p>
                               </div>
                               <div className="text-right flex-shrink-0 ml-4">
                                   <p className="font-semibold text-red-400">{item.reason}</p>
                               </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-content/10 flex justify-between items-center">
                                <div className="text-xs text-content/70 flex items-center gap-4">
                                     <span className="flex items-center gap-1.5"><User size={12}/> {item.user}</span>
                                     <span className="flex items-center gap-1.5"><Clock size={12}/> {item.timestamp}</span>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={() => handleAction(item.id, 'approve')} className="bg-green-600 hover:bg-green-700 px-3 py-1 text-sm">Approve</Button>
                                    <Button onClick={() => handleAction(item.id, 'reject')} className="bg-red-600 hover:bg-red-700 px-3 py-1 text-sm">Reject</Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-content/80">The moderation queue is empty. Great job!</p>
                </div>
            )}
        </div>
    );
};

export default ContentModeration;
