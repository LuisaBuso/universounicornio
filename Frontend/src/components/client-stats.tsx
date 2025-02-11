import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Users } from 'lucide-react';

export function ClientStats() {
  const [totalClientes, setTotalClientes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientStats = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const response = await fetch('https://api.unicornio.tech/dashboard/metrics', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTotalClientes(data.total_clientes);
          setLoading(false);
        } else {
          console.error('Error al obtener las estadísticas de clientes');
        }
      } catch (error) {
        console.error('Error de red', error);
      }
    };

    fetchClientStats();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
      <Card className="max-w-xs">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-2xl font-bold">Cargando...</div>
          ) : (
            <div className="text-2xl font-bold">{totalClientes}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
