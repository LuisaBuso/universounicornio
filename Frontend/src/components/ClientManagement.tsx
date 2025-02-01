import { useState } from 'react'
import { Card, CardContent } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { UserPlus, Search, Filter } from 'lucide-react'
import { AddClient } from "./AddClient"

export function ClientManagement() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddClient, setShowAddClient] = useState(false)

  const clients = [
    { id: '1', name: 'Alice Johnson', email: 'alice@example.com', phone: '(123) 456-7890', lastOrder: '2023-06-01' },
    { id: '2', name: 'Bob Smith', email: 'bob@example.com', phone: '(234) 567-8901', lastOrder: '2023-05-30' },
    { id: '3', name: 'Carol Williams', email: 'carol@example.com', phone: '(345) 678-9012', lastOrder: '2023-05-28' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Client Management</h2>
        <Button onClick={() => setShowAddClient(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add New Client
        </Button>
      </div>

      <div className="flex space-x-2">
        <Input
          placeholder="Search clients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow"
        />
        <Button variant="outline">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {clients.map((client) => (
        <Card key={client.id} className="bg-[#2C2C2C] border-0">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{client.name}</h3>
                <p className="text-sm text-gray-400">Last Order: {client.lastOrder}</p>
              </div>
              <div className="space-x-2">
                <Button variant="outline" size="sm">View Profile</Button>
                <Button variant="outline" size="sm">New Order</Button>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-400">
              <p>{client.email}</p>
              <p>{client.phone}</p>
            </div>
          </CardContent>
        </Card>
      ))}

      {showAddClient && (
        <AddClient onClose={() => setShowAddClient(false)} />
      )}
    </div>
  )
}