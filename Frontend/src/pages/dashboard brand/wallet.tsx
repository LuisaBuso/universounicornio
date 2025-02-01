import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Necesitamos useNavigate para redirigir
import { WalletBalance } from "../../components/wallet-balance";
import { TransactionList } from "../../components/transaction-list";
import { validateAndCleanToken } from "../../lib/auth"; // Importar la función de validación

// Definir el tipo para las props
interface WalletPageProps {
  pais: string | null;
}

export default function WalletPage({ pais }: WalletPageProps) {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Mi Billetera</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-8">
          <WalletBalance pais={pais} /> {/* Pasar la prop pais aquí */}
        </div>
        <TransactionList />
      </div>
    </div>
  );
}