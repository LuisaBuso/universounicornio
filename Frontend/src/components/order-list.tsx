import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Bell } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

export function OrderList() {
  const [orders, setOrders] = useState<any[]>([]);
  const [notifications, setNotifications] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

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
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Pedidos Recientes</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={clearNotifications}
          className="flex items-center"
        >
          <Bell className="mr-2 h-5 w-5" />
          {notifications > 0 && (
            <Badge variant="destructive" className="ml-2">
              {notifications}
            </Badge>
          )}
          <span className="hidden md:inline">Notificaciones</span>
        </Button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Cargando...</div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-500">
          No hay pedidos disponibles.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {orders.map((order, index) => (
            <Card
              key={order.transaction_id || index}
              onClick={() => setSelectedOrder(order)}
              className="cursor-pointer hover:shadow-xl transition w-full p-4"
            >
              <CardHeader>
                <CardTitle className="flex flex-col space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-lg">
                      Pedido #{index + 1}
                    </span>
                    <Badge
                      variant={
                        order.status === "pending"
                          ? "destructive"
                          : order.status === "approved"
                          ? "default"
                          : order.status === "rejected"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {order.status || "Pendiente"}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{order.nombre} {order.apellidos}</span>
                    {order.date_created && (
                      <span>{new Date(order.date_created).toLocaleDateString()}</span>
                    )}
                  </div>
                  <div className="text-xl font-semibold">
                    ${Math.round(order.total)}
                  </div>
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="w-full max-w-sm mx-auto p-4">
            <DialogHeader>
              <DialogTitle className="text-lg">Detalles del Pedido</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Cliente:</span>
                <span>{selectedOrder.nombre} {selectedOrder.apellidos}</span>
              </div>
              {selectedOrder.transaction_id && (
                <div className="flex justify-between">
                  <span className="font-medium">ID de Transacción:</span>
                  <span>{selectedOrder.transaction_id}</span>
                </div>
              )}
              {selectedOrder.date_created && (
                <div className="flex justify-between">
                  <span className="font-medium">Fecha:</span>
                  <span>{new Date(selectedOrder.date_created).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-medium">Estado:</span>
                <Badge
                  variant={
                    selectedOrder.status === "pending" || selectedOrder.status === "rejected"
                      ? "destructive"
                      : "default"
                  }
                >
                  {selectedOrder.status || "Pendiente"}
                </Badge>
              </div>
              <div className="space-y-1">
                <span className="font-medium">Productos:</span>
                {selectedOrder.productos.map((item: any, itemIndex: number) => (
                  <div key={itemIndex} className="flex justify-between">
                    <span>{item.quantity}x {item.title}</span>
                    <span>${Math.round(item.quantity * item.unit_price)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Dirección:</span>
                <span>{`${selectedOrder.direccion_calle} ${selectedOrder.numero_casa}, ${selectedOrder.localidad_ciudad}, ${selectedOrder.estado_municipio}, ${selectedOrder.pais_region}`}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${Math.round(selectedOrder.total)}</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}