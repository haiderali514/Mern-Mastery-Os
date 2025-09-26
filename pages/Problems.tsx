
import React, { useState, useMemo, ChangeEvent } from 'react';
import { useProblemsStore } from '../store/useProblemsStore';
import { Problem, Status, Difficulty } from '../types';
import Modal from '../components/Modal';
import Tag from '../components/Tag';
import { STATUS_OPTIONS, DIFFICULTY_OPTIONS, STATUS_COLORS, DIFFICULTY_COLORS } from '../constants';
import { PlusIcon, EditIcon, DeleteIcon, ExternalLinkIcon } from '../components/icons';

const Problems: React.FC = () => {
    const { problems, addProblem, updateProblem, deleteProblem } = useProblemsStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<Problem | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState<{ status: string; difficulty: string, platform: string }>({ status: 'All', difficulty: 'All', platform: 'All' });
    
    // FIX: Use spread syntax with Set for better type inference. `Array.from` was incorrectly inferring the type as `unknown[]`.
    const platforms = useMemo(() => ['All', ...new Set(problems.map(p => p.platform))], [problems]);

    const openModal = (item: Problem | null = null) => {
        setCurrentItem(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setCurrentItem(null);
        setIsModalOpen(false);
    };

    const handleSave = (item: Omit<Problem, 'id' | 'createdAt'>) => {
        if (currentItem) {
            updateProblem({ ...item, id: currentItem.id, createdAt: currentItem.createdAt });
        } else {
            addProblem(item);
        }
        closeModal();
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this problem?')) {
            deleteProblem(id);
        }
    };

    const filteredItems = useMemo(() => {
        return problems
            .filter(item => {
                const searchMatch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.topic.toLowerCase().includes(searchTerm.toLowerCase()) || item.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
                const statusMatch = filters.status === 'All' || item.status === filters.status;
                const difficultyMatch = filters.difficulty === 'All' || item.difficulty === filters.difficulty;
                const platformMatch = filters.platform === 'All' || item.platform === filters.platform;
                return searchMatch && statusMatch && difficultyMatch && platformMatch;
            })
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [problems, searchTerm, filters]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Coding Problems</h1>
                <button onClick={() => openModal()} className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition duration-300">
                    <PlusIcon className="h-5 w-5" />
                    <span>Add Problem</span>
                </button>
            </div>
            
             <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <input type="text" placeholder="Search by title, topic or tag..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="col-span-1 md:col-span-1 bg-card text-white rounded-md px-4 py-2 border border-border focus:outline-none focus:ring-2 focus:ring-primary" />
                <FilterDropdown value={filters.status} onChange={(e) => setFilters(f => ({...f, status: e.target.value}))} options={['All', ...STATUS_OPTIONS]}/>
                <FilterDropdown value={filters.difficulty} onChange={(e) => setFilters(f => ({...f, difficulty: e.target.value}))} options={['All', ...DIFFICULTY_OPTIONS]}/>
                <FilterDropdown value={filters.platform} onChange={(e) => setFilters(f => ({...f, platform: e.target.value}))} options={platforms}/>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map(item => (
                    <div key={item.id} className="bg-card p-5 rounded-lg shadow-lg flex flex-col justify-between space-y-4 border border-border">
                        <div>
                            <div className="flex justify-between items-start">
                                <h2 className="text-xl font-bold text-text-primary mb-2">{item.title}</h2>
                                <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary">
                                    <ExternalLinkIcon className="h-5 w-5"/>
                                </a>
                            </div>
                            <p className="text-sm text-text-secondary mb-2">{item.platform} - {item.topic}</p>
                            <div className="flex space-x-2 mb-4">
                                <Tag colorClasses={STATUS_COLORS[item.status]}>{item.status}</Tag>
                                <Tag colorClasses={DIFFICULTY_COLORS[item.difficulty]}>{item.difficulty}</Tag>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {item.tags.map(tag => <Tag key={tag} colorClasses="bg-gray-500/10 text-text-secondary border-gray-500/20">{tag}</Tag>)}
                            </div>
                            {item.solution && <p className="text-text-secondary mt-4 bg-background p-3 rounded-md text-sm"><strong>Solution:</strong> {item.solution}</p>}
                        </div>
                        <div className="flex justify-end space-x-2 pt-4 border-t border-border">
                            <button onClick={() => openModal(item)} className="p-2 text-text-secondary hover:text-white"><EditIcon className="h-5 w-5" /></button>
                            <button onClick={() => handleDelete(item.id)} className="p-2 text-text-secondary hover:text-red-500"><DeleteIcon className="h-5 w-5" /></button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={currentItem ? 'Edit Problem' : 'Add Problem'}>
                <ProblemForm currentItem={currentItem} onSave={handleSave} onCancel={closeModal} />
            </Modal>
        </div>
    );
};

interface ProblemFormProps {
    currentItem: Problem | null;
    onSave: (item: Omit<Problem, 'id' | 'createdAt'>) => void;
    onCancel: () => void;
}

const ProblemForm: React.FC<ProblemFormProps> = ({ currentItem, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        title: currentItem?.title || '',
        topic: currentItem?.topic || '',
        difficulty: currentItem?.difficulty || Difficulty.EASY,
        platform: currentItem?.platform || '',
        link: currentItem?.link || '',
        status: currentItem?.status || Status.TODO,
        solution: currentItem?.solution || '',
        tags: currentItem?.tags.join(', ') || '',
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
            <FormInput name="title" value={formData.title} onChange={handleChange} placeholder="Problem Title" required />
            <FormInput name="topic" value={formData.topic} onChange={handleChange} placeholder="Topic (e.g., Arrays, DP)" required />
            <FormInput name="platform" value={formData.platform} onChange={handleChange} placeholder="Platform (e.g., LeetCode)" required />
            <FormInput name="link" value={formData.link} onChange={handleChange} placeholder="URL Link" type="url" required />
            <FormSelect name="status" value={formData.status} onChange={handleChange} options={STATUS_OPTIONS} label="Status" />
            <FormSelect name="difficulty" value={formData.difficulty} onChange={handleChange} options={DIFFICULTY_OPTIONS} label="Difficulty" />
            <FormInput name="tags" value={formData.tags} onChange={handleChange} placeholder="Tags (comma-separated)" />
            <FormTextarea name="solution" value={formData.solution} onChange={handleChange} placeholder="Solution Notes" />
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

export default Problems;