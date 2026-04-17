import { Clock, CheckCircle, XCircle } from "lucide-react";

export const BOOKING_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
} as const;

export type BookingStatus = keyof typeof BOOKING_STATUS;

export const STATUS_MAP: Record<
  BookingStatus,
  { label: string; icon: React.ReactNode; className: string }
> = {
  PENDING: {
    label: "Pendiente",
    icon: <Clock size={13} />,
    className: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  },
  CONFIRMED: {
    label: "Confirmada",
    icon: <CheckCircle size={13} />,
    className: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  CANCELLED: {
    label: "Cancelada",
    icon: <XCircle size={13} />,
    className: "text-red-400 bg-red-500/10 border-red-500/20",
  },
};