import { useQuery } from "@tanstack/react-query";
import { propertyService } from "../services/property.service";
export const useProperties = () => {
  return useQuery({
    queryKey: ["properties"],
    queryFn: propertyService.getProperties,
    staleTime: 1000 * 60 * 5, 
  });
};

export const useProperty = (id: string) => {
  return useQuery({
    queryKey: ["property", id],
    queryFn: () => propertyService.getPropertyById(id),
    enabled: !!id,
  });
};