
import React, { useState, useMemo, ChangeEvent } from 'react';
import { useProjectsStore } from '../store/useProjectsStore';
import { Project, Status, Difficulty } from '../types';
import Modal from '../components/Modal';
import Tag from '../components/Tag';
import { STATUS_OPTIONS, DIFFICULTY_OPTIONS, STATUS_COLORS, DIFFICULTY_COLORS } from '../constants';
import { PlusIcon, EditIcon, DeleteIcon, ExternalLinkIcon } from '../components/icons';

const Projects: React.FC = () => {
    const { projects, addProject, updateProject, deleteProject } = useProjectsStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<Project | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState<{ status: string; difficulty: string }>({ status: 'All', difficulty: 'All' });

    const openModal = (item: Project | null = null) => {
        setCurrentItem(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setCurrentItem(null);
        setIsModalOpen(false);
    };

    const handleSave = (item: Omit<Project, 'id' | 'createdAt'>) => {
        if (currentItem) {
            updateProject({ ...item, id: currentItem.id, createdAt: currentItem.createdAt });
        } else {
            addProject(item);
        }
        closeModal();
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            deleteProject(id);
        }
    };

    const filteredItems = useMemo(() => {
        return projects
            .filter(item => {
                const searchMatch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
                const statusMatch = filters.status === 'All' || item.status === filters.status;
                const difficultyMatch = filters.difficulty === 'All' || item.difficulty === filters.difficulty;
                return searchMatch && statusMatch && difficultyMatch;
            })
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [projects, searchTerm, filters]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Projects</h1>
                <button onClick={() => openModal()} className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition duration-300">
                    <PlusIcon className="h-5 w-5" />
                    <span>Add Project</span>
                </button>
            </div>
            
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" placeholder="Search by title or tag..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="col-span-1 md:col-span-1 bg-card text-white rounded-md px-4 py-2 border border-border focus:outline-none focus:ring-2 focus:ring-primary" />
                <FilterDropdown value={filters.status} onChange={(e) => setFilters(f => ({...f, status: e.target.value}))} options={['All', ...STATUS_OPTIONS]}/>
                <FilterDropdown value={filters.difficulty} onChange={(e) => setFilters(f => ({...f, difficulty: e.target.value}))} options={['All', ...DIFFICULTY_OPTIONS]}/>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map(item => (
                    <div key={item.id} className="bg-card p-5 rounded-lg shadow-lg flex flex-col justify-between space-y-4 border border-border">
                        <div>
                            <h2 className="text-xl font-bold text-text-primary mb-2">{item.title}</h2>
                            <p className="text-text-secondary mb-4 text-sm">{item.description}</p>
                            <div className="flex space-x-2 mb-4">
                                <Tag colorClasses={STATUS_COLORS[item.status]}>{item.status}</Tag>
                                <Tag colorClasses={DIFFICULTY_COLORS[item.difficulty]}>{item.difficulty}</Tag>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {item.tags.map(tag => <Tag key={tag} colorClasses="bg-gray-500/10 text-text-secondary border-gray-500/20">{tag}</Tag>)}
                            </div>
                            <div className="flex space-x-4 mt-4">
                                {item.github && <a href={item.github} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 text-text-secondary hover:text-primary"><ExternalLinkIcon className="h-4 w-4" /><span>GitHub</span></a>}
                                {item.demo && <a href={item.demo} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 text-text-secondary hover:text-primary"><ExternalLinkIcon className="h-4 w-4" /><span>Demo</span></a>}
                            </div>
                            {item.notes && <p className="text-text-secondary mt-4 bg-background p-3 rounded-md text-sm">{item.notes}</p>}
                        </div>
                        <div className="flex justify-end space-x-2 pt-4 border-t border-border">
                            <button onClick={() => openModal(item)} className="p-2 text-text-secondary hover:text-white"><EditIcon className="h-5 w-5" /></button>
                            <button onClick={() => handleDelete(item.id)} className="p-2 text-text-secondary hover:text-red-500"><DeleteIcon className="h-5 w-5" /></button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={currentItem ? 'Edit Project' : 'Add Project'}>
                <ProjectForm currentItem={currentItem} onSave={handleSave} onCancel={closeModal} />
            </Modal>
        </div>
    );
};

interface ProjectFormProps {
    currentItem: Project | null;
    onSave: (item: Omit<Project, 'id' | 'createdAt'>) => void;
    onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ currentItem, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        title: currentItem?.title || '',
        description: currentItem?.description || '',
        status: currentItem?.status || Status.TODO,
        difficulty: currentItem?.difficulty || Difficulty.EASY,
        tags: currentItem?.tags.join(', ') || '',
        github: currentItem?.github || '',
        demo: currentItem?.demo || '',
        notes: currentItem?.notes || '',
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean) });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput name="title" value={formData.title} onChange={handleChange} placeholder="Title" required />
            <FormTextarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required />
            <FormSelect name="status" value={formData.status} onChange={handleChange} options={STATUS_OPTIONS} label="Status" />
            <FormSelect name="difficulty" value={formData.difficulty} onChange={handleChange} options={DIFFICULTY_OPTIONS} label="Difficulty" />
            <FormInput name="tags" value={formData.tags} onChange={handleChange} placeholder="Tags (comma-separated)" />
            <FormInput name="github" value={formData.github} onChange={handleChange} placeholder="GitHub URL" type="url"/>
            <FormInput name="demo" value={formData.demo} onChange={handleChange} placeholder="Demo URL" type="url"/>
            <FormTextarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Notes" />
            <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={onCancel} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg">Cancel</button>
                <button type="submit" className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-lg">Save</button>
            </div>
        </form>
    );
};

// Reusable form components
const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} className="w-full bg-background text-white rounded-md px-4 py-2 border border-border focus:outline-none focus:ring-2 focus:ring-primary" />
);

const FormTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea {...props} rows={3} className="w-full bg-background text-white rounded-md px-4 py-2 border border-border focus:outline-none focus:ring-2 focus:ring-primary" />
);

const FormSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { options: string[], label: string }> = ({ options, label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
        <select {...props} className="w-full bg-background text-white rounded-md px-4 py-2 border border-border focus:outline-none focus:ring-2 focus:ring-primary">
            {options.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
    </div>
);

const FilterDropdown: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & {options: string[]}> = ({options, ...props}) => (
    <select {...props} className="bg-card text-white rounded-md px-4 py-2 border border-border focus:outline-none focus:ring-2 focus:ring-primary">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
);


export default Projects;