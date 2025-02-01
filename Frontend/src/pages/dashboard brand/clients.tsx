import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Necesitamos useNavigate para redirigir
import { ClientStats } from "../../components/client-stats";
import { Button } from "../../components/ui/button";
import { PlusCircle } from "lucide-react";
import { AddContactForm } from "../../components/add-contact-form";
import { Modal } from "../../components/ui/modal";
import { ContactList } from "../../components/contact-list"; // No es necesario pasar contactos como prop
import { validateAndCleanToken } from "../../lib/auth"; // Importar la función de validación

export default function ClientsPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate(); // hook para navegar

  useEffect(() => {
    // Verificar y limpiar el token si no es válido
    validateAndCleanToken();

    // Verificar si el token de acceso existe en localStorage
    const token = localStorage.getItem('access_token');
    
    // Si no existe el token, redirigir al usuario a la página de login
    if (!token) {
      navigate('/'); // Redirige al inicio (login)
    }
  }, [navigate]);

  const handleAddContact = () => {
    // Este código se puede ajustar si decides manejar la lógica de agregar contactos
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <Button onClick={() => setShowAddForm(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Contacto
        </Button>
      </div>
      <ClientStats />
      {/* Solo se muestra ContactList sin necesidad de pasar los contactos */}
      <ContactList />
      {showAddForm && (
        <Modal onClose={() => setShowAddForm(false)}>
          <AddContactForm
            onAddContact={handleAddContact}
            onCancel={() => setShowAddForm(false)}
          />
        </Modal>
      )}
    </div>
  );
}