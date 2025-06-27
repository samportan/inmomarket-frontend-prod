import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set, get) => ({
            userId: null,
            token: null,
            role: null,
            name: null,
            email: null,
            profilePicture: null,
            login: (token, { userId, name, role, email, profilePicture }) =>
                set({ token, userId, name, role, email, profilePicture }),
            logout: () => {
                // Limpiar el estado
                set({ 
                    token: null, 
                    userId: null, 
                    name: null, 
                    role: null, 
                    email: null, 
                    profilePicture: null 
                });
                
                // Limpiar localStorage manualmente para asegurar que se elimine
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('auth-storage');
                }
            },
            // Método para verificar si el usuario está autenticado
            isAuthenticated: () => {
                const state = get();
                return !!state.token;
            }
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
            // Agregar manejo de errores para la persistencia
            onRehydrateStorage: () => (state) => {
                if (state) {
                    console.log('Auth state rehydrated:', state);
                }
            },
        }
    )
);