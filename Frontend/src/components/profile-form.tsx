import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Mail, Phone, MapPin, User } from "lucide-react";

export function ProfileInfo() {
  const [profileData, setProfileData] = useState({
    nombre: "",
    pais: "",
    whatsapp: "",
    correo_electronico: "",
    rol: "",
    address: "", // Solo para embajadores
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        let rol = localStorage.getItem("rol") || "";

        if (!token) {
          throw new Error("No se encontró un token de acceso");
        }

        rol = rol.trim();

        // Verificar si los datos ya están en el localStorage
        const storedProfileData = localStorage.getItem("profileData");
        if (storedProfileData) {
          const parsedData = JSON.parse(storedProfileData);
          setProfileData(parsedData);
          setLoading(false);
          return; // Si los datos ya están, no hacemos una nueva solicitud
        }

        let endpoint = "";
        if (rol === "Embajador") {
          endpoint = "http://127.0.0.1:8000/ambassadors";
        } else if (rol === "Negocio") {
          endpoint = "http://127.0.0.1:8000/negocios/perfil";
        } else if (rol === "Distribuidor") {
          endpoint = "http://127.0.0.1:8000/distribuidor/me"; // Nuevo endpoint para distribuidores
        } else {
          throw new Error("Rol no válido o no encontrado");
        }

        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener los datos del perfil");
        }

        const data = await response.json();
        console.log("Datos recibidos:", data);

        // Actualizar el estado con los datos correctos según el rol
        let newProfileData = {
          nombre: "",
          pais: "",
          whatsapp: "",
          correo_electronico: "",
          rol: "",
          address: "",
        };

        if (rol === "Embajador") {
          newProfileData = {
            nombre: data.full_name || "",
            pais: data.pais || "",
            whatsapp: data.whatsapp_number || "",
            correo_electronico: data.email || "",
            rol: "Embajador",
            address: data.address || "",
          };
        } else if (rol === "Negocio") {
          newProfileData = {
            nombre: data.nombre || "",
            pais: data.pais || "",
            whatsapp: data.whatsapp || "",
            correo_electronico: data.correo_electronico || "",
            rol: "Negocio",
            address: "", // Los negocios no tienen dirección
          };
        } else if (rol === "Distribuidor") {
          newProfileData = {
            nombre: data.nombre || "",
            pais: data.pais || "",
            whatsapp: data.telefono || "", // Asume que el campo es "telefono"
            correo_electronico: data.correo_electronico || "",
            rol: "Distribuidor",
            address: "", // Los distribuidores no tienen dirección
          };
        }

        // Guardar los datos en el localStorage
        localStorage.setItem("profileData", JSON.stringify(newProfileData));

        // Actualizar el estado
        setProfileData(newProfileData);
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
        <CardTitle>
          {profileData.rol === "Negocio"
            ? "Información del Negocio"
            : profileData.rol === "Distribuidor"
            ? "Información del Distribuidor"
            : "Información del Perfil"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {profileData.nombre && (
          <div className="flex items-center space-x-4">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium leading-none">Nombre</p>
              <p className="text-sm text-muted-foreground">{profileData.nombre}</p>
            </div>
          </div>
        )}
        {profileData.pais && (
          <div className="flex items-center space-x-4">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium leading-none">País</p>
              <p className="text-sm text-muted-foreground">{profileData.pais}</p>
            </div>
          </div>
        )}
        {profileData.whatsapp && (
          <div className="flex items-center space-x-4">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium leading-none">WhatsApp</p>
              <p className="text-sm text-muted-foreground">{profileData.whatsapp}</p>
            </div>
          </div>
        )}
        {profileData.correo_electronico && (
          <div className="flex items-center space-x-4">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium leading-none">Correo Electrónico</p>
              <p className="text-sm text-muted-foreground">{profileData.correo_electronico}</p>
            </div>
          </div>
        )}
        {profileData.rol === "Embajador" && profileData.address && (
          <div className="flex items-center space-x-4">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium leading-none">Dirección</p>
              <p className="text-sm text-muted-foreground">{profileData.address}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}