"use client"

import { useEffect } from "react";
import { useNavigate } from 'react-router-dom'; // Necesitamos useNavigate para redirigir
import { OrderList } from "../../components/order-list";
import { validateAndCleanToken } from "../../lib/auth"; // Importar la función de validación

export default function OrdersPage() {
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
      <h1 className="mb-8 text-3xl font-bold">Pedidos</h1>
      <OrderList />
    </div>
  );
}