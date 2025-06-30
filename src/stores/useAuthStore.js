import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { encryptedStorage, decryptData } from '@/lib/encryption';

// Migration function to handle existing unencrypted data
const migrateUnencryptedData = () => {
  try {
    const unencryptedData = localStorage.getItem('auth-storage');
    if (unencryptedData) {
      // Try to parse as JSON to see if it's unencrypted
      const parsed = JSON.parse(unencryptedData);
      if (parsed && typeof parsed === 'object' && parsed.state) {
        console.log('Migrating unencrypted auth data to encrypted storage...');
        // Remove the old unencrypted data
        localStorage.removeItem('auth-storage');
        return true;
      }
    }
  } catch (error) {
    // If parsing fails, it might be encrypted or corrupted
    console.log('No unencrypted data found or data is already encrypted');
  }
  return false;
};

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
            name: 'auth-storage', 
            storage: encryptedStorage, // Use encrypted storage instead of default localStorage
            partialize: (state) => ({ 
                token: state.token,
                userId: state.userId,
                role: state.role,
                name: state.name,
                email: state.email,
                profilePicture: state.profilePicture
            }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    console.log('Auth state rehydrated from encrypted storage');
                }
            },
            // Handle migration of existing unencrypted data
            onBeforeLift: () => {
                if (typeof window !== 'undefined') {
                    migrateUnencryptedData();
                }
            },
        }
    )
);