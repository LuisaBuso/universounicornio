import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Bell, DollarSign, Wallet, Users } from 'lucide-react'; // Cambia Package por Wallet
import { validateAndCleanToken, getValidatedToken } from '../../lib/auth'; // Importar las funciones de autenticación

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    ventas_totales_approved: 0,
    total_clientes: 0,
    total_clientes_con_pedido: 0,
    total_contactos_sin_pedido: 0
  });
  const [walletBalance, setWalletBalance] = useState(0); // Estado para el saldo de la billetera
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [walletLoading, setWalletLoading] = useState(true); // Estado para la carga del saldo de la billetera

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

  // Efecto para obtener el saldo de la billetera
  useEffect(() => {
    const fetchWalletBalance = async () => {
      const token = getValidatedToken();
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        // 1. Calcular la comisión
        const calcularResponse = await fetch('https://api.unicornio.tech/calcular-comision', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (!calcularResponse.ok) {
          console.error('Error al calcular la comisión');
          return;
        }

        // 2. Obtener la comisión actualizada
        const obtenerResponse = await fetch('https://api.unicornio.tech/wallet/comision-actualizada', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (obtenerResponse.ok) {
          const data = await obtenerResponse.json();
          setWalletBalance(data.comision); // Actualizar el saldo de la billetera
        } else {
          console.error('Error al obtener la comisión');
        }
      } catch (error) {
        console.error('Error de red', error);
      } finally {
        setWalletLoading(false); // Finalizar el estado de carga del saldo
      }
    };

    fetchWalletBalance();
  }, []);

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
              <CardTitle className="text-sm font-medium">Billetera</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" /> {/* Cambia Package por Wallet */}
            </CardHeader>
            <CardContent>
              {walletLoading ? (
                <div>Cargando...</div>
              ) : (
                <div className="text-2xl font-bold">
                  {walletBalance > 0 ? `$${walletBalance.toFixed(2)}` : 'No hay saldo'}
                </div>
              )}
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