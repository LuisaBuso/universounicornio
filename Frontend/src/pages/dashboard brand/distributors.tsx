"use client"

import { useState, useEffect } from "react"
import { DistributorList } from "../../components/distributor-list"
import { Button } from "../../components/ui/button"
import { PlusCircle, RefreshCcw } from "lucide-react"
import { AddDistributorModal } from "../../components/add-distributor-modal"
import { getValidatedToken, getValidatedPais } from "../../lib/auth"

export default function DistributorsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const token = getValidatedToken()
    const pais = getValidatedPais()

    if (!token) {
      window.location.href = "/"
    } else {
      console.log("País del usuario:", pais)
    }
  }, [])

  // Función para recargar la página y mantener la misma URL
  const handleReload = () => {
    window.location.href = "/distributors"
  }
  
  
  
  
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Distribuidores</h1>
        <div className="flex gap-4">
          <Button onClick={handleReload} variant="outline">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Recargar
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Distribuidor
          </Button>
        </div>
      </div>
      <DistributorList />
      <AddDistributorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
