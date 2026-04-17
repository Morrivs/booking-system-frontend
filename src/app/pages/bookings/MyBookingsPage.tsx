import {  CalendarDays, Loader2, SlidersHorizontal, TriangleAlert } from "lucide-react";
import { BookingCard, type BookingWithProperty } from "../../components/booking/BookingCard";
import { useNavigate } from "react-router-dom";
import { use, useMemo, useState } from "react";
import { useMyBookings } from "../../hooks/booking/useBookings";
import { BOOKING_STATUS } from "../../helpers/constants/Booking";
import { Navbar } from "../../components/common/navbar";

type FilterStatus = "ALL" | "PENDING" | "CONFIRMED" | "CANCELLED";
 
const FILTER_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: "ALL",       label: "Todas" },
  { value: "PENDING",   label: "Pendientes" },
  { value: "CONFIRMED", label: "Confirmadas" },
  { value: "CANCELLED", label: "Canceladas" },
];
 
export default function MyBookings() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterStatus>("ALL");
 
  const { data, isLoading, error, refetch } = useMyBookings(); 
 
  const filtered = useMemo(() => {
    if (!data) return [];
    if (filter === "ALL") return data;
    return data.filter((b: { status: string; }) => b.status === filter);
  }, [data, filter]);
 
  const counts = useMemo(() => {
    if (!data) return {} as Record<FilterStatus, number>;
    return {
      ALL:       data.length,
      PENDING:   data.filter((b: { status: string; }) => b.status === BOOKING_STATUS.PENDING).length,
      CONFIRMED: data.filter((b: { status: string; }) => b.status === BOOKING_STATUS.CONFIRMED).length,
      CANCELLED: data.filter((b: { status: string; }) => b.status === BOOKING_STATUS.CANCELLED).length,
    };
  }, [data]);
 
  const empty = !isLoading && !error && filtered.length === 0;
 
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar breadcrumb="Mis reservas" />
 
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">
 
        {/* ── Page header ── */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Mis reservas
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Historial y estado de todas tus reservas.
          </p>
        </div>
 
        {/* ── Filter tabs ── */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <SlidersHorizontal size={13} className="text-gray-600 mr-1" />
          {FILTER_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                filter === value
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                  : "bg-gray-900 border border-gray-800 text-gray-500 hover:text-gray-300 hover:border-gray-700"
              }`}
            >
              {label}
              {counts[value] > 0 && (
                <span
                  className={`text-[10px] rounded-full px-1.5 py-0.5 font-semibold ${
                    filter === value ? "bg-white/20 text-white" : "bg-gray-800 text-gray-500"
                  }`}
                >
                  {counts[value]}
                </span>
              )}
            </button>
          ))}
        </div>
 
        {/* ── States ── */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-28 gap-4 text-gray-600">
            <Loader2 size={32} className="animate-spin text-indigo-500/50" />
            <p className="text-sm">Cargando tus reservas...</p>
          </div>
        )}
 
        {error && (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-5 py-3">
              <TriangleAlert size={15} className="shrink-0" />
              Error al cargar tus reservas. Intenta de nuevo.
            </div>
          </div>
        )}
 
        {empty && (
          <div className="flex flex-col items-center justify-center py-28 gap-3 text-gray-700 bg-gray-900 border border-gray-800 rounded-2xl">
            <CalendarDays size={36} className="opacity-30" />
            <div className="text-center space-y-1">
              <p className="text-sm text-gray-500">
                {filter === "ALL"
                  ? "Aún no tienes reservas."
                  : `No tienes reservas ${FILTER_OPTIONS.find(f => f.value === filter)?.label.toLowerCase()}.`}
              </p>
              {filter !== "ALL" && (
                <button
                  onClick={() => setFilter("ALL")}
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                >
                  Ver todas las reservas
                </button>
              )}
            </div>
          </div>
        )}
 
        {/* ── List ── */}
        {!isLoading && !error && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map((booking: BookingWithProperty) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                mode="guest"
                onRefetch={refetch}
                onViewProperty={(id) => navigate(`/properties/${id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}