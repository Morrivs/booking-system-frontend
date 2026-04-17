import { api } from "./api"

export const propertyService = {
    async getProperties() {
        const res = await api.get('/properties');
        return res.data;
    },
    async getPropertyById(id: string) {
        const res = await api.get(`/properties/${id}`);
        return res.data;
    },
    async getMyProperties() {
        const res = await api.get('properties/my/properties');
        return res.data;
    },
    async deleteProperty(id: string) {
        const res = await api.delete(`/properties/${id}`);
        return res.data;
    },
    async create(data: FormData) {
        const res = await api.post('/properties', data, {
            headers: { 
                // Esto le dice al backend que espere un formulario con archivos
                'Content-Type': 'multipart/form-data' 
            },
        });
        return res.data;
    },
    async update(id: string, data: FormData) {
        const res = await api.patch(`/properties/${id}`, data);
        return res.data;
    },
    async uploadImage(propertyId: string, formData: FormData) {
        const res = await api.post(`/properties/${propertyId}/upload-image`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data;
    },
    async deleteImage(imageId: string) {
        const res = await api.delete(`/properties/images/${imageId}`);
        return res.data;
    },
}