import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingService } from "../../services/booking.service";

// --- HOOKS DE CONSULTA ---

export const useMyBookings = <T = any>(select?: (data: any) => T) => {
  return useQuery({
    queryKey: ["bookings", "me"],
    queryFn: bookingService.getMine,
    select, // <--- Aquí pasamos la función de filtrado
  });
};

export const useHostBookings = () => {
  return useQuery({
    queryKey: ["bookings", "host"],
    queryFn: bookingService.getForHost,
  });
};

// --- HOOKS DE ACCIÓN (MUTACIONES) ---

export const useBookingActions = () => {
  const queryClient = useQueryClient();

  // Función genérica para invalidar y refrescar datos
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["bookings"] });
  };

  const confirmMutation = useMutation({
    mutationFn: bookingService.confirm,
    onSuccess: invalidate,
  });

  const rejectMutation = useMutation({
    mutationFn: bookingService.reject,
    onSuccess: invalidate,
  });

  const cancelMutation = useMutation({
    mutationFn: bookingService.cancel,
    onSuccess: invalidate,
  });

  return {
    confirm: confirmMutation.mutate,
    reject: rejectMutation.mutate,
    cancel: cancelMutation.mutate,
    isProcessing: confirmMutation.isPending || rejectMutation.isPending || cancelMutation.isPending
  };
};