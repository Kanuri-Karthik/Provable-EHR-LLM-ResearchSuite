import React, { useState, createContext, useMemo, useEffect, useContext } from 'react';
import { HashRouter, Routes, Route, Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Sun, Moon, User as UserIcon, LogOut, LayoutDashboard, Home, ArrowLeft, Search } from 'lucide-react';
import HomePage from './components/HomePage';
import ProjectContainer from './components/ProjectContainer';
import LoginPage from './components/pages/LoginPage';
import SignupPage from './components/pages/SignupPage';
import AdminPage from './components/pages/AdminPage';
import ResearchPage from './components/pages/ResearchPage';
import GlossaryPage from './components/pages/GlossaryPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ChatbotProvider } from './contexts/ChatbotContext';
import Chatbot from './components/chatbot/Chatbot';

type Theme = 'dark' | 'light';

export const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void; }>({
    theme: 'light',
    toggleTheme: () => {},
});

const Header: React.FC = () => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    return (
        <header className="fixed top-0 left-0 right-0 bg-bkg/60 backdrop-blur-md z-50 border-b border-content/10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">
                    <div className="flex items-center gap-4 flex-shrink-0">
                        {!isHomePage && (
                            <Link to="/" className="p-2 rounded-full hover:bg-content/10" title="Back to Home">
                                <ArrowLeft size={20} />
                            </Link>
                        )}
                        <Link to="/" className="text-xl font-bold text-content hover:text-primary-focus transition-colors">
                            Provable-EHR-LLM
                        </Link>
                    </div>
                    
                    {/* Search Bar - Center, hidden on small screens */}
                    <div className="hidden md:flex flex-1 justify-center px-8">
                        <div className="relative w-full max-w-lg">
                             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search size={18} className="text-content/50" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search across the research suite..."
                                className="w-full pl-11 pr-4 py-2 bg-bkg border border-content/20 rounded-full text-sm placeholder:text-content/60 focus:outline-none focus:ring-2 focus:ring-primary-focus focus:border-primary-focus transition-all duration-300"
                            />
                        </div>
                    </div>

                    <div className="flex-shrink-0">
                      <AuthButton />
                    </div>
                </div>
            </div>
        </header>
    );
};

const AuthButton: React.FC = () => {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { theme, toggleTheme } = useContext(ThemeContext);

    if (!user) {
        return (
            <div className="flex items-center gap-2">
                {/* Mobile Search Icon */}
                <button className="md:hidden p-2 rounded-full hover:bg-content/10" title="Search">
                    <Search size={20} />
                </button>
                <Link to="/login" className="px-4 py-2 text-sm font-semibold rounded-md hover:bg-content/10 transition-colors">Login</Link>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            {/* Mobile Search Icon */}
            <button className="md:hidden p-2 rounded-full hover:bg-content/10" title="Search">
                <Search size={20} />
            </button>
            <div className="relative">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-2 p-2 rounded-full hover:bg-content/10" title="Open user menu">
                    <UserIcon size={20} />
                </button>
                {isMenuOpen && (
                    <div 
                        className="absolute right-0 mt-2 w-64 bg-bkg border border-content/20 rounded-lg shadow-lg py-2 animate-fade-in"
                        onMouseLeave={() => setIsMenuOpen(false)}
                    >
                        <div className="px-4 py-2 border-b border-content/10">
                            <p className="font-semibold text-sm text-content">{user.name}</p>
                            <p className="text-xs text-content/70">{user.email}</p>
                        </div>
                        <div className="px-4 py-2">
                             <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-sky-500/20 text-sky-300' : 'bg-green-500/20 text-green-400'}`}>
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                        </div>
                        <Link to="/" onClick={() => setIsMenuOpen(false)} className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 text-content/90 hover:bg-content/10">
                            <Home size={16} /> Home
                        </Link>
                        {user.role === 'admin' && (
                            <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 text-content/90 hover:bg-content/10">
                                <LayoutDashboard size={16} /> Admin Panel
                            </Link>
                        )}
                        <button onClick={logout} className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 text-red-400 hover:bg-red-500/10">
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const Footer: React.FC = () => (
    <footer className="w-full py-4 mt-12 border-t border-content/10">
        <div className="container mx-auto text-sm text-content/60 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span>© {new Date().getFullYear()} Provable-EHR-LLM | Safe, Faithful, and Equitable Clinical AI.</span>
            <div className="flex gap-4">
                <Link to="/research" className="hover:underline hover:text-content">Research Library</Link>
                <Link to="/glossary" className="hover:underline hover:text-content">Glossary</Link>
            </div>
        </div>
    </footer>
);

const ProtectedRoute: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="text-center p-10">Loading session...</div>;
    }

    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

const AdminRoute: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="text-center p-10">Loading session...</div>;
    }
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return user.role === 'admin' ? <Outlet /> : <Navigate to="/" replace />;
};

const App: React.FC = () => {
    const [theme, setTheme] = useState<Theme>('light');

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'dark' ? 'light' : 'dark');
        root.classList.add(theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const themeValue = useMemo(() => ({ theme, toggleTheme }), [theme]);

    return (
        <ThemeContext.Provider value={themeValue}>
            <HashRouter>
                <AuthProvider>
                    <ChatbotProvider>
                        <div className="min-h-screen flex flex-col">
                            <Header />
                            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
                                <Routes>
                                    <Route path="/" element={<HomePage />} />
                                    <Route path="/login" element={<LoginPage />} />
                                    <Route path="/signup" element={<SignupPage />} />
                                     <Route path="/research" element={<ResearchPage />} />
                                    <Route path="/glossary" element={<GlossaryPage />} />
                                    <Route element={<ProtectedRoute />}>
                                        <Route path="/project/:id" element={<ProjectContainer />} />
                                    </Route>
                                    <Route element={<AdminRoute />}>
                                        <Route path="/admin" element={<AdminPage />} />
                                    </Route>
                                </Routes>
                            </main>
                            <Footer />
                            <Chatbot />
                        </div>
                    </ChatbotProvider>
                </AuthProvider>
            </HashRouter>
        </ThemeContext.Provider>
    );
};

export default App;