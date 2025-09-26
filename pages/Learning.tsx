
import React, { useState, useMemo, ChangeEvent } from 'react';
import { useLearningStore } from '../store/useLearningStore';
import { LearningItem, Status, Difficulty, LearningType } from '../types';
import Modal from '../components/Modal';
import Tag from '../components/Tag';
import { STATUS_OPTIONS, DIFFICULTY_OPTIONS, LEARNING_TYPE_OPTIONS, STATUS_COLORS, DIFFICULTY_COLORS } from '../constants';
import { PlusIcon, EditIcon, DeleteIcon, ExternalLinkIcon } from '../components/icons';

const Learning: React.FC = () => {
    const { learningItems, addLearningItem, updateLearningItem, deleteLearningItem } = useLearningStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<LearningItem | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState<{ status: string; difficulty: string; type: string }>({ status: 'All', difficulty: 'All', type: 'All' });

    const openModal = (item: LearningItem | null = null) => {
        setCurrentItem(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setCurrentItem(null);
        setIsModalOpen(false);
    };

    const handleSave = (item: Omit<LearningItem, 'id' | 'createdAt'>) => {
        if (currentItem) {
            updateLearningItem({ ...item, id: currentItem.id, createdAt: currentItem.createdAt });
        } else {
            addLearningItem(item);
        }
        closeModal();
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            deleteLearningItem(id);
        }
    };

    const filteredItems = useMemo(() => {
        return learningItems
            .filter(item => {
                const searchMatch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
                const statusMatch = filters.status === 'All' || item.status === filters.status;
                const difficultyMatch = filters.difficulty === 'All' || item.difficulty === filters.difficulty;
                const typeMatch = filters.type === 'All' || item.type === filters.type;
                return searchMatch && statusMatch && difficultyMatch && typeMatch;
            })
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [learningItems, searchTerm, filters]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Learning Track</h1>
                <button onClick={() => openModal()} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition duration-300">
                    <PlusIcon className="h-5 w-5" />
                    <span>Add Item</span>
                </button>
            </div>

            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <input type="text" placeholder="Search by title or tag..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="col-span-1 md:col-span-2 bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <FilterDropdown value={filters.status} onChange={(e) => setFilters(f => ({...f, status: e.target.value}))} options={['All', ...STATUS_OPTIONS]}/>
                <FilterDropdown value={filters.difficulty} onChange={(e) => setFilters(f => ({...f, difficulty: e.target.value}))} options={['All', ...DIFFICULTY_OPTIONS]}/>
                <FilterDropdown value={filters.type} onChange={(e) => setFilters(f => ({...f, type: e.target.value}))} options={['All', ...LEARNING_TYPE_OPTIONS]}/>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map(item => (
                    <div key={item.id} className="bg-gray-800 p-5 rounded-lg shadow-lg flex flex-col justify-between space-y-4">
                        <div>
                            <div className="flex justify-between items-start">
                                <h2 className="text-xl font-bold text-white mb-2">{item.title}</h2>
                                <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-400">
                                    <ExternalLinkIcon className="h-5 w-5"/>
                                </a>
                            </div>
                            <p className="text-sm text-gray-400 mb-2">Type: {item.type}</p>
                            <div className="flex space-x-2 mb-4">
                                <Tag colorClasses={STATUS_COLORS[item.status]}>{item.status}</Tag>
                                <Tag colorClasses={DIFFICULTY_COLORS[item.difficulty]}>{item.difficulty}</Tag>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {item.tags.map(tag => <Tag key={tag} colorClasses="bg-gray-600/50 text-gray-300">{tag}</Tag>)}
                            </div>
                            {item.notes && <p className="text-gray-300 mt-4 bg-gray-700/50 p-3 rounded-md">{item.notes}</p>}
                        </div>
                        <div className="flex justify-end space-x-2 pt-4 border-t border-gray-700">
                            <button onClick={() => openModal(item)} className="p-2 text-gray-400 hover:text-white"><EditIcon className="h-5 w-5" /></button>
                            <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-500"><DeleteIcon className="h-5 w-5" /></button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={currentItem ? 'Edit Learning Item' : 'Add Learning Item'}>
                <LearningForm currentItem={currentItem} onSave={handleSave} onCancel={closeModal} />
            </Modal>
        </div>
    );
};

interface LearningFormProps {
    currentItem: LearningItem | null;
    onSave: (item: Omit<LearningItem, 'id' | 'createdAt'>) => void;
    onCancel: () => void;
}

const LearningForm: React.FC<LearningFormProps> = ({ currentItem, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        title: currentItem?.title || '',
        link: currentItem?.link || '',
        type: currentItem?.type || LearningType.ARTICLE,
        status: currentItem?.status || Status.TODO,
        difficulty: currentItem?.difficulty || Difficulty.EASY,
        tags: currentItem?.tags.join(', ') || '',
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
            <FormInput name="title" value={formData.title} onChange={handleChange} placeholder="Title" required/>
            <FormInput name="link" value={formData.link} onChange={handleChange} placeholder="URL Link" required type="url"/>
            <FormSelect name="type" value={formData.type} onChange={handleChange} options={LEARNING_TYPE_OPTIONS} label="Type"/>
            <FormSelect name="status" value={formData.status} onChange={handleChange} options={STATUS_OPTIONS} label="Status"/>
            <FormSelect name="difficulty" value={formData.difficulty} onChange={handleChange} options={DIFFICULTY_OPTIONS} label="Difficulty"/>
            <FormInput name="tags" value={formData.tags} onChange={handleChange} placeholder="Tags (comma-separated)"/>
            <FormTextarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Notes"/>
            <div className="flex justify-end space-x-4">
                <button type="button" onClick={onCancel} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg">Cancel</button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg">Save</button>
            </div>
        </form>
    );
};

// Reusable form components
const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
);

const FormTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea {...props} rows={4} className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
);

const FormSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { options: string[], label: string }> = ({ options, label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        <select {...props} className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            {options.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
    </div>
);

const FilterDropdown: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & {options: string[]}> = ({options, ...props}) => (
    <select {...props} className="bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
);

export default Learning;
