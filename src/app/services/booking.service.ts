import { api } from "./api";

export interface CreateBookingPayload {
  propertyId: string;
  startDate: string;
  endDate: string;
}

export const bookingService = {

  create: async (payload: CreateBookingPayload) => {
    const res = await api.post("/bookings", payload);
    return res.data;
  },

  getMine: async () => {
    const res = await api.get("/bookings/me");
    return res.data;
  },

  // Obtener reservas de mis propiedades (como Anfitrión)
  getForHost: async () => {
    const res = await api.get("/bookings/host");
    return res.data;
  },

  // Confirmar una reserva
  confirm: async (id: string) => {
    const res = await api.patch(`/bookings/${id}/confirm`);
    return res.data;
  },

  // Rechazar una reserva
  reject: async (id: string) => {
    const res = await api.patch(`/bookings/${id}/reject`);
    return res.data;
  },

  // Cancelar reserva (Huésped)
  cancel: async (id: string) => {
    const res = await api.patch(`/bookings/${id}/cancel`);
    return res.data;
  }
  
};