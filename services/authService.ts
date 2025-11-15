
import { User } from '../types';

const USERS_DB_KEY = 'users_db';
const AUTH_SESSION_KEY = 'auth_session';

let dbInitialized = false;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const initializeUsersDB = () => {
    if (dbInitialized) return;
    try {
        const usersJson = localStorage.getItem(USERS_DB_KEY);
        if (!usersJson) {
            const adminUser: User = { id: 'admin-001', name: 'Admin User', email: 'admin@example.com', role: 'admin' };
            const regularUser: User = { id: 'user-001', name: 'Regular User', email: 'user@example.com', role: 'user' };
            const users = {
                'admin@example.com': { ...adminUser, password: 'admin123' },
                'user@example.com': { ...regularUser, password: 'user123' },
            };
            localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
        }
        dbInitialized = true; // Mark as initialized only on success
    } catch (error) {
        console.error("Failed to initialize user DB in localStorage:", error);
        // Do not set dbInitialized to true if it fails
    }
};

const getUsers = () => {
    initializeUsersDB();
    try {
        const usersJson = localStorage.getItem(USERS_DB_KEY);
        return usersJson ? JSON.parse(usersJson) : {};
    } catch (error) {
        console.error("Failed to get users from localStorage:", error);
        return {};
    }
};

const saveUsers = (users: any) => {
    try {
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    } catch (error) {
        console.error("Failed to save users to localStorage:", error);
    }
};

export const getAllUsers = async (): Promise<User[]> => {
    await delay(300);
    const usersData = getUsers();
    return Object.values(usersData).map((u: any) => ({
        id: u.id, name: u.name, email: u.email, role: u.role
    }));
};

export const updateUser = async (userId: string, updates: Partial<User>): Promise<User> => {
    await delay(300);
    const users = getUsers();
    const userEmail = Object.keys(users).find(email => users[email].id === userId);
    if (!userEmail) throw new Error("User not found");
    
    users[userEmail] = { ...users[userEmail], ...updates };
    saveUsers(users);
    
    // Also update current session if the edited user is the logged-in one
    const currentUser = getCurrentUser();
    if(currentUser && currentUser.id === userId) {
        try {
            localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({ ...currentUser, ...updates }));
        } catch(e) { console.error(e); }
    }
    
    const { password, ...userWithoutPassword } = users[userEmail];
    return userWithoutPassword;
};

export const deleteUser = async (userId: string): Promise<void> => {
    await delay(300);
    const users = getUsers();
    const userEmail = Object.keys(users).find(email => users[email].id === userId);
    if (!userEmail) throw new Error("User not found");
    
    const currentUser = getCurrentUser();
    if (currentUser?.id === userId) throw new Error("Cannot delete the currently logged-in user.");

    delete users[userEmail];
    saveUsers(users);
};

export const signup = async (name: string, email: string, password: string): Promise<User> => {
    await delay(500);
    const users = getUsers();

    if (users[email]) throw new Error('User with this email already exists.');

    const newUser: User = { id: `user_${Date.now()}`, name, email, role: 'user' };
    users[email] = { ...newUser, password };
    saveUsers(users);
    
    try {
        localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(newUser));
    } catch (e) { console.error("Failed to set auth session:", e); }

    return newUser;
};

export const login = async (email: string, password: string): Promise<User> => {
    await delay(500);
    const users = getUsers();
    const userData = users[email];

    if (!userData || userData.password !== password) throw new Error('Invalid email or password.');
    
    const user: User = { id: userData.id, name: userData.name, email: userData.email, role: userData.role };

    try {
        localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(user));
    } catch (e) { console.error("Failed to set auth session:", e); }
    return user;
};

export const googleLogin = async (): Promise<User> => {
    await delay(700);
    const mockUser: User = { id: 'google-user-123', name: 'Google User', email: 'google.user@example.com', role: 'user' };
    
    const users = getUsers();
    if (!users[mockUser.email]) {
        users[mockUser.email] = { ...mockUser, password: 'google_oauth_user' };
        saveUsers(users);
    }
    
    try {
        localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(mockUser));
    } catch (e) { console.error("Failed to set auth session:", e); }
    return mockUser;
};

export const logout = (): void => {
    try {
        localStorage.removeItem(AUTH_SESSION_KEY);
    } catch (e) { console.error("Failed to remove auth session:", e); }
};

export const getCurrentUser = (): User | null => {
    try {
        const sessionJson = localStorage.getItem(AUTH_SESSION_KEY);
        return sessionJson ? JSON.parse(sessionJson) : null;
    } catch (e) {
        console.error("Failed to get auth session:", e);
        return null;
    }
};
