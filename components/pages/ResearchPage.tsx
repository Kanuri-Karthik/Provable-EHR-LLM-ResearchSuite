
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Share2 } from 'lucide-react';

const researchPapers = [
    {
        title: 'Ensuring Zero-Hallucination in Clinical Report Generation',
        authors: 'Smith, J., et al.',
        journal: 'Journal of Medical AI Research, 2023',
    },
    {
        title: 'A Framework for Traceable Provenance in EHR Summarization',
        authors: 'Chen, L., et al.',
        journal: 'AI in Medicine Conference, 2023',
    },
    {
        title: 'Mitigating Bias in Multimodal Clinical AI Systems',
        authors: 'Patel, S., et al.',
        journal: 'Nature Digital Medicine, 2024',
    },
];

const ResearchPage: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
        >
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold">Research Library</h1>
                <p className="mt-3 text-lg text-content/70">Access whitepapers, documentation, and architecture diagrams related to our work.</p>
            </div>
            
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 border-b border-content/20 pb-2">Published Papers</h2>
                <div className="space-y-4">
                    {researchPapers.map((paper, index) => (
                         <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="p-4 bg-bkg/50 border border-content/10 rounded-lg flex justify-between items-center"
                        >
                            <div className="flex items-start gap-4">
                                <FileText className="w-8 h-8 text-sky-400 mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-content">{paper.title}</h3>
                                    <p className="text-sm text-content/70">{paper.authors} - <em>{paper.journal}</em></p>
                                </div>
                            </div>
                            <button className="p-2 rounded-full hover:bg-content/10" title="Download (mock)">
                                <Download size={20} />
                            </button>
                        </motion.div>
                    ))}
                </div>
            </section>
            
            <section>
                <h2 className="text-2xl font-bold mb-6 border-b border-content/20 pb-2">System Architecture</h2>
                 <div className="p-6 bg-bkg/50 border border-content/10 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">AI-Generated RAG Pipeline Diagram</h3>
                    <div className="w-full p-4 bg-bkg border-2 border-dashed border-content/20 rounded-lg flex items-center justify-center min-h-[300px]">
                        <div className="text-center text-content/60">
                            <Share2 size={40} className="mx-auto mb-2"/>
                            <p>Mock AI-generated architecture diagram will be displayed here.</p>
                            <p className="text-xs">(This feature is currently in development)</p>
                        </div>
                    </div>
                    <p className="text-sm mt-4 text-content/70">
                        This diagram illustrates our Retrieval-Augmented Generation (RAG) pipeline, which grounds the LLM's responses in a secure, curated knowledge base of clinical information to improve accuracy and reduce hallucinations.
                    </p>
                 </div>
            </section>

        </motion.div>
    );
};

export default ResearchPage;
