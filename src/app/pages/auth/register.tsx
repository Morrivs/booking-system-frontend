import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Mail, AlertCircle, Loader2, User } from "lucide-react";
import { authService } from "../../services/auth";
import { PasswordField } from "../../components/passwordField";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Zod schema ────────────────────────────────────────────────────────────────
const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "El nombre es requerido")
      .min(2, "Mínimo 2 caracteres"),
    email: z
      .string()
      .min(1, "El correo es requerido")
      .email("Ingresa un correo válido"),
    password: z
      .string()
      .min(1, "La contraseña es requerida")
      .min(8, "Mínimo 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

// ── Config ────────────────────────────────────────────────────────────────────
const APP_NAME = "Booker";
const APP_LOGO = null; 

// ── Component ─────────────────────────────────────────────────────────────────
export default function Register() {
  const methods = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const [serverError, setServerError] = useState<string | null>(null);

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (data: RegisterFormData) =>
      authService.register({name: data.name, email: data.email, password:data.password}),
    onSuccess: () => {
      setServerError(null);
      setTimeout(() => {
        navigate("/login");
      }, 2000); 
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message || "Ocurrió un error. Intenta de nuevo.";
      setServerError(msg);
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    setServerError(null);
    mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-10 shadow-2xl">

        {/* ── Brand header ── */}
        <div className="flex items-center gap-4 mb-8">
          {APP_LOGO ? (
            <img src={APP_LOGO} alt={APP_NAME} className="w-14 h-14 rounded-xl object-contain" />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-500/30 shrink-0">
              {APP_NAME.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-white text-xl font-semibold tracking-tight">{APP_NAME}</h1>
            <p className="text-gray-500 text-sm mt-0.5">Crea tu cuenta</p>
          </div>
        </div>

        {/* ── Alerts ── */}
        {serverError && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-6">
            <AlertCircle size={14} className="shrink-0" />
            {serverError}
          </div>
        )}
        {isSuccess && (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-xl px-4 py-3 mb-6">
            ¡Cuenta creada exitosamente! Redirigiendo...
          </div>
        )}

        {/* FormProvider exposes the form context to PasswordField */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

            {/* Name */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
                Nombre completo
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                  <User size={16} />
                </span>
                <input
                  id="name"
                  type="text"
                  placeholder="Juan Pérez"
                  autoComplete="name"
                  {...register("name")}
                  className={`w-full bg-gray-800/60 border rounded-xl text-sm text-white placeholder-gray-600 pl-10 pr-4 py-3 outline-none transition-all duration-200
                    focus:bg-indigo-500/5 focus:ring-2 focus:ring-indigo-500/40
                    ${errors.name ? "border-red-500/50 focus:ring-red-500/20" : "border-gray-700 focus:border-indigo-500/60"}`}
                />
              </div>
              {errors.name && (
                <p className="flex items-center gap-1.5 text-red-400 text-xs">
                  <AlertCircle size={12} className="shrink-0" /> {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
                Correo electrónico
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                  <Mail size={16} />
                </span>
                <input
                  id="email"
                  type="email"
                  placeholder="tu@correo.com"
                  autoComplete="email"
                  {...register("email")}
                  className={`w-full bg-gray-800/60 border rounded-xl text-sm text-white placeholder-gray-600 pl-10 pr-4 py-3 outline-none transition-all duration-200
                    focus:bg-indigo-500/5 focus:ring-2 focus:ring-indigo-500/40
                    ${errors.email ? "border-red-500/50 focus:ring-red-500/20" : "border-gray-700 focus:border-indigo-500/60"}`}
                />
              </div>
              {errors.email && (
                <p className="flex items-center gap-1.5 text-red-400 text-xs">
                  <AlertCircle size={12} className="shrink-0" /> {errors.email.message}
                </p>
              )}
            </div>

            {/* Password — with strength meter */}
            <PasswordField
              name="password"
              label="Contraseña"
              showStrength
            />

            {/* Confirm password */}
            <PasswordField
              name="confirmPassword"
              label="Confirmar contraseña"
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending || isSuccess}
              className={`w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2
                ${isSuccess
                  ? "bg-emerald-600 shadow-lg shadow-emerald-500/25"
                  : "bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0"
                }`}
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creando cuenta...
                </>
              ) : isSuccess ? (
                "¡Cuenta creada!"
              ) : (
                "Crear cuenta"
              )}
            </button>
          </form>
        </FormProvider>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-800" />
          <span className="text-xs text-gray-600 uppercase tracking-wider">o</span>
          <div className="flex-1 h-px bg-gray-800" />
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
}