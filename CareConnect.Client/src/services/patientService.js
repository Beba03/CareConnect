import api from './api';

export const patientService = {

    getProfile: async () => {
        try {
            const response = await api.get('/patient/profile');
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to fetch profile'
            };
        }
    },

    updateProfile: async (profileData) => {
        try {
            const response = await api.put('/patient/profile', profileData);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to update profile'
            };
        }
    },

    changePassword: async (passwordData) => { //not implemenetd yet!
        try {
            const response = await api.put('/patient/change-password', passwordData);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to change password'
            };
        }
    },

    // ==================== ALLERGIES ====================

    getAllergies: async () => {
        try {
            const response = await api.get('/patient/allergy');
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.errors || error.response?.data?.error || 'Failed to fetch allergies'
            };
        }
    },

    addAllergy: async (allergyData) => {
        try {
            const response = await api.post('/patient/allergy', allergyData);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.errors || error.response?.data?.error || 'Failed to add allergy'
            };
        }
    },

    updateAllergy: async (allergyId, allergyData) => { //not implemenetd yet!
        try {
            const response = await api.put(`/patient/allergy/${allergyId}`, allergyData);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.errors || error.response?.data?.error || 'Failed to update allergy'
            };
        }
    },

    deleteAllergy: async (allergyId) => {
        try {
            const response = await api.delete(`/patient/allergy/${allergyId}`);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.errors || error.response?.data?.error || 'Failed to delete allergy'
            };
        }
    },

    // ==================== Medical Records ====================

    getMedicalRecords: async () => {
        try {
            const response = await api.get('/patient/medicalrecords');
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to fetch medical records'
            };
        }
    }
};