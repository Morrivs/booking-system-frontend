// src/components/ui/StatusBadge.tsx
import { STATUS_MAP, type BookingStatus } from "../../helpers/constants/Booking";

export function StatusBadge({ status }: { status: string }) {
  // Manejo de error por si el status no existe en el mapa
  const config = STATUS_MAP[status as BookingStatus] || STATUS_MAP.PENDING;

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium w-fit ${config.className}`}>
      {config.icon}
      {config.label}
    </div>
  );
}