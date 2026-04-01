import { api } from "./api"

export const propertyService = {
    async getProperties() {
        const res = await api.get('/properties');
        return res.data;
    },
    async getPropertyById(id: string) {
        const res = await api.get(`/properties/${id}`);
        return res.data;
    }
}