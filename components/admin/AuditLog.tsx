
import React, { useState, useEffect, useMemo } from 'react';
import { getAuditLogs, AuditLog as AuditLogType } from '../../services/adminService';
import Loader from '../ui/Loader';
import { Search } from 'lucide-react';

const AuditLog: React.FC = () => {
    const [logs, setLogs] = useState<AuditLogType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'All' | 'Success' | 'Failure'>('All');

    useEffect(() => {
        const fetchLogs = async () => {
            setIsLoading(true);
            try {
                const logData = await getAuditLogs();
                setLogs(logData);
            } catch (e: any) {
                setError(e.message || "Failed to fetch audit logs.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const filteredLogs = useMemo(() => {
        return logs
            .filter(log => filterStatus === 'All' || log.status === filterStatus)
            .filter(log => 
                log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.details.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [logs, searchTerm, filterStatus]);
    
    const statusColor = (status: 'Success' | 'Failure') => {
        return status === 'Success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400';
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold">Audit Log</h2>
            <div className="flex flex-col sm:flex-row gap-4">
                 <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={16} className="text-content/50" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search logs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-bkg border border-content/20 rounded-md text-sm placeholder:text-content/60 focus:outline-none focus:ring-1 focus:ring-primary-focus"
                    />
                </div>
                 <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="p-2 bg-bkg border border-content/20 rounded-md text-sm"
                >
                    <option value="All">All Statuses</option>
                    <option value="Success">Success</option>
                    <option value="Failure">Failure</option>
                </select>
            </div>
            {isLoading ? <Loader /> : error ? <p className="text-red-400">{error}</p> : (
                <div className="overflow-x-auto bg-bkg border border-content/10 rounded-lg">
                    <table className="min-w-full divide-y divide-content/10">
                        <thead className="bg-content/5">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Timestamp</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">User</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Action</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Details</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-content/10">
                            {filteredLogs.map(log => (
                                <tr key={log.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-content/80">{new Date(log.timestamp).toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{log.user}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{log.action}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-content/80 truncate max-w-xs">{log.details}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColor(log.status)}`}>
                                            {log.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AuditLog;
