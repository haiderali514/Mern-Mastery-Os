
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { LearningItem, Status, Difficulty, LearningType } from '../types';

interface LearningState {
    learningItems: LearningItem[];
    addLearningItem: (item: Omit<LearningItem, 'id' | 'createdAt'>) => void;
    updateLearningItem: (item: LearningItem) => void;
    deleteLearningItem: (id: string) => void;
    toggleSubTask: (itemId: string, subTaskIndex: number) => void;
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
        notes: 'Focus on useEffect and useCallback.',
        subTasks: [
            { title: 'useState', completed: true },
            { title: 'useEffect', completed: true },
            { title: 'useContext', completed: false },
            { title: 'useReducer', completed: false },
            { title: 'useCallback', completed: false },
        ],
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
        notes: 'Explore generics and conditional types.',
        subTasks: [
            { title: 'Generics', completed: false },
            { title: 'Conditional Types', completed: false },
            { title: 'Mapped Types', completed: false },
        ],
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
            toggleSubTask: (itemId, subTaskIndex) =>
                set((state) => ({
                    learningItems: state.learningItems.map((item) => {
                        if (item.id === itemId) {
                            const newSubTasks = [...item.subTasks];
                            newSubTasks[subTaskIndex] = {
                                ...newSubTasks[subTaskIndex],
                                completed: !newSubTasks[subTaskIndex].completed,
                            };
                            return { ...item, subTasks: newSubTasks };
                        }
                        return item;
                    }),
                })),
            importData: (items) => set({ learningItems: items }),
        }),
        {
            name: 'dev-mastery-learning-storage',
        }
    )
);