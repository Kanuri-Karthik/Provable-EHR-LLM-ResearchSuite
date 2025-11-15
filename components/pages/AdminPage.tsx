


import React, { useState } from 'react';
import { BarChart2, Users, HeartPulse, ShieldCheck, Settings, ClipboardList } from 'lucide-react';
import AnalyticsDashboard from '../admin/AnalyticsDashboard';
import UserManagement from '../admin/UserManagement';
import SystemHealth from '../admin/SystemHealth';
import ContentModeration from '../admin/ContentModeration';
import AppSettings from '../admin/AppSettings';
import AuditLog from '../admin/AuditLog';
import { motion } from 'framer-motion';

const tabs = [
    { name: 'Analytics', icon: BarChart2, component: AnalyticsDashboard },
    { name: 'User Management', icon: Users, component: UserManagement },
    { name: 'System Health', icon: HeartPulse, component: SystemHealth },
    { name: 'Audit Log', icon: ClipboardList, component: AuditLog },
    { name: 'Content Moderation', icon: ShieldCheck, component: ContentModeration },
    { name: 'Settings', icon: Settings, component: AppSettings },
];

const AdminPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState(tabs[0].name);

    const ActiveComponent = tabs.find(tab => tab.name === activeTab)?.component;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
            <div className="flex flex-col md:flex-row gap-8">
                <aside className="md:w-1/4 lg:w-1/5">
                    <nav className="flex flex-col space-y-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.name}
                                onClick={() => setActiveTab(tab.name)}
                                className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                    activeTab === tab.name
                                        ? 'bg-sky-600 text-white'
                                        : 'text-content/80 hover:bg-content/10'
                                }`}
                            >
                                <tab.icon size={18} />
                                <span>{tab.name}</span>
                            </button>
                        ))}
                    </nav>
                </aside>
                <main className="flex-1 md:w-3/4 lg:w-4/5">
                    <div className="bg-bkg/30 border border-content/10 rounded-lg p-6 min-h-[60vh] backdrop-blur-md">
                        {ActiveComponent && <ActiveComponent />}
                    </div>
                </main>
            </div>
        </motion.div>
    );
};

export default AdminPage;