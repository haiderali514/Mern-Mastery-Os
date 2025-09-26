
import { Status, Difficulty, LearningType } from './types';

export const STATUS_OPTIONS = Object.values(Status);
export const DIFFICULTY_OPTIONS = Object.values(Difficulty);
export const LEARNING_TYPE_OPTIONS = Object.values(LearningType);

export const STATUS_COLORS: { [key in Status]: string } = {
    [Status.TODO]: 'bg-yellow-500/20 text-yellow-400',
    [Status.IN_PROGRESS]: 'bg-blue-500/20 text-blue-400',
    [Status.DONE]: 'bg-green-500/20 text-green-400',
};

export const DIFFICULTY_COLORS: { [key in Difficulty]: string } = {
    [Difficulty.EASY]: 'bg-green-500/20 text-green-400',
    [Difficulty.MEDIUM]: 'bg-yellow-500/20 text-yellow-400',
    [Difficulty.HARD]: 'bg-red-500/20 text-red-400',
};
