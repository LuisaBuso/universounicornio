import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { WhatsappIcon } from "../components/icons"; // Asegúrate de tener estos íconos
import { ClipboardIcon } from "../components/icons"; // Asegúrate de tener estos íconos

interface ShareCatalogDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShareCatalogDialog({ isOpen, onClose }: ShareCatalogDialogProps) {
  const [ambassadorEmail, setAmbassadorEmail] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false); // Estado para mostrar el aviso de "Copiado"

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("No se encontró un token de acceso");

        const response = await fetch("https://api.unicornio.tech/ambassadors", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Error al obtener los datos del perfil");

        const data = await response.json();
        if (data?.email) {
          setAmbassadorEmail(data.email); // Actualiza el correo del embajador
        } else {
          throw new Error("Datos del perfil mal formateados");
        }
      } catch (error) {
        console.error("Error al obtener el perfil:", error);
      }
    };

    fetchProfileData();
  }, []);

  const catalogLink = `${window.location.origin}/catalog?ref=${encodeURIComponent(ambassadorEmail)}`;

  const shareOnWhatsApp = () => {
    const message = encodeURIComponent(
      `¡Te comparto el catálogo de Rizos Felices! Aquí puedes ver todos los productos y hacer tu pedido directo. Si necesitas ayuda para elegir lo mejor para tu cabello, dime y con gusto te asesoro.\n\n${catalogLink}`
    );
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  const shareOnInstagram = () => {
    navigator.clipboard.writeText(catalogLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500); // Ocultar aviso tras 1.5 segundos
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Compartir Catálogo</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button onClick={shareOnWhatsApp} className="flex items-center justify-center">
            <WhatsappIcon className="mr-2 h-4 w-4" />
            Compartir por WhatsApp
          </Button>
          <Button onClick={shareOnInstagram} className="relative flex items-center justify-center">
            <ClipboardIcon className="mr-2 h-4 w-4" />
            Copiar enlace
            {copied && (
              <span className="absolute -top-2 right-0 text-sm bg-gray-700 text-white px-2 py-1 rounded-xl animate-pulse">
                Copiado
              </span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}