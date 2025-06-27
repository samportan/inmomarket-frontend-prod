import { create } from 'zustand';
import axios from 'axios';
import { useFavoritesStore } from './useFavoritesStore';

// Fallback URL in case environment variable is not loaded
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const useHomeListingsStore = create((set, get) => ({
  popularProperties: [],
  newListings: [],
  loading: false,
  error: null,
  isDataLoaded: false,

  fetchHomeListings: async (token) => {
    // If data is already loaded, don't fetch again
    if (get().isDataLoaded) {
      return;
    }

    try {
      set({ loading: true, error: null });

      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Fetch popular properties
      const popularResponse = await axios.get(
        `${API_BASE_URL}/publications/mostPopularPublications`,
        { headers }
      );

      // Fetch new listings
      const newListingsResponse = await axios.get(
        `${API_BASE_URL}/publications/lastPublications`,
        { headers }
      );

      // Get favorites from the favorites store (only if authenticated)
      const favorites = token ? useFavoritesStore.getState().favorites : [];
      const favoriteIds = new Set(favorites.map(fav => fav.id));

      // Transform the data to match our ExpandedPropertyCard component
      const transformProperty = (property, isNewListing = false) => {
        return {
          id: property.id,
          imageUrl: property.propertyImageUrls?.[0] || '/placeholder.svg',
          images: property.propertyImageUrls || [],
          title: `${property.typeName} en ${property.neighborhood}`,
          price: `$${property.propertyPrice.toLocaleString()}`,
          location: `${property.municipality}, ${property.department}`,
          bedrooms: property.propertyBedrooms,
          floors: property.propertyFloors,
          publisherName: property.userName,
          isNew: isNewListing,
          favorited: favoriteIds.has(property.id),
          description: property.propertyDescription,
          address: property.propertyAddress,
          neighborhood: property.neighborhood,
          municipality: property.municipality,
          department: property.department,
          size: property.propertySize,
          parking: property.propertyParking,
          furnished: property.propertyFurnished,
          coordinates: {
            lat: property.latitude,
            lng: property.longitude
          },
          availableTimes: property.availableTimes || []
        };
      };

      // Check if the response data is in the expected format
      if (!Array.isArray(popularResponse.data) || !Array.isArray(newListingsResponse.data)) {
        throw new Error('Invalid response format from API');
      }

      set({
        popularProperties: popularResponse.data.map(property => transformProperty(property, false)),
        newListings: newListingsResponse.data.map(property => transformProperty(property, true)),
        loading: false,
        isDataLoaded: true
      });
    } catch (error) {
      console.error('Error in fetchHomeListings:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      let errorMessage = 'Error al cargar las publicaciones';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message === 'Invalid response format from API') {
        errorMessage = 'Formato de respuesta inválido del servidor';
      } else if (error.response?.status === 401 && token) {
        errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente';
      } else if (error.response?.status === 403) {
        errorMessage = 'No tienes permiso para acceder a estos datos';
      } else if (error.response?.status === 404) {
        errorMessage = 'No se encontraron publicaciones';
      }

      set({
        error: errorMessage,
        loading: false
      });
    }
  },

  // Add a method to force refresh the data if needed
  refreshHomeListings: async (token) => {
    set({ isDataLoaded: false });
    return get().fetchHomeListings(token);
  },

  // Update favorite status for a specific property
  updateFavoriteStatus: (propertyId, isFavorited) => {
    set((state) => ({
      popularProperties: state.popularProperties.map(property =>
        property.id === propertyId ? { ...property, favorited: isFavorited } : property
      ),
      newListings: state.newListings.map(property =>
        property.id === propertyId ? { ...property, favorited: isFavorited } : property
      )
    }));
  }
})); 