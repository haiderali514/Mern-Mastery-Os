
import React from 'react';
import { NavLink } from 'react-router-dom';
import { DashboardIcon, LearningIcon, ProjectsIcon, ProblemsIcon, NotesIcon, SettingsIcon } from './icons';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const navLinks = [
    { to: '/dashboard', icon: DashboardIcon, text: 'Dashboard' },
    { to: '/learning', icon: LearningIcon, text: 'Learning' },
    { to: '/projects', icon: ProjectsIcon, text: 'Projects' },
    { to: '/problems', icon: ProblemsIcon, text: 'Problems' },
    { to: '/notes', icon: NotesIcon, text: 'Notes' },
    { to: '/settings', icon: SettingsIcon, text: 'Settings' },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
    const activeLinkClass = "bg-primary/20 text-text-primary";
    const inactiveLinkClass = "text-text-secondary hover:bg-white/10 hover:text-text-primary";

    const sidebarClasses = `
        bg-card text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:relative lg:translate-x-0 transition-transform duration-200 ease-in-out z-30 shadow-lg
        border-r border-border
    `;

    return (
        <>
            {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-20 lg:hidden" onClick={() => setIsOpen(false)}></div>}
            <div className={sidebarClasses}>
                <div className="text-white text-2xl font-bold text-center tracking-wider px-4">
                    DevMastery OS
                </div>
                <nav>
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.text}
                            to={link.to}
                            onClick={() => { if(window.innerWidth < 1024) setIsOpen(false) }}
                            className={({ isActive }) => 
                                `flex items-center space-x-3 px-4 py-2 my-1 rounded-md transition-colors duration-200 font-medium ${isActive ? activeLinkClass : inactiveLinkClass}`
                            }
                        >
                            <link.icon className="h-5 w-5" />
                            <span>{link.text}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>
        </>
    );
};

export default Sidebar;