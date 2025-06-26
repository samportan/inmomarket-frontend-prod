const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/visits`;

export const visitService = {
    async scheduleVisit(token, visitData) {
        const response = await fetch(`${API_URL}/request`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                publicationId: visitData.publicationId,
                visitDate: visitData.visitDate,
                visitTime: visitData.visitTime,
                userMessage: visitData.message
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al agendar la visita');
        }

        return data;
    },

    async getUserVisits(token) {
        const response = await fetch(`${API_URL}/my-visits`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al cargar las visitas');
        }

        return data;
    },

    async cancelVisit(token, visitId) {
        const response = await fetch(`${API_URL}/${visitId}/cancel`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al cancelar la visita');
        }

        return data;
    }
}; 