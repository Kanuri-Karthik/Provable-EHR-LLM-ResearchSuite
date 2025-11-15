
import React, { useState, useMemo } from 'react';
import { DUMMY_DOCTOR_NOTE } from '../../constants';
import type { ValidationResult } from '../../types';
import Button from '../ui/Button';
import { CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ZeroHallucination: React.FC = () => {
    const [note, setNote] = useState(DUMMY_DOCTOR_NOTE);
    const [validationLog, setValidationLog] = useState<ValidationResult[]>([]);

    const workflowRules: { name: string; check: (text: string) => boolean }[] = useMemo(() => [
        { name: "Contains SUBJECTIVE section", check: text => /SUBJECTIVE:/.test(text) },
        { name: "Contains OBJECTIVE section", check: text => /OBJECTIVE:/.test(text) },
        { name: "Contains ASSESSMENT section", check: text => /ASSESSMENT:/.test(text) },
        { name: "Contains PLAN section", check: text => /PLAN:/.test(text) },
        { name: "Plan includes numbered list", check: text => /PLAN:\s*\n\s*1\./.test(text) },
    ], []);

    const handleValidate = () => {
        const results = workflowRules.map(rule => ({
            passed: rule.check(note),
            message: rule.name
        }));
        setValidationLog(results);
    };

    return (
        <div className="grid md:grid-cols-2 gap-8">
            <div>
                <h3 className="text-lg font-semibold mb-2">Doctor's Note Draft</h3>
                <textarea
                    className="w-full h-96 p-2 bg-bkg border border-content/20 rounded-md font-mono text-sm"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />
                <Button onClick={handleValidate} className="mt-4">
                    Validate Workflow
                </Button>
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-2">Validation Log</h3>
                <div className="w-full h-96 p-4 bg-bkg border border-content/20 rounded-md overflow-y-auto">
                    {validationLog.length === 0 && <p className="text-content/60">Click "Validate Workflow" to check the note.</p>}
                    <ul className="space-y-2">
                        <AnimatePresence>
                        {validationLog.map((result, index) => (
                            <motion.li 
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className={`flex items-center gap-3 p-2 rounded-md ${result.passed ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}
                            >
                                {result.passed ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                                <span>{result.message}</span>
                            </motion.li>
                        ))}
                        </AnimatePresence>
                    </ul>
                </div>
                 <div className="mt-4 p-4 border border-content/20 rounded-md bg-bkg">
                    <h4 className="font-semibold mb-2">Reference Workflow</h4>
                    <ol className="list-decimal list-inside text-sm text-content/80">
                        <li>SUBJECTIVE section present</li>
                        <li>OBJECTIVE section present</li>
                        <li>ASSESSMENT section present</li>
                        <li>PLAN section present</li>
                        <li>PLAN is a numbered list</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default ZeroHallucination;
