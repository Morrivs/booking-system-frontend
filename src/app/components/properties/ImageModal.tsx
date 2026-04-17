import { useRef, useState } from "react";
import type { HostProperty } from "../../pages/Property/PropertyListHost";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, ImagePlus, Trash, Trash2, Upload, X } from "lucide-react";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { propertyService } from "../../services/property.service";

export function ImageModal({
  property,
  onClose,
  onSuccess,
}: {
  property: HostProperty;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview]           = useState<string | null>(null);
  const [file, setFile]                 = useState<File | null>(null);
  const [step, setStep]                 = useState<"pick" | "confirm-upload" | "confirm-delete">("pick");
  const [error, setError]               = useState<string | null>(null);
 
  const hasImage = property.images && property.images.length > 0;
  const currentImage = hasImage ? property.images?.[0]?.url : null;
 
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) return setError("El archivo debe ser una imagen.");
    if (f.size > 5 * 1024 * 1024) return setError("La imagen no puede superar los 5 MB.");
    setError(null);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };
 
  const { mutate: uploadImage, isPending: isUploading } = useMutation({
    mutationFn: () => {
      const form = new FormData();
      form.append("file", file!);
      return propertyService.uploadImage(property.id, form); // adjust
    },
    onSuccess: () => { onSuccess(); onClose(); },
    onError: () => setError("Error al subir la imagen. Intenta de nuevo."),
  });
 
  const { mutate: deleteImage, isPending: isDeleting } = useMutation({
    mutationFn: () => {
      const imageId = property.images?.[0]?.id;
      if (!imageId) throw new Error("No image ID found");
      return propertyService.deleteImage(imageId);
    },
    onSuccess: () => { onSuccess(); onClose(); },
    onError: () => setError("Error al eliminar la imagen."),
  });
 
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white text-base font-semibold tracking-tight">
              {step === "confirm-delete" ? "Eliminar imagen" : "Imagen de la propiedad"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[280px]">
              {property.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-800 border border-gray-700 text-gray-500 hover:text-gray-200 transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
 
        <div className="h-px bg-gray-800" />
 
        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl px-4 py-3">
            <AlertCircle size={13} className="shrink-0" />
            {error}
          </div>
        )}
 
        {/* ── Step: pick ── */}
        {step === "pick" && (
          <div className="space-y-4">
            {/* Current image preview */}
            <div className="relative w-full h-44 rounded-xl overflow-hidden bg-gray-800 border border-gray-700 flex items-center justify-center">
              {preview ? (
                <>
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    onClick={() => { setPreview(null); setFile(null); }}
                    className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-lg bg-gray-950/80 border border-gray-700 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                </>
              ) : currentImage ? (
                <img src={currentImage} alt={property.title} className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-600">
                  <ImagePlus size={28} className="opacity-40" />
                  <span className="text-xs">Sin imagen</span>
                </div>
              )}
            </div>
 
            {/* Upload zone */}
            <div
              onClick={() => inputRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-700 hover:border-indigo-500/50 rounded-xl p-5 flex flex-col items-center gap-2 text-gray-600 hover:text-gray-400 transition-colors cursor-pointer group"
            >
              <Upload size={20} className="group-hover:text-indigo-400 transition-colors" />
              <p className="text-xs text-center">
                <span className="text-indigo-400 font-medium">Haz click</span> para seleccionar una imagen
              </p>
              <p className="text-[10px] text-gray-600">PNG, JPG, WEBP · Máx 5 MB</p>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFile}
              />
            </div>
 
            {/* Action buttons */}
            <div className="flex gap-2">
              {/* Upload / confirm */}
              <button
                onClick={() => {
                  if (!file) return setError("Selecciona una imagen primero.");
                  setError(null);
                  setStep("confirm-upload");
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
              >
                <Upload size={14} />
                {currentImage ? "Actualizar imagen" : "Subir imagen"}
              </button>
 
              {/* Delete — only if there's an image */}
              {currentImage && !preview && (
                <button
                  onClick={() => { setError(null); setStep("confirm-delete"); }}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/10 hover:border-red-500/50 transition-all duration-200 cursor-pointer"
                >
                  <Trash size={14} />
                  Eliminar
                </button>
              )}
            </div>
          </div>
        )}
 
        {/* ── Step: confirm upload ── */}
        {step === "confirm-upload" && (
          <div className="space-y-4">
            {preview && (
              <div className="w-full h-36 rounded-xl overflow-hidden border border-gray-700">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
            <ConfirmDialog
              message={currentImage
                ? "¿Reemplazar la imagen actual con la nueva seleccionada?"
                : "¿Subir esta imagen como foto de la propiedad?"}
              confirmLabel={isUploading ? "Subiendo..." : currentImage ? "Sí, reemplazar" : "Sí, subir"}
              confirmClass="bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/25"
              onConfirm={() => uploadImage()}
              onCancel={() => setStep("pick")}
              isLoading={isUploading}
            />
          </div>
        )}
 
        {/* ── Step: confirm delete ── */}
        {step === "confirm-delete" && (
          <div className="space-y-4">
            {currentImage && (
              <div className="relative w-full h-36 rounded-xl overflow-hidden border border-red-500/20">
                <img src={currentImage} alt={property.title} className="w-full h-full object-cover opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                    <Trash2 size={18} className="text-red-400" />
                  </div>
                </div>
              </div>
            )}
            <ConfirmDialog
              message="¿Seguro que quieres eliminar la imagen de esta propiedad? Esta acción no se puede deshacer."
              confirmLabel={isDeleting ? "Eliminando..." : "Sí, eliminar imagen"}
              confirmClass="bg-red-600 hover:bg-red-500 shadow-red-500/20"
              onConfirm={() => deleteImage()}
              onCancel={() => setStep("pick")}
              isLoading={isDeleting}
            />
          </div>
        )}
      </div>
    </div>
  );
}