import { DollarSign, HomeIcon } from "lucide-react";
import type { Property } from "../../models/property.model";
import { StarRating } from "./StarRating";
import { Link } from "react-router-dom";

export const PropertyCard = ({ property, index }: { property: Property; index: number }) => {
  const initials = property.host?.name
    ? property.host.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <article className="group flex flex-col bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden transition-all duration-200 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5">
 
      {/* Image placeholder */}
      <div className="relative h-40 bg-gray-800/60 flex items-center justify-center overflow-hidden">
        <HomeIcon size={40} className="text-gray-700 group-hover:text-gray-600 transition-colors duration-300" />
        {/* Price badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-gray-950/90 border border-gray-700 rounded-lg px-2.5 py-1.5">
          <DollarSign size={13} className="text-indigo-400" />
          <span className="text-white text-sm font-semibold">
            {property.pricePerNight.toLocaleString()}
          </span>
          <span className="text-gray-500 text-xs">/noche</span>
        </div>
      </div>
 
      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h2 className="text-white text-base font-semibold tracking-tight leading-snug">
          {property.title}
        </h2>
 
        {property.description && (
          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
            {property.description}
          </p>
        )}
 
        <StarRating rating={property.avgRating} count={property.reviewCount} />
 
        {property.host && (
          <div className="flex items-center gap-2.5 pt-3 border-t border-gray-800">
            <div className="w-7 h-7 rounded-full bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-indigo-400">{initials}</span>
            </div>
            <span className="text-xs text-gray-500">
              Anfitrión: <span className="text-gray-300 font-medium">{property.host.name}</span>
            </span>
          </div>
        )}
      </div>
 
      {/* CTA */}
      <div className="px-5 pb-5">
        <Link to={`/properties/${property.id}`}>
          <button className="w-full py-2.5 rounded-xl border border-gray-700 text-gray-400 text-sm font-medium transition-all duration-200 hover:border-indigo-500/60 hover:text-indigo-400 hover:bg-indigo-500/5 cursor-pointer">
            Ver propiedad →
          </button>
        </Link>
      </div>
    </article>
  );
}