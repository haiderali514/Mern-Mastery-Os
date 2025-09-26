
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Learning from './pages/Learning';
import Projects from './pages/Projects';
import Problems from './pages/Problems';
import Notes from './pages/Notes';
import Settings from './pages/Settings';
import { MenuIcon, XIcon } from './components/icons';

const App: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <HashRouter>
            <div className="flex h-screen bg-gray-900 text-gray-100">
                <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <header className="bg-gray-800 shadow-md lg:hidden p-2 flex justify-end">
                         <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                            {isSidebarOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                        </button>
                    </header>
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-4 sm:p-6 lg:p-8">
                        <Routes>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/learning" element={<Learning />} />
                            <Route path="/projects" element={<Projects />} />
                            <Route path="/problems" element={<Problems />} />
                            <Route path="/notes" element={<Notes />} />
                            <Route path="/settings" element={<Settings />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </HashRouter>
    );
};

export default App;
