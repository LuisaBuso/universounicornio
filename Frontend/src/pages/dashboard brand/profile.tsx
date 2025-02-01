import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { ProfileInfo } from "../../components/profile-form";
import { Button } from "../../components/ui/button";
import { LogOut } from 'lucide-react';
import { validateAndCleanToken } from "../../lib/auth"; // Importar la función de validación

export default function ProfilePage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Estado para controlar la autenticación

  useEffect(() => {
    // Verificar y limpiar el token si no es válido
    validateAndCleanToken();

    // Verificar si el token de acceso existe en localStorage
    const token = localStorage.getItem('access_token');
    
    // Si no existe el token, redirigir al usuario a la página de login
    if (!token) {
      setIsAuthenticated(false); // Establecer el estado como no autenticado
      navigate('/'); // Redirige al login
    } else {
      setIsAuthenticated(true); // Establecer el estado como autenticado
    }
  }, [navigate]);

  const handleLogout = () => {
    // Elimina el token de localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('pais');
    
    // Actualizar el estado de autenticación y redirigir al login
    setIsAuthenticated(false);
    navigate('/'); // Redirige al login

    // Reiniciar la página
    window.location.reload(); // Recarga la página
  };

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Muestra un loader mientras se verifica la autenticación
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Perfil</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <ProfileInfo />
          {/* Botón de salir solo en dispositivos móviles */}
          <div className="mt-8 space-y-4 md:hidden">
            <Button variant="outline" className="w-full" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Salir
            </Button>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <Button className="w-full rounded-full bg-green-500 hover:bg-green-600 text-white">
            <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Ayuda por WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
}