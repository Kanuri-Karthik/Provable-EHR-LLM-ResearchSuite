
import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Users, BarChart2, Activity, Eye } from 'lucide-react';

const featureUsageData = [
  { name: 'Summarization', usage: 4000 },
  { name: 'Multimodal', usage: 3000 },
  { name: 'Privacy', usage: 2000 },
  { name: 'Image Gen', usage: 2780 },
];

const dailyActivityData = [
  { day: 'Mon', users: 240 },
  { day: 'Tue', users: 310 },
  { day: 'Wed', users: 290 },
  { day: 'Thu', users: 450 },
  { day: 'Fri', users: 410 },
  { day: 'Sat', users: 580 },
  { day: 'Sun', users: 620 },
];

const StatCard: React.FC<{ title: string; value: string; icon: React.ElementType }> = ({ title, value, icon: Icon }) => (
    <div className="bg-bkg p-4 rounded-lg border border-content/10">
        <div className="flex items-center">
            <div className="p-3 rounded-full bg-sky-500/10 text-sky-400 mr-4">
                <Icon size={24} />
            </div>
            <div>
                <p className="text-sm text-content/70">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
        </div>
    </div>
);

const AnalyticsDashboard: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value="1,254" icon={Users} />
                <StatCard title="Daily Active Users" value="620" icon={Activity} />
                <StatCard title="API Success Rate" value="99.8%" icon={BarChart2} />
                <StatCard title="Projects Engaged" value="4,821" icon={Eye} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-bkg p-4 rounded-lg border border-content/10 h-80">
                    <h3 className="font-semibold mb-4">Feature Popularity</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={featureUsageData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                           <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                           <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.7)" fontSize={12} />
                           <YAxis stroke="rgba(255, 255, 255, 0.7)" fontSize={12} />
                           <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--bkg))', borderColor: 'rgba(255, 255, 255, 0.2)' }}/>
                           <Bar dataKey="usage" fill="#38bdf8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-bkg p-4 rounded-lg border border-content/10 h-80">
                    <h3 className="font-semibold mb-4">Daily Active Users (Last 7 Days)</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={dailyActivityData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                            <XAxis dataKey="day" stroke="rgba(255, 255, 255, 0.7)" fontSize={12} />
                            <YAxis stroke="rgba(255, 255, 255, 0.7)" fontSize={12} />
                            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--bkg))', borderColor: 'rgba(255, 255, 255, 0.2)' }} />
                            <Legend />
                            <Line type="monotone" dataKey="users" stroke="#38bdf8" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;