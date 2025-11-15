

import React, { useState, useEffect } from 'react';
import { DUMMY_EHR_DATA } from '../../constants';
import { generateProvenanceSummary } from '../../services/geminiService';
import { getSummaries, deleteSummary } from '../../services/databaseService';
import type { ProvenanceResult, SavedSummary } from '../../types';
import Button from '../ui/Button';
import Loader from '../ui/Loader';
import { motion } from 'framer-motion';
import { History, Eye, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ExportButton from '../ui/ExportButton';

const ProvenanceSummarization: React.FC = () => {
    const [ehrData, setEhrData] = useState(DUMMY_EHR_DATA);
    const [result, setResult] = useState<ProvenanceResult | null>(null);
    const [history, setHistory] = useState<SavedSummary[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isHistoryLoading, setIsHistoryLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const loadHistory = async () => {
            setIsHistoryLoading(true);
            const savedSummaries = await getSummaries();
            setHistory(savedSummaries);
            setIsHistoryLoading(false);
        };
        loadHistory();
    }, []);

    const refreshHistory = async () => {
        const savedSummaries = await getSummaries();
        setHistory(savedSummaries);
    };

    const handleGenerate = async () => {
        setIsLoading(true);
        setResult(null);
        setError('');
        try {
            const res = await generateProvenanceSummary(ehrData);
            setResult(res);
        } catch (e: any) {
            console.error("Failed to generate summary:", e);
            setError(e.message || "An unknown error occurred. Please check the format of your JSON.");
        } finally {
            setIsLoading(false);
            await refreshHistory();
        }
    };

    const handleViewHistory = (item: SavedSummary) => {
        setEhrData(item.ehrData);
        setResult(item.result);
        setError('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteHistory = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this summary from history?")) {
            await deleteSummary(id);
            await refreshHistory();
             // Clear the main view if the deleted item was being displayed
            if (result && history.find(h => h.id === id)?.result.summary === result.summary) {
                setResult(null);
            }
        }
    };
    
    const renderSummaryWithProvenance = () => {
        if (!result) return null;
        let summaryHtml = result.summary;
        
        result.provenance.forEach((item) => {
            const regex = new RegExp(item.text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
            const colorClass = `bg-sky-500/20 text-sky-300`;
            summaryHtml = summaryHtml.replace(regex, 
                `<span class="relative group rounded px-1 py-0.5 ${colorClass} cursor-pointer">
                    $&
                    <span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        Source: ${item.source}
                    </span>
                </span>`
            );
        });

        return <p className="leading-relaxed" dangerouslySetInnerHTML={{ __html: summaryHtml }} />;
    };

    return (
        <div>
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-lg font-semibold mb-2">EHR Data (JSON)</h3>
                    <textarea
                        className="w-full h-96 p-2 bg-bkg border border-content/20 rounded-md font-mono text-sm"
                        value={ehrData}
                        onChange={(e) => setEhrData(e.target.value)}
                    />
                    <Button onClick={handleGenerate} isLoading={isLoading} className="mt-4">
                        Generate & Save Summary
                    </Button>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">Generated Summary with Provenance</h3>
                        <ExportButton data={result} filename="provenance-summary" format="json" />
                    </div>
                    <div className="w-full h-96 p-4 bg-bkg border border-content/20 rounded-md overflow-y-auto">
                        {isLoading && <Loader />}
                        {error && <div className="text-red-400 p-4 bg-red-500/10 rounded-md">{error}</div>}
                        {result && (
                             <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                {renderSummaryWithProvenance()}
                            </motion.div>
                        )}
                    </div>
                    <p className="text-sm text-content/60 mt-2">Hover over highlighted text to see its source.</p>
                </div>
            </div>

            <div className="mt-12">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <History size={20} />
                    Generation History
                </h3>
                <div className="w-full max-h-96 overflow-y-auto bg-bkg border border-content/20 rounded-md">
                    {isHistoryLoading ? <div className="p-4"><Loader /></div> : (
                        history.length === 0 ? <p className="p-4 text-content/60">No history found. Generate a summary to see it here.</p> : (
                            <ul className="divide-y divide-content/10">
                                {history.map(item => (
                                    <li key={item.id} className="p-3 flex justify-between items-center hover:bg-content/5 transition-colors">
                                        <div>
                                            <p className="font-semibold">Summary from {new Date(item.timestamp).toLocaleString()}</p>
                                            <p className="text-sm text-content/70 mt-1 font-mono truncate max-w-md">{item.result.summary}</p>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                                            <button onClick={() => handleViewHistory(item)} title="View" className="p-2 rounded-full hover:bg-content/10 text-content/80"><Eye size={16}/></button>
                                            {user?.role === 'admin' && (
                                                <button onClick={() => handleDeleteHistory(item.id)} title="Delete" className="p-2 rounded-full hover:bg-red-500/20 text-red-400"><Trash2 size={16}/></button>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProvenanceSummarization;
