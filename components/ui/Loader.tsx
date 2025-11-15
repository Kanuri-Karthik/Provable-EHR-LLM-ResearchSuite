
import React from 'react';
import { Loader as LoaderIcon } from 'lucide-react';

const Loader: React.FC = () => {
    return (
        <div className="flex justify-center items-center h-full w-full">
            <LoaderIcon className="w-8 h-8 animate-spin text-primary-focus" />
        </div>
    );
};

export default Loader;
