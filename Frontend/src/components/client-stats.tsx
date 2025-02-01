import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Users, UserPlus } from 'lucide-react';

export function ClientStats() {
  const [clientStats, setClientStats] = useState({
    totalClientesConPedido: 0, // Total de clientes con pedido
    totalContactosSinPedido: 0, // Total de contactos sin pedido
  });
  const [loading, setLoading] = useState(true); // Estado para manejar la carga

  // Efecto para obtener las estadísticas de clientes desde la API
  useEffect(() => {
    const fetchClientStats = async () => {
      const token = localStorage.getItem('access_token'); // Obtener el token de localStorage
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const response = await fetch('https://api.unicornio.tech/dashboard/metrics', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Pasar el token en la cabecera
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Actualizar el estado con los datos recibidos
          setClientStats({
            totalClientesConPedido: data.total_clientes_con_pedido,
            totalContactosSinPedido: data.total_contactos_sin_pedido,
          });
          setLoading(false); // Finalizar el estado de carga
        } else {
          console.error('Error al obtener las estadísticas de clientes');
        }
      } catch (error) {
        console.error('Error de red', error);
      }
    };

    fetchClientStats();
  }, []); // Solo se ejecuta una vez al montar el componente

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Tarjeta para Total de Clientes (con pedido) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-2xl font-bold">Cargando...</div>
          ) : (
            <div className="text-2xl font-bold">{clientStats.totalClientesConPedido}</div>
          )}
        </CardContent>
      </Card>

      {/* Tarjeta para Total de Contactos (sin pedido) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Contactos</CardTitle>
          <UserPlus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-2xl font-bold">Cargando...</div>
          ) : (
            <div className="text-2xl font-bold">{clientStats.totalContactosSinPedido}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}