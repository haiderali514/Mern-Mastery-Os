import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Note } from '../types';

interface NotesState {
    notes: Note[];
    addNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
    updateNote: (note: Note) => void;
    deleteNote: (id: string) => void;
    importData: (notes: Note[]) => void;
}

const seedData: Note[] = [
    {
        id: uuidv4(),
        title: 'What is MERN Stack?',
        content: 'MERN stands for MongoDB, Express.js, React, and Node.js. It is a popular full-stack JavaScript framework for building web applications.',
        tags: ['mern', 'fullstack', 'concept'],
        createdAt: new Date().toISOString()
    },
     {
        id: uuidv4(),
        title: 'Zustand vs Redux',
        content: 'Zustand is a small, fast and scalable state-management solution. It is simpler than Redux and has a much smaller bundle size. It uses hooks and is great for React projects.',
        tags: ['react', 'state-management', 'zustand'],
        createdAt: new Date().toISOString()
    }
]

export const useNotesStore = create<NotesState>()(
    persist(
        (set) => ({
            notes: seedData,
            addNote: (note) =>
                set((state) => ({
                    notes: [...state.notes, { ...note, id: uuidv4(), createdAt: new Date().toISOString() }],
                })),
            updateNote: (updatedNote) =>
                set((state) => ({
                    notes: state.notes.map((note) =>
                        note.id === updatedNote.id ? updatedNote : note
                    ),
                })),
            deleteNote: (id) =>
                set((state) => ({
                    notes: state.notes.filter((note) => note.id !== id),
                })),
            importData: (notes) => set({ notes: notes }),
        }),
        {
            name: 'dev-mastery-notes-storage',
        }
    )
);