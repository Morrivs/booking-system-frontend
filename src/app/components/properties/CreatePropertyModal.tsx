import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DollarSign, X, AlertCircle, Loader2, ImagePlus, Upload } from "lucide-react";
import { propertyService } from "../../services/property.service";

const schema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().optional(),
  pricePerNight: z.coerce // Usamos coerce para asegurar que se transforme a número
    .number({ message: "Ingresa un precio válido" })
    .min(1, "El precio debe ser mayor a 0"),
});

type FormDataInputs = z.input<typeof schema>;

export const CreatePropertyModal = ({
  onClose,
  onSuccess,
  property,
}: {
  onClose: () => void;
  onSuccess?: () => void;
  property?: any;
}) => {
  const queryClient = useQueryClient();
  const isEditing = !!property;
  
  // Estado para la imagen
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(property?.images?.[0]?.url || null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormDataInputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: property?.title ?? "",
      description: property?.description ?? "",
      pricePerNight: property?.pricePerNight ?? undefined,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormDataInputs) => {
      // Creamos el FormData que llevará archivos y texto
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description || "");
      formData.append("pricePerNight", (data.pricePerNight as number).toString());
      
      if (!isEditing && selectedFile) {
        formData.append("files", selectedFile);
      }

      if (isEditing) {
        return propertyService.update(property.id, formData);
      } else {
        return propertyService.create(formData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-properties"] });
      onSuccess?.();
      onClose();
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setSelectedFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl overflow-y-auto max-h-[95vh]" onClick={(e) => e.stopPropagation()}>
        
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl bg-gray-800 border border-gray-700 text-gray-500 hover:text-gray-200 cursor-pointer">
          <X size={14} />
        </button>

        <h2 className="text-white text-xl font-semibold mb-6">
          {isEditing ? "Editar propiedad" : "Nueva propiedad"}
        </h2>

        <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-5">
          
          {/* Selector de Imagen */}
          {!isEditing && (
            <div className="space-y-1.5 animate-in fade-in duration-300">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Foto Principal
              </label>
              <div 
                onClick={() => inputRef.current?.click()}
                className="relative aspect-video rounded-xl border-2 border-dashed border-gray-700 hover:border-indigo-500/50 overflow-hidden flex flex-col items-center justify-center cursor-pointer group bg-gray-800/30 transition-all"
              >
                {preview ? (
                  <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto text-gray-600 group-hover:text-indigo-400 mb-2" size={24} />
                    <p className="text-xs text-gray-500 font-medium">Subir imagen</p>
                  </div>
                )}
                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Título</label>
            <input {...register("title")} className="w-full bg-gray-800/60 border border-gray-700 rounded-xl text-sm text-white px-4 py-3 outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10" />
            {errors.title && <p className="text-red-400 text-xs">{errors.title.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Descripción</label>
            <textarea rows={3} {...register("description")} className="w-full bg-gray-800/60 border border-gray-700 rounded-xl text-sm text-white px-4 py-3 outline-none focus:border-indigo-500/60 resize-none" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Precio por noche</label>
            <div className="relative">
              <DollarSign size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="number" {...register("pricePerNight", { valueAsNumber: true })} className="w-full bg-gray-800/60 border border-gray-700 rounded-xl text-sm text-white pl-10 pr-4 py-3 outline-none focus:border-indigo-500/60" />
            </div>
            {errors.pricePerNight && <p className="text-red-400 text-xs">{errors.pricePerNight.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isPending} 
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50"
          >
            {isPending ? <Loader2 size={18} className="animate-spin" /> : null}
            {isEditing ? "Guardar Cambios" : "Publicar Propiedad"}
          </button>
        </form>
      </div>
    </div>
  );
};