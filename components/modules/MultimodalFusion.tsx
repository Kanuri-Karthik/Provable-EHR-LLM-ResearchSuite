

import React, { useState, useMemo } from 'react';
import { DUMMY_DOCTOR_NOTE, DUMMY_VITALS_CSV } from '../../constants';
import { generateMultimodalSummary, fileToBase64 } from '../../services/geminiService';
import Button from '../ui/Button';
import Loader from '../ui/Loader';
import ExportButton from '../ui/ExportButton';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Upload } from 'lucide-react';

const MultimodalFusion: React.FC = () => {
    const vitalsData = useMemo(() => DUMMY_VITALS_CSV.split('\n').slice(1).map(line => {
        const [date, heart_rate, blood_pressure, temperature_c] = line.split(',');
        const [systolic, diastolic] = blood_pressure.split('/');
        return { date, heart_rate: parseInt(heart_rate), systolic: parseInt(systolic), diastolic: parseInt(diastolic) };
    }), []);

    const [notes, setNotes] = useState(DUMMY_DOCTOR_NOTE);
    const [vitals, setVitals] = useState(DUMMY_VITALS_CSV);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleGenerate = async () => {
        if (!imageFile) {
            setError("Please upload an image to proceed.");
            return;
        }
        setIsLoading(true);
        setError('');
        setSummary('');
        try {
            const imageBase64 = await fileToBase64(imageFile);
            const result = await generateMultimodalSummary(notes, vitals, imageBase64, imageFile.type);
            setSummary(result);
        } catch (e: any) {
            setError(e.message || "An error occurred while generating the summary.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
                <div>
                    <h3 className="text-lg font-semibold mb-2">Patient Text Notes</h3>
                    <textarea className="w-full h-48 p-2 bg-bkg border border-content/20 rounded-md font-mono text-sm" value={notes} onChange={e => setNotes(e.target.value)} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-2">Sample Medical Image</h3>
                    <label className="w-full h-48 flex flex-col items-center justify-center bg-bkg border-2 border-dashed border-content/20 rounded-md cursor-pointer hover:border-primary-focus">
                        {imagePreview ? <img src={imagePreview} alt="Medical scan" className="max-h-full max-w-full object-contain" /> : <div className="flex flex-col items-center gap-2 text-content/60"><Upload /><p>Click to upload</p></div>}
                        <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                    </label>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-2">Vitals (CSV)</h3>
                    <textarea className="w-full h-48 p-2 bg-bkg border border-content/20 rounded-md font-mono text-sm" value={vitals} onChange={e => setVitals(e.target.value)} />
                </div>
            </div>

            <Button onClick={handleGenerate} isLoading={isLoading}>Fuse Inputs & Generate Summary</Button>
            {error && <p className="text-red-400 mt-4">{error}</p>}
            
            <div className="mt-8 grid lg:grid-cols-2 gap-8">
                 <div>
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">Generated Longitudinal Insight</h3>
                        <ExportButton data={summary} filename="multimodal-summary" format="txt" />
                    </div>
                    <div className="w-full min-h-[24rem] p-4 bg-bkg border border-content/20 rounded-md">
                        {isLoading ? <Loader /> : <p className="leading-relaxed whitespace-pre-wrap">{summary || "Summary will appear here..."}</p>}
                    </div>
                 </div>
                 <div>
                    <h3 className="text-lg font-semibold mb-2">Patient Health Progression</h3>
                    <div className="w-full h-96 p-4 bg-bkg border border-content/20 rounded-md">
                         <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={vitalsData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                                <XAxis dataKey="date" stroke="rgba(255, 255, 255, 0.7)" />
                                <YAxis yAxisId="left" stroke="#8884d8" label={{ value: 'BP (mmHg)', angle: -90, position: 'insideLeft', fill: '#8884d8' }}/>
                                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" label={{ value: 'Heart Rate', angle: -90, position: 'insideRight', fill: '#82ca9d' }} />
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--bkg))', borderColor: 'rgba(255, 255, 255, 0.2)' }} />
                                <Legend />
                                <Line yAxisId="left" type="monotone" dataKey="systolic" stroke="#8884d8" name="Systolic BP" />
                                <Line yAxisId="left" type="monotone" dataKey="diastolic" stroke="#ffc658" name="Diastolic BP" />
                                <Line yAxisId="right" type="monotone" dataKey="heart_rate" stroke="#82ca9d" name="Heart Rate" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default MultimodalFusion;
