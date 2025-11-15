
export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  status: 'Success' | 'Failure';
}

const mockLogs: AuditLog[] = [
  { 
    id: 'log-1', 
    timestamp: new Date(Date.now() - 3600000).toISOString(), 
    user: 'admin@example.com', 
    action: 'User Role Change', 
    details: 'Changed role for test@example.com to "admin"', 
    status: 'Success' 
  },
  { 
    id: 'log-2', 
    timestamp: new Date(Date.now() - 7200000).toISOString(), 
    user: 'user@example.com', 
    action: 'Generate Summary', 
    details: 'Provenance summarization for patient P001', 
    status: 'Success' 
  },
  { 
    id: 'log-3', 
    timestamp: new Date(Date.now() - 8200000).toISOString(), 
    user: 'user@example.com', 
    action: 'Generate Summary', 
    details: 'Invalid JSON format provided', 
    status: 'Failure' 
  },
  { 
    id: 'log-4', 
    timestamp: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(), 
    user: 'system', 
    action: 'System Health Check', 
    details: 'All services operational', 
    status: 'Success' 
  },
  { 
    id: 'log-5', 
    timestamp: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(), 
    user: 'admin@example.com', 
    action: 'User Login', 
    details: 'Successful login from IP 192.168.1.1', 
    status: 'Success' 
  },
   { 
    id: 'log-6', 
    timestamp: new Date(Date.now() - 2.1 * 24 * 3600 * 1000).toISOString(), 
    user: 'guest', 
    action: 'User Login', 
    details: 'Failed login attempt for user unknown@example.com', 
    status: 'Failure' 
  },
];

export const getAuditLogs = async (): Promise<AuditLog[]> => {
  await new Promise(res => setTimeout(res, 400));
  return mockLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};
