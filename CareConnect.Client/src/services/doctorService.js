import api from "./api";

export const doctorService = {
    getSpecialities: async () => {
        try {
            const response = await api.get('/doctor/specializations');
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error fetching specialities:', error);
            return { success: false, error: 'Failed to load specialities' };
        }
    },

    getProfile: async () => {
        try {
            const response = await api.get('/doctor/profile');
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
            const response = await api.put('/doctor/profile', profileData);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to update profile'
            };
        }
    },

    getMyMedicalRecords: async () => {
        try {
            const response = await api.get('/doctor/medicalrecords');
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error fetching medical records:', error);
            return { success: false, error: 'Failed to load medical records' };
        }
    },

    getPatientProfile: async (patientId) => {
        try {
            const response = await api.get(`/doctor/patients/${patientId}`);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to fetch patient'
            };
        }
    },

    getPatientAllergies: async (patientId) => {
        try {
            const response = await api.get(`/doctor/patients/${patientId}/allergies`);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to fetch patient allergies'
            };
        }
    }
};