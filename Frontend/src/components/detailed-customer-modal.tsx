"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"

interface Customer {
  id: number
  name: string
  email: string
  phone: string
  ambassadorEmail: string
  totalOrders: number
  totalSpent: number
}

interface Order {
  id: number
  date: string
  products: string[]
  total: number
  status: "completed" | "processing" | "shipped"
}

// Datos de ejemplo de pedidos
const mockOrders: Order[] = [
  {
    id: 1,
    date: "2023-06-15",
    products: ["Champú Definidor de Rizos", "Acondicionador Hidratante"],
    total: 39.98,
    status: "completed",
  },
  {
    id: 2,
    date: "2023-06-20",
    products: ["Gel Potenciador de Rizos", "Crema para Peinar Sin Aclarado"],
    total: 39.98,
    status: "shipped",
  },
  {
    id: 3,
    date: "2023-06-25",
    products: ["Kit de Inicio para Cabello Rizado"],
    total: 49.99,
    status: "processing",
  },
]

interface DetailedCustomerModalProps {
  isOpen: boolean
  onClose: () => void
  customer: Customer
}

export function DetailedCustomerModal({ isOpen, onClose, customer }: DetailedCustomerModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalles del Cliente - {customer.name}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="grid gap-2">
            <div>
              <span className="font-medium">Email:</span> {customer.email}
            </div>
            <div>
              <span className="font-medium">Teléfono:</span> {customer.phone}
            </div>
            <div>
              <span className="font-medium">Embajador:</span> {customer.ambassadorEmail}
            </div>
            <div>
              <span className="font-medium">Total de pedidos:</span> {customer.totalOrders}
            </div>
            <div>
              <span className="font-medium">Total gastado:</span> ${customer.totalSpent.toFixed(2)}
            </div>
          </div>
          <h3 className="text-lg font-semibold mt-6 mb-2">Historial de Pedidos</h3>
          {mockOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">Pedido #{order.id}</h4>
                    <p className="text-sm text-muted-foreground">{order.date}</p>
                  </div>
                  <Badge
                    variant={
                      order.status === "completed" ? "default" : order.status === "shipped" ? "secondary" : "outline"
                    }
                  >
                    {order.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  {order.products.map((product, index) => (
                    <div key={index} className="text-sm">
                      {product}
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-right font-medium">Total: ${order.total.toFixed(2)}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

