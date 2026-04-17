import { useState, useMemo } from "react";
import {
  CalendarDays,
  Loader2,
  TriangleAlert,
  SlidersHorizontal,
  Building2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { bookingService } from "../../services/booking.service"; // adjust
import { BookingCard, type BookingWithProperty } from "./BookingCard";
import { BOOKING_STATUS } from "../../helpers/constants/Booking";
import { Navbar } from "../common/navbar";

type FilterStatus = "ALL" | "PENDING" | "CONFIRMED" | "CANCELLED";

const FILTER_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: "ALL",       label: "Todas" },
  { value: "PENDING",   label: "Pendientes" },
  { value: "CONFIRMED", label: "Confirmadas" },
  { value: "CANCELLED", label: "Canceladas" },
];

// ─── Group bookings by property ───────────────────────────────────────────────
function groupByProperty(bookings: BookingWithProperty[]) {
  const map = new Map<string, { title: string; bookings: BookingWithProperty[] }>();
  for (const b of bookings) {
    const key = b.property.id;
    if (!map.has(key)) {
      map.set(key, { title: b.property.title, bookings: [] });
    }
    map.get(key)!.bookings.push(b);
  }
  return Array.from(map.entries()).map(([id, val]) => ({ id, ...val }));
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HostBookings() {
  const navigate  = useNavigate();
  const [filter, setFilter]   = useState<FilterStatus>("ALL");
  const [grouped, setGrouped] = useState(false);

  const { data, isLoading, error, refetch } = useQuery<BookingWithProperty[]>({
    queryKey: ["host-bookings"],
    queryFn: () => bookingService.getForHost(),
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    if (filter === "ALL") return data;
    return data.filter((b) => b.status === filter);
  }, [data, filter]);

  const counts = useMemo(() => {
    if (!data) return {} as Record<FilterStatus, number>;
    return {
      ALL:       data.length,
      PENDING:   data.filter((b) => b.status === BOOKING_STATUS.PENDING).length,
      CONFIRMED: data.filter((b) => b.status === BOOKING_STATUS.CONFIRMED).length,
      CANCELLED: data.filter((b) => b.status === BOOKING_STATUS.CANCELLED).length,
    };
  }, [data]);

  const groups = useMemo(() => groupByProperty(filtered), [filtered]);
  const empty  = !isLoading && !error && filtered.length === 0;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar breadcrumb="Solicitudes de reserva" />

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">

        {/* ── Page header ── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Solicitudes de reserva
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Gestiona las reservas de todas tus propiedades.
            </p>
          </div>

          {/* Pending alert */}
          {counts.PENDING > 0 && (
            <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-medium rounded-xl px-4 py-2.5">
              <CalendarDays size={14} />
              {counts.PENDING} solicitud{counts.PENDING > 1 ? "es" : ""} pendiente{counts.PENDING > 1 ? "s" : ""}
            </div>
          )}
        </div>

        {/* ── Filters + group toggle ── */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Status filters */}
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
                      filter === value
                        ? "bg-white/20 text-white"
                        : "bg-gray-800 text-gray-500"
                    }`}
                  >
                    {counts[value]}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Group by property toggle */}
          <button
            onClick={() => setGrouped((v) => !v)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 cursor-pointer ${
              grouped
                ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-400"
                : "bg-gray-900 border-gray-800 text-gray-500 hover:text-gray-300 hover:border-gray-700"
            }`}
          >
            <Building2 size={13} />
            Agrupar por propiedad
          </button>
        </div>

        {/* ── States ── */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-28 gap-4 text-gray-600">
            <Loader2 size={32} className="animate-spin text-indigo-500/50" />
            <p className="text-sm">Cargando solicitudes...</p>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-5 py-3">
              <TriangleAlert size={15} className="shrink-0" />
              Error al cargar las solicitudes. Intenta de nuevo.
            </div>
          </div>
        )}

        {empty && (
          <div className="flex flex-col items-center justify-center py-28 gap-3 text-gray-700 bg-gray-900 border border-gray-800 rounded-2xl">
            <CalendarDays size={36} className="opacity-30" />
            <div className="text-center space-y-1">
              <p className="text-sm text-gray-500">
                {filter === "ALL"
                  ? "Aún no tienes solicitudes de reserva."
                  : `No tienes solicitudes ${FILTER_OPTIONS.find((f) => f.value === filter)?.label.toLowerCase()}.`}
              </p>
              {filter !== "ALL" && (
                <button
                  onClick={() => setFilter("ALL")}
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                >
                  Ver todas las solicitudes
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── List — flat ── */}
        {!isLoading && !error && filtered.length > 0 && !grouped && (
          <div className="space-y-3">
            {filtered.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                mode="host"
                onRefetch={refetch}
                onViewProperty={(id: string) => navigate(`/properties/${id}`)}
              />
            ))}
          </div>
        )}

        {/* ── List — grouped by property ── */}
        {!isLoading && !error && filtered.length > 0 && grouped && (
          <div className="space-y-6">
            {groups.map((group) => (
              <div key={group.id} className="space-y-3">
                {/* Group header */}
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                    <Building2 size={12} className="text-indigo-400" />
                  </div>
                  <button
                    onClick={() => navigate(`/properties/${group.id}`)}
                    className="text-sm font-semibold text-gray-300 hover:text-indigo-400 transition-colors cursor-pointer truncate"
                  >
                    {group.title}
                  </button>
                  <span className="text-xs text-gray-600 bg-gray-800 border border-gray-700 rounded-full px-2 py-0.5 flex-shrink-0">
                    {group.bookings.length}
                  </span>
                  <div className="flex-1 h-px bg-gray-800" />
                </div>

                {/* Cards */}
                <div className="space-y-3 pl-2">
                  {group.bookings.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      mode="host"
                      onRefetch={refetch}
                      onViewProperty={(id:string) => navigate(`/properties/${id}`)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}