
export enum Status {
    TODO = 'To Do',
    IN_PROGRESS = 'In Progress',
    DONE = 'Done',
}

export enum Difficulty {
    EASY = 'Easy',
    MEDIUM = 'Medium',
    HARD = 'Hard',
}

export enum LearningType {
    COURSE = 'Course',
    ARTICLE = 'Article',
    VIDEO = 'Video',
    DOCUMENTATION = 'Documentation',
    OTHER = 'Other'
}

export interface BaseItem {
    id: string;
    title: string;
    tags: string[];
    createdAt: string;
    notes?: string;
}

export interface SubTask {
    title: string;
    completed: boolean;
}

export interface LearningItem extends BaseItem {
    type: LearningType;
    link: string;
    status: Status;
    difficulty: Difficulty;
    subTasks: SubTask[];
}

export interface Project extends BaseItem {
    description: string;
    status: Status;
    github?: string;
    demo?: string;
    difficulty: Difficulty;
}

export interface Problem extends BaseItem {
    topic: string;
    difficulty: Difficulty;
    platform: string;
    link: string;
    status: Status;
    solution?: string;
    relatedProblemIds?: string[];
}

export interface Note extends BaseItem {
    content: string;
    forReview: boolean;
}