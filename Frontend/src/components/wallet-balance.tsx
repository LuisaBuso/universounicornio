import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface WalletBalanceProps {
  pais: string | null;
}

export function WalletBalance({ pais }: WalletBalanceProps) {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calcularYObtenerComision = async () => {
      const token = localStorage.getItem('access_token');
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
          setBalance(data.comision); // Actualizar el balance con la comisión obtenida
        } else {
          console.error('Error al obtener la comisión');
        }
      } catch (error) {
        console.error('Error de red', error);
      } finally {
        setLoading(false);
      }
    };

    calcularYObtenerComision();
  }, []);

  const moneda = pais === 'Mexico' ? 'MXN' : pais === 'Colombia' ? 'COP' : '$';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saldo de la billetera</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Cargando...</div>
        ) : (
          <div className="text-3xl font-bold">
            {moneda} {balance.toFixed(2)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
