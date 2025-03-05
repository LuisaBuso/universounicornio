"use client"

import { useState } from "react"
import { CustomerList } from "../../components/detailed-customer-list"
import { Input } from "../../components/ui/input"
import { Search } from "lucide-react"

export default function DetailedCustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Clientes Detallados</h1>
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar clientes..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <CustomerList searchTerm={searchTerm} />
    </div>
  )
}