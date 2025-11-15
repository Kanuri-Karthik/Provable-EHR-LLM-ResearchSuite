import React, { useContext } from 'react';
import { ThemeContext } from '../../App';

const AppSettings: React.FC = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    const handlePrimaryColorChange = (color: string) => {
        // In a real app, you would save this to a global state/context
        // and have your CSS variables update accordingly.
        // For this demo, it's a mock.
        console.log(`Primary color changed to: ${color}`);
        alert(`Theme color changed to ${color}. (This is a mock setting)`);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <h2 className="text-2xl font-bold">Application Settings</h2>
            
            <div className="p-4 border border-content/10 rounded-lg">
                <h3 className="font-semibold mb-2">Appearance</h3>
                <div className="flex items-center justify-between">
                    <label htmlFor="theme-toggle" className="text-content/90">Theme</label>
                    <span className="px-4 py-2 text-sm text-content/70">Light (Default)</span>
                </div>
                 <div className="flex items-center justify-between mt-4">
                    <label className="text-content/90">Primary Color</label>
                    <div className="flex gap-2">
                       {['sky', 'green', 'purple', 'orange'].map(color => (
                           <button key={color} onClick={() => handlePrimaryColorChange(color)} className={`w-8 h-8 rounded-full bg-${color}-500 border-2 border-transparent focus:border-white`}></button>
                       ))}
                    </div>
                </div>
            </div>

            <div className="p-4 border border-content/10 rounded-lg">
                <h3 className="font-semibold mb-2">Functionality</h3>
                <div className="flex items-center justify-between">
                    <label htmlFor="maintenance-mode" className="text-content/90">Maintenance Mode</label>
                    <p className="text-sm text-content/60">Toggle not implemented</p>
                </div>
                 <div className="flex items-center justify-between mt-4">
                    <label htmlFor="chatbot-enable" className="text-content/90">Enable AI Chatbot</label>
                    <p className="text-sm text-content/60">Toggle not implemented</p>
                </div>
            </div>
        </div>
    );
};

export default AppSettings;