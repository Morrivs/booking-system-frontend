import { useState } from "react";
import dayjs from "dayjs";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Star,
  StarHalf,
  Home as HomeIcon,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  LogIn,
  DollarSign,
  Send,
  AlertCircle,
  Loader2,
  BadgeCheck,
} from "lucide-react";
import { useAuthStore } from "../../store/auth.store";
import { useProperty } from "../../hooks/useProperties";
import { useCreateReview, usePropertyReviews, useDeleteReview } from "../../hooks/review/userReview";
import { bookingService } from "../../services/booking.service";   // adjust
import { reviewService } from "../../services/review.service";     // adjust
import type { Property } from "../../models/property.model";
import type { Review } from "../../models/review.model";
import type { Booking } from "../../models/booking.model";
import { useMyBookings } from "../../hooks/booking/useBookings";
import { StarDisplay } from "../../components/properties/StarDisplay";
import { DateHelper } from "../../helpers/DateHelper";
import { ReviewForm } from "../../components/review/ReviewForm";
import { ReviewCard } from "../../components/review/ReviewCard";
import { BookingWidget } from "../../components/booking/BookingWidget";
import { Navbar } from "../../components/common/navbar";


// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  // Property
    const { data: property, isLoading: loadingProp, error: propError } = useProperty(id!);

  // User's booking for this property
    const { data: userBooking, refetch: refetchBooking } = useMyBookings(
    (all: Booking[]) => all.find((b) => String(b.propertyId) === String(id)) ?? null
    );

  // Reviews
  const { data: reviews, refetch: refetchReviews } = usePropertyReviews(id!);

  // Can the user leave a review?
  // Condition: has a confirmed booking (status=1) AND end date is in the past
  const canReview =
    !!user &&
    !!userBooking &&
    userBooking.status === 'CONFIRMED' &&
    DateHelper.isPast(userBooking.endDate) &&
    !(reviews ?? []).some((r: { userId: string; }) => r.userId === user.id);

  if (loadingProp) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-indigo-500/50" />
      </div>
    );
  }

  if (propError || !property) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-5 py-3">
          <AlertCircle size={14} />
          No se pudo cargar la propiedad.
        </div>
      </div>
    );
  }

  const hostInitials = property.host?.name
    ? property.host.name.split(" ").map((n: any[]) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ── Header ── */}
      <Navbar breadcrumb={property.title} />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left column ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Image placeholder */}
            <div className="relative h-72 bg-gray-900 border border-gray-800 rounded-2xl flex items-center justify-center overflow-hidden">
              {property.images && property.images.length > 0 ? (
                <img 
                  src={property.images[0].url} 
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <HomeIcon size={64} className="text-gray-800" />
              )}
            </div>

            {/* Title & meta */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <h1 className="text-2xl font-semibold tracking-tight text-white leading-snug">
                  {property.title}
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-500 shrink-0">
                  <Calendar size={14} />
                  Desde {DateHelper.formatDate(property.createdAt)}
                </div>
              </div>

              {/* Rating row */}
              <div className="flex items-center gap-3">
                <StarDisplay rating={property.avgRating} />
                <span className="text-sm text-gray-400 font-medium">{property.avgRating.toFixed(1)}</span>
                <span className="text-gray-700">·</span>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <MessageSquare size={13} />
                  {property.reviewCount} {property.reviewCount === 1 ? "reseña" : "reseñas"}
                </div>
              </div>

              {/* Host */}
              {property.host && (
                <div className="flex items-center gap-3 py-4 border-y border-gray-800">
                  <div className="w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-indigo-400">{hostInitials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{property.host.name}</p>
                    <p className="text-xs text-gray-500">Anfitrión</p>
                  </div>
                </div>
              )}

              {/* Description */}
              {property.description && (
                <p className="text-gray-400 text-sm leading-relaxed">
                  {property.description}
                </p>
              )}
            </div>

            {/* ── Review form (if eligible) ── */}
            {canReview && (
              <ReviewForm
                bookingId={userBooking!.id}
                propertyId={property.id}
                userId={user!.id}
                onSubmitted={() => {
                  refetchReviews();
                  queryClient.invalidateQueries({ queryKey: ["property", id] });
                }}
              />
            )}

            {/* ── Reviews list ── */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-semibold text-white">Reseñas</h2>
                {reviews && reviews.length > 0 && (
                  <span className="text-xs text-gray-500 bg-gray-800 border border-gray-700 rounded-full px-2.5 py-0.5">
                    {reviews.length}
                  </span>
                )}
              </div>

              {!reviews || reviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-700 bg-gray-900 border border-gray-800 rounded-2xl">
                  <MessageSquare size={28} className="opacity-40" />
                  <p className="text-sm">Todavía no hay reseñas para esta propiedad.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reviews.map((review:Review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Right column — Booking widget ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BookingWidget
                property={property}
                userBooking={userBooking ?? null}
                userId={user?.id ?? null}
                isHost={property.host?.id === user?.id}
                onBooked={() => refetchBooking()}
              />

              {/* Info pills */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                {[
                  { icon: <User size={13} />, label: "Anfitrión verificado" },
                  { icon: <CheckCircle size={13} />, label: "Reserva segura" },
                ].map(({ icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 text-xs text-gray-500 bg-gray-900 border border-gray-800 rounded-xl px-3 py-2.5"
                  >
                    <span className="text-indigo-400">{icon}</span>
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}