import { useState } from "react";
import type { HostProperty } from "../../pages/Property/PropertyListHost";
import { Building2, Calendar, DollarSign, ImagePlus, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { StarRating } from "./StarRating";
import dayjs from "dayjs";
import { ImageModal } from "./ImageModal";

export function PropertyRow({
  property,
  onEdit,
  onDelete,
  onRefetch,
}: {
  property: HostProperty;
  onEdit: (p: HostProperty) => void;
  onDelete: (p: HostProperty) => void;
  onRefetch: () => void;
}) {
  const [menuOpen, setMenuOpen]       = useState(false);
  const [imageModal, setImageModal]   = useState(false);
 
  const hasImage = property.images && property.images.length > 0;
 
  return (
    <>
      <div className="group relative flex items-center gap-5 bg-gray-900 border border-gray-800 rounded-2xl px-5 py-4 transition-all duration-200 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5">
 
        {/* Image / Icon */}
        <div className="w-14 h-14 rounded-xl bg-gray-800/80 border border-gray-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {hasImage && property.images ? (
            <img
              src={property.images[0].url}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <Building2
              size={22}
              className="text-gray-600 group-hover:text-indigo-500/60 transition-colors"
            />
          )}
        </div>
 
        {/* Info */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <h3 className="text-sm font-semibold text-white truncate leading-snug">
            {property.title}
          </h3>
 
          {property.description && (
            <p className="text-xs text-gray-500 truncate">{property.description}</p>
          )}
 
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1">
              <DollarSign size={12} className="text-indigo-400" />
              <span className="text-sm font-semibold text-white">
                {property.pricePerNight.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500">/noche</span>
            </div>
            <StarRating rating={property.avgRating} count={property.reviewCount} />
            <div className="flex items-center gap-1 text-gray-600">
              <Calendar size={11} />
              <span className="text-xs">{dayjs(property.createdAt).format("DD MMM YYYY")}</span>
            </div>
          </div>
        </div>
 
        {/* Actions menu */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:text-gray-300 hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <MoreVertical size={15} />
          </button>
 
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1.5 w-48 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl shadow-black/60 overflow-hidden z-20">
                <div className="p-1">
                  <button
                    onClick={() => { setMenuOpen(false); onEdit(property); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer text-left"
                  >
                    <Pencil size={13} className="text-indigo-400" />
                    Editar propiedad
                  </button>
 
                  <button
                    onClick={() => { setMenuOpen(false); setImageModal(true); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer text-left"
                  >
                    <ImagePlus size={13} className="text-indigo-400" />
                    {hasImage ? "Actualizar imagen" : "Agregar imagen"}
                  </button>
 
                  <div className="h-px bg-gray-800 my-1" />
 
                  <button
                    onClick={() => { setMenuOpen(false); onDelete(property); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer text-left"
                  >
                    <Trash2 size={13} />
                    Eliminar propiedad
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
 
      {/* Image modal */}
      {imageModal && (
        <ImageModal
          property={property}
          onClose={() => setImageModal(false)}
          onSuccess={onRefetch}
        />
      )}
    </>
  );
}