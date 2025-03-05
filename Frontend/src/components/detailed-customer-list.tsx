"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Eye } from "lucide-react"
import { DetailedCustomerModal } from "./detailed-customer-modal"

interface Customer {
  id: number
  name: string
  email: string
  phone: string
  ambassadorEmail: string
  totalOrders: number
  totalSpent: number
}

const customers: Customer[] = [
  {
    id: 1,
    name: "María García",
    email: "maria@example.com",
    phone: "+52 555 123 4567",
    ambassadorEmail: "ana@example.com",
    totalOrders: 5,
    totalSpent: 250.5,
  },
  {
    id: 2,
    name: "Juan Pérez",
    email: "juan@example.com",
    phone: "+52 555 987 6543",
    ambassadorEmail: "carlos@example.com",
    totalOrders: 3,
    totalSpent: 150.75,
  },
  {
    id: 3,
    name: "Laura Rodríguez",
    email: "laura@example.com",
    phone: "+52 555 456 7890",
    ambassadorEmail: "ana@example.com",
    totalOrders: 7,
    totalSpent: 375.25,
  },
]

interface DetailedCustomerListProps {
  searchTerm: string
}

export function CustomerList({ searchTerm }: DetailedCustomerListProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filteredCustomers.map((customer) => (
        <Card key={customer.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span className="text-lg font-semibold">{customer.name}</span>
              <Button variant="ghost" size="icon" onClick={() => setSelectedCustomer(customer)}>
                <Eye className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-1">
              <div className="text-sm text-muted-foreground">{customer.email}</div>
              <div className="text-sm text-muted-foreground">{customer.phone}</div>
              <div className="mt-2 flex items-center justify-between">
                <Badge variant="secondary">{customer.totalOrders} pedidos</Badge>
                <span className="text-sm font-medium">Total: ${customer.totalSpent.toFixed(2)}</span>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">Embajador: {customer.ambassadorEmail}</div>
            </div>
          </CardContent>
        </Card>
      ))}
      {selectedCustomer && (
        <DetailedCustomerModal
          customer={selectedCustomer}
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  )
}

