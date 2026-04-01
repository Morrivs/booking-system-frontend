import { DollarSign, X } from "lucide-react";

export const CreatePropertyModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl bg-gray-800 border border-gray-700 text-gray-500 hover:text-gray-200 transition-colors cursor-pointer"
        >
          <X size={14} />
        </button>
 
        <h2 className="text-white text-xl font-semibold tracking-tight mb-1">
          Nueva Propiedad
        </h2>
        <p className="text-sm text-gray-500 mb-7">
          Publica tu espacio y empieza a recibir huéspedes.
        </p>
 
        <div className="space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
              Título
            </label>
            <input
              type="text"
              placeholder="Casa en la playa..."
              className="w-full bg-gray-800/60 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-600 px-4 py-3 outline-none transition-all duration-200 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 focus:bg-indigo-500/5"
            />
          </div>
 
          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
              Descripción
            </label>
            <textarea
              rows={3}
              placeholder="Describe tu propiedad..."
              className="w-full bg-gray-800/60 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-600 px-4 py-3 outline-none transition-all duration-200 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 focus:bg-indigo-500/5 resize-none"
            />
          </div>
 
          {/* Price */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
              Precio por noche (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                <DollarSign size={15} />
              </span>
              <input
                type="number"
                placeholder="150"
                min={0}
                className="w-full bg-gray-800/60 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-600 pl-10 pr-4 py-3 outline-none transition-all duration-200 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 focus:bg-indigo-500/5"
              />
            </div>
          </div>
 
          <button className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer">
            Publicar propiedad
          </button>
        </div>
      </div>
    </div>
  );
}