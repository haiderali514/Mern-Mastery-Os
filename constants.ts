
import { Status, Difficulty, LearningType } from './types';

export const STATUS_OPTIONS = Object.values(Status);
export const DIFFICULTY_OPTIONS = Object.values(Difficulty);
export const LEARNING_TYPE_OPTIONS = Object.values(LearningType);

export const STATUS_COLORS: { [key in Status]: string } = {
    [Status.TODO]: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    [Status.IN_PROGRESS]: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    [Status.DONE]: 'bg-green-500/10 text-green-400 border border-green-500/20',
};

export const DIFFICULTY_COLORS: { [key in Difficulty]: string } = {
    [Difficulty.EASY]: 'bg-green-500/10 text-green-400 border border-green-500/20',
    [Difficulty.MEDIUM]: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    [Difficulty.HARD]: 'bg-red-500/10 text-red-400 border border-red-500/20',
};