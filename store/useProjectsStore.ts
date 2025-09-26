
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Project, Status, Difficulty } from '../types';

interface ProjectsState {
    projects: Project[];
    addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
    updateProject: (project: Project) => void;
    deleteProject: (id: string) => void;
    importData: (projects: Project[]) => void;
}

const seedData: Project[] = [
     {
        id: uuidv4(),
        title: 'Personal Portfolio',
        description: 'A portfolio website to showcase my projects.',
        status: Status.DONE,
        github: 'https://github.com',
        demo: 'https://react.dev',
        difficulty: Difficulty.EASY,
        tags: ['react', 'tailwind', 'portfolio'],
        createdAt: new Date().toISOString()
    },
    {
        id: uuidv4(),
        title: 'Dev Mastery OS',
        description: 'This very developer dashboard app.',
        status: Status.IN_PROGRESS,
        difficulty: Difficulty.MEDIUM,
        tags: ['react', 'zustand', 'typescript'],
        createdAt: new Date().toISOString(),
        notes: 'Implement all features from the plan.'
    }
]

export const useProjectsStore = create<ProjectsState>()(
    persist(
        (set) => ({
            projects: seedData,
            addProject: (project) =>
                set((state) => ({
                    projects: [...state.projects, { ...project, id: uuidv4(), createdAt: new Date().toISOString() }],
                })),
            updateProject: (updatedProject) =>
                set((state) => ({
                    projects: state.projects.map((project) =>
                        project.id === updatedProject.id ? updatedProject : project
                    ),
                })),
            deleteProject: (id) =>
                set((state) => ({
                    projects: state.projects.filter((project) => project.id !== id),
                })),
            importData: (projects) => set({ projects: projects }),
        }),
        {
            name: 'dev-mastery-projects-storage',
        }
    )
);
