import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Mail, Phone, MapPin, User } from "lucide-react";

export function ProfileInfo() {
  const [profileData, setProfileData] = useState({
    name: "",
    whatsapp: "",
    email: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error("No se encontró un token de acceso");
        }

        const response = await fetch("https://api.unicornio.tech/ambassadors", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener los datos del perfil");
        }

        const data = await response.json();
        console.log("Datos recibidos:", data);

        // Aquí los datos ya están directamente disponibles
        if (data) {
          setProfileData({
            name: data.full_name,
            whatsapp: data.whatsapp_number,
            email: data.email,
            address: data.address || "Sin dirección proporcionada",
          });
        } else {
          throw new Error("Datos del perfil mal formateados");
        }

        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Hubo un problema al cargar los datos");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información del Perfil</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <User className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium leading-none">Nombre</p>
            <p className="text-sm text-muted-foreground">{profileData.name}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Phone className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium leading-none">WhatsApp</p>
            <p className="text-sm text-muted-foreground">{profileData.whatsapp}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Mail className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium leading-none">Correo Electrónico</p>
            <p className="text-sm text-muted-foreground">{profileData.email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium leading-none">Dirección</p>
            <p className="text-sm text-muted-foreground">{profileData.address}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}