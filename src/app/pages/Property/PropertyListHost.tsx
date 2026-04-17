import { useState } from "react";
import {
  Building2,
  Plus,
  Loader2,
  TriangleAlert,
} from "lucide-react";
import { CreatePropertyModal } from "../../components/properties/CreatePropertyModal";
import { propertyService } from "../../services/property.service"; // adjust
import { Navbar } from "../../components/common/navbar";
import { useMyProperties } from "../../hooks/useProperties";
import { PropertyRow } from "../../components/properties/PropertyRow";
import { DeletePropertyModal } from "../../components/properties/DeletePropertyModal";

export interface HostProperty {
  id: string;
  title: string;
  description?: string;
  pricePerNight: number;
  hostId: string;
  createdAt: string;
  updatedAt: string;
  avgRating: number;
  reviewCount: number;
  images?: { url: string; id: string }[];
}


// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MyProperties() {
  const [showCreate, setShowCreate] = useState(false);
  const [toDelete, setToDelete]     = useState<HostProperty | null>(null);
  const [toEdit, setToEdit]         = useState<HostProperty | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isLoading, error, refetch } = useMyProperties();

  const handleDelete = async () => {
    if (!toDelete) return;
    setIsDeleting(true);
    try {
      await propertyService.deleteProperty(toDelete.id);
      refetch();
    } finally {
      setIsDeleting(false);
      setToDelete(null);
    }
  };

  const empty = !isLoading && !error && (!data || data.length === 0);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar breadcrumb="Mis propiedades" />

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">

        {/* ── Page header ── */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Mis propiedades
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Gestiona los espacios que tienes publicados.
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <Plus size={15} />
            Nueva propiedad
          </button>
        </div>

        {/* Results count */}
        {!isLoading && !error && data && data.length > 0 && (
          <p className="text-xs text-gray-600 uppercase tracking-wider">
            <span className="text-gray-400 font-medium">{data.length}</span>{" "}
            {data.length === 1 ? "propiedad publicada" : "propiedades publicadas"}
          </p>
        )}

        {/* ── States ── */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-28 gap-4 text-gray-600">
            <Loader2 size={32} className="animate-spin text-indigo-500/50" />
            <p className="text-sm">Cargando tus propiedades...</p>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-5 py-3">
              <TriangleAlert size={15} className="shrink-0" />
              Error al cargar tus propiedades. Intenta de nuevo.
            </div>
          </div>
        )}

        {empty && (
          <div className="flex flex-col items-center justify-center py-28 gap-4 text-gray-700 bg-gray-900 border border-gray-800 rounded-2xl">
            <Building2 size={40} className="opacity-30" />
            <div className="text-center space-y-1">
              <p className="text-sm text-gray-500">Aún no tienes propiedades publicadas.</p>
              <p className="text-xs text-gray-600">Crea tu primera propiedad para empezar a recibir huéspedes.</p>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer mt-2"
            >
              <Plus size={14} />
              Crear propiedad
            </button>
          </div>
        )}

        {/* ── List ── */}
        {!isLoading && !error && data && data.length > 0 && (
          <div className="space-y-3">
            {data.map((property: any) => (
              <PropertyRow
                key={property.id}
                property={property}
                onEdit={setToEdit}
                onDelete={setToDelete}
                onRefetch={refetch}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Modals ── */}
      {showCreate && (
        <CreatePropertyModal
          onClose={() => setShowCreate(false)}
          onSuccess={() => { setShowCreate(false); refetch(); }}
        />
      )}

      {/* Edit modal — reutiliza CreatePropertyModal pasándole la propiedad */}
      {toEdit && (
        <CreatePropertyModal
          property={toEdit}
          onClose={() => setToEdit(null)}
          onSuccess={() => { setToEdit(null); refetch(); }}
        />
      )}

      {toDelete && (
        <DeletePropertyModal
          property={toDelete}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}