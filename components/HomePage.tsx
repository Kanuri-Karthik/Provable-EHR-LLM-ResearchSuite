

import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PROJECTS } from '../constants';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
    const { user } = useAuth();

    const visibleProjects = useMemo(() => {
        // Show all projects to all users for better discoverability of features
        return PROJECTS;
    }, []);

    return (
        <div className="relative flex flex-col items-center justify-center text-center -mt-10">
            
            <div className="z-10 relative animate-fade-in">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-content mb-4">
                    Provable-EHR-LLM Research Suite
                </h1>
                <p className="text-lg md:text-xl text-content/80 max-w-3xl mx-auto">
                    Building Safe, Faithful, and Equitable Clinical AI
                </p>
            </div>

            <div className="z-10 relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-16 w-full max-w-7xl">
                {visibleProjects.map((project) => (
                    <div key={project.id} className="animate-fade-in">
                        <Link to={`/project/${project.id}`} className="block group project-card">
                            <div className="p-6 h-full flex flex-col items-center text-center bg-bkg/30 rounded-xl border border-content/10 backdrop-blur-md transition-all duration-300 hover:border-primary-focus hover:scale-105 hover:bg-content/10">
                                <div className="mb-4 p-4 rounded-full bg-sky-500/10 text-sky-400 group-hover:animate-glow">
                                    <project.Icon className="w-10 h-10" />
                                </div>
                                <h3 className="text-md font-bold text-content mb-2">{project.title}</h3>
                                <p className="text-sm text-content/70 flex-grow">{project.tagline}</p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;