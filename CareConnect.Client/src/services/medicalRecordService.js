import api from './api';

export const medicalRecordService = {
    // Create medical record (Doctor only)
    createRecord: async (recordData) => {
        try {
            const response = await api.post('/medicalrecord', recordData);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.errors || error.response?.data?.error || 'Failed to create record'
            };
        }
    },

    // Get patient's medical records
    getPatientRecords: async (patientId) => {
        try {
            const response = await api.get(`/medicalrecord/patient/${patientId}`);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.errors || error.response?.data?.error || 'Failed to fetch records'
            };
        }
    },

    // Get single record by ID
    getRecordById: async (recordId) => {
        try {
            const response = await api.get(`/medicalrecord/${recordId}`);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.errors || error.response?.data?.error || 'Failed to fetch record'
            };
        }
    },

    // Update medical record (Doctor only)
    updateRecord: async (recordId, updateData) => {
        try {
            const response = await api.put(`/medicalrecord/${recordId}`, updateData);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.errors || error.response?.data?.error || 'Failed to update record'
            };
        }
    },

    // Delete medical record (Doctor only)
    deleteRecord: async (recordId) => {
        try {
            const response = await api.delete(`/medicalrecord/${recordId}`);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.errors || error.response?.data?.error || 'Failed to delete record'
            };
        }
    },

    // Add prescription to record (Doctor only)
    addPrescription: async (recordId, prescriptionData) => {
        try {
            const response = await api.post(`/medicalrecord/${recordId}/prescriptions`, prescriptionData);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.errors || error.response?.data?.error || 'Failed to add prescription'
            };
        }
    },

    // Get prescriptions for a record
    getPrescriptions: async (recordId) => {
        try {
            const response = await api.get(`/medicalrecord/${recordId}/prescriptions`);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.errors || error.response?.data?.error || 'Failed to fetch prescriptions'
            };
        }
    }
};