import {api} from "./api";

export interface CreateReviewPayload {
  bookingId: string;
  rating: number;
  comment?: string;
}

export const reviewService = {
  // Crear una nueva reseña
  create: async (payload: CreateReviewPayload) => {
    const res = await api.post("/reviews", payload);
    return res.data;
  },

  // Obtener reseñas de una propiedad específica
  getByProperty: async (propertyId: string) => {
    const res = await api.get(`/reviews/property/${propertyId}`);
    return res.data;
  },

  // Obtener mis propias reseñas
  getMine: async () => {
    const res = await api.get("/reviews/mine");
    return res.data;
  },

  // Eliminar una reseña
  remove: async (reviewId: string) => {
    await api.delete(`/reviews/${reviewId}`);
  }
};