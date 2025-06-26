import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set) => ({
            userId: null,
            token: null,
            role: null,
            name: null,
            email: null,
            profilePicture: null,
            login: (token, { userId, name, role, email, profilePicture }) =>
                set({ token, userId, name, role, email, profilePicture }),
            logout: () =>
                set({ token: null, userId: null, name: null, role: null, email: null, profilePicture: null }),
        }),
        {
            name: 'auth-storage', // unique name for localStorage key
            partialize: (state) => ({ 
                token: state.token,
                userId: state.userId,
                role: state.role,
                name: state.name,
                email: state.email,
                profilePicture: state.profilePicture
            }), // only persist these fields
        }
    )
);