
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { LearningItem, Status, Difficulty, LearningType } from '../types';

interface LearningState {
    learningItems: LearningItem[];
    addLearningItem: (item: Omit<LearningItem, 'id' | 'createdAt'>) => void;
    updateLearningItem: (item: LearningItem) => void;
    deleteLearningItem: (id: string) => void;
    importData: (items: LearningItem[]) => void;
}

const seedData: LearningItem[] = [
    {
        id: uuidv4(),
        title: 'React Hooks Deep Dive',
        type: LearningType.COURSE,
        link: 'https://react.dev/reference/react',
        status: Status.IN_PROGRESS,
        difficulty: Difficulty.MEDIUM,
        tags: ['react', 'frontend', 'hooks'],
        createdAt: new Date().toISOString(),
        notes: 'Focus on useEffect and useCallback.'
    },
     {
        id: uuidv4(),
        title: 'Advanced TypeScript',
        type: LearningType.DOCUMENTATION,
        link: 'https://www.typescriptlang.org/docs/',
        status: Status.TODO,
        difficulty: Difficulty.HARD,
        tags: ['typescript', 'frontend'],
        createdAt: new Date().toISOString(),
        notes: 'Explore generics and conditional types.'
    }
];

export const useLearningStore = create<LearningState>()(
    persist(
        (set) => ({
            learningItems: seedData,
            addLearningItem: (item) =>
                set((state) => ({
                    learningItems: [
                        ...state.learningItems,
                        { ...item, id: uuidv4(), createdAt: new Date().toISOString() },
                    ],
                })),
            updateLearningItem: (updatedItem) =>
                set((state) => ({
                    learningItems: state.learningItems.map((item) =>
                        item.id === updatedItem.id ? updatedItem : item
                    ),
                })),
            deleteLearningItem: (id) =>
                set((state) => ({
                    learningItems: state.learningItems.filter((item) => item.id !== id),
                })),
            importData: (items) => set({ learningItems: items }),
        }),
        {
            name: 'dev-mastery-learning-storage',
        }
    )
);
