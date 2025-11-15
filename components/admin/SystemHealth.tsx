
import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Wifi, Database } from 'lucide-react';

interface ServiceStatus {
    name: string;
    status: 'Operational' | 'Degraded' | 'Outage';
    responseTime: number;
    uptime: number;
    icon: React.ElementType;
}

const initialServices: ServiceStatus[] = [
    { name: 'Authentication API', status: 'Operational', responseTime: 50, uptime: 99.98, icon: Wifi },
    { name: 'LLM Gateway', status: 'Operational', responseTime: 120, uptime: 99.95, icon: Wifi },
    { name: 'Database Service', status: 'Operational', responseTime: 30, uptime: 99.99, icon: Database },
];

const SystemHealth: React.FC = () => {
    const [services, setServices] = useState<ServiceStatus[]>(initialServices);

    useEffect(() => {
        const interval = setInterval(() => {
            setServices(prevServices =>
                prevServices.map(service => ({
                    ...service,
                    responseTime: Math.max(20, service.responseTime + (Math.random() * 20 - 10)),
                }))
            );
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const getStatusIndicator = (status: ServiceStatus['status']) => {
        switch (status) {
            case 'Operational':
                return { icon: <CheckCircle2 className="text-green-400" />, text: 'text-green-400' };
            case 'Degraded':
                return { icon: <AlertTriangle className="text-yellow-400" />, text: 'text-yellow-400' };
            case 'Outage':
                return { icon: <AlertTriangle className="text-red-400" />, text: 'text-red-400' };
            default:
                return { icon: null, text: '' };
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold">System Health Monitoring</h2>
            <div className="space-y-4">
                {services.map(service => (
                    <div key={service.name} className="bg-bkg p-4 rounded-lg border border-content/10 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                             <service.icon className="text-content/70" size={24} />
                            <div>
                               <p className="font-semibold">{service.name}</p>
                               <div className={`flex items-center gap-2 text-sm ${getStatusIndicator(service.status).text}`}>
                                  {getStatusIndicator(service.status).icon}
                                  <span>{service.status}</span>
                               </div>
                            </div>
                        </div>
                        <div className="text-right">
                           <p className="text-sm text-content/70">Response Time</p>
                           <p className="font-semibold">{service.responseTime.toFixed(0)} ms</p>
                        </div>
                        <div className="text-right">
                           <p className="text-sm text-content/70">Uptime (30d)</p>
                           <p className="font-semibold">{service.uptime}%</p>
                        </div>
                    </div>
                ))}
            </div>
             <div className="p-4 bg-green-900/50 border border-green-700 rounded-md text-green-200 text-center">
                All systems are currently operational.
            </div>
        </div>
    );
};

export default SystemHealth;
