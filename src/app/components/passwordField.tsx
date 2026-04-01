import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Eye, EyeOff, Lock, AlertCircle } from "lucide-react";

// ── Password strength ─────────────────────────────────────────────────────────
type StrengthLevel = 0 | 1 | 2 | 3 | 4;

interface StrengthInfo {
  level: StrengthLevel;
  label: string;
  color: string;
  barColor: string;
}

function getPasswordStrength(password: string): StrengthInfo {
  if (!password)
    return { level: 0, label: "", color: "text-gray-600", barColor: "bg-gray-700" };

  let score = 0;
  if (password.length >= 8)  score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { level: 1, label: "Muy débil",  color: "text-red-400",    barColor: "bg-red-500" };
  if (score === 2) return { level: 2, label: "Débil",      color: "text-orange-400", barColor: "bg-orange-500" };
  if (score === 3) return { level: 3, label: "Buena",      color: "text-yellow-400", barColor: "bg-yellow-500" };
  return               { level: 4, label: "Fuerte",     color: "text-emerald-400", barColor: "bg-emerald-500" };
}

// ── Password rules ────────────────────────────────────────────────────────────
function PasswordRules({ password }: { password: string }) {
  const rules = [
    { label: "Mínimo 8 caracteres",            met: password.length >= 8 },
    { label: "Mayúsculas y minúsculas",        met: /[A-Z]/.test(password) && /[a-z]/.test(password) },
    { label: "Al menos un número",             met: /[0-9]/.test(password) },
    { label: "Al menos un carácter especial",  met: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <ul className="space-y-1 mt-2">
      {rules.map((rule) => (
        <li
          key={rule.label}
          className={`flex items-center gap-1.5 text-xs transition-colors duration-200 ${
            rule.met ? "text-emerald-400" : "text-gray-600"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-200 ${
              rule.met ? "bg-emerald-400" : "bg-gray-700"
            }`}
          />
          {rule.label}
        </li>
      ))}
    </ul>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface PasswordFieldProps {
  /** Name of the field in the form (e.g. "password" | "confirmPassword") */
  name: string;
  /** Label shown above the input */
  label: string;
  /** Placeholder text */
  placeholder?: string;
  /** Show the strength meter and rules below the input */
  showStrength?: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────
export function PasswordField({
  name,
  label,
  placeholder = "••••••••",
  showStrength = false,
}: PasswordFieldProps) {
  const [show, setShow] = useState(false);

  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const value: string = watch(name) ?? "";
  const strength = getPasswordStrength(value);
  const error = errors[name]?.message as string | undefined;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={name}
        className="block text-xs font-medium text-gray-400 uppercase tracking-wider"
      >
        {label}
      </label>

      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
          <Lock size={16} />
        </span>
        <input
          id={name}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={name === "password" ? "new-password" : "new-password"}
          {...register(name)}
          className={`w-full bg-gray-800/60 border rounded-xl text-sm text-white placeholder-gray-600 pl-10 pr-11 py-3 outline-none transition-all duration-200
            focus:bg-indigo-500/5 focus:ring-2 focus:ring-indigo-500/40
            ${error
              ? "border-red-500/50 focus:ring-red-500/20"
              : "border-gray-700 focus:border-indigo-500/60"
            }`}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
          aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {/* Strength meter — only shown when showStrength=true and there's a value */}
      {showStrength && value && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex gap-1 flex-1">
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    bar <= strength.level ? strength.barColor : "bg-gray-800"
                  }`}
                />
              ))}
            </div>
            <span
              className={`text-xs font-medium ml-3 min-w-[70px] text-right transition-colors duration-200 ${strength.color}`}
            >
              {strength.label}
            </span>
          </div>
          <PasswordRules password={value} />
        </div>
      )}

      {/* Validation error */}
      {error && (
        <p className="flex items-center gap-1.5 text-red-400 text-xs">
          <AlertCircle size={12} className="shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}