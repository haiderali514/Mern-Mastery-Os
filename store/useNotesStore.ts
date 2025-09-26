import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Note } from '../types';

interface NotesState {
    notes: Note[];
    addNote: (note: Omit<Note, 'id' | 'createdAt' | 'forReview'>) => void;
    updateNote: (note: Note) => void;
    deleteNote: (id: string) => void;
    toggleReviewStatus: (id: string) => void;
    importData: (notes: Note[]) => void;
}

const seedData: Note[] = [
    {
        id: uuidv4(),
        title: 'What is MERN Stack?',
        content: 'MERN stands for MongoDB, Express.js, React, and Node.js. It is a popular full-stack JavaScript framework for building web applications.',
        tags: ['mern', 'fullstack', 'concept'],
        createdAt: new Date().toISOString(),
        forReview: true,
    },
     {
        id: uuidv4(),
        title: 'Zustand vs Redux',
        content: 'Zustand is a small, fast and scalable state-management solution. It is simpler than Redux and has a much smaller bundle size. It uses hooks and is great for React projects.\n\n### Key Differences:\n*   **Boilerplate:** Zustand has minimal boilerplate compared to Redux.\n*   **Bundle Size:** Zustand is significantly smaller.\n*   **API:** Zustand uses a simple hook-based API.',
        tags: ['react', 'state-management', 'zustand'],
        createdAt: new Date().toISOString(),
        forReview: false,
    },
    {
        id: uuidv4(),
        title: 'CSS Flexbox Guide',
        content: 'A quick guide to CSS Flexbox.\n\n- `display: flex;` - Defines a flex container.\n- `justify-content` - Aligns items along the main axis.\n- `align-items` - Aligns items along the cross axis.\n- `flex-direction` - Sets the direction of the main axis (`row` | `column`).\n- `flex-wrap` - Allows items to wrap to the next line.',
        tags: ['css', 'frontend', 'layout'],
        createdAt: new Date().toISOString(),
        forReview: true,
    }
]

export const useNotesStore = create<NotesState>()(
    persist(
        (set) => ({
            notes: seedData,
            addNote: (note) =>
                set((state) => ({
                    notes: [...state.notes, { ...note, id: uuidv4(), createdAt: new Date().toISOString(), forReview: false }],
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
            toggleReviewStatus: (id) =>
                set((state) => ({
                    notes: state.notes.map((note) =>
                        note.id === id ? { ...note, forReview: !note.forReview } : note
                    ),
                })),
            importData: (notes) => set({ notes: notes }),
        }),
        {
            name: 'dev-mastery-notes-storage',
        }
    )
);