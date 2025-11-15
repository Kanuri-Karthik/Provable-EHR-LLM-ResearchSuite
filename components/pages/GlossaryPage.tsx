
import React from 'react';
import { motion } from 'framer-motion';

const glossaryTerms = [
    {
        term: 'Zero-Hallucination',
        definition: 'In the context of LLMs, hallucination refers to generating information that is nonsensical or factually incorrect. A "zero-hallucination" model aims to eliminate such outputs, ensuring all generated text is factually grounded and coherent.'
    },
    {
        term: 'Provenance',
        definition: 'The origin or source of information. In provenance-based summarization, every piece of the summary is linked back to the specific part of the source document it came from, ensuring traceability and verifiability.'
    },
    {
        term: 'Multimodal Data Fusion',
        definition: 'The process of combining data from multiple sources and formats (e.g., text, images, numerical data) to generate more accurate and comprehensive insights than could be derived from any single source alone.'
    },
    {
        term: 'Algorithmic Bias',
        definition: 'Systematic and repeatable errors in a computer system that create unfair outcomes, such as privileging one arbitrary group of users over others. Monitoring for and mitigating bias is crucial for equitable AI.'
    },
    {
        term: 'PII (Personally Identifiable Information)',
        definition: 'Any data that could potentially identify a specific individual. Examples include names, addresses, phone numbers, and social security numbers. De-identification is the process of removing PII from data to protect privacy.'
    },
    {
        term: 'Grounded Model',
        definition: 'An AI model whose outputs are tied to verifiable sources of information, such as web search results or specific documents. This helps to reduce hallucinations and increases the reliability of the model\'s answers.'
    },
];

const GlossaryPage: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
        >
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold">Glossary of Terms</h1>
                <p className="mt-3 text-lg text-content/70">Key concepts and terminology used in the Provable-EHR-LLM Research Suite.</p>
            </div>

            <div className="space-y-8">
                {glossaryTerms.map((item, index) => (
                    <motion.div
                        key={item.term}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="p-6 bg-bkg/50 border border-content/10 rounded-lg"
                    >
                        <h2 className="text-2xl font-semibold text-sky-400">{item.term}</h2>
                        <p className="mt-2 text-content/90 leading-relaxed">{item.definition}</p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default GlossaryPage;
