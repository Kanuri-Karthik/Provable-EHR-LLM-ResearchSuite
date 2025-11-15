

import React, { useState } from 'react';
import { DUMMY_PII_TEXT } from '../../constants';
import { deidentifyText } from '../../services/geminiService';
import Button from '../ui/Button';
import Loader from '../ui/Loader';
import ExportButton from '../ui/ExportButton';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAuth } from '../../contexts/AuthContext';

const fairnessData = [
  { name: 'Gender', biasScore: 8, ideal: 5 },
  { name: 'Age', biasScore: 12, ideal: 5 },
  { name: 'Ethnicity', biasScore: 6, ideal: 5 },
  { name: 'Geography', biasScore: 15, ideal: 5 },
];


const PrivacyEquitable: React.FC = () => {
    const [inputText, setInputText] = useState(DUMMY_PII_TEXT);
    const [outputText, setOutputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { user } = useAuth();
    
    const handleAnonymize = async () => {
        setIsLoading(true);
        setError('');
        setOutputText('');
        try {
            const result = await deidentifyText(inputText);
            setOutputText(result);
        } catch(e: any) {
            setError(e.message || "An error occurred during anonymization.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`grid ${user?.role === 'admin' ? 'lg:grid-cols-2' : 'grid-cols-1'} gap-8`}>
            <div>
                <h3 className="text-lg font-semibold mb-2">Input Text with PII</h3>
                <textarea
                    className="w-full h-48 p-2 bg-bkg border border-content/20 rounded-md font-mono text-sm"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                />
                <Button onClick={handleAnonymize} isLoading={isLoading} className="mt-4">
                    Anonymize Data
                </Button>
                <div className="flex justify-between items-center mt-8 mb-2">
                    <h3 className="text-lg font-semibold">De-identified Output</h3>
                    <ExportButton data={outputText} filename="de-identified-text" format="txt" />
                </div>
                 <div className="w-full h-48 p-4 bg-bkg border border-content/20 rounded-md font-mono text-sm">
                    {isLoading ? <Loader /> : error ? <span className="text-red-400">{error}</span> : outputText || 'Output will appear here...'}
                 </div>
            </div>
            {user?.role === 'admin' && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">Fairness Metrics Dashboard</h3>
                    <div className="w-full h-96 p-4 bg-bkg border border-content/20 rounded-md">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={fairnessData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                                <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.7)" />
                                <YAxis stroke="rgba(255, 255, 255, 0.7)" label={{ value: 'Bias Score', angle: -90, position: 'insideLeft', fill: 'rgba(255, 255, 255, 0.7)' }}/>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--bkg))',
                                        borderColor: 'rgba(255, 255, 255, 0.2)',
                                    }}
                                />
                                <Bar dataKey="biasScore" fill="#38bdf8" name="Detected Bias" />
                                <Bar dataKey="ideal" fill="#f87171" name="Acceptable Threshold" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-sm text-content/60 mt-2">Mock data showing bias scores across different demographic categories.</p>
                </div>
            )}
        </div>
    );
};

export default PrivacyEquitable;
