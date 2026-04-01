# 🏠 Booking App - Frontend

Sistema de gestión de reservas tipo Airbnb construido con un stack moderno.

## 🛠️ Tecnologías
* **Framework:** React + Vite + TypeScript
* **Estado Global:** Zustand
* **Consumo de API:** React Query (TanStack Query)
* **Estilos:** Tailwind CSS
* **Cliente HTTP:** Axios

## ✨ Características
- **Auth:** Inicio de sesión y registro con JWT.
- **Roles:** Diferenciación entre Huésped (Guest) y Anfitrión (Host).
- **Reservas:** Validación de disponibilidad en tiempo real y flujo de estados (Pendiente, Confirmado, Cancelado).
- **Dashboard:** Vista de "Mis Reservas" para huéspedes y "Gestión de Propiedades" para anfitriones.

## 🚀 Instalación

1. Clona el repo: `git clone https://github.com/tu-usuario/tu-repo.git`
2. Instala dependencias: `npm install`
3. Crea un `.env` con la URL de tu API: `VITE_API_URL=http://localhost:3000`
4. Corre el proyecto: `npm run dev`
