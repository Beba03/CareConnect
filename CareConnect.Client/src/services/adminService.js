import api from './api';

export const adminService = {
    // ========== DOCTORS ==========

    createDoctor: async (doctorData) => {
        try {
            const response = await api.post('/admin/doctors', doctorData);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.errors || error.response?.data?.error || 'Failed to create doctor'
            };
        }
    },

    getAllDoctors: async () => {
        try {
            const response = await api.get('/admin/doctors');
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.errors || error.response?.data?.error || 'Failed to fetch doctors'
            };
        }
    },

    deleteDoctor: async (doctorId) => {
        try {
            const response = await api.delete(`/admin/doctors/${doctorId}`);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.errors || error.response?.data?.error || 'Failed to delete doctor'
            };
        }
    },

    // ========== PATIENTS ==========

    getAllPatients: async () => {
        try {
            const response = await api.get('/admin/patients');
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.errors || error.response?.data?.error || 'Failed to fetch patients'
            };
        }
    },

    deletePatient: async (patientId) => {
        try {
            const response = await api.delete(`/admin/patients/${patientId}`);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.errors || error.response?.data?.error || 'Failed to delete patient'
            };
        }
    },

    // ========== STATISTICS ==========

    getStatistics: async () => {
        try {
            const response = await api.get('/admin/stats');
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.errors || error.response?.data?.error || 'Failed to fetch statistics'
            };
        }
    }
};