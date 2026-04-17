import { useEffect, useRef, useState } from "react";
import {
  Home as HomeIcon,
  LogIn,
  LogOut,
  User,
  CalendarDays,
  Building2,
  ChevronDown,
  Plus,
  ArrowLeft,
  ClipboardList,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";

interface NavbarProps {
  /** Muestra el botón "Nueva propiedad". Por defecto: false */
  showCreate?: boolean;
  onCreateClick?: () => void;
  /** Si se pasa, muestra un breadcrumb con botón volver + texto */
  breadcrumb?: string;
}

export function Navbar({ showCreate = false, onCreateClick, breadcrumb }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cierra el menú al hacer click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Cierra el menú al cambiar de ruta
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() ?? "?";

  const menuItems = [
    {
      icon: <CalendarDays size={15} />,
      label: "Mis reservas",
      onClick: () => navigate("/mis-reservas"),
    },
    {
      icon: <Building2 size={15} />,
      label: "Mis propiedades",
      onClick: () => navigate("/mis-propiedades"),
    },
    {
      icon: <ClipboardList size={15} />,
      label: "Mis Solicitudes",
      onClick: () => navigate("/mis-solicitudes"),
    },
  ];

  return (
    <>
    <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">

        {/* ── Logo ── */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <HomeIcon size={15} className="text-white" />
          </div>
          <span className="text-white font-semibold tracking-tight">Propiedades</span>
        </button>

        {/* ── Right side ── */}
        {user ? (
          <div className="flex items-center gap-3">

            {/* Nueva propiedad — opcional */}
            {showCreate && onCreateClick && (
              <button
                onClick={onCreateClick}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
              >
                <Plus size={15} />
                Nueva propiedad
              </button>
            )}

            {/* Avatar + dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 pl-3 border-l border-gray-800 cursor-pointer group"
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center transition-colors group-hover:border-indigo-500/50">
                  <span className="text-[11px] font-bold text-indigo-400">{initials}</span>
                </div>
                <span className="text-sm text-gray-400 hidden sm:block group-hover:text-gray-200 transition-colors">
                  {user.name ?? user.email}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-gray-600 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown */}
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">

                  {/* User info */}
                  <div className="px-4 py-3 border-b border-gray-800">
                    <p className="text-sm font-medium text-white truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>

                  {/* Menu items */}
                  <div className="p-1.5 space-y-0.5">
                    {menuItems.map(({ icon, label, onClick }) => (
                      <button
                        key={label}
                        onClick={onClick}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors duration-150 cursor-pointer text-left"
                      >
                        <span className="text-indigo-400">{icon}</span>
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Logout */}
                  <div className="p-1.5 border-t border-gray-800">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors duration-150 cursor-pointer text-left"
                    >
                      <LogOut size={15} />
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-indigo-400 transition-colors cursor-pointer"
          >
            <LogIn size={15} />
            Iniciar sesión
          </button>
        )}
      </div>
    </header>

    {/* ── Breadcrumb ── */}
    {breadcrumb && (
      <div className="border-b border-gray-800/60 bg-gray-950">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            Volver
          </button>
          <div className="h-3.5 w-px bg-gray-800" />
          <span className="text-sm text-gray-600 truncate">{breadcrumb}</span>
        </div>
      </div>
    )}
    </>
  );
}