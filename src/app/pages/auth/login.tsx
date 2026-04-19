import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Lock, Mail, AlertCircle, Loader2 } from "lucide-react";
import { authService } from "../../services/auth";
import { useAuthStore } from "../../store/auth.store";
import { useLocation, useNavigate } from "react-router-dom";

// ── Zod schema ────────────────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo es requerido")
    .email("Ingresa un correo válido"),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(6, "Mínimo 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const APP_NAME = "Booker";
const APP_LOGO = null; 

// ── Component ─────────────────────────────────────────────────────────────────
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const from =
    (location.state as any)?.from ||
    new URLSearchParams(location.search).get("from") ||
    "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const {login} = useAuthStore();

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (data: LoginFormData) =>
      authService.login(data.email, data.password),
    onSuccess: (data) => {
      setServerError(null);
      login({
        token:data.access_token,
        user:data.user
      })
      navigate(from, { replace: true });
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ||
        "Credenciales incorrectas. Intenta de nuevo.";
      setServerError(msg);
    },
  });

  const onSubmit = (data: LoginFormData) => {
    setServerError(null);
    mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-10 shadow-2xl">

        {/* ── Brand header ── */}
        <div className="flex items-center gap-4 mb-8">
          {APP_LOGO ? (
            <img
              src={APP_LOGO}
              alt={APP_NAME}
              className="w-14 h-14 rounded-xl object-contain"
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-500/30 shrink-0">
              {APP_NAME.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-white text-xl font-semibold tracking-tight">
              {APP_NAME}
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">Bienvenido de vuelta</p>
          </div>
        </div>

        {/* ── Server error ── */}
        {serverError && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-6">
            <AlertCircle size={14} className="shrink-0" />
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

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
                  ${errors.email
                    ? "border-red-500/50 focus:ring-red-500/20"
                    : "border-gray-700 focus:border-indigo-500/60"
                  }`}
              />
            </div>
            {errors.email && (
              <p className="flex items-center gap-1.5 text-red-400 text-xs">
                <AlertCircle size={12} className="shrink-0" />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
              Contraseña
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                <Lock size={16} />
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                {...register("password")}
                className={`w-full bg-gray-800/60 border rounded-xl text-sm text-white placeholder-gray-600 pl-10 pr-11 py-3 outline-none transition-all duration-200
                  focus:bg-indigo-500/5 focus:ring-2 focus:ring-indigo-500/40
                  ${errors.password
                    ? "border-red-500/50 focus:ring-red-500/20"
                    : "border-gray-700 focus:border-indigo-500/60"
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="flex items-center gap-1.5 text-red-400 text-xs">
                <AlertCircle size={12} className="shrink-0" />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Forgot password */}
          <div className="flex justify-end">
            <a href="#" className="text-xs text-gray-500 hover:text-indigo-400 transition-colors">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

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
                Verificando...
              </>
            ) : isSuccess ? (
              "¡Acceso concedido!"
            ) : (
              "Ingresar"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-800" />
          <span className="text-xs text-gray-600 uppercase tracking-wider">o</span>
          <div className="flex-1 h-px bg-gray-800" />
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500">
          ¿No tienes cuenta?{" "}
          <a href="/registrar" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
}
