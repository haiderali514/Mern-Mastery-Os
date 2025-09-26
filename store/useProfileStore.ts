import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProfileState {
    leetcodeUsername: string;
    setLeetcodeUsername: (username: string) => void;
}

export const useProfileStore = create<ProfileState>()(
    persist(
        (set) => ({
            leetcodeUsername: '',
            setLeetcodeUsername: (username) => set({ leetcodeUsername: username }),
        }),
        {
            name: 'dev-mastery-profile-storage',
        }
    )
);