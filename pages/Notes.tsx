
import React, { useState, useMemo, ChangeEvent } from 'react';
import { useNotesStore } from '../store/useNotesStore';
import { Note } from '../types';
import Modal from '../components/Modal';
import Tag from '../components/Tag';
import { PlusIcon, EditIcon, DeleteIcon } from '../components/icons';

const Notes: React.FC = () => {
    const { notes, addNote, updateNote, deleteNote } = useNotesStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<Note | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const openModal = (item: Note | null = null) => {
        setCurrentItem(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setCurrentItem(null);
        setIsModalOpen(false);
    };

    const handleSave = (item: Omit<Note, 'id' | 'createdAt'>) => {
        if (currentItem) {
            updateNote({ ...item, id: currentItem.id, createdAt: currentItem.createdAt });
        } else {
            addNote(item);
        }
        closeModal();
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            deleteNote(id);
        }
    };
    
    const filteredItems = useMemo(() => {
        return notes
            .filter(item => {
                return item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       item.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
            })
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [notes, searchTerm]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Notes / Wiki</h1>
                <button onClick={() => openModal()} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition duration-300">
                    <PlusIcon className="h-5 w-5" />
                    <span>Add Note</span>
                </button>
            </div>
            
            <div className="mb-6">
                 <input type="text" placeholder="Search notes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map(item => (
                    <div key={item.id} className="bg-gray-800 p-5 rounded-lg shadow-lg flex flex-col justify-between space-y-4">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-2">{item.title}</h2>
                            <p className="text-gray-400 mb-4 text-sm line-clamp-4">{item.content}</p>
                            <div className="flex flex-wrap gap-2">
                                {item.tags.map(tag => <Tag key={tag} colorClasses="bg-gray-600/50 text-gray-300">{tag}</Tag>)}
                            </div>
                        </div>
                         <div className="flex justify-end space-x-2 pt-4 border-t border-gray-700">
                            <button onClick={() => openModal(item)} className="p-2 text-gray-400 hover:text-white"><EditIcon className="h-5 w-5" /></button>
                            <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-500"><DeleteIcon className="h-5 w-5" /></button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={currentItem ? 'Edit Note' : 'Add Note'}>
                <NoteForm currentItem={currentItem} onSave={handleSave} onCancel={closeModal} />
            </Modal>
        </div>
    );
};

interface NoteFormProps {
    currentItem: Note | null;
    onSave: (item: Omit<Note, 'id' | 'createdAt'>) => void;
    onCancel: () => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ currentItem, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        title: currentItem?.title || '',
        content: currentItem?.content || '',
        tags: currentItem?.tags.join(', ') || '',
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean) });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput name="title" value={formData.title} onChange={handleChange} placeholder="Note Title" required />
            <FormTextarea name="content" value={formData.content} onChange={handleChange} placeholder="Content..." required />
            <FormInput name="tags" value={formData.tags} onChange={handleChange} placeholder="Tags (comma-separated)" />
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
    <textarea {...props} rows={8} className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
);

export default Notes;
