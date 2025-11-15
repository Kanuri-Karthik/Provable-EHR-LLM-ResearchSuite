
import React, { useState } from 'react';
import { groundedQuery } from '../../services/geminiService';
import Button from '../ui/Button';
import Loader from '../ui/Loader';
import { LinkIcon } from 'lucide-react';

interface Source {
  web?: {
    uri: string;
    title: string;
  };
}

const WebGroundedQA: React.FC = () => {
    const [query, setQuery] = useState('Who won the most recent F1 race and what were the key moments?');
    const [result, setResult] = useState<{ answer: string; sources: Source[] } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleQuery = async () => {
        setIsLoading(true);
        setError('');
        setResult(null);
        try {
            const res = await groundedQuery(query);
            setResult(res);
        } catch (e: any) {
            setError(e.message || "An error occurred while fetching the answer.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="max-w-3xl mx-auto">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="query" className="block text-lg font-semibold mb-2">Your Question</label>
                        <textarea
                            id="query"
                            className="w-full p-2 bg-bkg border border-content/20 rounded-md text-sm"
                            rows={3}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ask something that requires recent information..."
                        />
                    </div>
                    <Button onClick={handleQuery} isLoading={isLoading}>
                        Get Grounded Answer
                    </Button>
                </div>
            </div>
            <div className="mt-8">
                <div className="w-full p-4 bg-bkg border border-content/20 rounded-md min-h-[20rem]">
                    {isLoading && <Loader />}
                    {error && <div className="text-red-400 text-center">{error}</div>}
                    {result && (
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Answer</h3>
                            <p className="whitespace-pre-wrap leading-relaxed">{result.answer}</p>
                            
                            {result.sources.length > 0 && (
                                <div className="mt-8 pt-4 border-t border-content/10">
                                    <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                        <LinkIcon size={18}/>
                                        Sources
                                    </h4>
                                    <ul className="space-y-2">
                                        {result.sources.map((source, index) => source.web && (
                                            <li key={index}>
                                                <a 
                                                    href={source.web.uri} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-sky-400 hover:text-sky-300 hover:underline transition-colors text-sm"
                                                >
                                                    {index + 1}. {source.web.title}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                    {!isLoading && !error && !result && <p className="text-content/60 text-center mt-16">The AI-generated answer will appear here.</p>}
                </div>
            </div>
        </div>
    );
};

export default WebGroundedQA;
