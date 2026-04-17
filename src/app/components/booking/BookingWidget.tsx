import { useState } from "react";
import type { Booking } from "../../models/booking.model";
import type { Property } from "../../models/property.model";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  DollarSign,
  Loader2,
  LogIn,
  XCircle,
  Check,
  X,
} from "lucide-react";
import { DateHelper } from "../../helpers/DateHelper";
import { bookingService } from "../../services/booking.service";
import { useBookingActions } from "../../hooks/booking/useBookings";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { STATUS_MAP } from "../../helpers/constants/Booking";

// ─── Price header reutilizable ────────────────────────────────────────────────
function PriceHeader({ price }: { price: number }) {
  return (
    <>
      <div className="flex items-baseline gap-1.5">
        <DollarSign size={16} className="text-indigo-400 mb-0.5" />
        <span className="text-2xl font-bold text-white">
          {price.toLocaleString()}
        </span>
        <span className="text-gray-500 text-sm">/noche</span>
      </div>
      <div className="h-px bg-gray-800" />
    </>
  );
}


// ─── Component ────────────────────────────────────────────────────────────────
export const BookingWidget = ({
  property,
  userBooking,
  userId,
  isHost,
  onBooked,
}: {
  property: Property;
  userBooking: Booking | null;
  userId: string | null;
  /** true si el usuario logueado es el anfitrión de esta propiedad */
  isHost: boolean;
  onBooked: () => void;
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Confirm dialogs
  const [pendingAction, setPendingAction] = useState<
    "confirm" | "reject" | "cancel" | null
  >(null);

  const nights =
    startDate && endDate ? DateHelper.diffDays(startDate, endDate) : 0;
  const total = nights * property.pricePerNight;

  const { confirm, reject, cancel, isProcessing } = useBookingActions();

  const { mutate: createBooking, isPending: isCreating } = useMutation({
    mutationFn: () =>
      bookingService.create({
        propertyId: property.id,
        startDate: dayjs(startDate).toString(),
        endDate: dayjs(endDate).toString(),
      }),
    onSuccess: () => {
      setSuccess(true);
      onBooked();
    },
    onError: (e: any) => {
      setError(
        e?.response?.data?.message ?? "Error al reservar. Intenta de nuevo."
      );
    },
  });

  const handleReserve = () => {
    setError(null);
    if (!startDate || !endDate)
      return setError("Selecciona las fechas de entrada y salida.");
    if (!dayjs(startDate).isBefore(dayjs(endDate)))
      return setError(
        "La fecha de salida debe ser posterior a la de entrada."
      );
    if (dayjs(startDate).isBefore(dayjs(), "day"))
      return setError("La fecha de entrada no puede ser en el pasado.");
    createBooking();
  };

  const handleAction = (action: "confirm" | "reject" | "cancel") => {
    if (!userBooking) return;
    const id = String(userBooking.id);
    if (action === "confirm") confirm(id);
    if (action === "reject") reject(id);
    if (action === "cancel") cancel(id);
    setPendingAction(null);
    onBooked(); // refetch
  };

  // ── Not logged in ────────────────────────────────────────────────────────
  if (!userId) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
        <PriceHeader price={property.pricePerNight} />
        <p className="text-sm text-gray-500 text-center">
          Inicia sesión para reservar esta propiedad.
        </p>
        <button
          onClick={() =>
            navigate("/login", { state: { from: location.pathname } })
          }
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
        >
          <LogIn size={15} />
          Iniciar sesión para reservar
        </button>
      </div>
    );
  }

  // ── Has a booking ────────────────────────────────────────────────────────
  // Guests with a cancelled booking can re-book
  const showBookingInfo = userBooking && (isHost || userBooking.status !== 'CANCELLED');
  if (showBookingInfo) {
    const status = STATUS_MAP[userBooking.status as 'PENDING' | 'CONFIRMED' | 'CANCELLED'] ?? STATUS_MAP['PENDING'];
    const isPending = userBooking.status === 'PENDING';

    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
        <PriceHeader price={property.pricePerNight} />

        <div className="space-y-3">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            {isHost ? "Solicitud de reserva" : "Tu reserva"}
          </p>

          {/* Status badge */}
          <div
            className={`flex items-center gap-2 border rounded-xl px-4 py-3 text-sm font-medium ${status.className}`}
          >
            {status.icon}
            {status.label}
          </div>

          {/* Dates & total */}
          <div className="bg-gray-800/60 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Entrada</span>
              <span className="text-gray-200 font-medium">
                {DateHelper.formatDate(userBooking.startDate)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Salida</span>
              <span className="text-gray-200 font-medium">
                {DateHelper.formatDate(userBooking.endDate)}
              </span>
            </div>
            <div className="h-px bg-gray-700" />
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Total</span>
              <span className="text-white font-semibold">
                $
                {(
                  DateHelper.diffDays(
                    userBooking.startDate,
                    userBooking.endDate
                  ) * property.pricePerNight
                ).toLocaleString()}
              </span>
            </div>
          </div>

          {/* ── HOST actions (only if pending) ── */}
          {isHost && isPending && (
            <>
              {pendingAction === "confirm" && (
                <ConfirmDialog
                  message="¿Confirmar esta reserva?"
                  onConfirm={() => handleAction("confirm")}
                  onCancel={() => setPendingAction(null)}
                  isLoading={isProcessing}
                  confirmLabel="Sí, confirmar"
                  confirmClass="bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/25 hover:shadow-emerald-500/40"
                />
              )}
              {pendingAction === "reject" && (
                <ConfirmDialog
                  message="¿Rechazar esta solicitud de reserva?"
                  onConfirm={() => handleAction("reject")}
                  onCancel={() => setPendingAction(null)}
                  isLoading={isProcessing}
                  confirmLabel="Sí, rechazar"
                  confirmClass="bg-red-600 hover:bg-red-500 shadow-red-500/25 hover:shadow-red-500/40"
                />
              )}
              {!pendingAction && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPendingAction("confirm")}
                    disabled={isProcessing}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-lg shadow-emerald-500/25 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                  >
                    <Check size={14} />
                    Confirmar
                  </button>
                  <button
                    onClick={() => setPendingAction("reject")}
                    disabled={isProcessing}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-sm font-semibold shadow-lg shadow-red-500/20 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                  >
                    <X size={14} />
                    Rechazar
                  </button>
                </div>
              )}
            </>
          )}

          {/* ── GUEST cancel (only if pending) ── */}
          {!isHost && isPending && (
            <>
              {pendingAction === "cancel" ? (
                <ConfirmDialog
                  message="¿Seguro que quieres cancelar tu reserva?"
                  onConfirm={() => handleAction("cancel")}
                  onCancel={() => setPendingAction(null)}
                  isLoading={isProcessing}
                  confirmLabel="Sí, cancelar reserva"
                  confirmClass="bg-red-600 hover:bg-red-500 shadow-red-500/25 hover:shadow-red-500/40"
                />
              ) : (
                <button
                  onClick={() => setPendingAction("cancel")}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/10 hover:border-red-500/50 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                >
                  <XCircle size={14} />
                  Cancelar reserva
                </button>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // ── Success state ────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="bg-gray-900 border border-emerald-500/20 rounded-2xl p-6">
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <CheckCircle size={36} className="text-emerald-400" />
          <p className="text-white font-semibold">¡Reserva enviada!</p>
          <p className="text-sm text-gray-500">Recibirás confirmación pronto.</p>
        </div>
      </div>
    );
  }

  // ── Booking form ─────────────────────────────────────────────────────────
  // Si el usuario logueado es el host, no puede reservar su propia propiedad
  if (isHost) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
        <PriceHeader price={property.pricePerNight} />
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          <p className="text-sm text-gray-500">Esta es tu propiedad.</p>
          <p className="text-xs text-gray-600">
            Las solicitudes de reserva aparecerán aquí.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
      <PriceHeader price={property.pricePerNight} />

      {/* Cancelled notice — shown when guest is re-booking after cancellation */}
      {userBooking?.status === 'CANCELLED' && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl px-4 py-3">
          <XCircle size={13} className="shrink-0" />
          Tu reserva anterior fue cancelada. Puedes hacer una nueva.
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl px-4 py-3">
          <AlertCircle size={13} className="shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
            Entrada
          </label>
          <div className="relative">
            <Calendar
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-gray-800/60 border border-gray-700 rounded-xl text-sm text-white pl-8 pr-3 py-2.5 outline-none transition-all duration-200 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 focus:bg-indigo-500/5 [color-scheme:dark]"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
            Salida
          </label>
          <div className="relative">
            <Calendar
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-gray-800/60 border border-gray-700 rounded-xl text-sm text-white pl-8 pr-3 py-2.5 outline-none transition-all duration-200 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 focus:bg-indigo-500/5 [color-scheme:dark]"
            />
          </div>
        </div>
      </div>

      {nights > 0 && (
        <div className="bg-gray-800/60 rounded-xl p-4 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">
              ${property.pricePerNight.toLocaleString()} × {nights} noche
              {nights > 1 ? "s" : ""}
            </span>
            <span className="text-gray-300">${total.toLocaleString()}</span>
          </div>
          <div className="h-px bg-gray-700" />
          <div className="flex items-center justify-between font-semibold">
            <span className="text-white">Total</span>
            <span className="text-white">${total.toLocaleString()}</span>
          </div>
        </div>
      )}

      <button
        onClick={handleReserve}
        disabled={isCreating}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0 transition-all duration-200 cursor-pointer"
      >
        {isCreating ? (
          <>
            <Loader2 size={15} className="animate-spin" /> Reservando...
          </>
        ) : (
          "Reservar ahora"
        )}
      </button>
      <p className="text-center text-xs text-gray-600">
        No se te cobrará nada todavía.
      </p>
    </div>
  );
};