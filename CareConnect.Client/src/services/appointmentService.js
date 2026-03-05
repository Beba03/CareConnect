import api from './api';

export const appointmentService = {
    // Book new appointment (Patient only)
    bookAppointment: async (appointmentData) => {
        try {
            const response = await api.post('/appointment', appointmentData);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.errors || error.response?.data?.error || 'Failed to book appointment'
            };
        }
    },

    // Get all appointments for current user (Patient or Doctor)
    getMyAppointments: async () => {
        try {
            const response = await api.get('/appointment');
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.errors || error.response?.data?.error || 'Failed to fetch appointments'
            };
        }
    },

    // Get single appointment by ID
    getAppointmentById: async (appointmentId) => {
        try {
            const response = await api.get(`/appointment/${appointmentId}`);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.errors || error.response?.data?.error || 'Failed to fetch appointment'
            };
        }
    },

    // Update appointment
    updateAppointment: async (appointmentId, appointmentData) => {
        try {
            const response = await api.put(`/appointment/${appointmentId}`, appointmentData);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.errors || error.response?.data?.error || 'Failed to update appointment'
            };
        }
    },

    // Cancel appointment
    cancelAppointment: async (appointmentId) => {
        try {
            const response = await api.delete(`/appointment/${appointmentId}`);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.errors || error.response?.data?.error || 'Failed to cancel appointment'
            };
        }
    }
};