import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewService, type CreateReviewPayload } from "../../services/review.service";

// --- CONSULTAS ---

export const usePropertyReviews = (propertyId: string) => {
  return useQuery({
    queryKey: ["reviews", "property", propertyId],
    queryFn: () => reviewService.getByProperty(propertyId),
    enabled: !!propertyId,
  });
};

export const useMyReviews = () => {
  return useQuery({
    queryKey: ["reviews", "mine"],
    queryFn: reviewService.getMine,
  });
};

// --- MUTACIONES ---

export const useCreateReview = (propertyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => reviewService.create(payload),
    onSuccess: () => {
      // 1. Refrescar las reseñas de esta propiedad
      queryClient.invalidateQueries({ queryKey: ["reviews", "property", propertyId] });
      
      // 2. CRÍTICO: Refrescar la información de la propiedad 
      // porque el avgRating y reviewCount cambiaron en el backend
      queryClient.invalidateQueries({ queryKey: ["property", propertyId] });
      
      // 3. Refrescar el estado de la reserva (para que desaparezca el botón de "dejar reseña")
      queryClient.invalidateQueries({ queryKey: ["booking", propertyId] });
    },
  });
};

export const useDeleteReview = (propertyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => reviewService.remove(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", "property", propertyId] });
      queryClient.invalidateQueries({ queryKey: ["property", propertyId] });
    },
  });
};