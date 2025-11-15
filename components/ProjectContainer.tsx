


import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { PROJECTS } from '../constants';

const ProjectContainer: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const project = PROJECTS.find(p => p.id === id);

    if (!project) {
        return (
            <div className="text-center">
                <h2 className="text-2xl font-bold">Project not found</h2>
                <Link to="/" className="text-primary-focus hover:underline mt-4 inline-block">
                    Go back to Home
                </Link>
            </div>
        );
    }

    const ProjectComponent = project.component;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
        >
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-content/80 hover:text-primary-focus mb-6 transition-colors">
                <ArrowLeft size={16} />
                Back to Projects
            </Link>
            <div className="text-center mb-10">
                <project.Icon className="w-12 h-12 mx-auto mb-4 text-sky-400" />
                <h1 className="text-3xl md:text-4xl font-bold">{project.title}</h1>
                <p className="mt-3 max-w-3xl mx-auto text-content/70">{project.description}</p>
            </div>
            
            <div className="bg-bkg/30 border border-content/10 rounded-lg p-4 sm:p-6 lg:p-8 backdrop-blur-md">
                <ProjectComponent />
            </div>
        </motion.div>
    );
};

export default ProjectContainer;