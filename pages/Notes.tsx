
import React, { useState, useMemo, ChangeEvent } from 'react';
import { useNotesStore } from '../store/useNotesStore';
import { Note } from '../types';
import Modal from '../components/Modal';
import Tag from '../components/Tag';
import { PlusIcon, EditIcon, DeleteIcon, BookmarkIcon } from '../components/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Notes: React.FC = () => {
    const { notes, addNote, updateNote, deleteNote, toggleReviewStatus } = useNotesStore();
    const [modalState, setModalState] = useState<{isOpen: boolean, item: Note | null, mode: 'view' | 'edit'}>({
        isOpen: false,
        item: null,
        mode: 'view'
    });
    const [searchTerm, setSearchTerm] = useState('');

    const openModal = (item: Note | null, mode: 'view' | 'edit') => {
        setModalState({ isOpen: true, item, mode });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, item: null, mode: 'view' });
    };

    const handleSave = (formData: Omit<Note, 'id' | 'createdAt'>) => {
        if (modalState.item) {
            updateNote({ ...modalState.item, ...formData });
        } else {
            addNote(formData);
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
                <button onClick={() => openModal(null, 'edit')} className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition duration-300">
                    <PlusIcon className="h-5 w-5" />
                    <span>Add Note</span>
                </button>
            </div>
            
            <div className="mb-6">
                 <input type="text" placeholder="Search notes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-card text-white rounded-md px-4 py-2 border border-border focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map(item => (
                    <div key={item.id} className="bg-card rounded-lg shadow-lg flex flex-col justify-between border border-border group transition-all hover:border-primary/50">
                        <div className="p-5 cursor-pointer" onClick={() => openModal(item, 'view')}>
                            <h2 className="text-xl font-bold text-text-primary mb-2">{item.title}</h2>
                            <p className="text-text-secondary mb-4 text-sm line-clamp-4">{item.content.replace(/#/g, '')}</p>
                            <div className="flex flex-wrap gap-2">
                                {item.tags.map(tag => <Tag key={tag} colorClasses="bg-gray-500/10 text-text-secondary border-gray-500/20">{tag}</Tag>)}
                            </div>
                        </div>
                         <div className="flex justify-end space-x-1 p-2 border-t border-border bg-background/30">
                            <button onClick={() => toggleReviewStatus(item.id)} className={`p-2 rounded-md ${item.forReview ? 'text-primary' : 'text-text-secondary'} hover:bg-primary/10 hover:text-primary transition-colors`}>
                                <BookmarkIcon className="h-5 w-5" filled={item.forReview}/>
                            </button>
                            <button onClick={() => openModal(item, 'edit')} className="p-2 text-text-secondary hover:bg-primary/10 hover:text-primary rounded-md transition-colors"><EditIcon className="h-5 w-5" /></button>
                            <button onClick={() => handleDelete(item.id)} className="p-2 text-text-secondary hover:bg-red-500/10 hover:text-red-500 rounded-md transition-colors"><DeleteIcon className="h-5 w-5" /></button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={modalState.isOpen} onClose={closeModal} title={
                modalState.mode === 'edit' ? (modalState.item ? 'Edit Note' : 'Add Note') : (modalState.item?.title || 'View Note')
            }>
                {modalState.mode === 'view' && modalState.item ? (
                    <div className="markdown-content max-h-[70vh] p-1 pr-4">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{modalState.item.content}</ReactMarkdown>
                    </div>
                ) : (
                    <NoteForm currentItem={modalState.item} onSave={handleSave} onCancel={closeModal} />
                )}
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
        forReview: currentItem?.forReview || false,
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
            <FormTextarea name="content" value={formData.content} onChange={handleChange} placeholder="Content (Markdown supported)..." required />
            <FormInput name="tags" value={formData.tags} onChange={handleChange} placeholder="Tags (comma-separated)" />
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
    <textarea {...props} rows={12} className="w-full bg-background text-white rounded-md px-4 py-2 border border-border focus:outline-none focus:ring-2 focus:ring-primary" />
);

export default Notes;