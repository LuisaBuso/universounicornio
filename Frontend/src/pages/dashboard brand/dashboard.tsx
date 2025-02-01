import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Bell, DollarSign, Package, Users } from 'lucide-react';
import { validateAndCleanToken, getValidatedToken } from '../../lib/auth'; // Importar las funciones de autenticación

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    ventas_totales_approved: 0,
    total_clientes: 0,
    total_clientes_con_pedido: 0,
    total_contactos_sin_pedido: 0
  });
  const [loading, setLoading] = useState(true); // Estado para manejar la carga

  // Efecto para obtener las métricas desde la API
  useEffect(() => {
    const fetchMetrics = async () => {
      // Validar y limpiar el token antes de hacer la solicitud
      validateAndCleanToken();

      // Obtener el token validado
      const token = getValidatedToken();

      // Si no hay token, recargar la página
      if (!token) {
      console.error('No token found or token is invalid');
      window.location.reload();
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
          setMetrics(data); // Actualizar el estado con los datos recibidos
          setLoading(false); // Finalizar el estado de carga
        } else {
          console.error('Error al obtener las métricas');
        }
      } catch (error) {
        console.error('Error de red', error);
      }
    };

    fetchMetrics();
  }, []); // Solo se ejecuta una vez al montar el componente

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Panel</h1>
        <Button variant="outline" size="icon">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
        </Button>
      </div>

      {/* Si los datos están cargando, muestra un mensaje de carga */}
      {loading ? (
        <div>Cargando...</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${metrics.ventas_totales_approved}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos Pendientes</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.total_clientes}</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}