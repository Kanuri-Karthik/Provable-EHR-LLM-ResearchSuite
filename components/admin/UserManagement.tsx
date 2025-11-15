

import React, { useState, useEffect, useCallback } from 'react';
import * as authService from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../types';
import { Edit, Trash2 } from 'lucide-react';
import Loader from '../ui/Loader';

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const { user: currentUser } = useAuth();

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const userList = await authService.getAllUsers();
            setUsers(userList);
        } catch (e: any) {
            setError(e.message || "Failed to fetch users.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleRoleChange = async (userId: string, newRole: 'user' | 'admin') => {
        if (currentUser?.id === userId) {
            alert("You cannot change your own role.");
            return;
        }
        try {
            await authService.updateUser(userId, { role: newRole });
            await fetchUsers(); // Refresh the list
        } catch (e: any) {
            alert(`Failed to update role: ${e.message}`);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (currentUser?.id === userId) {
            alert("You cannot delete your own account.");
            return;
        }
        if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            try {
                await authService.deleteUser(userId);
                await fetchUsers();
            } catch (e: any) {
                alert(`Failed to delete user: ${e.message}`);
            }
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold">User Management</h2>
            {isLoading ? <Loader /> : error ? <p className="text-red-400">{error}</p> : (
                <div className="overflow-x-auto bg-bkg border border-content/10 rounded-lg">
                    <table className="min-w-full divide-y divide-content/10">
                        <thead className="bg-content/5">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Role</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-content/10">
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-content/80">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value as 'user' | 'admin')}
                                            disabled={currentUser?.id === user.id}
                                            className="bg-bkg border border-content/20 rounded-md p-1 focus:ring-sky-500 focus:border-sky-500 disabled:opacity-70"
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button 
                                            onClick={() => handleDeleteUser(user.id)}
                                            disabled={currentUser?.id === user.id}
                                            className="text-red-400 hover:text-red-600 disabled:text-gray-500 disabled:cursor-not-allowed"
                                            title="Delete user"
                                        >
                                            <Trash2 size={18} />
                                        </button>
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

export default UserManagement;