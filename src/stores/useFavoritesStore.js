import { create } from 'zustand';
import axios from 'axios';

export const useFavoritesStore = create((set, get) => ({
  favorites: [],
  loading: false,
  error: null,
  totalPages: 0,
  currentPage: 0,
  totalElements: 0,
  pendingToggles: new Set(), // Track pending toggle operations to prevent duplicate requests

  fetchFavorites: async (token, page = 0) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/favorites/my-favorites?page=${page}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Transform the data to match our ExpandedPropertyCard component
      const transformedFavorites = response.data.content.map(fav => ({
        id: fav.publicationId,
        imageUrl: fav.propertyImageUrls?.[0] || '/placeholder.svg',
        images: fav.propertyImageUrls || [],
        title: `${fav.typeName} en ${fav.neighborhood}`,
        price: `$${fav.propertyPrice.toLocaleString()}`,
        location: `${fav.municipality}, ${fav.department}`,
        bedrooms: fav.propertyBedrooms,
        floors: fav.propertyFloors,
        publisherName: fav.ownerName,
        isNew: false,
        favorited: true,
        description: fav.propertyDescription,
        address: fav.propertyAddress,
        neighborhood: fav.neighborhood,
        municipality: fav.municipality,
        department: fav.department,
        size: fav.propertySize,
        parking: fav.propertyParking,
        furnished: fav.propertyFurnished,
        coordinates: {
          lat: fav.latitude,
          lng: fav.longitude
        },
        availableTimes: fav.availableTimes || []
      }));

      set({ 
        favorites: transformedFavorites,
        loading: false,
        totalPages: response.data.totalPages,
        currentPage: response.data.number,
        totalElements: response.data.totalElements
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Error al cargar favoritos',
        loading: false 
      });
    }
  },

  /**
   * Optimistic toggle that immediately updates the UI for better UX
   * Strategy:
   * 1. Immediately remove item from UI
   * 2. Make API call in background
   * 3. Rollback on error
   * 4. Track pending operations to prevent duplicates
   */
  toggleFavoriteOptimistic: async (token, publicationId) => {
    const { favorites, pendingToggles } = get();
    
    // Check if this toggle is already pending
    if (pendingToggles.has(publicationId)) {
      return { success: false, error: 'Operación en progreso' };
    }

    // Find the property to remove
    const propertyIndex = favorites.findIndex(fav => fav.id === publicationId);
    if (propertyIndex === -1) {
      return { success: false, error: 'Propiedad no encontrada' };
    }

    // Store the original state for potential rollback
    const originalFavorites = [...favorites];
    const removedProperty = favorites[propertyIndex];

    // Optimistically remove the property from the list
    const updatedFavorites = favorites.filter(fav => fav.id !== publicationId);
    
    // Update total elements count
    const newTotalElements = Math.max(0, get().totalElements - 1);
    
    // Recalculate total pages (assuming 12 items per page)
    const itemsPerPage = 12;
    const newTotalPages = Math.ceil(newTotalElements / itemsPerPage);
    
    // Adjust current page if necessary
    let newCurrentPage = get().currentPage;
    if (updatedFavorites.length === 0 && newCurrentPage > 0) {
      newCurrentPage = Math.max(0, newCurrentPage - 1);
    }

    // Immediately update the UI
    set({
      favorites: updatedFavorites,
      totalElements: newTotalElements,
      totalPages: newTotalPages,
      currentPage: newCurrentPage,
      pendingToggles: new Set([...pendingToggles, publicationId])
    });

    // Make the API call in the background
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/favorites/toggle`,
        { publicationId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Remove from pending toggles on success
      set({
        pendingToggles: new Set([...get().pendingToggles].filter(id => id !== publicationId))
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      // Rollback on error - restore the original state
      set({
        favorites: originalFavorites,
        totalElements: get().totalElements + 1,
        totalPages: Math.ceil((get().totalElements + 1) / itemsPerPage),
        pendingToggles: new Set([...get().pendingToggles].filter(id => id !== publicationId))
      });
      
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al actualizar favoritos' 
      };
    }
  },

  // Legacy method for backward compatibility (used in other components)
  toggleFavorite: async (token, publicationId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/favorites/toggle`,
        { publicationId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al actualizar favoritos' 
      };
    }
  },

  // Method to refresh favorites list (useful after optimistic updates)
  refreshFavorites: async (token) => {
    const { currentPage } = get();
    await get().fetchFavorites(token, currentPage);
  }
})); 