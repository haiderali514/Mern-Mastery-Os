
import React, { useState } from 'react';
import { useLearningStore } from '../store/useLearningStore';
import { useProjectsStore } from '../store/useProjectsStore';
import { useProblemsStore } from '../store/useProblemsStore';
import { useNotesStore } from '../store/useNotesStore';
import { BaseItem, LearningItem, Project, Problem, Note } from '../types';
import { LearningIcon, ProjectsIcon, ProblemsIcon, NotesIcon, PlusIcon, ChevronDownIcon, GridIcon, MoreIcon } from '../components/icons';
import { Link } from 'react-router-dom';
import Tag from '../components/Tag';
import { STATUS_COLORS, DIFFICULTY_COLORS } from '../constants';

const ItemCard: React.FC<{ item: BaseItem, type: 'learning' | 'project' | 'problem' | 'note' }> = ({ item, type }) => {
    const getIcon = () => {
        const icons = { learning: LearningIcon, project: ProjectsIcon, problem: ProblemsIcon, note: NotesIcon };
        return React.createElement(icons[type], { className: "h-6 w-6 text-text-secondary" });
    }
    
    const getLink = () => {
        const links = { learning: '/learning', project: '/projects', problem: '/problems', note: '/notes' };
        return links[type];
    }

    return (
        <Link to={getLink()} className="block bg-card hover:bg-white/5 border border-border p-4 rounded-lg transition-colors duration-200">
            <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2 rounded-full">{getIcon()}</div>
                <div className="flex-1">
                    <p className="font-semibold text-text-primary">{item.title}</p>
                     <div className="flex flex-wrap gap-2 mt-2">
                        {'status' in item && <Tag colorClasses={STATUS_COLORS[(item as LearningItem | Project | Problem).status]}>{(item as LearningItem | Project | Problem).status}</Tag>}
                        {'difficulty' in item && <Tag colorClasses={DIFFICULTY_COLORS[(item as LearningItem | Project | Problem).difficulty]}>{(item as LearningItem | Project | Problem).difficulty}</Tag>}
                    </div>
                    <p className="text-xs text-text-secondary mt-2">
                        Added on {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>
        </Link>
    );
}


const CollapsibleSection: React.FC<{ title: string; count: number; children: React.ReactNode }> = ({ title, count, children }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="mb-8">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left mb-4">
                <div className="flex items-center space-x-3">
                    <h2 className="text-xl font-bold text-text-primary">{title}</h2>
                    <span className="text-sm font-medium bg-card px-2.5 py-1 rounded-full border border-border">{count}</span>
                </div>
                <ChevronDownIcon className={`h-5 w-5 text-text-secondary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">{children}</div>}
        </div>
    );
};


const Dashboard: React.FC = () => {
    const { learningItems } = useLearningStore();
    const { projects } = useProjectsStore();
    const { problems } = useProblemsStore();
    const { notes } = useNotesStore();
    
    const allItems = [...learningItems, ...projects, ...problems, ...notes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <div className="flex items-center space-x-2">
                    <button className="p-2 rounded-md hover:bg-card border border-transparent hover:border-border"><GridIcon className="h-5 w-5 text-text-secondary"/></button>
                    <button className="p-2 rounded-md bg-primary hover:bg-primary-hover"><PlusIcon className="h-5 w-5 text-white"/></button>
                    <button className="p-2 rounded-md hover:bg-card border border-transparent hover:border-border"><MoreIcon className="h-5 w-5 text-text-secondary"/></button>
                </div>
            </div>
            
            <CollapsibleSection title="Learning" count={learningItems.length}>
                {learningItems.slice(0, 4).map(item => <ItemCard key={item.id} item={item} type="learning"/>)}
            </CollapsibleSection>

            <CollapsibleSection title="Projects" count={projects.length}>
                 {projects.slice(0, 4).map(item => <ItemCard key={item.id} item={item} type="project"/>)}
            </CollapsibleSection>

             <CollapsibleSection title="Problems" count={problems.length}>
                 {problems.slice(0, 4).map(item => <ItemCard key={item.id} item={item} type="problem"/>)}
            </CollapsibleSection>
            
            <CollapsibleSection title="Notes" count={notes.length}>
                 {notes.slice(0, 4).map(item => <ItemCard key={item.id} item={item} type="note"/>)}
            </CollapsibleSection>
        </div>
    );
};

export default Dashboard;