import { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  Plus,
  Home as HomeIcon,
  TriangleAlert,
  Loader2,
  User,
  LogIn,
} from "lucide-react";
import { useProperties } from "../../hooks/useProperties";
import type { Property } from "../../models/property.model";
import { useAuthStore } from "../../store/auth.store";
import { PropertyCard } from "../../components/properties/PropertyCart";
import { CreatePropertyModal } from "../../components/properties/CreatePropertyModal";
import { Navbar } from "../../components/common/navbar";


export default function Home() {
  const { data, isLoading, error } = useProperties();
  const { user } = useAuthStore();
 
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "rating" | "price">("newest");
  const [showModal, setShowModal] = useState(false);
 
  const filtered = useMemo(() => {
    if (!data) return [];
    let list = [...data];
 
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p: Property) =>
          p.title.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }
 
    if (sortBy === "price") list.sort((a, b) => a.pricePerNight - b.pricePerNight);
    else if (sortBy === "rating") list.sort((a, b) => b.avgRating - a.avgRating);
    else list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
 
    return list;
  }, [data, search, sortBy]);
 
  return (
    <div className="min-h-screen bg-gray-950 text-white">
 
      {/* ── Header ── */}
      <Navbar 
        showCreate={!!user} 
        onCreateClick={() => setShowModal(true)} 
      />
 
      <main className="max-w-6xl mx-auto px-6 py-10">
 
        {/* ── Page title ── */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Explorar propiedades
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Descubre espacios únicos para cada ocasión.
          </p>
        </div>
 
        {/* ── Toolbar ── */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px]">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
              <Search size={15} />
            </span>
            <input
              type="text"
              placeholder="Buscar propiedades..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-600 pl-10 pr-4 py-3 outline-none transition-all duration-200 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 focus:bg-indigo-500/5"
            />
          </div>
 
          {/* Sort */}
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-gray-500 pointer-events-none">
              <SlidersHorizontal size={14} />
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-gray-900 border border-gray-800 rounded-xl text-sm text-gray-400 pl-9 pr-4 py-3 outline-none transition-all duration-200 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer"
            >
              <option value="newest">Más recientes</option>
              <option value="rating">Mejor valoradas</option>
              <option value="price">Menor precio</option>
            </select>
          </div>
        </div>
 
        {/* Results count */}
        {!isLoading && !error && (
          <p className="text-xs text-gray-600 mb-5 uppercase tracking-wider">
            <span className="text-gray-400 font-medium">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "propiedad encontrada" : "propiedades encontradas"}
          </p>
        )}
 
        {/* ── Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
 
          {isLoading && (
            <div className="col-span-full flex flex-col items-center justify-center py-28 gap-4 text-gray-600">
              <Loader2 size={32} className="animate-spin text-indigo-500/50" />
              <p className="text-sm">Cargando propiedades...</p>
            </div>
          )}
 
          {error && (
            <div className="col-span-full flex flex-col items-center justify-center py-28 gap-3">
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-5 py-3">
                <TriangleAlert size={15} className="shrink-0" />
                Error al cargar las propiedades. Intenta de nuevo.
              </div>
            </div>
          )}
 
          {!isLoading && !error && filtered.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-28 gap-3 text-gray-600">
              <HomeIcon size={36} className="opacity-20" />
              <p className="text-sm">
                {search ? `Sin resultados para "${search}"` : "No hay propiedades disponibles"}
              </p>
            </div>
          )}
 
        {!isLoading &&
          !error &&
          filtered.map((property: Property, i: number) => (
            <PropertyCard key={property.id} property={property} index={i} />
          ))}
        </div>
      </main>
 
      {/* ── Modal ── */}
      {showModal && <CreatePropertyModal onClose={() => setShowModal(false)} />}
    </div>
  );
}