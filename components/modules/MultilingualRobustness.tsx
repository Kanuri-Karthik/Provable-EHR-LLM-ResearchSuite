

import React, { useState, useCallback } from 'react';
import { DUMMY_MULTILINGUAL_NOTE } from '../../constants';
import { checkMultilingualConsistency } from '../../services/geminiService';
import Button from '../ui/Button';
import Loader from '../ui/Loader';
import ExportButton from '../ui/ExportButton';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

const languages = [
    { code: 'english', name: 'English' },
    { code: 'hindi', name: 'Hindi' },
    { code: 'telugu', name: 'Telugu' },
];

const consistencyData = [
  { language: 'English', score: 100, fullMark: 100 },
  { language: 'Hindi', score: 95, fullMark: 100 },
  { language: 'Telugu', score: 92, fullMark: 100 },
  { language: 'Spanish', score: 98, fullMark: 100 },
  { language: 'French', score: 96, fullMark: 100 },
  { language: 'Mandarin', score: 89, fullMark: 100 },
];

const MultilingualRobustness: React.FC = () => {
    const [selectedLang, setSelectedLang] = useState('hindi');
    const [note, setNote] = useState(DUMMY_MULTILINGUAL_NOTE.hindi);
    const [result, setResult] = useState<{ score: number; translation: string; explanation: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLanguageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const lang = e.target.value as keyof typeof DUMMY_MULTILINGUAL_NOTE;
        setSelectedLang(lang);
        setNote(DUMMY_MULTILINGUAL_NOTE[lang]);
        setResult(null);
        setError('');
    }, []);

    const handleCheck = async () => {
        setIsLoading(true);
        setResult(null);
        setError('');
        try {
            const res = await checkMultilingualConsistency(note, selectedLang);
            setResult(res);
        } catch (e: any) {
            setError(e.message || "An error occurred during consistency check.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <div>
                 <div className="flex items-center gap-4 mb-4">
                    <label htmlFor="language-select">Select Language:</label>
                    <select
                        id="language-select"
                        value={selectedLang}
                        onChange={handleLanguageChange}
                        className="p-2 bg-bkg border border-content/20 rounded-md"
                    >
                        {languages.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
                    </select>
                </div>
                <h3 className="text-lg font-semibold mb-2">Original Clinical Note</h3>
                <textarea
                    className="w-full h-40 p-2 bg-bkg border border-content/20 rounded-md font-mono text-sm"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />
                <Button onClick={handleCheck} isLoading={isLoading} className="mt-4">
                    Check Consistency
                </Button>
                
                {isLoading && <div className="mt-4"><Loader /></div>}
                {error && <div className="mt-4 text-red-400 p-4 bg-red-500/10 rounded-md">{error}</div>}

                {result && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-6 space-y-4"
                    >
                        <div>
                            <h3 className="text-lg font-semibold mb-2">English Translation</h3>
                            <div className="p-4 bg-bkg border border-content/20 rounded-md text-content/90">{result.translation}</div>
                        </div>
                        <div>
                             <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-semibold">Faithfulness Analysis</h3>
                                <ExportButton data={result} filename="consistency-analysis" format="json" />
                            </div>
                             <div className="p-4 bg-bkg border border-content/20 rounded-md text-content/90">
                                <p className="font-bold text-xl text-green-400 mb-2">Consistency Score: {result.score}/100</p>
                                <p>{result.explanation}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-2">Cross-Lingual Faithfulness</h3>
                <div className="w-full h-[28rem] p-4 bg-bkg border border-content/20 rounded-md">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={consistencyData}>
                            <PolarGrid stroke="rgba(255, 255, 255, 0.2)"/>
                            <PolarAngleAxis dataKey="language" stroke="rgba(255, 255, 255, 0.7)" />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255, 255, 255, 0.2)" />
                            <Radar name="Consistency Score" dataKey="score" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.6} />
                            <Legend />
                             <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--bkg))', borderColor: 'rgba(255, 255, 255, 0.2)' }} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
                 <p className="text-sm text-content/60 mt-2">Mock data showing LLM faithfulness scores across languages.</p>
            </div>
        </div>
    );
};

export default MultilingualRobustness;
