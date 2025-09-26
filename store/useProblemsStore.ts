import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Problem, Status, Difficulty } from '../types';

interface ProblemsState {
    problems: Problem[];
    addProblem: (problem: Omit<Problem, 'id' | 'createdAt'>) => void;
    updateProblem: (problem: Problem) => void;
    deleteProblem: (id: string) => void;
    importData: (problems: Problem[]) => void;
}

const seedData: Problem[] = [
    {
        id: uuidv4(),
        title: 'Two Sum',
        topic: 'Arrays',
        difficulty: Difficulty.EASY,
        platform: 'LeetCode',
        link: 'https://leetcode.com/problems/two-sum/',
        status: Status.DONE,
        solution: 'Use a hash map to store complements.',
        tags: ['array', 'hashmap'],
        createdAt: new Date().toISOString()
    },
    {
        id: uuidv4(),
        title: 'Longest Substring Without Repeating Characters',
        topic: 'Sliding Window',
        difficulty: Difficulty.MEDIUM,
        platform: 'LeetCode',
        link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
        status: Status.TODO,
        tags: ['string', 'sliding-window'],
        createdAt: new Date().toISOString()
    }
]

export const useProblemsStore = create<ProblemsState>()(
    persist(
        (set) => ({
            problems: seedData,
            addProblem: (problem) =>
                set((state) => ({
                    problems: [...state.problems, { ...problem, id: uuidv4(), createdAt: new Date().toISOString() }],
                })),
            updateProblem: (updatedProblem) =>
                set((state) => ({
                    problems: state.problems.map((problem) =>
                        problem.id === updatedProblem.id ? updatedProblem : problem
                    ),
                })),
            deleteProblem: (id) =>
                set((state) => ({
                    problems: state.problems.filter((problem) => problem.id !== id),
                })),
            importData: (problems) => set({ problems: problems }),
        }),
        {
            name: 'dev-mastery-problems-storage',
        }
    )
);