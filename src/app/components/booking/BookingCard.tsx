import { useState } from "react";
import {
  Building2,
  Calendar,
  DollarSign,
  XCircle,
  Check,
  X,
  User,
  ChevronRight,
} from "lucide-react";
import dayjs from "dayjs";
import { useBookingActions } from "../../hooks/booking/useBookings";
import { BOOKING_STATUS } from "../../helpers/constants/Booking";
import { DateHelper } from "../../helpers/DateHelper";
import { StatusBadge } from "../ui/StatusBadge";
import { ConfirmDialog } from "../common/ConfirmDialog";


// ─── Types ────────────────────────────────────────────────────────────────────
export interface BookingWithProperty {
  id: string;
  userId: string;
  propertyId: string;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  property: {
    id: string;
    title: string;
    description?: string;
    pricePerNight: number;
    hostId: string;
    avgRating: number;
    reviewCount: number;
    host?: { id: string; name: string };
  };
  user?: {
    id: string;
    name?: string 
  };
}


// ─── BookingCard ──────────────────────────────────────────────────────────────
export function BookingCard({
  booking,
  mode,
  onRefetch,
  onViewProperty,
}: {
  booking: BookingWithProperty;
  mode: "guest" | "host";
  onRefetch: () => void;
  onViewProperty?: (propertyId: string) => void;
}) {
  const [pendingAction, setPendingAction] = useState<"confirm" | "reject" | "cancel" | null>(null);
  const { confirm, reject, cancel, isProcessing } = useBookingActions();

  const isPending = booking.status === BOOKING_STATUS.PENDING;  
  const nights   = DateHelper.diffDays(booking.startDate, booking.endDate);
  const total    = nights * booking.property.pricePerNight;

  const handleAction = (action: "confirm" | "reject" | "cancel") => {
    const id = booking.id;
    if (action === "confirm") confirm(id);
    if (action === "reject")  reject(id);
    if (action === "cancel")  cancel(id);
    setPendingAction(null);
    setTimeout(onRefetch, 300);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4 transition-all duration-200 hover:border-indigo-500/20">

      {/* ── Top row ── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {/* Icon */}
          <div className="w-10 h-10 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Building2 size={16} className="text-gray-600" />
          </div>

          {/* Property info */}
          <div className="min-w-0">
            <button
              onClick={() => onViewProperty?.(booking.property.id)}
              className="text-sm font-semibold text-white hover:text-indigo-400 transition-colors text-left flex items-center gap-1 group cursor-pointer"
            >
              <span className="truncate">{booking.property.title}</span>
              <ChevronRight size={13} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            {/* Host info — shown in guest mode */}
            {mode === "guest" && booking.property.host && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <User size={11} className="text-gray-600" />
                <span className="text-xs text-gray-500">
                  Anfitrión: <span className="text-gray-400">{booking.property.host.name}</span>
                </span>
              </div>
            )}

            {/* Guest info — shown in host mode */}
            {mode === "host" && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <User size={11} className="text-gray-600" />
                <span className="text-xs text-gray-500">
                  Huésped ID: <span className="text-gray-400 font-mono text-[10px]">{booking.userId.slice(0, 8)}...</span>
                </span>
              </div>
            )}

            {/* Guest info — mostrado en modo anfitrión */}
            {mode === "host" && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <User size={11} className="text-gray-600" />
                <span className="text-xs text-gray-500">
                  Huésped:{" "}
                  <span className="text-gray-200 font-medium">
                    {booking.user?.name ? (
                      booking.user.name
                    ) : (
                      <span className="text-gray-500 italic">
                        {`Usuario #${booking.userId.slice(-4)}`}
                      </span>
                    )}
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Status badge */}
        <StatusBadge status={booking.status} />
      </div>

      {/* ── Dates & price ── */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-gray-800/60 rounded-xl p-3 space-y-0.5">
          <p className="text-[10px] text-gray-600 uppercase tracking-wider font-medium">Entrada</p>
          <div className="flex items-center gap-1">
            <Calendar size={11} className="text-indigo-400" />
            <span className="text-xs text-gray-200 font-medium">
              {dayjs(booking.startDate).format("DD MMM YYYY")}
            </span>
          </div>
        </div>
        <div className="bg-gray-800/60 rounded-xl p-3 space-y-0.5">
          <p className="text-[10px] text-gray-600 uppercase tracking-wider font-medium">Salida</p>
          <div className="flex items-center gap-1">
            <Calendar size={11} className="text-indigo-400" />
            <span className="text-xs text-gray-200 font-medium">
              {dayjs(booking.endDate).format("DD MMM YYYY")}
            </span>
          </div>
        </div>
        <div className="bg-gray-800/60 rounded-xl p-3 space-y-0.5">
          <p className="text-[10px] text-gray-600 uppercase tracking-wider font-medium">
            {nights} noche{nights > 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-1">
            <DollarSign size={11} className="text-indigo-400" />
            <span className="text-xs text-white font-semibold">{total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* ── Actions ── */}

      {/* HOST: confirm / reject when pending */}
      {mode === "host" && isPending && (
        <>
          {pendingAction === "confirm" && (
            <ConfirmDialog
              message="¿Confirmar esta reserva?"
              confirmLabel="Sí, confirmar"
              confirmClass="bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20"
              onConfirm={() => handleAction("confirm")}
              onCancel={() => setPendingAction(null)}
              isLoading={isProcessing}
            />
          )}
          {pendingAction === "reject" && (
            <ConfirmDialog
              message="¿Rechazar esta solicitud?"
              confirmLabel="Sí, rechazar"
              confirmClass="bg-red-600 hover:bg-red-500 shadow-red-500/20"
              onConfirm={() => handleAction("reject")}
              onCancel={() => setPendingAction(null)}
              isLoading={isProcessing}
            />
          )}
          {!pendingAction && (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setPendingAction("confirm")}
                disabled={isProcessing}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
              >
                <Check size={13} />
                Confirmar
              </button>
              <button
                onClick={() => setPendingAction("reject")}
                disabled={isProcessing}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-semibold shadow-lg shadow-red-500/20 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
              >
                <X size={13} />
                Rechazar
              </button>
            </div>
          )}
        </>
      )}

      {/* GUEST: cancel when pending */}
      {mode === "guest" && isPending && (
        <>
          {pendingAction === "cancel" ? (
            <ConfirmDialog
              message="¿Seguro que quieres cancelar esta reserva?"
              confirmLabel="Sí, cancelar"
              confirmClass="bg-red-600 hover:bg-red-500 shadow-red-500/20"
              onConfirm={() => handleAction("cancel")}
              onCancel={() => setPendingAction(null)}
              isLoading={isProcessing}
            />
          ) : (
            <button
              onClick={() => setPendingAction("cancel")}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-500/30 text-red-400 text-xs font-medium hover:bg-red-500/10 hover:border-red-500/50 disabled:opacity-60 transition-all duration-200 cursor-pointer"
            >
              <XCircle size={13} />
              Cancelar reserva
            </button>
          )}
        </>
      )}
    </div>
  );
}