import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { X, Mail, Instagram, Phone } from "lucide-react";

interface Purchase {
  id: number;
  date: string;
  product: string;
  amount: number;
}

interface Order {
  id: string;
  total: number;
  status: string;
  dateCreated: string;
  products: { title: string; unitPrice: number; quantity: number }[];
}

interface Contact {
  id: number;
  name: string;
  email: string;
  instagram?: string; // Opcional
  whatsapp?: string; // Opcional
  purchaseHistory: Purchase[];
}

interface ContactDetailsProps {
  contact: Contact;
  onClose: () => void;
}

export function ContactDetails({ contact, onClose }: ContactDetailsProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        console.error("No se encontró el token de acceso");
        return;
      }
      setIsLoading(true);

      try {
        const response = await fetch(
          `https://api.unicornio.tech/orders-by-client/${contact.email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const transformedOrders = data.map((order: any) => ({
            id: order.transaction_id || "N/A",
            total: order.total,
            status: order.status || "Pendiente",
            dateCreated: order.date_created || "Desconocida",
            products: order.productos || [],
          }));
          setOrders(transformedOrders);
        } else {
          console.error("Error al obtener los pedidos");
        }
      } catch (error) {
        console.error("Error de red:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [contact.email, token]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{contact.name}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
          <span className="sr-only">Cerrar</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Información del contacto */}
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{contact.email}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Instagram className="h-4 w-4 text-muted-foreground" />
            <span>{contact.instagram || "No disponible"}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{contact.whatsapp || "No disponible"}</span>
          </div>

          {/* Historial de compras */}
          <div>
            <h3 className="font-semibold mb-2">Historial de compras</h3>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Cargando Compras...</p>
            ) : orders.length > 0 ? (
              <ul className="space-y-4">
                {orders.map((order) => (
                  <li key={order.id} className="text-sm border-b pb-4">
                    <p>
                      <span className="font-medium">Fecha:</span> {order.dateCreated}
                    </p>
                    <p>
                      <span className="font-medium">Estado:</span> {order.status}
                    </p>
                    <p>
                      <span className="font-medium">ID del Pedido:</span> {order.id}
                    </p>
                    <p>
                      <span className="font-medium">Total:</span> ${order.total && !isNaN(order.total) ? order.total.toFixed(2) : "0.00"}
                    </p>
                    <div className="mt-2">
                      <h4 className="font-semibold">Productos:</h4>
                      <ul className="pl-4 list-disc">
                        {order.products.map((product, index) => (
                          <li key={index}>
                            {product.title} - ${product.unitPrice && !isNaN(product.unitPrice) ? product.unitPrice.toFixed(2) : "0.00"} x{" "}
                            {product.quantity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No hay pedidos registrados.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
