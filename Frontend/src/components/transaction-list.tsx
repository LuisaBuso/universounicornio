import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface ApprovedOrder {
  status: string;
  fecha: string;
  id_transaccion: string;
  total: number;
}

export function TransactionList() {
  const [transactions, setTransactions] = useState<ApprovedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTransaction, setExpandedTransaction] = useState<number | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('No token found');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('https://api.unicornio.tech/approved-orders', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTransactions(Array.isArray(data) ? data : []);
        } else {
          console.error('Error al obtener las transacciones');
        }
      } catch (error) {
        console.error('Error de red', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const toggleDetails = (index: number) => {
    setExpandedTransaction(expandedTransaction === index ? null : index);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transacciones Aprobadas</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Cargando...</div>
        ) : transactions.length === 0 ? (
          <div>No hay transacciones aprobadas.</div>
        ) : (
          <ul className="space-y-4">
            {transactions.map((transaction, index) => (
              <li key={index} className="border p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium">Transacción #{index + 1}</span>
                  <span className={`px-2 py-1 rounded text-sm bg-green-100 text-green-800`}>
                    {transaction.status}
                  </span>
                </div>
                <button
                  className="mt-2 text-blue-500"
                  onClick={() => toggleDetails(index)}
                >
                  {expandedTransaction === index ? 'Ocultar detalles' : 'Ver detalles'}
                </button>
                {expandedTransaction === index && (
                  <div className="mt-2">
                    <div className="text-sm text-gray-500">
                      Fecha: {transaction.fecha}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID de la transacción: {transaction.id_transaccion}
                    </div>
                    <div className="text-sm text-gray-500">
                      Total: ${transaction.total.toFixed(2)}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
