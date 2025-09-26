
import React from 'react';
import { useLearningStore } from '../store/useLearningStore';
import { useProjectsStore } from '../store/useProjectsStore';
import { useProblemsStore } from '../store/useProblemsStore';
import { useNotesStore } from '../store/useNotesStore';
import { Status } from '../types';
import { Link } from 'react-router-dom';
import { LearningIcon, ProjectsIcon, ProblemsIcon, NotesIcon, PlusIcon } from '../components/icons';

const StatCard: React.FC<{ title: string; count: number; total: number; icon: React.ElementType; linkTo: string }> = ({ title, count, total, icon: Icon, linkTo }) => {
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-300">{title}</h3>
                <Icon className="h-8 w-8 text-indigo-400" />
            </div>
            <div className="text-3xl font-bold text-white">{count} <span className="text-xl text-gray-400">/ {total}</span></div>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mt-4">
                <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
            </div>
             <p className="text-right text-sm text-gray-400 mt-1">{percentage}% complete</p>
             <Link to={linkTo} className="mt-4 text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center space-x-2">
                <PlusIcon className="w-5 h-5"/>
                <span>Add New</span>
             </Link>
        </div>
    );
};

const Dashboard: React.FC = () => {
    const { learningItems } = useLearningStore();
    const { projects } = useProjectsStore();
    const { problems } = useProblemsStore();
    const { notes } = useNotesStore();

    const learningDone = learningItems.filter(item => item.status === Status.DONE).length;
    const projectsDone = projects.filter(item => item.status === Status.DONE).length;
    const problemsDone = problems.filter(item => item.status === Status.DONE).length;

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-bold mb-6 text-white">Dashboard</h1>
            <p className="text-gray-400 mb-8">Welcome back! Here's a summary of your progress.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Learning" count={learningDone} total={learningItems.length} icon={LearningIcon} linkTo="/learning" />
                <StatCard title="Projects" count={projectsDone} total={projects.length} icon={ProjectsIcon} linkTo="/projects" />
                <StatCard title="Problems" count={problemsDone} total={problems.length} icon={ProblemsIcon} linkTo="/problems" />
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-300">Notes & Wiki</h3>
                        <NotesIcon className="h-8 w-8 text-indigo-400" />
                    </div>
                    <div className="text-3xl font-bold text-white">{notes.length}</div>
                    <p className="text-gray-400 mt-2">Total entries</p>
                    <div className="flex-grow"></div>
                    <Link to="/notes" className="mt-4 text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center space-x-2">
                        <PlusIcon className="w-5 h-5"/>
                        <span>Add New</span>
                    </Link>
                </div>
            </div>

            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-4 text-white">Recent Activity</h2>
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                    <ul className="divide-y divide-gray-700">
                        {[...learningItems, ...projects, ...problems, ...notes]
                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .slice(0, 10)
                            .map(item => (
                                <li key={item.id} className="py-3 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-white">{item.title}</p>
                                        <p className="text-sm text-gray-400">
                                            Added on {new Date(item.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className="text-xs font-medium text-indigo-400 bg-indigo-500/20 px-2 py-1 rounded-full">
                                        {'status' in item ? item.status : ('content' in item ? 'Note' : 'Project')}
                                    </span>
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
