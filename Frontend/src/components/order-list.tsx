import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Bell } from "lucide-react";

export function OrderList() {
  const [orders, setOrders] = useState<any[]>([]);
  const [notifications, setNotifications] = useState(0);
  const [loading, setLoading] = useState(true);

  const clearNotifications = () => {
    setNotifications(0);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "https://api.unicornio.tech/orders-by-ambassador",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const newOrders = data.filter(
            (order: any) =>
              !orders.some(
                (existingOrder) =>
                  existingOrder.transaction_id === order.transaction_id
              )
          );

          if (newOrders.length > 0) {
            setNotifications((prev) => prev + newOrders.length);
          }
          setOrders(data);
        } else {
          console.error("Error al obtener los pedidos");
        }
      } catch (error) {
        console.error("Error de red", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Pedidos Recientes</h2>
        <Button variant="outline" size="sm" onClick={clearNotifications}>
          <Bell className="mr-2 h-4 w-4" />
          {notifications > 0 && (
            <Badge variant="destructive" className="ml-2">
              {notifications}
            </Badge>
          )}
          Limpiar Notificaciones
        </Button>
      </div>

      {loading ? (
        <div>Cargando...</div>
      ) : orders.length === 0 ? (
        <div>No hay pedidos disponibles.</div>
      ) : (
        orders.map((order, index) => (
          <Card key={order.transaction_id || index}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  Pedido #{index + 1} - {order.nombre} {order.apellidos}
                </span>
                <Badge
                  variant={
                    order.status === "pending"
                      ? "destructive"
                      : order.status === "approved"
                      ? "default"
                      : "secondary"
                  }
                >
                  {order.status || "Sin estado"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {order.productos.map((item: any, itemIndex: number) => (
                  <div key={itemIndex} className="flex justify-between text-sm">
                    <span>
                      {item.quantity}x {item.title} (${Math.round(item.unit_price)} c/u)
                    </span>
                    <span>${Math.round(item.quantity * item.unit_price)}</span>
                  </div>
                ))}
                <div className="text-sm text-gray-500 mt-2">
                  Fecha del pedido:{" "}
                  {order.date_created
                    ? new Date(order.date_created).toLocaleString()
                    : "Fecha no disponible"}
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  ID de la transacción: {order.transaction_id || "No disponible"}
                </div>
                <div className="flex justify-between font-bold mt-4">
                  <span>Total</span>
                  <span>${Math.round(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
