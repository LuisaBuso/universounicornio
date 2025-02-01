import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";

// Aquí añadimos la propiedad `onAddContact` que será llamada al guardar un contacto
interface AddContactFormProps {
  onCancel: () => void;
  onAddContact: (name: string, email: string, phone: string, instagram: string) => void; // Agregamos onAddContact
}

export function AddContactForm({ onCancel, onAddContact }: AddContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [instagram, setInstagram] = useState(""); // Nuevo campo para Instagram
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Obtener el token del localStorage
  const token = localStorage.getItem("access_token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    if (!token) {
      setErrorMessage("No se encontró el token de acceso.");
      setLoading(false);
      return;
    }

    try {
      // Obtener el correo del embajador autenticado (current_user)
      const responseUser = await fetch("https://api.unicornio.tech/ambassadors", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!responseUser.ok) {
        throw new Error("Error al obtener la información del usuario");
      }

      const userData = await responseUser.json();
      const ambassadorEmail = userData.email; // Correo del embajador autenticado

      // Enviar los datos del cliente al backend
      const response = await fetch("https://api.unicornio.tech/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Pasar el token en la cabecera
        },
        body: JSON.stringify({
          name,
          email,
          whatsapp_phone: phone,
          instagram,
          ref: ambassadorEmail, // Asociar el cliente al embajador autenticado
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al guardar el contacto");
      }

      setSuccessMessage("Contacto guardado exitosamente");
      onAddContact(name, email, phone, instagram); // Llamamos a la función onAddContact cuando el contacto es guardado correctamente
      setName("");
      setEmail("");
      setPhone("");
      setInstagram("");
    } catch (error: any) {
      console.error(error);
      setErrorMessage("Hubo un problema al guardar el contacto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Añadir Nuevo Contacto</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Número de Whatsapp</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram (opcional)</Label>
              <Input
                id="instagram"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Mostrar mensajes de éxito o error */}
          {successMessage && <p className="text-green-600 mt-4">{successMessage}</p>}
          {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}

          <CardFooter className="flex justify-end space-x-2 px-0 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Contacto"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
