import type { User } from "./user";

export interface Property {
  id: string;
  title: string;
  description?: string;
  pricePerNight: number;
  avgRating: number;
  reviewCount: number;
  createdAt: Date;

  host?: User;
}